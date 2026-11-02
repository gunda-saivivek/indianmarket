/**
 * Telegram Auto-Alerts Broadcasting Service
 * Strict Official Exchange LTP Verification Engine
 * 
 * Rules:
 * 1. ONLY real trades triggered strictly by actual NSE exchange prices.
 * 2. Point updates (✅✅) are ONLY broadcast if the real-time LTP from NSE officially crosses new higher milestones.
 * 3. 2-minute cadence between calls, and each trade has its own dedicated reply thread.
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

// Active Trades Registry
const activeTradesMap = new Map();
let lastTradeBroadcastTime = 0;
const TWO_MINUTES_MS = 2 * 60 * 1000;

/**
 * Broadcast initial trade call:
 * Rate-limited to at least 2 minutes between new calls
 */
async function broadcastTradeCall(trade) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;

  const tradeKey = `${trade.index}_${trade.id}`;
  if (activeTradesMap.has(tradeKey)) return;

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

    activeTradesMap.set(tradeKey, {
      key: tradeKey,
      messageId: resp.result.message_id,
      index: trade.index,
      id: trade.id,
      name: trade.name,
      strike: trade.strike,
      type: trade.type,
      entryPrice: entryText,
      isTriggered: false, // Trade must cross ABOVE entry price before it is considered active!
      highestAchieved: entryText, // Strict watermark tracker: only alerts when price exceeds this!
      tp1: tp1Text,
      tp2: tp2Text,
      sl: slText,
      lotSize: trade.lotSize || 65,
      tp1Sent: false,
      tp2Sent: false,
      slSent: false
    });
  }
}

/**
 * Broadcast price ticks strictly on verified NEW HIGHS (never on declines or retracements)
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

  // Activate trigger once market price reaches or crosses ABOVE entry price
  if (!tracked.isTriggered) {
    if (roundedLtp >= entry) {
      tracked.isTriggered = true;
      tracked.highestAchieved = roundedLtp;
    } else {
      // Trade has NOT triggered yet (price is still below entry price).
      // Do NOT check SL or send any alerts until the entry price has actually been crossed!
      return;
    }
  }

  // 1. Check Stop Loss Hit (only applies AFTER trade has been officially triggered)
  if (roundedLtp <= sl && !tracked.slSent) {
    tracked.slSent = true;
    const lossPts = entry - roundedLtp;
    await sendTelegramMessage(
      `<b>${channelTitle}:</b>\n` +
      `🛑 <b>STOP LOSS HIT @ ${roundedLtp}</b> (-${lossPts} pts)\n` +
      `Exit position. Next setup scanning...`,
      replyToId
    );
    activeTradesMap.delete(tradeKey);
    return;
  }

  // 2. Check Target 2 Runner Hit
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

  // 3. Check Target 1 Milestone Hit
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

  // 4. Strict watermark progression: Only send if price makes an actual NEW HIGH above entry!
  if (roundedLtp > tracked.highestAchieved && roundedLtp <= tp2) {
    tracked.highestAchieved = roundedLtp;

    const msg = `<b>${channelTitle}:</b>\n` +
      `<b>${roundedLtp} ✅✅</b>`;

    await sendTelegramMessage(msg, replyToId);
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
