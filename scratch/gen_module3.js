const { makeSvg } = require('./build_full_academy.js');

const module3Topics = {
  // 9. FIBONACCI GOLDEN POCKET
  "topic-fib-golden-pocket": {
    id: "topic-fib-golden-pocket",
    moduleId: "module-fibonacci",
    category: "fibonacci",
    title: "Fibonacci Retracements & The 0.618 - 0.650 Golden Pocket",
    subtitle: "Institutional algorithm calibration and mathematical precision zones",
    moduleTitle: "Fibonacci Universal Precision & Harmonic Confluence",
    level: "Advanced",
    readTime: "12 min",
    analystNote: "The Golden Pocket (0.618 - 0.650) is not magical; it is algorithmic. High-frequency market-making algorithms are programmed to rebalance institutional orders at 61.8% to 65% discount before pushing for new trend highs. This is where smart money re-enters with minimum risk.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Golden Ratio: Nature's Algorithm in Modern Electronic Markets" },
      { id: "sub-2", title: "2. The 0.618 - 0.650 Golden Pocket: Smart Money Discount Entry" },
      { id: "sub-3", title: "3. Confluence Layering: Golden Pocket + VWAP + Breaker Blocks" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Retail Anchoring Traps: Selecting Incorrect Swing Extremes" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Golden Ratio: Nature's Algorithm in Modern Electronic Markets",
        content: `
          <p class="mb-3">The Fibonacci sequence ($0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...$) converges to the mathematical constant $\\Phi = 1.618033...$ with its inverse $0.618$.</p>
          <p class="mb-3">In algorithmic trading systems across the NSE and BSE, liquidity providers use Fibonacci percentages to calculate equilibrium zones where institutional risk is minimal relative to potential expansion.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The 0.618 - 0.650 Golden Pocket: Smart Money Discount Entry",
        content: `
          <p class="mb-3">When a major impulse leg occurs from Point A (Swing Low) to Point B (Swing High), retail traders often chase at the top. Professional traders wait patiently for price to retrace into the <strong>0.618 to 0.650 zone</strong>.</p>
          <p class="mb-3">This 0.618 - 0.650 band represents the mathematical sweet spot where sellers exhaust their momentum and aggressive institutional buyers step in to protect their initial impulse origin.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Confluence Layering: Golden Pocket + VWAP + Breaker Blocks",
        content: `
          <p class="mb-3">Never trade Fibonacci levels in isolation. The highest win rates occur when the Golden Pocket aligns with:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Anchored VWAP:</strong> The session or weekly VWAP passing right through the 0.618 line.</li>
            <li><strong>Institutional Order Block:</strong> An unfilled bullish order block resting inside the 0.618 - 0.650 zone.</li>
            <li><strong>Prior Structural High:</strong> A previous resistance peak that has flipped into polarity support.</li>
          </ul>
        `
      }
    ],
    tradeDetails: {
      setupType: "Harmonic Algorithmic Golden Pocket Reversal",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Bullish reversal candle (hammer or engulfing) closing inside 0.618 - 0.650 zone",
      stopLoss: "1 tick below the 0.786 Fibonacci retracement level (-50 pts)",
      target1: "0.00 Swing High Retest (+150 pts / 1:3.0 RR)",
      target2: "-0.272 / -0.618 Fibonacci expansion extension (+220 pts / 1:4.4 RR)",
      riskReward: "1:4.4",
      executionChecklist: [
        "Impulse wave A-to-B is clear, decisive, and creates a clean Break of Structure",
        "Retracement down to Golden Pocket occurs in a choppy, 3-wave corrective fashion",
        "Golden Pocket aligns with horizontal support or VWAP",
        "Reversal candlestick forms directly inside the 0.618 - 0.650 zone"
      ],
      pitfalls: [
        "Drawing Fibonacci retracements across small internal intraday noise rather than major swing extremes",
        "Holding if price closes decisively below the 0.786 invalidation line"
      ]
    },
    svgBlueprint: makeSvg("FIBONACCI GOLDEN POCKET", "0.618 - 0.650 Algorithmic Discount Zone", `
      <!-- Impulse Wave A to B -->
      <line x1="100" y1="280" x2="300" y2="80" stroke="#00c076" stroke-width="4"/>
      <circle cx="100" cy="280" r="6" fill="#00c076"/>
      <text x="80" y="300" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">SWING LOW A (23,000)</text>

      <circle cx="300" cy="80" r="6" fill="#00c076"/>
      <text x="280" y="65" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">SWING HIGH B (23,400)</text>

      <!-- Fibonacci Retracement Grid -->
      <line x1="80" y1="80" x2="680" y2="80" stroke="#64748b" stroke-dasharray="2"/>
      <text x="610" y="75" fill="#64748b" font-size="10" font-family="monospace">0.0% (23,400)</text>

      <line x1="80" y1="156" x2="680" y2="156" stroke="#64748b" stroke-dasharray="2"/>
      <text x="610" y="151" fill="#64748b" font-size="10" font-family="monospace">0.382 (23,247)</text>

      <line x1="80" y1="180" x2="680" y2="180" stroke="#64748b" stroke-dasharray="2"/>
      <text x="610" y="175" fill="#64748b" font-size="10" font-family="monospace">0.500 (23,200)</text>

      <!-- THE GOLDEN POCKET BOX (0.618 to 0.650) -->
      <rect x="80" y="203" width="600" height="15" fill="#f7a600" fill-opacity="0.25" stroke="#f7a600" stroke-width="1.5"/>
      <text x="480" y="214" fill="#f7a600" font-size="10" font-family="monospace" font-weight="bold">0.618 - 0.650 GOLDEN POCKET (23,152 - 23,140)</text>

      <line x1="80" y1="237" x2="680" y2="237" stroke="#ff3b57" stroke-dasharray="2"/>
      <text x="610" y="232" fill="#ff3b57" font-size="10" font-family="monospace">0.786 SL INVALIDATION (23,085)</text>

      <!-- Retracement Curve into Golden Pocket -->
      <path d="M 300 80 Q 380 120 440 210 T 560 50" fill="none" stroke="#f7a600" stroke-width="3"/>
      <circle cx="440" cy="210" r="8" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="370" y="240" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">ENTRY IN POCKET (23,150)</text>

      <!-- Second Leg Target Callout -->
      <rect x="480" y="35" width="200" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="490" y="52" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET: 23,550 (-0.272 EXT)</text>
    `)
  },

  // 10. FIBONACCI EXTENSIONS (1.272, 1.618, 2.618)
  "topic-fib-extensions": {
    id: "topic-fib-extensions",
    moduleId: "module-fibonacci",
    category: "fibonacci",
    title: "Fibonacci Extensions (1.272, 1.618 & 2.618) Target Mastery",
    subtitle: "Scientific profit targets: Never exit a winning runner prematurely again",
    moduleTitle: "Fibonacci Universal Precision & Harmonic Confluence",
    level: "Institutional Elite",
    readTime: "13 min",
    analystNote: "Amateur traders take small profits too early and let big losses run forever. Quantitative algorithmic trading desks use 1.272 and 1.618 Fibonacci extensions to scientifically scale out of winning trades at the exact points where institutional profit-taking programs execute.",
    tableOfContents: [
      { id: "sub-1", title: "1. Mathematics of Trend Expansion & Impulse Projection" },
      { id: "sub-2", title: "2. The 1.272 Liquidity Sweep Extension (Stop Run Target)" },
      { id: "sub-3", title: "3. The 1.618 Golden Extension: Institutional Partial Profit-Taking Hub" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Leaving Money on the Table: Fighting Parabolic Trend Extensions" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Mathematics of Trend Expansion & Impulse Projection",
        content: `
          <p class="mb-3">A trend-based Fibonacci extension requires three points: Swing Low (1), Swing High (2), and Pullback Low (3). The tool projects where the third impulse wave will land relative to Wave 1.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The 1.272 Liquidity Sweep Extension (Stop Run Target)",
        content: `
          <p class="mb-3">The 1.272 extension ($127.2\\%$) is the primary stop-run target. When price breaks previous swing highs, retail breakout short stops trigger at 1.272. This is the first logical place to lock in 50% profit and move your stop to breakeven.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. The 1.618 Golden Extension: Institutional Partial Profit-Taking Hub",
        content: `
          <p class="mb-3">The 1.618 extension is the holy grail profit zone. In healthy Elliott Wave impulse structures, Wave 3 frequently expands to exactly $1.618 \\times Wave 1$. When price reaches 1.618, major institutional programs automatically book heavy profit.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Trend Extension Multi-Bagger Scaling Model",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Breakout above Wave 1 high after confirmed pullback to Wave 2",
      stopLoss: "1 tick below Wave 2 pullback low (-60 pts)",
      target1: "1.272 Fibonacci Extension (Sell 50% lots, move SL to Cost) (+120 pts / 1:2.0 RR)",
      target2: "1.618 Golden Extension (Sell 35% lots, trail final runner) (+190 pts / 1:3.2 RR)",
      riskReward: "1:3.2",
      executionChecklist: [
        "Wave 1 has clean, impulsive momentum",
        "Wave 2 retracement respects at least the 0.500 or 0.618 level without breaching origin",
        "Volume expands on breakout above Wave 1 high",
        "Scale out methodically at 1.272 and 1.618 targets"
      ],
      pitfalls: [
        "Holding 100% position size through 1.618 extension expecting infinite trend",
        "Failing to move stop loss to breakeven once 1.272 target is reached"
      ]
    },
    svgBlueprint: makeSvg("FIBONACCI EXTENSIONS", "1.272 Stop Run & 1.618 Golden Profit Target", `
      <!-- Wave 1: Low (1) to High (2) -->
      <line x1="80" y1="280" x2="220" y2="160" stroke="#00c076" stroke-width="3.5"/>
      <circle cx="80" cy="280" r="5" fill="#00c076"/>
      <text x="60" y="295" fill="#00c076" font-size="10" font-family="monospace">POINT 1 (LOW)</text>
      
      <circle cx="220" cy="160" r="5" fill="#00c076"/>
      <text x="210" y="145" fill="#00c076" font-size="10" font-family="monospace">POINT 2 (HIGH)</text>

      <!-- Wave 2: Pullback to Point 3 -->
      <line x1="220" y1="160" x2="300" y2="230" stroke="#f7a600" stroke-width="2.5"/>
      <circle cx="300" cy="230" r="5" fill="#f7a600"/>
      <text x="290" y="250" fill="#f7a600" font-size="10" font-family="monospace">POINT 3 (PULLBACK)</text>

      <!-- Wave 3: Powerful Impulse to 1.618 -->
      <line x1="300" y1="230" x2="520" y2="50" stroke="#00c076" stroke-width="4"/>
      
      <!-- Extension Levels -->
      <line x1="220" y1="160" x2="680" y2="160" stroke="#64748b" stroke-dasharray="3"/>
      <text x="560" y="152" fill="#64748b" font-size="10" font-family="monospace">1.000 RETEST (23,300)</text>

      <line x1="300" y1="110" x2="680" y2="110" stroke="#38bdf8" stroke-dasharray="3"/>
      <rect x="520" y="98" width="180" height="24" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" rx="4"/>
      <text x="530" y="114" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold">TARGET 1: 1.272 EXT (23,420)</text>

      <line x1="300" y1="50" x2="680" y2="50" stroke="#00c076" stroke-dasharray="3"/>
      <rect x="520" y="38" width="180" height="24" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="54" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET 2: 1.618 GOLDEN (23,550)</text>

      <!-- Stop Loss -->
      <line x1="300" y1="230" x2="680" y2="230" stroke="#ff3b57" stroke-dasharray="3"/>
      <text x="530" y="225" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; POINT 3 (-60 pts)</text>
    `)
  }
};

module.exports = { module3Topics };
