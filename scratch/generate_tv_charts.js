/**
 * Realistic TradingView Candlestick Chart Generators for All 20 Master Academy Topics
 */

const { renderTradingViewChart } = require('./test_chart.js');

// Helper to generate a realistic price walk
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
      v: c.v || 2500
    };
  });
}

const chartBlueprints = {};

// 1. CANDLESTICK ANATOMY
chartBlueprints['topic-candle-anatomy'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23140, [
    { chg: -15, v: 2100 }, { chg: -20, v: 2800 }, { chg: -18, v: 3200 },
    { chg: -25, v: 4100 }, { chg: -12, v: 3500 },
    // Rejection Candle (Long lower wick at support)
    { chg: 10, upWick: 3, dnWick: 38, v: 6200 },
    // Confirmation Green Bar
    { chg: 28, upWick: 4, dnWick: 2, v: 5800 },
    // Breakout expansion
    { chg: 22, v: 4900 }, { chg: 18, v: 4400 }, { chg: 25, v: 5100 },
    { chg: -8, v: 2200 }, { chg: 30, v: 5600 }, { chg: 26, v: 5200 }
  ]),
  entryPrice: 23105,
  stopLossPrice: 23042,
  target1Price: 23210,
  target2Price: 23280,
  riskReward: "1:2.8",
  zones: [
    { yTop: 23050, yBottom: 23035, color: '#38bdf8', label: 'INSTITUTIONAL DEMAND SUPPORT ZONE' }
  ],
  annotations: [
    { candleIdx: 5, text: "REJECTION WICK (65% TAIL)", position: "below", color: "#f7a600" },
    { candleIdx: 6, text: "FOLLOW-THROUGH CLOSE", position: "above", color: "#089981" }
  ]
});

// 2. HAMMER LIQUIDITY ABSORPTION
chartBlueprints['topic-candle-hammer'] = renderTradingViewChart({
  symbol: "BANKNIFTY • 5m • NSE",
  candles: walk(51380, [
    { chg: -40, v: 4200 }, { chg: -65, v: 5800 }, { chg: -50, v: 6100 },
    { chg: -30, v: 4500 },
    // The Hammer Candle (Sweeps swing low with 85pt lower tail)
    { chg: 25, upWick: 4, dnWick: 95, v: 9800 },
    // Massive green follow through
    { chg: 75, upWick: 10, dnWick: 5, v: 8400 },
    { chg: 50, v: 7100 }, { chg: 65, v: 7900 }, { chg: -20, v: 3100 },
    { chg: 80, v: 9100 }, { chg: 45, v: 6500 }
  ]),
  entryPrice: 51225,
  stopLossPrice: 51085,
  target1Price: 51480,
  target2Price: 51650,
  riskReward: "1:3.1",
  zones: [
    { yTop: 51100, yBottom: 51070, color: '#ff3b57', label: 'PREVIOUS SWING LOW (RETAIL STOPS SWEPT)' }
  ],
  annotations: [
    { candleIdx: 4, text: "HAMMER: 2:1 WICK RATIO", position: "below", color: "#089981" },
    { candleIdx: 5, text: "BREAKOUT CONFIRMATION", position: "above", color: "#089981" }
  ]
});

// 3. BULLISH ENGULFING
chartBlueprints['topic-candle-engulfing'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23380, [
    { chg: -15, v: 2200 }, { chg: -18, v: 2900 }, { chg: -22, v: 3400 },
    // Red bar before takeover
    { chg: -20, upWick: 3, dnWick: 4, v: 3800 },
    // Giant Bullish Engulfing Bar (completely swallows prior bar)
    { chg: 48, upWick: 5, dnWick: 4, v: 8900 },
    // Expansion
    { chg: 24, v: 5500 }, { chg: 20, v: 4800 }, { chg: 26, v: 6200 },
    { chg: -10, v: 2100 }, { chg: 32, v: 6700 }, { chg: 28, v: 5900 }
  ]),
  entryPrice: 23355,
  stopLossPrice: 23295,
  target1Price: 23480,
  target2Price: 23560,
  riskReward: "1:3.2",
  zones: [
    { yTop: 23310, yBottom: 23290, color: '#089981', label: 'DEMAND ZONE FLOOR' }
  ],
  annotations: [
    { candleIdx: 4, text: "BULLISH ENGULFING (2.4x VOL)", position: "above", color: "#089981" }
  ]
});

