const { makeSvg } = require('./build_full_academy.js');

const module1Topics = {
  // 1. CANDLESTICK ANATOMY
  "topic-candle-anatomy": {
    id: "topic-candle-anatomy",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Candlestick Anatomy: The Bid-Ask Auction & Conviction Mathematics",
    subtitle: "How to read who is winning the order book war on every single tick",
    moduleTitle: "The Quantum Physics of Candlesticks & Auction Market Theory",
    level: "Foundational to Intermediate",
    readTime: "8 min",
    analystNote: "Amateur traders view candlesticks as simple colored blocks. Institutional trading desks view candlesticks as real-time auction balance sheets: the body reveals dominant capital aggression, while the wicks expose rejected orders and depleted liquidity pools.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Physics of the Order Book (Bids, Asks & Aggression)" },
      { id: "sub-2", title: "2. Real Body vs Wick Ratios & Conviction Mathematics" },
      { id: "sub-3", title: "3. Upper vs Lower Shadows: Rejection Mechanics" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Traps, Whipsaws & False Wick Cascades" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Physics of the Order Book (Bids, Asks & Aggression)",
        content: `
          <p class="mb-3">Every candlestick recorded on Nifty, Sensex, or Bank Nifty represents thousands of individual bid and ask limit orders being executed at market speed.</p>
          <p class="mb-3">Price does not move merely because there are 'more buyers than sellers' &mdash; by definition, for every buyer, there is a seller. Price moves because of <strong>order aggression</strong>:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Aggressive Buyers (Market Buy Orders):</strong> Traders willing to cross the spread and buy immediately at the Ask price, lifting offers and driving the price higher.</li>
            <li><strong>Passive Sellers (Limit Sell Orders):</strong> Institutions sitting on the Order Book waiting to absorb buyers.</li>
            <li><strong>Auction Equilibrium:</strong> When buyers and sellers agree on price, a narrow-range candle with compressed wicks forms (Indecision / Balance).</li>
          </ul>
        `
      },
      {
        id: "sub-2",
        title: "2. Real Body vs Wick Ratios & Conviction Mathematics",
        content: `
          <p class="mb-3">To eliminate subjectivity, top quantitative analysts categorize candlesticks using strict mathematical ratios:</p>
          <div class="bg-tradeDark p-3 rounded-lg border border-tradeBorder font-mono text-xs text-accentGold my-2">
            Conviction Ratio = |Close - Open| &divide; (High - Low)
          </div>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Conviction Ratio &gt; 0.70 (Expansion Candle):</strong> Overwhelming institutional domination. Buyers or sellers maintained absolute control from open to close.</li>
            <li><strong>Conviction Ratio 0.30 - 0.70 (Standard Auction Candle):</strong> Healthy two-way trade with minor price exploration beyond the close.</li>
            <li><strong>Conviction Ratio &lt; 0.20 (Doji / Rejection Candle):</strong> Extreme equilibrium or massive price rejection at extremes.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Upper vs Lower Shadows: Rejection Mechanics",
        content: `
          <p class="mb-3">Wicks represent <strong>failed auctions</strong>. When price ventures into a zone, finds zero buyer participation, and gets aggressively sold down back to the open, that upper shadow represents institutional supply taking profit or shorting with size.</p>
          <p class="mb-3">Conversely, a long lower wick at support proves that as soon as price touched the discount zone, institutional buy limit orders fired automatically, sweeping all retail stop sales and slamming the door shut.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Institutional Rejection & Auction Reversal",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Breakout above candle high after long lower wick at key support level",
      stopLoss: "1 tick below the lowest point of the lower rejection shadow (-60 pts)",
      target1: "Previous swing peak (+120 pts / 1:2 Risk to Reward)",
      target2: "Higher timeframe resistance ceiling (+180 pts / 1:3 Risk to Reward)",
      riskReward: "1:2.8",
      executionChecklist: [
        "Rejection candle forms directly at horizontal daily support or 200 EMA",
        "Lower wick occupies at least 60% of the total candle range",
        "Volume on the rejection candle exceeds the 10-bar moving average",
        "Next candle provides green follow-through before order entry"
      ],
      pitfalls: [
        "Entering before the candle officially closes (intraday wicks can change before bar close)",
        "Trading rejection candles in the middle of a choppy sideways consolidation range",
        "Ignoring higher-timeframe trend direction"
      ]
    },
    svgBlueprint: makeSvg("CANDLESTICK ANATOMY", "Rejection Wick & Entry Trigger Geometry", `
      <!-- Rejection Candle Wick -->
      <line x1="280" y1="120" x2="280" y2="290" stroke="#00c076" stroke-width="3"/>
      <!-- Body -->
      <rect x="264" y="140" width="32" height="45" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>
      
      <!-- Follow through candle -->
      <line x1="360" y1="90" x2="360" y2="180" stroke="#00c076" stroke-width="3"/>
      <rect x="344" y="105" width="32" height="65" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>

      <!-- Prior bear candle -->
      <line x1="200" y1="100" x2="200" y2="220" stroke="#ff3b57" stroke-width="3"/>
      <rect x="184" y="120" width="32" height="80" fill="url(#bearGrad)" stroke="#ff3b57" rx="2"/>

      <!-- Support Floor -->
      <line x1="120" y1="280" x2="680" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6"/>
      <text x="500" y="272" fill="#38bdf8" font-size="11" font-family="monospace">INSTITUTIONAL DEMAND SUPPORT</text>

      <!-- Entry Trigger Level -->
      <line x1="280" y1="120" x2="680" y2="120" stroke="#00c076" stroke-width="2" stroke-dasharray="4"/>
      <rect x="420" y="108" width="180" height="24" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="430" y="124" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">ENTRY &gt; 23,050 (Candle High)</text>

      <!-- Stop Loss Level -->
      <line x1="280" y1="290" x2="680" y2="290" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4"/>
      <rect x="420" y="278" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="430" y="294" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 22,960 (Low Wick)</text>

      <!-- Target 1 Level -->
      <line x1="280" y1="70" x2="680" y2="70" stroke="#f7a600" stroke-width="2" stroke-dasharray="4"/>
      <text x="520" y="64" fill="#f7a600" font-size="11" font-family="monospace" font-weight="bold">TARGET 1: 23,230 (+180 pts)</text>

      <!-- Volume Bars -->
      <rect x="188" y="315" width="24" height="25" fill="#ff3b57" opacity="0.6"/>
      <rect x="268" y="300" width="24" height="40" fill="#00c076"/>
      <rect x="348" y="290" width="24" height="50" fill="#00c076"/>
      <text x="60" y="325" fill="#64748b" font-size="10" font-family="monospace">VOL SPIKE &gt; AVG</text>
    `)
  },

  // 2. HAMMER & INVERTED HAMMER
  "topic-candle-hammer": {
    id: "topic-candle-hammer",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Hammer, Inverted Hammer & Liquidity Absorption",
    subtitle: "Trading bottom exhaustion and smart money stop-loss sweeps",
    moduleTitle: "The Quantum Physics of Candlesticks & Auction Market Theory",
    level: "Intermediate",
    readTime: "9 min",
    analystNote: "A true institutional hammer is not just a pretty shape; it is an aggressive stop-loss hunt. Institutional algorithms drive price below previous swing lows to fill massive buy limit orders using retail panic market-sell orders.",
    tableOfContents: [
      { id: "sub-1", title: "1. Anatomy of Institutional Absorption at Key Extremes" },
      { id: "sub-2", title: "2. The 2:1 Wick-to-Body Standard & Volume Climax" },
      { id: "sub-3", title: "3. Shooting Star vs Inverted Hammer: Context Rules" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Traps: Mid-Range Hammers Without Support" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Anatomy of Institutional Absorption at Key Extremes",
        content: `
          <p class="mb-3">When a market is trending downward, retail traders place sell stops directly beneath visible swing lows. Institutions need millions in liquidity to build massive long positions without driving prices up against themselves.</p>
          <p class="mb-3">The hammer represents the exact bar where smart money sweeps those sell stops, absorbs every willing seller at discount prices, and immediately forces price back up into the candle's upper quadrant before the closing bell.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The 2:1 Wick-to-Body Standard & Volume Climax",
        content: `
          <p class="mb-3">A valid institutional hammer requires three strict criteria:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Lower Wick &ge; 2x Real Body:</strong> The lower shadow must be at least twice the height of the body, proving overwhelming buying rejection.</li>
            <li><strong>Minimal Upper Wick:</strong> Less than 10% of total bar range, demonstrating that buyers closed near the highest price of the session.</li>
            <li><strong>Volume Surge:</strong> The volume bar must be at least 1.5x greater than the 20-period volume moving average.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Shooting Star vs Inverted Hammer: Context Rules",
        content: `
          <p class="mb-3">The inverted hammer and the shooting star have identical physical geometry (small body at bottom, long upper shadow), but their contextual location completely flips their institutional meaning:</p>
          <p class="mb-3">At the bottom of a downtrend, an inverted hammer indicates aggressive buyers probed higher levels and tested overhead supply. At the peak of an uptrend, that same shape is a <strong>Shooting Star</strong>, signaling that institutional sellers dumped heavy inventory and rejected higher prices.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Swing Low Liquidity Absorption Hammer",
      instrument: "BANK NIFTY Spot / ATM Call Option",
      entryTrigger: "1 tick above the hammer candle high on 5-min chart",
      stopLoss: "1 tick below the extreme low of the hammer tail (-85 pts)",
      target1: "First horizontal liquidity pool / EMA 20 (+170 pts / 1:2 RR)",
      target2: "Previous breakdown origin / Day High (+260 pts / 1:3+ RR)",
      riskReward: "1:3.1",
      executionChecklist: [
        "Hammer appears after minimum 3 consecutive red candles",
        "Tail tests or breaks an obvious swing low (liquidity sweep)",
        "Lower wick is at least double the body length",
        "Next bar breaks above hammer high within the next 2 candles"
      ],
      pitfalls: [
        "Buying a hammer that forms in the middle of a sideways consolidation box",
        "Entering before the hammer bar has officially closed",
        "Failing to place stop loss below the exact wick low"
      ]
    },
    svgBlueprint: makeSvg("HAMMER ABSORPTION", "Sweeping Retail Stops & Bullish Reversal", `
      <!-- Downward Trend -->
      <line x1="120" y1="90" x2="160" y2="150" stroke="#ff3b57" stroke-width="2"/>
      <line x1="180" y1="120" x2="220" y2="190" stroke="#ff3b57" stroke-width="2"/>
      
      <!-- Prior Swing Low -->
      <line x1="80" y1="230" x2="680" y2="230" stroke="#64748b" stroke-dasharray="4"/>
      <text x="90" y="222" fill="#94a3b8" font-size="10" font-family="monospace">PREVIOUS SWING LOW (RETAIL STOPS HUNT ZONE)</text>

      <!-- The Hammer Candle -->
      <line x1="320" y1="160" x2="320" y2="290" stroke="#00c076" stroke-width="3"/>
      <rect x="306" y="160" width="28" height="26" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>
      
      <!-- Liquidity Sweep Callout -->
      <circle cx="320" cy="270" r="14" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57"/>
      <text x="345" y="275" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP RUN // LIQUIDITY SWEPT</text>

      <!-- Follow Through Bar -->
      <line x1="390" y1="120" x2="390" y2="200" stroke="#00c076" stroke-width="3"/>
      <rect x="376" y="130" width="28" height="60" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>

      <!-- Trade Execution Labels -->
      <rect x="440" y="145" width="200" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="450" y="162" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">ENTRY &gt; 51,220 (Breakout)</text>

      <rect x="440" y="280" width="200" height="26" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="450" y="297" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 51,080 (-140 pts)</text>

      <rect x="440" y="75" width="200" height="26" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" rx="4"/>
      <text x="450" y="92" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold">TARGET 2: 51,640 (+420 pts / 1:3)</text>
    `)
  },

  // 3. BULLISH & BEARISH ENGULFING
  "topic-candle-engulfing": {
    id: "topic-candle-engulfing",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Bullish & Bearish Engulfing Takeovers",
    subtitle: "Outside reversal bars and institutional order absorption",
    moduleTitle: "The Quantum Physics of Candlesticks & Auction Market Theory",
    level: "Intermediate",
    readTime: "9 min",
    analystNote: "An engulfing bar is the clearest manifestation of institutional aggression over passive retail orders. When Bar 2 completely swallows Bar 1, the market balance of power shifted 180 degrees in a single auction cycle.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Outside Reversal Bar & Order Book Erasure" },
      { id: "sub-2", title: "2. Institutional Accumulation vs False Retail Engulfing" },
      { id: "sub-3", title: "3. Multi-Timeframe Confluence (Daily Key Level + 5M)" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Pitfalls: Low Volume Engulfings in Sideways Chop" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Outside Reversal Bar & Order Book Erasure",
        content: `
          <p class="mb-3">A genuine Bullish Engulfing candle opens at or below the previous red candle's close, traps remaining bears who think the trend is continuing, and then violently reverses up to close above the previous open.</p>
          <p class="mb-3">This creates an <strong>Outside Reversal Bar</strong>: every seller who entered during the previous session is now trapped underwater, while buyers have full control of the order book.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Institutional Accumulation vs False Retail Engulfing",
        content: `
          <p class="mb-3">Do not trade every engulfing candle on your chart. 80% of engulfing bars inside a consolidating range are noise.</p>
          <p class="mb-3">Only trade an engulfing candle when it occurs at a <strong>Key Institutional Level</strong> (previous day high/low, VWAP band, or Fibonacci Golden Pocket) accompanied by an expanding volume signature.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Multi-Timeframe Confluence (Daily Key Level + 5M)",
        content: `
          <p class="mb-3">The highest probability engulfing setups occur when a Daily or 1-Hour support zone triggers a 5-minute or 15-minute Bullish Engulfing candle. This aligns institutional macro money with your intraday execution timing.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Institutional Momentum Outside Bar Takeover",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "At close of the engulfing candle or on retest of 50% body",
      stopLoss: "1 tick below the engulfing candle low (-50 pts)",
      target1: "Opposing key swing high (+100 pts / 1:2 RR)",
      target2: "Daily R1 pivot level (+160 pts / 1:3.2 RR)",
      riskReward: "1:3.2",
      executionChecklist: [
        "Engulfing body completely covers prior body from open to close",
        "Volume is significantly higher on the engulfing bar than the prior bar",
        "Occurs at structural support or after a multi-candle pullback",
        "Next candle confirms momentum by continuing in direction of engulfing"
      ],
      pitfalls: [
        "Trading engulfing candles with ultra-wide bodies where risk-to-reward is distorted",
        "Ignoring nearby overhead supply resistance lines"
      ]
    },
    svgBlueprint: makeSvg("BULLISH ENGULFING", "Order Book Reversal & Momentum Expansion", `
      <!-- Candle 1: Red -->
      <line x1="240" y1="140" x2="240" y2="240" stroke="#ff3b57" stroke-width="2.5"/>
      <rect x="226" y="160" width="28" height="60" fill="url(#bearGrad)" stroke="#ff3b57" rx="2"/>

      <!-- Candle 2: Engulfing Green -->
      <line x1="320" y1="100" x2="320" y2="260" stroke="#00c076" stroke-width="3"/>
      <rect x="300" y="120" width="40" height="120" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>

      <!-- Engulfing Bracket -->
      <path d="M 290 120 L 280 120 L 280 240 L 290 240" fill="none" stroke="#f7a600" stroke-width="2"/>
      <text x="140" y="185" fill="#f7a600" font-size="11" font-family="monospace">SWALLOWS PRIOR BAR</text>

      <!-- Levels -->
      <line x1="320" y1="120" x2="680" y2="120" stroke="#00c076" stroke-width="2" stroke-dasharray="4"/>
      <rect x="440" y="108" width="180" height="24" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="450" y="124" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">ENTRY &gt; 23,400 (Close Fill)</text>

      <line x1="320" y1="260" x2="680" y2="260" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4"/>
      <rect x="440" y="248" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="450" y="264" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 23,320 (-80 pts)</text>

      <line x1="320" y1="65" x2="680" y2="65" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4"/>
      <text x="450" y="60" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">TARGET: 23,620 (+220 pts / 1:2.75)</text>
    `)
  },

  // 4. MORNING STAR & EVENING STAR
  "topic-candle-stars": {
    id: "topic-candle-stars",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Morning Star & Evening Star 3-Bar Cycles",
    subtitle: "The 50% midpoint penetration rule and momentum exhaustion",
    moduleTitle: "The Quantum Physics of Candlesticks & Auction Market Theory",
    level: "Advanced",
    readTime: "9 min",
    analystNote: "The 3-bar star formation is nature's depiction of momentum shift. Bar 1 carries the prior trend momentum; Bar 2 stalls and absorbs liquidity (equilibrium); Bar 3 confirms new institutional directional displacement.",
    tableOfContents: [
      { id: "sub-1", title: "1. The 3-Phase Market Cycle (Impulse, Absorption, Displacement)" },
      { id: "sub-2", title: "2. The 50% Midpoint Rule: Validating Real Institutional Footprints" },
      { id: "sub-3", title: "3. Volume Footprint Signature Across the 3 Bars" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Traps: Gaps That Fail to Hold the Bar 1 Midpoint" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The 3-Phase Market Cycle (Impulse, Absorption, Displacement)",
        content: `
          <p class="mb-3">A Morning Star is the textbook 3-bar reversal cycle:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Bar 1 (Impulse):</strong> Strong bearish expansion candle showing retail capitulation.</li>
            <li><strong>Bar 2 (Absorption Star):</strong> Narrow-range indecision bar (spinning top or doji) gapping or dipping lower, showing seller exhaustion.</li>
            <li><strong>Bar 3 (Displacement):</strong> Aggressive green candle driving violently upwards, closing deep inside Bar 1's territory.</li>
          </ul>
        `
      },
      {
        id: "sub-2",
        title: "2. The 50% Midpoint Rule: Validating Real Institutional Footprints",
        content: `
          <p class="mb-3">The golden rule for top prop-desk analysts: <strong>Bar 3 MUST close above the 50% midpoint of Bar 1's body</strong>. If Bar 3 closes below the 50% line, it is a weak attempt that sellers are likely to crush.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Volume Footprint Signature Across the 3 Bars",
        content: `
          <p class="mb-3">Watch volume closely: Bar 1 has heavy selling volume, Bar 2 shows volume dry-up (no more sellers left), and Bar 3 brings an explosive institutional volume spike.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "3-Bar Trend Exhaustion Reversal",
      instrument: "SENSEX Spot / ATM Call Option",
      entryTrigger: "At close of Bar 3 once 50% midpoint of Bar 1 is penetrated",
      stopLoss: "1 tick below the low of the middle star bar (-150 pts)",
      target1: "Previous swing pivot high (+300 pts / 1:2 RR)",
      target2: "Higher timeframe supply zone (+480 pts / 1:3.2 RR)",
      riskReward: "1:3.2",
      executionChecklist: [
        "Bar 1 is a healthy, full-bodied red candle",
        "Bar 2 shows small body and indecision wicks at the low",
        "Bar 3 closes convincingly above the 50% midpoint of Bar 1",
        "Volume increases on Bar 3 compared to Bar 2"
      ],
      pitfalls: [
        "Entering on Bar 2 before confirmation (Bar 2 can just be a pause in a heavy downtrend)",
        "Ignoring Bar 3 closing below the 50% midpoint"
      ]
    },
    svgBlueprint: makeSvg("MORNING STAR REVERSAL", "3-Bar Cycle & 50% Midpoint Penetration", `
      <!-- Bar 1: Bear -->
      <line x1="180" y1="100" x2="180" y2="240" stroke="#ff3b57" stroke-width="2.5"/>
      <rect x="166" y="120" width="28" height="100" fill="url(#bearGrad)" stroke="#ff3b57" rx="2"/>

      <!-- 50% Midpoint Line -->
      <line x1="150" y1="170" x2="680" y2="170" stroke="#f7a600" stroke-width="1.8" stroke-dasharray="4"/>
      <text x="500" y="162" fill="#f7a600" font-size="10" font-family="monospace">50% MIDPOINT PENETRATION LINE</text>

      <!-- Bar 2: Star (Small Indecision) -->
      <line x1="260" y1="210" x2="260" y2="280" stroke="#64748b" stroke-width="2"/>
      <rect x="250" y="235" width="20" height="15" fill="#334155" stroke="#94a3b8" rx="2"/>

      <!-- Bar 3: Strong Bull Reversal -->
      <line x1="340" y1="110" x2="340" y2="250" stroke="#00c076" stroke-width="2.5"/>
      <rect x="326" y="130" width="28" height="100" fill="url(#bullGrad)" stroke="#00c076" rx="2"/>

      <!-- Penetration Checkmark -->
      <circle cx="340" cy="140" r="10" fill="#00c076"/>
      <text x="360" y="145" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">PENETRATED &gt; 50%</text>

      <!-- Trigger & SL -->
      <line x1="340" y1="130" x2="680" y2="130" stroke="#00c076" stroke-width="2" stroke-dasharray="4"/>
      <rect x="450" y="118" width="180" height="24" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="460" y="134" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">ENTRY @ BAR 3 CLOSE</text>

      <line x1="260" y1="280" x2="680" y2="280" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4"/>
      <rect x="450" y="268" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="460" y="284" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; STAR LOW</text>
    `)
  }
};

module.exports = { module1Topics };
