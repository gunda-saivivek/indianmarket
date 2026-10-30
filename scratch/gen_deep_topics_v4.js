const { makeAnimatedTradingViewChart } = require('./tv_animated_engine.js');
const { walk } = require('./build_master_academy_v4.js');

const deepTopicsV4 = {};

// =========================================================================
// MODULE 03: THE MALAYSIAN TRADE SETUP METHOD (MALAYSIAN SNR & QMR)
// =========================================================================

// 1. MALAYSIAN SNR: V-SHAPED PEAKS & HIDDEN BASES
deepTopicsV4['topic-malaysian-snr'] = {
  id: "topic-malaysian-snr",
  moduleId: "module-malaysian",
  category: "malaysian",
  title: "Malaysian SNR: V-Shaped Peaks, Hidden Bases & Key Level Mastery",
  subtitle: "Drawing Institutional S&R Across Bodies and Base Wicks on Dalal Street",
  moduleTitle: "The Malaysian Trade Setup Method (Malaysian SNR & QMR)",
  level: "Institutional Elite",
  readTime: "13 min",
  analystNote: "Malaysian Support and Resistance (SNR) is considered the most lethal sniper price action methodology in Asia. While Western retail traders draw lines arbitrarily across wicks, Malaysian masters mark the exact line where a fresh V-shaped peak or inverted-V valley was formed by an institutional rejection candle. When price returns to this key level, entry occurs with precision down to 3-5 points.",
  tableOfContents: [
    { id: "sub-1", title: "1. The Malaysian SNR Philosophy: Why Regular Retail Lines Fail" },
    { id: "sub-2", title: "2. Major V-Shaped Rejection Peaks & Inverted-V Valleys" },
    { id: "sub-3", title: "3. The Hidden Base (Doji/Gap Breakout): Finding the Real Smart Money Wall" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Retail Traps: Drawing Lines Across Choppy Consolidation" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. The Malaysian SNR Philosophy: Why Regular Retail Lines Fail",
      content: `
        <p class="mb-3">Retail support and resistance zones fail because amateur traders draw rectangles across random clusters of candles. Malaysian SNR principles establish that a true institutional level exists ONLY where price changed direction violently with a single sharp impulse.</p>
        <p class="mb-3">On Indian indices like Nifty 50 and Bank Nifty, these levels represent the exact price thresholds where domestic and foreign institutional algorithms committed significant limit capital.</p>
      `
    },
    {
      id: "sub-2",
      title: "2. Major V-Shaped Rejection Peaks & Inverted-V Valleys",
      content: `
        <p class="mb-3">A valid Malaysian Key Level requires two conditions:</p>
        <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
          <li><strong>Clean Sharp 'V' Shape:</strong> The price must not linger or consolidate at the turning point. It must strike the level and immediately depart in the opposite direction with wide-range candles.</li>
          <li><strong>Body Line Standard:</strong> In Malaysian SNR, the primary reference line is drawn across the <strong>real body close of the highest/lowest candle</strong>, with the wick acting as the maximum stop-loss envelope.</li>
        </ul>
      `
    },
    {
      id: "sub-3",
      title: "3. The Hidden Base (Doji/Gap Breakout): Finding the Real Smart Money Wall",
      content: `
        <p class="mb-3">A Malaysian Hidden Base occurs when a tiny narrow-range candle (doji or spinning top) is immediately followed by a massive expansion candle that gaps or displaces price away.</p>
        <p class="mb-3">The horizontal line through the body of that tiny base candle becomes an invisible institutional support or resistance wall. When Nifty returns to tap that base, it acts like an electrified fence, producing immediate 40 to 80 point bounces.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "Malaysian Major V-Peak Retest Reversal",
    instrument: "NIFTY Spot / ATM Call or Put Option",
    entryTrigger: "First re-test tap of the Malaysian V-Level body with a 5-min rejection wick",
    stopLoss: "1 tick beyond the extreme wick of the V-formation (-40 pts)",
    target1: "Opposing intermediate valley (+100 pts / 1:2.5 RR)",
    target2: "Macro day high/low (+180 pts / 1:4.5 RR)",
    riskReward: "1:4.5",
    executionChecklist: [
      "The V-Peak or Valley is sharp, clean, and distinct on the 15-min or 1-hour timeframe",
      "Price returns to the level in a slow, corrective 3-wave manner",
      "Entry candle prints a clear rejection wick upon touching the Malaysian line",
      "Volume dries up on the approach, then spikes on the rejection bounce"
    ],
    pitfalls: [
      "Drawing levels inside a sideways consolidation range where no clean V-turn exists",
      "Entering on the 3rd or 4th retest of the level (first test has highest win-rate)"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "NIFTY 50 • 5m • MALAYSIAN SNR",
    candles: walk(23160, [
      { chg: 35, v: 3800 }, { chg: 45, v: 4900 },
      // Sharp V-Peak Rejection (23285)
      { chg: 45, upWick: 5, dnWick: 2, v: 8200 },
      { chg: -55, upWick: 3, dnWick: 8, v: 9100 }, // Sharp Departure
      { chg: -40, v: 6500 }, { chg: -30, v: 4200 },
      // Corrective return to Malaysian Body Line
      { chg: 25, v: 2400 }, { chg: 20, v: 2100 }, { chg: 18, v: 1900 },
      // Candle 9: EXACT ENTRY CANDLE - Retest Tap with Rejection Wick (Touches 23,245)
      { chg: -15, upWick: 22, dnWick: 4, v: 7500 },
      // Downward Expansion Wave hitting Target 1 (23,145)
      { chg: -48, v: 8900 }, { chg: -50, upWick: 5, dnWick: 15, v: 9400 }, { chg: -35, v: 7800 }
    ]),
    entryCandleIdx: 9,
    entryPrice: 23245,
    stopLossPrice: 23290,
    target1Price: 23145,
    target2Price: 23065,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23285, yBottom: 23275, color: '#ff3b57', label: 'MALAYSIAN MAJOR V-PEAK RESISTANCE', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 2, text: "SHARP V-PEAK", position: "above", color: "#ff3b57" }
    ]
  })
};

// 2. MALAYSIAN QMR & UMAR 40% REJECTION WICK
deepTopicsV4['topic-malaysian-qmr'] = {
  id: "topic-malaysian-qmr",
  moduleId: "module-malaysian",
  category: "malaysian",
  title: "Malaysian Quasimodo Reversal (QMR) & The Umar 40% Rejection Wick Rule",
  subtitle: "High, Low, Higher High Liquidity Sweep, Lower Low & Left Shoulder Retest",
  moduleTitle: "The Malaysian Trade Setup Method (Malaysian SNR & QMR)",
  level: "Institutional Elite",
  readTime: "13 min",
  analystNote: "The Malaysian Quasimodo Reversal (QMR) is the ultimate synthesis of classical price geometry and smart money liquidity sweeps. Combined with the quantitative Umar Rejection Wick rule (wick must occupy at least 40% of total candle range), this setup filters out 85% of false breakouts on Nifty and Bank Nifty.",
  tableOfContents: [
    { id: "sub-1", title: "1. The Anatomy of Malaysian QMR: The 4 Structural Pivots" },
    { id: "sub-2", title: "2. The Umar 40% Rejection Wick Rule: Mathematical Proof of Absorption" },
    { id: "sub-3", title: "3. The Displacement Check: 35%+ Body Expansion Away from Key Level" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Entering Ahead of Displacement: Avoiding Premature Fades" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. The Anatomy of Malaysian QMR: The 4 Structural Pivots",
      content: `
        <p class="mb-3">A Malaysian Bearish QMR unfolds across four distinct structural stages:</p>
        <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
          <li><strong>High (H):</strong> Initial momentum peak establishing Left Shoulder resistance.</li>
          <li><strong>Low (L):</strong> First swing pullback establishing the support floor.</li>
          <li><strong>Higher High (HH):</strong> Price pushes above the High, hunting all retail breakout buyers and sweeping resting buy-stop liquidity.</li>
          <li><strong>Lower Low (LL):</strong> Price crashes aggressively below the Low (L), breaking market structure (Change of Character).</li>
        </ul>
        <p class="mb-3">The entry is executed when price pulls back to the horizontal level of the <strong>Left Shoulder (H)</strong>.</p>
      `
    },
    {
      id: "sub-2",
      title: "2. The Umar 40% Rejection Wick Rule: Mathematical Proof of Absorption",
      content: `
        <p class="mb-3">To eliminate subjective guesswork, quantitative proprietary systems apply the <strong>Umar Rejection Filter</strong>:</p>
        <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
          <li>The rejection wick on the Higher High (sweep bar) must occupy <strong>at least 40% of the entire candle's high-to-low range</strong>.</li>
          <li>If the wick is less than 40%, the sweep lacked institutional absorption and must be skipped.</li>
        </ul>
      `
    },
    {
      id: "sub-3",
      title: "3. The Displacement Check: 35%+ Body Expansion Away from Key Level",
      content: `
        <p class="mb-3">Immediately following the 40% rejection wick, the subsequent candle must be a displacement bar whose real body constitutes at least 35% of the candle range in the reversal direction. This confirms that institutions are actively selling with size.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "Malaysian QMR + Umar 40% Wick Reversal",
    instrument: "BANK NIFTY Spot / ATM Put Option",
    entryTrigger: "Pullback touch of the Malaysian Left Shoulder Key Level after Lower Low is printed",
    stopLoss: "1 tick above the Higher High liquidity sweep wick (-75 pts)",
    target1: "The Lower Low trough (+160 pts / 1:2.1 RR)",
    target2: "Higher timeframe support floor (+280 pts / 1:3.7 RR)",
    riskReward: "1:3.7",
    executionChecklist: [
      "Four pivots are verified: High (H), Low (L), Higher High (HH), Lower Low (LL)",
      "Higher High candle features an Umar rejection wick of 40% or greater",
      "Displacement down breaks cleanly below the previous Low (L)",
      "Enter upon the first retest of the Left Shoulder horizontal line"
    ],
    pitfalls: [
      "Entering before the Lower Low (LL) is created (the pattern is not a QMR until structure breaks)",
      "Trading when the sweep wick is small and lacks institutional absorption"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "BANKNIFTY • 5m • MALAYSIAN QMR",
    candles: walk(51270, [
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
    ]),
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
      { candleIdx: 1, text: "HIGH (H)", position: "above", color: "#f7a600" },
      { candleIdx: 3, text: "LOW (L)", position: "below", color: "#64748b" },
      { candleIdx: 5, text: "HH: UMAR 40% WICK", position: "above", color: "#ff3b57", isAnimated: true },
      { candleIdx: 7, text: "LL (BOS BREAK)", position: "below", color: "#ff3b57" }
    ]
  })
};