// 4. MORNING STAR 3-BAR CYCLE
chartBlueprints['topic-candle-stars'] = renderTradingViewChart({
  symbol: "SENSEX • 5m • BSE",
  candles: walk(76420, [
    { chg: -60, v: 1800 }, { chg: -90, v: 2500 },
    // Bar 1: Strong Red
    { chg: -120, upWick: 10, dnWick: 15, v: 4800 },
    // Bar 2: Small Indecision Star at bottom
    { chg: 10, upWick: 18, dnWick: 25, v: 2200 },
    // Bar 3: Explosive Green (penetrates 65% of Bar 1)
    { chg: 130, upWick: 15, dnWick: 5, v: 6500 },
    // Follow-through
    { chg: 80, v: 4900 }, { chg: 95, v: 5300 }, { chg: -30, v: 1900 },
    { chg: 110, v: 5800 }
  ]),
  entryPrice: 76360,
  stopLossPrice: 76170,
  target1Price: 76750,
  target2Price: 77000,
  riskReward: "1:3.2",
  zones: [
    { yTop: 76290, yBottom: 76280, color: '#f7a600', label: '50% MIDPOINT PENETRATION LEVEL' }
  ],
  annotations: [
    { candleIdx: 2, text: "BAR 1: IMPULSE", position: "above", color: "#ff3b57" },
    { candleIdx: 3, text: "BAR 2: ABSORPTION STAR", position: "below", color: "#f7a600" },
    { candleIdx: 4, text: "BAR 3: 50%+ PENETRATION", position: "above", color: "#089981" }
  ]
});

// 5. DOUBLE BOTTOM (W PATTERN)
chartBlueprints['topic-double-bottom-top'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23260, [
    { chg: -25, v: 2800 }, { chg: -35, v: 3900 },
    // Leg 1 Low (23120)
    { chg: 10, upWick: 5, dnWick: 28, v: 4500 },
    // Rally to Neckline (23220)
    { chg: 35, v: 4200 }, { chg: 30, v: 4100 }, { chg: 25, v: 3800 },
    // Pullback to Leg 2 (Sweeps Leg 1 down to 23105)
    { chg: -30, v: 2600 }, { chg: -45, v: 3100 },
    { chg: 15, upWick: 4, dnWick: 35, v: 7200 }, // Leg 2 Turtle Soup
    // Rally toward Neckline
    { chg: 40, v: 5800 }, { chg: 38, v: 6100 },
    // Neckline Breakout
    { chg: 45, upWick: 8, dnWick: 3, v: 9200 },
    // Retest & Continuation
    { chg: -10, v: 2500 }, { chg: 40, v: 8100 }, { chg: 35, v: 7600 }
  ]),
  entryPrice: 23225,
  stopLossPrice: 23100,
  target1Price: 23365,
  target2Price: 23450,
  riskReward: "1:3.4",
  zones: [
    { yTop: 23225, yBottom: 23215, color: '#f7a600', label: 'NECKLINE LEVEL (23,220)' }
  ],
  annotations: [
    { candleIdx: 2, text: "LEG 1 BOTTOM", position: "below", color: "#ff3b57" },
    { candleIdx: 8, text: "LEG 2 SWEEP (TURTLE SOUP)", position: "below", color: "#089981" },
    { candleIdx: 11, text: "NECKLINE BREAKOUT", position: "above", color: "#089981" }
  ]
});

