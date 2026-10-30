const { makeSvg } = require('./build_full_academy.js');

const module2Topics = {
  // 5. DOUBLE BOTTOM & DOUBLE TOP (W & M)
  "topic-double-bottom-top": {
    id: "topic-double-bottom-top",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Double Bottom (W) & Double Top (M) Structures",
    subtitle: "Second leg liquidity sweeps and neckline retest confirmations",
    moduleTitle: "Classical Geometric Chart Patterns & Market Cycles",
    level: "Intermediate",
    readTime: "10 min",
    analystNote: "Retail textbooks teach buying the neckline of a double bottom. Elite prop traders wait for Leg 2 to sweep below Leg 1 to hunt retail sell-stops (Turtle Soup setup), entering at the absolute bottom with minimal risk and maximum reward.",
    tableOfContents: [
      { id: "sub-1", title: "1. Geometry of W & M Formations: Failed Auction Mechanics" },
      { id: "sub-2", title: "2. The Leg 2 Liquidity Sweep Phenomenon (Turtle Soup Stop Run)" },
      { id: "sub-3", title: "3. Measured Move Projections (100% & 161.8% Extensions)" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Retest Traps & Entering Ahead of Neckline Confirmation" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Geometry of W & M Formations: Failed Auction Mechanics",
        content: `
          <p class="mb-3">A Double Bottom (W Pattern) develops when a downtrend hits a strong buyer wall (Leg 1), bounces to an intermediate peak (Neckline), and drops back to test the low (Leg 2).</p>
          <p class="mb-3">The failure of sellers to push price lower on Leg 2 proves that seller aggression has dried up. The balance of supply and demand flips heavily into buyers' favor.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The Leg 2 Liquidity Sweep Phenomenon (Turtle Soup Stop Run)",
        content: `
          <p class="mb-3">The highest win-rate W formations do not have equal bottoms. In fact, <strong>Leg 2 dips slightly below Leg 1 by 10 to 30 points on Nifty</strong>, sweeps all the protective stops of early buyers, and immediately closes back above the Leg 1 low.</p>
          <p class="mb-3">This false breakdown traps breakout short-sellers and provides smart money with the liquidity they need to launch an explosive rally.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Measured Move Projections (100% & 161.8% Extensions)",
        content: `
          <p class="mb-3">To calculate your exit target scientifically, measure the vertical distance from the lowest bottom to the neckline ($H$).</p>
          <div class="bg-tradeDark p-3 rounded-lg border border-tradeBorder font-mono text-xs text-accentGold my-2">
            Target 1 (100% Measured Move) = Neckline Level + H<br>
            Target 2 (1.618 Fib Extension) = Neckline Level + (H &times; 1.618)
          </div>
        `
      }
    ],
    tradeDetails: {
      setupType: "Turtle Soup Leg-2 Sweep & Neckline Expansion",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Conservative: Neckline breakout & retest | Aggressive: Leg-2 reclaim of Leg-1 low",
      stopLoss: "1 tick below the lowest point of Leg 2 (-65 pts)",
      target1: "100% Measured move distance above neckline (+140 pts / 1:2.1 RR)",
      target2: "1.618 Fibonacci expansion extension (+220 pts / 1:3.4 RR)",
      riskReward: "1:3.4",
      executionChecklist: [
        "Leg 2 shows lower volume during drop than Leg 1",
        "Leg 2 forms rejection wick or immediate bullish engulfing candle",
        "Neckline breakout occurs with expanding volume bar",
        "Wait for retest of broken neckline on 5-min chart"
      ],
      pitfalls: [
        "Buying too early inside the consolidation without waiting for Leg 2 to confirm",
        "Ignoring severe overhead resistance just above the neckline"
      ]
    },
    svgBlueprint: makeSvg("DOUBLE BOTTOM (W PATTERN)", "Leg 2 Liquidity Sweep & Measured Move Projection", `
      <!-- Neckline -->
      <line x1="80" y1="150" x2="680" y2="150" stroke="#f7a600" stroke-width="2" stroke-dasharray="4"/>
      <text x="500" y="142" fill="#f7a600" font-size="11" font-family="monospace">NECKLINE BREAKOUT LEVEL (23,200)</text>

      <!-- W Path -->
      <path d="M 120 100 L 220 250 L 320 150 L 420 265 L 500 150 L 600 70" fill="none" stroke="#00c076" stroke-width="4"/>

      <!-- Leg 1 Low -->
      <circle cx="220" cy="250" r="6" fill="#ff3b57"/>
      <text x="180" y="270" fill="#94a3b8" font-size="10" font-family="monospace">LEG 1 (23,050)</text>

      <!-- Leg 2 Low (Sweep) -->
      <circle cx="420" cy="265" r="8" fill="#ff3b57" stroke="#00c076" stroke-width="2"/>
      <text x="360" y="295" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">LEG 2 SWEEP (23,030)</text>
      <line x1="220" y1="250" x2="440" y2="250" stroke="#ff3b57" stroke-dasharray="3"/>

      <!-- Measured Move Height H -->
      <line x1="480" y1="150" x2="480" y2="265" stroke="#38bdf8" stroke-width="2"/>
      <text x="490" y="210" fill="#38bdf8" font-size="11" font-family="monospace">HEIGHT H (170 pts)</text>

      <!-- Projected Target H -->
      <line x1="500" y1="150" x2="500" y2="70" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3"/>
      <text x="510" y="105" fill="#38bdf8" font-size="11" font-family="monospace">+H TARGET (23,370)</text>

      <!-- Entry & SL Markers -->
      <rect x="520" y="138" width="160" height="24" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="154" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">ENTRY &gt; 23,200</text>

      <rect x="520" y="260" width="160" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="530" y="276" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 23,020</text>
    `)
  },

  // 6. HEAD & SHOULDERS (STANDARD & INVERSE)
  "topic-head-shoulders": {
    id: "topic-head-shoulders",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Head & Shoulders Distribution & Inverse Accumulation",
    subtitle: "Quasimodo pattern dynamics and asymmetric volume climax",
    moduleTitle: "Classical Geometric Chart Patterns & Market Cycles",
    level: "Advanced",
    readTime: "11 min",
    analystNote: "The Head and Shoulders structure is the ultimate roadmap of institutional inventory unloading. Smart money sells into the Left Shoulder, aggressively offloads their final core block at the Head (creating a false breakout), and uses the Right Shoulder to short with size before the floor collapses.",
    tableOfContents: [
      { id: "sub-1", title: "1. Institutional Inventory Offloading & Left Shoulder to Head" },
      { id: "sub-2", title: "2. The Quasimodo / Over-and-Under Structural Failure" },
      { id: "sub-3", title: "3. Slanted Neckline Geometry & Asymmetrical Volume Climax" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. False Right Shoulder Breakouts & Trapped Retail Buyers" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Institutional Inventory Offloading & Left Shoulder to Head",
        content: `
          <p class="mb-3">During an extensive bull run, institutions hold massive positions. They cannot sell everything at once without crashing the market. Therefore, they orchestrate distribution in three distinct waves:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Left Shoulder:</strong> High-volume momentum peak where smart money initiates their first wave of profit taking.</li>
            <li><strong>Head:</strong> Price pushes to a higher high, but with <strong>diminishing volume</strong> (a massive divergence). This traps breakout retail buyers at the peak.</li>
            <li><strong>Right Shoulder:</strong> A weak rally that fails to reach the Head. Smart money unloads remaining inventory and enters short positions.</li>
          </ul>
        `
      },
      {
        id: "sub-2",
        title: "2. The Quasimodo / Over-and-Under Structural Failure",
        content: `
          <p class="mb-3">In advanced trading desks, the most lethal form of Head & Shoulders is the <strong>Quasimodo (QM) Pattern</strong>. When the drop from the Head breaks below the Left Shoulder's trough, it creates a lower low (Break of Structure). The Right Shoulder then retraces directly to the Left Shoulder's peak for an optimal short entry.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Slanted Neckline Geometry & Asymmetrical Volume Climax",
        content: `
          <p class="mb-3">Never assume necklines are always flat. Slanted necklines (angled downwards) indicate extreme bearish aggression because buyers could not even hold price to the prior trough level.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Institutional Distribution & Structural Breakdown",
      instrument: "NIFTY Spot / ATM Put (PE) Option",
      entryTrigger: "Break below neckline on 5-min candle or retest of Right Shoulder supply zone",
      stopLoss: "1 tick above Right Shoulder peak (-75 pts)",
      target1: "100% vertical depth from Head to Neckline (+160 pts / 1:2.1 RR)",
      target2: "Macro swing support zone (+260 pts / 1:3.4 RR)",
      riskReward: "1:3.4",
      executionChecklist: [
        "Head forms higher high with noticeably lower volume than Left Shoulder",
        "Drop from Head breaks below previous swing trough (Change of Character)",
        "Right Shoulder stalls at or below Left Shoulder peak",
        "Neckline break occurs on elevated bearish volume"
      ],
      pitfalls: [
        "Shorting before the neckline or Right Shoulder structural break has confirmed",
        "Placing stop loss too tight inside the Right Shoulder consolidation"
      ]
    },
    svgBlueprint: makeSvg("HEAD & SHOULDERS DISTRIBUTION", "Institutional Supply Waves & Neckline Breakdown", `
      <!-- Neckline -->
      <line x1="80" y1="210" x2="680" y2="210" stroke="#f7a600" stroke-width="2" stroke-dasharray="4"/>
      <text x="490" y="202" fill="#f7a600" font-size="11" font-family="monospace">DISTRIBUTION NECKLINE (23,300)</text>

      <!-- Head & Shoulders Structure -->
      <path d="M 100 240 L 180 140 L 260 210 L 360 80 L 460 210 L 540 145 L 620 280" fill="none" stroke="#ff3b57" stroke-width="3.5"/>

      <!-- Labels -->
      <text x="140" y="130" fill="#94a3b8" font-size="10" font-family="monospace">LEFT SHOULDER</text>
      <circle cx="180" cy="140" r="5" fill="#f7a600"/>

      <text x="340" y="70" fill="#ff3b57" font-size="11" font-family="monospace" font-weight="bold">HEAD (CLIMAX)</text>
      <circle cx="360" cy="80" r="7" fill="#ff3b57"/>

      <text x="510" y="135" fill="#94a3b8" font-size="10" font-family="monospace">RIGHT SHOULDER</text>
      <circle cx="540" cy="145" r="5" fill="#f7a600"/>

      <!-- Height Projection -->
      <line x1="360" y1="80" x2="360" y2="210" stroke="#38bdf8" stroke-width="2"/>
      <text x="370" y="150" fill="#38bdf8" font-size="10" font-family="monospace">DEPTH H (130 pts)</text>

      <!-- Execution Callouts -->
      <rect x="540" y="218" width="160" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="550" y="234" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">PE ENTRY &lt; 23,300</text>

      <rect x="540" y="115" width="160" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="550" y="131" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">SL &gt; 23,390 (RS High)</text>

      <line x1="620" y1="280" x2="680" y2="280" stroke="#00c076" stroke-width="2" stroke-dasharray="4"/>
      <text x="520" y="295" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">TARGET: 23,170 (-130 pts)</text>
    `)
  },

  // 7. FLAGS & PENNANTS
  "topic-flags-pennants": {
    id: "topic-flags-pennants",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Bull Flags, Bear Flags & Momentum Pennants",
    subtitle: "Impulse pole mathematics and orderly volume contraction",
    moduleTitle: "Classical Geometric Chart Patterns & Market Cycles",
    level: "Intermediate",
    readTime: "9 min",
    analystNote: "The Flag is the purest institutional continuation pattern in existence. An aggressive, vertical rally (the Flagpole) proves smart money conviction. The sideways-to-downward consolidation (the Flag) proves retail profit taking without any institutional selling.",
    tableOfContents: [
      { id: "sub-1", title: "1. Impulse Pole Velocity & Institutional Capital Commitment" },
      { id: "sub-2", title: "2. Orderly Flag Channel & Volume Decay Signature" },
      { id: "sub-3", title: "3. Measured Move Calculation: Exact Duplication of Flagpole" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Flags That Degrade into Reversals: Time Invalidation Rules" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Impulse Pole Velocity & Institutional Capital Commitment",
        content: `
          <p class="mb-3">A valid bull flag begins with an almost vertical price surge of 100 to 250 points on Nifty or 300 to 700 points on Bank Nifty. This explosive move represents <strong>aggressive institutional capital entry</strong>.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Orderly Flag Channel & Volume Decay Signature",
        content: `
          <p class="mb-3">During the flag consolidation, two strict rules must apply:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Depth Rule:</strong> The flag pullback must not retrace more than 38.2% to 50% of the flagpole height. Pullbacks deeper than 61.8% invalidate the pattern.</li>
            <li><strong>Volume Contraction:</strong> Volume must dry up significantly inside the flag channel. If volume increases during the pullback, institutions are distributing, not consolidating.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Measured Move Calculation: Exact Duplication of Flagpole",
        content: `
          <p class="mb-3">When price breaks out from the upper flag trendline, the expected expansion target is a 1:1 duplication of the flagpole length, measured from the lowest point of the flag consolidation.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Institutional Momentum Continuation Flag",
      instrument: "NIFTY Spot / ATM Call Option",
      entryTrigger: "Breakout above upper flag resistance trendline with volume expansion",
      stopLoss: "1 tick below lowest swing of flag consolidation channel (-55 pts)",
      target1: "Flagpole height measured from breakout point (+140 pts / 1:2.5 RR)",
      target2: "1.382 Extension of flagpole (+200 pts / 1:3.6 RR)",
      riskReward: "1:3.6",
      executionChecklist: [
        "Flagpole is sharp, near-vertical, and formed by consecutive expansion candles",
        "Consolidation is tight, parallel, and angles slightly downward against the trend",
        "Volume declines steadily across the consolidation candles",
        "Breakout candle closes cleanly outside the flag boundary on 5-min chart"
      ],
      pitfalls: [
        "Trading flags that take more than 20 candles to resolve (loss of momentum)",
        "Buying flags that retrace more than 50% of the flagpole"
      ]
    },
    svgBlueprint: makeSvg("BULL FLAG CONTINUATION", "Impulse Pole & Orderly Volume Compression", `
      <!-- Flagpole -->
      <line x1="120" y1="280" x2="280" y2="100" stroke="#00c076" stroke-width="6"/>
      <text x="140" y="180" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">IMPULSE POLE (+220 pts)</text>

      <!-- Flag Consolidation Channel -->
      <line x1="260" y1="90" x2="420" y2="135" stroke="#f7a600" stroke-width="2.5"/>
      <line x1="270" y1="130" x2="430" y2="175" stroke="#f7a600" stroke-width="2.5"/>

      <!-- Candles inside Flag -->
      <path d="M 280 100 L 320 150 L 350 115 L 390 160 L 420 125" fill="none" stroke="#64748b" stroke-width="2"/>

      <!-- Breakout Arrow & Second Pole -->
      <path d="M 420 125 L 560 30" fill="none" stroke="#00c076" stroke-width="5" stroke-dasharray="2"/>
      <circle cx="420" cy="125" r="7" fill="#00c076"/>
      <text x="435" y="115" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">BREAKOUT TRIGGER</text>

      <!-- Second Target Projection -->
      <line x1="420" y1="125" x2="680" y2="125" stroke="#64748b" stroke-dasharray="4"/>
      <rect x="520" y="20" width="180" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="37" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET: 23,450 (+220 pts)</text>

      <rect x="520" y="170" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="530" y="186" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 23,210 (-55 pts)</text>

      <!-- Volume Decay Graphic -->
      <line x1="280" y1="320" x2="420" y2="335" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="280" y="310" fill="#94a3b8" font-size="9" font-family="monospace">VOLUME DRIBBLES DOWN DURING CONSOLIDATION</text>
    `)
  },

  // 8. TRIANGLES & WEDGES
  "topic-triangles-wedges": {
    id: "topic-triangles-wedges",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Ascending, Descending Triangles & Dynamic Wedges",
    subtitle: "Volatility compression coils and explosive multi-point breakout energy releases",
    moduleTitle: "Classical Geometric Chart Patterns & Market Cycles",
    level: "Advanced",
    readTime: "10 min",
    analystNote: "Triangles represent volatility compression springs. In an Ascending Triangle, buyers are aggressive enough to accept higher lows each cycle, pounding repeatedly against a flat institutional supply ceiling until that ceiling runs out of sell orders and bursts.",
    tableOfContents: [
      { id: "sub-1", title: "1. Volatility Compression Mechanics: Springs Coiling Before Explosion" },
      { id: "sub-2", title: "2. Ascending vs Descending Triangle Pressure Imbalances" },
      { id: "sub-3", title: "3. Falling & Rising Wedges: The Exhaustion Overlap Signature" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. The Apex Trap: Why Never to Trade Beyond 75% of Triangle Apex" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Volatility Compression Mechanics: Springs Coiling Before Explosion",
        content: `
          <p class="mb-3">When price enters a triangle, the range between highs and lows narrows with every swing. Option premiums decay due to theta, and implied volatility (IV) contracts.</p>
          <p class="mb-3">This creates massive pent-up potential energy: when price finally breaches the boundary, market orders cascade, delta expands, and option premiums jump 100% to 300% in minutes.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Ascending vs Descending Triangle Pressure Imbalances",
        content: `
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Ascending Triangle:</strong> Horizontal resistance roof + rising higher-low trendline. Buyers are willing to buy at higher prices while sellers are stubborn at one fixed level. Strong bullish breakout probability (&gt;72%).</li>
            <li><strong>Descending Triangle:</strong> Horizontal support floor + declining lower-high trendline. Sellers are pounding the floor until bids vanish. Strong bearish breakdown probability.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Falling & Rising Wedges: The Exhaustion Overlap Signature",
        content: `
          <p class="mb-3">A Falling Wedge has both trendlines slanting downwards, but the trendlines converge. This indicates that while bears are pushing to new lows, their downward velocity is deteriorating with each wave. A breakout above the upper wedge line produces a violent bullish trend reversal.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Volatility Compression Coiled Energy Breakout",
      instrument: "NIFTY Spot / ATM Option",
      entryTrigger: "Clean 5-min candle close outside the triangle boundary with volume expansion",
      stopLoss: "1 tick below the most recent internal swing pivot (-60 pts)",
      target1: "Base width of triangle added to breakout point (+150 pts / 1:2.5 RR)",
      target2: "Macro swing resistance (+230 pts / 1:3.8 RR)",
      riskReward: "1:3.8",
      executionChecklist: [
        "Triangle has at least 2 distinct touches on upper boundary and 2 touches on lower boundary",
        "Breakout occurs between 50% and 75% distance to apex",
        "Volume spikes immediately on the breakout bar",
        "Do not trade if price reaches apex without breaking out (leads to directionless drift)"
      ],
      pitfalls: [
        "Entering inside the middle of the triangle before any boundary breakout",
        "Trading triangle apex chops where the coil loses its stored energy"
      ]
    },
    svgBlueprint: makeSvg("ASCENDING TRIANGLE BREAKOUT", "Aggressive Higher Lows Coiling Against Fixed Resistance", `
      <!-- Fixed Resistance Ceiling -->
      <line x1="100" y1="120" x2="680" y2="120" stroke="#ff3b57" stroke-width="3"/>
      <text x="490" y="110" fill="#ff3b57" font-size="11" font-family="monospace">FLAT SUPPLY RESISTANCE (23,350)</text>

      <!-- Rising Support Trendline -->
      <line x1="120" y1="280" x2="520" y2="120" stroke="#00c076" stroke-width="3"/>
      <text x="180" y="270" fill="#00c076" font-size="10" font-family="monospace">RISING HIGHER LOWS (ACCUMULATION)</text>

      <!-- Price Zig-Zag Inside Triangle -->
      <path d="M 140 250 L 200 120 L 270 200 L 330 120 L 400 160 L 460 120 L 550 50" fill="none" stroke="#f7a600" stroke-width="3"/>

      <!-- Touches on Resistance -->
      <circle cx="200" cy="120" r="5" fill="#ff3b57"/>
      <circle cx="330" cy="120" r="5" fill="#ff3b57"/>
      <circle cx="460" cy="120" r="5" fill="#ff3b57"/>

      <!-- Breakout Surge -->
      <circle cx="480" cy="100" r="8" fill="#00c076"/>
      <text x="500" y="95" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">EXPLOSIVE BREAKOUT</text>

      <!-- Height Base H -->
      <line x1="140" y1="120" x2="140" y2="250" stroke="#38bdf8" stroke-width="2"/>
      <text x="150" y="185" fill="#38bdf8" font-size="10" font-family="monospace">BASE H (130 pts)</text>

      <!-- Target Box -->
      <rect x="520" y="38" width="180" height="26" fill="#00c076" fill-opacity="0.2" stroke="#00c076" rx="4"/>
      <text x="530" y="55" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">TARGET 1: 23,480 (+130 pts)</text>

      <rect x="520" y="150" width="180" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="530" y="166" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS &lt; 23,290 (-60 pts)</text>
    `)
  }
};

module.exports = { module2Topics };
