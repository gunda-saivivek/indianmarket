/**
 * Telegram Auto-Alerts Broadcasting Service
 * Strict ONE-TRADE-AT-A-TIME execution mode for Telegram:
 * 1. Broadcasts ONLY ONE active trade call.
 * 2. Streams real-time point progression ticks:
 *    The Market Sniper Shooters:
 *    34 ✅✅
 *    ...
 *    50 🎯 TARGET 1 HIT! BOOK 50% PROFIT
 * 3. Once Target 1 / Target 2 or SL is hit, concludes the trade with total profit.
 * 4. Only THEN unlocks and searches for the next best trade!
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const CONFIG_FILE = path.join(__dirname, '..', 'data', 'telegram_config.json');
const ROOT_CONFIG_FILE = path.join(ROOT_DIR, 'telegram_config.json');

let telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
  channelName: process.env.TELEGRAM_CHANNEL_NAME || 'The Market Sniper Shooters',
  enabled: process.env.TELEGRAM_ENABLED === 'true' || false
};

function loadTelegramConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      telegramConfig = { ...telegramConfig, ...data };
      return telegramConfig;
    } else if (fs.existsSync(ROOT_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(ROOT_CONFIG_FILE, 'utf8'));
      telegramConfig = { ...telegramConfig, ...data };
      return telegramConfig;
    }
  } catch (e) {
    console.error('Error loading telegram_config.json:', e.message);
  }
  return telegramConfig;
}

function saveTelegramConfig(newConfig) {
  telegramConfig = { ...telegramConfig, ...newConfig };
  try {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(telegramConfig, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(ROOT_CONFIG_FILE, JSON.stringify(telegramConfig, null, 2), 'utf8');
  } catch (e) {}
  return telegramConfig;
}

loadTelegramConfig();

/**
 * Send raw message to Telegram chat/channel
 */
function sendTelegramMessage(text) {
  return new Promise((resolve) => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      return resolve({ success: false, error: 'Telegram Bot Token or Chat ID not configured.' });
    }

    const payload = JSON.stringify({
      chat_id: telegramConfig.chatId,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${telegramConfig.botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok) {
            resolve({ success: true, result: parsed.result });
          } else {
            resolve({ success: false, error: parsed.description || 'Telegram API Error' });
          }
        } catch (e) {
          resolve({ success: false, error: 'Failed to parse Telegram API response' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

// ============================================================
// STRICT SINGLE-TRADE-AT-A-TIME DISPATCHER
// ============================================================
// activeTelegramTrade holds the ONLY trade currently running on Telegram
let activeTelegramTrade = null;
const broadcastedPoints = new Set();

/**
 * Broadcast trade call:
 * Only broadcasts IF there is NO currently active trade running!
 */
async function broadcastTradeCall(trade) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;

  // If another trade is already running, do NOT send a new trade until this one finishes
  if (activeTelegramTrade !== null) {
    return;
  }

  // Lock this trade as the active single trade
  activeTelegramTrade = {
    key: `${trade.index}_${trade.id}`,
    index: trade.index,
    id: trade.id,
    type: trade.type,
    strike: trade.strike,
    name: trade.name,
    entryPrice: Math.round(trade.fixedEntryPrice || trade.entryPrice),
    tp1: Math.round(trade.tp1),
    tp2: Math.round(trade.tp2),
    sl: Math.round(trade.sl),
    lotSize: trade.lotSize || 65,
    status: 'ACTIVE',
    tp1Sent: false,
    tp2Sent: false,
    slSent: false
  };

  broadcastedPoints.clear();

  const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';
  const indexTitle = (trade.index || 'NIFTY').toUpperCase().includes('BANK') 
    ? 'BANK NIFTY' 
    : (trade.index || '').toUpperCase().includes('SENSEX') 
    ? 'SENSEX' 
    : 'NIFTY 50';

  const strikeText = `${trade.strike} ${trade.type}`;
  const entryText = activeTelegramTrade.entryPrice;
  const tp1Text = activeTelegramTrade.tp1;
  const tp2Text = activeTelegramTrade.tp2;
  const slText = activeTelegramTrade.sl;

  const message = `<b>${channelTitle}</b>\n\n` +
    `<b>BUY ${indexTitle}</b>\n\n` +
    `<b>${strikeText}</b>\n\n` +
    `<b>ABOVE ${entryText}</b>\n\n` +
    `<b>TARGET ${tp1Text}-${tp2Text}+++</b>\n\n` +
    `<b>SL ${slText}</b>`;

  await sendTelegramMessage(message);
}

/**
 * Broadcast point progression ticks & handle trade completion
 */
async function broadcastPriceTick(trade, currentLtp) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;
  if (!activeTelegramTrade) return;

  // Ensure this tick belongs to the currently active single trade
  const tradeKey = `${trade.index}_${trade.id}`;
  if (activeTelegramTrade.key !== tradeKey) return;

  const roundedLtp = Math.floor(currentLtp);
  const entry = activeTelegramTrade.entryPrice;
  const tp1 = activeTelegramTrade.tp1;
  const tp2 = activeTelegramTrade.tp2;
  const sl = activeTelegramTrade.sl;
  const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';

  // 1. Check Stop Loss Hit
  if (roundedLtp <= sl && !activeTelegramTrade.slSent) {
    activeTelegramTrade.slSent = true;
    const lossPts = entry - roundedLtp;
    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `🛑 <b>STOP LOSS HIT @ ${roundedLtp}</b> (-${lossPts} pts)\n` +
      `Trade closed safely. Scanning market for the next high-probability setup...`
    );
    // Release lock so system looks for another trade
    activeTelegramTrade = null;
    broadcastedPoints.clear();
    return;
  }

  // 2. Check Target 2 Hit (Final Victory)
  if (roundedLtp >= tp2 && !activeTelegramTrade.tp2Sent) {
    activeTelegramTrade.tp2Sent = true;
    const profitPts = roundedLtp - entry;
    const lotSize = activeTelegramTrade.lotSize || 65;
    const totalProfit = profitPts * lotSize;

    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `<b>${roundedLtp} 🚀🚀 TARGET 2 RUNNER HIT!</b>\n\n` +
      `🏆 <b>PROFIT BOOKED: +${profitPts} PTS (+₹${totalProfit.toLocaleString('en-IN')}/lot)</b>\n` +
      `✅ Trade successfully completed with massive profit! Looking for the next opportunity...`
    );
    // Release lock so system looks for another trade
    activeTelegramTrade = null;
    broadcastedPoints.clear();
    return;
  }

  // 3. Check Target 1 Hit
  if (roundedLtp >= tp1 && !activeTelegramTrade.tp1Sent) {
    activeTelegramTrade.tp1Sent = true;
    const profitPts = tp1 - entry;
    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `<b>${roundedLtp} 🎯🎯 TARGET 1 HIT! (+${profitPts} pts)</b>\n` +
      `Book 50% profit now & trail Stop Loss to cost! Running towards Target 2...`
    );
  }

  // 4. Point-by-point tick updates (e.g. 34 ✅✅, 35 ✅✅, 36 ✅✅...)
  if (roundedLtp > entry && roundedLtp <= tp2) {
    if (!broadcastedPoints.has(roundedLtp)) {
      broadcastedPoints.add(roundedLtp);

      const msg = `<b>${channelTitle}:</b>\n` +
        `<b>${roundedLtp} ✅✅</b>`;

      await sendTelegramMessage(msg);
    }
  }
}

module.exports = {
  telegramConfig,
  loadTelegramConfig,
  saveTelegramConfig,
  sendTelegramMessage,
  broadcastTradeCall,
  broadcastPriceTick
};
