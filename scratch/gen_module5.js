const { makeSvg } = require('./build_full_academy.js');

const module5Topics = {
  // 13. INSTITUTIONAL ORDER BLOCKS
  "topic-smc-order-blocks": {
    id: "topic-smc-order-blocks",
    moduleId: "module-smc",
    category: "smc",
    title: "Institutional Order Blocks & Mitigation Mechanics",
    subtitle: "Tracking central bank accumulation footprints & 50% mean re-tests",
    moduleTitle: "Smart Money Concepts (SMC) & Institutional Order Flow",
    level: "Institutional Elite",
    readTime: "12 min",
    analystNote: "An Order Block (OB) is the last opposing candle before an aggressive structural displacement that breaks market structure (BOS). Institutions bought heavily inside this candle, but to execute their full size, they also placed counter-orders. When price returns to the OB, they mitigate those positions at breakeven and launch the next expansion wave.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Real Nature of an Order Block: Sponsoring the Directional Shift" },
      { id: "sub-2", title: "2. Mitigation Mechanics: Why the Market is Magnetized Back to the Origin" },
      { id: "sub-3", title: "3. High-Probability Order Block Criteria: Liquidity Sweep + Imbalance Creation" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Failed Order Blocks: Identifying Breaker Block Flips" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Real Nature of an Order Block: Sponsoring the Directional Shift",
        content: `
          <p class="mb-3">A Bullish Order Block is specifically <strong>the lowest down-close (red) candle prior to an aggressive upward price displacement that creates a Break of Structure (BOS)</strong>.</p>
          <p class="mb-3">This candle represents the exact price zone where institutions absorbed all remaining retail selling and sponsored the institutional displacement.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Mitigation Mechanics: Why the Market is Magnetized Back to the Origin",
        content: `
          <p class="mb-3">Because institutions traded immense volume inside that order block candle, some of their positions may have been entered at unfavorable prices. Before letting the market fly to astronomical highs, market-making algorithms rebalance price back to the order block (Mitigation) so institutions can close out underwater hedges and add to winning blocks.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. High-Probability Order Block Criteria: Liquidity Sweep + Imbalance Creation",
        content: `
          <p class="mb-3">To filter out amateur order blocks, look for two non-negotiable requirements:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Liquidity Sweep:</strong> The order block candle must sweep the highs or lows of a previous swing point.</li>
            <li><strong>Fair Value Gap (FVG):</strong> The expansion candle leaving the order block must leave a visible imbalance gap between Candle 1 and Candle 3.</li>
          </ul>
        `
      }
    ],
    tradeDetails: {
      setupType: "Institutional Order Block Mitigation Re-test",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Limit order at the open or 50% Mean Threshold of the Bullish Order Block",
      stopLoss: "1 tick below the low of the Order Block candle (-45 pts)",
      target1: "The high of the displacement swing (+110 pts / 1:2.4 RR)",
      target2: "External buy-side liquidity pool (+180 pts / 1:4.0 RR)",
      riskReward: "1:4.0",
      executionChecklist: [
        "Order block created a clean Break of Structure (BOS) on the 15-min or 5-min chart",
        "Displacement wave left a visible Fair Value Gap (FVG)",
        "Price returns to the OB in a corrective, low-momentum manner",
        "Order block has not been previously mitigated (Fresh OB)"
      ],
      pitfalls: [
        "Trading order blocks that failed to create a structural break (BOS)",
        "Entering before price touches the actual body of the order block"
      ]
    },
    svgBlueprint: makeSvg("BULLISH ORDER BLOCK", "Structural Break (BOS), Imbalance & 50% Mitigation", `
      <!-- Bullish OB (Red Candle) -->
      <line x1="200" y1="200" x2="200" y2="280" stroke="#ff3b57" stroke-width="2.5"/>
      <rect x="186" y="215" width="28" height="50" fill="url(#bearGrad)" stroke="#ff3b57" rx="2"/>
      <text x="120" y="245" fill="#ff3b57" font-size="10" font-family="monospace">BULLISH OB</text>

      <!-- OB Extended Zone Box -->
      <rect x="200" y="215" width="460" height="50" fill="#00c076" fill-opacity="0.15" stroke="#00c076" stroke-dasharray="3"/>
      
      <!-- 50% Mean Threshold of OB -->
      <line x1="200" y1="240" x2="660" y2="240" stroke="#f7a600" stroke-dasharray="4"/>
      <text x="490" y="235" fill="#f7a600" font-size="9" font-family="monospace">50% MEAN THRESHOLD (23,200)</text>

      <!-- Massive Green Displacement Wave -->
      <line x1="240" y1="90" x2="240" y2="240" stroke="#00c076" stroke-width="3"/>
      <rect x="226" y="105" width="28" height="120" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>

      <line x1="280" y1="60" x2="280" y2="150" stroke="#00c076" stroke-width="3"/>
      <rect x="266" y="75" width="28" height="60" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>

      <!-- BOS Line -->
      <line x1="140" y1="130" x2="660" y2="130" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4"/>
      <text x="320" y="122" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold">BOS (BREAK OF STRUCTURE)</text>

      <!-- Corrective Pullback into OB Mitigation -->
      <path d="M 280 60 L 360 140 L 410 100 L 460 230 L 580 40" fill="none" stroke="#f7a600" stroke-width="3"/>
      <circle cx="460" cy="230" r="8" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="390" y="270" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">MITIGATION ENTRY (23,210)</text>

      <!-- Execution Callouts -->
      <rect x="520" y="30" width="180" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="47" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET 2: 23,420 (+210 pts)</text>

      <rect x="520" y="270" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="530" y="286" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 23,165 (-45 pts)</text>
    `)
  },

  // 14. FAIR VALUE GAPS (FVG)
  "topic-smc-fvg": {
    id: "topic-smc-fvg",
    moduleId: "module-smc",
    category: "smc",
    title: "Fair Value Gaps (FVG) & Imbalance Inefficiencies",
    subtitle: "Trading market delivery voids and the 50% Consequent Encroachment",
    moduleTitle: "Smart Money Concepts (SMC) & Institutional Order Flow",
    level: "Institutional Elite",
    readTime: "11 min",
    analystNote: "When institutional algorithms dump billions into an index in seconds, orders are executed one-sidedly without proper two-way auction bidding. This leaves a 3-candle void called a Fair Value Gap (FVG). The algorithm is guaranteed to return to fill this inefficiency before continuing its journey.",
    tableOfContents: [
      { id: "sub-1", title: "1. Algorithmic Price Delivery: Why 3-Candle Imbalances Must Be Rebalanced" },
      { id: "sub-2", title: "2. Consequent Encroachment (C.E.): The 50% Precision Entry Trigger" },
      { id: "sub-3", title: "3. Inversion FVGs: When Imbalances Invert from Support to Resistance" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Trading Counter-Trend FVGs Without Market Structure Alignment" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Algorithmic Price Delivery: Why 3-Candle Imbalances Must Be Rebalanced",
        content: `
          <p class="mb-3">A Bullish Fair Value Gap forms across a 3-candle sequence:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Candle 1:</strong> Initial impulse candle.</li>
            <li><strong>Candle 2:</strong> Giant green displacement expansion candle.</li>
            <li><strong>Candle 3:</strong> Continuation candle.</li>
          </ul>
          <p class="mb-3">The gap between the <strong>High of Candle 1</strong> and the <strong>Low of Candle 3</strong> is the Fair Value Gap. Zero sell orders were delivered in this price vacuum. The Interbank Price Delivery Algorithm (IPDA) will pull price back like a magnet to rebalance it.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Consequent Encroachment (C.E.): The 50% Precision Entry Trigger",
        content: `
          <p class="mb-3">The midpoint (exact 50% mathematical level) of any Fair Value Gap is called <strong>Consequent Encroachment (C.E.)</strong>. Institutional limit orders frequently rest at exactly C.E., offering the tightest stop loss and cleanest entries.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Inversion FVGs: When Imbalances Invert from Support to Resistance",
        content: `
          <p class="mb-3">If price blasts completely through a bullish FVG and closes below it, that gap does not disappear; it <strong>inverts</strong>. On the next upward retest, that former bullish gap acts as a brick wall of institutional supply resistance.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Imbalance Rebalancing & Consequent Encroachment Tap",
      instrument: "NIFTY Spot / ATM Option",
      entryTrigger: "Tap into FVG zone or exact 50% Consequent Encroachment level",
      stopLoss: "1 tick below the Candle 1 high (-40 pts)",
      target1: "High of the Candle 2 displacement bar (+95 pts / 1:2.4 RR)",
      target2: "Higher timeframe external liquidity (+160 pts / 1:4.0 RR)",
      riskReward: "1:4.0",
      executionChecklist: [
        "FVG is clear and wide between Candle 1 high and Candle 3 low",
        "Higher timeframe trend aligns with the direction of the gap",
        "Pullback into the FVG is corrective with low volume",
        "Stop loss is protected beneath the Candle 1 wick"
      ],
      pitfalls: [
        "Trading FVGs that form against the higher timeframe order flow",
        "Assuming all FVGs must be 100% closed (frequently price only touches the 50% C.E. line)"
      ]
    },
    svgBlueprint: makeSvg("FAIR VALUE GAP (FVG)", "3-Candle Imbalance & 50% Consequent Encroachment", `
      <!-- Candle 1: Impulse -->
      <line x1="200" y1="180" x2="200" y2="280" stroke="#00c076" stroke-width="2"/>
      <rect x="188" y="200" width="24" height="60" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>
      <circle cx="200" cy="180" r="4" fill="#f7a600"/>
      <text x="110" y="185" fill="#f7a600" font-size="10" font-family="monospace">CANDLE 1 HIGH</text>

      <!-- Candle 2: Giant Green Displacement Bar -->
      <line x1="280" y1="70" x2="280" y2="240" stroke="#00c076" stroke-width="3"/>
      <rect x="264" y="90" width="32" height="130" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>
      <text x="250" y="60" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">DISPLACEMENT BAR</text>

      <!-- Candle 3: Continuation -->
      <line x1="360" y1="50" x2="360" y2="130" stroke="#00c076" stroke-width="2"/>
      <rect x="348" y="60" width="24" height="50" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>
      <circle cx="360" cy="130" r="4" fill="#f7a600"/>
      <text x="375" y="135" fill="#f7a600" font-size="10" font-family="monospace">CANDLE 3 LOW</text>

      <!-- THE FVG BOX (Between Candle 1 High and Candle 3 Low) -->
      <rect x="200" y="130" width="460" height="50" fill="#38bdf8" fill-opacity="0.18" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3"/>
      <text x="440" y="150" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">FAIR VALUE GAP (IMBALANCE VOID)</text>

      <!-- 50% Consequent Encroachment (C.E.) -->
      <line x1="200" y1="155" x2="660" y2="155" stroke="#f7a600" stroke-dasharray="4"/>
      <text x="470" y="170" fill="#f7a600" font-size="9" font-family="monospace">50% CONSEQUENT ENCROACHMENT (C.E.)</text>

      <!-- Magnet Pullback Path -->
      <path d="M 360 60 Q 420 80 470 155 T 580 30" fill="none" stroke="#f7a600" stroke-width="3"/>
      <circle cx="470" cy="155" r="7" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="485" y="190" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">50% C.E. ENTRY FILL</text>
    `)
  },

  // 15. LIQUIDITY SWEEPS, BOS & CHOCH
  "topic-smc-liquidity-sweeps": {
    id: "topic-smc-liquidity-sweeps",
    moduleId: "module-smc",
    category: "smc",
    title: "Liquidity Sweeps, Stop Hunts & Structural Shifts (BOS / CHoCH)",
    subtitle: "Why 95% of retail traders are stopped out right before the real market run",
    moduleTitle: "Smart Money Concepts (SMC) & Institutional Order Flow",
    level: "Institutional Elite",
    readTime: "13 min",
    analystNote: "Markets do not move to accommodate retail traders; markets move to hunt retail stop losses. Every double top, swing low, and support floor contains millions in resting stops. Institutions engineer Judas Swings to sweep that liquidity before triggering explosive directional shifts.",
    tableOfContents: [
      { id: "sub-1", title: "1. Where the Money Lies: Identifying Buy-Side & Sell-Side Liquidity Pools" },
      { id: "sub-2", title: "2. The Judas Swing: Morning London / Dalal Street Opening False Expansion" },
      { id: "sub-3", title: "3. Break of Structure (BOS) vs Change of Character (CHoCH)" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Jumping the Gun: Mistaking Minor Internal Wicks for Real Structural BOS" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Where the Money Lies: Identifying Buy-Side & Sell-Side Liquidity Pools",
        content: `
          <p class="mb-3">Retail stop-losses are categorized into two primary pools:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Buy-Side Liquidity (BSL):</strong> Resting buy stops positioned above previous swing highs and equal highs. When triggered, they generate market BUY orders.</li>
            <li><strong>Sell-Side Liquidity (SSL):</strong> Resting sell stops positioned below swing lows and support lines. When triggered, they generate market SELL orders.</li>
          </ul>
        `
      },
      {
        id: "sub-2",
        title: "2. The Judas Swing: Morning London / Dalal Street Opening False Expansion",
        content: `
          <p class="mb-3">Between 9:15 AM and 9:45 AM, smart money frequently executes a <strong>Judas Swing</strong>: an engineered push in the opposite direction of the true day's trend to sweep pre-market highs or lows, trigger retail breakout traps, and accumulate inventory at extreme discounts.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Break of Structure (BOS) vs Change of Character (CHoCH)",
        content: `
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>BOS (Break of Structure):</strong> Continuation signal. In an uptrend, price breaks above the previous swing high, confirming trend persistence.</li>
            <li><strong>CHoCH (Change of Character):</strong> Early reversal signal. The first time price breaks below the previous swing low that generated the highest high. This marks the structural transition from bullish to bearish.</li>
          </ul>
        `
      }
    ],
    tradeDetails: {
      setupType: "Judas Liquidity Sweep & Structural CHoCH Reversal",
      instrument: "NIFTY Spot / ATM Option",
      entryTrigger: "Immediate entry upon 5-min candle closing back inside the range after sweeping liquidity",
      stopLoss: "1 tick beyond the extreme sweep wick high/low (-45 pts)",
      target1: "Equilibrium 50% of the internal range (+90 pts / 1:2.0 RR)",
      target2: "Opposing liquidity pool at the bottom of range (+170 pts / 1:3.8 RR)",
      riskReward: "1:3.8",
      executionChecklist: [
        "Obvious equal highs or prominent swing high swept by wick",
        "Price fails to hold above the swept high and immediately drops back inside range",
        "Displacement downwards breaks the nearest swing low (CHoCH confirmation)",
        "Volume spikes on the sweep candle, proving institutional absorption"
      ],
      pitfalls: [
        "Attempting to fade a true runaway trend that breaks highs on genuine institutional news",
        "Failing to wait for a 5-min candle close back inside the range"
      ]
    },
    svgBlueprint: makeSvg("LIQUIDITY SWEEP & CHOCH", "Buy-Side Stop Run & Structural Change of Character", `
      <!-- Prominent Swing High (BSL) -->
      <line x1="80" y1="120" x2="680" y2="120" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4"/>
      <text x="490" y="112" fill="#ff3b57" font-size="11" font-family="monospace">BUY-SIDE LIQUIDITY (BSL RESTING STOPS)</text>

      <!-- Upward Run to High -->
      <path d="M 100 240 L 220 120 L 290 190 L 370 100" fill="none" stroke="#00c076" stroke-width="3"/>
      <circle cx="220" cy="120" r="5" fill="#f7a600"/>
      <text x="180" y="140" fill="#94a3b8" font-size="10" font-family="monospace">EQUAL HIGH</text>

      <!-- The Liquidity Sweep Wick (False Breakout) -->
      <circle cx="370" cy="100" r="7" fill="#ff3b57"/>
      <text x="320" y="85" fill="#ff3b57" font-size="11" font-family="monospace" font-weight="bold">LIQUIDITY SWEEP (STOP HUNT)</text>

      <!-- Violent Displacement Down (CHoCH) -->
      <path d="M 370 100 L 450 240" fill="none" stroke="#ff3b57" stroke-width="4"/>
      <line x1="260" y1="190" x2="520" y2="190" stroke="#38bdf8" stroke-dasharray="3"/>
      <text x="460" y="185" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold">CHOCH (CHANGE OF CHARACTER)</text>

      <!-- Retest into Supply and Downward Expansion -->
      <path d="M 450 240 L 490 170 L 580 300" fill="none" stroke="#ff3b57" stroke-width="3"/>
      <circle cx="490" cy="170" r="7" fill="#ff3b57" stroke="#ffffff" stroke-width="2"/>
      <text x="505" y="175" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">PE SHORT ENTRY</text>

      <!-- Target -->
      <line x1="80" y1="300" x2="680" y2="300" stroke="#00c076" stroke-dasharray="4"/>
      <text x="500" y="292" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">SELL-SIDE LIQUIDITY (SSL TARGET)</text>
    `)
  }
};

module.exports = { module5Topics };
