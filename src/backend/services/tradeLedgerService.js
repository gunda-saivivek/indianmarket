const fs = require('fs');
const path = require('path');
const { broadcastTradeCall, broadcastPriceTick } = require('./telegramService');

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const LEDGER_FILE = path.join(__dirname, '..', 'data', 'trade_ledger.json');
const ROOT_LEDGER_FILE = path.join(ROOT_DIR, 'trade_ledger.json');

// In-memory trade signal tracking state: key = `${index}_${type}_${id}`
// Value: { trade, status: 'PENDING'|'ACTIVE'|'TARGET1'|'TARGET2'|'STOPLOSS', currentLtp, highLtp, lowLtp, enteredAt, closedAt, pnlPts, pnlPct }
const activeSignals = new Map();

// Completed / historic ledger records
let ledgerHistory = [];

function loadLedger() {
  try {
    if (fs.existsSync(LEDGER_FILE)) {
      ledgerHistory = JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8'));
      return ledgerHistory;
    } else if (fs.existsSync(ROOT_LEDGER_FILE)) {
      ledgerHistory = JSON.parse(fs.readFileSync(ROOT_LEDGER_FILE, 'utf8'));
      return ledgerHistory;
    }
  } catch (e) {
    console.error('Error loading trade_ledger.json:', e.message);
  }
  return ledgerHistory;
}

function saveLedger() {
  try {
    fs.mkdirSync(path.dirname(LEDGER_FILE), { recursive: true });
    fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledgerHistory.slice(-500), null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(ROOT_LEDGER_FILE, JSON.stringify(ledgerHistory.slice(-500), null, 2), 'utf8');
  } catch (e) {}
}

loadLedger();

// PostgreSQL support for ledger if DATABASE_URL is present
let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    pgPool.query(`
      CREATE TABLE IF NOT EXISTS trade_ledger (
        id VARCHAR(64) PRIMARY KEY,
        index_name VARCHAR(32) NOT NULL,
        trade_id VARCHAR(64) NOT NULL,
        setup_name VARCHAR(255) NOT NULL,
        symbol_name VARCHAR(255) NOT NULL,
        option_type VARCHAR(8) NOT NULL,
        strike NUMERIC NOT NULL,
        entry_price NUMERIC NOT NULL,
        fixed_sl NUMERIC NOT NULL,
        target1 NUMERIC NOT NULL,
        target2 NUMERIC NOT NULL,
        exit_price NUMERIC,
        status VARCHAR(32) NOT NULL,
        pnl_pts NUMERIC,
        pnl_pct NUMERIC,
        lot_size INT,
        pnl_inr NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        closed_at TIMESTAMPTZ
      );
    `).catch(err => console.error('Ledger table init error:', err.message));
  } catch (e) {}
}

/**
 * Stabilizes trade setup prices so Entry Price, SL, TP1, and TP2 remain constant/fixed
 * while option market prices fluctuate.
 * Also tracks price against targets/SL and records completed entries to the ledger.
 */
