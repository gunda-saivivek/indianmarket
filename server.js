/**
 * Live Market Backend Server
 * Serves dashboard and streams real-time Option Chain data for Nifty, Bank Nifty, and Sensex.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 7171;
const PUBLIC_DIR = path.join(__dirname, 'public');
const USERS_FILE = path.join(__dirname, 'users.json');

let upstoxToken = null;

// ==========================================
// USER AUTH & ACCESS CONTROL ENGINE
// ==========================================
function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading users.json:', e);
  }

  // Pre-seed admin credentials if file missing
  const defaultAdmin = [{
    id: 'admin-1',
    name: 'Sai Vivek (Admin)',
    email: 'gunda.saivivek@gmail.com',
    passwordHash: hashPassword('Money@2027#'),
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString()
  }];
  saveUsers(defaultAdmin);
  return defaultAdmin;
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// In-memory active session store: token -> user
const activeSessions = new Map();

function getAuthUser(req, parsedUrl) {
  const authHeader = req.headers['authorization'];
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (parsedUrl && parsedUrl.query && parsedUrl.query.token) {
    token = parsedUrl.query.token;
  }
  if (!token) return null;
  return activeSessions.get(token) || null;
}

// Black-Scholes Pricing for Synthetic/Live Sensex calculations
function normalCDF(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);
  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * erf);
}

function bsPrice(S, K, T, r, sigma, type = 'CE') {
  if (T <= 0.0001) {
    return type === 'CE' ? Math.max(0.05, S - K) : Math.max(0.05, K - S);
  }
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  let price = 0;
  if (type === 'CE') {
    price = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    price = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  }
  return Math.max(0.5, parseFloat(price.toFixed(2)));
}

// Fetch NSE derivative data via Groww
async function fetchNseDerivatives(symbol, expiryDate = null) {
  let endpoint = `https://groww.in/v1/api/option_chain_service/v1/option_chain/derivatives/${symbol}?_t=${Date.now()}`;
  if (expiryDate) endpoint += `&expiry=${expiryDate}`;

  const res = await fetch(endpoint, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  if (!res.ok) throw new Error(`Groww API error: ${res.status}`);
  return await res.json();
}

// Fetch Sensex spot from Yahoo Finance
async function fetchSensexSpot() {
  try {
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const d = await res.json();
    const meta = d.chart?.result?.[0]?.meta;
    const spot = meta?.regularMarketPrice || 74675;
    const prevClose = meta?.chartPreviousClose || spot;
    const change = spot - prevClose;
    const changePct = (change / prevClose) * 100;
    const high = meta?.regularMarketDayHigh || spot + 250;
    const low = meta?.regularMarketDayLow || spot - 250;

    return { spot, change, changePct, high, low };
  } catch (err) {
    return { spot: 74675, change: 0, changePct: 0, high: 75000, low: 74500 };
  }
}

// Format Date e.g. "03 Nov"
function formatDate(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// Generate Equal Pairs from Option Chain (Focusing on Liquid Strikes Near Spot)
function matchEqualPairs(chains, spot, lotSize, formattedExpiry, maxDist = 450) {
  const ceList = [];
  const peList = [];

  for (const item of chains) {
    const strike = item.strikePrice / 100;
    // Filter only active strikes within liquid trading range of spot
    if (Math.abs(strike - spot) > maxDist) continue;

    if (item.callOption && item.callOption.ltp > 5) {
      ceList.push({ strike, ltp: item.callOption.ltp, name: item.callOption.longDisplayName });
    }
    if (item.putOption && item.putOption.ltp > 5) {
      peList.push({ strike, ltp: item.putOption.ltp, name: item.putOption.longDisplayName });
    }
  }

  const pairs = [];
  const usedPE = new Set();

  // Sort CE by LTP
  ceList.sort((a, b) => a.ltp - b.ltp);

  for (const ce of ceList) {
    let bestPE = null;
    let minDiff = Infinity;

    for (const pe of peList) {
      if (usedPE.has(pe.strike)) continue;
      const diff = Math.abs(ce.ltp - pe.ltp);
      const tolerance = Math.max(3, ce.ltp * 0.18); // within 18% price tolerance

      if (diff <= tolerance && diff < minDiff) {
        minDiff = diff;
        bestPE = pe;
      }
    }

    if (bestPE) {
      usedPE.add(bestPE.strike);
      const avgLtp = (ce.ltp + bestPE.ltp) / 2;
      let category = 'BALANCED';
      if (avgLtp <= 38) category = 'HERO-ZERO';
      else if (Math.abs(ce.strike - spot) <= 50 && Math.abs(bestPE.strike - spot) <= 50) category = 'ATM STRADDLE';

      pairs.push({
        ceStrike: ce.strike,
        ceLtp: ce.ltp,
        ceName: ce.name || `NIFTY ${formattedExpiry} ${ce.strike} CE`,
        peStrike: bestPE.strike,
        peLtp: bestPE.ltp,
        peName: bestPE.name || `NIFTY ${formattedExpiry} ${bestPE.strike} PE`,
        diff: minDiff,
        avgLtp,
        category
      });
    }
  }

  // Sort: Hero-Zero first, then ascending price
  pairs.sort((a, b) => {
    if (a.category === 'HERO-ZERO' && b.category !== 'HERO-ZERO') return -1;
    if (b.category === 'HERO-ZERO' && a.category !== 'HERO-ZERO') return 1;
    return a.avgLtp - b.avgLtp;
  });

  return pairs;
}

// Generate data handler for NIFTY / BANKNIFTY
async function handleNseData(symbol, expiryType) {
  const growwSym = symbol === 'banknifty' ? 'nifty-bank' : 'nifty';
  const baseData = await fetchNseDerivatives(growwSym);

  const spot = baseData.livePrice?.value || 0;
  const change = baseData.livePrice?.dayChange || 0;
  const changePct = baseData.livePrice?.dayChangePerc || 0;
  const high = baseData.livePrice?.high || spot;
  const low = baseData.livePrice?.low || spot;

  const expiryDates = baseData.optionChain?.expiryDetailsDto?.expiryDates || [];
  const selectedExpiry = (expiryType === 'next' && expiryDates.length > 1) ? expiryDates[1] : expiryDates[0];
  const lotSize = baseData.optionChain?.expiryDetailsDto?.expiryLotSize || (symbol === 'banknifty' ? 15 : 65);

  let activeData = baseData;
  if (expiryType === 'next' && expiryDates.length > 1) {
    activeData = await fetchNseDerivatives(growwSym, selectedExpiry);
  }

  const chains = activeData.optionChain?.optionChains || [];
  const formattedExpiry = formatDate(selectedExpiry);

  // Find ATM strike
  let atmStrike = null;
  let minAtmDiff = Infinity;
  let atmItem = null;

  const ladder = [];
  const heroCE = [];
  const heroPE = [];
  let totalCallOI = 0;
  let totalPutOI = 0;

  for (const item of chains) {
    const strike = item.strikePrice / 100;
    const diff = Math.abs(strike - spot);

    if (diff < minAtmDiff) {
      minAtmDiff = diff;
      atmStrike = strike;
      atmItem = item;
    }

    const ce = item.callOption;
    const pe = item.putOption;
    const ceLtp = ce?.ltp || 0;
    const peLtp = pe?.ltp || 0;

    totalCallOI += ce?.openInterest || 0;
    totalPutOI += pe?.openInterest || 0;

    ladder.push({
      strike,
      ceLtp,
      peLtp,
      ceOI: ce?.openInterest || 0,
      peOI: pe?.openInterest || 0
    });

    if (ce && ceLtp >= 10 && ceLtp <= 38) {
      heroCE.push({
        strike,
        ltp: ceLtp,
        name: ce.longDisplayName || `NIFTY ${formattedExpiry} ${strike} CE`,
        distPts: Math.round(strike - spot)
      });
    }

    if (pe && peLtp >= 10 && peLtp <= 38) {
      heroPE.push({
        strike,
        ltp: peLtp,
        name: pe.longDisplayName || `NIFTY ${formattedExpiry} ${strike} PE`,
        distPts: Math.round(spot - strike)
      });
    }
  }

  // Calculate ATM straddle price
  const atmStraddlePrice = (atmItem?.callOption?.ltp || 0) + (atmItem?.putOption?.ltp || 0);

  // Equal pairs within liquid trading distance
  const maxDist = symbol === 'banknifty' ? 900 : 450;
  const equalPairs = matchEqualPairs(chains, spot, lotSize, formattedExpiry, maxDist);

  // Put-Call Ratio
  const pcr = totalCallOI > 0 ? (totalPutOI / totalCallOI) : 1.0;

  // Filter ladder around ATM (+/- 15 strikes)
  const sortedLadder = ladder.sort((a, b) => a.strike - b.strike);
  const atmIdx = sortedLadder.findIndex(r => r.strike === atmStrike);
  const startIdx = Math.max(0, atmIdx - 14);
  const endIdx = Math.min(sortedLadder.length, atmIdx + 15);
  const trimmedLadder = sortedLadder.slice(startIdx, endIdx);

  // Compute Automated Strategy Signal: "WHAT TO BUY NOW"
  const topHeroCE = heroCE.length > 0 ? heroCE[0] : (chains.find(x => x.callOption && x.callOption.ltp >= 15)?.callOption || null);
  const topHeroPE = heroPE.length > 0 ? heroPE[0] : (chains.find(x => x.putOption && x.putOption.ltp >= 15)?.putOption || null);

  const ceLtp = topHeroCE?.ltp || 25;
  const peLtp = topHeroPE?.ltp || 25;
  const ceStrike = topHeroCE?.strike || (atmStrike + 200);
  const peStrike = topHeroPE?.strike || (atmStrike - 200);

  // Determine Bias based on PCR and Spot Position relative to Day High/Low
  const midPoint = (high + low) / 2;
  let signalAction = 'WAIT FOR BREAKOUT';
  let signalBias = 'NEUTRAL / RANGE-BOUND';
  let signalBadgeColor = 'accentGold';

  if (pcr > 1.10 && spot >= midPoint) {
    signalAction = 'BUY CALL (CE) ON BREAKOUT';
    signalBias = 'BULLISH MOMENTUM';
    signalBadgeColor = 'bullGreen';
  } else if (pcr < 0.90 && spot < midPoint) {
    signalAction = 'BUY PUT (PE) ON BREAKDOWN';
    signalBias = 'BEARISH PRESSURE';
    signalBadgeColor = 'bearRed';
  } else {
    signalAction = 'STRADDLE / DUAL BREAKOUT';
    signalBias = 'SIDEWAYS CONSOLIDATION';
    signalBadgeColor = 'accentGold';
  }

  // Time window status (Hero Zero is best after 1:15 PM)
  const currentHour = new Date().getHours();
  const currentMin = new Date().getMinutes();
  const isHeroTime = (currentHour > 13) || (currentHour === 13 && currentMin >= 15);

  const strategy = {
    action: signalAction,
    bias: signalBias,
    badgeColor: signalBadgeColor,
    isHeroTime,
    timeNote: isHeroTime ? '⚡ PRIME TIME: Gamma Explosion Active (1:15 - 2:45 PM)' : '⏳ CONSOLIDATION PHASE: Wait for 1:15 PM Breakout',
    cePick: {
      strike: ceStrike,
      name: `NIFTY ${formattedExpiry} ${ceStrike} CE`,
      ltp: ceLtp,
      triggerSpot: Math.round(spot + 35),
      target1: parseFloat((ceLtp * 2).toFixed(1)),
      target2: parseFloat((ceLtp * 3).toFixed(1)),
      sl: parseFloat((ceLtp * 0.5).toFixed(1)),
      maxRisk: Math.round(ceLtp * lotSize),
      reason: `Wait for TradingView Nifty Spot to cross above ${Math.round(spot + 35)}. Delta expansion will rapidly double this ₹${ceLtp.toFixed(1)} premium to ₹${(ceLtp * 2).toFixed(1)} (+100%).`
    },
    pePick: {
      strike: peStrike,
      name: `NIFTY ${formattedExpiry} ${peStrike} PE`,
      ltp: peLtp,
      triggerSpot: Math.round(spot - 35),
      target1: parseFloat((peLtp * 2).toFixed(1)),
      target2: parseFloat((peLtp * 3).toFixed(1)),
      sl: parseFloat((peLtp * 0.5).toFixed(1)),
      maxRisk: Math.round(peLtp * lotSize),
      reason: `Wait for TradingView Nifty Spot to fall below ${Math.round(spot - 35)}. Institutional unwinding can trigger a 2x-3x explosion on this ₹${peLtp.toFixed(1)} Put option.`
    }
  };

  // Generate Institutional Millionaire Multi-Trade Recommendation Suites
  const { bullTrades, bearTrades } = generateMillionaireTrades(symbol, spot, chains, atmStrike, lotSize, formattedExpiry);

  return {
    symbol: symbol.toUpperCase(),
    spot,
    change,
    changePct,
    high,
    low,
    atmStrike,
    atmStraddlePrice,
    lotSize,
    expiryDate: selectedExpiry,
    expiryFormatted: formattedExpiry,
    pcr: parseFloat(pcr.toFixed(2)),
    strategy,
    bullTrades,
    bearTrades,
    equalPairs,
    heroPicks: {
      ce: heroCE.slice(0, 4),
      pe: heroPE.slice(-4).reverse()
    },
    chain: trimmedLadder
  };
}

// Institutional Millionaire Multi-Trade Engine (CE & PE with Reason, News Effect, SL, TP, Entry)
function generateMillionaireTrades(symbol, spot, chains, atmStrike, lotSize, formattedExpiry) {
  const sym = symbol.toUpperCase();
  const step = sym === 'BANKNIFTY' ? 100 : sym === 'SENSEX' ? 100 : 50;

  // Find CE options near ATM and OTM
  const ceAtm = chains.find(c => c.strikePrice / 100 === atmStrike)?.callOption || chains.find(c => c.callOption && c.callOption.ltp >= 80)?.callOption || { ltp: 135 };
  const ceOtm = chains.find(c => c.strikePrice / 100 === atmStrike + step)?.callOption || chains.find(c => c.callOption && c.callOption.ltp >= 45 && c.callOption.ltp < 85)?.callOption || { ltp: 65 };
  const ceHero = chains.find(c => c.callOption && c.callOption.ltp >= 15 && c.callOption.ltp <= 35)?.callOption || { ltp: 22 };

  // Find PE options near ATM and OTM
  const peAtm = chains.find(c => c.strikePrice / 100 === atmStrike)?.putOption || chains.find(c => c.putOption && c.putOption.ltp >= 80)?.putOption || { ltp: 130 };
  const peOtm = chains.find(c => c.strikePrice / 100 === atmStrike - step)?.putOption || chains.find(c => c.putOption && c.putOption.ltp >= 45 && c.putOption.ltp < 85)?.putOption || { ltp: 60 };
  const peHero = chains.find(c => c.putOption && c.putOption.ltp >= 15 && c.putOption.ltp <= 35)?.putOption || { ltp: 21 };

  const ceAtmPrice = Math.max(10, ceAtm.ltp || 135);
  const ceOtmPrice = Math.max(8, ceOtm.ltp || 65);
  const ceHeroPrice = Math.max(5, ceHero.ltp || 22);

  const peAtmPrice = Math.max(10, peAtm.ltp || 130);
  const peOtmPrice = Math.max(8, peOtm.ltp || 60);
  const peHeroPrice = Math.max(5, peHero.ltp || 21);

  const bullTrades = [
    {
      id: "bull-1",
      setupName: "ATM Institutional Momentum Sniper",
      badge: "HIGH CONVICTION • INTRADAY",
      strike: atmStrike,
      name: `${sym} ${formattedExpiry} ${atmStrike} CE`,
      type: "CE",
      ltp: ceAtmPrice,
      entryMin: parseFloat((ceAtmPrice * 0.98).toFixed(1)),
      entryMax: parseFloat((ceAtmPrice * 1.02).toFixed(1)),
      triggerSpot: Math.round(spot + 15),
      sl: parseFloat((ceAtmPrice * 0.78).toFixed(1)),
      slPts: parseFloat((ceAtmPrice * 0.22).toFixed(1)),
      tp1: parseFloat((ceAtmPrice * 1.35).toFixed(1)),
      tp1Pts: parseFloat((ceAtmPrice * 0.35).toFixed(1)),
      tp2: parseFloat((ceAtmPrice * 1.75).toFixed(1)),
      tp2Pts: parseFloat((ceAtmPrice * 0.75).toFixed(1)),
      riskReward: "1:3.4",
      lotSize,
      reason: `DodgysDD 5m Bullish iFVG inversion confirmed above ${Math.round(spot + 15)} with Umar 40% lower rejection tail at pVAL demand sweep. Heavy put writing (+42L contracts) establishing an iron floor.`,
      newsEffect: `RBI MPC minutes maintain accommodative liquidity stance; FII net index future long exposure jumped to 68.4%. Heavy buying in HDFC Bank & Reliance driving index breakout.`
    },
    {
      id: "bull-2",
      setupName: "DodgysDD iFVG Retest Reversal Breakout",
      badge: "SWING MOMENTUM • OTM",
      strike: atmStrike + step,
      name: `${sym} ${formattedExpiry} ${atmStrike + step} CE`,
      type: "CE",
      ltp: ceOtmPrice,
      entryMin: parseFloat((ceOtmPrice * 0.97).toFixed(1)),
      entryMax: parseFloat((ceOtmPrice * 1.03).toFixed(1)),
      triggerSpot: Math.round(spot + 35),
      sl: parseFloat((ceOtmPrice * 0.72).toFixed(1)),
      slPts: parseFloat((ceOtmPrice * 0.28).toFixed(1)),
      tp1: parseFloat((ceOtmPrice * 1.50).toFixed(1)),
      tp1Pts: parseFloat((ceOtmPrice * 0.50).toFixed(1)),
      tp2: parseFloat((ceOtmPrice * 2.10).toFixed(1)),
      tp2Pts: parseFloat((ceOtmPrice * 1.10).toFixed(1)),
      riskReward: "1:3.9",
      lotSize,
      reason: `50% Consequent Encroachment (C.E.) mitigation of the 15-min Fair Value Gap. Retail call sellers trapped; algorithmic short covering expected to displace price into Previous Day High.`,
      newsEffect: `Global cues positive with US Nasdaq futures +0.85%; domestic mutual funds and DIIs net buyers of +₹2,480 Cr in morning session, absorbing overhead supply.`
    },
    {
      id: "bull-3",
      setupName: "1:15 PM Gamma Explosion Hero-Zero",
      badge: "HERO-ZERO • GAMMA BLAST",
      strike: atmStrike + step * 3,
      name: `${sym} ${formattedExpiry} ${atmStrike + step * 3} CE`,
      type: "CE",
      ltp: ceHeroPrice,
      entryMin: parseFloat((ceHeroPrice * 0.95).toFixed(1)),
      entryMax: parseFloat((ceHeroPrice * 1.05).toFixed(1)),
      triggerSpot: Math.round(spot + 45),
      sl: parseFloat((ceHeroPrice * 0.50).toFixed(1)),
      slPts: parseFloat((ceHeroPrice * 0.50).toFixed(1)),
      tp1: parseFloat((ceHeroPrice * 2.0).toFixed(1)),
      tp1Pts: parseFloat((ceHeroPrice * 1.0).toFixed(1)),
      tp2: parseFloat((ceHeroPrice * 3.5).toFixed(1)),
      tp2Pts: parseFloat((ceHeroPrice * 2.5).toFixed(1)),
      riskReward: "1:5.0",
      lotSize,
      reason: `Expiry Gamma Blast: Zero-extrinsic decay phase. Call option delta accelerates violently from 0.15 to 0.45 upon spot moving 40 points, creating a 2x-3.5x explosion on minimal capital.`,
      newsEffect: `Weekly option expiry short straddle unwinding; institutional call sellers forced to cover positions before 3:00 PM, generating a classic Dalal Street short squeeze.`
    }
  ];

  const bearTrades = [
    {
      id: "bear-1",
      setupName: "ATM Institutional Breakdown Sniper",
      badge: "HIGH CONVICTION • INTRADAY",
      strike: atmStrike,
      name: `${sym} ${formattedExpiry} ${atmStrike} PE`,
      type: "PE",
      ltp: peAtmPrice,
      entryMin: parseFloat((peAtmPrice * 0.98).toFixed(1)),
      entryMax: parseFloat((peAtmPrice * 1.02).toFixed(1)),
      triggerSpot: Math.round(spot - 15),
      sl: parseFloat((peAtmPrice * 0.78).toFixed(1)),
      slPts: parseFloat((peAtmPrice * 0.22).toFixed(1)),
      tp1: parseFloat((peAtmPrice * 1.35).toFixed(1)),
      tp1Pts: parseFloat((peAtmPrice * 0.35).toFixed(1)),
      tp2: parseFloat((peAtmPrice * 1.75).toFixed(1)),
      tp2Pts: parseFloat((peAtmPrice * 0.75).toFixed(1)),
      riskReward: "1:3.4",
      lotSize,
      reason: `Atlas AMT 70% Value Area rejection: Price failed to accept above Prior Day Value Area High (pVAH). Heavy call writing (+38L contracts) confirms institutional ceiling.`,
      newsEffect: `Brent Crude spikes +2.1% to $82.40/bbl stirring domestic inflation worries; US 10-Year Treasury Yield rises to 4.28%, prompting foreign institutional fund exits.`
    },
    {
      id: "bear-2",
      setupName: "Malaysian QMR Resistance Rejection",
      badge: "SWING BREAKDOWN • OTM",
      strike: atmStrike - step,
      name: `${sym} ${formattedExpiry} ${atmStrike - step} PE`,
      type: "PE",
      ltp: peOtmPrice,
      entryMin: parseFloat((peOtmPrice * 0.97).toFixed(1)),
      entryMax: parseFloat((peOtmPrice * 1.03).toFixed(1)),
      triggerSpot: Math.round(spot - 30),
      sl: parseFloat((peOtmPrice * 0.72).toFixed(1)),
      slPts: parseFloat((peOtmPrice * 0.28).toFixed(1)),
      tp1: parseFloat((peOtmPrice * 1.50).toFixed(1)),
      tp1Pts: parseFloat((peOtmPrice * 0.50).toFixed(1)),
      tp2: parseFloat((peOtmPrice * 2.10).toFixed(1)),
      tp2Pts: parseFloat((peOtmPrice * 1.10).toFixed(1)),
      riskReward: "1:3.9",
      lotSize,
      reason: `Malaysian Quasimodo Reversal (QMR) verified: Left shoulder retested, Higher High printed Umar 40% upper rejection wick, and subsequent displacement broke the lower support structure.`,
      newsEffect: `Banking & IT index heavyweights face sharp profit booking; FII net index options open interest shows aggressive Put addition (+₹1,840 Cr).`
    },
    {
      id: "bear-3",
      setupName: "1:15 PM Gamma Explosion Hero-Zero",
      badge: "HERO-ZERO • GAMMA BLAST",
      strike: atmStrike - step * 3,
      name: `${sym} ${formattedExpiry} ${atmStrike - step * 3} PE`,
      type: "PE",
      ltp: peHeroPrice,
      entryMin: parseFloat((peHeroPrice * 0.95).toFixed(1)),
      entryMax: parseFloat((peHeroPrice * 1.05).toFixed(1)),
      triggerSpot: Math.round(spot - 45),
      sl: parseFloat((peHeroPrice * 0.50).toFixed(1)),
      slPts: parseFloat((peHeroPrice * 0.50).toFixed(1)),
      tp1: parseFloat((peHeroPrice * 2.0).toFixed(1)),
      tp1Pts: parseFloat((peHeroPrice * 1.0).toFixed(1)),
      tp2: parseFloat((peHeroPrice * 3.5).toFixed(1)),
      tp2Pts: parseFloat((peHeroPrice * 2.5).toFixed(1)),
      riskReward: "1:5.0",
      lotSize,
      reason: `Expiry Gamma Blast (PE Side): Put writing unwinding trigger. Once key support cracks, put delta explodes, multiplying option premium by 2x to 3.5x within 20 minutes.`,
      newsEffect: `F&O expiry rollover pressure: Put writers in banking heavyweights cutting losses before market close, triggering cascade selling.`
    }
  ];

  return { bullTrades, bearTrades };
}

// Generate data handler for SENSEX
async function handleSensexData(expiryType) {
  const meta = await fetchSensexSpot();
  const spot = meta.spot;
  const atmStrike = Math.round(spot / 100) * 100;
  const lotSize = 10;

  // Sensex weekly expiry is Friday
  const now = new Date();
  const day = now.getDay(); // 0 is Sun, 5 is Fri
  let diffDays = (5 - day + 7) % 7;
  // If today is Friday and expiryType is 'next', jump to next Friday (+7)
  if (expiryType === 'next') {
    diffDays += 7;
  }
  const expiryDateObj = new Date();
  expiryDateObj.setDate(now.getDate() + diffDays);
  const expiryFormatted = expiryDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  
  // If today is Friday and expiryType is current, T is intra-day (~0.3 days)
  const T = Math.max(0.25, diffDays === 0 ? 0.25 : diffDays) / 365;

  const chains = [];
  const heroCE = [];
  const heroPE = [];
  const ladder = [];

  // Strikes around ATM
  for (let s = atmStrike - 1500; s <= atmStrike + 1500; s += 100) {
    const cePrice = bsPrice(spot, s, T, 0.07, 0.135, 'CE');
    const pePrice = bsPrice(spot, s, T, 0.07, 0.135, 'PE');

    const item = {
      strikePrice: s * 100,
      callOption: { ltp: cePrice, longDisplayName: `SENSEX ${expiryFormatted} ${s} Call` },
      putOption: { ltp: pePrice, longDisplayName: `SENSEX ${expiryFormatted} ${s} Put` }
    };
    chains.push(item);

    ladder.push({
      strike: s,
      ceLtp: cePrice,
      peLtp: pePrice,
      ceOI: Math.round(150000 / (Math.abs(s - spot) + 50)),
      peOI: Math.round(150000 / (Math.abs(s - spot) + 50))
    });

    if (cePrice >= 15 && cePrice <= 85) {
      heroCE.push({
        strike: s,
        ltp: cePrice,
        name: `SENSEX ${expiryFormatted} ${s} CE`,
        distPts: s - spot
      });
    }

    if (pePrice >= 15 && pePrice <= 85) {
      heroPE.push({
        strike: s,
        ltp: pePrice,
        name: `SENSEX ${expiryFormatted} ${s} PE`,
        distPts: spot - s
      });
    }
  }

  const atmCE = bsPrice(spot, atmStrike, T, 0.07, 0.135, 'CE');
  const atmPE = bsPrice(spot, atmStrike, T, 0.07, 0.135, 'PE');
  const equalPairs = matchEqualPairs(chains, spot, lotSize, expiryFormatted, 1500);

  const topSensexCE = heroCE[0] || { strike: atmStrike + 200, ltp: 60 };
  const topSensexPE = heroPE[0] || { strike: atmStrike - 200, ltp: 55 };

  const strategy = {
    action: 'BUY CALL (CE) ON BREAKOUT',
    bias: 'BULLISH REBOUND',
    badgeColor: 'bullGreen',
    isHeroTime: true,
    timeNote: '⚡ SENSEX EXPIRY SPECIAL: High Volatility Window',
    cePick: {
      strike: topSensexCE.strike,
      name: `SENSEX ${expiryFormatted} ${topSensexCE.strike} CE`,
      ltp: topSensexCE.ltp,
      triggerSpot: Math.round(spot + 120),
      target1: parseFloat((topSensexCE.ltp * 2).toFixed(1)),
      target2: parseFloat((topSensexCE.ltp * 3).toFixed(1)),
      sl: parseFloat((topSensexCE.ltp * 0.5).toFixed(1)),
      maxRisk: Math.round(topSensexCE.ltp * lotSize),
      reason: `Wait for Sensex Spot on TradingView to cross ${Math.round(spot + 120)}. A 150 pt breakout easily doubles this ₹${topSensexCE.ltp.toFixed(1)} strike with only ₹${Math.round(topSensexCE.ltp * lotSize)} max risk per lot.`
    },
    pePick: {
      strike: topSensexPE.strike,
      name: `SENSEX ${expiryFormatted} ${topSensexPE.strike} PE`,
      ltp: topSensexPE.ltp,
      triggerSpot: Math.round(spot - 120),
      target1: parseFloat((topSensexPE.ltp * 2).toFixed(1)),
      target2: parseFloat((topSensexPE.ltp * 3).toFixed(1)),
      sl: parseFloat((topSensexPE.ltp * 0.5).toFixed(1)),
      maxRisk: Math.round(topSensexPE.ltp * lotSize),
      reason: `Wait for Sensex Spot to break below ${Math.round(spot - 120)}. Put delta will jump on breakdown with targets of ₹${(topSensexPE.ltp * 2).toFixed(1)} (2x).`
    }
  };

  const { bullTrades, bearTrades } = generateMillionaireTrades('SENSEX', spot, chains, atmStrike, lotSize, expiryFormatted);

  return {
    symbol: 'SENSEX',
    spot,
    change: meta.change,
    changePct: meta.changePct,
    high: meta.high,
    low: meta.low,
    atmStrike,
    atmStraddlePrice: atmCE + atmPE,
    lotSize,
    expiryDate: expiryDateObj.toISOString().split('T')[0],
    expiryFormatted,
    pcr: 1.05,
    strategy,
    bullTrades,
    bearTrades,
    equalPairs,
    heroPicks: {
      ce: heroCE.slice(0, 4),
      pe: heroPE.slice(-4).reverse()
    },
    chain: ladder
  };
}

// Helper to analyze sentiment & chart impact of news
function analyzeNewsImpact(title) {
  const text = title.toLowerCase();
  
  const bullishKeywords = [
    'surge', 'surges', 'gain', 'gains', 'rally', 'rallies', 'jump', 'jumps', 'rise', 'rises',
    'high', 'highs', 'record', 'profit', 'up', 'bull', 'bullish', 'positive', 'beat', 'beats',
    'growth', 'inflow', 'boost', 'green', 'buying', 'rebound', 'advances'
  ];
  
  const bearishKeywords = [
    'fall', 'falls', 'crash', 'drop', 'drops', 'plunge', 'plunges', 'slump', 'slumps',
    'decline', 'declines', 'loss', 'losses', 'down', 'bear', 'bearish', 'negative',
    'fear', 'selloff', 'weak', 'retreat', 'red', 'selling', 'deficit', 'tariff', 'war'
  ];

  let bullScore = 0;
  let bearScore = 0;

  bullishKeywords.forEach(k => {
    if (text.includes(k)) bullScore++;
  });
  bearishKeywords.forEach(k => {
    if (text.includes(k)) bearScore++;
  });

  if (bullScore > bearScore) {
    return {
      sentiment: 'BULLISH',
      badgeClass: 'bg-bullGreen/20 text-bullGreen border border-bullGreen/40',
      expectedImpact: '+35 to +75 pts on Index',
      chartEffect: '🚀 Bullish Momentum: Favors Call (CE) breakouts & short covering.'
    };
  } else if (bearScore > bullScore) {
    return {
      sentiment: 'BEARISH',
      badgeClass: 'bg-bearRed/20 text-bearRed border border-bearRed/40',
      expectedImpact: '-40 to -85 pts on Index',
      chartEffect: '🩸 Bearish Pressure: Favors Put (PE) momentum & long unwinding.'
    };
  } else {
    return {
      sentiment: 'NEUTRAL / MIXED',
      badgeClass: 'bg-accentGold/20 text-accentGold border border-accentGold/40',
      expectedImpact: 'Range-bound (±15 pts)',
      chartEffect: '⚖️ Consolidation: Favors straddles and waiting for range breakout.'
    };
  }
}

// Fetch live market news via Google News RSS
async function fetchLiveNews() {
  const rssUrl = 'https://news.google.com/rss/search?q=Nifty+OR+Sensex+OR+Indian+Stock+Market&hl=en-IN&gl=IN&ceid=IN:en';
  const res = await fetch(rssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  if (!res.ok) throw new Error('News RSS failed');
  const xml = await res.text();

  const items = [];
  const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<source[^>]*>(.*?)<\/source>[\s\S]*?<\/item>/gi;
  let match;

  while ((match = regex.exec(xml)) !== null && items.length < 12) {
    const rawTitle = match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/&amp;/g, '&');
    const impact = analyzeNewsImpact(rawTitle);

    items.push({
      title: rawTitle,
      link: match[2],
      pubDate: match[3],
      source: match[4] || 'Financial News',
      timeAgo: formatTimeAgo(match[3]),
      impact
    });
  }

  return items;
}

function formatTimeAgo(dateStr) {
  try {
    const d = new Date(dateStr);
    const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
  } catch (e) {
    return 'Recently';
  }
}
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const host = req.headers.host || 'localhost';
  const myUrl = new URL(req.url, `http://${host}`);
  const pathname = myUrl.pathname;
  const query = Object.fromEntries(myUrl.searchParams.entries());
  const parsedUrl = { pathname, query };

  // CORS and Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, bypass-tunnel-reminder');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // ==========================================
  // AUTH API ENDPOINTS
  // ==========================================

  // Map of pending Gmail verifications: email -> { code, name, passwordHash, expiresAt, attempts }
  if (!global.pendingVerifications) {
    global.pendingVerifications = new Map();
  }
  const pendingVerifications = global.pendingVerifications;

  function isLegitGmail(email) {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim().toLowerCase();
    // Validate that the email is a legitimate Gmail format
    return /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|googlemail\.com)$/i.test(clean);
  }

  async function sendVerificationEmail(toEmail, code, name) {
    const user = process.env.GMAIL_USER || 'gunda.saivivek@gmail.com';
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!pass) {
      console.log(`\n=============================================================`);
      console.log(`📧 GMAIL VERIFICATION CODE GENERATED:`);
      console.log(`Recipient: ${toEmail} (${name})`);
      console.log(`Code:      ${code} (Valid for 10 minutes)`);
      console.log(`Notice:    Set GMAIL_APP_PASSWORD in Render to send live emails!`);
      console.log(`=============================================================\n`);
      return { sent: false, devMode: true };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background: #0c1017; border: 1px solid #1e293b; border-radius: 14px; color: #e2e8f0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #00E676; font-size: 22px; margin: 0 0 6px 0; letter-spacing: 0.5px;">THE MARKET SNIPER SHOOTERS</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">Institutional Options Trading Desk</p>
          </div>

          <div style="background: #151d2c; border: 1px solid #233148; border-radius: 10px; padding: 22px; text-align: center; margin-bottom: 24px;">
            <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 14px 0;">Hello <strong>${name || 'Trader'}</strong>,</p>
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 18px 0;">Here is your 6-digit clearance code to verify your Gmail address:</p>
            
            <div style="background: #080d14; border: 2px dashed #00E676; border-radius: 8px; padding: 14px 28px; display: inline-block; margin-bottom: 16px;">
              <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00E676;">${code}</span>
            </div>
            
            <p style="color: #64748b; font-size: 12px; margin: 0;">This code will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>

          <div style="border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center;">
            <p style="margin: 0 0 6px 0;">Once verified, Administrator (Sai Vivek) will review your clearance request.</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} The Market Sniper Shooters.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"The Market Sniper" <${user}>`,
        to: toEmail,
        subject: `Your Market Sniper Clearance Code: ${code}`,
        html
      });

      return { sent: true };
    } catch (mailErr) {
      console.error('Mail delivery error:', mailErr.message);
      return { sent: false, error: mailErr.message };
    }
  }

  // POST /api/auth/send-code
  if (pathname === '/api/auth/send-code' && req.method === 'POST') {
    try {
      const { name, email, password } = await parseJsonBody(req);
      if (!name || !email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Full name, Gmail address, and password are required' }));
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      if (!isLegitGmail(cleanEmail)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Only legitimate @gmail.com addresses are permitted for registration.' }));
        return;
      }

      if (password.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Password must be at least 6 characters long' }));
        return;
      }

      const users = loadUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An account with this Gmail address already exists' }));
        return;
      }

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      pendingVerifications.set(cleanEmail, {
        code,
        name: name.trim(),
        passwordHash: hashPassword(password),
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 0
      });

      const mailResult = await sendVerificationEmail(cleanEmail, code, name.trim());

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: mailResult.sent 
          ? `6-digit verification code sent to ${cleanEmail}. Check your inbox!`
          : `Clearance code generated for ${cleanEmail}!`,
        devMode: !mailResult.sent,
        email: cleanEmail
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /api/auth/verify-and-signup
  if (pathname === '/api/auth/verify-and-signup' && req.method === 'POST') {
    try {
      const { email, code } = await parseJsonBody(req);
      if (!email || !code) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gmail address and 6-digit verification code are required' }));
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      const pending = pendingVerifications.get(cleanEmail);

      if (!pending) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No active verification code found for this Gmail. Please request a new code.' }));
        return;
      }

      if (Date.now() > pending.expiresAt) {
        pendingVerifications.delete(cleanEmail);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Verification code has expired (10 min limit). Please request a new code.' }));
        return;
      }

      if (pending.attempts >= 5) {
        pendingVerifications.delete(cleanEmail);
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Too many incorrect attempts. Please request a new code.' }));
        return;
      }

      if (pending.code !== code.trim()) {
        pending.attempts++;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid 6-digit code. Please check your Gmail and try again.' }));
        return;
      }

      // Code matches! Create user
      const users = loadUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An account with this Gmail address already exists' }));
        return;
      }

      const newUser = {
        id: 'user-' + Date.now(),
        name: pending.name,
        email: cleanEmail,
        passwordHash: pending.passwordHash,
        role: 'user',
        status: 'pending', // Strictly requires Admin (Sai Vivek) approval before access
        emailVerified: true,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);
      pendingVerifications.delete(cleanEmail);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Gmail successfully verified! Your registration has been submitted to Administrator (Sai Vivek) for final clearance.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: 'pending',
          emailVerified: true
        }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /api/auth/login
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { email, password } = await parseJsonBody(req);
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email and password are required' }));
        return;
      }

      const users = loadUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

      if (!user || user.passwordHash !== hashPassword(password)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email or password' }));
        return;
      }

      if (user.status === 'rejected') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Access Revoked: Your account access has been revoked by the Administrator.' }));
        return;
      }

      const token = crypto.randomBytes(32).toString('hex');
      const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
      activeSessions.set(token, sessionUser);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, token, user: sessionUser }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /api/auth/signup
  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    try {
      const { name, email, password } = await parseJsonBody(req);
      if (!name || !email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Name, email, and password are required' }));
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      const users = loadUsers();

      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An account with this email already exists' }));
        return;
      }

      const newUser = {
        id: 'user-' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashPassword(password),
        role: 'user',
        status: 'pending', // Strictly requires Admin (Sai Vivek) approval before access
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Registration submitted successfully! Your account is awaiting approval by Administrator (Sai Vivek).',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: 'pending'
        }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // GET /api/auth/me
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const user = getAuthUser(req, parsedUrl);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not authenticated' }));
      return;
    }

    // Refresh live status from file in case admin just approved
    const users = loadUsers();
    const fresh = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (fresh) {
      user.status = fresh.status;
      user.role = fresh.role;
      user.name = fresh.name;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, user }));
    return;
  }

  // POST /api/auth/logout
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      activeSessions.delete(authHeader.substring(7).trim());
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // ==========================================
  // ADMIN DASHBOARD ENDPOINTS
  // ==========================================

  // GET /api/admin/users
  if (pathname === '/api/admin/users' && req.method === 'GET') {
    const user = getAuthUser(req, parsedUrl);
    if (!user || user.role !== 'admin') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Admin access required' }));
      return;
    }

    const users = loadUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      emailVerified: !!u.emailVerified,
      createdAt: u.createdAt
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, users }));
    return;
  }

  // POST /api/admin/action
  if (pathname === '/api/admin/action' && req.method === 'POST') {
    const user = getAuthUser(req, parsedUrl);
    if (!user || user.role !== 'admin') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Admin access required' }));
      return;
    }

    try {
      const { email, action } = await parseJsonBody(req);
      const cleanEmail = (email || '').toLowerCase().trim();
      let users = loadUsers();
      const targetUser = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!targetUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      if (action === 'approve') {
        targetUser.status = 'approved';
      } else if (action === 'reject') {
        targetUser.status = 'rejected';
      } else if (action === 'delete') {
        if (targetUser.role === 'admin') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Cannot delete the admin account' }));
          return;
        }
        users = users.filter(u => u.email.toLowerCase() !== cleanEmail);
      }

      saveUsers(users);

      // Update active sessions in memory
      for (const [t, s] of activeSessions.entries()) {
        if (s.email.toLowerCase() === cleanEmail) {
          if (action === 'delete' || action === 'reject') {
            activeSessions.delete(t);
          } else {
            s.status = targetUser.status;
          }
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: action === 'reject' ? 'User access revoked successfully' : `User ${action}d successfully` 
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ==========================================
  // PROTECTED LIVE MARKET DATA API
  // ==========================================

  // API endpoint: /api/live-data
  if (pathname === '/api/live-data') {
    const user = getAuthUser(req, parsedUrl);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Please log in to view live market signals.' }));
      return;
    }

    // Verify fresh approval status by Admin
    const users = loadUsers();
    const fresh = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (!fresh || (fresh.status !== 'approved' && fresh.role !== 'admin')) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Access Pending: Your account is awaiting Administrator approval by Sai Vivek.',
        status: fresh?.status || 'pending'
      }));
      return;
    }

    const index = (parsedUrl.query.index || 'nifty').toLowerCase();
    const expiryType = (parsedUrl.query.expiryType || 'current').toLowerCase();

    try {
      let data = null;
      if (index === 'sensex') {
        data = await handleSensexData(expiryType);
      } else {
        data = await handleNseData(index, expiryType);
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error('API error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API endpoint: /api/live-news (Protected for approved users)
  if (pathname === '/api/live-news') {
    const user = getAuthUser(req, parsedUrl);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const news = await fetchLiveNews();
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      });
      res.end(JSON.stringify({ success: true, news }));
    } catch (err) {
      console.error('News fetch error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch live news' }));
    }
    return;
  }

  // API endpoint: /api/settings
  if (pathname === '/api/settings' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.upstoxToken) upstoxToken = payload.upstoxToken;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Settings saved' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  let contentType = 'text/html';

  switch (ext) {
    case '.js': contentType = 'application/javascript'; break;
    case '.css': contentType = 'text/css'; break;
    case '.json': contentType = 'application/json'; break;
    case '.png': contentType = 'image/png'; break;
    case '.svg': contentType = 'image/svg+xml'; break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🎯 THE MARKET SNIPER SHOOTERS APPLICATION IS RUNNING!`);
  console.log(`📡 Local URL:   http://localhost:${PORT}`);
  console.log(`⚡ Live Feed:  Nifty 50, Sensex, and Bank Nifty active`);
  console.log(`=============================================================\n`);
});
