/**
 * PHOTOREALISTIC TRADINGVIEW CANDLESTICK CHART ENGINE - V6
 * "EXACT CANDLE ENTRY & CHRONOLOGICAL EXECUTION REALISM"
 * 
 * Rules:
 * 1. Trade position tool (Green/Red box) begins STRICTLY at entryCandleIdx.
 * 2. Pre-entry candles (left of entryCandleIdx) CANNOT touch or exceed target1Price.
 * 3. Exact Entry Candle is visually tagged with a glowing directional pointer & exact execution price.
 * 4. Post-entry candles expand to hit Target 1, tagged with a "TARGET 1 REACHED" milestone.
 * 5. Animated replay replays the trade execution unfolding in real time.
 */

function makeAnimatedTradingViewChart({
  id = "chart",
  symbol = "NIFTY 50 • 5m • NSE",
  candles = [],
  entryCandleIdx,   // REQUIRED: Exact candle index where trade is entered
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
  const chartLeft = 55;
  const chartRight = 825;
  const chartTop = 54;
  const chartBottom = 385;
  const volBottom = 445;
  const volHeight = 50;

  let allPrices = [];
  candles.forEach(c => allPrices.push(c.h, c.l));
  if (entryPrice) allPrices.push(entryPrice);
  if (stopLossPrice) allPrices.push(stopLossPrice);
  if (target1Price) allPrices.push(target1Price);
  if (target2Price) allPrices.push(target2Price);

  let rawMin = Math.min(...allPrices);
  let rawMax = Math.max(...allPrices);
  const range = rawMax - rawMin || 100;
  const minPrice = rawMin - range * 0.12;
  const maxPrice = rawMax + range * 0.12;

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

  // Determine exact entry candle index
  const safeEntryIdx = (typeof entryCandleIdx === 'number' && entryCandleIdx >= 0 && entryCandleIdx < numCandles)
    ? entryCandleIdx
    : Math.max(0, Math.floor(numCandles * 0.60));

  const isLong = (target1Price && entryPrice) ? (target1Price > entryPrice) : true;

  // Strict Chronological Validation: Pre-entry candles must NOT touch target1Price!
  if (target1Price && entryPrice) {
    for (let i = 0; i < safeEntryIdx; i++) {
      const c = candles[i];
      if (isLong && c.h >= target1Price) {
        console.error(`[CHRONOLOGY WARNING] ${symbol}: Candle ${i} high (${c.h}) reached Target 1 (${target1Price}) BEFORE entry candle ${safeEntryIdx}!`);
      } else if (!isLong && c.l <= target1Price) {
        console.error(`[CHRONOLOGY WARNING] ${symbol}: Candle ${i} low (${c.l}) reached Target 1 (${target1Price}) BEFORE entry candle ${safeEntryIdx}!`);
      }
    }
  }

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

  // Replay animation: animates post-entry candles moving into target
  const replayStart = Math.min(safeEntryIdx, numCandles - 4);

  candles.forEach((c, i) => {
    const x = getX(i);
    const yO = getY(c.o);
    const yC = getY(c.c);
    const yH = getY(c.h);
    const yL = getY(c.l);
    const isBull = c.c >= c.o;
    const color = isBull ? '#089981' : '#f23645';
    
    // Only animate candles from entry forward
    const isReplay = i >= replayStart;
    const replayDelay = (i - replayStart) * 0.35;
    const animStyle = isReplay ? `animation: replayLoop 5s infinite ease-out; animation-delay: ${replayDelay.toFixed(2)}s;` : '';

    // Candle Group
    candlesSvg += `
      <g style="${animStyle}">
        <!-- Wick -->
        <line x1="${x.toFixed(1)}" y1="${yH.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yL.toFixed(1)}" stroke="${color}" stroke-width="1.3"/>
        <!-- Real Body -->
        <rect x="${(x - candleWidth / 2).toFixed(1)}" y="${Math.min(yO, yC).toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${Math.max(2.5, Math.abs(yC - yO)).toFixed(1)}" fill="${color}" stroke="${color}" rx="0.5"/>
      </g>
    `;

    // Volume Bar
    const vH = ((c.v || 1000) / maxVol) * volHeight;
    volSvg += `<rect style="${animStyle}" x="${(x - candleWidth / 2).toFixed(1)}" y="${(volBottom - vH).toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${vH.toFixed(1)}" fill="${color}" fill-opacity="0.45"/>\n`;

    // VWAP
    const typical = (c.h + c.l + c.c) / 3;
    cumPv += typical * (c.v || 1000);
    cumV += (c.v || 1000);
    const vwapVal = cumPv / cumV;
    vwapPoints.push(`${x.toFixed(1)},${getY(vwapVal).toFixed(1)}`);
  });

  // Zones
  let zonesSvg = '';
  zones.forEach((z) => {
    const yTop = getY(Math.max(z.yTop, z.yBottom));
    const yBot = getY(Math.min(z.yTop, z.yBottom));
    const h = Math.max(12, Math.abs(yBot - yTop));
    const isAnim = z.isAnimated ? 'anim-zone-pulse' : '';
    const badgeW = Math.min(270, z.label.length * 6.5 + 18);
    
    zonesSvg += `
      <rect class="${isAnim}" x="${chartLeft}" y="${yTop.toFixed(1)}" width="${chartRight - chartLeft}" height="${h.toFixed(1)}" fill="${z.color}" fill-opacity="0.12" stroke="${z.color}" stroke-width="1.2" stroke-dasharray="3"/>
      <g class="${isAnim}">
        <rect x="${chartLeft + 8}" y="${(yTop + 2).toFixed(1)}" width="${badgeW}" height="17" rx="3.5" fill="#131722" stroke="${z.color}" stroke-width="0.9"/>
        <text x="${chartLeft + 16}" y="${(yTop + 14).toFixed(1)}" fill="${z.color}" font-size="8.5" font-family="monospace" font-weight="bold">${z.label}</text>
      </g>
    `;
  });

  // VWAP Curve
  let vwapSvg = '';
  if (showVwap && vwapPoints.length > 1) {
    vwapSvg = `
      <polyline points="${vwapPoints.join(' ')}" fill="none" stroke="#f7a600" stroke-width="1.8" stroke-dasharray="4"/>
      <g>
        <rect x="${chartRight - 130}" y="56" width="120" height="18" rx="3" fill="#131722" stroke="#f7a600" stroke-width="0.8"/>
        <text x="${chartRight - 70}" y="69" fill="#f7a600" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">VWAP BENCHMARK</text>
      </g>
    `;
  }

  // TRADINGVIEW POSITION TOOL BOX (STRICTLY FROM ENTRY CANDLE FORWARD)
  let positionBoxSvg = '';
  let exactEntryMarkerSvg = '';
  let targetHitMarkerSvg = '';

  if (entryPrice && stopLossPrice && target1Price) {
    // Exact starting point of the tool is the entry candle!
    const boxX = getX(safeEntryIdx) - (candleWidth * 0.5);
    const boxW = Math.max(160, (chartRight - boxX) - 5);
    const yEntry = getY(entryPrice);
    const ySL = getY(stopLossPrice);
    const yTgt = getY(target1Price);

    if (isLong) {
      // Long Tool: Green Box on Top (Target), Red Box on Bottom (Stop)
      positionBoxSvg = `
        <g class="anim-position-tool">
          <!-- Green Target Box -->
          <rect x="${boxX.toFixed(1)}" y="${yTgt.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yEntry - yTgt).toFixed(1)}" fill="#089981" fill-opacity="0.18" stroke="#089981" stroke-width="1.3"/>
          <g>
            <rect x="${(boxX + 8).toFixed(1)}" y="${(yTgt + 6).toFixed(1)}" width="195" height="20" rx="3.5" fill="#131722" stroke="#089981" stroke-width="0.9"/>
            <text x="${(boxX + 16).toFixed(1)}" y="${(yTgt + 20).toFixed(1)}" fill="#089981" font-size="9.5" font-family="monospace" font-weight="bold">TARGET 1: +${(target1Price - entryPrice).toFixed(1)} pts (${riskReward})</text>
          </g>

          <!-- Red Stop Box -->
          <rect x="${boxX.toFixed(1)}" y="${yEntry.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(ySL - yEntry).toFixed(1)}" fill="#f23645" fill-opacity="0.18" stroke="#f23645" stroke-width="1.3"/>
          <g>
            <rect x="${(boxX + 8).toFixed(1)}" y="${(ySL - 25).toFixed(1)}" width="155" height="20" rx="3.5" fill="#131722" stroke="#f23645" stroke-width="0.9"/>
            <text x="${(boxX + 16).toFixed(1)}" y="${(ySL - 11).toFixed(1)}" fill="#f23645" font-size="9.5" font-family="monospace" font-weight="bold">STOP LOSS: -${(entryPrice - stopLossPrice).toFixed(1)} pts</text>
          </g>
        </g>
      `;

      // Directional pointer to Exact Entry Candle
      const entryCandleX = getX(safeEntryIdx);
      const entryCandle = candles[safeEntryIdx];
      const yLow = entryCandle ? getY(entryCandle.l) : yEntry;
      const entryTagY = Math.min(chartBottom - 26, yLow + 30);

      exactEntryMarkerSvg = `
        <g class="anim-badge-glow">
          <!-- Reticle pointer line -->
          <line x1="${entryCandleX.toFixed(1)}" y1="${(yLow + 4).toFixed(1)}" x2="${entryCandleX.toFixed(1)}" y2="${entryTagY.toFixed(1)}" stroke="#089981" stroke-width="2"/>
          <polygon points="${entryCandleX.toFixed(1)},${(yLow + 3).toFixed(1)} ${(entryCandleX - 5).toFixed(1)},${(yLow + 12).toFixed(1)} ${(entryCandleX + 5).toFixed(1)},${(yLow + 12).toFixed(1)}" fill="#089981"/>
          
          <!-- Exact Entry Tag -->
          <rect x="${(entryCandleX - 90).toFixed(1)}" y="${entryTagY.toFixed(1)}" width="180" height="22" rx="4" fill="#089981" stroke="#ffffff" stroke-width="1.2"/>
          <text x="${entryCandleX.toFixed(1)}" y="${(entryTagY + 15).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="900" text-anchor="middle">🎯 EXACT ENTRY CANDLE (${entryPrice.toFixed(1)})</text>
        </g>
      `;

      // Find candle that hits Target 1 after entry
      const tgtCandleIdx = candles.findIndex((c, idx) => idx > safeEntryIdx && c.h >= target1Price);
      if (tgtCandleIdx > safeEntryIdx) {
        const tgtX = getX(tgtCandleIdx);
        const tgtTagY = Math.max(chartTop + 6, yTgt - 28);
        targetHitMarkerSvg = `
          <g>
            <circle cx="${tgtX.toFixed(1)}" cy="${yTgt.toFixed(1)}" r="5" fill="#00f59b"/>
            <rect x="${(tgtX - 70).toFixed(1)}" y="${tgtTagY.toFixed(1)}" width="140" height="20" rx="4" fill="#00f59b" stroke="#000000" stroke-width="1"/>
            <text x="${tgtX.toFixed(1)}" y="${(tgtTagY + 14).toFixed(1)}" fill="#000000" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">🏆 TARGET 1 HIT (+${(target1Price - entryPrice).toFixed(1)})</text>
          </g>
        `;
      }
    } else {
      // Short Tool: Red Box on Top (Stop), Green Box on Bottom (Target)
      positionBoxSvg = `
        <g class="anim-position-tool">
          <!-- Green Target Box Below -->
          <rect x="${boxX.toFixed(1)}" y="${yEntry.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yTgt - yEntry).toFixed(1)}" fill="#089981" fill-opacity="0.18" stroke="#089981" stroke-width="1.3"/>
          <g>
            <rect x="${(boxX + 8).toFixed(1)}" y="${(yTgt - 25).toFixed(1)}" width="195" height="20" rx="3.5" fill="#131722" stroke="#089981" stroke-width="0.9"/>
            <text x="${(boxX + 16).toFixed(1)}" y="${(yTgt - 11).toFixed(1)}" fill="#089981" font-size="9.5" font-family="monospace" font-weight="bold">TARGET 1: +${(entryPrice - target1Price).toFixed(1)} pts (${riskReward})</text>
          </g>

          <!-- Red Stop Box Above -->
          <rect x="${boxX.toFixed(1)}" y="${ySL.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(yEntry - ySL).toFixed(1)}" fill="#f23645" fill-opacity="0.18" stroke="#f23645" stroke-width="1.3"/>
          <g>
            <rect x="${(boxX + 8).toFixed(1)}" y="${(ySL + 6).toFixed(1)}" width="155" height="20" rx="3.5" fill="#131722" stroke="#f23645" stroke-width="0.9"/>
            <text x="${(boxX + 16).toFixed(1)}" y="${(ySL + 20).toFixed(1)}" fill="#f23645" font-size="9.5" font-family="monospace" font-weight="bold">STOP LOSS: -${(stopLossPrice - entryPrice).toFixed(1)} pts</text>
          </g>
        </g>
      `;

      // Directional pointer to Exact Entry Candle
      const entryCandleX = getX(safeEntryIdx);
      const entryCandle = candles[safeEntryIdx];
      const yHigh = entryCandle ? getY(entryCandle.h) : yEntry;
      const entryTagY = Math.max(chartTop + 4, yHigh - 50);

      exactEntryMarkerSvg = `
        <g class="anim-badge-glow">
          <!-- Reticle pointer line -->
          <line x1="${entryCandleX.toFixed(1)}" y1="${(yHigh - 4).toFixed(1)}" x2="${entryCandleX.toFixed(1)}" y2="${(entryTagY + 22).toFixed(1)}" stroke="#f23645" stroke-width="2"/>
          <polygon points="${entryCandleX.toFixed(1)},${(yHigh - 3).toFixed(1)} ${(entryCandleX - 5).toFixed(1)},${(yHigh - 12).toFixed(1)} ${(entryCandleX + 5).toFixed(1)},${(yHigh - 12).toFixed(1)}" fill="#f23645"/>
          
          <!-- Exact Entry Tag -->
          <rect x="${(entryCandleX - 90).toFixed(1)}" y="${entryTagY.toFixed(1)}" width="180" height="22" rx="4" fill="#f23645" stroke="#ffffff" stroke-width="1.2"/>
          <text x="${entryCandleX.toFixed(1)}" y="${(entryTagY + 15).toFixed(1)}" fill="#ffffff" font-size="9.5" font-family="monospace" font-weight="900" text-anchor="middle">🎯 EXACT ENTRY CANDLE (${entryPrice.toFixed(1)})</text>
        </g>
      `;

      // Find candle that hits Target 1 after entry
      const tgtCandleIdx = candles.findIndex((c, idx) => idx > safeEntryIdx && c.l <= target1Price);
      if (tgtCandleIdx > safeEntryIdx) {
        const tgtX = getX(tgtCandleIdx);
        const tgtTagY = Math.min(chartBottom - 26, yTgt + 12);
        targetHitMarkerSvg = `
          <g>
            <circle cx="${tgtX.toFixed(1)}" cy="${yTgt.toFixed(1)}" r="5" fill="#00f59b"/>
            <rect x="${(tgtX - 70).toFixed(1)}" y="${tgtTagY.toFixed(1)}" width="140" height="20" rx="4" fill="#00f59b" stroke="#000000" stroke-width="1"/>
            <text x="${tgtX.toFixed(1)}" y="${(tgtTagY + 14).toFixed(1)}" fill="#000000" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">🏆 TARGET 1 HIT (+${(entryPrice - target1Price).toFixed(1)})</text>
          </g>
        `;
      }
    }
  }

  // Price Lines & Badges on Right Scale
  let levelsSvg = '';
  if (entryPrice) {
    const y = getY(entryPrice);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#089981" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="90" height="20" fill="#089981" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">ENTRY ${entryPrice.toFixed(1)}</text>
    `;
  }
  if (stopLossPrice) {
    const y = getY(stopLossPrice);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#f23645" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="90" height="20" fill="#f23645" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#ffffff" font-size="9.5" font-family="monospace" font-weight="bold">SL ${stopLossPrice.toFixed(1)}</text>
    `;
  }
  if (target1Price) {
    const y = getY(target1Price);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="90" height="20" fill="#38bdf8" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">TGT 1 ${target1Price.toFixed(1)}</text>
    `;
  }
  if (target2Price) {
    const y = getY(target2Price);
    levelsSvg += `
      <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" stroke="#00c076" stroke-width="1.8" stroke-dasharray="3"/>
      <rect x="${chartRight}" y="${(y - 10).toFixed(1)}" width="90" height="20" fill="#00c076" rx="3"/>
      <text x="${chartRight + 6}" y="${(y + 4.5).toFixed(1)}" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">TGT 2 ${target2Price.toFixed(1)}</text>
    `;
  }

  // Non-Colliding Setup Annotations
  let annotationsSvg = '';
  annotations.forEach((a) => {
    // Skip if annotation is on entry candle (exactEntryMarkerSvg already tags it)
    if (a.candleIdx === safeEntryIdx && (a.text.includes('ENTRY') || a.text.includes('RETEST'))) return;

    const c = candles[a.candleIdx];
    if (!c) return;
    const x = getX(a.candleIdx);
    const isAbove = a.position === 'above';
    const yCandle = isAbove ? getY(c.h) : getY(c.l);
    const yAnchor = isAbove ? yCandle - 18 : yCandle + 18;
    const yText = isAbove ? yAnchor - 12 : yAnchor + 14;
    const color = a.color || '#f7a600';
    const isAnim = a.isAnimated ? 'anim-badge-glow' : '';
    const badgeW = Math.min(180, a.text.length * 6.2 + 16);

    annotationsSvg += `
      <g class="${isAnim}">
        <circle cx="${x.toFixed(1)}" cy="${yCandle.toFixed(1)}" r="4" fill="${color}"/>
        <line x1="${x.toFixed(1)}" y1="${yCandle.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yAnchor.toFixed(1)}" stroke="${color}" stroke-width="1.3"/>
        <rect x="${(x - badgeW / 2).toFixed(1)}" y="${(yText - 10).toFixed(1)}" width="${badgeW}" height="19" fill="#151922" stroke="${color}" stroke-width="1.1" rx="4"/>
        <text x="${x.toFixed(1)}" y="${(yText + 3.5).toFixed(1)}" fill="${color}" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${a.text}</text>
      </g>
    `;
  });

  const lastC = candles[candles.length - 1] || { o: 0, h: 0, l: 0, c: 0 };
  const isUp = lastC.c >= lastC.o;

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
        0%, 100% { filter: drop-shadow(0 0 2px #089981); opacity: 0.90; }
        50% { filter: drop-shadow(0 0 8px #089981); opacity: 1; }
      }
      @keyframes zonePulse {
        0%, 100% { fill-opacity: 0.10; }
        50% { fill-opacity: 0.25; }
      }
      @keyframes blinkCursor {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes badgeGlow {
        0%, 100% { filter: drop-shadow(0 0 2px #f7a600); }
        50% { filter: drop-shadow(0 0 8px #f7a600); }
      }
      .anim-position-tool { animation: pulseTool 3s infinite ease-in-out; }
      .anim-zone-pulse { animation: zonePulse 2.5s infinite ease-in-out; }
      .anim-live-blink { animation: blinkCursor 1.2s infinite; }
      .anim-badge-glow { animation: badgeGlow 2s infinite ease-in-out; }
    </style>
  </defs>

  <!-- Top Header Navigation Bar -->
  <rect x="0" y="0" width="${width}" height="42" fill="#171b26"/>
  <line x1="0" y1="42" x2="${width}" y2="42" stroke="#2a2e39" stroke-width="1"/>
  
  <!-- Left Side: Symbol Badge -->
  <g>
    <rect x="14" y="8" width="${Math.min(270, symbol.length * 7.5 + 24)}" height="26" rx="5" fill="#1e222d" stroke="#2a2e39" stroke-width="1"/>
    <text x="24" y="25" fill="#ffffff" font-size="11.5" font-weight="bold">${symbol}</text>
  </g>

  <!-- Center: Dedicated Live Candlestick Replay Pill -->
  <g transform="translate(325, 8)">
    <rect x="0" y="0" width="220" height="26" rx="13" fill="#091814" stroke="#089981" stroke-width="1"/>
    <circle cx="16" cy="13" r="4.5" fill="#089981" class="anim-live-blink"/>
    <text x="28" y="17" fill="#089981" font-size="10" font-weight="bold" font-family="monospace">AUTHENTIC CANDLE REPLAY</text>
  </g>

  <!-- Right Side: Current OHLC Values (Right-Aligned) -->
  <text x="${chartRight}" y="26" text-anchor="end" fill="#787b86" font-size="10.5" font-family="monospace">
    O <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.o.toFixed(1)}</tspan>  
    H <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.h.toFixed(1)}</tspan>  
    L <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.l.toFixed(1)}</tspan>  
    C <tspan fill="${isUp ? '#089981' : '#f23645'}">${lastC.c.toFixed(1)}</tspan>
  </text>

  <!-- Right Price Axis Background -->
  <rect x="${chartRight}" y="42" width="${width - chartRight}" height="${height - 42}" fill="#131722"/>
  <line x1="${chartRight}" y1="42" x2="${chartRight}" y2="${height}" stroke="#2a2e39" stroke-width="1"/>

  <!-- Horizontal Grid Lines & Price Ticks -->
  ${gridLinesSvg}
  ${priceTicksSvg}

  <!-- Shaded Zones (Order Blocks, iFVG, Golden Pocket, Malaysian SNR) -->
  ${zonesSvg}

  <!-- Volume Sub-Panel Grid -->
  <line x1="${chartLeft}" y1="${volBottom}" x2="${chartRight}" y2="${volBottom}" stroke="#2a2e39" stroke-width="1"/>
  <text x="${chartLeft}" y="${chartBottom + 16}" fill="#787b86" font-size="9" font-family="monospace">VOLUME</text>
  ${volSvg}

  <!-- TradingView Long/Short Position Tool Box (Begins Strictly at Entry Candle) -->
  ${positionBoxSvg}

  <!-- VWAP Indicator -->
  ${vwapSvg}

  <!-- Pure Candlesticks -->
  ${candlesSvg}

  <!-- Target & Stop Loss Levels -->
  ${levelsSvg}

  <!-- Setup Annotations & Callouts -->
  ${annotationsSvg}

  <!-- Exact Entry Candle Directional Pointer Badge -->
  ${exactEntryMarkerSvg}

  <!-- Post-Entry Target Reached Milestone -->
  ${targetHitMarkerSvg}

  <!-- Bottom Time Axis -->
  <line x1="0" y1="${height - 24}" x2="${width}" y2="${height - 24}" stroke="#2a2e39" stroke-width="1"/>
  <text x="${getX(1)}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">09:15</text>
  <text x="${getX(Math.floor(candles.length * 0.25))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">10:30</text>
  <text x="${getX(Math.floor(candles.length * 0.50))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">12:00</text>
  <text x="${getX(Math.floor(candles.length * 0.75))}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">13:30</text>
  <text x="${getX(candles.length - 2)}" y="${height - 8}" fill="#787b86" font-size="9.5" font-family="monospace">15:15</text>

  <!-- Watermark -->
  <text x="${chartLeft + 15}" y="${chartBottom - 15}" fill="#ffffff" fill-opacity="0.04" font-size="24" font-family="monospace" font-weight="900">THE MARKET SNIPER SHOOTERS</text>
</svg>
`;
}

module.exports = { makeAnimatedTradingViewChart };