// 6. HEAD & SHOULDERS
chartBlueprints['topic-head-shoulders'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23240, [
    { chg: 25, v: 3100 }, { chg: 30, v: 4200 },
    // Left Shoulder Peak (23330)
    { chg: -20, v: 2900 }, { chg: -30, v: 3100 },
    // Head Peak (Higher High at 23410 on LOWER vol)
    { chg: 45, v: 3800 }, { chg: 35, v: 3200 }, { chg: -35, v: 4800 },
    // Neckline Trough (23250)
    { chg: -55, v: 6200 },
    // Right Shoulder Peak (Fails at 23320)
    { chg: 30, v: 2400 }, { chg: 25, v: 2100 },
    // Neckline Breakdown Candle
    { chg: -50, upWick: 5, dnWick: 12, v: 8900 },
    { chg: -40, v: 7500 }, { chg: -45, v: 8100 }
  ]),
  entryPrice: 23240,
  stopLossPrice: 23335,
  target1Price: 23110,
  target2Price: 23010,
  riskReward: "1:3.4",
  zones: [
    { yTop: 23255, yBottom: 23245, color: '#f7a600', label: 'NECKLINE BREAKDOWN (23,250)' }
  ],
  annotations: [
    { candleIdx: 1, text: "LEFT SHOULDER", position: "above", color: "#f7a600" },
    { candleIdx: 5, text: "HEAD (VOLUME DIVERGENCE)", position: "above", color: "#ff3b57" },
    { candleIdx: 9, text: "RIGHT SHOULDER", position: "above", color: "#f7a600" },
    { candleIdx: 10, text: "NECKLINE BREAKDOWN", position: "below", color: "#ff3b57" }
  ]
});

// 7. BULL FLAGS & PENNANTS
chartBlueprints['topic-flags-pennants'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23080, [
    // Impulse Pole (Aggressive rally)
    { chg: 35, v: 7500 }, { chg: 45, v: 8800 }, { chg: 40, v: 9200 }, { chg: 50, v: 10500 },
    // Flag Pullback (Tight downward channel with volume dry up)
    { chg: -15, v: 2800 }, { chg: 10, v: 2400 }, { chg: -18, v: 2100 },
    { chg: 8, v: 1900 }, { chg: -12, v: 1700 },
    // Breakout Candle (Volume explosion)
    { chg: 48, upWick: 6, dnWick: 2, v: 9800 },
    // Measured Move Target Extension
    { chg: 38, v: 7900 }, { chg: 42, v: 8400 }, { chg: 35, v: 7100 }
  ]),
  entryPrice: 23235,
  stopLossPrice: 23175,
  target1Price: 23375,
  target2Price: 23450,
  riskReward: "1:3.6",
  zones: [
    { yTop: 23230, yBottom: 23190, color: '#f7a600', label: 'ORDERLY FLAG CONSOLIDATION' }
  ],
  annotations: [
    { candleIdx: 3, text: "IMPULSE FLAGPOLE (+170 pts)", position: "above", color: "#089981" },
    { candleIdx: 8, text: "VOLUME CONTRACTION (DRY UP)", position: "below", color: "#f7a600" },
    { candleIdx: 9, text: "EXPANSION BREAKOUT", position: "above", color: "#089981" }
  ]
});

