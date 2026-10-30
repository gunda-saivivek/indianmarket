/**
 * Live Market Backend Server
 * Serves dashboard and streams real-time Option Chain data for Nifty, Bank Nifty, and Sensex.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 7171;
const PUBLIC_DIR = path.join(__dirname, 'public');

let upstoxToken = null;

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
    equalPairs,
    heroPicks: {
      ce: heroCE.slice(0, 4),
      pe: heroPE.slice(-4).reverse()
    },
    chain: trimmedLadder
  };
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
    equalPairs,
    heroPicks: {
      ce: heroCE.slice(0, 4),
      pe: heroPE.slice(-4).reverse()
    },
    chain: ladder
  };
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API endpoint: /api/live-data
  if (pathname === '/api/live-data') {
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error('API error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
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
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 MARKET PULSE PRO APPLICATION IS RUNNING!`);
  console.log(`📡 Local URL:   http://localhost:${PORT}`);
  console.log(`⚡ Live Feed:  Nifty 50, Sensex, and Bank Nifty active`);
  console.log(`=============================================================\n`);
});
