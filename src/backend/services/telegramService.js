/**
 * Telegram Auto-Alerts Broadcasting Service
 * Broadcasts trade entry calls, points progression, and target milestones using our brand name.
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

// Cache of milestones already broadcasted per signal to avoid spamming
// key = `${index}_${tradeId}` -> Set of milestones ['ENTERED', 34, 35, 'TP1', 'TP2']
const broadcastedMilestones = new Map();

/**
 * Broadcast initial trade call:
 * BUY NIFTY 50
 * 23400 CE
 * ABOVE 33
 * TARGET 50-65+++
 * SL 23
 */
async function broadcastTradeCall(trade) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;

  const key = `${trade.index}_${trade.id}`;
  if (!broadcastedMilestones.has(key)) {
    broadcastedMilestones.set(key, new Set());
  }
  const milestones = broadcastedMilestones.get(key);

  if (milestones.has('ENTRY_CALLED')) return;
  milestones.add('ENTRY_CALLED');

  const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';
  const indexTitle = trade.index === 'nifty' || trade.index === 'NIFTY' ? 'NIFTY 50' : trade.index === 'sensex' || trade.index === 'SENSEX' ? 'SENSEX' : 'BANK NIFTY';
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

  await sendTelegramMessage(message);
}

/**
 * Broadcast points progression ticks:
 * The Market Sniper Shooters:
 * 34 ✅✅
 * ...
 * The Market Sniper Shooters:
 * 50 🎯 TARGET 1 HIT! (+17 pts) ✅✅
 */
async function broadcastPriceTick(trade, currentLtp) {
  if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;

  const key = `${trade.index}_${trade.id}`;
  if (!broadcastedMilestones.has(key)) {
    broadcastedMilestones.set(key, new Set());
  }
  const milestones = broadcastedMilestones.get(key);

  const roundedLtp = Math.floor(currentLtp);
  const entry = Math.round(trade.fixedEntryPrice || trade.entryPrice);

  // Broadcast each point move above entry price (e.g. 34, 35, 36...)
  if (roundedLtp > entry && roundedLtp <= Math.round(trade.tp2) + 5) {
    if (!milestones.has(roundedLtp)) {
      milestones.add(roundedLtp);

      const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';
      const ptsGain = roundedLtp - entry;

      let msg = `<b>${channelTitle}:</b>\n` +
        `<b>${roundedLtp} ✅✅</b>`;

      if (roundedLtp >= Math.round(trade.tp1) && !milestones.has('TP1_ANNOUNCED')) {
        milestones.add('TP1_ANNOUNCED');
        msg = `<b>${channelTitle}:</b>\n` +
          `<b>${roundedLtp} 🎯 TARGET 1 HIT! (+${ptsGain} pts) ✅✅</b>`;
      } else if (roundedLtp >= Math.round(trade.tp2) && !milestones.has('TP2_ANNOUNCED')) {
        milestones.add('TP2_ANNOUNCED');
        msg = `<b>${channelTitle}:</b>\n` +
          `<b>${roundedLtp} 🚀 TARGET 2 RUNNER HIT! (+${ptsGain} pts) 🏆🔥</b>`;
      }

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