// 8. ASCENDING TRIANGLE
chartBlueprints['topic-triangles-wedges'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23180, [
    { chg: 40, v: 4200 }, { chg: 30, v: 3800 }, // Touch 1 High: 23250
    { chg: -35, v: 3100 }, { chg: -20, v: 2600 }, // Low 1: 23195
    { chg: 30, v: 4500 }, { chg: 25, v: 4200 }, // Touch 2 High: 23250
    { chg: -18, v: 2200 }, { chg: -12, v: 1900 }, // Higher Low 2: 23220
    { chg: 20, v: 3900 }, // Touch 3 High: 23250
    { chg: -8, v: 1600 },  // Higher Low 3: 23235
    // Explosive Breakout Bar
    { chg: 45, upWick: 8, dnWick: 3, v: 9900 },
    { chg: 35, v: 8100 }, { chg: 40, v: 8500 }
  ]),
  entryPrice: 23255,
  stopLossPrice: 23215,
  target1Price: 23365,
  target2Price: 23440,
  riskReward: "1:3.8",
  zones: [
    { yTop: 23252, yBottom: 23248, color: '#ff3b57', label: 'FLAT SUPPLY ROOF (23,250)' }
  ],
  annotations: [
    { candleIdx: 7, text: "RISING HIGHER LOWS", position: "below", color: "#089981" },
    { candleIdx: 10, text: "COIL BREAKOUT", position: "above", color: "#089981" }
  ]
});

// 9. FIBONACCI GOLDEN POCKET (0.618 - 0.650)
chartBlueprints['topic-fib-golden-pocket'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23050, [
    // Impulse Leg 1 (23050 to 23350)
    { chg: 45, v: 5500 }, { chg: 65, v: 7200 }, { chg: 50, v: 6800 },
    { chg: 60, v: 8100 }, { chg: 80, v: 9500 },
    // Corrective ABC Pullback
    { chg: -45, v: 3200 }, { chg: 20, v: 2100 }, { chg: -50, v: 2900 },
    { chg: -35, v: 2600 },
    // Golden Pocket Reversal Pin Bar (23160)
    { chg: 15, upWick: 4, dnWick: 35, v: 7800 },
    // Continuation Wave 3
    { chg: 55, v: 8400 }, { chg: 60, v: 9100 }, { chg: 70, v: 9600 }
  ]),
  entryPrice: 23175,
  stopLossPrice: 23115,
  target1Price: 23350,
  target2Price: 23470,
  riskReward: "1:4.4",
  zones: [
    { yTop: 23175, yBottom: 23150, color: '#f7a600', label: '0.618 - 0.650 GOLDEN POCKET DISCOUNT' }
  ],
  annotations: [
    { candleIdx: 4, text: "SWING HIGH B (23,350)", position: "above", color: "#089981" },
    { candleIdx: 9, text: "GOLDEN POCKET BOUNCE", position: "below", color: "#f7a600" }
  ]
});

// 10. FIBONACCI EXTENSIONS (1.272 & 1.618)
chartBlueprints['topic-fib-extensions'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23150, [
    { chg: 35, v: 4200 }, { chg: 45, v: 5800 }, { chg: 40, v: 5100 }, // Wave 1 High: 23270
    { chg: -25, v: 2400 }, { chg: -30, v: 2100 }, // Wave 2 Low: 23215
    // Wave 3 Breakout
    { chg: 45, v: 7500 }, { chg: 40, v: 8200 },
    // 1.272 Extension Target (23360)
    { chg: 35, v: 7900 },
    // 1.618 Golden Extension Target (23420)
    { chg: 30, v: 8800 }, { chg: 35, v: 9200 }
  ]),
  entryPrice: 23275,
  stopLossPrice: 23210,
  target1Price: 23360,
  target2Price: 23425,
  riskReward: "1:3.2",
  zones: [
    { yTop: 23365, yBottom: 23355, color: '#38bdf8', label: '1.272 FIB EXTENSION (STOP RUN T1)' },
    { yTop: 23430, yBottom: 23420, color: '#089981', label: '1.618 GOLDEN EXTENSION (PROFIT T2)' }
  ],
  annotations: [
    { candleIdx: 2, text: "WAVE 1 HIGH", position: "above", color: "#64748b" },
    { candleIdx: 4, text: "WAVE 2 LOW", position: "below", color: "#64748b" },
    { candleIdx: 5, text: "BREAKOUT ENTRY", position: "above", color: "#089981" }
  ]
});

