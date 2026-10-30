/**
 * Test TradingView realistic candlestick chart engine
 */

function renderTradingViewChart({
  symbol = "NIFTY 50 • 5m • NSE",
  candles = [],
  entryPrice,
  stopLossPrice,
  target1Price,
  target2Price,
  patternLines = [], // { x1, y1, x2, y2, color, label }
  zones = [],        // { yTop, yBottom, color, label }
  annotations = [],  // { candleIdx, text, position: 'above'|'below', color }
  showVwap = true,
  riskReward = "1:3.2"
}) {
  const width = 900;
  const height = 480;
  const chartLeft = 50;
  const chartRight = 815;
  const chartTop = 45;
  const chartBottom = 380;
  const volBottom = 440;
  const volHeight = 50;

  // Find min and max price with padding
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
  const candleWidth = Math.max(6, candleSpacing * 0.65);

  function getX(idx) {
    return chartLeft + (idx + 1) * candleSpacing;
  }

  // Max volume for scaling
  const maxVol = Math.max(...candles.map(c => c.v || 1000));

  // Build grid ticks
  const step = Math.round(range / 6 / 10) * 10 || 20;
  const firstTick = Math.ceil(minPrice / step) * step;
  let gridLinesSvg = '';
  let priceTicksSvg = '';

  for (let p = firstTick; p <= maxPrice; p += step) {
    const y = getY(p);
    if (y >= chartTop && y <= chartBottom) {
      gridLinesSvg += `<line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#1e222d" stroke-dasharray="2" stroke-width="0.8"/>\n`;
      priceTicksSvg += `<text x="${chartRight + 8}" y="${(y + 3.5).toFixed(1)}" fill="#787b86" font-size="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${p.toFixed(1)}</text>\n`;
    }
  }

  // Candles & Volume SVG
  let candlesSvg = '';
  let volSvg = '';
  let vwapPoints = [];

  let cumPv = 0;
  let cumV = 0;

  candles.forEach((c, i) => {
    const x = getX(i);
    const yO = getY(c.o);
    const yC = getY(c.c);
    const yH = getY(c.h);
    const yL = getY(c.l);
    const isBull = c.c >= c.o;
    const color = isBull ? '#089981' : '#f23645';

    // Wick
    candlesSvg += `<line x1="${x.toFixed(1)}" y1="${yH.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yL.toFixed(1)}" stroke="${color}" stroke-width="1.2"/>\n`;

    // Real Body
    const bodyTop = Math.min(yO, yC);
    const bodyHeight = Math.max(2, Math.abs(yC - yO));
    candlesSvg += `<rect x="${(x - candleWidth / 2).toFixed(1)}" y="${bodyTop.toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${bodyHeight.toFixed(1)}" fill="${color}" stroke="${color}" rx="0.5"/>\n`;

    // Volume bar
    const vH = ((c.v || 1000) / maxVol) * volHeight;
    volSvg += `<rect x="${(x - candleWidth / 2).toFixed(1)}" y="${(volBottom - vH).toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${vH.toFixed(1)}" fill="${color}" fill-opacity="0.45"/>\n`;

    // VWAP calculation
    const typical = (c.h + c.l + c.c) / 3;
    cumPv += typical * (c.v || 1000);
    cumV += (c.v || 1000);
    const vwapVal = cumPv / cumV;
    vwapPoints.push(`${x.toFixed(1)},${getY(vwapVal).toFixed(1)}`);
  });

  // Zones (e.g. Order blocks, Golden Pocket, Neckline)
  let zonesSvg = '';
  zones.forEach(z => {
    const yTop = getY(Math.max(z.yTop, z.yBottom));
    const yBot = getY(Math.min(z.yTop, z.yBottom));
    const h = Math.abs(yBot - yTop);
    zonesSvg += `
      <rect x="${chartLeft}" y="${yTop.toFixed(1)}" width="${chartRight - chartLeft}" height="${h.toFixed(1)}" fill="${z.color}" fill-opacity="0.14" stroke="${z.color}" stroke-width="1" stroke-dasharray="3"/>
      <text x="${chartLeft + 10}" y="${(yTop + 14).toFixed(1)}" fill="${z.color}" font-size="10" font-family="monospace" font-weight="bold">${z.label}</text>
    `;
  });

  // VWAP Curve
  let vwapSvg = '';
  if (showVwap && vwapPoints.length > 1) {
    vwapSvg = `<polyline points="${vwapPoints.join(' ')}" fill="none" stroke="#f7a600" stroke-width="1.8" stroke-dasharray="4"/>
    <text x="${chartRight - 120}" y="60" fill="#f7a600" font-size="10" font-family="monospace">VWAP (Session)</text>`;
  }

  // TradingView Long Position Box (at entry)
  let positionBoxSvg = '';
  if (entryPrice && stopLossPrice && target1Price) {
    const entryIdx = Math.floor(candles.length * 0.55);
    const boxX = getX(entryIdx);
    const boxW = (chartRight - boxX) - 15;
    const yEntry = getY(entryPrice);
    const ySL = getY(stopLossPrice);
    const yTgt = getY(target1Price);

    // If long: target is above entry
    const isLong = target1Price > entryPrice;

    if (isLong) {
      // Green target box
      positionBoxSvg += `
        <rect x="${boxX.toFixed(1)}" y="${yTgt.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yEntry - yTgt).toFixed(1)}" fill="#089981" fill-opacity="0.18" stroke="#089981" stroke-width="1.2"/>
        <text x="${(boxX + 8).toFixed(1)}" y="${(yTgt + 16).toFixed(1)}" fill="#089981" font-size="10" font-family="monospace" font-weight="bold">TARGET 1: +${(target1Price - entryPrice).toFixed(1)} pts (${riskReward})</text>
        
        <!-- Red stop box -->
        <rect x="${boxX.toFixed(1)}" y="${yEntry.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(ySL - yEntry).toFixed(1)}" fill="#f23645" fill-opacity="0.18" stroke="#f23645" stroke-width="1.2"/>
        <text x="${(boxX + 8).toFixed(1)}" y="${(ySL - 8).toFixed(1)}" fill="#f23645" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS: -${(entryPrice - stopLossPrice).toFixed(1)} pts</text>
      `;
    } else {
      // Short position box
      positionBoxSvg += `
        <rect x="${boxX.toFixed(1)}" y="${yEntry.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yTgt - yEntry).toFixed(1)}" fill="#089981" fill-opacity="0.18" stroke="#089981" stroke-width="1.2"/>
        <text x="${(boxX + 8).toFixed(1)}" y="${(yTgt - 8).toFixed(1)}" fill="#089981" font-size="10" font-family="monospace" font-weight="bold">TARGET 1: +${(entryPrice - target1Price).toFixed(1)} pts (${riskReward})</text>
        
        <!-- Red stop box -->
        <rect x="${boxX.toFixed(1)}" y="${ySL.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yEntry - ySL).toFixed(1)}" fill="#f23645" fill-opacity="0.18" stroke="#f23645" stroke-width="1.2"/>
        <text x="${(boxX + 8).toFixed(1)}" y="${(ySL + 16).toFixed(1)}" fill="#f23645" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS: -${(stopLossPrice - entryPrice).toFixed(1)} pts</text>
      `;
    }
  }

  // Horizontal price lines & labels
  let levelsSvg = '';
  if (entryPrice) {
    const y = getY(entryPrice);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#089981" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="80" height="20" fill="#089981" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">ENTRY ${entryPrice.toFixed(1)}</text>
    `;
  }
  if (stopLossPrice) {
    const y = getY(stopLossPrice);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#f23645" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="80" height="20" fill="#f23645" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4).toFixed(1)}" fill="#ffffff" font-size="9.5" font-family="monospace" font-weight="bold">SL ${stopLossPrice.toFixed(1)}</text>
    `;
  }
  if (target1Price) {
    const y = getY(target1Price);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="80" height="20" fill="#38bdf8" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">TGT 1 ${target1Price.toFixed(1)}</text>
    `;
  }
  if (target2Price) {
    const y = getY(target2Price);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#00c076" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="80" height="20" fill="#00c076" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">TGT 2 ${target2Price.toFixed(1)}</text>
    `;
  }

  // Annotations (arrows & text)
  let annotationsSvg = '';
  annotations.forEach(a => {
    const c = candles[a.candleIdx];
    if (!c) return;
    const x = getX(a.candleIdx);
    const isAbove = a.position === 'above';
    const yAnchor = isAbove ? getY(c.h) - 12 : getY(c.l) + 12;
    const yText = isAbove ? yAnchor - 12 : yAnchor + 16;
    const color = a.color || '#f7a600';

    annotationsSvg += `
      <circle cx="${x.toFixed(1)}" cy="${isAbove ? getY(c.h).toFixed(1) : getY(c.l).toFixed(1)}" r="4" fill="${color}"/>
      <line x1="${x.toFixed(1)}" y1="${isAbove ? getY(c.h).toFixed(1) : getY(c.l).toFixed(1)}" x2="${x.toFixed(1)}" y2="${yAnchor.toFixed(1)}" stroke="${color}" stroke-width="1.5"/>
      <rect x="${(x - 55).toFixed(1)}" y="${(yText - 10).toFixed(1)}" width="110" height="18" fill="#1e222d" stroke="${color}" stroke-width="1" rx="3"/>
      <text x="${x.toFixed(1)}" y="${(yText + 3).toFixed(1)}" fill="${color}" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${a.text}</text>
    `;
  });

  // Last candle stats for header
  const lastC = candles[candles.length - 1] || { o: 0, h: 0, l: 0, c: 0 };
  const lastChange = (lastC.c - candles[0].o).toFixed(1);
  const lastChangePct = (((lastC.c - candles[0].o) / candles[0].o) * 100).toFixed(2);
  const isUp = lastChange >= 0;

  return `
<svg viewBox="0 0 ${width} ${height}" class="w-full h-auto rounded-xl shadow-2xl border border-[#2a2e39]" style="background-color: #131722; font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;">
  
  <!-- Chart Top Header Bar -->
  <rect x="0" y="0" width="${width}" height="36" fill="#131722" border-bottom="1px solid #2a2e39"/>
  <line x1="0" y1="36" x2="${width}" y2="36" stroke="#2a2e39" stroke-width="1"/>
  
  <!-- Symbol & Timeframe -->
  <text x="16" y="23" fill="#d1d4dc" font-size="12" font-weight="bold">${symbol}</text>
  <circle cx="150" cy="19" r="3" fill="#089981"/>
  <text x="162" y="23" fill="#787b86" font-size="11">O <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.o.toFixed(1)}</tspan> H <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.h.toFixed(1)}</tspan> L <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.l.toFixed(1)}</tspan> C <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.c.toFixed(1)}</tspan> <tspan fill="${isUp ? '#089981' : '#f23645'}">${isUp ? '+' : ''}${lastChange} (${lastChangePct}%)</tspan></text>

  <!-- Right Price Axis Background -->
  <rect x="${chartRight}" y="36" width="${width - chartRight}" height="${height - 36}" fill="#131722"/>
  <line x1="${chartRight}" y1="36" x2="${chartRight}" y2="${height}" stroke="#2a2e39" stroke-width="1"/>

  <!-- Grid Lines & Ticks -->
  ${gridLinesSvg}
  ${priceTicksSvg}

  <!-- Zones (Order Blocks, Fib, Neckline) -->
  ${zonesSvg}

  <!-- Volume Sub-Panel Grid -->
  <line x1="${chartLeft}" y1="${volBottom}" x2="${chartRight}" y2="${volBottom}" stroke="#2a2e39" stroke-width="1"/>
  <text x="${chartLeft}" y="${chartBottom + 14}" fill="#787b86" font-size="9" font-family="monospace">VOLUME</text>
  ${volSvg}

  <!-- Position Tool Box -->
  ${positionBoxSvg}

  <!-- VWAP Indicator -->
  ${vwapSvg}

  <!-- Real Candlesticks -->
  ${candlesSvg}

  <!-- Dynamic Pattern & Horizontal Levels -->
  ${levelsSvg}

  <!-- Text Annotations -->
  ${annotationsSvg}

  <!-- Bottom Time Axis Labels -->
  <line x1="0" y1="${height - 24}" x2="${width}" y2="${height - 24}" stroke="#2a2e39" stroke-width="1"/>
  <text x="${getX(2)}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">10:00</text>
  <text x="${getX(Math.floor(candles.length * 0.3))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">11:15</text>
  <text x="${getX(Math.floor(candles.length * 0.55))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">12:30</text>
  <text x="${getX(Math.floor(candles.length * 0.75))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">13:45</text>
  <text x="${getX(candles.length - 2)}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">15:00</text>

  <!-- Watermark Logo -->
  <text x="${chartLeft + 15}" y="${chartBottom - 15}" fill="#ffffff" fill-opacity="0.04" font-size="28" font-family="monospace" font-weight="900">THE MARKET SNIPER SHOOTERS</text>
</svg>
`;
}

module.exports = { renderTradingViewChart };
