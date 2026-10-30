/**
 * PHOTOREALISTIC ANIMATED TRADINGVIEW CANDLESTICK CHART ENGINE
 * Generates vector-sharp, GIF-style animated TradingView candlestick charts
 * with real OHLC candles, wicks, volume histograms, right price scale,
 * position tools, and interactive animated playback effects.
 */

function makeAnimatedTradingViewChart({
  id = "chart",
  symbol = "NIFTY 50 • 5m • NSE",
  candles = [],
  entryPrice,
  stopLossPrice,
  target1Price,
  target2Price,
  zones = [],        // { yTop, yBottom, color, label, isAnimated }
  patternLines = [], // { x1, y1, x2, y2, color, label }
  annotations = [],  // { candleIdx, text, position: 'above'|'below', color, isAnimated }
  showVwap = true,
  riskReward = "1:3.2",
  setupName = "INSTITUTIONAL SETUP"
}) {
  const width = 920;
  const height = 500;
  const chartLeft = 50;
  const chartRight = 830;
  const chartTop = 50;
  const chartBottom = 390;
  const volBottom = 450;
  const volHeight = 55;

  let allPrices = [];
  candles.forEach(c => allPrices.push(c.h, c.l));
  if (entryPrice) allPrices.push(entryPrice);
  if (stopLossPrice) allPrices.push(stopLossPrice);
  if (target1Price) allPrices.push(target1Price);
  if (target2Price) allPrices.push(target2Price);

  let rawMin = Math.min(...allPrices);
  let rawMax = Math.max(...allPrices);
  const range = rawMax - rawMin || 100;
  const minPrice = rawMin - range * 0.08;
  const maxPrice = rawMax + range * 0.08;

  function getY(price) {
    return chartTop + ((maxPrice - price) / (maxPrice - minPrice)) * (chartBottom - chartTop);
  }

  const numCandles = candles.length;
  const candleSpacing = (chartRight - chartLeft) / (numCandles + 2);
  const candleWidth = Math.max(7, candleSpacing * 0.65);

  function getX(idx) {
    return chartLeft + (idx + 1) * candleSpacing;
  }

  const maxVol = Math.max(...candles.map(c => c.v || 1000));

  // Step for price axis
  const step = Math.round(range / 6 / 10) * 10 || 20;
  const firstTick = Math.ceil(minPrice / step) * step;
  let gridLinesSvg = '';
  let priceTicksSvg = '';

  for (let p = firstTick; p <= maxPrice; p += step) {
    const y = getY(p);
    if (y >= chartTop && y <= chartBottom) {
      gridLinesSvg += `<line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#1e222d" stroke-dasharray="2" stroke-width="0.8"/>\n`;
      priceTicksSvg += `<text x="${chartRight + 8}" y="${(y + 3.5).toFixed(1)}" fill="#787b86" font-size="10.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${p.toFixed(1)}</text>\n`;
    }
  }

  // Candles, Wicks, Volume, VWAP
  let candlesSvg = '';
  let volSvg = '';
  let vwapPoints = [];
  let cumPv = 0;
  let cumV = 0;

  // The last 4-5 candles can be animated as the "Replay" action
  const replayThreshold = Math.max(0, candles.length - 4);

  candles.forEach((c, i) => {
    const x = getX(i);
    const yO = getY(c.o);
    const yC = getY(c.c);
    const yH = getY(c.h);
    const yL = getY(c.l);
    const isBull = c.c >= c.o;
    const color = isBull ? '#089981' : '#f23645';
    const isReplay = i >= replayThreshold;
    const animClass = isReplay ? `anim-replay-${i - replayThreshold}` : '';

    // Candle Group
    candlesSvg += `
      <g class="${animClass}">
        <!-- Wick -->
        <line x1="${x.toFixed(1)}" y1="${yH.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yL.toFixed(1)}" stroke="${color}" stroke-width="1.3"/>
        <!-- Real Body -->
        <rect x="${(x - candleWidth / 2).toFixed(1)}" y="${Math.min(yO, yC).toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${Math.max(2.5, Math.abs(yC - yO)).toFixed(1)}" fill="${color}" stroke="${color}" rx="0.5"/>
      </g>
    `;

    // Volume Bar
    const vH = ((c.v || 1000) / maxVol) * volHeight;
    volSvg += `<rect class="${animClass}" x="${(x - candleWidth / 2).toFixed(1)}" y="${(volBottom - vH).toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${vH.toFixed(1)}" fill="${color}" fill-opacity="0.45"/>\n`;

    // Typical price for VWAP
    const typical = (c.h + c.l + c.c) / 3;
    cumPv += typical * (c.v || 1000);
    cumV += (c.v || 1000);
    const vwapVal = cumPv / cumV;
    vwapPoints.push(`${x.toFixed(1)},${getY(vwapVal).toFixed(1)}`);
  });

  // Zones (FVG, iFVG, Order Blocks, Golden Pocket, Malaysian SNR)
  let zonesSvg = '';
  zones.forEach(z => {
    const yTop = getY(Math.max(z.yTop, z.yBottom));
    const yBot = getY(Math.min(z.yTop, z.yBottom));
    const h = Math.abs(yBot - yTop);
    const isAnim = z.isAnimated ? 'anim-zone-pulse' : '';
    zonesSvg += `
      <rect class="${isAnim}" x="${chartLeft}" y="${yTop.toFixed(1)}" width="${chartRight - chartLeft}" height="${h.toFixed(1)}" fill="${z.color}" fill-opacity="0.14" stroke="${z.color}" stroke-width="1.2" stroke-dasharray="3"/>
      <text x="${chartLeft + 12}" y="${(yTop + 14).toFixed(1)}" fill="${z.color}" font-size="10" font-family="monospace" font-weight="bold">${z.label}</text>
    `;
  });

  // VWAP Curve
  let vwapSvg = '';
  if (showVwap && vwapPoints.length > 1) {
    vwapSvg = `
      <polyline points="${vwapPoints.join(' ')}" fill="none" stroke="#f7a600" stroke-width="1.8" stroke-dasharray="4"/>
      <text x="${chartRight - 120}" y="70" fill="#f7a600" font-size="10" font-family="monospace" font-weight="bold">VWAP BENCHMARK</text>
    `;
  }

  // TradingView Long / Short Position Box Tool
  let positionBoxSvg = '';
  if (entryPrice && stopLossPrice && target1Price) {
    const entryIdx = Math.floor(candles.length * 0.52);
    const boxX = getX(entryIdx);
    const boxW = (chartRight - boxX) - 15;
    const yEntry = getY(entryPrice);
    const ySL = getY(stopLossPrice);
    const yTgt = getY(target1Price);
    const isLong = target1Price > entryPrice;

    if (isLong) {
      positionBoxSvg += `
        <g class="anim-position-tool">
          <!-- Green Target Box -->
          <rect x="${boxX.toFixed(1)}" y="${yTgt.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yEntry - yTgt).toFixed(1)}" fill="#089981" fill-opacity="0.20" stroke="#089981" stroke-width="1.3"/>
          <text x="${(boxX + 10).toFixed(1)}" y="${(yTgt + 18).toFixed(1)}" fill="#089981" font-size="10.5" font-family="monospace" font-weight="bold">TARGET 1: +${(target1Price - entryPrice).toFixed(1)} pts (RR ${riskReward})</text>

          <!-- Red Stop Box -->
          <rect x="${boxX.toFixed(1)}" y="${yEntry.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(ySL - yEntry).toFixed(1)}" fill="#f23645" fill-opacity="0.20" stroke="#f23645" stroke-width="1.3"/>
          <text x="${(boxX + 10).toFixed(1)}" y="${(ySL - 10).toFixed(1)}" fill="#f23645" font-size="10.5" font-family="monospace" font-weight="bold">STOP LOSS: -${(entryPrice - stopLossPrice).toFixed(1)} pts</text>
        </g>
      `;
    } else {
      positionBoxSvg += `
        <g class="anim-position-tool">
          <!-- Green Target Box Below -->
          <rect x="${boxX.toFixed(1)}" y="${yEntry.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yTgt - yEntry).toFixed(1)}" fill="#089981" fill-opacity="0.20" stroke="#089981" stroke-width="1.3"/>
          <text x="${(boxX + 10).toFixed(1)}" y="${(yTgt - 10).toFixed(1)}" fill="#089981" font-size="10.5" font-family="monospace" font-weight="bold">TARGET 1: +${(entryPrice - target1Price).toFixed(1)} pts (RR ${riskReward})</text>

          <!-- Red Stop Box Above -->
          <rect x="${boxX.toFixed(1)}" y="${ySL.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yEntry - ySL).toFixed(1)}" fill="#f23645" fill-opacity="0.20" stroke="#f23645" stroke-width="1.3"/>
          <text x="${(boxX + 10).toFixed(1)}" y="${(ySL + 18).toFixed(1)}" fill="#f23645" font-size="10.5" font-family="monospace" font-weight="bold">STOP LOSS: -${(stopLossPrice - entryPrice).toFixed(1)} pts</text>
        </g>
      `;
    }
  }

  // Price Lines & Badges
  let levelsSvg = '';
  if (entryPrice) {
    const y = getY(entryPrice);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#089981" stroke-width="2" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 11).toFixed(1)}" width="88" height="22" fill="#089981" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#000000" font-size="10" font-family="monospace" font-weight="bold">ENTRY ${entryPrice.toFixed(1)}</text>
    `;
  }
  if (stopLossPrice) {
    const y = getY(stopLossPrice);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#f23645" stroke-width="2" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 11).toFixed(1)}" width="88" height="22" fill="#f23645" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#ffffff" font-size="10" font-family="monospace" font-weight="bold">SL ${stopLossPrice.toFixed(1)}</text>
    `;
  }
  if (target1Price) {
    const y = getY(target1Price);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 11).toFixed(1)}" width="88" height="22" fill="#38bdf8" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#000000" font-size="10" font-family="monospace" font-weight="bold">TGT 1 ${target1Price.toFixed(1)}</text>
    `;
  }
  if (target2Price) {
    const y = getY(target2Price);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#00c076" stroke-width="2" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 11).toFixed(1)}" width="88" height="22" fill="#00c076" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#000000" font-size="10" font-family="monospace" font-weight="bold">TGT 2 ${target2Price.toFixed(1)}</text>
    `;
  }

  // Annotations
  let annotationsSvg = '';
  annotations.forEach(a => {
    const c = candles[a.candleIdx];
    if (!c) return;
    const x = getX(a.candleIdx);
    const isAbove = a.position === 'above';
    const yAnchor = isAbove ? getY(c.h) - 12 : getY(c.l) + 12;
    const yText = isAbove ? yAnchor - 14 : yAnchor + 18;
    const color = a.color || '#f7a600';
    const isAnim = a.isAnimated ? 'anim-badge-glow' : '';

    annotationsSvg += `
      <g class="${isAnim}">
        <circle cx="${x.toFixed(1)}" cy="${isAbove ? getY(c.h).toFixed(1) : getY(c.l).toFixed(1)}" r="4.5" fill="${color}"/>
        <line x1="${x.toFixed(1)}" y1="${isAbove ? getY(c.h).toFixed(1) : getY(c.l).toFixed(1)}" x2="${x.toFixed(1)}" y2="${yAnchor.toFixed(1)}" stroke="${color}" stroke-width="1.5"/>
        <rect x="${(x - 62).toFixed(1)}" y="${(yText - 11).toFixed(1)}" width="124" height="20" fill="#1e222d" stroke="${color}" stroke-width="1.2" rx="4"/>
        <text x="${x.toFixed(1)}" y="${(yText + 3).toFixed(1)}" fill="${color}" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="middle">${a.text}</text>
      </g>
    `;
  });

  const lastC = candles[candles.length - 1] || { o: 0, h: 0, l: 0, c: 0 };
  const lastChange = (lastC.c - candles[0].o).toFixed(1);
  const lastChangePct = (((lastC.c - candles[0].o) / candles[0].o) * 100).toFixed(2);
  const isUp = lastChange >= 0;

  return `
<svg viewBox="0 0 ${width} ${height}" class="w-full h-auto rounded-2xl shadow-2xl border border-[#2a2e39]" style="background-color: #131722; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, sans-serif;">
  <defs>
    <style>
      @keyframes replayLoop {
        0%, 15% { opacity: 0.15; transform: translateY(4px); }
        35%, 85% { opacity: 1; transform: translateY(0); }
        95%, 100% { opacity: 1; }
      }
      @keyframes pulseTool {
        0%, 100% { filter: drop-shadow(0 0 2px #089981); opacity: 0.85; }
        50% { filter: drop-shadow(0 0 8px #089981); opacity: 1; }
      }
      @keyframes zonePulse {
        0%, 100% { fill-opacity: 0.12; }
        50% { fill-opacity: 0.30; }
      }
      @keyframes blinkCursor {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes badgeGlow {
        0%, 100% { filter: drop-shadow(0 0 2px #f7a600); }
        50% { filter: drop-shadow(0 0 6px #f7a600); }
      }
      .anim-replay-0 { animation: replayLoop 5s infinite ease-out; animation-delay: 0.4s; }
      .anim-replay-1 { animation: replayLoop 5s infinite ease-out; animation-delay: 0.8s; }
      .anim-replay-2 { animation: replayLoop 5s infinite ease-out; animation-delay: 1.2s; }
      .anim-replay-3 { animation: replayLoop 5s infinite ease-out; animation-delay: 1.6s; }
      .anim-position-tool { animation: pulseTool 3s infinite ease-in-out; }
      .anim-zone-pulse { animation: zonePulse 2.5s infinite ease-in-out; }
      .anim-live-blink { animation: blinkCursor 1.2s infinite; }
      .anim-badge-glow { animation: badgeGlow 2s infinite ease-in-out; }
    </style>
  </defs>

  <!-- Header Bar -->
  <rect x="0" y="0" width="${width}" height="40" fill="#171b26"/>
  <line x1="0" y1="40" x2="${width}" y2="40" stroke="#2a2e39" stroke-width="1"/>
  
  <!-- Symbol & Replay Status -->
  <text x="18" y="25" fill="#ffffff" font-size="13" font-weight="bold">${symbol}</text>
  <circle cx="170" cy="21" r="4.5" fill="#089981" class="anim-live-blink"/>
  <text x="182" y="25" fill="#089981" font-size="11" font-weight="bold" font-family="monospace">AUTHENTIC CANDLESTICK REPLAY (GIF-STYLE)</text>

  <!-- Current Bar OHLC in Header -->
  <text x="520" y="25" fill="#787b86" font-size="11" font-family="monospace">
    O <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.o.toFixed(1)}</tspan>  
    H <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.h.toFixed(1)}</tspan>  
    L <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.l.toFixed(1)}</tspan>  
    C <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.c.toFixed(1)}</tspan>
  </text>

  <!-- Right Price Axis -->
  <rect x="${chartRight}" y="40" width="${width - chartRight}" height="${height - 40}" fill="#131722"/>
  <line x1="${chartRight}" y1="40" x2="${chartRight}" y2="${height}" stroke="#2a2e39" stroke-width="1"/>

  <!-- Horizontal Grid Lines & Price Ticks -->
  ${gridLinesSvg}
  ${priceTicksSvg}

  <!-- Shaded Zones (Order Blocks, iFVG, Golden Pocket, Malaysian SNR) -->
  ${zonesSvg}

  <!-- Volume Sub-Panel Grid -->
  <line x1="${chartLeft}" y1="${volBottom}" x2="${chartRight}" y2="${volBottom}" stroke="#2a2e39" stroke-width="1"/>
  <text x="${chartLeft}" y="${chartBottom + 16}" fill="#787b86" font-size="9" font-family="monospace">VOLUME</text>
  ${volSvg}

  <!-- TradingView Long/Short Position Tool Box -->
  ${positionBoxSvg}

  <!-- VWAP Indicator -->
  ${vwapSvg}

  <!-- Pure Candlesticks -->
  ${candlesSvg}

  <!-- Target & Stop Loss Levels -->
  ${levelsSvg}

  <!-- Annotations & Callout Badges -->
  ${annotationsSvg}

  <!-- Bottom Time Axis -->
  <line x1="0" y1="${height - 24}" x2="${width}" y2="${height - 24}" stroke="#2a2e39" stroke-width="1"/>
  <text x="${getX(1)}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">09:15</text>
  <text x="${getX(Math.floor(candles.length * 0.25))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">10:30</text>
  <text x="${getX(Math.floor(candles.length * 0.50))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">12:00</text>
  <text x="${getX(Math.floor(candles.length * 0.75))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">13:30</text>
  <text x="${getX(candles.length - 2)}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">15:15</text>

  <!-- Watermark -->
  <text x="${chartLeft + 15}" y="${chartBottom - 15}" fill="#ffffff" fill-opacity="0.04" font-size="26" font-family="monospace" font-weight="900">THE MARKET SNIPER SHOOTERS</text>
</svg>
`;
}

module.exports = { makeAnimatedTradingViewChart };
