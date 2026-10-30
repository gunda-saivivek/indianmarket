const { makeSvg } = require('./build_full_academy.js');

const module4Topics = {
  // 11. THE POLARITY PRINCIPLE (S/R FLIPS)
  "topic-polarity-flip": {
    id: "topic-polarity-flip",
    moduleId: "module-supply-demand",
    category: "supply-demand",
    title: "The Polarity Principle: S/R Role Reversals",
    subtitle: "Trapped retail orders, breakout re-tests and liquidity flips",
    moduleTitle: "Support, Resistance & Institutional Supply-Demand Zones",
    level: "Intermediate",
    readTime: "11 min",
    analystNote: "When a resistance ceiling breaks, it does not become support by magic. It becomes support because traders who shorted at the ceiling are trapped in deep losses. When price pulls back to that ceiling, those trapped shorts panic-buy to exit at breakeven, creating a massive wave of buy orders.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Psychology of Trapped Money: Why Resistance Becomes Support" },
      { id: "sub-2", title: "2. The Breakeven Effect: Order Book Absorption on the First Retest" },
      { id: "sub-3", title: "3. Retest Timing & The 3-Candle Confirmation Protocol" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Failed Polarity Flips: Recognizing Immediate Structural Breakdown" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Psychology of Trapped Money: Why Resistance Becomes Support",
        content: `
          <p class="mb-3">In every major trading range, retail traders place limit sell orders right at horizontal resistance. When smart money blasts price through that resistance with a massive green expansion bar, those short sellers are immediately trapped underwater.</p>
          <p class="mb-3">Trapped traders pray for price to return to their entry level so they can 'get out even'. When price re-tests the broken resistance level, those short sellers click 'BUY TO COVER' at breakeven, converting previous supply into overwhelming new buying demand.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The Breakeven Effect: Order Book Absorption on the First Retest",
        content: `
          <p class="mb-3">The <strong>First Retest</strong> is the most explosive trade in price action technical analysis. Breakout traders who missed the initial train are waiting to buy, and trapped shorts are desperate to cover. Both forces combine into a tidal wave of buy market orders.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Retest Timing & The 3-Candle Confirmation Protocol",
        content: `
          <p class="mb-3">Do not blindly buy a falling knife just because it touches the polarity line. Use the 3-Candle Rule:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Candle 1:</strong> Dips into the polarity zone and leaves a rejection tail.</li>
            <li><strong>Candle 2:</strong> Inside bar or narrow-range stabilization bar.</li>
            <li><strong>Candle 3:</strong> Green expansion candle breaking Candle 1's high, confirming that institutional limit buyers have stepped in.</li>
          </ul>
        `
      }
    ],
    tradeDetails: {
      setupType: "Resistance-to-Support Polarity Retest Expansion",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Bullish rejection confirmation candle upon first retest of broken resistance",
      stopLoss: "1 tick below the lowest wick of the retest candle (-50 pts)",
      target1: "Breakout high (+100 pts / 1:2.0 RR)",
      target2: "Higher timeframe target (+180 pts / 1:3.6 RR)",
      riskReward: "1:3.6",
      executionChecklist: [
        "Prior resistance had at least 2 clean historical rejections (proven level)",
        "Breakout candle was strong, closing well beyond the resistance line",
        "Retest occurs with declining volume compared to the breakout surge",
        "Enter on the first retest only; third and fourth tests lose their polarity edge"
      ],
      pitfalls: [
        "Buying the 4th or 5th retest of the same level (liquidity degrades with each test)",
        "Ignoring a retest candle that closes firmly below the polarity line"
      ]
    },
    svgBlueprint: makeSvg("POLARITY FLIP", "Broken Resistance Converting into Support Floor", `
      <!-- Polarity Line -->
      <line x1="80" y1="180" x2="680" y2="180" stroke="#f7a600" stroke-width="2.5"/>
      <text x="450" y="172" fill="#f7a600" font-size="11" font-family="monospace">RESISTANCE TURNS INTO POLARITY SUPPORT (23,250)</text>

      <!-- Resistance Touches -->
      <path d="M 100 240 L 160 180 L 220 220 L 280 180 L 320 200" fill="none" stroke="#ff3b57" stroke-width="2.5"/>
      <circle cx="160" cy="180" r="5" fill="#ff3b57"/>
      <circle cx="280" cy="180" r="5" fill="#ff3b57"/>
      <text x="140" y="165" fill="#ff3b57" font-size="10" font-family="monospace">REJECTION 1</text>
      <text x="260" y="165" fill="#ff3b57" font-size="10" font-family="monospace">REJECTION 2</text>

      <!-- Breakout Impulse -->
      <path d="M 320 200 L 400 90" fill="none" stroke="#00c076" stroke-width="4"/>
      <text x="350" y="80" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">IMPULSE BREAKOUT</text>

      <!-- Retest into Polarity -->
      <path d="M 400 90 L 480 180 L 600 60" fill="none" stroke="#00c076" stroke-width="3"/>
      <circle cx="480" cy="180" r="8" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="430" y="210" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">FIRST RETEST ENTRY</text>

      <!-- Execution Callouts -->
      <rect x="520" y="48" width="180" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="65" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET 2: 23,430 (+180 pts)</text>

      <rect x="520" y="225" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="530" y="241" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 23,200 (-50 pts)</text>
    `)
  },

  // 12. INSTITUTIONAL SUPPLY & DEMAND (RBR, DBD, RBD, DBR)
  "topic-supply-demand-zones": {
    id: "topic-supply-demand-zones",
    moduleId: "module-supply-demand",
    category: "supply-demand",
    title: "Institutional Supply & Demand: RBR, DBD, RBD & DBR",
    subtitle: "Locating unfilled institutional limit orders on Dalal Street indices",
    moduleTitle: "Support, Resistance & Institutional Supply-Demand Zones",
    level: "Institutional Elite",
    readTime: "14 min",
    analystNote: "Amateur support/resistance lines are drawn across random wicks. Institutional supply and demand zones mark the exact bases where banks could not fill their entire order size due to insufficient liquidity. When price returns to the base, the remaining limit orders automatically trigger.",
    tableOfContents: [
      { id: "sub-1", title: "1. Supply & Demand vs Retail Support & Resistance: The Core Difference" },
      { id: "sub-2", title: "2. The 4 Institutional Structures: Rally-Base-Rally, Drop-Base-Drop, RBD, DBR" },
      { id: "sub-3", title: "3. Zone Scoring Matrix: Departure Speed, Freshness & Time Spent in Zone" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Stale Zones & Over-Tested Liquidity Pools" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Supply & Demand vs Retail Support & Resistance: The Core Difference"
        ,content: `
          <p class="mb-3">A retail line is a single horizontal price point. A supply/demand zone is a <strong>price imbalance rectangle</strong> consisting of an Origin Base where price paused for 1 to 4 candles before exploding away with extreme velocity.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The 4 Institutional Structures: Rally-Base-Rally, Drop-Base-Drop, RBD, DBR",
        content: `
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Rally-Base-Rally (RBR):</strong> Continuation Demand. Trend rallies, forms a tight consolidation base, and explodes higher.</li>
            <li><strong>Drop-Base-Rally (DBR):</strong> Reversal Demand. Trend drops hard, smart money builds a base, and violently reverses upward.</li>
            <li><strong>Drop-Base-Drop (DBD):</strong> Continuation Supply. Sharp drop, pauses to absorb minor buyers, and drops again.</li>
            <li><strong>Rally-Base-Drop (RBD):</strong> Reversal Supply. Strong rally, distribution base, and massive breakdown.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Zone Scoring Matrix: Departure Speed, Freshness & Time Spent in Zone",
        content: `
          <p class="mb-3">Grade every zone before trading using the 3 Pillars of Zone Strength:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Departure Speed:</strong> How fast did price leave the base? The fewer candles and larger the bodies, the more unfilled orders remain.</li>
            <li><strong>Time at Base:</strong> Less is more! A base with only 1 to 3 candles indicates severe imbalance. If price stays at the base for 10 candles, buyers and sellers found equilibrium (weak zone).</li>
            <li><strong>Freshness:</strong> Only trade un-tested (Fresh) zones. Once a zone has been touched, unfilled limit orders have been consumed.</li>
          </ul>
        `
      }
    ],
    tradeDetails: {
      setupType: "Fresh Institutional Demand Zone Retest (DBR / RBR)",
      instrument: "BANK NIFTY Spot / ATM Call Option",
      entryTrigger: "Limit order at the Proximal line of the fresh demand zone or bullish rejection on 5-min chart",
      stopLoss: "1 tick below the Distal line of the demand zone (-70 pts)",
      target1: "Opposing supply zone proximal line (+150 pts / 1:2.1 RR)",
      target2: "Higher timeframe liquidity high (+250 pts / 1:3.5 RR)",
      riskReward: "1:3.5",
      executionChecklist: [
        "Zone is 100% fresh (zero prior retests)",
        "Departure from base was explosive, leaving consecutive wide-body candles",
        "Base has between 1 and 4 candles maximum",
        "Zone aligns with higher timeframe trend bias"
      ],
      pitfalls: [
        "Trading zones that spent more than 6 candles at the base (balance zones)",
        "Entering on 2nd or 3rd test of a used zone"
      ]
    },
    svgBlueprint: makeSvg("INSTITUTIONAL DEMAND ZONE (DBR)", "Proximal & Distal Lines with Explosive Departure", `
      <!-- Drop Phase -->
      <line x1="120" y1="80" x2="200" y2="240" stroke="#ff3b57" stroke-width="4"/>
      <text x="90" y="160" fill="#ff3b57" font-size="11" font-family="monospace">DROP PHASE</text>

      <!-- Base Zone (Demand Box) -->
      <rect x="180" y="240" width="480" height="40" fill="#00c076" fill-opacity="0.2" stroke="#00c076" stroke-width="2" rx="4"/>
      
      <!-- Proximal & Distal Line Labels -->
      <line x1="180" y1="240" x2="660" y2="240" stroke="#00c076" stroke-dasharray="4"/>
      <text x="480" y="232" fill="#00c076" font-size="10" font-family="monospace">PROXIMAL ENTRY LINE (51,100)</text>

      <line x1="180" y1="280" x2="660" y2="280" stroke="#ff3b57" stroke-dasharray="4"/>
      <text x="480" y="295" fill="#ff3b57" font-size="10" font-family="monospace">DISTAL STOP LOSS LINE (51,020)</text>

      <!-- Base Candles -->
      <rect x="200" y="248" width="18" height="24" fill="#334155" stroke="#94a3b8"/>
      <rect x="225" y="252" width="18" height="20" fill="#00c076"/>
      <text x="180" y="310" fill="#94a3b8" font-size="9" font-family="monospace">BASE: 2 CANDLES ONLY (SEVERE IMBALANCE)</text>

      <!-- Explosive Departure Rally -->
      <line x1="250" y1="250" x2="380" y2="90" stroke="#00c076" stroke-width="5"/>
      <text x="290" y="140" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">EXPLOSIVE DEPARTURE</text>

      <!-- First Retest into Demand Zone -->
      <path d="M 380 90 L 460 245 L 580 70" fill="none" stroke="#f7a600" stroke-width="3"/>
      <circle cx="460" cy="245" r="8" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="400" y="220" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">FRESH RETEST BUY (51,100)</text>

      <!-- Target -->
      <rect x="520" y="55" width="180" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="72" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET: 51,350 (+250 pts)</text>
    `)
  }
};

module.exports = { module4Topics };