// =========================================================================
// MODULE 04: FAIR VALUE GAPS (FVG) & INVERSION FVG (iFVG) — DODGYSDD
// =========================================================================

// 3. STANDARD FVG
deepTopicsV4['topic-fvg-imbalance'] = {
  id: "topic-fvg-imbalance",
  moduleId: "module-fvg-ifvg",
  category: "fvg-ifvg",
  title: "Standard 3-Bar Fair Value Gap (FVG) & 50% Consequent Encroachment",
  subtitle: "Trading Market Delivery Voids and Algorithmic Order Balancing",
  moduleTitle: "Fair Value Gaps (FVG) & Inversion FVG (iFVG) — DodgysDD Framework",
  level: "Institutional Elite",
  readTime: "12 min",
  analystNote: "Electronic markets operate via the Interbank Price Delivery Algorithm. When a massive institutional order causes a one-sided expansion, it skips bids and offers. The resulting void between Candle 1 and Candle 3 is a Fair Value Gap (FVG). The algorithm is programmed to return and balance price before true trend continuation occurs.",
  tableOfContents: [
    { id: "sub-1", title: "1. Algorithmic Price Delivery: Why 3-Bar Voids Must Be Rebalanced" },
    { id: "sub-2", title: "2. Consequent Encroachment (50% C.E.): The Precision Limit Order Trigger" },
    { id: "sub-3", title: "3. Premium vs Discount Array Alignment on Nifty & Bank Nifty" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Traps: Trading Counter-Trend FVGs Without Macro Bias" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. Algorithmic Price Delivery: Why 3-Bar Voids Must Be Rebalanced",
      content: `
        <p class="mb-3">A Bullish Fair Value Gap is an imbalance created across three consecutive candles where <strong>the low of Candle 3 does not overlap with the high of Candle 1</strong>. The space between them is pure unfilled liquidity.</p>
        <p class="mb-3">In Nifty options, these gaps occur when heavy institutional buying sweeps the option chain. Price pulls back into the gap to fill institutional buy limit orders before continuing higher.</p>
      `
    },
    {
      id: "sub-2",
      title: "2. Consequent Encroachment (50% C.E.): The Precision Limit Order Trigger",
      content: `
        <p class="mb-3">The exact 50% midpoint of the FVG box is termed <strong>Consequent Encroachment (C.E.)</strong>. Prop desks place limit buy orders precisely at 50% C.E., allowing for minimum stop loss risk and maximum reward asymmetry.</p>
      `
    },
    {
      id: "sub-3",
      title: "3. Premium vs Discount Array Alignment on Nifty & Bank Nifty",
      content: `
        <p class="mb-3">Only buy bullish FVGs that rest in the <strong>Discount Area</strong> (below the 50% equilibrium of the day's dealing range). Buying an FVG in the Premium Area (upper half of range) significantly reduces win probability.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "Institutional 50% C.E. Imbalance Tap",
    instrument: "NIFTY Spot / ATM Call Option",
    entryTrigger: "Tap into 50% Consequent Encroachment of the FVG on 5-min chart",
    stopLoss: "1 tick below Candle 1 High (-35 pts)",
    target1: "High of the Candle 2 displacement bar (+85 pts / 1:2.4 RR)",
    target2: "External daily liquidity pool (+150 pts / 1:4.2 RR)",
    riskReward: "1:4.2",
    executionChecklist: [
      "FVG gap is clearly defined between Candle 1 High and Candle 3 Low",
      "Macro trend aligns with 200 EMA",
      "Pullback into the FVG is corrective with low volume",
      "Stop loss is positioned below the Candle 1 wick"
    ],
    pitfalls: [
      "Trading tiny 2-point micro gaps that have no institutional significance",
      "Buying FVGs that form against the prevailing higher-timeframe trend"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "NIFTY 50 • 5m • FVG IMBALANCE",
    candles: walk(23180, [
      { chg: 15, v: 2800 }, // 0: 23195
      { chg: 22, upWick: 8, dnWick: 3, v: 3900 }, // 1: High 23225 (FVG Bottom)
      { chg: 68, upWick: 5, dnWick: 2, v: 12500 }, // 2: Giant Displacement Bar
      { chg: 25, upWick: 10, dnWick: 4, v: 6800 }, // 3: High 23320, Low 23281 (FVG Top)
      { chg: -15, v: 5100 }, // 4: 23295
      { chg: -25, v: 2800 }, // 5: 23270
      { chg: -18, v: 2400 }, // 6: 23252
      { chg: -6, upWick: 4, dnWick: 12, v: 8400 }, // 7: EXACT ENTRY CANDLE! 50% C.E. Tap at 23,245
      { chg: 45, upWick: 5, dnWick: 2, v: 9200 }, // 8: Departure
      { chg: 48, upWick: 6, dnWick: 2, v: 8800 }, // 9: Thrust
      { chg: 35, upWick: 15, dnWick: 2, v: 8100 }  // 10: Hits Target 1 (23,340)
    ]),
    entryCandleIdx: 7,
    entryPrice: 23245,
    stopLossPrice: 23205,
    target1Price: 23340,
    target2Price: 23410,
    riskReward: "1:4.2",
    zones: [
      { yTop: 23281, yBottom: 23225, color: '#38bdf8', label: 'FAIR VALUE GAP (50% CONSEQUENT ENCROACHMENT: 23,245)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 1, text: "CANDLE 1 HIGH", position: "above", color: "#f7a600" },
      { candleIdx: 3, text: "CANDLE 3 LOW", position: "above", color: "#f7a600" }
    ]
  })
};

// 4. INVERSION FVG (iFVG) - DODGYSDD
deepTopicsV4['topic-ifvg-inversion'] = {
  id: "topic-ifvg-inversion",
  moduleId: "module-fvg-ifvg",
  category: "fvg-ifvg",
  title: "Inversion FVG (iFVG): Violent Inversion Mechanics & Grey Box Retest Playbook",
  subtitle: "The DodgysDD Universal Setup: Trading Failed Gaps with 200 EMA Macro Confluence",
  moduleTitle: "Fair Value Gaps (FVG) & Inversion FVG (iFVG) — DodgysDD Framework",
  level: "Institutional Elite",
  readTime: "13 min",
  analystNote: "The Inversion Fair Value Gap (iFVG) is the core proprietary edge of the DodgysDD institutional trading card framework. When an expected bullish FVG fails to support price and is violently blown through by institutional sellers, the gap INVERTS. That broken zone immediately converts into a brick wall of institutional supply resistance.",
  tableOfContents: [
    { id: "sub-1", title: "1. What is an Inversion FVG (iFVG)? When Support Inverts into Resistance" },
    { id: "sub-2", title: "2. The 15-Bar Inversion Rule: Validating High-Velocity Institutional Breaks" },
    { id: "sub-3", title: "3. The 12-Bar Retest Window & Anti-Hunt ATR Stop Buffer" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Overholding Past Retest Window: When iFVGs Degrade into Chop" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. What is an Inversion FVG (iFVG)? When Support Inverts into Resistance",
      content: `
        <p class="mb-3">Most retail traders lose money trying to buy every single FVG. When smart money wants to reverse the market, they intentionally crush through an existing FVG with aggressive volume.</p>
        <p class="mb-3">Once price closes completely through the FVG box, that box is labeled as an <strong>Inversion FVG (iFVG)</strong>. What was once expected support is now certified resistance.</p>
      `
    },
    {
      id: "sub-2",
      title: "2. The 15-Bar Inversion Rule: Validating High-Velocity Institutional Breaks",
      content: `
        <p class="mb-3">According to the DodgysDD quant specification, the FVG must be violently inverted within <strong>15 bars</strong> of its formation. Slow, drifting penetrations do not qualify; only high-velocity displacement candles count as institutional inversions.</p>
      `
    },
    {
      id: "sub-3",
      title: "3. The 12-Bar Retest Window & Anti-Hunt ATR Stop Buffer",
      content: `
        <p class="mb-3">Once inverted, price must retest the Grey Dashed iFVG Box within <strong>12 bars</strong>. To prevent retail stop hunts, position your stop loss beyond the iFVG box with an Anti-Hunt buffer of 0.40 &times; ATR.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "DodgysDD Inversion FVG (iFVG) Retest Execution",
    instrument: "NIFTY Spot / ATM Put (PE) Option",
    entryTrigger: "Pullback retest into the Grey Dashed iFVG Box within the 12-bar window",
    stopLoss: "1 tick beyond the opposite side of the iFVG box + 0.4x ATR buffer (-45 pts)",
    target1: "First external swing low (+95 pts / 1:2.1 RR)",
    target2: "Higher timeframe liquidity pool (+180 pts / 1:4.0 RR)",
    riskReward: "1:4.0",
    executionChecklist: [
      "Prior FVG is cleanly breached and closed beyond within 15 bars",
      "Retest of the iFVG box occurs within the 12-bar window",
      "Trade aligns with 200 EMA macro trend direction",
      "Stop loss includes dynamic ATR anti-hunt buffer"
    ],
    pitfalls: [
      "Taking retests that take longer than 12 bars to arrive (loss of institutional momentum)",
      "Trading iFVGs that formed against the 200 EMA direction"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "NIFTY 50 • 5m • DODGYSDD iFVG",
    candles: walk(23310, [
      { chg: 20, v: 4200 }, // 0: 23330
      { chg: 25, upWick: 5, dnWick: 3, v: 4800 }, // 1: High 23360
      { chg: 40, upWick: 6, dnWick: 2, v: 5500 }, // 2: 23395 (FVG created)
      { chg: 15, upWick: 8, dnWick: 4, v: 4100 }, // 3: 23410
      // Violent Inversion Candle (breaks below 23,360)
      { chg: -75, upWick: 4, dnWick: 6, v: 13500 }, // 4: 23335 (Inversion confirmed)
      { chg: -35, v: 8900 }, // 5: 23300
      { chg: -20, v: 7200 }, // 6: 23280 (Structure low 23274)
      // Pullback into inverted FVG (23,340)
      { chg: 35, v: 3100 }, // 7: 23315
      { chg: 15, upWick: 15, dnWick: 3, v: 9200 }, // 8: EXACT ENTRY CANDLE! (Retest taps 23,340)
      // Downward continuation hitting Target 1 (23,220)
      { chg: -45, v: 10200 }, // 9: 23285
      { chg: -50, v: 9500 }, // 10: 23235
      { chg: -35, upWick: 4, dnWick: 12, v: 8800 } // 11: Hits Target 1 (23,220)
    ]),
    entryCandleIdx: 8,
    entryPrice: 23340,
    stopLossPrice: 23385,
    target1Price: 23220,
    target2Price: 23150,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23365, yBottom: 23335, color: '#94a3b8', label: 'DODGYSDD INVERSION FVG (GREY DASHED iFVG RETEST)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 4, text: "VIOLENT INVERSION BREAK", position: "above", color: "#ff3b57" }
    ]
  })
};