// 11. POLARITY FLIP (S/R ROLE REVERSAL)
chartBlueprints['topic-polarity-flip'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23160, [
    { chg: 30, v: 3800 }, { chg: 25, v: 3500 }, // Resistance test 1: 23215
    { chg: -25, v: 2400 }, { chg: -15, v: 2100 },
    { chg: 20, v: 3900 }, { chg: 15, v: 3600 }, // Resistance test 2: 23215
    { chg: -18, v: 1900 },
    // Breakout Surge through 23215
    { chg: 45, upWick: 6, dnWick: 2, v: 8800 },
    { chg: 25, v: 6200 },
    // First Retest into Polarity Line (Former Resistance = Support)
    { chg: -20, v: 2800 }, { chg: -15, v: 2200 },
    { chg: 10, upWick: 4, dnWick: 18, v: 6500 }, // Polarity Rejection Pin
    // Blastoff Continuation
    { chg: 40, v: 7800 }, { chg: 35, v: 8100 }
  ]),
  entryPrice: 23225,
  stopLossPrice: 23175,
  target1Price: 23325,
  target2Price: 23405,
  riskReward: "1:3.6",
  zones: [
    { yTop: 23220, yBottom: 23210, color: '#f7a600', label: 'POLARITY FLIP LINE (FORMER RESISTANCE NOW SUPPORT)' }
  ],
  annotations: [
    { candleIdx: 7, text: "CLEAN BREAKOUT", position: "above", color: "#089981" },
    { candleIdx: 11, text: "FIRST RETEST CONFIRMATION", position: "below", color: "#f7a600" }
  ]
});

// 12. INSTITUTIONAL SUPPLY & DEMAND (DBR / RBR)
chartBlueprints['topic-supply-demand-zones'] = renderTradingViewChart({
  symbol: "BANKNIFTY • 5m • NSE",
  candles: walk(51320, [
    // Drop Phase
    { chg: -55, v: 4100 }, { chg: -65, v: 5200 }, { chg: -50, v: 4900 },
    // Base Zone (2 tight candles: 51150)
    { chg: 10, upWick: 8, dnWick: 6, v: 2800 },
    { chg: -8, upWick: 5, dnWick: 4, v: 2400 },
    // Explosive Departure Rally
    { chg: 90, upWick: 10, dnWick: 2, v: 11500 },
    { chg: 75, v: 8900 }, { chg: 60, v: 7800 },
    // Pullback to Fresh Demand Zone
    { chg: -45, v: 3400 }, { chg: -50, v: 2900 }, { chg: -40, v: 2700 },
    // Fresh Retest Reversal Tap
    { chg: 25, upWick: 6, dnWick: 30, v: 9200 },
    { chg: 80, v: 10200 }, { chg: 65, v: 8800 }
  ]),
  entryPrice: 51160,
  stopLossPrice: 51090,
  target1Price: 51380,
  target2Price: 51520,
  riskReward: "1:3.5",
  zones: [
    { yTop: 51165, yBottom: 51140, color: '#089981', label: 'FRESH INSTITUTIONAL DEMAND BASE (DBR)' }
  ],
  annotations: [
    { candleIdx: 3, text: "BASE: UNFILLED BANK LIMITS", position: "below", color: "#f7a600" },
    { candleIdx: 5, text: "EXPLOSIVE DEPARTURE", position: "above", color: "#089981" },
    { candleIdx: 11, text: "FRESH RETEST TAP", position: "below", color: "#089981" }
  ]
});

