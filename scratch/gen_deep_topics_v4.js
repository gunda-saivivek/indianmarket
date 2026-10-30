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
      // Re-test Tap with Rejection Wick
      { chg: -15, upWick: 22, dnWick: 4, v: 7500 },
      // Downward Expansion Wave
      { chg: -48, v: 8900 }, { chg: -42, v: 8400 }, { chg: -35, v: 7800 }
    ]),
    entryPrice: 23245,
    stopLossPrice: 23290,
    target1Price: 23145,
    target2Price: 23065,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23285, yBottom: 23275, color: '#ff3b57', label: 'MALAYSIAN MAJOR V-PEAK RESISTANCE', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 2, text: "SHARP V-PEAK", position: "above", color: "#ff3b57" },
      { candleIdx: 9, text: "MALAYSIAN RETEST TAP", position: "above", color: "#f7a600", isAnimated: true },
      { candleIdx: 10, text: "PE PUT ENTRY", position: "below", color: "#089981" }
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
    candles: walk(51200, [
      // High (Left Shoulder): 51340
      { chg: 45, v: 4100 }, { chg: 50, v: 4800 }, { chg: 45, v: 5200 },
      // Low (Trough): 51220
      { chg: -40, v: 3600 }, { chg: -45, v: 3900 }, { chg: -35, v: 3400 },
      // Higher High Liquidity Sweep (Umar 40% Wick): 51420
      { chg: 65, v: 6100 }, { chg: 75, v: 7200 },
      { chg: -20, upWick: 55, dnWick: 5, v: 11200 }, // Umar 40%+ Rejection Wick!
      // Displacement down to Lower Low: 51160 (Breaks 51220 Low)
      { chg: -85, v: 9800 }, { chg: -75, v: 9100 }, { chg: -60, v: 8400 },
      // Corrective Pullback to Left Shoulder Key Level (51340)
      { chg: 40, v: 3100 }, { chg: 45, v: 2800 }, { chg: 35, v: 2600 },
      // QMR Retest Reversal
      { chg: -50, upWick: 15, dnWick: 6, v: 8800 },
      { chg: -70, v: 9900 }, { chg: -65, v: 9200 }
    ]),
    entryPrice: 51335,
    stopLossPrice: 51430,
    target1Price: 51150,
    target2Price: 50980,
    riskReward: "1:3.7",
    zones: [
      { yTop: 51345, yBottom: 51330, color: '#f7a600', label: 'MALAYSIAN QMR LEFT SHOULDER ENTRY LEVEL', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 2, text: "HIGH (H)", position: "above", color: "#f7a600" },
      { candleIdx: 5, text: "LOW (L)", position: "below", color: "#64748b" },
      { candleIdx: 8, text: "HH: UMAR 40% WICK", position: "above", color: "#ff3b57", isAnimated: true },
      { candleIdx: 11, text: "LL (BOS BREAK)", position: "below", color: "#ff3b57" },
      { candleIdx: 15, text: "QMR RETEST ENTRY", position: "above", color: "#089981" }
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
      { chg: 15, v: 2800 },
      // Candle 1
      { chg: 22, upWick: 8, dnWick: 3, v: 3900 },
      // Candle 2: Giant Green Displacement Bar (Creates FVG)
      { chg: 68, upWick: 5, dnWick: 2, v: 12500 },
      // Candle 3: Continuation (Leaves gap with Candle 1)
      { chg: 25, upWick: 15, dnWick: 4, v: 6800 },
      { chg: 18, v: 5100 },
      // Corrective Pullback to fill FVG at 50% C.E.
      { chg: -25, v: 2800 }, { chg: -30, v: 2400 },
      // Tap at 50% C.E. Reversal Bar
      { chg: 12, upWick: 4, dnWick: 20, v: 8400 },
      // Explosive Takeoff
      { chg: 48, v: 9200 }, { chg: 42, v: 8800 }, { chg: 38, v: 8100 }
    ]),
    entryPrice: 23240,
    stopLossPrice: 23205,
    target1Price: 23325,
    target2Price: 23390,
    riskReward: "1:4.2",
    zones: [
      { yTop: 23265, yBottom: 23215, color: '#38bdf8', label: 'FAIR VALUE GAP (50% CONSEQUENT ENCROACHMENT)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 1, text: "CANDLE 1 HIGH", position: "above", color: "#f7a600" },
      { candleIdx: 3, text: "CANDLE 3 LOW", position: "above", color: "#f7a600" },
      { candleIdx: 7, text: "50% C.E. TAP FILL", position: "below", color: "#089981", isAnimated: true }
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
    candles: walk(23320, [
      // Prior Bullish Attempt
      { chg: 25, v: 4200 }, { chg: 30, v: 4800 },
      // Bullish FVG Box Created (23340 - 23370)
      { chg: 45, v: 5500 }, { chg: 15, v: 4100 },
      // Violent Inversion Candle (Giant Red Bar destroys the FVG!)
      { chg: -75, upWick: 5, dnWick: 10, v: 13500 }, // INVERSION!
      { chg: -40, v: 8900 }, { chg: -30, v: 7200 },
      // Retest into the Inverted Grey Box (iFVG)
      { chg: 25, v: 3100 }, { chg: 30, v: 2800 },
      // Rejection at iFVG Line
      { chg: -20, upWick: 28, dnWick: 5, v: 9200 },
      // Downward Continuation Expansion
      { chg: -50, v: 10200 }, { chg: -45, v: 9500 }, { chg: -40, v: 8800 }
    ]),
    entryPrice: 23340,
    stopLossPrice: 23385,
    target1Price: 23245,
    target2Price: 23160,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23370, yBottom: 23335, color: '#94a3b8', label: 'DODGYSDD INVERSION FVG (GREY DASHED iFVG BOX)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 4, text: "VIOLENT INVERSION BREAK", position: "above", color: "#ff3b57" },
      { candleIdx: 8, text: "iFVG RETEST REJECTION", position: "above", color: "#f7a600", isAnimated: true },
      { candleIdx: 9, text: "PE PUT ENTRY", position: "below", color: "#089981" }
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
      { chg: 30, v: 4100 }, { chg: 35, v: 4800 }, { chg: 40, v: 5200 },
      // Approach to PDH (23380)
      { chg: 25, v: 5800 },
      // Sweep Wick above PDH (Wicks to 23410, closes at 23370!)
      { chg: -15, upWick: 35, dnWick: 4, v: 12800 }, // SWEEP!
      // Red Reclaim Bar (Closes back below PDH)
      { chg: -45, upWick: 3, dnWick: 8, v: 10500 },
      // Markdown toward PDM and PDL
      { chg: -40, v: 8900 }, { chg: -35, v: 7900 }, { chg: -42, v: 8400 },
      { chg: 15, v: 3200 }, { chg: -38, v: 7600 }, { chg: -45, v: 8200 }
    ]),
    entryPrice: 23365,
    stopLossPrice: 23415,
    target1Price: 23270,
    target2Price: 23180,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23385, yBottom: 23375, color: '#ff3b57', label: 'PREVIOUS DAY HIGH (PDH EXTERNAL LIQUIDITY)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 4, text: "PDH STOP HUNT WICK", position: "above", color: "#ff3b57", isAnimated: true },
      { candleIdx: 5, text: "5M RECLAIM CLOSE (ENTRY)", position: "below", color: "#089981" },
      { candleIdx: 8, text: "PDM MIDPOINT TARGET 1", position: "below", color: "#38bdf8" }
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
      { chg: 30, v: 4200 }, { chg: 35, v: 4900 },
      // Spike to pVAH (23310)
      { chg: 35, upWick: 25, dnWick: 3, v: 9800 },
      // Rejection down back into Value Area
      { chg: -45, v: 8500 }, { chg: -30, v: 6200 },
      // Reaching pPOC (23250)
      { chg: -25, v: 7100 },
      // Continuing down to pVAL (23190)
      { chg: -30, v: 6800 }, { chg: -25, v: 6400 },
      { chg: 10, v: 3100 }, { chg: 15, v: 3500 }
    ]),
    entryPrice: 23295,
    stopLossPrice: 23340,
    target1Price: 23245,
    target2Price: 23185,
    riskReward: "1:3.5",
    zones: [
      { yTop: 23315, yBottom: 23305, color: '#ef4444', label: 'pVAH (VALUE AREA HIGH PREMIUM CEILING)', isAnimated: true },
      { yTop: 23255, yBottom: 23245, color: '#eab308', label: 'pPOC (POINT OF CONTROL VALUE MAGNET)' },
      { yTop: 23195, yBottom: 23185, color: '#3b82f6', label: 'pVAL (VALUE AREA LOW DISCOUNT FLOOR)' }
    ],
    annotations: [
      { candleIdx: 2, text: "pVAH REJECTION WICK", position: "above", color: "#ef4444", isAnimated: true },
      { candleIdx: 5, text: "TARGET 1: pPOC TAPPED", position: "below", color: "#eab308" },
      { candleIdx: 7, text: "TARGET 2: pVAL REACHED", position: "below", color: "#3b82f6" }
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
    candles: walk(23200, [
      // 9:15 AM - 9:30 AM Judas Fakeout Drive Up
      { chg: 35, v: 8500 }, { chg: 45, v: 9800 },
      // Sweep of Pre-Market High (23310)
      { chg: -10, upWick: 35, dnWick: 5, v: 14200 }, // JUDAS TRAP WICK!
      // 9:35 AM Collapse
      { chg: -55, v: 12100 }, { chg: -45, v: 10500 },
      // True Day Trend Markdown (9:45 AM - 11:00 AM)
      { chg: -40, v: 9200 }, { chg: -35, v: 8400 }, { chg: -45, v: 9100 },
      { chg: 10, v: 3100 }, { chg: -50, v: 9800 }
    ]),
    entryPrice: 23265,
    stopLossPrice: 23320,
    target1Price: 23175,
    target2Price: 23085,
    riskReward: "1:4.0",
    zones: [
      { yTop: 23315, yBottom: 23305, color: '#ff3b57', label: 'PRE-MARKET HIGH (JUDAS SWING STOP HUNT)', isAnimated: true }
    ],
    annotations: [
      { candleIdx: 2, text: "9:25 AM JUDAS FAKEOUT", position: "above", color: "#ff3b57", isAnimated: true },
      { candleIdx: 3, text: "9:35 AM TRAP CONFIRMED", position: "below", color: "#f7a600" },
      { candleIdx: 4, text: "TRUE TREND SHORT ENTRY", position: "below", color: "#089981" }
    ]
  })
};

module.exports = { deepTopicsV4 };