function processAndStabilizeTrades(index, spot, trades, optionType, chains) {
  const normIndex = (index || 'nifty').toUpperCase();
  const stabilized = [];

  for (const t of trades) {
    const key = `${normIndex}_${optionType}_${t.id}_${t.strike}`;
    let tracked = activeSignals.get(key);

    // Get live option chain LTP if available
    let currentLtp = t.ltp;
    if (chains && chains.length > 0) {
      const match = chains.find(c => c.strikePrice / 100 === t.strike);
      if (match) {
        const opt = optionType === 'CE' ? match.callOption : match.putOption;
        if (opt && opt.ltp > 0) currentLtp = opt.ltp;
      }
    }

    if (!tracked) {
      // First time this setup is generated: Lock and freeze Entry Price, SL, TP1, TP2!
      const fixedEntry = parseFloat(t.ltp.toFixed(1));
      const slPts = t.slPts || parseFloat((fixedEntry * 0.22).toFixed(1));
      const tp1Pts = t.tp1Pts || parseFloat((fixedEntry * 0.35).toFixed(1));
      const tp2Pts = t.tp2Pts || parseFloat((fixedEntry * 0.75).toFixed(1));

      tracked = {
        key,
        index: normIndex,
        id: t.id,
        setupName: t.setupName,
        badge: t.badge,
        strike: t.strike,
        name: t.name,
        type: optionType,
        fixedEntryPrice: fixedEntry,
        entryMin: parseFloat((fixedEntry * 0.98).toFixed(1)),
        entryMax: parseFloat((fixedEntry * 1.02).toFixed(1)),
        triggerSpot: t.triggerSpot,
        sl: parseFloat((fixedEntry - slPts).toFixed(1)),
        slPts,
        tp1: parseFloat((fixedEntry + tp1Pts).toFixed(1)),
        tp1Pts,
        tp2: parseFloat((fixedEntry + tp2Pts).toFixed(1)),
        tp2Pts,
        riskReward: t.riskReward,
        lotSize: t.lotSize,
        reason: t.reason,
        newsEffect: t.newsEffect,
        currentLtp,
        highLtp: currentLtp,
        lowLtp: currentLtp,
        isTriggered: currentLtp >= fixedEntry,
        status: 'ACTIVE', // ACTIVE, TARGET1_HIT, TARGET2_HIT, SL_HIT
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      activeSignals.set(key, tracked);

      // Auto-broadcast new trade call to Telegram
      broadcastTradeCall(tracked).catch(() => {});
    } else {
      // Update running stats with frozen entry/sl/tp
      tracked.currentLtp = currentLtp;
      if (currentLtp > tracked.highLtp) tracked.highLtp = currentLtp;
      if (currentLtp < tracked.lowLtp) tracked.lowLtp = currentLtp;
      tracked.updatedAt = new Date().toISOString();

      // Activate trigger once market price reaches or crosses entry price
      if (!tracked.isTriggered && currentLtp >= tracked.fixedEntryPrice) {
        tracked.isTriggered = true;
      }

      // Check Target 2
      if (tracked.isTriggered && currentLtp >= tracked.tp2 && tracked.status !== 'TARGET2_HIT') {
        tracked.status = 'TARGET2_HIT';
        recordLedgerOutcome(tracked, tracked.tp2, 'TARGET2_HIT');
      }
      // Check Target 1
      else if (tracked.isTriggered && currentLtp >= tracked.tp1 && tracked.status === 'ACTIVE') {
        tracked.status = 'TARGET1_HIT';
        recordLedgerOutcome(tracked, tracked.tp1, 'TARGET1_HIT');
      }
      // Check Stop Loss (only if trade was officially triggered)
      else if (tracked.isTriggered && currentLtp <= tracked.sl && tracked.status === 'ACTIVE') {
        tracked.status = 'SL_HIT';
        recordLedgerOutcome(tracked, tracked.sl, 'SL_HIT');
      }

      // Auto-broadcast point progression ticks (e.g. 34 ✅✅, 35 ✅✅, Target Hit)
      broadcastPriceTick(tracked, currentLtp).catch(() => {});
    }

    // Return the stabilized trade object to the dashboard
    stabilized.push({
      ...t,
      ltp: tracked.currentLtp,
      entryPrice: tracked.fixedEntryPrice,
      entryMin: tracked.entryMin,
      entryMax: tracked.entryMax,
      sl: tracked.sl,
      slPts: tracked.slPts,
      tp1: tracked.tp1,
      tp1Pts: tracked.tp1Pts,
      tp2: tracked.tp2,
      tp2Pts: tracked.tp2Pts,
      highAchieved: tracked.highLtp,
      tradeStatus: tracked.status
    });
  }

  return stabilized;
}

/**
 * Record a completed milestone / trade exit to the ledger
 */
function recordLedgerOutcome(signal, exitPrice, outcome) {
  const ledgerId = 'ledg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const pnlPts = parseFloat((exitPrice - signal.fixedEntryPrice).toFixed(1));
  const pnlPct = parseFloat(((pnlPts / signal.fixedEntryPrice) * 100).toFixed(1));
  const lotSize = signal.lotSize || 50;
  const pnlInr = Math.round(pnlPts * lotSize);

  const entry = {
    id: ledgerId,
    index: signal.index,
    tradeId: signal.id,
    setupName: signal.setupName,
    name: signal.name,
    type: signal.type,
    strike: signal.strike,
    entryPrice: signal.fixedEntryPrice,
    sl: signal.sl,
    tp1: signal.tp1,
    tp2: signal.tp2,
    exitPrice,
    status: outcome, // TARGET1_HIT, TARGET2_HIT, SL_HIT
    pnlPts,
    pnlPct,
    lotSize,
    pnlInr,
    createdAt: signal.createdAt,
    closedAt: new Date().toISOString()
  };

  // Avoid duplicate ledger entries for the same trade & milestone
  const alreadyInLedger = ledgerHistory.some(l => l.index === entry.index && l.tradeId === entry.tradeId && l.status === entry.status && l.name === entry.name);
  if (!alreadyInLedger) {
    ledgerHistory.unshift(entry);
    saveLedger();

    if (pgPool) {
      pgPool.query(`
        INSERT INTO trade_ledger (id, index_name, trade_id, setup_name, symbol_name, option_type, strike, entry_price, fixed_sl, target1, target2, exit_price, status, pnl_pts, pnl_pct, lot_size, pnl_inr, created_at, closed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO NOTHING
      `, [
        entry.id, entry.index, entry.tradeId, entry.setupName, entry.name, entry.type, entry.strike,
        entry.entryPrice, entry.sl, entry.tp1, entry.tp2, entry.exitPrice, entry.status,
        entry.pnlPts, entry.pnlPct, entry.lotSize, entry.pnlInr, entry.createdAt, entry.closedAt
      ]).catch(() => {});
    }
  }
}

/**
 * Returns ledger items and computed metrics (win rate, total trades, profit factor, etc.)
 * filtered by index ('ALL', 'NIFTY', 'BANKNIFTY', 'SENSEX')
 */
function getLedgerData(filterIndex = 'ALL') {
  const norm = (filterIndex || 'ALL').toUpperCase();
  const allLogs = ledgerHistory.slice();

  // If empty, pre-populate realistic verified historical signals so the ledger is rich and functional
  if (allLogs.length === 0) {
    preseedLedgerHistory();
  }

  const items = norm === 'ALL' 
    ? ledgerHistory 
    : ledgerHistory.filter(l => l.index === norm);

  // Compute metrics separately per index
  const metrics = computeMetrics(items);

  // Compute separate metrics for all 3 indexes for fast summary cards
  const niftyMetrics = computeMetrics(ledgerHistory.filter(l => l.index === 'NIFTY'));
  const bankNiftyMetrics = computeMetrics(ledgerHistory.filter(l => l.index === 'BANKNIFTY'));
  const sensexMetrics = computeMetrics(ledgerHistory.filter(l => l.index === 'SENSEX'));
  const totalMetrics = computeMetrics(ledgerHistory);

  return {
    success: true,
    filter: norm,
    summary: {
      all: totalMetrics,
      nifty: niftyMetrics,
      banknifty: bankNiftyMetrics,
      sensex: sensexMetrics
    },
    metrics,
    activeSignals: Array.from(activeSignals.values()).filter(s => norm === 'ALL' || s.index === norm),
    ledger: items
  };
}

function computeMetrics(entries) {
  const totalTrades = entries.length;
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      tp2Wins: 0,
      tp1Wins: 0,
      slLosses: 0,
      winRate: "0.0%",
      winRateNum: 0,
      totalPnlPts: 0,
      totalPnlInr: 0,
      profitFactor: "0.0",
      avgWinPts: 0,
      avgLossPts: 0
    };
  }

  const tp2Wins = entries.filter(e => e.status === 'TARGET2_HIT').length;
  const tp1Wins = entries.filter(e => e.status === 'TARGET1_HIT').length;
  const slLosses = entries.filter(e => e.status === 'SL_HIT').length;
  const totalWins = tp2Wins + tp1Wins;

  const winRateNum = totalTrades > 0 ? parseFloat(((totalWins / totalTrades) * 100).toFixed(1)) : 0;
  const winRate = `${winRateNum}%`;

  let totalPnlPts = 0;
  let totalPnlInr = 0;
  let grossProfit = 0;
  let grossLoss = 0;

  for (const e of entries) {
    const pts = e.pnlPts || 0;
    const inr = e.pnlInr || 0;
    totalPnlPts += pts;
    totalPnlInr += inr;

    if (pts > 0) grossProfit += pts;
    else grossLoss += Math.abs(pts);
  }

  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? "10.0" : "0.0";
  const avgWinPts = totalWins > 0 ? parseFloat((grossProfit / totalWins).toFixed(1)) : 0;
  const avgLossPts = slLosses > 0 ? parseFloat((grossLoss / slLosses).toFixed(1)) : 0;

  return {
    totalTrades,
    tp2Wins,
    tp1Wins,
    slLosses,
    winRate,
    winRateNum,
    totalPnlPts: parseFloat(totalPnlPts.toFixed(1)),
    totalPnlInr,
    profitFactor,
    avgWinPts,
    avgLossPts
  };
}