// 13. SMC ORDER BLOCKS & MITIGATION
chartBlueprints['topic-smc-order-blocks'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23180, [
    { chg: -18, v: 2800 }, { chg: -22, v: 3100 },
    // Bullish Order Block (Last Red Candle before displacement)
    { chg: -25, upWick: 4, dnWick: 8, v: 4900 },
    // Giant Green Displacement creating BOS
    { chg: 55, upWick: 6, dnWick: 2, v: 10200 },
    { chg: 45, v: 8900 }, { chg: 35, v: 7400 },
    // Corrective Pullback into 50% Mean Threshold of OB
    { chg: -25, v: 2600 }, { chg: -20, v: 2200 }, { chg: -28, v: 2500 },
    // Mitigation Tap at 50%
    { chg: 15, upWick: 5, dnWick: 20, v: 8800 },
    { chg: 50, v: 9500 }, { chg: 45, v: 8700 }
  ]),
  entryPrice: 23130,
  stopLossPrice: 23085,
  target1Price: 23270,
  target2Price: 23360,
  riskReward: "1:4.0",
  zones: [
    { yTop: 23140, yBottom: 23115, color: '#089981', label: 'BULLISH ORDER BLOCK (50% MITIGATION)' }
  ],
  annotations: [
    { candleIdx: 2, text: "BULLISH ORDER BLOCK", position: "below", color: "#f7a600" },
    { candleIdx: 3, text: "BOS DISPLACEMENT", position: "above", color: "#089981" },
    { candleIdx: 8, text: "MITIGATION ENTRY", position: "below", color: "#089981" }
  ]
});

// 14. FAIR VALUE GAPS (FVG)
chartBlueprints['topic-smc-fvg'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23200, [
    // Candle 1
    { chg: 20, upWick: 8, dnWick: 3, v: 3500 },
    // Candle 2: Giant Displacement Imbalance
    { chg: 65, upWick: 5, dnWick: 2, v: 11200 },
    // Candle 3: Continuation
    { chg: 25, upWick: 15, dnWick: 4, v: 6200 },
    { chg: 20, v: 4800 },
    // Retest to fill FVG at 50% Consequent Encroachment
    { chg: -25, v: 2800 }, { chg: -30, v: 2400 },
    // Tap at 50% C.E.
    { chg: 12, upWick: 3, dnWick: 18, v: 7900 },
    // Violent Bounce
    { chg: 45, v: 8900 }, { chg: 40, v: 8400 }
  ]),
  entryPrice: 23255,
  stopLossPrice: 23215,
  target1Price: 23350,
  target2Price: 23420,
  riskReward: "1:4.0",
  zones: [
    { yTop: 23275, yBottom: 23235, color: '#38bdf8', label: 'FAIR VALUE GAP (50% CONSEQUENT ENCROACHMENT)' }
  ],
  annotations: [
    { candleIdx: 0, text: "CANDLE 1 HIGH", position: "above", color: "#f7a600" },
    { candleIdx: 2, text: "CANDLE 3 LOW", position: "above", color: "#f7a600" },
    { candleIdx: 6, text: "50% C.E. TAP FILL", position: "below", color: "#089981" }
  ]
});

// 15. SMC LIQUIDITY SWEEPS & CHOCH
chartBlueprints['topic-smc-liquidity-sweeps'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23260, [
    { chg: 30, v: 3800 }, { chg: 25, v: 4100 }, // High 1: 23315
    { chg: -25, v: 2900 }, { chg: -20, v: 2400 }, // Low: 23270
    { chg: 22, v: 3500 }, { chg: 20, v: 3900 }, // Equal High: 23315
    // Judas Swing Sweep Wick above 23315
    { chg: -15, upWick: 25, dnWick: 5, v: 8900 },
    // CHoCH breakdown breaking 23270 low
    { chg: -50, upWick: 3, dnWick: 10, v: 9500 },
    { chg: -35, v: 7800 }, { chg: -40, v: 8200 }
  ]),
  entryPrice: 23285,
  stopLossPrice: 23340,
  target1Price: 23190,
  target2Price: 23110,
  riskReward: "1:3.8",
  zones: [
    { yTop: 23325, yBottom: 23315, color: '#ff3b57', label: 'BUY-SIDE LIQUIDITY (BSL STOP RUN)' }
  ],
  annotations: [
    { candleIdx: 4, text: "EQUAL HIGHS", position: "above", color: "#64748b" },
    { candleIdx: 5, text: "JUDAS SWEEP WICK", position: "above", color: "#ff3b57" },
    { candleIdx: 6, text: "CHOCH BREAKDOWN", position: "below", color: "#ff3b57" }
  ]
});

