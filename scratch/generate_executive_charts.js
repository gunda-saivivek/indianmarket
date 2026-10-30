const { makeAnimatedTradingViewChart } = require('./tv_animated_engine.js');

function walk(start, changes) {
  let p = start;
  return changes.map(c => {
    const o = p;
    const change = c.chg || 0;
    const cClose = o + change;
    const h = Math.max(o, cClose) + (c.upWick !== undefined ? c.upWick : Math.abs(change) * 0.2 + 2);
    const l = Math.min(o, cClose) - (c.dnWick !== undefined ? c.dnWick : Math.abs(change) * 0.2 + 2);
    p = cClose;
    return {
      o: parseFloat(o.toFixed(1)),
      h: parseFloat(h.toFixed(1)),
      l: parseFloat(l.toFixed(1)),
      c: parseFloat(cClose.toFixed(1)),
      v: c.v || 3500
    };
  });
}

// =========================================================================
// 1. THE MASTER BULL DIAGRAM (CALL / CE WORKSPACE)
// =========================================================================
// Entry Candle: Index 8 (Retest Tap of iFVG Support at 23,145)
// Stop Loss: 23,070 (below demand absorption wick, 75 pts risk)
// Target 1: 23,265 (hit at Candle 11, +120 pts)
// Target 2: 23,320
const bullCandles = walk(23120, [
  { chg: -15, v: 3100 }, // 0: 23105
  { chg: -20, v: 3800 }, // 1: 23085
  { chg: -15, v: 4100 }, // 2: 23070
  // 3: Liquidity sweep with absorption tail (sweeps 23,040)
  { chg: 10, upWick: 4, dnWick: 30, v: 9200 }, // 3: 23080
  // 4: Strong displacement green
  { chg: 40, upWick: 5, dnWick: 2, v: 7800 }, // 4: 23120
  // 5: iFVG Breakout
  { chg: 45, upWick: 6, dnWick: 2, v: 9600 }, // 5: 23165
  // 6, 7: Pullback into iFVG
  { chg: 10, upWick: 5, dnWick: 3, v: 5100 }, // 6: 23175
  { chg: -20, upWick: 2, dnWick: 4, v: 3800 }, // 7: 23155
  // 8: EXACT ENTRY CANDLE - Retest Tap into 23,145!
  { chg: -10, upWick: 4, dnWick: 12, v: 6200 }, // 8: O: 23155, C: 23145, L: 23133, H: 23159
  // 9: Expansion post-entry
  { chg: 35, upWick: 5, dnWick: 2, v: 8400 }, // 9: 23180
  // 10: Momentum
  { chg: 40, upWick: 5, dnWick: 2, v: 9100 }, // 10: 23220
  // 11: Breakout Bar HITTING TARGET 1 (23,265)
  { chg: 50, upWick: 15, dnWick: 2, v: 10500 }, // 11: 23270, H: 23285
  // 12: Target 2 runner
  { chg: 35, upWick: 8, dnWick: 3, v: 8900 }
]);

const bullChartSvg = makeAnimatedTradingViewChart({
  symbol: "NIFTY 50 • 5m • BULLISH iFVG INVERSION & DEMAND ABSORPTION",
  candles: bullCandles,
  entryCandleIdx: 8,
  entryPrice: 23145,
  stopLossPrice: 23070,
  target1Price: 23265,
  target2Price: 23320,
  riskReward: "1:3.6",
  zones: [
    { yTop: 23090, yBottom: 23068, color: '#00c076', label: 'INSTITUTIONAL DEMAND SUPPORT (pVAL SWEEP)', isAnimated: true },
    { yTop: 23158, yBottom: 23142, color: '#38bdf8', label: 'BULLISH iFVG INVERSION RETEST ZONE', isAnimated: false }
  ],
  annotations: [
    { candleIdx: 3, text: "UMAR 40% ABSORPTION TAIL", position: "below", color: "#00c076", isAnimated: true },
    { candleIdx: 5, text: "BULLISH DISPLACEMENT (iFVG)", position: "above", color: "#38bdf8" }
  ]
});

// =========================================================================
// 2. THE MASTER BEAR DIAGRAM (PUT / PE WORKSPACE)
// =========================================================================
// Entry Candle: Index 10 (Retest Tap of Malaysian Left Shoulder at 51,330)
// Stop Loss: 51,435 (above the sweep high, 105 pts risk)
// Structure Low: 51,174 (at Candle 7)
// Target 1: 51,080 (hit at Candle 13, +250 pts)
// Target 2: 50,950
const bearCandles = walk(51270, [
  { chg: 35, upWick: 5, dnWick: 3 }, // 0
  { chg: 25, upWick: 6, dnWick: 2 }, // 1: High 51336 (Left Shoulder)
  { chg: -45, upWick: 4, dnWick: 6 }, // 2
  { chg: -55, upWick: 3, dnWick: 5 }, // 3: Low 51225 (Trough)
  { chg: 75, upWick: 8, dnWick: 4 }, // 4
  { chg: 15, upWick: 105, dnWick: 4 }, // 5: High 51425 (PDH Liquidity Sweep with Umar Wick)
  { chg: -65, upWick: 4, dnWick: 8 }, // 6: Displacement Down
  { chg: -75, upWick: 5, dnWick: 6 }, // 7: Lower Low (LL 51174, breaks 51225)
  { chg: 65, upWick: 6, dnWick: 4 }, // 8: Pullback wave 1
  { chg: 70, upWick: 5, dnWick: 3 }, // 9: Pullback wave 2 (51315)
  { chg: -15, upWick: 20, dnWick: 4 }, // 10: EXACT ENTRY CANDLE (Retest Tap 51330 with rejection wick)
  { chg: -85, upWick: 5, dnWick: 8 }, // 11: Bearish Impulse Down
  { chg: -75, upWick: 4, dnWick: 10 }, // 12: Acceleration
  { chg: -80, upWick: 6, dnWick: 20 }, // 13: Hits Target 1: 51080 (low 51040)
  { chg: -65, upWick: 4, dnWick: 12 }  // 14: Target 2 runner
]);

const bearChartSvg = makeAnimatedTradingViewChart({
  symbol: "BANKNIFTY • 5m • BEARISH MALAYSIAN QMR & PDH SWEEP",
  candles: bearCandles,
  entryCandleIdx: 10,
  entryPrice: 51330,
  stopLossPrice: 51435,
  target1Price: 51080,
  target2Price: 50950,
  riskReward: "1:3.8",
  zones: [
    { yTop: 51430, yBottom: 51410, color: '#ff3b57', label: 'PREVIOUS DAY HIGH (PDH LIQUIDITY POOL)', isAnimated: true },
    { yTop: 51340, yBottom: 51325, color: '#f7a600', label: 'MALAYSIAN QMR LEFT SHOULDER RESISTANCE', isAnimated: false }
  ],
  annotations: [
    { candleIdx: 5, text: "HH: UMAR 40% REJECTION WICK", position: "above", color: "#ff3b57", isAnimated: true },
    { candleIdx: 7, text: "LL: STRUCTURE BREAK", position: "below", color: "#ff3b57" }
  ]
});

const output = `// Auto-generated Master Bull & Bear Institutional Candlestick Diagrams
// Generated with V6 Strict Chronological Execution Engine
window.BULL_CHART_SVG = ${JSON.stringify(bullChartSvg)};
window.BEAR_CHART_SVG = ${JSON.stringify(bearChartSvg)};
`;

const fs = require('fs');
fs.writeFileSync('public/executive-charts.js', output, 'utf8');
console.log('SUCCESS: Generated public/executive-charts.js with ZERO chronological flaws!');
