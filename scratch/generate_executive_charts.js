const { makeAnimatedTradingViewChart } = require('./tv_animated_engine.js');

function walk(start, changes) {
  let p = start;
  return changes.map(c => {
    const o = p;
    const change = c.chg || 0;
    const cClose = o + change;
    const h = Math.max(o, cClose) + (c.upWick || Math.abs(change) * 0.2 + 2);
    const l = Math.min(o, cClose) - (c.dnWick || Math.abs(change) * 0.2 + 2);
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

// 1. THE MASTER BULL DIAGRAM
const bullChartSvg = makeAnimatedTradingViewChart({
  symbol: "NIFTY 50 • 5m • BULLISH DEMAND BREAKOUT",
  candles: walk(23110, [
    { chg: -20, v: 3100 }, { chg: -25, v: 3800 }, { chg: -18, v: 4100 },
    // Liquidity Sweep with Long Lower Absorption Wick (pVAL sweep)
    { chg: 8, upWick: 4, dnWick: 48, v: 8900 },
    // Bullish Follow-Through
    { chg: 32, upWick: 6, dnWick: 2, v: 7600 },
    // DodgysDD Bullish iFVG Inversion Breakout
    { chg: 40, upWick: 8, dnWick: 3, v: 9200 },
    { chg: 28, v: 6100 }, { chg: 22, v: 5400 },
    // Retest of Inverted FVG
    { chg: -12, upWick: 3, dnWick: 15, v: 4200 },
    // Expansion Wave to Target
    { chg: 38, v: 8400 }, { chg: 45, v: 9800 }, { chg: 35, v: 8100 }
  ]),
  entryPrice: 23145,
  stopLossPrice: 23075,
  target1Price: 23270,
  target2Price: 23340,
  riskReward: "1:3.6",
  zones: [
    { yTop: 23090, yBottom: 23070, color: '#00c076', label: 'INSTITUTIONAL DEMAND SUPPORT ZONE (pVAL SWEEP)', isAnimated: true },
    { yTop: 23160, yBottom: 23140, color: '#38bdf8', label: 'BULLISH iFVG INVERSION ZONE', isAnimated: false }
  ],
  annotations: [
    { candleIdx: 3, text: "UMAR 40% ABSORPTION TAIL", position: "below", color: "#00c076", isAnimated: true },
    { candleIdx: 5, text: "BULLISH DISPLACEMENT", position: "above", color: "#38bdf8" },
    { candleIdx: 8, text: "iFVG RETEST TAP (CE ENTRY)", position: "below", color: "#f7a600" }
  ]
});

// 2. THE MASTER BEAR DIAGRAM
const bearChartSvg = makeAnimatedTradingViewChart({
  symbol: "BANKNIFTY • 5m • BEARISH MALAYSIAN QMR",
  candles: walk(51220, [
    // High (Left Shoulder)
    { chg: 45, v: 4200 }, { chg: 55, v: 4900 }, { chg: 40, v: 5100 },
    // Low (Trough)
    { chg: -45, v: 3800 }, { chg: -50, v: 4100 },
    // Higher High Sweep with Umar 40% Wick (PDH hunt)
    { chg: 70, v: 6400 },
    { chg: -18, upWick: 52, dnWick: 4, v: 11400 },
    // Displacement Down Breaking Low
    { chg: -85, v: 9900 }, { chg: -70, v: 9200 }, { chg: -55, v: 8100 },
    // Pullback Retest to Left Shoulder
    { chg: 38, v: 3200 }, { chg: 42, v: 2900 },
    // Reversal Departure Wave
    { chg: -55, upWick: 14, dnWick: 5, v: 9100 },
    { chg: -75, v: 10200 }, { chg: -65, v: 8800 }
  ]),
  entryPrice: 51330,
  stopLossPrice: 51425,
  target1Price: 51120,
  target2Price: 50980,
  riskReward: "1:3.8",
  zones: [
    { yTop: 51420, yBottom: 51400, color: '#ff3b57', label: 'PREVIOUS DAY HIGH (PDH SWEEP ZONE)', isAnimated: true },
    { yTop: 51340, yBottom: 51325, color: '#f7a600', label: 'MALAYSIAN QMR LEFT SHOULDER RESISTANCE', isAnimated: false }
  ],
  annotations: [
    { candleIdx: 6, text: "HH: UMAR 40% REJECTION WICK", position: "above", color: "#ff3b57", isAnimated: true },
    { candleIdx: 9, text: "LL: STRUCTURE BREAK", position: "below", color: "#ff3b57" },
    { candleIdx: 12, text: "QMR RETEST (PE ENTRY)", position: "above", color: "#00c076" }
  ]
});

const output = `// Auto-generated Master Bull & Bear Institutional Candlestick Diagrams
window.BULL_CHART_SVG = ${JSON.stringify(bullChartSvg)};
window.BEAR_CHART_SVG = ${JSON.stringify(bearChartSvg)};
`;

const fs = require('fs');
fs.writeFileSync('public/executive-charts.js', output, 'utf8');
console.log('SUCCESS: Generated public/executive-charts.js');
