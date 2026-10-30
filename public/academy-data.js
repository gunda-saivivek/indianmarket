/**
 * THE MARKET SNIPER SHOOTERS - MASTER TRADING ACADEMY
 * Institutional Trading Curriculum & Visual Trade Blueprints
 * 
 * Authored with Dalal Street & Wall Street Proprietary Trading Standards.
 * Covers full progression: Candlesticks -> Chart Patterns -> Fibonacci ->
 * Supply & Demand -> Smart Money Concepts (SMC) -> Indicators -> Options Mastery.
 */

window.ACADEMY_MODULES = [
  {
    id: "module-candlesticks",
    title: "1. Candlestick Anatomy & Market Psychology",
    category: "candlesticks",
    icon: "candlestick-chart",
    color: "bullGreen",
    description: "Master the atomic language of price action. Decode buyer vs seller conviction, wick rejections, and institutional traps."
  },
  {
    id: "module-patterns",
    title: "2. Classical Chart Patterns & Price Geometries",
    category: "patterns",
    icon: "trending-up",
    color: "accentGold",
    description: "Trade high-probability geometric structures: breakouts, fakeout traps, necklines, and multi-timeframe continuations."
  },
  {
    id: "module-fibonacci",
    title: "3. Fibonacci Precision & Golden Ratio Retracements",
    category: "fibonacci",
    icon: "compass",
    color: "cyan-400",
    description: "Leverage universal mathematical ratios (0.618, 0.786, 1.618) to pinpoint sniper turnaround zones with zero guesswork."
  },
  {
    id: "module-supply-demand",
    title: "4. Support, Resistance & Supply-Demand Zones",
    category: "supply-demand",
    icon: "layers",
    color: "indigo-400",
    description: "Identify where institutional block orders sit. Distinguish true liquidity zones from retail support/resistance traps."
  },
  {
    id: "module-smc",
    title: "5. Smart Money Concepts (SMC) & Institutional Flow",
    category: "smc",
    icon: "shield-alert",
    color: "bearRed",
    description: "Trade alongside central banks and hedge funds: Order Blocks, Fair Value Gaps (FVG), Liquidity Sweeps, and CHoCH."
  },
  {
    id: "module-indicators",
    title: "6. Momentum Filters, RSI Divergence & VWAP",
    category: "indicators",
    icon: "activity",
    color: "accentGold",
    description: "Combine non-lagging momentum with institutional volume benchmarks (VWAP, EMA Trend Clouds, Hidden RSI Divergences)."
  },
  {
    id: "module-options",
    title: "7. Options Greeks, Equal Pairs & Hero-Zero Mastery",
    category: "options",
    icon: "zap",
    color: "bullGreen",
    description: "The proprietary Sniper execution framework: Delta expansion, 1:15 PM Gamma Explosion, and strict 1:2/1:3 Risk Management."
  }
];

