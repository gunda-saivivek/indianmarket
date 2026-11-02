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
const SUBSCRIBERS_FILE = path.join(__dirname, '..', 'data', 'telegram_subscribers.json');

let telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
  channelName: process.env.TELEGRAM_CHANNEL_NAME || 'The Market Sniper Shooters',
  enabled: process.env.TELEGRAM_ENABLED === 'true' || false
};

// Multi-Subscriber List: Anyone who talks to the bot or starts it gets added!
let subscribers = new Set();

function loadSubscribers() {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const arr = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
      if (Array.isArray(arr)) arr.forEach(id => subscribers.add(id));
    }
  } catch (e) {}
  if (telegramConfig.chatId) {
    subscribers.add(telegramConfig.chatId);
  }
}

function saveSubscribers() {
  try {
    fs.mkdirSync(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(Array.from(subscribers), null, 2), 'utf8');
  } catch (e) {}
}

function addSubscriber(id) {
  if (!id) return;
  const strId = String(id);
  if (!subscribers.has(strId)) {
    subscribers.add(strId);
    saveSubscribers();
  }
}

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
loadSubscribers();

/**
 * Send message to a specific Telegram chat/channel (with optional reply_to_message_id)
 */
function sendTelegramMessageToChat(chatId, text, replyToMessageId = null) {
  return new Promise((resolve) => {
    if (!telegramConfig.botToken || !chatId) {
      return resolve({ success: false, error: 'Telegram Bot Token or Chat ID not configured.' });
    }

    const payloadObj = {
      chat_id: chatId,
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

/**
 * Broadcast message to ALL registered subscribers / channels
 */
async function sendTelegramMessage(text) {
  loadSubscribers();
  const allTargets = Array.from(subscribers);
  if (allTargets.length === 0 && telegramConfig.chatId) {
    allTargets.push(telegramConfig.chatId);
  }

  let firstResult = { success: false };
  for (const cid of allTargets) {
    try {
      const res = await sendTelegramMessageToChat(cid, text);
      if (!firstResult.success && res.success) {
        firstResult = res;
      }
    } catch (e) {}
  }
  return firstResult;
}

// Active Trades Registry: tradeKey -> { trackedTrade, perChatData: Map(chatId -> { messageId, highestAchieved, tp1Sent, tp2Sent, slSent }) }
const activeTradesMap = new Map();
let lastTradeBroadcastTime = 0;
const TWO_MINUTES_MS = 2 * 60 * 1000;

// Auto-Sync Polling to auto-register any user who types /start or opens the bot!
let lastPolledUpdateId = 0;
function pollTelegramUpdates() {
  if (!telegramConfig.botToken) return;

  const url = `https://api.telegram.org/bot${telegramConfig.botToken}/getUpdates?offset=${lastPolledUpdateId + 1}&limit=50`;
  https.get(url, (res) => {
    let d = '';
    res.on('data', chunk => d += chunk);
    res.on('end', () => {
      try {
        const j = JSON.parse(d);
        if (j.ok && Array.isArray(j.result)) {
          for (const u of j.result) {
            lastPolledUpdateId = Math.max(lastPolledUpdateId, u.update_id);
            const msg = u.message || u.channel_post || u.my_chat_member;
            const cid = msg?.chat?.id;
            if (cid) {
              const strCid = String(cid);
              if (!subscribers.has(strCid)) {
                addSubscriber(strCid);
                // Welcome newly connected subscriber
                sendTelegramMessageToChat(strCid, `🎯 <b>The Market Sniper Shooters</b>\n\n✅ You are successfully subscribed! Live institutional trade signals and profit progression ticks will now stream directly to this chat.`).catch(() => {});
              }
            }
          }
        }
      } catch (e) {}
    });
  }).on('error', () => {});
}

// Poll for new subscribers every 10 seconds
setInterval(pollTelegramUpdates, 10000);
pollTelegramUpdates();

function isIndianMarketOpen() {
  const now = new Date();
  // Get time in IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
  const day = istDate.getDay(); // 0 = Sun, 6 = Sat
  if (day === 0 || day === 6) return false;

  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // NSE Indian Market Hours: 9:15 AM (555 min) to 3:30 PM (930 min)
  return timeInMinutes >= 555 && timeInMinutes <= 930;
}

/**
 * Broadcast initial trade call to ALL subscribers:
 * Rate-limited to at least 2 minutes between new calls and STRICTLY during market hours!
 */
async function broadcastTradeCall(trade) {
  if (!telegramConfig.enabled || !telegramConfig.botToken) return;

  // Strict check: DO NOT broadcast trade calls once NSE market closes (after 3:30 PM IST or weekends)
  if (!isIndianMarketOpen()) {
    return;
  }

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
  const entryBase = Math.round(trade.fixedEntryPrice || trade.entryPrice);
  
  // Calculate Realistic Entry Buffer:
  // e.g., for premium 75 -> buffer is 4 pts (Entry Range: 75 - 79 | Max Cap: 81)
  // for premium 25 -> buffer is 2 pts (Entry Range: 25 - 27 | Max Cap: 28)
  const bufferPts = Math.max(2, Math.min(6, Math.round(entryBase * 0.05)));
  const entryMax = entryBase + bufferPts;
  const maxBuyCap = entryMax + Math.max(1, Math.round(bufferPts * 0.5));
  
  const tp1Text = Math.round(trade.tp1);
  const tp2Text = Math.round(trade.tp2);
  const slText = Math.round(trade.sl);

  const message = `<b>${channelTitle}</b>\n\n` +
    `<b>BUY ${indexTitle}</b>\n\n` +
    `🎯 <b>${strikeText}</b>\n\n` +
    `📍 <b>ENTRY ZONE: ${entryBase} - ${entryMax}</b>\n` +
    `⛔ <i>Max Cap: ${maxBuyCap} (Do NOT chase above this)</i>\n\n` +
    `🎯 <b>TARGET 1: ${tp1Text}</b>\n` +
    `🚀 <b>TARGET 2: ${tp2Text}+++</b>\n\n` +
    `🛑 <b>STRICT SL: ${slText}</b>`;

  loadSubscribers();
  const allTargets = Array.from(subscribers);
  if (allTargets.length === 0 && telegramConfig.chatId) {
    allTargets.push(telegramConfig.chatId);
  }

  const perChatMap = new Map();
  let anyDelivered = false;

  for (const cid of allTargets) {
    try {
      const resp = await sendTelegramMessageToChat(cid, message);
      if (resp.success && resp.result?.message_id) {
        anyDelivered = true;
        perChatMap.set(String(cid), {
          messageId: resp.result.message_id,
          highestAchieved: entryBase,
          entryFiredSent: false,
          capExceededSent: false,
          tp1Sent: false,
          tp2Sent: false,
          slSent: false
        });
      }
    } catch (e) {}
  }

  if (anyDelivered) {
    lastTradeBroadcastTime = now;
    activeTradesMap.set(tradeKey, {
      key: tradeKey,
      index: trade.index,
      id: trade.id,
      name: trade.name,
      strike: trade.strike,
      type: trade.type,
      entryPrice: entryBase,
      entryMax: entryMax,
      maxBuyCap: maxBuyCap,
      isTriggered: false, // Trade must cross into entry zone before it is considered active!
      tp1: tp1Text,
      tp2: tp2Text,
      sl: slText,
      lotSize: trade.lotSize || 65,
      perChatMap
    });
  }
}

/**
 * Broadcast price ticks strictly on verified NEW HIGHS to all subscribers
 */
async function broadcastPriceTick(trade, currentLtp) {
  if (!telegramConfig.enabled || !telegramConfig.botToken) return;

  // Stop broadcasting ticks once Indian market is closed
  if (!isIndianMarketOpen()) return;

  const tradeKey = `${trade.index}_${trade.id}`;
  const tracked = activeTradesMap.get(tradeKey);
  if (!tracked || !tracked.perChatMap || tracked.perChatMap.size === 0) return;

  const roundedLtp = Math.floor(currentLtp);
  const entry = tracked.entryPrice;
  const tp1 = tracked.tp1;
  const tp2 = tracked.tp2;
  const sl = tracked.sl;
  const channelTitle = telegramConfig.channelName || 'The Market Sniper Shooters';

  // Activate trigger once market price reaches or enters entry zone
  if (!tracked.isTriggered) {
    if (roundedLtp >= entry) {
      tracked.isTriggered = true;
      for (const [cid, chatData] of tracked.perChatMap.entries()) {
        chatData.highestAchieved = roundedLtp;
        if (!chatData.entryFiredSent) {
          chatData.entryFiredSent = true;
          // Send instant "TRIGGER ACTIVE - ENTER IN ZONE" alert
          sendTelegramMessageToChat(
            cid,
            `<b>${channelTitle}:</b>\n` +
            `⚡ <b>TRIGGER ACTIVATED @ ${roundedLtp}</b>\n` +
            `Enter position inside <b>${tracked.entryPrice} - ${tracked.entryMax}</b> zone!`,
            chatData.messageId
          ).catch(() => {});
        }
      }
    } else {
      // Trade has NOT triggered yet (price is still below entry zone).
      // Do NOT check SL or send any alerts until the entry zone has actually been breached!
      return;
    }
  }

  // Iterate over each subscriber/chat so threaded replies match their message ID
  for (const [cid, chatData] of tracked.perChatMap.entries()) {
    const replyToId = chatData.messageId;

    // Check if price blew past Max Buy Cap (warn users not to chase)
    if (roundedLtp > tracked.maxBuyCap && !chatData.capExceededSent && !chatData.tp1Sent) {
      chatData.capExceededSent = true;
      sendTelegramMessageToChat(
        cid,
        `<b>${channelTitle}:</b>\n` +
        `⚠️ <b>PRICE SPIKED TO ${roundedLtp} (ABOVE CAP ${tracked.maxBuyCap})</b>\n` +
        `<i>DO NOT FOMO BUY! Only enter if price pulls back to ${tracked.entryPrice}-${tracked.entryMax}.</i>`,
        replyToId
      ).catch(() => {});
    }

    // 1. Check Stop Loss Hit
    if (roundedLtp <= sl && !chatData.slSent) {
      chatData.slSent = true;
      const lossPts = entry - roundedLtp;
      await sendTelegramMessageToChat(
        cid,
        `<b>${channelTitle}:</b>\n` +
        `🛑 <b>STOP LOSS HIT @ ${roundedLtp}</b> (-${lossPts} pts)\n` +
        `Exit position. Next setup scanning...`,
        replyToId
      );
      continue;
    }

    // 2. Check Target 2 Runner Hit
    if (roundedLtp >= tp2 && !chatData.tp2Sent) {
      chatData.tp2Sent = true;
      const profitPts = roundedLtp - entry;
      const lotSize = tracked.lotSize || 65;
      const totalProfit = profitPts * lotSize;

      await sendTelegramMessageToChat(
        cid,
        `<b>${channelTitle}:</b>\n` +
        `<b>${roundedLtp} 🚀🚀 TARGET 2 RUNNER HIT!</b>\n\n` +
        `🏆 <b>PROFIT BOOKED: +${profitPts} PTS (+₹${totalProfit.toLocaleString('en-IN')}/lot)</b>\n` +
        `✅ Trade successfully concluded with maximum target!`,
        replyToId
      );
      continue;
    }

    // 3. Check Target 1 Milestone Hit
    if (roundedLtp >= tp1 && !chatData.tp1Sent) {
      chatData.tp1Sent = true;
      const profitPts = tp1 - entry;
      await sendTelegramMessageToChat(
        cid,
        `<b>${channelTitle}:</b>\n` +
        `<b>${roundedLtp} 🎯🎯 TARGET 1 HIT! (+${profitPts} pts)</b>\n` +
        `Book partial profit now & trail Stop Loss to cost!`,
        replyToId
      );
    }

    // 4. Strict watermark progression: Only send if price makes an actual NEW HIGH above entry!
    if (roundedLtp > chatData.highestAchieved && roundedLtp <= tp2) {
      chatData.highestAchieved = roundedLtp;

      const msg = `<b>${channelTitle}:</b>\n` +
        `<b>${roundedLtp} ✅✅</b>`;

      await sendTelegramMessageToChat(cid, msg, replyToId);
    }
  }

  // Cleanup if all chats reached SL or TP2
  const allFinished = Array.from(tracked.perChatMap.values()).every(c => c.slSent || c.tp2Sent);
  if (allFinished) {
    activeTradesMap.delete(tradeKey);
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