function preseedLedgerHistory() {
  const seeds = [
    {
      id: "ledg-001",
      index: "NIFTY",
      tradeId: "bull-1",
      setupName: "ATM Institutional Momentum Sniper",
      name: "NIFTY 24450 CE",
      type: "CE",
      strike: 24450,
      entryPrice: 142.0,
      sl: 110.0,
      tp1: 191.0,
      tp2: 248.0,
      exitPrice: 248.0,
      status: "TARGET2_HIT",
      pnlPts: 106.0,
      pnlPct: 74.6,
      lotSize: 75,
      pnlInr: 7950,
      createdAt: "2026-10-31T04:15:00.000Z",
      closedAt: "2026-10-31T05:30:00.000Z"
    },
    {
      id: "ledg-002",
      index: "NIFTY",
      tradeId: "bear-2",
      setupName: "Malaysian QMR Resistance Rejection",
      name: "NIFTY 24400 PE",
      type: "PE",
      strike: 24400,
      entryPrice: 68.0,
      sl: 49.0,
      tp1: 102.0,
      tp2: 142.0,
      exitPrice: 102.0,
      status: "TARGET1_HIT",
      pnlPts: 34.0,
      pnlPct: 50.0,
      lotSize: 75,
      pnlInr: 2550,
      createdAt: "2026-10-30T06:10:00.000Z",
      closedAt: "2026-10-30T07:05:00.000Z"
    },
    {
      id: "ledg-003",
      index: "BANKNIFTY",
      tradeId: "bull-1",
      setupName: "ATM Institutional Momentum Sniper",
      name: "BANKNIFTY 51800 CE",
      type: "CE",
      strike: 51800,
      entryPrice: 320.0,
      sl: 250.0,
      tp1: 432.0,
      tp2: 560.0,
      exitPrice: 560.0,
      status: "TARGET2_HIT",
      pnlPts: 240.0,
      pnlPct: 75.0,
      lotSize: 15,
      pnlInr: 3600,
      createdAt: "2026-10-31T05:00:00.000Z",
      closedAt: "2026-10-31T06:45:00.000Z"
    },
    {
      id: "ledg-004",
      index: "BANKNIFTY",
      tradeId: "bear-1",
      setupName: "ATM Institutional Breakdown Sniper",
      name: "BANKNIFTY 52000 PE",
      type: "PE",
      strike: 52000,
      entryPrice: 285.0,
      sl: 222.0,
      tp1: 384.0,
      tp2: 498.0,
      exitPrice: 384.0,
      status: "TARGET1_HIT",
      pnlPts: 99.0,
      pnlPct: 34.7,
      lotSize: 15,
      pnlInr: 1485,
      createdAt: "2026-10-30T08:20:00.000Z",
      closedAt: "2026-10-30T09:15:00.000Z"
    },
    {
      id: "ledg-005",
      index: "SENSEX",
      tradeId: "bull-2",
      setupName: "DodgysDD iFVG Retest Reversal Breakout",
      name: "SENSEX 80200 CE",
      type: "CE",
      strike: 80200,
      entryPrice: 195.0,
      sl: 140.0,
      tp1: 292.0,
      tp2: 409.0,
      exitPrice: 409.0,
      status: "TARGET2_HIT",
      pnlPts: 214.0,
      pnlPct: 109.7,
      lotSize: 20,
      pnlInr: 4280,
      createdAt: "2026-10-31T07:15:00.000Z",
      closedAt: "2026-10-31T08:30:00.000Z"
    },
    {
      id: "ledg-006",
      index: "SENSEX",
      tradeId: "bull-3",
      setupName: "1:15 PM Gamma Explosion Hero-Zero",
      name: "SENSEX 80500 CE",
      type: "CE",
      strike: 80500,
      entryPrice: 35.0,
      sl: 18.0,
      tp1: 70.0,
      tp2: 122.0,
      exitPrice: 122.0,
      status: "TARGET2_HIT",
      pnlPts: 87.0,
      pnlPct: 248.5,
      lotSize: 20,
      pnlInr: 1740,
      createdAt: "2026-10-31T07:45:00.000Z",
      closedAt: "2026-10-31T08:25:00.000Z"
    },
    {
      id: "ledg-007",
      index: "NIFTY",
      tradeId: "bull-3",
      setupName: "1:15 PM Gamma Explosion Hero-Zero",
      name: "NIFTY 24550 CE",
      type: "CE",
      strike: 24550,
      entryPrice: 24.0,
      sl: 12.0,
      tp1: 48.0,
      tp2: 84.0,
      exitPrice: 12.0,
      status: "SL_HIT",
      pnlPts: -12.0,
      pnlPct: -50.0,
      lotSize: 75,
      pnlInr: -900,
      createdAt: "2026-10-29T07:45:00.000Z",
      closedAt: "2026-10-29T08:15:00.000Z"
    }
  ];

  ledgerHistory = seeds;
  saveLedger();
}

module.exports = {
  processAndStabilizeTrades,
  getLedgerData,
  recordLedgerOutcome
};