// 16. RSI DIVERGENCE
chartBlueprints['topic-rsi-divergence'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23250, [
    { chg: 25, v: 4800 }, { chg: 30, v: 5200 }, // Peak 1: 23305 (RSI 78)
    { chg: -20, v: 2900 }, { chg: -18, v: 2400 },
    // Peak 2: Higher High at 23350 on Lower Momentum (RSI 62)
    { chg: 35, v: 3200 }, { chg: 25, v: 2800 },
    // Reversal Engulfing Red
    { chg: -45, upWick: 4, dnWick: 8, v: 8900 },
    { chg: -35, v: 7600 }, { chg: -40, v: 8100 }
  ]),
  entryPrice: 23300,
  stopLossPrice: 23360,
  target1Price: 23210,
  target2Price: 23140,
  riskReward: "1:3.5",
  zones: [
    { yTop: 23355, yBottom: 23345, color: '#ff3b57', label: 'RSI DIVERGENCE RESISTANCE CEILING' }
  ],
  annotations: [
    { candleIdx: 1, text: "PEAK 1 (RSI 78)", position: "above", color: "#64748b" },
    { candleIdx: 4, text: "PEAK 2 (RSI 62 DIVERGENCE)", position: "above", color: "#ff3b57" },
    { candleIdx: 5, text: "PE PUT ENTRY", position: "below", color: "#ff3b57" }
  ]
});

// 17. VWAP & STANDARD DEVIATION BANDS
chartBlueprints['topic-vwap-bands'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • NSE",
  candles: walk(23200, [
    { chg: 25, v: 4200 }, { chg: 35, v: 5100 },
    // Pullback to VWAP
    { chg: -20, v: 2600 }, { chg: -18, v: 2100 },
    // Rejection Bounce on VWAP
    { chg: 12, upWick: 4, dnWick: 25, v: 6800 },
    // Expansion toward +2σ Band
    { chg: 40, v: 7900 }, { chg: 35, v: 8200 }, { chg: 30, v: 7500 }
  ]),
  entryPrice: 23225,
  stopLossPrice: 23180,
  target1Price: 23310,
  target2Price: 23375,
  riskReward: "1:3.3",
  showVwap: true,
  annotations: [
    { candleIdx: 3, text: "PULLBACK TO VWAP", position: "above", color: "#f7a600" },
    { candleIdx: 4, text: "VWAP BOUNCE REJECTION", position: "below", color: "#089981" }
  ]
});

// 18. 1:15 PM GAMMA EXPLOSION (HERO-ZERO)
chartBlueprints['topic-options-greeks-gamma'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • EXPIRY DAY",
  candles: walk(23280, [
    // 12:00 PM - 1:15 PM Consolidation Box
    { chg: -6, v: 1800 }, { chg: 8, v: 1600 }, { chg: -5, v: 1500 },
    { chg: 7, v: 1700 }, { chg: -4, v: 1400 },
    // 1:15 PM Range Breakout (Gamma Ignition)
    { chg: 32, upWick: 4, dnWick: 2, v: 9800 },
    // Delta accelerates from 0.20 to 0.75
    { chg: 45, v: 12500 }, { chg: 50, v: 14200 }, { chg: 35, v: 11000 }
  ]),
  entryPrice: 23305,
  stopLossPrice: 23270,
  target1Price: 23380,
  target2Price: 23450,
  riskReward: "1:3.5",
  zones: [
    { yTop: 23290, yBottom: 23270, color: '#f7a600', label: '12:00 - 1:15 PM CONSOLIDATION COIL (STRIKE ₹24)' }
  ],
  annotations: [
    { candleIdx: 4, text: "1:15 PM COIL BREAKOUT", position: "above", color: "#089981" },
    { candleIdx: 6, text: "TARGET 1: OPTION 2x (₹48)", position: "above", color: "#089981" },
    { candleIdx: 7, text: "RUNNER: OPTION 3.8x (₹92)", position: "above", color: "#38bdf8" }
  ]
});