// =========================================================================
// MODULE 05: INSTITUTIONAL LIQUIDITY SWEEPS & AUCTION MARKET THEORY (ATLAS AMT)
// =========================================================================

// 5. PDH & PDL SWEEPS
deepTopicsV4['topic-amt-pdh-pdl'] = {
  id: "topic-amt-pdh-pdl",
  moduleId: "module-liquidity-amt",
  category: "liquidity-amt",
  title: "PDH & PDL Liquidity Sweeps: External vs Internal Range Order Flow",
  subtitle: "Hunting Resting Stops Above Previous Day High & Below Previous Day Low",
  moduleTitle: "Institutional Liquidity Sweeps & Auction Market Theory (Atlas AMT)",
  level: "Institutional Elite",
  readTime: "12 min",
  analystNote: "The Previous Day High (PDH) and Previous Day Low (PDL) are the two most massive liquidity magnets on Dalal Street. When Nifty breaks above PDH, amateur retail breakout traders rush to buy market orders. Smart money uses that flood of retail liquidity to fill massive institutional short orders, slamming price back below PDH.",
  tableOfContents: [
    { id: "sub-1", title: "1. External vs Internal Range Liquidity: The Market's Eternal Delivery Loop" },
    { id: "sub-2", title: "2. The PDH / PDL Sweep Signature: Stop Hunts into False Breakouts" },
    { id: "sub-3", title: "3. Reclaim Execution: Entering on 5-Minute Candle Close Back Inside Range" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Runaway Trend Days: Recognizing Real Institutional Breakouts" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. External vs Internal Range Liquidity: The Market's Eternal Delivery Loop",
      content: `
        <p class="mb-3">Market price delivery operates in a permanent two-way cycle:</p>
        <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
          <li><strong>External Liquidity:</strong> The outer extremes of the market (PDH, PDL, Weekly Highs/Lows).</li>
          <li><strong>Internal Liquidity:</strong> Fair Value Gaps, Order Blocks, and consolidation equilibrium inside the range.</li>
        </ul>
        <p class="mb-3">Once price sweeps External Liquidity (PDH/PDL), its algorithmic target is immediately magnetized toward the nearest Internal Liquidity pool.</p>
      `
    },
    {
      id: "sub-2",
      title: "2. The PDH / PDL Sweep Signature: Stop Hunts into False Breakouts",
      content: `
        <p class="mb-3">A genuine PDH sweep creates a high above PDH on an intraday wick, but fails to maintain volume acceptance. The candle closes back below the PDH level, leaving retail buyers trapped at the exact high of the day.</p>
      `
    },
    {
      id: "sub-3",
      title: "3. Reclaim Execution: Entering on 5-Minute Candle Close Back Inside Range",
      content: `
        <p class="mb-3">Do not try to guess the exact top wick. Wait for the 5-minute candle to close firmly back below the PDH level. Enter immediately on the close with a stop loss placed 1 tick above the sweep wick high.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "Previous Day High (PDH) Liquidity Sweep & Mean Reversion",
    instrument: "NIFTY Spot / ATM Put Option",
    entryTrigger: "5-min candle close back below PDH after sweeping buy-side stops",
    stopLoss: "1 tick above the sweep wick peak (-45 pts)",
    target1: "Previous Day Midpoint (PDM) (+95 pts / 1:2.1 RR)",
    target2: "Previous Day Low (PDL) (+180 pts / 1:4.0 RR)",
    riskReward: "1:4.0",
    executionChecklist: [
      "Price wicks above PDH by 10 to 30 points (sweeping retail stops)",
      "Candle fails to hold and closes back below PDH on elevated volume",
      "Volume Profile shows low volume node above PDH (rejection)",
      "Next candle confirms downward follow-through"
    ],
    pitfalls: [
      "Shorting into strong trending days where price closes above PDH on heavy institutional volume",
      "Failing to respect stop loss if price breaks above the sweep wick high"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "NIFTY 50 • 5m • PDH LIQUIDITY SWEEP",
    candles: walk(23260, [
      { chg: 30, v: 4100 }, // 0: 23290
      { chg: 35, v: 4800 }, // 1: 23325
      { chg: 30, v: 5200 }, // 2: 23355
      { chg: 20, v: 5800 }, // 3: 23375
      // Candle 4: PDH Sweep Wick (sweeps to 23,415, closes 23,370)
      { chg: -5, upWick: 45, dnWick: 3, v: 12800 }, // 4: High 23415
      // Candle 5: EXACT ENTRY CANDLE - Reclaim Confirmation (closes below PDH at 23,345)
      { chg: -25, upWick: 4, dnWick: 8, v: 10500 }, // 5: O: 23370, C: 23345, touches 23355
      // Markdown
      { chg: -45, v: 8900 }, // 6: 23300
      { chg: -40, v: 7900 }, // 7: 23260
      { chg: -50, upWick: 5, dnWick: 15, v: 9200 }, // 8: Low 23195 (Hits Target 1: 23220)
      { chg: -35, v: 7600 } // 9
    ]),
    entryCandleIdx: 5,
    entryPrice: 23355,
    stopLossPrice: 23420,
    target1Price: 23220,
    target2Price: 23150,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23385, yBottom: 23375, color: '#ff3b57', label: 'PREVIOUS DAY HIGH (PDH EXTERNAL LIQUIDITY)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 4, text: "PDH STOP HUNT WICK", position: "above", color: "#ff3b57", isAnimated: true }
    ]
  })
};

// 6. ATLAS AMT VALUE AREAS (pVAH / pVAL / pPOC)
deepTopicsV4['topic-amt-value-areas'] = {
  id: "topic-amt-value-areas",
  moduleId: "module-liquidity-amt",
  category: "liquidity-amt",
  title: "Atlas AMT Playbook: Value Area (pVAH/pVAL) & Point of Control (pPOC) Reversals",
  subtitle: "The 3 Atlas Auction Methods: Fading pVAH, Dip Buying pVAL, and Deep PDL Reversals",
  moduleTitle: "Institutional Liquidity Sweeps & Auction Market Theory (Atlas AMT)",
  level: "Institutional Elite",
  readTime: "13 min",
  analystNote: "Auction Market Theory (AMT) establishes that 70% of market volume takes place within the Value Area (VA). The boundaries are Previous Value Area High (pVAH) and Previous Value Area Low (pVAL), with the heaviest volume resting at Point of Control (pPOC). When price trades outside the Value Area without acceptance, it is statistically rejected back to the Point of Control.",
  tableOfContents: [
    { id: "sub-1", title: "1. Volume Profile Auction Distribution: 70% Value Area Mechanics" },
    { id: "sub-2", title: "2. Method 1: Short PDH + pVAH + pwPOC Value Area Rejection Fade" },
    { id: "sub-3", title: "3. Method 2 & 3: Long PDM + pVAL Dip Buys & Deep 1.272 Fib Sweeps" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Trading Against Volume Profile: The Value Migration Error" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. Volume Profile Auction Distribution: 70% Value Area Mechanics",
      content: `
        <p class="mb-3">Institutional algorithms benchmark market balance using the Gaussian distribution of volume. The 70% Value Area defines fair price:</p>
        <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
          <li><strong>pVAH (Value Area High):</strong> Premium boundary. Unaccepted price exploration above pVAH produces violent short opportunities.</li>
          <li><strong>pVAL (Value Area Low):</strong> Discount boundary. Institutional dip buyers step in at pVAL.</li>
          <li><strong>pPOC (Point of Control):</strong> The price level where the highest volume was transacted yesterday. Acts as a high-probability magnet target.</li>
        </ul>
      `
    },
    {
      id: "sub-2",
      title: "2. Method 1: Short PDH + pVAH + pwPOC Value Area Rejection Fade",
      content: `
        <p class="mb-3">The Atlas Method 1 short triggers when Nifty spikes above PDH and tests pVAH / pwPOC confluence. When an absorption rejection wick prints, smart money fades price all the way back to pPOC.</p>
      `
    },
    {
      id: "sub-3",
      title: "3. Method 2 & 3: Long PDM + pVAL Dip Buys & Deep 1.272 Fib Sweeps",
      content: `
        <p class="mb-3">Method 2 dip-buys the pullback into Previous Day Midpoint (PDM) and pVAL during an ongoing bull trend. Method 3 buys deep stop-sweeps below PDL into the 1.272 - 1.414 Fibonacci extension zone.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "Atlas AMT Method 1 Value Area Fade",
    instrument: "NIFTY Spot / ATM Option",
    entryTrigger: "Rejection wick at pVAH / PDH confluence closing back below pVAH",
    stopLoss: "1 tick above the rejection wick high (-40 pts)",
    target1: "pPOC (Point of Control) (+80 pts / 1:2.0 RR)",
    target2: "pVAL (Value Area Low) (+140 pts / 1:3.5 RR)",
    riskReward: "1:3.5",
    executionChecklist: [
      "Key AMT auction levels (pVAH, pPOC, pVAL, PDH) plotted accurately",
      "Rejection candle forms directly at pVAH / PDH confluence",
      "Price fails to build value above pVAH",
      "Target is set at the high-volume pPOC node"
    ],
    pitfalls: [
      "Trying to fade an opening drive where price builds volume acceptance above pVAH",
      "Exiting ahead of the pPOC magnet target"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "NIFTY 50 • 5m • ATLAS AMT PLAYBOOK",
    candles: walk(23220, [
      { chg: 30, v: 4200 }, // 0: 23250
      { chg: 35, v: 4900 }, // 1: 23285
      // Candle 2: Spike to pVAH (23,310) with rejection wick to 23,335
      { chg: 10, upWick: 40, dnWick: 4, v: 9800 }, // 2: High 23335, C: 23295
      // Candle 3: EXACT ENTRY CANDLE - Rejection down into Value Area
      { chg: -20, upWick: 10, dnWick: 5, v: 8500 }, // 3: H: 23305, touches 23285
      { chg: -30, v: 6200 }, // 4: 23245
      { chg: -30, v: 7100 }, // 5: 23215
      { chg: -25, upWick: 4, dnWick: 18, v: 8400 }, // 6: Hits Target 1 (23,210)
      { chg: -20, v: 6400 } // 7
    ]),
    entryCandleIdx: 3,
    entryPrice: 23285,
    stopLossPrice: 23345,
    target1Price: 23210,
    target2Price: 23150,
    riskReward: "1:3.5",
    zones: [
      { yTop: 23315, yBottom: 23305, color: '#ef4444', label: 'pVAH (VALUE AREA HIGH PREMIUM CEILING)', isAnimated: true },
      { yTop: 23255, yBottom: 23245, color: '#eab308', label: 'pPOC (POINT OF CONTROL VALUE MAGNET)' },
      { yTop: 23195, yBottom: 23185, color: '#3b82f6', label: 'pVAL (VALUE AREA LOW DISCOUNT FLOOR)' }
    ],
    annotations: [
      { candleIdx: 2, text: "pVAH REJECTION WICK", position: "above", color: "#ef4444", isAnimated: true }
    ]
  })
};

// 7. JUDAS SWING 9:15 AM
deepTopicsV4['topic-judas-swing'] = {
  id: "topic-judas-swing",
  moduleId: "module-liquidity-amt",
  category: "liquidity-amt",
  title: "The Dalal Street Judas Swing & 9:15 AM Opening Trap Reversals",
  subtitle: "Deconstructing the First 30 Minutes of Market Open on Nifty & Bank Nifty",
  moduleTitle: "Institutional Liquidity Sweeps & Auction Market Theory (Atlas AMT)",
  level: "Institutional Elite",
  readTime: "13 min",
  analystNote: "The opening 30 minutes (9:15 AM to 9:45 AM) on Dalal Street is the graveyard of retail traders. Market makers intentionally generate an aggressive initial drive in the OPPOSITE direction of the true day's trend to trigger pre-market stop orders and trap breakout traders. Once retail capital is trapped, the real institutional move begins.",
  tableOfContents: [
    { id: "sub-1", title: "1. The Anatomy of a Judas Swing: The Engineered Morning Fakeout" },
    { id: "sub-2", title: "2. Asian & Pre-Market High/Low Liquidity Engineering" },
    { id: "sub-3", title: "3. The 9:45 AM Reversal Confirmation Rule: Entering with True Trend Direction" },
    { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
    { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
    { id: "sub-6", title: "6. Overtrading 9:15-9:30 AM: Why Impatient Retail Traders Always Lose" }
  ],
  subTopics: [
    {
      id: "sub-1",
      title: "1. The Anatomy of a Judas Swing: The Engineered Morning Fakeout",
      content: `
        <p class="mb-3">A Judas Swing occurs when price opens at 9:15 AM, drives aggressively upwards (or downwards) for 2 to 4 candles, looks like a runaway trend, and then violently reverses.</p>
        <p class="mb-3">This move exists for one reason only: to create liquidity. The fakeout triggers retail breakout buy orders, allowing institutions to sell into that liquidity at maximum premium.</p>
      `
    },
    {
      id: "sub-2",
      title: "2. Asian & Pre-Market High/Low Liquidity Engineering",
      content: `
        <p class="mb-3">Before 9:15 AM, mark the Asian Session High/Low and the GIFT Nifty pre-market high/low. 82% of Judas Swings terminate immediately upon sweeping those pre-market levels.</p>
      `
    },
    {
      id: "sub-3",
      title: "3. The 9:45 AM Reversal Confirmation Rule: Entering with True Trend Direction",
      content: `
        <p class="mb-3">Never trade between 9:15 AM and 9:30 AM. Wait for the 9:30-9:45 AM window. Once the Judas Swing fails and price breaks structure in the opposite direction, enter in the direction of the real institutional trend.</p>
      `
    }
  ],
  tradeDetails: {
    setupType: "Opening Judas Swing Trap & True Trend Reversal",
    instrument: "NIFTY Spot / ATM Put or Call Option",
    entryTrigger: "Break of opening range extreme after Judas fakeout fails on 5-min chart (approx 9:45 AM)",
    stopLoss: "1 tick beyond the extreme high/low of the Judas fakeout wick (-45 pts)",
    target1: "Opposite side of morning opening range (+90 pts / 1:2.0 RR)",
    target2: "Day extension target (+180 pts / 1:4.0 RR)",
    riskReward: "1:4.0",
    executionChecklist: [
      "Judas swing tests pre-market high/low or key daily level",
      "Sharp rejection wick forms between 9:25 AM and 9:40 AM",
      "Next candle provides decisive displacement in the opposite direction",
      "Do not enter ahead of 9:30 AM without clear structural failure"
    ],
    pitfalls: [
      "Jumping into trades in the first 5 minutes (9:15-9:20 AM)",
      "Fighting the true post-9:45 AM trend after the trap is set"
    ]
  },
  svgBlueprint: makeAnimatedTradingViewChart({
    symbol: "NIFTY 50 • 5m • 9:15 AM JUDAS SWING",
    candles: walk(23210, [
      { chg: 35, v: 8500 }, // 0: 23245
      { chg: 45, v: 9800 }, // 1: 23290
      // Candle 2: Sweep of Pre-Market High (High 23,325, Close 23,285)
      { chg: -5, upWick: 40, dnWick: 4, v: 14200 }, // 2: Judas Trap Wick!
      // Candle 3: Trap Confirmed (Displacement red candle)
      { chg: -45, upWick: 4, dnWick: 6, v: 12100 }, // 3: 23240
      // Candle 4: EXACT ENTRY CANDLE (Retest bounce fails at 23,250)
      { chg: -15, upWick: 18, dnWick: 4, v: 9500 }, // 4: O: 23240, H: 23258, touches 23250
      // Markdown hitting Target 1 (23,140)
      { chg: -45, v: 9200 }, // 5: 23180
      { chg: -45, upWick: 5, dnWick: 12, v: 9100 }, // 6: Hits Target 1 (23,140)
      { chg: -30, v: 8100 } // 7
    ]),
    entryCandleIdx: 4,
    entryPrice: 23250,
    stopLossPrice: 23325,
    target1Price: 23140,
    target2Price: 23060,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23315, yBottom: 23305, color: '#ff3b57', label: 'PRE-MARKET HIGH (JUDAS SWING STOP HUNT)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 2, text: "9:25 AM JUDAS FAKEOUT", position: "above", color: "#ff3b57", isAnimated: true }
    ]
  })
};

module.exports = { deepTopicsV4 };
