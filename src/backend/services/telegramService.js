/**
 * Telegram Auto-Alerts Broadcasting Service
 * Enhanced 2-Minute Trade Cadence + Threaded Reply-To-Message Architecture:
 * 
 * 1. Automatically dispatches the next fresh trade 2 minutes after a previous call.
 * 2. Remembers the exact message_id of the initial trade call.
 * 3. All point updates (34 ✅✅, 35 ✅✅), Target 1 hits, and Target 2 profits
 *    are sent as DIRECT REPLIES (reply_to_message_id) to that specific trade!
 * 4. Each trade has its own completely separate reply thread!
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
 * Send message to Telegram chat/channel (with optional reply_to_message_id)
 */
function sendTelegramMessage(text, replyToMessageId = null) {
  return new Promise((resolve) => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      return resolve({ success: false, error: 'Telegram Bot Token or Chat ID not configured.' });
    }

    const payloadObj = {
      chat_id: telegramConfig.chatId,
      text: text,
      parse_mode: 'HTML'
    };

    if (replyToMessageId) {
      payloadObj.reply_to_message_id = replyToMessageId;
    }

    const payload = JSON.stringify(payloadObj);

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
// 2-MINUTE CADENCE & SEPARATE REPLY-THREAD TRACKER
// ============================================================
// activeTradesMap: tradeKey -> { key, messageId, index, strike, type, entryPrice, tp1, tp2, sl, lotSize, broadcastedPoints: Set, tp1Sent, tp2Sent, slSent }
const activeTradesMap = new Map();
let lastTradeBroadcastTime = 0;
const TWO_MINUTES_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Broadcast trade call:
 * Checks if 2 minutes have elapsed since the last broadcast trade.
 * Stores the messageId returned by Telegram so all subsequent point updates
 * reply directly to THIS specific trade!
 */
async function broadcastTradeCall(trade) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;

  const tradeKey = `${trade.index}_${trade.id}`;

  // If this trade was already broadcasted, do not re-broadcast as a new call
  if (activeTradesMap.has(tradeKey)) return;

  // Rate-limit new trade dispatches to every 2 minutes
  const now = Date.now();
  if (now - lastTradeBroadcastTime < TWO_MINUTES_MS) {
    return;
  }

  const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';
  const indexTitle = (trade.index || 'NIFTY').toUpperCase().includes('BANK') 
    ? 'BANK NIFTY' 
    : (trade.index || '').toUpperCase().includes('SENSEX') 
    ? 'SENSEX' 
    : 'NIFTY 50';

  const strikeText = `${trade.strike} ${trade.type}`;
  const entryText = Math.round(trade.fixedEntryPrice || trade.entryPrice);
  const tp1Text = Math.round(trade.tp1);
  const tp2Text = Math.round(trade.tp2);
  const slText = Math.round(trade.sl);

  const message = `<b>${channelTitle}</b>\n\n` +
    `<b>BUY ${indexTitle}</b>\n\n` +
    `<b>${strikeText}</b>\n\n` +
    `<b>ABOVE ${entryText}</b>\n\n` +
    `<b>TARGET ${tp1Text}-${tp2Text}+++</b>\n\n` +
    `<b>SL ${slText}</b>`;

  const resp = await sendTelegramMessage(message);

  if (resp.success && resp.result?.message_id) {
    lastTradeBroadcastTime = now;

    // Track this trade with its exact Telegram Message ID so all replies go to it
    activeTradesMap.set(tradeKey, {
      key: tradeKey,
      messageId: resp.result.message_id,
      index: trade.index,
      id: trade.id,
      name: trade.name,
      strike: trade.strike,
      type: trade.type,
      entryPrice: entryText,
      tp1: tp1Text,
      tp2: tp2Text,
      sl: slText,
      lotSize: trade.lotSize || 65,
      broadcastedPoints: new Set(),
      tp1Sent: false,
      tp2Sent: false,
      slSent: false
    });
  }
}

/**
 * Broadcast point progression ticks & target updates:
 * Sent as a SEPARATE REPLY directly to the original trade message!
 */
async function broadcastPriceTick(trade, currentLtp) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;

  const tradeKey = `${trade.index}_${trade.id}`;
  const tracked = activeTradesMap.get(tradeKey);
  if (!tracked || !tracked.messageId) return;

  const roundedLtp = Math.floor(currentLtp);
  const entry = tracked.entryPrice;
  const tp1 = tracked.tp1;
  const tp2 = tracked.tp2;
  const sl = tracked.sl;
  const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';
  const replyToId = tracked.messageId;

  // 1. Check Stop Loss Hit (Separate Reply)
  if (roundedLtp <= sl && !tracked.slSent) {
    tracked.slSent = true;
    const lossPts = entry - roundedLtp;
    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `🛑 <b>STOP LOSS HIT @ ${roundedLtp}</b> (-${lossPts} pts)\n` +
      `Exit position. Next setup coming up in 2 mins...`,
      replyToId
    );
    activeTradesMap.delete(tradeKey);
    return;
  }

  // 2. Check Target 2 Hit (Separate Reply)
  if (roundedLtp >= tp2 && !tracked.tp2Sent) {
    tracked.tp2Sent = true;
    const profitPts = roundedLtp - entry;
    const lotSize = tracked.lotSize || 65;
    const totalProfit = profitPts * lotSize;

    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `<b>${roundedLtp} 🚀🚀 TARGET 2 RUNNER HIT!</b>\n\n` +
      `🏆 <b>PROFIT BOOKED: +${profitPts} PTS (+₹${totalProfit.toLocaleString('en-IN')}/lot)</b>\n` +
      `✅ Trade successfully concluded with maximum target!`,
      replyToId
    );
    activeTradesMap.delete(tradeKey);
    return;
  }

  // 3. Check Target 1 Hit (Separate Reply)
  if (roundedLtp >= tp1 && !tracked.tp1Sent) {
    tracked.tp1Sent = true;
    const profitPts = tp1 - entry;
    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `<b>${roundedLtp} 🎯🎯 TARGET 1 HIT! (+${profitPts} pts)</b>\n` +
      `Book partial profit now & trail Stop Loss to cost!`,
      replyToId
    );
  }

  // 4. Point-by-point tick updates (Separate Reply: 34 ✅✅, 35 ✅✅...)
  if (roundedLtp > entry && roundedLtp <= tp2) {
    if (!tracked.broadcastedPoints.has(roundedLtp)) {
      tracked.broadcastedPoints.add(roundedLtp);

      const msg = `<b>${channelTitle}:</b>\n` +
        `<b>${roundedLtp} ✅✅</b>`;

      await sendTelegramMessage(msg, replyToId);
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