// 19. EQUAL CE & PE PAIRS BREAKOUT HEDGE
chartBlueprints['topic-equal-pairs-hedge'] = renderTradingViewChart({
  symbol: "NIFTY 50 • 5m • DELTA-NEUTRAL",
  candles: walk(23240, [
    // Pre-breakout consolidation box where CE ₹45 and PE ₹45 are bought
    { chg: 5, v: 2100 }, { chg: -8, v: 1900 }, { chg: 6, v: 2200 },
    { chg: -5, v: 1800 }, { chg: 4, v: 2000 },
    // Violent Breakout Candle (Explosion of winning leg)
    { chg: 55, upWick: 8, dnWick: 2, v: 11800 },
    { chg: 45, v: 10200 }, { chg: 50, v: 12100 }, { chg: 40, v: 9800 }
  ]),
  entryPrice: 23245,
  stopLossPrice: 23215,
  target1Price: 23350,
  target2Price: 23440,
  riskReward: "1:2.8",
  zones: [
    { yTop: 23250, yBottom: 23235, color: '#f7a600', label: 'EQUAL PAIR DEPLOYMENT BOX (CE ₹45 + PE ₹45 = ₹90)' }
  ],
  annotations: [
    { candleIdx: 4, text: "BUY EQUAL PAIR", position: "below", color: "#f7a600" },
    { candleIdx: 5, text: "DIRECTIONAL BREAKOUT", position: "above", color: "#089981" },
    { candleIdx: 7, text: "CE EXPLODES TO ₹148 (+₹103)", position: "above", color: "#089981" },
    { candleIdx: 7, text: "PE LOSS CAPPED AT ₹15 (-₹30)", position: "below", color: "#ff3b57" }
  ]
});

// 20. RISK MANAGEMENT & 1:3 RR MATH
chartBlueprints['topic-risk-management'] = renderTradingViewChart({
  symbol: "PORTFOLIO CAPITAL DEFENSE • 1% RISK",
  candles: walk(23200, [
    { chg: -15, v: 2500 }, { chg: -20, v: 3100 },
    // Structural Support Reversal
    { chg: 15, upWick: 4, dnWick: 28, v: 6500 },
    // 1R Stop Loss Line below wick
    { chg: 28, v: 5400 }, { chg: 32, v: 6100 },
    // Reaching 2R Target 1
    { chg: 35, v: 6800 }, { chg: 25, v: 5900 },
    // Reaching 3.5R Runner Target 2
    { chg: 40, v: 7500 }, { chg: 35, v: 8100 }
  ]),
  entryPrice: 23210,
  stopLossPrice: 23150,
  target1Price: 23330,
  target2Price: 23420,
  riskReward: "1:3.5",
  zones: [
    { yTop: 23210, yBottom: 23150, color: '#ff3b57', label: '1R MAX RISK UNIT (-60 pts / ₹1,000)' },
    { yTop: 23330, yBottom: 23210, color: '#089981', label: '2R PROFIT ZONE (+120 pts / ₹2,000)' }
  ],
  annotations: [
    { candleIdx: 2, text: "1R TECHNICAL STOP LOSS", position: "below", color: "#ff3b57" },
    { candleIdx: 4, text: "2R TARGET 1 (SELL 50%)", position: "above", color: "#089981" },
    { candleIdx: 7, text: "3.5R RUNNER (+₹3,500)", position: "above", color: "#38bdf8" }
  ]
});

module.exports = { chartBlueprints };