window.ACADEMY_LESSONS = [
  // =========================================================================
  // LESSON 1: CANDLESTICK ANATOMY & PSYCHOLOGY
  // =========================================================================
  {
    id: "candle-anatomy",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Candlestick Anatomy: The Psychology of the Wick & Body",
    level: "Foundational",
    readTime: "5 min",
    subtitle: "How to read who is winning the auction on every single bar",
    analystNote: "Most retail traders memorize candle shapes. Institutional traders read the story of the auction: the body reveals dominant conviction, while the wick reveals rejected liquidity.",
    theory: `
      <p class="mb-3">A candlestick is not a static drawing; it is a live war report between institutional buyers and sellers during a specific timeframe.</p>
      
      <h4 class="text-sm font-bold text-white mt-4 mb-2">1. The Body (Auction Volume & Conviction)</h4>
      <p class="mb-3">The real body represents the spread between the Open and Close. A large green body shows buyers possessed overwhelming aggression, absorbing all sell orders at the ask. A large red body reveals aggressive liquidation or institutional short initiation.</p>

      <h4 class="text-sm font-bold text-white mt-4 mb-2">2. The Upper Wick (Bullish Rejection)</h4>
      <p class="mb-3">When a candle shoots upward but closes near its open leaving a long upper shadow, it proves that buyers ran out of gas at the highs and institutional supply overwhelmed them. This is an early red flag for long positions.</p>

      <h4 class="text-sm font-bold text-white mt-4 mb-2">3. The Lower Wick (Bearish Rejection & Liquidity Absorption)</h4>
      <p class="mb-3">A long lower tail demonstrates that sellers pushed price downward, but as soon as price entered an institutional discount zone, massive buy orders triggered, rejecting lower prices violently.</p>
    `,
    rules: [
      "Never trade a candlestick in isolation — always evaluate its location relative to key Key Levels or 200 EMA.",
      "The larger the body relative to total range, the stronger the directional trend.",
      "A wick that is twice the size of the candle body indicates a high-probability rejection."
    ],
    tradeDetails: {
      setupType: "Price Rejection & Reversal",
      instrument: "Nifty Spot / ATM Call Option",
      entryTrigger: "Breakout above candle high after long lower wick at support",
      stopLoss: "1 tick below the lowest point of the lower rejection wick",
      target1: "Previous swing high (1:2 Risk to Reward)",
      target2: "Next major resistance level (1:3+ Risk to Reward)",
      riskReward: "1:2.8",
      executionChecklist: [
        "Candle forms directly at key horizontal support or VWAP",
        "Lower wick is at least 60% of total candle height",
        "Volume is higher than the previous 5-candle average",
        "Wait for next candle to cross above high before executing order"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <!-- Grid Lines -->
        <line x1="50" y1="60" x2="710" y2="60" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="50" y1="140" x2="710" y2="140" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="50" y1="220" x2="710" y2="220" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="50" y1="300" x2="710" y2="300" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Price Labels on Right -->
        <text x="715" y="65" fill="#64748b" font-size="11" font-family="monospace">23,200 (TARGET 2)</text>
        <text x="715" y="145" fill="#64748b" font-size="11" font-family="monospace">23,120 (TARGET 1)</text>
        <text x="715" y="225" fill="#00c076" font-size="11" font-family="monospace">23,040 (ENTRY)</text>
        <text x="715" y="305" fill="#ff3b57" font-size="11" font-family="monospace">22,960 (STOP LOSS)</text>

        <!-- Support Zone Box -->
        <rect x="50" y="270" width="660" height="40" fill="#00c076" fill-opacity="0.08" stroke="#00c076" stroke-opacity="0.3" stroke-dasharray="4" />
        <text x="60" y="295" fill="#00c076" font-size="12" font-weight="bold" font-family="sans-serif">KEY INSTITUTIONAL DEMAND ZONE (SUPPORT)</text>

        <!-- Downward Trend Candles -->
        <!-- Candle 1: Red -->
        <line x1="120" y1="110" x2="120" y2="200" stroke="#ff3b57" stroke-width="2" />
        <rect x="110" y="125" width="20" height="60" fill="#ff3b57" rx="2" />

        <!-- Candle 2: Red -->
        <line x1="160" y1="160" x2="160" y2="240" stroke="#ff3b57" stroke-width="2" />
        <rect x="150" y="175" width="20" height="50" fill="#ff3b57" rx="2" />

        <!-- Candle 3: Red with momentum -->
        <line x1="200" y1="210" x2="200" y2="280" stroke="#ff3b57" stroke-width="2" />
        <rect x="190" y="220" width="20" height="55" fill="#ff3b57" rx="2" />

        <!-- Candle 4: THE REJECTION PIN BAR (HAMMER) -->
        <line x1="260" y1="210" x2="260" y2="305" stroke="#00c076" stroke-width="2" />
        <rect x="250" y="215" width="20" height="25" fill="#00c076" rx="2" />
        
        <!-- Annotation Pin Bar -->
        <circle cx="260" cy="225" r="18" fill="none" stroke="#f7a600" stroke-width="2" stroke-dasharray="3" />
        <path d="M 260 190 L 260 170" stroke="#f7a600" stroke-width="1.5" />
        <rect x="200" y="145" width="120" height="24" fill="#151922" stroke="#f7a600" rx="4" />
        <text x="260" y="161" fill="#f7a600" font-size="11" font-weight="bold" text-anchor="middle">Long Wick Rejection</text>

        <!-- Candle 5: Confirmation Green Candle -->
        <line x1="310" y1="190" x2="310" y2="240" stroke="#00c076" stroke-width="2" />
        <rect x="300" y="200" width="20" height="35" fill="#00c076" rx="2" />

        <!-- ENTRY LINE & ARROW -->
        <line x1="250" y1="215" x2="550" y2="215" stroke="#00c076" stroke-width="2" stroke-dasharray="5" />
        <path d="M 330 250 L 330 225" stroke="#00c076" stroke-width="2" marker-end="url(#arrow-green)" />
        <rect x="340" y="202" width="130" height="26" fill="#00c076" rx="4" />
        <text x="405" y="219" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">ENTRY: Close > 23,040</text>

        <!-- STOP LOSS LINE -->
        <line x1="250" y1="305" x2="550" y2="305" stroke="#ff3b57" stroke-width="2" stroke-dasharray="5" />
        <rect x="340" y="292" width="130" height="26" fill="#ff3b57" rx="4" />
        <text x="405" y="309" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">STOP LOSS: 22,960</text>

        <!-- RALLY CANDLES TO TARGETS -->
        <line x1="360" y1="160" x2="360" y2="215" stroke="#00c076" stroke-width="2" />
        <rect x="350" y="170" width="20" height="40" fill="#00c076" rx="2" />

        <line x1="410" y1="130" x2="410" y2="185" stroke="#00c076" stroke-width="2" />
        <rect x="400" y="140" width="20" height="40" fill="#00c076" rx="2" />

        <!-- TARGET 1 LINE & BADGE -->
        <line x1="400" y1="140" x2="680" y2="140" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <rect x="520" y="127" width="150" height="26" fill="#151922" stroke="#00c076" stroke-width="1.5" rx="4" />
        <text x="595" y="144" fill="#00c076" font-size="11" font-weight="bold" text-anchor="middle">🎯 TARGET 1: +80 pts (1:2)</text>

        <line x1="460" y1="90" x2="460" y2="150" stroke="#00c076" stroke-width="2" />
        <rect x="450" y="100" width="20" height="45" fill="#00c076" rx="2" />

        <line x1="510" y1="50" x2="510" y2="110" stroke="#00c076" stroke-width="2" />
        <rect x="500" y="60" width="20" height="45" fill="#00c076" rx="2" />

        <!-- TARGET 2 BADGE -->
        <line x1="500" y1="60" x2="680" y2="60" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="520" y="47" width="150" height="26" fill="#151922" stroke="#38bdf8" stroke-width="1.5" rx="4" />
        <text x="595" y="64" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">🎯 TARGET 2: +160 pts (1:4)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 2: HAMMER & INVERTED HAMMER
  // =========================================================================
  {
    id: "candle-hammer-inverted",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Hammer & Inverted Hammer: The Liquidity Sweep Signature",
    level: "Foundational to Pro",
    readTime: "7 min",
    subtitle: "Trading bottom exhaustion when weak hands get liquidated",
    analystNote: "When retail traders place stop-losses below obvious support, institutional algorithms intentionally drive price down to trigger those stop sales. The Hammer forms the instant institutions buy all those market sells.",
    theory: `
      <p class="mb-3">A Hammer is recognized by three mandatory structural characteristics:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Small Real Body:</strong> Located entirely in the upper 25% of the candle's total price range.</li>
        <li><strong>Long Lower Shadow:</strong> Must be at least 2 to 3 times the length of the real body.</li>
        <li><strong>Negligible or Zero Upper Wick:</strong> Indicating strong close without last-second selling.</li>
      </ul>

      <h4 class="text-sm font-bold text-white mt-4 mb-2">The Inverted Hammer (Supply Absorption)</h4>
      <p class="mb-3">Forms after a sustained downtrend. Price shoots aggressively higher testing upper supply, gets pushed back down, but closes near or above the open. It signifies that smart money initiated pilot buy orders, preparing the launchpad for a major trend reversal.</p>
    `,
    rules: [
      "A Hammer in the middle of a sideways consolidation is noise. A Hammer after 3 or more consecutive red candles hitting major support is golden.",
      "Green hammer bodies possess higher win-rate statistics than red hammer bodies (68% vs 54% statistical edge).",
      "Always set Stop Loss 5 points below the lowest wick to avoid getting clipped by secondary liquidity sweeps."
    ],
    tradeDetails: {
      setupType: "Trend Reversal at Demand",
      instrument: "Bank Nifty / Strike In-The-Money CE",
      entryTrigger: "Crossing candle high of the Hammer on 5-min or 15-min timeframe",
      stopLoss: "Below Hammer low shadow",
      target1: "50% retracement of prior downward leg",
      target2: "High of prior consolidation origin (1:3 RR)",
      riskReward: "1:3.2",
      executionChecklist: [
        "Prior downtrend was intact for at least 45 minutes",
        "RSI is below 35 or in oversold territory",
        "Higher volume bar on Hammer than preceding red candles",
        "Immediate green follow-through on next candle"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Demand Zone -->
        <rect x="40" y="275" width="680" height="35" fill="#00c076" fill-opacity="0.1" stroke="#00c076" stroke-opacity="0.4" />
        <text x="50" y="297" fill="#00c076" font-size="11" font-weight="bold">DAILY DEMAND LEVEL (SUPPORT: ₹50,200)</text>

        <!-- Downtrend -->
        <line x1="100" y1="100" x2="100" y2="170" stroke="#ff3b57" stroke-width="2" />
        <rect x="92" y="115" width="16" height="50" fill="#ff3b57" rx="2" />

        <line x1="140" y1="150" x2="140" y2="220" stroke="#ff3b57" stroke-width="2" />
        <rect x="132" y="165" width="16" height="48" fill="#ff3b57" rx="2" />

        <line x1="180" y1="190" x2="180" y2="270" stroke="#ff3b57" stroke-width="2" />
        <rect x="172" y="205" width="16" height="55" fill="#ff3b57" rx="2" />

        <!-- THE HAMMER -->
        <line x1="240" y1="230" x2="240" y2="305" stroke="#00c076" stroke-width="2.5" />
        <rect x="230" y="230" width="20" height="20" fill="#00c076" rx="2" />

        <circle cx="240" cy="240" r="22" fill="none" stroke="#00c076" stroke-width="2" />
        <text x="240" y="215" fill="#00c076" font-size="11" font-weight="bold" text-anchor="middle">HAMMER</text>

        <!-- Liquidity Trap Callout -->
        <path d="M 240 305 L 240 335 L 340 335" fill="none" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="3" />
        <text x="350" y="338" fill="#f7a600" font-size="10" font-family="sans-serif">Retail Stops Swept Here</text>

        <!-- Entry Trigger Line -->
        <line x1="230" y1="230" x2="620" y2="230" stroke="#00c076" stroke-width="2" stroke-dasharray="5" />
        <rect x="280" y="218" width="160" height="24" fill="#00c076" rx="4" />
        <text x="360" y="234" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">ENTRY TRIGGER: High = ₹50,280</text>

        <!-- Stop Loss Line -->
        <line x1="230" y1="305" x2="620" y2="305" stroke="#ff3b57" stroke-width="2" stroke-dasharray="5" />
        <rect x="280" y="293" width="160" height="24" fill="#ff3b57" rx="4" />
        <text x="360" y="309" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: Low = ₹50,170</text>

        <!-- Target Movement Candles -->
        <line x1="300" y1="205" x2="300" y2="250" stroke="#00c076" stroke-width="2" />
        <rect x="292" y="215" width="16" height="30" fill="#00c076" rx="2" />

        <line x1="350" y1="165" x2="350" y2="225" stroke="#00c076" stroke-width="2" />
        <rect x="342" y="175" width="16" height="42" fill="#00c076" rx="2" />

        <line x1="400" y1="130" x2="400" y2="190" stroke="#00c076" stroke-width="2" />
        <rect x="392" y="140" width="16" height="42" fill="#00c076" rx="2" />

        <!-- Target 1 -->
        <line x1="392" y1="140" x2="680" y2="140" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <rect x="490" y="128" width="180" height="24" fill="#151922" stroke="#00c076" rx="4" />
        <text x="580" y="144" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">TARGET 1: ₹50,500 (+220 pts)</text>

        <line x1="450" y1="75" x2="450" y2="145" stroke="#00c076" stroke-width="2" />
        <rect x="442" y="85" width="16" height="50" fill="#00c076" rx="2" />

        <!-- Target 2 -->
        <line x1="442" y1="85" x2="680" y2="85" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="490" y="73" width="180" height="24" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="580" y="89" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">TARGET 2: ₹50,750 (+470 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 3: BULLISH & BEARISH ENGULFING
  // =========================================================================
  {
    id: "candle-engulfing",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Bullish & Bearish Engulfing: Institutional Power Reversals",
    level: "Intermediate",
    readTime: "6 min",
    subtitle: "When institutional volume completely eclipses the prior auction",
    analystNote: "An Engulfing pattern is the clearest visual signal of institutional takeover. The second candle opens beyond the prior close (trapping early breakout traders) and forcefully engulfs the entire body of the previous candle.",
    theory: `
      <p class="mb-3">Unlike basic candlesticks that merely slow down price, an Engulfing structure represents an instant change of hands:</p>
      
      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">Bullish Engulfing (Demand Shock)</h4>
      <p class="mb-3">Forms after a decline. Candle 1 is a small red candle showing declining seller volume. Candle 2 opens lower, but aggressive market buy orders hit the tape, forcing price to close well above Candle 1's open. The entire previous body is submerged inside the green body.</p>

      <h4 class="text-sm font-bold text-bearRed mt-3 mb-1">Bearish Engulfing (Supply Shock)</h4>
      <p class="mb-3">Forms at resistance or swing highs. Candle 1 is green. Candle 2 opens higher, alluring retail breakout buyers. Massive institutional selling then drives price down, closing below Candle 1's low. All longs from Candle 1 are now trapped in deep drawdown.</p>
    `,
    rules: [
      "The body of Candle 2 must 100% engulf the body of Candle 1. Engulfing the wicks as well creates a textbook 'Outside Bar' with over 74% win probability.",
      "Check volume: Candle 2 volume should be at least 1.5x the volume of Candle 1.",
      "Best execution is to enter upon Candle 2 close, or wait for a 50% pullback into the engulfing body (mitigation entry)."
    ],
    tradeDetails: {
      setupType: "Institutional Order Absorption",
      instrument: "NIFTY Futures / ITM Options",
      entryTrigger: "Immediate close of the Engulfing Candle or 50% body retest",
      stopLoss: "1 tick beyond the extreme low (for Bullish) or high (for Bearish)",
      target1: "First major swing liquidity pool (1:2)",
      target2: "Opposite trend extreme (1:3.5)",
      riskReward: "1:2.7",
      executionChecklist: [
        "Occurs at key structure level (Daily S/R or Weekly Pivot)",
        "Volume spike visible on the engulfing candle",
        "Higher timeframe trend aligns with direction",
        "Stop Loss is placed beyond the engulfing wick tip"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="90" x2="720" y2="90" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="180" x2="720" y2="180" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="270" x2="720" y2="270" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Bearish Engulfing Section -->
        <text x="60" y="45" fill="#ff3b57" font-size="13" font-weight="bold">BEARISH ENGULFING PATTERN AT RESISTANCE</text>
        <rect x="40" y="60" width="320" height="25" fill="#ff3b57" fill-opacity="0.1" stroke="#ff3b57" stroke-opacity="0.3" />
        <text x="50" y="77" fill="#ff3b57" font-size="10" font-weight="bold">SUPPLY RESISTANCE: 23,450</text>

        <!-- Candle 1: Small Green -->
        <line x1="140" y1="65" x2="140" y2="135" stroke="#00c076" stroke-width="2" />
        <rect x="132" y="80" width="16" height="40" fill="#00c076" rx="2" />

        <!-- Candle 2: Massive Red Engulfing -->
        <line x1="180" y1="55" x2="180" y2="175" stroke="#ff3b57" stroke-width="2" />
        <rect x="168" y="65" width="24" height="95" fill="#ff3b57" rx="2" />

        <circle cx="180" cy="110" r="30" fill="none" stroke="#ff3b57" stroke-width="2" stroke-dasharray="3" />

        <!-- Annotation -->
        <line x1="168" y1="160" x2="340" y2="160" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="4" />
        <text x="210" y="152" fill="#ff3b57" font-size="10" font-weight="bold">SELL ENTRY: 23,380</text>

        <!-- Stop Loss -->
        <line x1="180" y1="55" x2="340" y2="55" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4" />
        <text x="210" y="50" fill="#f7a600" font-size="10" font-weight="bold">SL: 23,460 (+80 pts)</text>

        <!-- Downward follow through -->
        <line x1="230" y1="150" x2="230" y2="230" stroke="#ff3b57" stroke-width="2" />
        <rect x="220" y="160" width="20" height="60" fill="#ff3b57" rx="2" />

        <line x1="280" y1="210" x2="280" y2="290" stroke="#ff3b57" stroke-width="2" />
        <rect x="270" y="220" width="20" height="60" fill="#ff3b57" rx="2" />

        <text x="260" y="315" fill="#00c076" font-size="10" font-weight="bold">TARGET 1 REACHED: 23,220 (+160 pts)</text>

        <!-- Vertical Divider -->
        <line x1="390" y1="40" x2="390" y2="330" stroke="#232936" stroke-width="2" />

        <!-- Bullish Engulfing Section -->
        <text x="420" y="45" fill="#00c076" font-size="13" font-weight="bold">BULLISH ENGULFING PATTERN AT SUPPORT</text>
        <rect x="420" y="270" width="310" height="25" fill="#00c076" fill-opacity="0.1" stroke="#00c076" stroke-opacity="0.3" />
        <text x="430" y="287" fill="#00c076" font-size="10" font-weight="bold">DEMAND SUPPORT: 22,950</text>

        <!-- Candle 1: Small Red -->
        <line x1="510" y1="210" x2="510" y2="280" stroke="#ff3b57" stroke-width="2" />
        <rect x="502" y="225" width="16" height="40" fill="#ff3b57" rx="2" />

        <!-- Candle 2: Massive Green Engulfing -->
        <line x1="550" y1="165" x2="550" y2="285" stroke="#00c076" stroke-width="2" />
        <rect x="538" y="180" width="24" height="95" fill="#00c076" rx="2" />

        <circle cx="550" cy="225" r="30" fill="none" stroke="#00c076" stroke-width="2" stroke-dasharray="3" />

        <!-- Buy Entry -->
        <line x1="562" y1="180" x2="710" y2="180" stroke="#00c076" stroke-width="1.5" stroke-dasharray="4" />
        <text x="580" y="172" fill="#00c076" font-size="10" font-weight="bold">BUY ENTRY: 23,040</text>

        <!-- Stop Loss -->
        <line x1="550" y1="285" x2="710" y2="285" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="4" />
        <text x="580" y="299" fill="#ff3b57" font-size="10" font-weight="bold">SL: 22,945 (-95 pts)</text>

        <!-- Rally -->
        <line x1="600" y1="120" x2="600" y2="190" stroke="#00c076" stroke-width="2" />
        <rect x="590" y="130" width="20" height="50" fill="#00c076" rx="2" />

        <line x1="650" y1="70" x2="650" y2="140" stroke="#00c076" stroke-width="2" />
        <rect x="640" y="80" width="20" height="50" fill="#00c076" rx="2" />

        <text x="630" y="65" fill="#00c076" font-size="10" font-weight="bold">TARGET 1: 23,230 (+190 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 4: MORNING STAR & EVENING STAR
  // =========================================================================
  {
    id: "candle-morning-evening-star",
    moduleId: "module-candlesticks",
    category: "candlesticks",
    title: "Morning Star & Evening Star: The 3-Candle Trend Exhaustion Engine",
    level: "Intermediate",
    readTime: "7 min",
    subtitle: "How institutions transition from distribution to accumulation",
    analystNote: "The Morning Star is Wall Street's favorite bottom pattern because it eliminates false breakouts. Candle 1 gives bears confidence, Candle 2 halts momentum with a low-volatility doji/star, and Candle 3 delivers decisive institutional reversal volume.",
    theory: `
      <p class="mb-3">A true 3-candle reversal system follows strict auction mechanics:</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">Morning Star Blueprint</h4>
      <ol class="list-decimal pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Candle 1 (Impulse):</strong> Long bearish candle reflecting sustained retail panic.</li>
        <li><strong>Candle 2 (Transition Star):</strong> Small body candle that gaps down or stalls near the low. Sellers fail to push price lower despite full effort.</li>
        <li><strong>Candle 3 (Expansion):</strong> Aggressive green candle opening higher and closing well above the 50% midpoint of Candle 1.</li>
      </ol>

      <h4 class="text-sm font-bold text-bearRed mt-3 mb-1">Evening Star Blueprint (Top Reversal)</h4>
      <p class="mb-3">The exact inverted cousin at resistance. Candle 1 is large green; Candle 2 is a high star indicating buyer exhaustion; Candle 3 is a deep red candle penetrating the lower half of Candle 1. Excellent trigger for buying Put options.</p>
    `,
    rules: [
      "Candle 3 must close above the 50% midpoint of Candle 1's real body. Anything less is merely consolidation.",
      "The larger the volume on Candle 3 compared to Candle 1, the more violent the upcoming trend reversal.",
      "Never enter during Candle 2. Always wait for the final tick of Candle 3 to confirm."
    ],
    tradeDetails: {
      setupType: "Three-Bar Momentum Reversal",
      instrument: "Sensex / Bank Nifty Options",
      entryTrigger: "Close of Candle 3 (or crossing above Candle 3 high)",
      stopLoss: "Below the lowest wick of Candle 2 (the star)",
      target1: "Prior swing peak (1:2 RR)",
      target2: "161.8% Fibonacci extension of the star structure",
      riskReward: "1:3.0",
      executionChecklist: [
        "Identified at daily/hourly support or VWAP lower band",
        "Middle candle exhibits compressed volume or Doji shape",
        "Third candle closes decisively above Candle 1 midpoint",
        "No major macroeconomic news due in the next 15 minutes"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="70" x2="720" y2="70" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="150" x2="720" y2="150" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="230" x2="720" y2="230" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="310" x2="720" y2="310" stroke="#1d2432" stroke-dasharray="4" />

        <rect x="40" y="280" width="680" height="30" fill="#00c076" fill-opacity="0.1" stroke="#00c076" stroke-opacity="0.3" />
        <text x="50" y="300" fill="#00c076" font-size="11" font-weight="bold">KEY DEMAND ZONE (50% FIBONACCI RETRACEMENT LEVEL)</text>

        <!-- Downward leg -->
        <line x1="120" y1="120" x2="120" y2="190" stroke="#ff3b57" stroke-width="2" />
        <rect x="110" y="130" width="20" height="50" fill="#ff3b57" rx="2" />

        <!-- 3-Candle Pattern Box -->
        <rect x="170" y="150" width="160" height="150" fill="none" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4" rx="8" />
        <text x="250" y="140" fill="#f7a600" font-size="11" font-weight="bold" text-anchor="middle">MORNING STAR PATTERN</text>

        <!-- Candle 1: Big Red -->
        <line x1="195" y1="170" x2="195" y2="260" stroke="#ff3b57" stroke-width="2" />
        <rect x="185" y="180" width="20" height="70" fill="#ff3b57" rx="2" />
        <text x="195" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">Bar 1</text>

        <!-- Midpoint 50% line of Bar 1 -->
        <line x1="185" y1="215" x2="310" y2="215" stroke="#f7a600" stroke-width="1" stroke-dasharray="2" />
        <text x="260" y="210" fill="#f7a600" font-size="9">50% Midpoint</text>

        <!-- Candle 2: Small Star / Doji -->
        <line x1="245" y1="250" x2="245" y2="295" stroke="#94a3b8" stroke-width="2" />
        <rect x="238" y="260" width="14" height="15" fill="#f7a600" rx="2" />
        <text x="245" y="315" fill="#94a3b8" font-size="10" text-anchor="middle">Bar 2 (Star)</text>

        <!-- Candle 3: Aggressive Green -->
        <line x1="295" y1="175" x2="295" y2="270" stroke="#00c076" stroke-width="2" />
        <rect x="285" y="185" width="20" height="70" fill="#00c076" rx="2" />
        <text x="295" y="285" fill="#94a3b8" font-size="10" text-anchor="middle">Bar 3</text>

        <!-- ENTRY ON BAR 3 CLOSE -->
        <line x1="305" y1="185" x2="600" y2="185" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <rect x="360" y="173" width="160" height="24" fill="#00c076" rx="4" />
        <text x="440" y="189" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">ENTRY: Bar 3 Close @ ₹76,400</text>

        <!-- STOP LOSS -->
        <line x1="245" y1="295" x2="600" y2="295" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4" />
        <rect x="360" y="283" width="160" height="24" fill="#ff3b57" rx="4" />
        <text x="440" y="299" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: Star Low @ ₹76,150</text>

        <!-- TARGET 1 & 2 RALLY -->
        <line x1="370" y1="130" x2="370" y2="190" stroke="#00c076" stroke-width="2" />
        <rect x="360" y="140" width="20" height="40" fill="#00c076" rx="2" />

        <line x1="430" y1="90" x2="430" y2="155" stroke="#00c076" stroke-width="2" />
        <rect x="420" y="100" width="20" height="45" fill="#00c076" rx="2" />

        <line x1="420" y1="100" x2="700" y2="100" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <rect x="520" y="88" width="180" height="24" fill="#151922" stroke="#00c076" rx="4" />
        <text x="610" y="104" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">TARGET 1: ₹76,900 (+500 pts)</text>

        <line x1="490" y1="50" x2="490" y2="110" stroke="#00c076" stroke-width="2" />
        <rect x="480" y="60" width="20" height="40" fill="#00c076" rx="2" />

        <line x1="480" y1="60" x2="700" y2="60" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="520" y="48" width="180" height="24" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="610" y="64" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">TARGET 2: ₹77,250 (+850 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 5: DOUBLE TOP & DOUBLE BOTTOM
  // =========================================================================
  {
    id: "pattern-double-top-bottom",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Double Bottom (W Pattern) & Double Top (M Pattern)",
    level: "Intermediate",
    readTime: "8 min",
    subtitle: "Trading the second leg retest with zero-risk confirmation",
    analystNote: "Amateur traders jump in blindly on the first bounce. Professional traders wait for the second test (creating the 'W' or 'M' structure) to confirm whether smart money is genuinely defending the price.",
    theory: `
      <p class="mb-3">The W and M patterns represent the most battle-tested structural reversals in modern financial markets.</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">Double Bottom (W Pattern) Mechanics</h4>
      <p class="mb-3">Price hits Low #1 and bounces to form the central peak (the Neckline). Sellers attempt to resume the downtrend, pushing price down to Low #2. However, sellers lack the volume to create a lower low. Price stalls at or slightly above Low #1 (or performs a liquidity grab lower wick) and explodes back up to breach the Neckline.</p>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">Two Execution Methods:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1 text-xs text-gray-300">
        <li><strong>Aggressive Entry:</strong> Entering at Low #2 on a reversal candlestick (Hammer/Bullish Engulfing) with tight Stop Loss.</li>
        <li><strong>Conservative Entry:</strong> Waiting for price to break and close above the Neckline, then entering on the subsequent retest (highest win rate).</li>
      </ul>
    `,
    rules: [
      "Low #2 does not have to be exactly equal to Low #1. In fact, if Low #2 sweeps 5-15 points below Low #1 before closing back above it (liquidity hunt), the win rate increases to 81%.",
      "The minimum price target equals the vertical distance from the Neckline down to the lowest trough, projected upward from the breakout point.",
      "Volume must dry up during the formation of Low #2 and expand aggressively as price crosses the Neckline."
    ],
    tradeDetails: {
      setupType: "Structural Neckline Breakout & Retest",
      instrument: "NIFTY Index / Sensex Weekly ATM CE",
      entryTrigger: "Breakout candle close above Neckline OR retest bounce off Neckline",
      stopLoss: "Below the swing low of the breakout candle (or midway between Low #2 and Neckline)",
      target1: "1x height of the pattern (100% measured move)",
      target2: "1.618x Fibonacci extension of the W structure",
      riskReward: "1:2.9",
      executionChecklist: [
        "Neckline is clearly defined with at least 15-20 bars between Bottom 1 and Bottom 2",
        "Bullish RSI divergence visible between Bottom 1 and Bottom 2",
        "Breakout candle has large real body closing above neckline",
        "Volume on breakout is visibly higher than previous consolidation"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- W Structure Polylines -->
        <polyline points="80,100 160,260 260,160 360,260 460,160 560,70" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        <polyline points="80,100 160,260 260,160 360,260 460,160 560,70" fill="none" stroke="#00c076" stroke-width="2" stroke-dasharray="6" stroke-linecap="round" />

        <!-- Bottom 1 & Bottom 2 Badges -->
        <circle cx="160" cy="260" r="14" fill="#151922" stroke="#ff3b57" stroke-width="2" />
        <text x="160" y="264" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">B1</text>
        <text x="160" y="290" fill="#94a3b8" font-size="10" text-anchor="middle">Bottom 1: ₹23,000</text>

        <circle cx="360" cy="260" r="14" fill="#151922" stroke="#00c076" stroke-width="2" />
        <text x="360" y="264" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">B2</text>
        <text x="360" y="290" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">Bottom 2: ₹23,010</text>

        <!-- Neckline Horizontal Line -->
        <line x1="220" y1="160" x2="680" y2="160" stroke="#f7a600" stroke-width="2" stroke-dasharray="4" />
        <rect x="230" y="145" width="130" height="22" fill="#151922" stroke="#f7a600" rx="4" />
        <text x="295" y="160" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">NECKLINE: ₹23,160</text>

        <!-- Height Projection Arrow (Measured Move) -->
        <line x1="260" y1="160" x2="260" y2="260" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2" />
        <text x="215" y="215" fill="#38bdf8" font-size="10">Height: +160 pts</text>

        <!-- Breakout Point -->
        <circle cx="460" cy="160" r="8" fill="#00c076" />
        <path d="M 460 200 L 460 175" stroke="#00c076" stroke-width="2" />
        <rect x="420" y="200" width="170" height="26" fill="#00c076" rx="4" />
        <text x="505" y="217" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">ENTRY: Neckline Break @ 23,165</text>

        <!-- Stop Loss -->
        <line x1="420" y1="210" x2="420" y2="245" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="2" />
        <rect x="380" y="245" width="140" height="24" fill="#ff3b57" rx="4" />
        <text x="450" y="261" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: ₹23,090 (-75 pts)</text>

        <!-- Target Point -->
        <circle cx="560" cy="70" r="10" fill="#38bdf8" />
        <line x1="460" y1="70" x2="680" y2="70" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="520" y="38" width="180" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="610" y="55" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET: ₹23,320 (+160 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 6: HEAD AND SHOULDERS & INVERSE HEAD AND SHOULDERS
  // =========================================================================
  {
    id: "pattern-head-shoulders",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Head & Shoulders: The Institutional Distribution Signature",
    level: "Advanced",
    readTime: "9 min",
    subtitle: "Trading Quasimodo structural breaks with precision",
    analystNote: "Head & Shoulders is not just a chart pattern; it records three successive buying attempts. The Head creates a final blow-off high where institutions offload massive inventory. When the Right Shoulder fails to make a higher high, institutional abandonment is absolute.",
    theory: `
      <p class="mb-3">The anatomy of an institutional Head & Shoulders distribution sequence:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Left Shoulder:</strong> Strong rally driven by general market momentum, followed by a minor correction.</li>
        <li><strong>The Head:</strong> Massive speculative breakout above the Left Shoulder. However, volume on the Head is often LOWER than the Left Shoulder (classic volume divergence).</li>
        <li><strong>Right Shoulder:</strong> Feeble rally that cannot reach the Head's peak. Big funds begin aggressive shorting here.</li>
        <li><strong>The Neckline:</strong> The trendline connecting the low points of the two intervening pullbacks.</li>
      </ul>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">Inverse Head & Shoulders (Bottom Accumulation)</h4>
      <p class="mb-3">Forms at the bottom of major bear markets. The Head forms the deepest panic drop. The Right Shoulder forms a higher low, proving buyers are aggressively stepping in before prior lows are touched.</p>
    `,
    rules: [
      "The Right Shoulder should ideally retrace to the 50% or 61.8% Fibonacci level of the Head decline.",
      "Down-sloping necklines produce significantly faster drops on standard Head & Shoulders patterns.",
      "Measured target = Vertical height from Head peak to Neckline, projected downward from the break point."
    ],
    tradeDetails: {
      setupType: "Distribution Breakdown",
      instrument: "Bank Nifty / Sensex PE Options",
      entryTrigger: "Breakout candle close below Neckline (or retest of the broken Neckline)",
      stopLoss: "Above the high of the Right Shoulder",
      target1: "100% measured move of Head-to-Neckline distance",
      target2: "Major higher-timeframe demand origin (1:3+)",
      riskReward: "1:3.4",
      executionChecklist: [
        "Volume visibly decreases from Left Shoulder $\rightarrow$ Head $\rightarrow$ Right Shoulder",
        "RSI prints a distinct Bearish Divergence at the Head",
        "Breakdown candle closes with at least 80% of its body below the Neckline",
        "No major support level immediately within 40 points of the entry"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="70" x2="720" y2="70" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="150" x2="720" y2="150" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="230" x2="720" y2="230" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Structure Geometry -->
        <polyline points="60,230 140,130 200,210 300,70 400,210 470,140 560,280" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        <polyline points="60,230 140,130 200,210 300,70 400,210 470,140 560,280" fill="none" stroke="#ff3b57" stroke-width="2" stroke-dasharray="5" stroke-linecap="round" />

        <!-- Left Shoulder -->
        <circle cx="140" cy="130" r="10" fill="#151922" stroke="#f7a600" stroke-width="2" />
        <text x="140" y="110" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Left Shoulder</text>

        <!-- HEAD -->
        <circle cx="300" cy="70" r="14" fill="#151922" stroke="#ff3b57" stroke-width="2.5" />
        <text x="300" y="45" fill="#ff3b57" font-size="12" font-weight="extrabold" text-anchor="middle">HEAD (PEAK: ₹51,800)</text>

        <!-- Right Shoulder -->
        <circle cx="470" cy="140" r="10" fill="#151922" stroke="#f7a600" stroke-width="2" />
        <text x="470" y="120" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Right Shoulder</text>

        <!-- Neckline -->
        <line x1="160" y1="210" x2="680" y2="210" stroke="#f7a600" stroke-width="2" stroke-dasharray="4" />
        <rect x="230" y="198" width="130" height="22" fill="#151922" stroke="#f7a600" rx="4" />
        <text x="295" y="213" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">NECKLINE: ₹51,200</text>

        <!-- Breakdown Entry -->
        <circle cx="510" cy="210" r="8" fill="#ff3b57" />
        <rect x="440" y="225" width="170" height="26" fill="#ff3b57" rx="4" />
        <text x="525" y="241" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">SELL ENTRY: Break < ₹51,190</text>

        <!-- Stop Loss -->
        <line x1="470" y1="140" x2="640" y2="140" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="3" />
        <rect x="520" y="128" width="150" height="24" fill="#151922" stroke="#f7a600" rx="4" />
        <text x="595" y="144" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: ₹51,450</text>

        <!-- Target -->
        <circle cx="560" cy="280" r="10" fill="#00c076" />
        <line x1="510" y1="280" x2="710" y2="280" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <rect x="550" y="295" width="170" height="26" fill="#151922" stroke="#00c076" rx="4" />
        <text x="635" y="312" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET: ₹50,600 (-600 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 7: FIBONACCI RETRACEMENTS & THE GOLDEN POCKET
  // =========================================================================
  {
    id: "fibonacci-golden-pocket",
    moduleId: "module-fibonacci",
    category: "fibonacci",
    title: "Fibonacci Retracements: The Institutional Golden Pocket (0.618 - 0.65)",
    level: "Advanced",
    readTime: "9 min",
    subtitle: "Trading the mathematical turning points where algorithms reload",
    analystNote: "Hedge funds and algorithmic trading systems do not enter trades at random prices. Over 65% of institutional trend-continuation orders are automated around the 0.618 and 0.65 Golden Pocket retracement ratio.",
    theory: `
      <p class="mb-3">Fibonacci numbers reflect the fundamental geometry of natural growth, financial liquidity, and auction waves.</p>

      <h4 class="text-sm font-bold text-cyan-400 mt-3 mb-1">The Critical Retracement Levels:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>0.382 (Shallow Retracement):</strong> Indicates hyper-aggressive momentum. Common in explosive gap-up trends.</li>
        <li><strong>0.50 (Psychological Equilibrium):</strong> The exact half-way discount. While not a true Fib number, highly respected by Dow Theory.</li>
        <li><strong>0.618 to 0.65 (The Golden Pocket):</strong> The highest-probability institutional entry zone in existence. Offers maximum risk-to-reward because stop-losses can be placed tightly below 0.786.</li>
        <li><strong>0.786 (Deep Discount / Last Line of Defense):</strong> If price breaks below 0.786 with volume, the prior impulse is invalidated.</li>
      </ul>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">Fibonacci Extensions (The Take-Profit Engine):</h4>
      <p class="mb-3">Never exit based on fear or greed. Use <strong>1.272</strong> and <strong>1.618 extensions</strong> of the correction leg to calculate the exact mathematical peak of the next impulsive wave.</p>
    `,
    rules: [
      "Always measure from the absolute extreme wick low to the extreme wick high of the primary impulse leg.",
      "Look for confluence: A 0.618 Golden Pocket that aligns with a prior horizontal breakout level or 50 EMA is an institutional grade A+ setup.",
      "Never place an order blindly at 0.618. Wait for a 5-minute reversal candlestick (Hammer or Engulfing) to confirm the turn."
    ],
    tradeDetails: {
      setupType: "Golden Ratio Pullback Confluence",
      instrument: "NIFTY Spot / Sensex Intraday Calls",
      entryTrigger: "Reversal candlestick printed inside the 0.618 - 0.65 zone",
      stopLoss: "1 tick below the 0.786 Fibonacci level",
      target1: "Previous Swing High (0.00% level)",
      target2: "1.618 Fibonacci Extension level",
      riskReward: "1:3.8",
      executionChecklist: [
        "Primary trend on 1-hour / 15-minute timeframe is clearly bullish",
        "Impulse leg had clean momentum with consecutive green candles",
        "Retracement into 0.618 occurred on lighter volume (healthy correction)",
        "Stochastics or RSI resetting near 40-45 zone"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <!-- Fib Lines -->
        <line x1="60" y1="60" x2="700" y2="60" stroke="#64748b" stroke-width="1.5" />
        <text x="705" y="65" fill="#64748b" font-size="11" font-family="monospace">0.000% (High: 23,400)</text>

        <line x1="60" y1="120" x2="700" y2="120" stroke="#64748b" stroke-dasharray="3" />
        <text x="705" y="125" fill="#64748b" font-size="11" font-family="monospace">0.382 (23,260)</text>

        <line x1="60" y1="160" x2="700" y2="160" stroke="#64748b" stroke-dasharray="3" />
        <text x="705" y="165" fill="#64748b" font-size="11" font-family="monospace">0.500 (23,200)</text>

        <!-- THE GOLDEN POCKET BOX (0.618 - 0.65) -->
        <rect x="60" y="195" width="640" height="25" fill="#f7a600" fill-opacity="0.15" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4" />
        <text x="705" y="205" fill="#f7a600" font-size="11" font-weight="bold" font-family="monospace">0.618 (23,140)</text>
        <text x="705" y="220" fill="#f7a600" font-size="11" font-weight="bold" font-family="monospace">0.650 GOLDEN POCKET</text>

        <line x1="60" y1="260" x2="700" y2="260" stroke="#ff3b57" stroke-dasharray="4" />
        <text x="705" y="265" fill="#ff3b57" font-size="11" font-family="monospace">0.786 (23,060 - INVALIDATION)</text>

        <line x1="60" y1="310" x2="700" y2="310" stroke="#64748b" stroke-width="1.5" />
        <text x="705" y="315" fill="#64748b" font-size="11" font-family="monospace">1.000% (Origin: 22,950)</text>

        <!-- Impulse Leg Wave -->
        <polyline points="100,310 260,60" fill="none" stroke="#00c076" stroke-width="3" stroke-linecap="round" />
        <text x="160" y="170" fill="#00c076" font-size="11" font-weight="bold">Impulsive Wave 1</text>

        <!-- Corrective Pullback into Golden Pocket -->
        <polyline points="260,60 380,205" fill="none" stroke="#ff3b57" stroke-width="2.5" stroke-dasharray="5" stroke-linecap="round" />
        <text x="330" y="130" fill="#ff3b57" font-size="11" font-weight="bold">Correction Wave 2</text>

        <!-- Golden Pocket Reversal Marker -->
        <circle cx="380" cy="205" r="14" fill="#151922" stroke="#f7a600" stroke-width="2.5" />
        <text x="380" y="209" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">GP</text>

        <!-- ENTRY BADGE -->
        <path d="M 380 205 L 430 205" stroke="#00c076" stroke-width="2" />
        <rect x="430" y="192" width="160" height="26" fill="#00c076" rx="4" />
        <text x="510" y="209" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">SNIPER ENTRY: 23,145</text>

        <!-- STOP LOSS -->
        <rect x="430" y="260" width="160" height="24" fill="#ff3b57" rx="4" />
        <text x="510" y="276" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: Below 0.786</text>

        <!-- Wave 3 Explosive Expansion -->
        <polyline points="380,205 580,20" fill="none" stroke="#00c076" stroke-width="3" stroke-linecap="round" />
        <text x="490" y="100" fill="#00c076" font-size="12" font-weight="bold">Wave 3 Expansion</text>

        <!-- Target 1.618 Extension -->
        <line x1="560" y1="20" x2="700" y2="20" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="520" y="32" width="180" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="610" y="49" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 1.618 FIB TARGET: 23,650</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 8: SMART MONEY CONCEPTS (SMC) & ORDER BLOCKS
  // =========================================================================
  {
    id: "smc-order-blocks",
    moduleId: "module-smc",
    category: "smc",
    title: "Smart Money Concepts: Institutional Order Blocks & Mitigation",
    level: "Institutional Elite",
    readTime: "11 min",
    subtitle: "Trading the exact price levels where central banks left unfinished orders",
    analystNote: "When institutional players need to deploy ₹5,000 Crores into Nifty, they cannot execute in one click without blowing out the market. Instead, they buy aggressively, create a massive imbalance, and subsequently allow price to drift back (mitigation) to fill their remaining limit orders at the Order Block.",
    theory: `
      <p class="mb-3">Order Blocks are the institutional footprints visible on clean Japanese candlestick charts.</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">Bullish Order Block Definition:</h4>
      <p class="mb-3">The <strong>last down-closed (red) candle</strong> before a powerful, aggressive upward expansion that causes a <strong>BOS (Break of Structure)</strong> and leaves a <strong>Fair Value Gap (FVG)</strong> behind it. This red candle contains the institutional long inventory.</p>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">The 3-Step SMC Trading Cycle:</h4>
      <ol class="list-decimal pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Origination:</strong> Smart money accumulates during the final red candle.</li>
        <li><strong>Expansion & Displacement:</strong> Massive green candles violently blast upward, breaking previous structural swing highs.</li>
        <li><strong>Mitigation / Return to Order Block:</strong> Retail traders chase the top and get shaken out. Price steadily drifts back into the Order Block where institutional unfilled buy limits are waiting.</li>
      </ol>
    `,
    rules: [
      "An Order Block is ONLY valid if the subsequent move broke previous market structure (BOS). If no structure was broken, it is not an institutional Order Block.",
      "The 50% midpoint of the Order Block body is called the 'Mean Threshold'. If price closes below the Mean Threshold on the entry candle, exit immediately.",
      "First test of an Order Block has a 78% win rate; second and third retests have decaying probability."
    ],
    tradeDetails: {
      setupType: "Institutional Order Block Mitigation",
      instrument: "Bank Nifty Futures / ATM Options",
      entryTrigger: "Touch of the Order Block high or 50% Mean Threshold",
      stopLoss: "1 tick below the low of the Order Block candle",
      target1: "Liquidity pool above the Swing High that caused the BOS",
      target2: "Higher-timeframe Equal Highs / Buy-Side Liquidity",
      riskReward: "1:4.2",
      executionChecklist: [
        "Clean Break of Structure (BOS) occurred after the Order Block formed",
        "Unfilled Fair Value Gap (FVG) exists between the OB and the current price",
        "Price returned to the Order Block with corrective (low volume) candles",
        "Refinement on 3-min or 5-min chart shows candle rejection"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- BOS (Break of Structure) Line -->
        <line x1="140" y1="110" x2="520" y2="110" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4" />
        <rect x="280" y="98" width="160" height="22" fill="#151922" stroke="#f7a600" rx="4" />
        <text x="360" y="113" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">BOS: Break of Structure (₹51,500)</text>

        <!-- Prior Swing High -->
        <line x1="140" y1="90" x2="140" y2="150" stroke="#00c076" stroke-width="2" />
        <rect x="132" y="100" width="16" height="40" fill="#00c076" rx="2" />

        <!-- Downward leg to OB -->
        <line x1="180" y1="130" x2="180" y2="210" stroke="#ff3b57" stroke-width="2" />
        <rect x="172" y="145" width="16" height="55" fill="#ff3b57" rx="2" />

        <!-- THE BULLISH ORDER BLOCK (Last Red Candle) -->
        <rect x="210" y="210" width="450" height="45" fill="#00c076" fill-opacity="0.12" stroke="#00c076" stroke-width="1.5" rx="4" />
        <line x1="230" y1="200" x2="230" y2="260" stroke="#ff3b57" stroke-width="2.5" />
        <rect x="220" y="210" width="20" height="45" fill="#ff3b57" rx="2" />
        
        <text x="330" y="235" fill="#00c076" font-size="11" font-weight="bold">BULLISH ORDER BLOCK (OB Zone)</text>

        <!-- Explosive Displacement Candles (creating FVG) -->
        <line x1="270" y1="130" x2="270" y2="220" stroke="#00c076" stroke-width="2" />
        <rect x="260" y="140" width="20" height="75" fill="#00c076" rx="2" />

        <line x1="310" y1="60" x2="310" y2="150" stroke="#00c076" stroke-width="2" />
        <rect x="300" y="70" width="20" height="75" fill="#00c076" rx="2" />

        <text x="310" y="50" fill="#00c076" font-size="10" font-weight="bold">Displacement & FVG</text>

        <!-- Corrective Pullback (Mitigation) -->
        <line x1="360" y1="80" x2="360" y2="140" stroke="#ff3b57" stroke-width="1.5" />
        <rect x="352" y="90" width="16" height="40" fill="#ff3b57" rx="2" />

        <line x1="400" y1="120" x2="400" y2="180" stroke="#ff3b57" stroke-width="1.5" />
        <rect x="392" y="130" width="16" height="40" fill="#ff3b57" rx="2" />

        <line x1="440" y1="160" x2="440" y2="225" stroke="#ff3b57" stroke-width="1.5" />
        <rect x="432" y="170" width="16" height="45" fill="#ff3b57" rx="2" />

        <!-- MITIGATION ENTRY POINT AT OB -->
        <circle cx="440" cy="215" r="12" fill="#151922" stroke="#00c076" stroke-width="2.5" />
        <path d="M 440 215 L 490 215" stroke="#00c076" stroke-width="2" />
        <rect x="490" y="202" width="170" height="26" fill="#00c076" rx="4" />
        <text x="575" y="219" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">SNIPER OB ENTRY: ₹51,100</text>

        <!-- STOP LOSS -->
        <line x1="210" y1="260" x2="680" y2="260" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4" />
        <rect x="490" y="265" width="170" height="24" fill="#ff3b57" rx="4" />
        <text x="575" y="281" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: Below OB Low (₹50,980)</text>

        <!-- Final Expansion to Target -->
        <line x1="480" y1="140" x2="480" y2="215" stroke="#00c076" stroke-width="2" />
        <rect x="470" y="150" width="20" height="60" fill="#00c076" rx="2" />

        <line x1="530" y1="70" x2="530" y2="150" stroke="#00c076" stroke-width="2" />
        <rect x="520" y="80" width="20" height="60" fill="#00c076" rx="2" />

        <!-- TARGET -->
        <line x1="520" y1="70" x2="710" y2="70" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="540" y="40" width="170" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="625" y="57" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 BSL TARGET: ₹51,800 (+700 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 9: FAIR VALUE GAPS (FVG) & IMBALANCE TRADING
  // =========================================================================
  {
    id: "smc-fair-value-gaps",
    moduleId: "module-smc",
    category: "smc",
    title: "Fair Value Gaps (FVG): Trading Market Inefficiencies",
    level: "Institutional Elite",
    readTime: "8 min",
    subtitle: "The magnet price pockets created during algorithmic expansion",
    analystNote: "When high-frequency institutional algorithms hit the order book, price moves so fast that orders are only executed on one side of the market (pure buyers or pure sellers). The resulting empty pocket between Candle 1's wick and Candle 3's wick is a Fair Value Gap that price MUST return to balance.",
    theory: `
      <p class="mb-3">A Fair Value Gap (FVG) is a three-candle structural pattern that proves one-sided algorithmic dominance:</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">Bullish FVG Identification:</h4>
      <p class="mb-3">Look at a sequence of 3 candles: Candle 1, Candle 2 (large aggressive green candle), and Candle 3. A Bullish FVG exists when the <strong>High of Candle 1 does NOT touch or overlap the Low of Candle 3</strong>. The void between them is pure unmitigated buy imbalance.</p>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">How Institutions Use FVGs:</h4>
      <p class="mb-3">Price is magnetically pulled back into this void. As soon as price dips into the 50% midpoint of the FVG (called the <strong>Consequent Encroachment / CE</strong>), institutional buy limits fire, catapulting price back into the dominant trend.</p>
    `,
    rules: [
      "The larger and cleaner the Fair Value Gap, the higher its magnetic pull.",
      "FVGs that align with the 0.618 Fibonacci retracement or a fresh Order Block have over an 82% win rate.",
      "If price closes completely through the FVG (inversion), the gap is deemed violated and now flips into an opposite resistance zone."
    ],
    tradeDetails: {
      setupType: "Imbalance Rebalancing & Trend Continuation",
      instrument: "NIFTY Index Options / Futures",
      entryTrigger: "Price touches the top of the FVG or 50% Consequent Encroachment",
      stopLoss: "1 tick below the Low of Candle 1",
      target1: "Liquidity pool at recent swing highs (1:2.5)",
      target2: "Next unmitigated higher timeframe FVG (1:4)",
      riskReward: "1:3.5",
      executionChecklist: [
        "FVG is clear on 5-min or 15-min timeframe",
        "Displacement candle (Candle 2) had exceptional volume",
        "Higher timeframe bias matches the direction of the gap",
        "Stop Loss is placed below the Candle 1 foundation"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- 3-Bar FVG Creation -->
        <!-- Candle 1 -->
        <line x1="140" y1="180" x2="140" y2="250" stroke="#00c076" stroke-width="2" />
        <rect x="132" y="190" width="16" height="50" fill="#00c076" rx="2" />
        <text x="140" y="270" fill="#94a3b8" font-size="10" text-anchor="middle">Candle 1</text>
        <!-- Candle 1 High Line -->
        <line x1="140" y1="180" x2="520" y2="180" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="3" />
        <text x="90" y="184" fill="#f7a600" font-size="10">C1 High</text>

        <!-- Candle 2: Massive Imbalance Body -->
        <line x1="190" y1="70" x2="190" y2="200" stroke="#00c076" stroke-width="2.5" />
        <rect x="178" y="80" width="24" height="110" fill="#00c076" rx="2" />
        <text x="190" y="60" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">Displacement</text>

        <!-- Candle 3 -->
        <line x1="240" y1="50" x2="240" y2="120" stroke="#00c076" stroke-width="2" />
        <rect x="232" y="60" width="16" height="50" fill="#00c076" rx="2" />
        <text x="240" y="40" fill="#94a3b8" font-size="10" text-anchor="middle">Candle 3</text>
        <!-- Candle 3 Low Line -->
        <line x1="240" y1="120" x2="520" y2="120" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="3" />
        <text x="90" y="124" fill="#f7a600" font-size="10">C3 Low</text>

        <!-- THE FAIR VALUE GAP SHADED BOX -->
        <rect x="178" y="120" width="342" height="60" fill="#f7a600" fill-opacity="0.15" stroke="#f7a600" stroke-width="2" stroke-dasharray="4" rx="4" />
        <text x="320" y="155" fill="#f7a600" font-size="12" font-weight="bold">FAIR VALUE GAP (FVG IMBALANCE ZONE)</text>

        <!-- Retest into FVG -->
        <line x1="320" y1="80" x2="320" y2="140" stroke="#ff3b57" stroke-width="1.5" />
        <rect x="312" y="90" width="16" height="40" fill="#ff3b57" rx="2" />

        <line x1="370" y1="110" x2="370" y2="160" stroke="#ff3b57" stroke-width="1.5" />
        <rect x="362" y="120" width="16" height="35" fill="#ff3b57" rx="2" />

        <!-- Mitigation Point -->
        <circle cx="370" cy="150" r="10" fill="#151922" stroke="#00c076" stroke-width="2.5" />
        <path d="M 370 150 L 420 150" stroke="#00c076" stroke-width="2" />
        <rect x="420" y="137" width="170" height="26" fill="#00c076" rx="4" />
        <text x="505" y="154" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">BUY AT FVG RE-ENTRY: ₹23,180</text>

        <!-- STOP LOSS -->
        <line x1="140" y1="250" x2="680" y2="250" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4" />
        <rect x="420" y="240" width="170" height="24" fill="#ff3b57" rx="4" />
        <text x="505" y="256" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: Below C1 Low (₹23,090)</text>

        <!-- Target Rally -->
        <line x1="420" y1="80" x2="420" y2="150" stroke="#00c076" stroke-width="2" />
        <rect x="410" y="90" width="20" height="50" fill="#00c076" rx="2" />

        <line x1="480" y1="30" x2="480" y2="100" stroke="#00c076" stroke-width="2" />
        <rect x="470" y="40" width="20" height="50" fill="#00c076" rx="2" />

        <!-- Target Line -->
        <line x1="470" y1="30" x2="710" y2="30" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="540" y="18" width="170" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="625" y="35" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET: ₹23,380 (+200 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 10: RSI DIVERGENCES (REGULAR & HIDDEN)
  // =========================================================================
  {
    id: "indicator-rsi-divergence",
    moduleId: "module-indicators",
    category: "indicators",
    title: "RSI Divergence Mastery: Detecting Hidden Trend Momentum",
    level: "Intermediate to Pro",
    readTime: "8 min",
    subtitle: "When price lies but indicator volume tells the honest truth",
    analystNote: "Price on the chart can be manipulated by high-frequency market makers seeking liquidity. However, the Relative Strength Index (RSI) measures the mathematical velocity of buying vs selling. A divergence reveals institutional weakness well before price turns.",
    theory: `
      <p class="mb-3">Mastering the two major classes of divergence gives you radar vision over the entire Indian options market:</p>

      <h4 class="text-sm font-bold text-bearRed mt-3 mb-1">1. Regular Bearish Divergence (Reversal Signal):</h4>
      <p class="mb-3">Price reaches a <strong>Higher High</strong> on the chart, but RSI simultaneously prints a <strong>Lower High</strong>. This proves institutional buyers did not support the new high with aggressive buying power. A violent downward reversal is imminent.</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">2. Hidden Bullish Divergence (Trend Continuation Engine):</h4>
      <p class="mb-3">Price prints a <strong>Higher Low</strong> (healthy pullback in an existing uptrend), while the RSI plunges into a <strong>Lower Low</strong>. This indicates extreme internal buying pressure absorbing all sell orders. One of the highest-win-rate continuation setups known to trading.</p>
    `,
    rules: [
      "Use RSI with standard 14 periods. Overbought is 70; Oversold is 30.",
      "A divergence on the 15-minute timeframe carries 3 times more significance than on a 1-minute chart.",
      "Do not short on regular divergence until price breaks below the preceding swing low or 9 EMA."
    ],
    tradeDetails: {
      setupType: "Momentum Exhaustion & Reversal",
      instrument: "Sensex / Nifty ATM Put Option",
      entryTrigger: "Breakdown of the neckline or 5-min candle close below 9 EMA",
      stopLoss: "1 tick above the extreme price peak (the Higher High)",
      target1: "50 RSI centerline cross / Previous swing support (1:2)",
      target2: "Oversold 30 RSI territory (1:3.5)",
      riskReward: "1:3.1",
      executionChecklist: [
        "Price made a clean Higher High on the 5-min or 15-min chart",
        "RSI clearly formed a Lower High below 70",
        "Confirmation candle printed (Bearish Engulfing or Shooting Star)",
        "No major RBI / Fed policy announcement pending"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <!-- Chart Upper Half (Price Action) -->
        <text x="50" y="35" fill="#ffffff" font-size="12" font-weight="bold">PRICE ACTION (CANDLESTICKS)</text>
        <line x1="40" y1="50" x2="720" y2="50" stroke="#1d2432" stroke-dasharray="3" />
        <line x1="40" y1="120" x2="720" y2="120" stroke="#1d2432" stroke-dasharray="3" />
        <line x1="40" y1="190" x2="720" y2="190" stroke="#1d2432" stroke-dasharray="3" />

        <!-- Price Peaks (Higher High) -->
        <polyline points="80,160 180,90 260,140 380,60 480,170" fill="none" stroke="#64748b" stroke-width="2" />
        
        <!-- Peak 1 -->
        <circle cx="180" cy="90" r="8" fill="#151922" stroke="#f7a600" stroke-width="2" />
        <text x="180" y="75" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Peak 1: 23,350</text>

        <!-- Peak 2 (Higher High) -->
        <circle cx="380" cy="60" r="10" fill="#151922" stroke="#ff3b57" stroke-width="2.5" />
        <text x="380" y="45" fill="#ff3b57" font-size="11" font-weight="bold" text-anchor="middle">Peak 2: 23,420 (HIGHER HIGH)</text>

        <!-- Price Trendline Connecting Highs -->
        <line x1="180" y1="90" x2="380" y2="60" stroke="#00c076" stroke-width="2.5" />
        <text x="280" y="70" fill="#00c076" font-size="10" font-weight="bold">Price: Higher High ↗</text>

        <!-- Entry Trigger -->
        <circle cx="430" cy="115" r="8" fill="#ff3b57" />
        <rect x="445" y="102" width="160" height="24" fill="#ff3b57" rx="4" />
        <text x="525" y="118" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">SELL ENTRY: Break of 23,340</text>

        <!-- Stop Loss -->
        <line x1="380" y1="60" x2="680" y2="60" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4" />
        <text x="610" y="55" fill="#f7a600" font-size="10">SL: 23,430 (+90 pts)</text>

        <!-- Target -->
        <circle cx="480" cy="170" r="8" fill="#00c076" />
        <rect x="500" y="160" width="160" height="24" fill="#151922" stroke="#00c076" rx="4" />
        <text x="580" y="176" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET: 23,180 (+160 pts)</text>

        <!-- Divider Line between Chart & Indicator -->
        <line x1="40" y1="210" x2="720" y2="210" stroke="#232936" stroke-width="2" />

        <!-- Lower Half (RSI Sub-window) -->
        <text x="50" y="230" fill="#38bdf8" font-size="11" font-weight="bold">RSI (14) OSCILLATOR SUB-WINDOW</text>
        <line x1="40" y1="250" x2="720" y2="250" stroke="#ff3b57" stroke-dasharray="2" />
        <text x="705" y="253" fill="#ff3b57" font-size="9">70 (Overbought)</text>

        <line x1="40" y1="320" x2="720" y2="320" stroke="#00c076" stroke-dasharray="2" />
        <text x="705" y="323" fill="#00c076" font-size="9">30 (Oversold)</text>

        <!-- RSI Line Forming LOWER HIGH -->
        <polyline points="80,290 180,245 260,280 380,265 480,315" fill="none" stroke="#38bdf8" stroke-width="2.5" />
        
        <circle cx="180" cy="245" r="6" fill="#38bdf8" />
        <text x="180" y="240" fill="#38bdf8" font-size="9" text-anchor="middle">RSI: 76</text>

        <circle cx="380" cy="265" r="6" fill="#ff3b57" />
        <text x="380" y="260" fill="#ff3b57" font-size="9" text-anchor="middle">RSI: 64</text>

        <!-- RSI Divergence Trendline -->
        <line x1="180" y1="245" x2="380" y2="265" stroke="#ff3b57" stroke-width="2.5" />
        <text x="270" y="250" fill="#ff3b57" font-size="10" font-weight="bold">RSI: Lower High ↘ (BEARISH DIVERGENCE)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 11: OPTIONS GREEKS & THE 1:15 PM GAMMA EXPLOSION
  // =========================================================================
  {
    id: "options-greeks-gamma-blast",
    moduleId: "module-options",
    category: "options",
    title: "Option Greeks & The 1:15 PM Gamma Explosion Playbook",
    level: "Institutional Elite",
    readTime: "10 min",
    subtitle: "How ₹20 options skyrocket to ₹120 on expiry afternoons",
    analystNote: "Retail traders buy OTM options in the morning and bleed to death from Theta decay. Institutional option scalpers do the exact opposite: they wait until 1:15 PM on expiry day when Gamma peaks, and ride rapid non-linear premium explosions.",
    theory: `
      <p class="mb-3">To trade Indian options like a professional analyst, you must understand the mathematical forces governing option pricing:</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">The 4 Core Greeks:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Delta (Δ):</strong> The rate of change of option price per 1-point move in the underlying spot index. (ATM has ~0.50 Delta).</li>
        <li><strong>Gamma (Γ):</strong> The accelerator pedal! Gamma measures how quickly Delta itself increases as the spot approaches your strike. On expiry afternoon, ATM Gamma approaches infinity!</li>
        <li><strong>Theta (Θ):</strong> The time-decay enemy. Theta accelerates drastically in the final 2 hours before 3:30 PM.</li>
        <li><strong>Vega (V):</strong> Sensitivity to Implied Volatility (IV). Sudden news surges IV, boosting options premiums instantly.</li>
      </ul>

      <h4 class="text-sm font-bold text-accentGold mt-3 mb-1">The 1:15 PM Hero-Zero Window:</h4>
      <p class="mb-3">Between 1:15 PM and 2:45 PM on weekly expiry, option sellers (institutions who wrote strikes) start panicking if spot moves towards their short strikes. When spot breaks the midday consolidation range, massive short covering ensues, causing strikes priced at ₹15-₹30 to explode 200% to 500% in minutes.</p>
    `,
    rules: [
      "Select strikes priced strictly in the ₹15 - ₹35 sweet spot. Avoid ₹2-₹5 strikes (lottery traps with 95% zero probability).",
      "Always set a hard 50% Stop Loss or treat the position as predefined risk capital.",
      "The Golden Exit Rule: Sell 50% of your position the moment premium doubles (hits 2x target). Your remaining position is now 100% risk-free!"
    ],
    tradeDetails: {
      setupType: "Expiry Afternoon Gamma Blast",
      instrument: "Nifty / Sensex Current Expiry Strike",
      entryTrigger: "Spot Index breaks out of 12:00-1:15 PM consolidation range",
      stopLoss: "50% of premium paid (e.g., if bought at ₹24, SL is ₹12)",
      target1: "2x Entry Price (+100% gain, lock profits and pull initial capital)",
      target2: "3x to 4x Entry Price (+200% to +300% gain)",
      riskReward: "1:3.0",
      executionChecklist: [
        "Time is between 1:15 PM and 2:45 PM on expiry day",
        "Spot has formed a clear consolidation box for at least 45 minutes",
        "India VIX is stable or rising",
        "Sell 50% lots instantly when Target 1 (2x) is hit"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="70" x2="720" y2="70" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="140" x2="720" y2="140" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="210" x2="720" y2="210" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="280" x2="720" y2="280" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Timeline Bar on Bottom -->
        <rect x="40" y="320" width="680" height="25" fill="#151922" stroke="#232936" rx="4" />
        <text x="100" y="337" fill="#64748b" font-size="10" font-family="monospace">9:15 AM</text>
        <text x="250" y="337" fill="#64748b" font-size="10" font-family="monospace">11:30 AM (Chop)</text>
        <text x="400" y="337" fill="#f7a600" font-size="10" font-weight="bold" font-family="monospace">⚡ 1:15 PM (PRIME TIME)</text>
        <text x="600" y="337" fill="#00c076" font-size="10" font-weight="bold" font-family="monospace">2:30 PM (Gamma Blast)</text>

        <!-- Midday Consolidation Box -->
        <rect x="220" y="200" width="180" height="70" fill="#f7a600" fill-opacity="0.08" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="3" rx="4" />
        <text x="310" y="190" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">12:00 - 1:15 PM Consolidation Range</text>

        <!-- Range High Line -->
        <line x1="220" y1="200" x2="680" y2="200" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <text x="230" y="195" fill="#00c076" font-size="10" font-weight="bold">BREAKOUT TRIGGER: Spot > 23,200</text>

        <!-- Option Price Curve (Non-linear exponential curve) -->
        <path d="M 60 270 Q 220 260 400 210 T 520 120 T 640 40" fill="none" stroke="#00c076" stroke-width="3.5" />

        <!-- Entry Marker -->
        <circle cx="400" cy="210" r="12" fill="#151922" stroke="#f7a600" stroke-width="2.5" />
        <text x="400" y="214" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">₹24</text>
        <rect x="420" y="200" width="160" height="26" fill="#00c076" rx="4" />
        <text x="500" y="217" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">ENTRY: ₹24.00 (1:18 PM)</text>

        <!-- Stop Loss -->
        <line x1="400" y1="255" x2="680" y2="255" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="4" />
        <rect x="420" y="245" width="160" height="24" fill="#ff3b57" rx="4" />
        <text x="500" y="261" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">50% STOP LOSS: ₹12.00</text>

        <!-- Target 1 (2x) -->
        <circle cx="520" cy="120" r="10" fill="#00c076" />
        <line x1="480" y1="120" x2="680" y2="120" stroke="#00c076" stroke-width="2" stroke-dasharray="4" />
        <rect x="540" y="108" width="170" height="26" fill="#151922" stroke="#00c076" rx="4" />
        <text x="625" y="125" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET 1 (2x): ₹48.00 (+100%)</text>

        <!-- Target 2 (3x) -->
        <circle cx="640" cy="40" r="12" fill="#38bdf8" />
        <line x1="580" y1="40" x2="710" y2="40" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
        <rect x="540" y="28" width="170" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="625" y="45" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🚀 TARGET 2 (3.5x): ₹84.00 (+250%)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 12: EQUAL CE & PE STRADDLE / STRANGLE SNIPER STRATEGY
  // =========================================================================
  {
    id: "options-equal-pairs-hedge",
    moduleId: "module-options",
    category: "options",
    title: "Equal CE & PE Pairs: The Delta-Neutral Breakout Hedge Strategy",
    level: "Institutional Elite",
    readTime: "9 min",
    subtitle: "How to trade huge index volatility without predicting market direction",
    analystNote: "The holy grail of professional proprietary desks is eliminating directional bias. When Nifty compresses before an event (Budget, RBI MPC, US Non-Farm Payrolls, or key breakout levels), buying equal CE & PE pairs guarantees that whichever side explodes, its profits exponentially overwhelm the capped loss of the other side.",
    theory: `
      <p class="mb-3">Our proprietary 'Equal Pairs' algorithm matches strikes that trade at approximately identical premiums (e.g., Nifty 23300 CE at ₹45 and Nifty 22900 PE at ₹46).</p>

      <h4 class="text-sm font-bold text-accentGold mt-3 mb-1">The Mathematical Payoff Asymmetry:</h4>
      <p class="mb-3">Options have asymmetrical payoffs: <strong>Max loss is strictly 100%</strong> of the premium paid (cannot lose more than ₹45), while <strong>gain is theoretically unlimited</strong> (often running 200%, 300%, or 500% during directional breakouts).</p>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">Real-World Case Study:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li>Buy CE @ ₹45 + Buy PE @ ₹45. Combined outlay = ₹90.</li>
        <li>Nifty breaks out 180 points upward.</li>
        <li>PE decays from ₹45 to ₹15 (-₹30 loss).</li>
        <li>CE explodes from ₹45 to ₹145 (+₹100 gain).</li>
        <li><strong>Net Realized Profit:</strong> +₹70 per unit (+77% net portfolio gain) with zero directional guesswork!</li>
      </ul>
    `,
    rules: [
      "Both legs must be entered simultaneously at matched premium levels (variance under 8%).",
      "Only deploy Equal Pairs when the market has consolidated for at least 60-90 minutes (tight Bollinger Bands or contracted ATR).",
      "Once one leg reaches 2.5x to 3x, trail stop loss on the winning leg to lock institutional profits."
    ],
    tradeDetails: {
      setupType: "Volatility Expansion Long Strangle",
      instrument: "Equal CE & PE Pair Filtered by The Sniper Tool",
      entryTrigger: "Simultaneous buy of matched CE and PE strike",
      stopLoss: "Combined portfolio stop loss at 30% of total capital deployed",
      target1: "Total combined investment reaches +50% net profit",
      target2: "Total combined investment reaches +100% (2x) net profit",
      riskReward: "1:2.8",
      executionChecklist: [
        "Index is breaking out of morning opening range",
        "Premiums of CE and PE are balanced within ₹3 of each other",
        "Both strikes have high liquidity (checked by our automated engine)",
        "Sell loser if it breaches key support to reduce drag"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Header -->
        <text x="60" y="45" fill="#f7a600" font-size="13" font-weight="bold">EQUAL CE & PE PAIR STRATEGY PAYOFF BLUEPRINT</text>

        <!-- Base Outlay Level -->
        <line x1="60" y1="200" x2="700" y2="200" stroke="#64748b" stroke-width="2" />
        <text x="60" y="190" fill="#64748b" font-size="10" font-weight="bold">ENTRY COST: CE ₹45 + PE ₹45 = ₹90 TOTAL</text>

        <!-- Winning Leg: CE Explosion Curve -->
        <path d="M 120 200 Q 300 180 500 80 T 660 30" fill="none" stroke="#00c076" stroke-width="3.5" />
        <text x="540" y="60" fill="#00c076" font-size="12" font-weight="bold">Winning Leg (CE): ₹45 ➔ ₹145 (+₹100)</text>

        <!-- Losing Leg: PE Decay Curve (Capped at 0) -->
        <path d="M 120 200 Q 300 230 500 250 T 660 260" fill="none" stroke="#ff3b57" stroke-width="2.5" stroke-dasharray="4" />
        <text x="540" y="275" fill="#ff3b57" font-size="11">Losing Leg (PE): ₹45 ➔ ₹15 (-₹30 Max Loss Capped)</text>

        <!-- NET PROFIT HIGHLIGHT BOX -->
        <rect x="220" y="90" width="260" height="75" fill="#00c076" fill-opacity="0.15" stroke="#00c076" stroke-width="2" rx="8" />
        <text x="350" y="115" fill="#00c076" font-size="13" font-weight="bold" text-anchor="middle">NET RESULT: +₹70 / Share</text>
        <text x="350" y="135" fill="#ffffff" font-size="11" text-anchor="middle">+77.7% Net Portfolio Profit</text>
        <text x="350" y="152" fill="#f7a600" font-size="10" text-anchor="middle">Directional Bias Needed: ZERO!</text>

        <!-- Entry Dot -->
        <circle cx="120" cy="200" r="10" fill="#f7a600" />
        <text x="120" y="225" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Buy Pair</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 13: BULL FLAG & BEAR FLAG PATTERNS
  // =========================================================================
  {
    id: "pattern-bull-bear-flag",
    moduleId: "module-patterns",
    category: "patterns",
    title: "Bull Flag & Bear Flag: The Explosive Continuation Blueprint",
    level: "Intermediate",
    readTime: "8 min",
    subtitle: "How to jump aboard runaway institutional trends with low risk",
    analystNote: "When a strong trend is underway, retail traders constantly make the mistake of fading it (trying to pick tops/bottoms). Top analysts look for the Flag: an impulsive vertical pole followed by a tight parallel channel of profit-taking on light volume, setting up the next explosive impulse leg.",
    theory: `
      <p class="mb-3">A Bull Flag represents a temporary breather in an aggressive markup phase:</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">Structural Anatomy of a Bull Flag:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>The Pole (Displacement):</strong> Vertical, nearly 90-degree rally driven by institutional buy programs. Volume is heavy.</li>
        <li><strong>The Flag (Orderly Digestion):</strong> Price pulls back slightly within two downward-sloping parallel trendlines. Volume noticeably dries up. Sellers cannot crash price; they can only cause a mild drift.</li>
        <li><strong>The Breakout:</strong> Aggressive surge above the upper boundary of the flag channel with a massive surge in tick volume.</li>
      </ul>

      <h4 class="text-sm font-bold text-white mt-3 mb-1">The Measured Move Calculation:</h4>
      <p class="mb-3">Take the exact point-height of the initial flagpole, and add it directly to the lowest point of the flag breakout. This gives an ultra-precise institutional target with over 78% historical reliability.</p>
    `,
    rules: [
      "The pullback inside the flag channel should not retrace more than 38.2% to 50% of the pole height. Any deeper retracement invalidates the flag.",
      "The flag channel must slant gently against the primary trend (slanted downward for a Bull Flag, upward for a Bear Flag).",
      "Volume must contract during the flag consolidation and spike on the breakout candle."
    ],
    tradeDetails: {
      setupType: "Trend Continuation Breakout",
      instrument: "Nifty / Bank Nifty ATM or 1-Strike ITM CE",
      entryTrigger: "5-minute candle closes outside and above the upper flag trendline",
      stopLoss: "1 tick below the lowest swing trough inside the flag channel",
      target1: "Previous flagpole peak (1:2)",
      target2: "100% measured move of the flagpole height (1:3.5)",
      riskReward: "1:3.2",
      executionChecklist: [
        "Flagpole was created by 3 or more strong consecutive momentum candles",
        "Volume visibly shrank as price formed the flag channel",
        "Breakout candle has decisive body close above resistance",
        "Stop loss is securely tucked beneath the channel low"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Title -->
        <text x="60" y="45" fill="#00c076" font-size="13" font-weight="bold">BULL FLAG CONTINUATION SETUP</text>

        <!-- Flagpole (Impulse) -->
        <line x1="120" y1="310" x2="280" y2="100" stroke="#00c076" stroke-width="5" stroke-linecap="round" />
        <text x="140" y="210" fill="#00c076" font-size="12" font-weight="extrabold">FLAGPOLE (+250 pts)</text>

        <!-- Flag Channel Upper Line -->
        <line x1="280" y1="100" x2="440" y2="160" stroke="#f7a600" stroke-width="2.5" />
        <!-- Flag Channel Lower Line -->
        <line x1="250" y1="140" x2="410" y2="200" stroke="#f7a600" stroke-width="2.5" />

        <!-- Flag Consolidation Candles Shading -->
        <polygon points="280,100 440,160 410,200 250,140" fill="#f7a600" fill-opacity="0.08" />
        <text x="345" y="145" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Consolidation Channel</text>

        <!-- Breakout Point -->
        <circle cx="430" cy="155" r="9" fill="#00c076" />
        <path d="M 430 155 L 430 120" stroke="#00c076" stroke-width="2" />
        <rect x="420" y="90" width="170" height="26" fill="#00c076" rx="4" />
        <text x="505" y="107" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">ENTRY: Breakout @ 23,200</text>

        <!-- Stop Loss -->
        <line x1="410" y1="200" x2="620" y2="200" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="4" />
        <rect x="420" y="210" width="150" height="24" fill="#ff3b57" rx="4" />
        <text x="495" y="226" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: 23,130 (-70 pts)</text>

        <!-- Second Impulse Leg (Measured Move) -->
        <line x1="430" y1="155" x2="590" y2="25" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6" stroke-linecap="round" />
        <text x="480" y="55" fill="#38bdf8" font-size="11" font-weight="bold">Measured Leg (+250 pts)</text>

        <!-- Target Point -->
        <circle cx="590" cy="25" r="10" fill="#38bdf8" />
        <rect x="540" y="15" width="170" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="625" y="32" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET: 23,450 (+250 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 14: SUPPORT & RESISTANCE POLARITY PRINCIPLE
  // =========================================================================
  {
    id: "support-polarity-flip",
    moduleId: "module-supply-demand",
    category: "supply-demand",
    title: "The Polarity Principle: Former Resistance Flips into Rock-Solid Support",
    level: "Foundational to Advanced",
    readTime: "7 min",
    subtitle: "Trading the high-conviction breakout-and-retest bounce",
    analystNote: "The single most reliable price action principle in technical analysis is the Polarity Flip: When a major ceiling (Resistance) is decisively shattered, trapped short sellers rush to cover their positions at breakeven when price dips back to that ceiling, converting former resistance into a fortress of support.",
    theory: `
      <p class="mb-3">Why does resistance turn into support? It is driven entirely by human psychology and institutional risk management:</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">The 3 Market Participants at the Retest:</h4>
      <ol class="list-decimal pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Trapped Bears:</strong> Traders who shorted at resistance are sitting on deep losses when price breaks out. When price dips back to the level, they panic-buy to close their positions at zero loss.</li>
        <li><strong>Fell-Behind Bulls:</strong> Buyers who missed the initial breakout wait for a pullback to get aboard.</li>
        <li><strong>Smart Money Re-loaders:</strong> Institutional algorithms defend the breakout level to ensure the trend remains intact.</li>
      </ol>
      <p class="text-xs text-gray-300 mt-2">The confluence of all three groups creates an explosive upward bounce!</p>
    `,
    rules: [
      "The more times a level acted as resistance in the past, the stronger it will act as support after it is broken.",
      "Never chase the green breakout candle into thin air. Patiently let price retrace to the broken ceiling for a sniper entry.",
      "Enter upon confirmation of a bullish rejection wick touching the flip zone."
    ],
    tradeDetails: {
      setupType: "Resistance-to-Support Flip Retest",
      instrument: "Nifty / Sensex ATM Call Option",
      entryTrigger: "Bullish candle bounce off the newly established support level",
      stopLoss: "1 tick below the flip zone (buffer of 15 points on Nifty)",
      target1: "High of the breakout thrust (1:2)",
      target2: "Next higher resistance zone (1:3+)",
      riskReward: "1:2.9",
      executionChecklist: [
        "Resistance level was tested at least twice prior to the breakout",
        "Breakout candle had clean institutional volume",
        "Retest pulled back cleanly without huge selling pressure",
        "Green confirmation pin-bar or engulfing candle formed at the retest"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- THE POLARITY FLIP LEVEL -->
        <rect x="40" y="175" width="680" height="20" fill="#f7a600" fill-opacity="0.12" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4" />
        <text x="60" y="170" fill="#ff3b57" font-size="11" font-weight="bold">FORMER RESISTANCE: 23,100</text>
        <text x="450" y="170" fill="#00c076" font-size="11" font-weight="bold">BECOMES NEW SUPPORT: 23,100</text>

        <!-- Resistance Touches (Rejections) -->
        <polyline points="80,260 140,185 200,240 260,185 320,230" fill="none" stroke="#64748b" stroke-width="2" />
        
        <circle cx="140" cy="185" r="7" fill="#ff3b57" />
        <text x="140" y="160" fill="#ff3b57" font-size="9" text-anchor="middle">Reject 1</text>

        <circle cx="260" cy="185" r="7" fill="#ff3b57" />
        <text x="260" y="160" fill="#ff3b57" font-size="9" text-anchor="middle">Reject 2</text>

        <!-- The Violent Breakout -->
        <polyline points="320,230 400,90" fill="none" stroke="#00c076" stroke-width="3.5" />
        <text x="350" y="110" fill="#00c076" font-size="11" font-weight="bold">Breakout!</text>

        <!-- The Retest (Pullback to Flip Zone) -->
        <polyline points="400,90 470,185" fill="none" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4" />
        <text x="445" y="130" fill="#ff3b57" font-size="10">Retest</text>

        <!-- THE SNIPER BOUNCE ENTRY -->
        <circle cx="470" cy="185" r="11" fill="#151922" stroke="#00c076" stroke-width="2.5" />
        <rect x="490" y="175" width="160" height="26" fill="#00c076" rx="4" />
        <text x="570" y="192" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">BUY AT RETEST: 23,105</text>

        <!-- Stop Loss -->
        <line x1="470" y1="220" x2="650" y2="220" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="3" />
        <rect x="490" y="230" width="150" height="24" fill="#ff3b57" rx="4" />
        <text x="565" y="246" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">STOP LOSS: 23,070 (-35 pts)</text>

        <!-- Expansion to Target -->
        <polyline points="470,185 620,40" fill="none" stroke="#00c076" stroke-width="3" />
        <circle cx="620" cy="40" r="10" fill="#38bdf8" />
        <rect x="540" y="28" width="170" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="625" y="45" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET: 23,280 (+175 pts)</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 15: VWAP INTRADAY BENCHMARK & BANDS
  // =========================================================================
  {
    id: "indicator-vwap-bands",
    moduleId: "module-indicators",
    category: "indicators",
    title: "VWAP (Volume Weighted Average Price): The Institutional North Star",
    level: "Intermediate to Pro",
    readTime: "9 min",
    subtitle: "Trading with the benchmark price executed by mutual funds & FIIs",
    analystNote: "Mutual fund execution algorithms are rated based on whether they fill orders above or below VWAP. When price is above VWAP, institutions are eager buyers. When price tests VWAP from above, institutions defend it vigorously. If price is below VWAP, NEVER buy Call options!",
    theory: `
      <p class="mb-3">Unlike simple moving averages that only calculate price, VWAP factors in <strong>every rupee of volume executed at every price tier</strong> throughout the trading session.</p>

      <h4 class="text-sm font-bold text-accentGold mt-3 mb-1">The 3 Golden VWAP Rules:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
        <li><strong>Trend Filter:</strong> Price > VWAP = Bullish Bias (Only trade CE options). Price < VWAP = Bearish Bias (Only trade PE options).</li>
        <li><strong>The VWAP Bounce (Institutional Reload):</strong> In an uptrend, wait for price to pull back and touch VWAP. If a green candle prints at VWAP, enter immediately.</li>
        <li><strong>VWAP Standard Deviation Bands (+1σ, +2σ, -1σ, -2σ):</strong> When price stretches to +2σ band, it is mathematically extended. Expect mean reversion back towards VWAP.</li>
      </ul>
    `,
    rules: [
      "VWAP resets every morning at 9:15 AM IST. Do not trade off VWAP during the first 15 minutes while initial auction volume stabilizes.",
      "A cross and close above VWAP with rising volume signals institutional accumulation.",
      "If Nifty breaks below VWAP after 1:00 PM, anticipate afternoon long unwinding."
    ],
    tradeDetails: {
      setupType: "VWAP Pullback & Institutional Defense",
      instrument: "Bank Nifty / Nifty ATM CE",
      entryTrigger: "Candle touches VWAP and closes green with a lower wick rejection",
      stopLoss: "1 tick below the VWAP line (or low of the rejection candle)",
      target1: "+1 Standard Deviation Band (1:2)",
      target2: "+2 Standard Deviation Band (1:3.5)",
      riskReward: "1:3.0",
      executionChecklist: [
        "Index has been trading above VWAP since the morning open",
        "Pullback into VWAP occurs on lower volume",
        "India VIX is not spiking violently",
        "Immediate green candle close confirms support"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- +2 Upper Band -->
        <path d="M 60 70 Q 300 80 700 50" fill="none" stroke="#38bdf8" stroke-dasharray="3" stroke-width="1.5" />
        <text x="690" y="45" fill="#38bdf8" font-size="9" text-anchor="end">+2σ Upper Band (Overbought Target)</text>

        <!-- +1 Band -->
        <path d="M 60 120 Q 300 135 700 110" fill="none" stroke="#64748b" stroke-dasharray="2" />
        <text x="690" y="105" fill="#64748b" font-size="9" text-anchor="end">+1σ Band</text>

        <!-- THE CENTRAL VWAP LINE -->
        <path d="M 60 180 Q 300 200 700 170" fill="none" stroke="#f7a600" stroke-width="3" />
        <text x="80" y="200" fill="#f7a600" font-size="11" font-weight="bold">VWAP BENCHMARK LINE</text>

        <!-- Price Wave Bouncing off VWAP -->
        <polyline points="80,180 160,110 260,195 380,80 480,175 620,50" fill="none" stroke="#00c076" stroke-width="2.5" />

        <!-- Bounce 1 -->
        <circle cx="260" cy="195" r="9" fill="#151922" stroke="#00c076" stroke-width="2" />
        <text x="260" y="220" fill="#00c076" font-size="9" text-anchor="middle">VWAP Bounce #1</text>

        <!-- Bounce 2 (The Sniper Trade) -->
        <circle cx="480" cy="175" r="11" fill="#151922" stroke="#f7a600" stroke-width="2.5" />
        <path d="M 480 175 L 520 175" stroke="#00c076" stroke-width="2" />
        <rect x="520" y="162" width="160" height="26" fill="#00c076" rx="4" />
        <text x="600" y="179" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">VWAP ENTRY: 23,120</text>

        <!-- Stop Loss -->
        <line x1="480" y1="210" x2="680" y2="210" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="3" />
        <rect x="520" y="215" width="150" height="24" fill="#ff3b57" rx="4" />
        <text x="595" y="231" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">SL: Below VWAP (23,085)</text>

        <!-- Target at +2 Upper Band -->
        <circle cx="620" cy="50" r="10" fill="#38bdf8" />
        <rect x="540" y="20" width="170" height="26" fill="#151922" stroke="#38bdf8" rx="4" />
        <text x="625" y="37" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">🎯 TARGET (+2σ): 23,280</text>
      </svg>
    `
  },

  // =========================================================================
  // LESSON 16: INSTITUTIONAL RISK MANAGEMENT & 1% RULE
  // =========================================================================
  {
    id: "risk-psychology-rules",
    moduleId: "module-options",
    category: "options",
    title: "Institutional Capital Defense & The 1% Risk Blueprint",
    level: "Institutional Elite",
    readTime: "9 min",
    subtitle: "How top 1% traders never blow up and compound wealth consistently",
    analystNote: "Amateur traders obsess over which stock will double tomorrow. Veteran institutional fund managers obsess over one question only: 'How much can I lose if this trade goes completely wrong?' Survival is the absolute prerequisite to profitability.",
    theory: `
      <p class="mb-3">No trading strategy has a 100% win rate. Even with a 60% win rate, mathematics guarantees you will eventually hit 5 to 7 consecutive losing trades. If you risk 20% per trade, your account is wiped out forever. If you risk 1%, you emerge unharmed.</p>

      <h4 class="text-sm font-bold text-bullGreen mt-3 mb-1">The Professional Position Sizing Formula:</h4>
      <div class="bg-tradeDark p-3 rounded-lg border border-tradeBorder font-mono text-xs text-accentGold my-2">
        Position Size (Lots) = (Total Capital × Risk%) ÷ (Entry Price - Stop Loss Price)
      </div>
      <p class="text-xs text-gray-300">Never adjust your Stop Loss to fit your position size. ALWAYS adjust your lot size to fit your technical Stop Loss!</p>

      <h4 class="text-sm font-bold text-accentGold mt-3 mb-1">The 3-Strike Rule (Emotional Circuit Breaker):</h4>
      <p class="mb-3">If you take 2 consecutive losses in a single morning, close your terminal for 2 hours. If you hit 3 losses in a day, STOP TRADING for the day. This completely prevents revenge trading and emotional gambling.</p>
    `,
    rules: [
      "Never risk more than 1% to 2% of total trading capital on any single options trade.",
      "Never enter a trade with less than a 1:2 Risk-to-Reward ratio.",
      "When Target 1 is achieved, immediately move your Stop Loss to Breakeven (cost price). The trade is now mathematically risk-free!"
    ],
    tradeDetails: {
      setupType: "Capital Preservation & Risk Asymmetry",
      instrument: "Portfolio Risk Management Model",
      entryTrigger: "Pre-calculated position size before clicking buy",
      stopLoss: "Strict system Stop Loss (No mental stops)",
      target1: "2x Risk (Sell 50% lots, trail rest)",
      target2: "3x+ Risk (Ride with trailing stop)",
      riskReward: "1:2.5 Minimum",
      executionChecklist: [
        "Risk amount per trade does not exceed ₹1,000 per ₹1,00,000 capital",
        "Stop Loss is placed in the broker terminal immediately upon order fill",
        "No averaging down on losing options positions",
        "Terminal shut down if daily loss limit is hit"
      ]
    },
    svgBlueprint: `
      <svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
        <line x1="40" y1="80" x2="720" y2="80" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="160" x2="720" y2="160" stroke="#1d2432" stroke-dasharray="4" />
        <line x1="40" y1="240" x2="720" y2="240" stroke="#1d2432" stroke-dasharray="4" />

        <!-- Title -->
        <text x="60" y="45" fill="#f7a600" font-size="13" font-weight="bold">THE 1:3 RISK-TO-REWARD ASYMMETRY BLUEPRINT</text>

        <!-- Capital Allocation Bar -->
        <rect x="60" y="70" width="640" height="35" fill="#151922" stroke="#232936" rx="6" />
        <rect x="60" y="70" width="128" height="35" fill="#ff3b57" fill-opacity="0.25" stroke="#ff3b57" rx="6" />
        <text x="124" y="92" fill="#ff3b57" font-size="11" font-weight="bold" text-anchor="middle">1% - 2% MAX RISK (1R)</text>
        <rect x="188" y="70" width="512" height="35" fill="#00c076" fill-opacity="0.1" rx="6" />
        <text x="444" y="92" fill="#00c076" font-size="11" font-weight="bold" text-anchor="middle">PROTECTED CAPITAL & COMPOUND GROWTH</text>

        <!-- Risk Box (Red) -->
        <rect x="180" y="180" width="160" height="60" fill="#ff3b57" fill-opacity="0.15" stroke="#ff3b57" stroke-width="2" rx="6" />
        <text x="260" y="205" fill="#ff3b57" font-size="12" font-weight="bold" text-anchor="middle">1R RISK UNIT</text>
        <text x="260" y="225" fill="#ffffff" font-size="10" text-anchor="middle">-₹1,000 Max Loss</text>

        <!-- Reward Box 1 (Target 1) -->
        <rect x="360" y="150" width="160" height="90" fill="#00c076" fill-opacity="0.15" stroke="#00c076" stroke-width="2" rx="6" />
        <text x="440" y="185" fill="#00c076" font-size="12" font-weight="bold" text-anchor="middle">2R REWARD (T1)</text>
        <text x="440" y="205" fill="#ffffff" font-size="10" text-anchor="middle">+₹2,000 (+100% Gain)</text>
        <text x="440" y="225" fill="#00c076" font-size="9" text-anchor="middle">Sell 50% & Lock Risk-Free</text>

        <!-- Reward Box 2 (Target 2) -->
        <rect x="540" y="120" width="160" height="120" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="2" rx="6" />
        <text x="620" y="165" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">3.5R REWARD (T2)</text>
        <text x="620" y="185" fill="#ffffff" font-size="10" text-anchor="middle">+₹3,500 (+250% Gain)</text>
        <text x="620" y="205" fill="#38bdf8" font-size="9" text-anchor="middle">Exponential Runner</text>

        <!-- Mathematical Proof Note -->
        <rect x="60" y="260" width="640" height="50" fill="#151922" stroke="#232936" rx="8" />
        <text x="380" y="285" fill="#f7a600" font-size="11" font-weight="bold" text-anchor="middle">Why Math Beats Emotion: Win Only 4 Out of 10 Trades at 1:3 RR = 6 Losses (-6R) + 4 Wins (+12R) = +6R NET PROFIT!</text>
        <text x="380" y="302" fill="#94a3b8" font-size="10" text-anchor="middle">You can be WRONG 60% of the time and still make massive fortune with institutional asymmetry.</text>
      </svg>
    `
  }
];
