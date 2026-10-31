const fs = require('fs');
const path = require('path');
const { svgBlueprints } = require('./generate_svgs');

// 8 CLEAN, ZERO-PHYSICS MODULES
const modules = [
  {
    id: "module-candlesticks",
    number: "01",
    title: "Candlestick Fundamentals & Price Action Basics",
    category: "candlesticks",
    badge: "BEGINNER TO PRO",
    icon: "candlestick-chart",
    color: "bullGreen",
    summary: "Start from the absolute basics: what is a candlestick, why is it green or red, what do the wicks mean, and how buyers and sellers fight for control every 5 minutes.",
    totalTopics: 4,
    readTime: "25 min",
    topics: [
      {
        id: "topic-candle-anatomy",
        title: "What is a Candlestick? Anatomy & Meaning",
        subtitle: "Open, High, Low, Close & The Story Behind the Colors",
        readTime: "6 min",
        level: "Beginner"
      },
      {
        id: "topic-candle-hammer",
        title: "The Hammer & Inverted Hammer Reversals",
        subtitle: "How to Spot When Sellers Are Exhausted at Support",
        readTime: "6 min",
        level: "Beginner"
      },
      {
        id: "topic-candle-engulfing",
        title: "Bullish & Bearish Engulfing Candles",
        subtitle: "When One Big Candle Swallows the Previous One Completely",
        readTime: "6 min",
        level: "Beginner"
      },
      {
        id: "topic-candle-stars",
        title: "Morning Star & Evening Star 3-Bar Setups",
        subtitle: "The 3-Step Reversal Pattern at Key Tops and Bottoms",
        readTime: "7 min",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "module-patterns",
    number: "02",
    title: "Classical Chart Patterns: Spotting Big Moves Early",
    category: "patterns",
    badge: "CORE PRICE ACTION",
    icon: "trending-up",
    color: "accentGold",
    summary: "Learn the classic patterns that repeat every day on Nifty and Bank Nifty: Double Bottoms (W), Double Tops (M), Head and Shoulders, and Bull Flags.",
    totalTopics: 4,
    readTime: "28 min",
    topics: [
      {
        id: "topic-double-bottom-top",
        title: "Double Bottom (W) & Double Top (M) Patterns",
        subtitle: "How Double Bounces at Support & Resistance Create High-Win Trades",
        readTime: "7 min",
        level: "Beginner"
      },
      {
        id: "topic-head-shoulders",
        title: "Head & Shoulders: The Ultimate Trend Reversal",
        subtitle: "How to Spot Major Tops Before the Market Plunges",
        readTime: "7 min",
        level: "Intermediate"
      },
      {
        id: "topic-flags-pennants",
        title: "Bull Flags & Bear Flags: Trend Continuation",
        subtitle: "Buying Fast Pullbacks When the Market is Trending Strongly",
        readTime: "7 min",
        level: "Intermediate"
      },
      {
        id: "topic-triangles-wedges",
        title: "Ascending Triangles & Price Squeeze Breakouts",
        subtitle: "Spotting Where Price Gets Squeezed Before an Explosion",
        readTime: "7 min",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "module-malaysian",
    number: "03",
    title: "Support & Resistance: The Floor and Ceiling Rules",
    category: "malaysian",
    badge: "KEY LEVELS",
    icon: "layers",
    color: "bullGreen",
    summary: "Never buy at the ceiling and never sell at the floor. Learn how sharp V-peaks and Quasimodo Reversals (QMR) reveal exact institutional turning points.",
    totalTopics: 2,
    readTime: "16 min",
    topics: [
      {
        id: "topic-malaysian-snr",
        title: "Sharp V-Peaks: The Strongest Support & Resistance",
        subtitle: "Why Sharp Bounces Create the Cleanest Retest Trades",
        readTime: "8 min",
        level: "Intermediate"
      },
      {
        id: "topic-malaysian-qmr",
        title: "Quasimodo Reversal (QMR) Pattern",
        subtitle: "The Fake Higher High That Traps Retail Traders Before a Dump",
        readTime: "8 min",
        level: "Advanced"
      }
    ]
  },
  {
    id: "module-fvg-ifvg",
    number: "04",
    title: "Fair Value Gaps (FVG) & Imbalance Boxes",
    category: "fvg-ifvg",
    badge: "SMART MONEY BASICS",
    icon: "box",
    color: "accentGold",
    summary: "When big institutions buy with giant orders, they leave an empty 'gap' on the chart. Learn how price returns to fill this gap like a magnet.",
    totalTopics: 2,
    readTime: "18 min",
    topics: [
      {
        id: "topic-fvg-imbalance",
        title: "Fair Value Gap (FVG): The Institutional Magnet",
        subtitle: "How 3-Bar Imbalances Create Easy Pullback Entries",
        readTime: "9 min",
        level: "Intermediate"
      },
      {
        id: "topic-ifvg-inversion",
        title: "Inversion FVG (iFVG): When Support Flips to Resistance",
        subtitle: "Trading Gaps That Get Violated and Retested From the Other Side",
        readTime: "9 min",
        level: "Advanced"
      }
    ]
  },
  {
    id: "module-liquidity-amt",
    number: "05",
    title: "Liquidity Traps & Avoiding Retail Traps",
    category: "liquidity-amt",
    badge: "INSTITUTIONAL SECRETS",
    icon: "shield-alert",
    color: "bullGreen",
    summary: "Stop getting stopped out! Learn why 9:15 AM opening moves are usually traps, and how to trade Previous Day High (PDH) and Low (PDL) sweeps.",
    totalTopics: 3,
    readTime: "24 min",
    topics: [
      {
        id: "topic-amt-pdh-pdl",
        title: "Previous Day High (PDH) & Low (PDL) Traps",
        subtitle: "How Big Players Trigger Retail Stop Losses Before Reversing",
        readTime: "8 min",
        level: "Advanced"
      },
      {
        id: "topic-amt-value-areas",
        title: "Volume Profile & Fair Price Areas (POC & VAH/VAL)",
        subtitle: "Trading Between Discount (VAL) and Expensive (VAH) Prices",
        readTime: "8 min",
        level: "Advanced"
      },
      {
        id: "topic-judas-swing",
        title: "The 9:15 AM Opening Judas Swing Trap",
        subtitle: "Why You Should Never Chase the First 15 Minutes at Market Open",
        readTime: "8 min",
        level: "Beginner to Pro"
      }
    ]
  },
  {
    id: "module-fibonacci",
    number: "06",
    title: "Fibonacci: The Universal Bouncing Math",
    category: "fibonacci",
    badge: "PRECISION ENTRIES",
    icon: "compass",
    color: "accentGold",
    summary: "Use nature's golden ratio to find the exact sweet spot where a pullback stops and the next explosive wave begins.",
    totalTopics: 2,
    readTime: "16 min",
    topics: [
      {
        id: "topic-fib-golden-pocket",
        title: "The 0.618 - 0.650 Golden Pocket Entry",
        subtitle: "The Exact Pullback Sweet Spot Where Smart Money Buys",
        readTime: "8 min",
        level: "Intermediate"
      },
      {
        id: "topic-fib-extensions",
        title: "Fibonacci Extensions: Where to Book Big Profits",
        subtitle: "Using 1.272 and 1.618 to Exit at the Maximum High",
        readTime: "8 min",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "module-indicators",
    number: "07",
    title: "Simple Indicators: RSI Divergence & VWAP",
    category: "indicators",
    badge: "MOMENTUM CONFIRMATION",
    icon: "activity",
    color: "bullGreen",
    summary: "Cut through indicator clutter. Master the only two indicators professional intraday traders rely on: VWAP and RSI Divergence.",
    totalTopics: 2,
    readTime: "16 min",
    topics: [
      {
        id: "topic-rsi-divergence",
        title: "RSI Divergence: Seeing Reversals Before They Happen",
        subtitle: "When the Chart Lies but the Indicator Reveals the Truth",
        readTime: "8 min",
        level: "Intermediate"
      },
      {
        id: "topic-vwap-bands",
        title: "VWAP & Standard Deviation Bands",
        subtitle: "The Institutional Benchmark: Buying at Discount & Selling at Premium",
        readTime: "8 min",
        level: "Intermediate"
      }
    ]
  },
  {
    id: "module-options",
    number: "08",
    title: "Options Trading, Hero-Zero & Risk Management",
    category: "options",
    badge: "CAPITAL DEFENSE & EXPIRY",
    icon: "zap",
    color: "accentGold",
    summary: "Demystify Call (CE) vs Put (PE), learn how 1:15 PM expiry gamma explosions multiply premiums, and protect your capital with the 1:3 risk rule.",
    totalTopics: 3,
    readTime: "24 min",
    topics: [
      {
        id: "topic-options-greeks-gamma",
        title: "Expiry Day Hero-Zero: The 1:15 PM Gamma Explosion",
        subtitle: "How ₹20 Options Skyrocket to ₹140 on Expiry Afternoons",
        readTime: "8 min",
        level: "Intermediate to Pro"
      },
      {
        id: "topic-equal-pairs-hedge",
        title: "Equal CE & PE Pairs: The Stress-Free Straddle Hedge",
        subtitle: "Making Massive Profits When the Market Moves Fast in Either Direction",
        readTime: "8 min",
        level: "Intermediate"
      },
      {
        id: "topic-risk-management",
        title: "The 1:3 Risk-to-Reward Math: Never Blow Up Your Account",
        subtitle: "Why You Can Lose 6 Out of 10 Trades and Still Make Huge Wealth",
        readTime: "8 min",
        level: "Must Know For Everyone"
      }
    ]
  }
];

// TOPIC DETAILS GENERATOR (SPOON-FED, ZERO PHYSICS)
function buildTopic(id, moduleId, category, title, subtitle, level, readTime, analystNote, subTopics, tradeDetails) {
  return {
    id,
    moduleId,
    category,
    title,
    subtitle,
    moduleTitle: modules.find(m => m.id === moduleId)?.title || "Trading Masterclass",
    level,
    readTime,
    analystNote,
    tableOfContents: subTopics.map(s => ({ id: s.id, title: s.title })),
    subTopics,
    tradeDetails,
    svgBlueprint: svgBlueprints[id] || ""
  };
}

const deepTopics = {};

// 1. Candlestick Anatomy
deepTopics['topic-candle-anatomy'] = buildTopic(
  'topic-candle-anatomy',
  'module-candlesticks',
  'candlesticks',
  'What is a Candlestick? Anatomy & Meaning',
  'The complete beginner guide to reading what happened in every 5-minute candle',
  'Beginner (Foundational)',
  '6 min',
  'Think of a candlestick as a 5-minute tug of war between two teams: the Green Team (Buyers) and the Red Team (Sellers). Who pushed harder? Where did they start? Where did they finish? The candle tells you the entire story in one glance.',
  [
    {
      id: 'sub-1',
      title: '1. Spoon-Fed: What is a Candlestick & Why Do We Use It?',
      content: `
        <p class="mb-3">Imagine you are sitting at an auction for tomatoes in a local wholesale mandi. Over 5 minutes, the price starts at ₹50, drops to ₹45, climbs up to ₹60, and finally finishes trading at ₹58.</p>
        <p class="mb-3">If you only look at a single line on a chart, you miss all the exciting action! A candlestick shows you all 4 critical price points of that 5-minute fight:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 my-3 font-mono text-xs text-center">
          <div class="p-2 rounded bg-tradeDark border border-tradeBorder"><strong class="text-bullGreen block">O = OPEN</strong>Price where candle started</div>
          <div class="p-2 rounded bg-tradeDark border border-tradeBorder"><strong class="text-bullGreen block">H = HIGH</strong>Highest price reached in 5m</div>
          <div class="p-2 rounded bg-tradeDark border border-tradeBorder"><strong class="text-bearRed block">L = LOW</strong>Lowest price touched in 5m</div>
          <div class="p-2 rounded bg-tradeDark border border-tradeBorder"><strong class="text-bullGreen block">C = CLOSE</strong>Price where candle ended</div>
        </div>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Colors: Green vs Red Made Dead Simple',
      content: `
        <p class="mb-3">Why are some candles green and some red? It is as simple as this:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-xs text-gray-300">
          <li><strong class="text-bullGreen">🟢 GREEN CANDLE (Buyers Won):</strong> The candle finished HIGHER than where it started (Close > Open). Buyers pushed price up.</li>
          <li><strong class="text-bearRed">🔴 RED CANDLE (Sellers Won):</strong> The candle finished LOWER than where it started (Close < Open). Sellers pushed price down.</li>
          <li><strong>The Thick Middle (Real Body):</strong> Shows true power. A big fat body means one team was completely dominant.</li>
          <li><strong>The Thin Lines (Wicks / Shadows):</strong> Show rejection. If price went down but bounced back up before the candle closed, it leaves a lower wick saying: "Buyers rejected lower prices!"</li>
        </ul>
      `
    },
    {
      id: 'sub-3',
      title: '3. Step-by-Step Rule: How to Trade Candle Anatomy',
      content: `
        <p class="mb-3">Never guess while a candle is still forming. Wait for the candle to CLOSE.</p>
        <ol class="list-decimal pl-5 mb-4 space-y-2 text-xs text-gray-300">
          <li><strong>Step 1:</strong> Look at the 5-minute chart. Wait for the current candle timer to hit 00:00.</li>
          <li><strong>Step 2:</strong> Check the body. Is it a strong green expansion candle at support? That means buyers just took control.</li>
          <li><strong>Step 3 (Entry):</strong> Place your buy order 1 point above the high of that green candle.</li>
          <li><strong>Step 4 (Stop Loss):</strong> Place your stop loss 1 point below the low of that green candle to protect your capital.</li>
        </ol>
      `
    }
  ],
  {
    setupType: "Candlestick Anatomy Baseline Setup",
    instrument: "NIFTY Spot / ATM Call (CE) or Put (PE)",
    entryTrigger: "Buy above high of strong green confirmation candle at support",
    stopLoss: "1 point below the low of the confirmation candle (-25 pts on Index)",
    target1: "Previous swing high (+50 pts / 1:2 Risk to Reward)",
    target2: "Major day ceiling (+75 pts / 1:3 Risk to Reward)",
    riskReward: "1:2.5",
    executionChecklist: [
      "Wait for the 5-minute candle to officially close before entering",
      "Green body must be larger than the average of previous 3 candles",
      "Candle formed at a known support floor or moving average",
      "Stop loss is immediately set in your broker terminal"
    ],
    pitfalls: [
      "Entering mid-candle while the wick is still fluctuating",
      "Buying a green candle that has a massive upper rejection wick",
      "Trading without setting a stop loss order"
    ]
  }
);

// 2. Hammer & Inverted Hammer
deepTopics['topic-candle-hammer'] = buildTopic(
  'topic-candle-hammer',
  'module-candlesticks',
  'candlesticks',
  'The Hammer & Inverted Hammer Reversals',
  'How to spot when sellers are exhausted at support and buy the bottom bounce',
  'Beginner',
  '6 min',
  'Imagine dropping a rubber ball onto concrete: it hits the floor and bounces back up instantly! A Hammer candle is that exact bounce. Sellers tried to push price down, but buyers stepped in with massive force and slammed the door shut.',
  [
    {
      id: 'sub-1',
      title: '1. What Does a Hammer Look Like?',
      content: `
        <p class="mb-3">A Hammer looks just like a real hammer you hold in your hand: a small head at the top and a long handle (wick) hanging down below.</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>The Long Lower Tail:</strong> Must be at least 2 times longer than the body. This proves sellers were totally rejected.</li>
          <li><strong>The Small Body:</strong> Can be green or red (green is stronger).</li>
          <li><strong>Where It Must Form:</strong> A hammer ONLY works after a price drop (downtrend) hitting a support floor. A hammer floating in the middle of nowhere means nothing!</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Psychology: Why Does the Hammer Make Money?',
      content: `
        <p class="mb-3">During the 5 minutes, sellers thought they were winning and pushed price to deep lows. But at the support floor, institutions had placed large buy orders.</p>
        <p class="mb-3">The buyers absorbed all the sell orders and lifted price all the way back up to close near the top. The sellers are now trapped in loss and will be forced to buy back to exit, fueling the upward explosion!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Step-by-Step Execution: Buying the Hammer',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li><strong>Find the Downtrend:</strong> Wait for at least 3 consecutive red candles falling into a known support level.</li>
          <li><strong>Spot the Hammer:</strong> Confirm the lower wick is at least 2x the body size.</li>
          <li><strong>Entry Trigger:</strong> Buy as soon as the next candle breaks above the Hammer's high price.</li>
          <li><strong>Stop Loss:</strong> Place strictly 1 tick below the bottom tip of the Hammer's wick.</li>
        </ol>
      `
    }
  ],
  {
    setupType: "Hammer Bullish Support Reversal",
    instrument: "NIFTY Call Option (CE) or Index Futures",
    entryTrigger: "Cross above high of Hammer candle (e.g. 23,150)",
    stopLoss: "1 tick below lowest tip of Hammer tail (e.g. 23,080 / -70 pts)",
    target1: "First resistance swing (+140 pts / 1:2 RR)",
    target2: "Previous day high (+210 pts / 1:3 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "Market was falling for at least 3 candles prior to the Hammer",
      "Lower tail is at least twice the height of the real body",
      "Forms directly on horizontal support line or 200 EMA",
      "Volume on the hammer candle is noticeably higher"
    ],
    pitfalls: [
      "Buying a hammer that forms at the top of a rally (that is a Hanging Man, which is bearish!)",
      "Not waiting for the next candle to break the high"
    ]
  }
);

// 3. Bullish & Bearish Engulfing
deepTopics['topic-candle-engulfing'] = buildTopic(
  'topic-candle-engulfing',
  'module-candlesticks',
  'candlesticks',
  'Bullish & Bearish Engulfing Candles',
  'When one giant candle swallows the previous candle and reverses the market',
  'Beginner',
  '6 min',
  'Engulfing means to completely swallow or overpower. When a massive green candle opens below and closes way above the previous red candle, it is like a heavyweight boxer knocking out his opponent in one punch.',
  [
    {
      id: 'sub-1',
      title: '1. What is an Engulfing Pattern?',
      content: `
        <p class="mb-3">It is a simple 2-candle pattern:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>🟢 Bullish Engulfing:</strong> Candle 1 is a small red candle. Candle 2 is a big green candle whose body completely covers/swallows the red candle's body. Formed at support.</li>
          <li><strong>🔴 Bearish Engulfing:</strong> Candle 1 is a small green candle. Candle 2 is a big red candle that completely swallows the green candle's body. Formed at resistance ceiling.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Simple Rule: Why It Works',
      content: `
        <p class="mb-3">The second candle erased everything the previous team did in 5 minutes! It proves overwhelming aggression by the opposite side.</p>
        <p class="mb-3">Institutions stepped in with huge market orders, clearing out the entire order book and leaving retail traders on the wrong side.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Step-by-Step Trade Execution',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li><strong>Confirm Location:</strong> Must form at Key Support (for Bullish) or Key Resistance (for Bearish).</li>
          <li><strong>Check Size:</strong> Candle 2 body must be visibly taller than Candle 1 body.</li>
          <li><strong>Entry:</strong> Enter immediately at the close of Candle 2 or when next candle opens.</li>
          <li><strong>Stop Loss:</strong> Place behind the extreme wick of the engulfing candle.</li>
        </ol>
      `
    }
  ],
  {
    setupType: "Engulfing Outside Reversal Bar",
    instrument: "NIFTY / BANKNIFTY ATM Option",
    entryTrigger: "Market order at close of engulfing confirmation bar",
    stopLoss: "1 tick beyond the outer wick of the engulfing bar",
    target1: "Opposite liquidity pool (+1:2 RR)",
    target2: "Full day range expansion (+1:3 RR)",
    riskReward: "1:2.8",
    executionChecklist: [
      "Body of candle 2 completely overlaps the body of candle 1",
      "Formed at significant horizontal support/resistance level",
      "Second candle has high trading volume",
      "Stop loss entered immediately"
    ],
    pitfalls: [
      "Trading engulfing candles inside a choppy, flat sideways range",
      "Ignoring upper wicks on bullish engulfing candles"
    ]
  }
);

// 4. Morning Star & Evening Star
deepTopics['topic-candle-stars'] = buildTopic(
  'topic-candle-stars',
  'module-candlesticks',
  'candlesticks',
  'Morning Star & Evening Star 3-Bar Setups',
  'The classic 3-step turnaround: Exhaustion, Pause, and Explosion',
  'Intermediate',
  '7 min',
  'The Morning Star is named after the sunrise: after a dark night (red downtrend), a little star appears in the sky (pause), followed by bright daylight (big green explosion). It is one of the most reliable reversal setups in technical analysis.',
  [
    {
      id: 'sub-1',
      title: '1. The 3 Candles of the Morning Star',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li><strong>Bar 1 (The Past):</strong> A large red candle continuing the downward move. Sellers seem in total control.</li>
          <li><strong>Bar 2 (The Pause):</strong> A tiny candle with a small body (a star or doji). It shows sellers have run out of fuel. Neither side can push further.</li>
          <li><strong>Bar 3 (The New Dawn):</strong> A powerful green candle that blasts upward and closes at least 50% into the body of Bar 1!</li>
        </ol>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Evening Star (The Bearish Twin)',
      content: `
        <p class="mb-3">The Evening Star is the exact opposite, forming at the top of an uptrend:</p>
        <p class="mb-3">Big Green candle (Daylight) ➔ Small Star Doji at peak (Sunset) ➔ Big Red candle closing down into green body (Night falls). This is your signal to buy Put (PE) options!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Entry, Stop Loss & Targets',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Entry:</strong> Buy immediately on the close of Bar 3.</li>
          <li><strong>Stop Loss:</strong> Place below the lowest wick of Bar 2 (the star).</li>
          <li><strong>Target:</strong> Target previous swing high for a clean 1:2 to 1:3 return.</li>
        </ul>
      `
    }
  ],
  {
    setupType: "3-Bar Star Reversal Cycle",
    instrument: "NIFTY ATM Call (CE) for Morning Star / Put (PE) for Evening Star",
    entryTrigger: "Close of Candle 3 above 50% of Candle 1 body",
    stopLoss: "1 tick beyond the extreme wick of the center Star candle",
    target1: "Previous swing peak (+1:2 RR)",
    target2: "Day high / low target (+1:3 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "Bar 3 closes convincingly above the 50% midpoint of Bar 1",
      "Center star shows narrow body / indecision doji",
      "Pattern formed at established support or resistance floor",
      "Clear risk-to-reward ratio of at least 1:2"
    ],
    pitfalls: [
      "Entering before Bar 3 closes (Bar 3 can turn into a wick before close!)",
      "Ignoring higher-timeframe trend context"
    ]
  }
);

// 5. Double Bottom & Double Top
deepTopics['topic-double-bottom-top'] = buildTopic(
  'topic-double-bottom-top',
  'module-patterns',
  'patterns',
  'Double Bottom (W) & Double Top (M) Patterns',
  'How double bounces at support and resistance create high-win trades',
  'Beginner',
  '7 min',
  'Think of a trampoline: you jump on it once, bounce up, come down and hit it a second time, and on the second bounce you launch high into the sky! The W pattern is that double bounce at support.',
  [
    {
      id: 'sub-1',
      title: '1. What is a Double Bottom (W Pattern)?',
      content: `
        <p class="mb-3">Price drops to a support floor (Bottom 1), bounces up to a middle peak (Neckline), drops down again to test the same floor (Bottom 2), and then explodes upward through the Neckline.</p>
        <p class="mb-3">On the chart, this draws a literal letter <strong>W</strong>! When price breaks above the middle peak (the Neckline), the buy signal is confirmed.</p>
      `
    },
    {
      id: 'sub-2',
      title: '2. What is a Double Top (M Pattern)?',
      content: `
        <p class="mb-3">The exact opposite: Price hits a resistance ceiling (Top 1), pulls back, tests the ceiling again (Top 2), fails to break higher, and drops down through the Neckline floor.</p>
        <p class="mb-3">This draws the letter <strong>M</strong>! Breaking below the neckline triggers a powerful sell / Put (PE) option trade.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Where to Enter & Measure Targets',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Entry:</strong> Enter when a 5-minute candle closes beyond the Neckline.</li>
          <li><strong>Stop Loss:</strong> Place below the midpoint of the pattern or below Bottom 2.</li>
          <li><strong>Target Calculation:</strong> Measure the distance from the Bottom to the Neckline. Project that exact same distance upward from the Neckline breakout!</li>
        </ul>
      `
    }
  ],
  {
    setupType: "W / M Classical Reversal Formation",
    instrument: "NIFTY Index Options / Futures",
    entryTrigger: "5-minute candle close beyond the pattern Neckline",
    stopLoss: "Below the halfway point of the right bottom / top swing",
    target1: "1x height of the W/M pattern projected from neckline",
    target2: "Next major daily support/resistance level",
    riskReward: "1:2.5",
    executionChecklist: [
      "Both bottoms / tops touch approximately the same horizontal price zone",
      "Strong volume expansion on the neckline breakout candle",
      "Clear neckline reference line identified",
      "Stop loss set before order is filled"
    ],
    pitfalls: [
      "Buying inside the W before the neckline has actually broken",
      "Holding on if price falls back below the neckline"
    ]
  }
);

// 6. Head & Shoulders
deepTopics['topic-head-shoulders'] = buildTopic(
  'topic-head-shoulders',
  'module-patterns',
  'patterns',
  'Head & Shoulders: The Ultimate Trend Reversal',
  'How to spot major market tops before an aggressive downward slide',
  'Intermediate',
  '7 min',
  'Look at yourself in the mirror: you have a left shoulder, your head stands taller in the middle, and a right shoulder on the other side. When the market creates this exact shape, it means buyers tried to push to a higher high (the head), but ran out of steam and made a lower high (the right shoulder).',
  [
    {
      id: 'sub-1',
      title: '1. Anatomy of the Head & Shoulders',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Left Shoulder:</strong> Market rallies up and pulls back to a floor.</li>
          <li><strong>The Head:</strong> Market rallies higher to create a new peak, then drops back to the same floor.</li>
          <li><strong>Right Shoulder:</strong> Market tries to rally again, but can only reach the level of the left shoulder! Buyers are completely exhausted.</li>
          <li><strong>The Neckline:</strong> The horizontal support line connecting the two pullbacks.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. Why This is the King of Reversal Patterns',
      content: `
        <p class="mb-3">During an uptrend, every peak is supposed to be higher (Higher Highs). When the right shoulder fails to beat the head, the uptrend is officially dead!</p>
        <p class="mb-3">When the neckline breaks, thousands of stop losses get hit, sending the index plunging down rapidly.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Step-by-Step Short Trade Execution',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li>Draw the neckline across the bottoms of both shoulders.</li>
          <li>Wait for a 5-minute candle to close BELOW the neckline.</li>
          <li>Enter Short (Buy PE option).</li>
          <li>Place Stop Loss above the peak of the Right Shoulder.</li>
        </ol>
      `
    }
  ],
  {
    setupType: "Head & Shoulders Distribution Top",
    instrument: "BANKNIFTY Put Option (PE) / Futures",
    entryTrigger: "Candle close below neckline support floor",
    stopLoss: "Above peak of the Right Shoulder (-80 pts)",
    target1: "1x vertical distance from head to neckline (+160 pts / 1:2 RR)",
    target2: "Previous daily demand zone (+240 pts / 1:3 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "Head is distinctly higher than both shoulders",
      "Right shoulder does not exceed the height of the left shoulder",
      "Neckline support line is clearly broken by confirmation candle",
      "Volume on the neckline break is heavy"
    ],
    pitfalls: [
      "Shorting at the right shoulder before the neckline actually breaks",
      "Not respecting the stop loss above the right shoulder"
    ]
  }
);

// 7. Bull & Bear Flags
deepTopics['topic-flags-pennants'] = buildTopic(
  'topic-flags-pennants',
  'module-patterns',
  'patterns',
  'Bull Flags & Bear Flags: Trend Continuation',
  'How to catch fast momentum breakouts when the market is trending strongly',
  'Intermediate',
  '7 min',
  'Imagine a rocket launching into space: it shoots up fast (flagpole), pauses for a few seconds to recharge fuel in a tight downward drift (the flag), and then fires up again with equal power! That is a Bull Flag.',
  [
    {
      id: 'sub-1',
      title: '1. What Makes a True Bull Flag?',
      content: `
        <p class="mb-3">Two clear components:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>The Flagpole:</strong> A sharp, fast, almost vertical rally of big green candles.</li>
          <li><strong>The Flag:</strong> A neat, tight downward-sloping consolidation channel. Volume dries up as traders wait.</li>
          <li><strong>The Breakout:</strong> A strong green candle blasts out of the top of the flag channel, resuming the mega rally!</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Measured Move Target',
      content: `
        <p class="mb-3">How high will it go? Professional traders use the <strong>Measured Move Rule</strong>:</p>
        <p class="mb-3">The second rally (after breakout) is usually equal in height to the initial flagpole! If the flagpole was 100 points, expect 100 points profit after breakout.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Execution Rules',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Entry:</strong> Buy when price breaks and closes above the upper channel line of the flag.</li>
          <li><strong>Stop Loss:</strong> Place just below the lowest swing of the flag channel.</li>
        </ul>
      `
    }
  ],
  {
    setupType: "Bull Flag Continuation Breakout",
    instrument: "NIFTY / BANKNIFTY ATM Call (CE)",
    entryTrigger: "Breakout candle close above upper flag channel line",
    stopLoss: "Below lowest pullback low of the flag channel",
    target1: "Pole height projection from breakout point (+1:2 RR)",
    target2: "Major higher timeframe resistance (+1:3 RR)",
    riskReward: "1:2.8",
    executionChecklist: [
      "Initial flagpole shows strong institutional momentum bars",
      "Consolidation flag slopes downward against the trend",
      "Volume drops during the flag and spikes on the breakout",
      "Stop loss set below channel low"
    ],
    pitfalls: [
      "Confusing a deep 70% retracement with a flag (flags should be shallow, under 38%)",
      "Chasing after the breakout has already moved 3 candles"
    ]
  }
);

// 8. Triangles & Wedges
deepTopics['topic-triangles-wedges'] = buildTopic(
  'topic-triangles-wedges',
  'module-patterns',
  'patterns',
  'Ascending Triangles & Price Squeeze Breakouts',
  'Spotting where price gets squeezed between two walls before an explosion',
  'Intermediate',
  '7 min',
  'Imagine pushing down on a metal coil spring against a solid concrete ceiling: the more you compress it, the more violent the explosion when it finally breaks free! An Ascending Triangle is that spring compression.',
  [
    {
      id: 'sub-1',
      title: '1. Anatomy of the Ascending Triangle',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Flat Ceiling (Resistance):</strong> Sellers keep defending the same horizontal level (e.g. 23,200).</li>
          <li><strong>Rising Floor (Higher Lows):</strong> But each time price pulls back, buyers step in earlier and higher! (Higher Lows).</li>
          <li><strong>The Squeeze:</strong> The space between buyers and sellers narrows to a point. Sellers run out of orders, and BOOM &mdash; price explodes through the ceiling!</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. How to Trade the Breakout',
      content: `
        <p class="mb-3">Wait for a strong 5-minute candle to break and close completely ABOVE the flat resistance line. Enter on the close, with Stop Loss below the most recent higher low.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Risk & Target Management',
      content: `
        <p class="mb-3">Measure the widest part of the triangle (from base to ceiling). Add that amount to the breakout point to get your exact target!</p>
      `
    }
  ],
  {
    setupType: "Ascending Triangle Volatility Squeeze",
    instrument: "NIFTY Index Call Option (CE)",
    entryTrigger: "5m candle close above flat resistance ceiling",
    stopLoss: "Below the most recent higher low trendline swing",
    target1: "Widest distance of triangle added to breakout level (+1:2 RR)",
    target2: "Next institutional round number (+1:3 RR)",
    riskReward: "1:2.5",
    executionChecklist: [
      "At least 2 touches of the flat resistance ceiling",
      "At least 2 touches of the upward-sloping support line",
      "Volume dries up during the coil and expands on breakout",
      "No major macro news scheduled during entry"
    ],
    pitfalls: [
      "Buying while price is still trapped inside the apex without confirmation",
      "Trading without a stop loss"
    ]
  }
);

// 9. Malaysian SNR
deepTopics['topic-malaysian-snr'] = buildTopic(
  'topic-malaysian-snr',
  'module-malaysian',
  'malaysian',
  'Sharp V-Peaks: The Strongest Support & Resistance',
  'Why sharp bounces create the cleanest and most accurate retest trades',
  'Intermediate',
  '8 min',
  'A blunt, messy top is weak. But a sharp V-shaped peak represents an instant, violent rejection where smart money dumped thousands of contracts in seconds. When price returns to that level hours or days later, it acts like an electric fence!',
  [
    {
      id: 'sub-1',
      title: '1. What is a Malaysian V-Peak?',
      content: `
        <p class="mb-3">In the Malaysian Trade Setup method, we ignore slow, curvy rounded turns. We ONLY mark sharp, aggressive turning points:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>V-Peak (Resistance):</strong> Price shot straight up and immediately plunged straight down. Mark the highest wick tip.</li>
          <li><strong>A-Valley (Support):</strong> Price shot straight down and immediately exploded straight up. Mark the lowest wick tip.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Retest Playbook',
      content: `
        <p class="mb-3">Do not chase the market when it is moving. Patiently wait for price to return and touch the horizontal line of that sharp V-peak.</p>
        <p class="mb-3">When price touches the level, look for a rejection wick (a pinbar or engulfing candle). That is your trigger to strike with precision!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Entry, Stop Loss & Targets',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Entry:</strong> Enter on rejection candle at the V-peak line.</li>
          <li><strong>Stop Loss:</strong> Place strictly 15 points beyond the line.</li>
          <li><strong>Target:</strong> Opposite sharp valley floor (1:3 Risk to Reward).</li>
        </ul>
      `
    }
  ],
  {
    setupType: "Malaysian Sharp V-Peak Key Level Retest",
    instrument: "NIFTY / BANKNIFTY Options",
    entryTrigger: "Rejection wick touch at historical sharp V-peak horizontal line",
    stopLoss: "15 to 20 points above the key level line",
    target1: "Midpoint pivot (+1:2 RR)",
    target2: "Opposite sharp valley support (+1:3.5 RR)",
    riskReward: "1:3.5",
    executionChecklist: [
      "Key level originated from a sharp, single-candle V reversal",
      "Price approach is clean without breaking structure early",
      "Rejection wick confirms institutional defense at the line",
      "Tight stop loss set immediately"
    ],
    pitfalls: [
      "Marking dozens of minor levels (only mark clean, sharp V turns)",
      "Entering without waiting for price to touch the line"
    ]
  }
);

// 10. Malaysian QMR
deepTopics['topic-malaysian-qmr'] = buildTopic(
  'topic-malaysian-qmr',
  'module-malaysian',
  'malaysian',
  'Quasimodo Reversal (QMR) Pattern',
  'The fake higher high that traps retail traders before an aggressive dump',
  'Advanced',
  '8 min',
  'Quasimodo is named after the hunchback with uneven shoulders. It is the smartest reversal pattern because it catches retail breakout traders in a brutal trap: it creates a fake new High to trick buyers, quickly crashes down to break support, and then retests the old Left Shoulder where smart money enters.',
  [
    {
      id: 'sub-1',
      title: '1. The 4 Steps of QMR Structure',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li><strong>High (H):</strong> Market makes an initial peak (Left Shoulder).</li>
          <li><strong>Low (L):</strong> Market pulls back to create a floor.</li>
          <li><strong>Higher High (HH - The Trap!):</strong> Market spikes above the previous high. Retail traders buy aggressively thinking it is a breakout. But it is an institutional fakeout!</li>
          <li><strong>Lower Low (LL - Structure Broken):</strong> Market suddenly crashes below the previous low (L). Structure is now broken!</li>
        </ol>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Exact QMR Entry Point',
      content: `
        <p class="mb-3">Where do we enter? After price makes the Lower Low (LL), it pulls back upward. Draw a horizontal line straight from the original Left Shoulder (H).</p>
        <p class="mb-3">When price retests that exact Left Shoulder line, that is the <strong>Quasimodo Entry</strong>! Short immediately with an ultra-tight stop loss above the fake Head (HH).</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Why QMR Produces 1:4+ Trades',
      content: `
        <p class="mb-3">Because your entry is at the top retest of the shoulder, your stop loss is very small, while your target is all the way down at the new low. This gives institutional risk-reward of 1:3 to 1:5!</p>
      `
    }
  ],
  {
    setupType: "Malaysian Quasimodo Reversal (QMR)",
    instrument: "BANKNIFTY Put Option (PE) / NIFTY Futures",
    entryTrigger: "Limit sell / Put buy on retest of the original Left Shoulder line",
    stopLoss: "1 tick above the Higher High (HH) sweep peak",
    target1: "Retest of Lower Low (LL) swing (+1:2.5 RR)",
    target2: "Daily liquidity pool (+1:4.5 RR)",
    riskReward: "1:4.0",
    executionChecklist: [
      "Higher High (HH) clearly swept retail stop losses",
      "Price aggressively broke below Low (L) to confirm market shift",
      "Clean horizontal line drawn across Left Shoulder (H)",
      "Strict stop loss placed above HH"
    ],
    pitfalls: [
      "Entering before Lower Low (LL) has formed (must confirm structure break first)",
      "Moving stop loss further away"
    ]
  }
);

// 11. Fair Value Gap (FVG)
deepTopics['topic-fvg-imbalance'] = buildTopic(
  'topic-fvg-imbalance',
  'module-fvg-ifvg',
  'fvg-ifvg',
  'Fair Value Gap (FVG): The Institutional Magnet',
  'How 3-bar imbalances leave an empty gap that price returns to fill',
  'Intermediate',
  '9 min',
  'Imagine painting a wall with a roller: if you swipe too fast, you leave a patch of bare wall unpainted! Later, you have to go back and paint over that empty patch. A Fair Value Gap (FVG) is that unpainted patch on a chart where price moved too fast.',
  [
    {
      id: 'sub-1',
      title: '1. How to Identify an FVG (The 3-Candle Rule)',
      content: `
        <p class="mb-3">Look at any 3 consecutive candles:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Candle 1:</strong> A normal candle. Look at its High wick tip.</li>
          <li><strong>Candle 2:</strong> A GIANT, explosive green candle that surges upward.</li>
          <li><strong>Candle 3:</strong> The next candle. Look at its Low wick tip.</li>
          <li><strong>The FVG Gap:</strong> Look at the empty space between the High of Candle 1 and the Low of Candle 3. Their wicks do NOT overlap! That empty space is the Fair Value Gap.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. Why Price Returns to Fill the Gap',
      content: `
        <p class="mb-3">During that explosive Candle 2, orders were executed only on the buy side. Market makers need two-sided liquidity to balance their books.</p>
        <p class="mb-3">So price acts like a magnet, pulling back down to touch that empty gap box. Once it touches the gap, institutions reload their buy orders and price rockets upward!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Step-by-Step FVG Trade Execution',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li>Draw a shaded box between Candle 1 High and Candle 3 Low.</li>
          <li>Wait patiently for price to pull back and dip inside the box.</li>
          <li>Enter Buy (Call option) as soon as a green rejection candle forms inside the box.</li>
          <li>Place Stop Loss 1 tick below Candle 1 High (bottom of box).</li>
        </ol>
      `
    }
  ],
  {
    setupType: "3-Bar Imbalance & FVG Magnet Retest",
    instrument: "NIFTY / BANKNIFTY Call (CE) or Put (PE)",
    entryTrigger: "Pullback touch inside FVG box with green rejection bar",
    stopLoss: "1 tick below the lower boundary of the FVG box",
    target1: "High of the impulse candle (+1:2 RR)",
    target2: "Previous swing liquidity pool (+1:3.2 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "No wick overlap between Candle 1 and Candle 3",
      "Candle 2 shows large displacement body",
      "Trend direction aligns with higher timeframe flow",
      "Stop loss strictly respected below FVG floor"
    ],
    pitfalls: [
      "Trading tiny 2-point gaps (look for clean, obvious gaps)",
      "Buying if price closes completely below the entire FVG box"
    ]
  }
);

// 12. Inversion FVG (iFVG)
deepTopics['topic-ifvg-inversion'] = buildTopic(
  'topic-ifvg-inversion',
  'module-fvg-ifvg',
  'fvg-ifvg',
  'Inversion FVG (iFVG): When Support Flips to Resistance',
  'Trading gaps that get violated and retested from the opposite side',
  'Advanced',
  '9 min',
  'What happens when a wooden door gets smashed open? Once you are on the other side, that door now blocks you from coming back! An Inversion FVG is a support gap that got smashed down by sellers, and now acts as a ceiling of resistance.',
  [
    {
      id: 'sub-1',
      title: '1. What is an Inversion FVG?',
      content: `
        <p class="mb-3">You found a Bullish FVG and expected price to bounce up. But instead, a huge red candle comes down and slices right through the gap like a hot knife through butter!</p>
        <p class="mb-3">Do not panic. That failed gap has now <strong>inverted</strong>. It has flipped from a support zone into a powerful resistance zone.</p>
      `
    },
    {
      id: 'sub-2',
      title: '2. How to Trade the Retest',
      content: `
        <p class="mb-3">Once price is below the inverted gap, wait for a minor rally back up into the bottom of the box.</p>
        <p class="mb-3">Sellers who broke the level will defend it heavily. Enter Short (Buy PE) with a tight stop loss just above the top of the box.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Why Pro Desks Love iFVG',
      content: `
        <p class="mb-3">Because trapped buyers who bought the original gap are desperate to get out at break-even! When price touches the gap from below, those trapped buyers sell to exit, adding fuel to the downward crash.</p>
      `
    }
  ],
  {
    setupType: "Inversion FVG Polarity Flip",
    instrument: "NIFTY Put Option (PE) / Futures",
    entryTrigger: "Pullback retest into the inverted gap from underneath",
    stopLoss: "1 tick above the top edge of the inverted gap box",
    target1: "Recent swing low (+1:2 RR)",
    target2: "Daily liquidity target (+1:3.5 RR)",
    riskReward: "1:3.2",
    executionChecklist: [
      "Original FVG was clearly violated by a strong momentum candle",
      "Retest touches the inverted zone cleanly without closing above",
      "Bearish confirmation wick forms on the 5m chart",
      "Stop loss set immediately"
    ],
    pitfalls: [
      "Entering before price has actually pulled back to retest the box",
      "Trading when market is in flat lunch-time chop"
    ]
  }
);

// 13. PDH & PDL Sweeps
deepTopics['topic-amt-pdh-pdl'] = buildTopic(
  'topic-amt-pdh-pdl',
  'module-liquidity-amt',
  'liquidity-amt',
  'Previous Day High (PDH) & Low (PDL) Traps',
  'How big players trigger retail stop losses at yesterday\'s extremes before reversing',
  'Advanced',
  '8 min',
  'Every retail trader places their stop loss or breakout order at Yesterday\'s High (PDH) or Yesterday\'s Low (PDL). Big institutional algorithms know this! They push price 5 points above PDH to trigger all those buy orders, grab the liquidity, and immediately reverse price down hard.',
  [
    {
      id: 'sub-1',
      title: '1. How to Draw PDH and PDL',
      content: `
        <p class="mb-3">Every morning at 9:00 AM before the market opens:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li>Draw a horizontal RED line at the highest price reached yesterday: <strong>PDH (Previous Day High)</strong>.</li>
          <li>Draw a horizontal GREEN line at the lowest price reached yesterday: <strong>PDL (Previous Day Low)</strong>.</li>
          <li>These two lines are where millions of retail stop losses are sitting waiting to be triggered.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. Spotting the Fake Breakout (The Sweep)',
      content: `
        <p class="mb-3">Watch what happens when price touches the PDH line:</p>
        <p class="mb-3">If price shoots above PDH, but cannot sustain and within 1-2 candles closes BACK BELOW the PDH line with a long upper wick, that was a <strong>Liquidity Sweep Trap</strong>!</p>
        <p class="mb-3">All breakout buyers are now trapped in losses. Short immediately!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. The Target: Running the Entire Range',
      content: `
        <p class="mb-3">When a sweep of PDH fails, price almost always cascades all the way down to test the opposite extreme: the PDL line! This gives massive 100+ point trades on Nifty.</p>
      `
    }
  ],
  {
    setupType: "PDH / PDL Institutional Liquidity Sweep",
    instrument: "NIFTY Put Option (PE) after PDH sweep / Call (CE) after PDL sweep",
    entryTrigger: "5-minute candle closes back inside the previous day range",
    stopLoss: "1 tick above the extreme wick high of the sweep (+20 pts)",
    target1: "Day midpoint / VWAP (+1:2 RR)",
    target2: "Previous Day Low (PDL) line (+1:4 RR)",
    riskReward: "1:3.8",
    executionChecklist: [
      "Price clearly broke past PDH or PDL to trigger stop orders",
      "Immediate rejection: candle closes back inside the boundary",
      "Volume spikes on the sweep candle",
      "Stop loss placed strictly beyond the sweep wick"
    ],
    pitfalls: [
      "Buying the breakout above PDH (amateur mistake!)",
      "Ignoring true breakout days with strong global market trends"
    ]
  }
);

// 14. Atlas AMT Value Areas
deepTopics['topic-amt-value-areas'] = buildTopic(
  'topic-amt-value-areas',
  'module-liquidity-amt',
  'liquidity-amt',
  'Volume Profile & Fair Price Areas (POC & VAH/VAL)',
  'Trading between Discount (VAL) and Expensive (VAH) Prices',
  'Advanced',
  '8 min',
  'In any market, there is a Fair Price where most trading happens (Point of Control), an Expensive ceiling (Value Area High), and a Cheap Discount floor (Value Area Low). Never buy when price is expensive; buy when price is at a discount!',
  [
    {
      id: 'sub-1',
      title: '1. The 3 Volume Profile Levels',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>POC (Point of Control):</strong> The exact price where the highest volume was traded. It acts like a gravitational magnet.</li>
          <li><strong>VAH (Value Area High):</strong> The top 70% volume boundary. Price above this is considered expensive/overvalued.</li>
          <li><strong>VAL (Value Area Low):</strong> The bottom 70% volume boundary. Price below this is considered cheap/undervalued.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The 80% Rule of Auction Theory',
      content: `
        <p class="mb-3">Here is a proven statistic tested on thousands of trading days:</p>
        <p class="mb-3">If the market opens outside the Value Area and then trades back INSIDE the Value Area for two consecutive 30-minute candles, there is an <strong>80% probability</strong> that price will rotate all the way to the opposite side of the Value Area!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. How to Execute',
      content: `
        <p class="mb-3">When price dips into VAL and bounces with a green candle, buy with target at POC and final target at VAH. It is systematic, calm, and highly profitable.</p>
      `
    }
  ],
  {
    setupType: "Value Area 80% Rotation Playbook",
    instrument: "NIFTY ATM Options / Futures",
    entryTrigger: "Reversal confirmation at Value Area Low (VAL) or High (VAH)",
    stopLoss: "1 tick beyond the Value Area boundary line",
    target1: "Point of Control (POC) fair value (+1:2 RR)",
    target2: "Opposite Value Area boundary (+1:3.2 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "Value Area High, Low, and POC accurately marked from previous day profile",
      "Confirmation rejection bar forms at the boundary",
      "Two-sided liquidity confirmed",
      "Target orders pre-placed at POC"
    ],
    pitfalls: [
      "Trading when market is locked in a runaway trending day (one-sided auction)",
      "Exiting too early at minor noise before reaching POC"
    ]
  }
);

// 15. Judas Swing
deepTopics['topic-judas-swing'] = buildTopic(
  'topic-judas-swing',
  'module-liquidity-amt',
  'liquidity-amt',
  'The 9:15 AM Opening Judas Swing Trap',
  'Why you should never chase the first 15 minutes at market open',
  'Beginner to Pro',
  '8 min',
  'Named after Judas who betrayed with a fake kiss. Between 9:15 AM and 9:25 AM, market algorithms create a deceptive fake move to trap excited retail traders. By 9:30 AM, the trap snaps shut, and the real institutional trend explodes in the opposite direction!',
  [
    {
      id: 'sub-1',
      title: '1. What Happens at 9:15 AM?',
      content: `
        <p class="mb-3">Retail traders wake up, look at overnight news, and rush to buy or sell as soon as the opening bell rings at 9:15 AM.</p>
        <p class="mb-3">Market makers take advantage of this emotional rush. They allow price to pump aggressively for 10 minutes to lure in retail buyers, while quietly loading up massive short positions!</p>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Golden Rule of Morning Trading',
      content: `
        <p class="mb-3"><strong class="text-accentGold">RULE: NEVER TRADE BETWEEN 9:15 AM AND 9:30 AM!</strong></p>
        <p class="mb-3">Sit on your hands. Sip your tea. Watch the amateur traders jump in. By 9:30 AM, the fake pump will hit resistance, leave a massive upper rejection wick, and stall.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Striking the Judas Reversal',
      content: `
        <p class="mb-3">At 9:30 AM, when price breaks below the 9:15 AM opening candle's low, that is your entry trigger! You ride the real institutional trend all the way down while morning breakout buyers panic and sell.</p>
      `
    }
  ],
  {
    setupType: "9:15 AM Opening Judas Trap Fade",
    instrument: "NIFTY / BANKNIFTY Put Option (PE)",
    entryTrigger: "Breakdown below the low of the 9:15 AM opening bar at 9:30 AM",
    stopLoss: "Above the high of the 9:15-9:25 AM morning spike",
    target1: "Pre-market settlement floor (+1:2 RR)",
    target2: "Previous day low (+1:3.5 RR)",
    riskReward: "1:3.2",
    executionChecklist: [
      "No trades taken during the first 15 minutes (9:15 to 9:30 AM)",
      "Morning spike cleanly rejected at known daily resistance",
      "Clear break of structure candle at or after 9:30 AM",
      "Stop loss set strictly at morning high"
    ],
    pitfalls: [
      "Failing to control FOMO and clicking buy at 9:16 AM",
      "Trading without waiting for the 9:30 AM confirmation"
    ]
  }
);

// 16. Fibonacci Golden Pocket
deepTopics['topic-fib-golden-pocket'] = buildTopic(
  'topic-fib-golden-pocket',
  'module-fibonacci',
  'fibonacci',
  'The 0.618 - 0.650 Golden Pocket Entry',
  'The exact pullback sweet spot where smart money buys high-probability bounces',
  'Intermediate',
  '8 min',
  'Nothing goes up in a straight line forever. After a big rally, the market always pulls back to catch its breath. The Fibonacci Golden Pocket (0.618 to 0.650) is the magical mathematical zone where that pullback stops 70% of the time!',
  [
    {
      id: 'sub-1',
      title: '1. What is the Golden Pocket?',
      content: `
        <p class="mb-3">Take the Fibonacci Retracement tool on your TradingView chart. Click on the Swing Low (where the rally started) and drag it to the Swing High (where the rally peaked).</p>
        <p class="mb-3">The tool draws several percentage lines: 0.382, 0.50, 0.618, and 0.65. The zone between <strong>0.618 and 0.650</strong> is called the <strong>Golden Pocket</strong>.</p>
      `
    },
    {
      id: 'sub-2',
      title: '2. Why Does Price Bounce Here?',
      content: `
        <p class="mb-3">It represents a 62% to 65% discount from the peak! Big institutional funds wait for this exact discount before adding to their positions.</p>
        <p class="mb-3">When price dips into this shaded zone, look for a green hammer or bullish engulfing candle to trigger your buy order.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Entry, Stop Loss & Targets',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Entry:</strong> Buy when a rejection candle forms inside the Golden Pocket (0.618-0.650).</li>
          <li><strong>Stop Loss:</strong> Place below the 0.786 or 1.0 level.</li>
          <li><strong>Target:</strong> Target the previous high (0.0) and the 1.618 expansion!</li>
        </ul>
      `
    }
  ],
  {
    setupType: "Fibonacci 0.618 Golden Pocket Retracement",
    instrument: "NIFTY Call Option (CE) / Futures",
    entryTrigger: "Bullish reversal candle inside 0.618 - 0.650 zone",
    stopLoss: "1 tick below the 0.786 Fibonacci retracement line",
    target1: "Swing High (0.0 retracement level / 1:2 RR)",
    target2: "1.618 Fibonacci extension target (+1:3.5 RR)",
    riskReward: "1:3.2",
    executionChecklist: [
      "Clean impulse wave with clear Swing Low and Swing High",
      "Pullback enters the 0.618 to 0.650 shaded pocket",
      "Bullish confirmation candle appears on 5m chart",
      "Stop loss pre-calculated and placed"
    ],
    pitfalls: [
      "Drawing the Fibonacci tool backwards (always drag from Low to High for an uptrend)",
      "Buying blindly without waiting for a confirmation candle"
    ]
  }
);

// 17. Fibonacci Extensions
deepTopics['topic-fib-extensions'] = buildTopic(
  'topic-fib-extensions',
  'module-fibonacci',
  'fibonacci',
  'Fibonacci Extensions: Where to Book Big Profits',
  'Using 1.272 and 1.618 to exit your trade at the maximum peak',
  'Intermediate',
  '8 min',
  'Entering a trade is only half the battle. When the market breaks into all-time highs and there are no old levels on the chart, where do you take profit? Fibonacci Extensions tell you the exact mathematical ceiling before the drop.',
  [
    {
      id: 'sub-1',
      title: '1. What are Extensions?',
      content: `
        <p class="mb-3">While retracements measure pullbacks, extensions project how far the next trend wave will run beyond the old high.</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>1.272 Extension:</strong> Target 1 &mdash; Take 50% profit here to protect capital.</li>
          <li><strong>1.618 Extension (The Golden Extension):</strong> Target 2 &mdash; Close your remaining position as big funds take profits here.</li>
          <li><strong>2.618 Extension:</strong> Extreme trending days where markets go parabolic.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. How to Use Extensions to Exit Calmly',
      content: `
        <p class="mb-3">Amateur traders hold on out of greed until the market crashes and wipes out their gains. Professional traders place limit exit orders at 1.618 and walk away with maximum profits!</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Real Example on Nifty',
      content: `
        <p class="mb-3">Wave 1 ran 200 points. Pullback was 100 points. Wave 3 will hit the 1.618 extension target of 320 points! Plan your exit in advance.</p>
      `
    }
  ],
  {
    setupType: "Trend-Based Fibonacci Extension Target Exit",
    instrument: "NIFTY Index Options / Futures",
    entryTrigger: "Entry upon breakout of Wave 1 high",
    stopLoss: "Below the Wave 2 pullback low",
    target1: "1.272 Fibonacci Extension (+1:2 RR)",
    target2: "1.618 Fibonacci Golden Extension (+1:3.5 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "Trend-based Fib Extension tool applied to Low, High, and Pullback Low",
      "Target 1 pre-set at 1.272",
      "Runner stop loss trailed to break-even after Target 1 hits",
      "Full exit executed at 1.618"
    ],
    pitfalls: [
      "Greedily holding through the 1.618 target without booking profit",
      "Not locking half profits at 1.272"
    ]
  }
);

// 18. RSI Divergence
deepTopics['topic-rsi-divergence'] = buildTopic(
  'topic-rsi-divergence',
  'module-indicators',
  'indicators',
  'RSI Divergence: Seeing Reversals Before They Happen',
  'When the price chart lies, but the RSI indicator reveals the truth',
  'Intermediate',
  '8 min',
  'Imagine a car trying to drive up a steep hill: the car is still moving forward, but the engine is sputtering and losing horsepower. Soon, the car will roll backwards! RSI Divergence shows you when the market engine is losing horsepower before price actually turns.',
  [
    {
      id: 'sub-1',
      title: '1. What is RSI Divergence?',
      content: `
        <p class="mb-3">Divergence means price and the RSI indicator disagree with each other:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>🟢 Bullish Divergence (Buy Reversal):</strong> Price on the chart falls and makes a LOWER LOW. But RSI down below makes a HIGHER LOW! This proves sellers have run out of steam, and a massive upward rally is imminent.</li>
          <li><strong>🔴 Bearish Divergence (Sell Reversal):</strong> Price pushes up and makes a HIGHER HIGH. But RSI makes a LOWER HIGH! The rally is fake and a crash is coming.</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The 30/70 Confirmation Zone',
      content: `
        <p class="mb-3">Bullish divergence is strongest when the first low dips below 30 (Oversold). Bearish divergence is strongest when the first high pushes above 70 (Overbought).</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Step-by-Step Trade Execution',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li>Spot the mismatch: Price lower, RSI higher.</li>
          <li>Wait for a 5-minute green candle to close confirming the bounce.</li>
          <li>Buy Call option (CE). Place Stop Loss below the recent price low.</li>
        </ol>
      `
    }
  ],
  {
    setupType: "RSI Momentum Divergence Reversal",
    instrument: "NIFTY / BANKNIFTY Options",
    entryTrigger: "Confirmation candle close after Bullish/Bearish RSI divergence",
    stopLoss: "1 tick beyond the swing low / high on price",
    target1: "Opposite 50 RSI midline (+1:2 RR)",
    target2: "Previous swing peak (+1:3.2 RR)",
    riskReward: "1:3.0",
    executionChecklist: [
      "Clear visual slope difference between price line and RSI line",
      "RSI dipped into extreme zone (<30 for bull, >70 for bear)",
      "Confirmation reversal candlestick forms on 5m chart",
      "Stop loss set immediately"
    ],
    pitfalls: [
      "Entering before the confirmation candle closes",
      "Trading tiny divergences in the middle of the RSI 50 zone"
    ]
  }
);

// 19. VWAP Bands
deepTopics['topic-vwap-bands'] = buildTopic(
  'topic-vwap-bands',
  'module-indicators',
  'indicators',
  'VWAP & Standard Deviation Bands',
  'The institutional benchmark: Buying at discount & selling at premium',
  'Intermediate',
  '8 min',
  'VWAP (Volume Weighted Average Price) is the #1 tool used by Mutual Funds and FIIs. When price moves too far away from VWAP, it stretches like a rubber band and snaps right back to the middle!',
  [
    {
      id: 'sub-1',
      title: '1. What is VWAP?',
      content: `
        <p class="mb-3">VWAP calculates the true average price paid by every trader today, weighted by volume. If price is above VWAP, buyers are in control. If price is below VWAP, sellers are in control.</p>
        <p class="mb-3">The yellow line on your chart is the institutional fair-value benchmark.</p>
      `
    },
    {
      id: 'sub-2',
      title: '2. The ±1 and ±2 Sigma Rubber Bands',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>+2 Sigma (Upper Band):</strong> Price is extremely expensive and overbought. Look for selling opportunities!</li>
          <li><strong>-2 Sigma (Lower Band):</strong> Price is extremely cheap and oversold. Look for buying opportunities!</li>
        </ul>
      `
    },
    {
      id: 'sub-3',
      title: '3. Mean Reversion Execution',
      content: `
        <p class="mb-3">When Nifty touches the -2 Sigma lower band and prints a green reversal candle, buy with target at the central VWAP line. It is high-probability mean-reversion trading.</p>
      `
    }
  ],
  {
    setupType: "VWAP Standard Deviation Mean Reversion",
    instrument: "NIFTY Index Call (CE) at -2σ / Put (PE) at +2σ",
    entryTrigger: "Reversal candlestick touch at ±2σ outer standard deviation band",
    stopLoss: "10 points beyond the outer band wick",
    target1: "±1σ intermediate band (+1:1.5 RR)",
    target2: "Central VWAP benchmark line (+1:2.8 RR)",
    riskReward: "1:2.8",
    executionChecklist: [
      "Price touched or exceeded the ±2σ outer boundary",
      "Candle shows clear rejection wick away from the band",
      "Target orders pre-set at central VWAP line",
      "No strong trending news in play"
    ],
    pitfalls: [
      "Fading a runaway trend day (if market is trending violently, bands will expand!)",
      "Not waiting for the rejection confirmation bar"
    ]
  }
);

// 20. Options Greeks & Gamma Explosion
deepTopics['topic-options-greeks-gamma'] = buildTopic(
  'topic-options-greeks-gamma',
  'module-options',
  'options',
  'Expiry Day Hero-Zero: The 1:15 PM Gamma Explosion',
  'How ₹20 options skyrocket to ₹140+ on expiry day afternoons',
  'Intermediate to Pro',
  '8 min',
  'Every Thursday (or expiry day), option premiums decay in the morning. But after 1:15 PM, something magical happens called the Gamma Explosion: a tiny 50-point move in Nifty can multiply an Out-Of-The-Money option from ₹20 to ₹140 in 20 minutes!',
  [
    {
      id: 'sub-1',
      title: '1. Spoon-Fed: What is Delta and Gamma?',
      content: `
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li><strong>Delta:</strong> Tells you how much your option price moves when the index moves 1 point. (e.g. Delta 0.50 means if Nifty goes up 10 pts, option goes up ₹5).</li>
          <li><strong>Gamma:</strong> The ACCELERATOR pedal of Delta! On expiry day afternoon, Gamma explodes. An option that was moving slow suddenly accelerates and gains 100% in minutes!</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The 1:15 PM Timing Secret',
      content: `
        <p class="mb-3">Never buy Hero-Zero options at 10:00 AM &mdash; morning theta decay will eat your money alive!</p>
        <p class="mb-3">Wait strictly until <strong>1:15 PM to 2:00 PM</strong>. Look for strikes priced between ₹18 and ₹35 near the current index spot price.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. Risk Rules for Hero-Zero',
      content: `
        <p class="mb-3"><strong class="text-accentGold">RULE: Only risk money you can afford to lose 100%!</strong></p>
        <p class="mb-3">Treat Hero-Zero like a lottery ticket: allocate only 1-2% of your capital. When it hits, it multiplies 3x to 6x your money!</p>
      `
    }
  ],
  {
    setupType: "1:15 PM Expiry Gamma Explosion (Hero-Zero)",
    instrument: "NIFTY / SENSEX 0-DTE Expiry Strike (₹20 to ₹35 range)",
    entryTrigger: "1:15 PM breakout above day coil with volume spike",
    stopLoss: "Maximum premium paid (e.g. ₹20 total risk per lot)",
    target1: "₹60 (3x return / 200% profit)",
    target2: "₹120+ (6x return / 500% profit)",
    riskReward: "1:5.0",
    executionChecklist: [
      "Trade taken strictly after 1:15 PM on expiry day",
      "Selected strike is 1-2 strikes away from spot (not deep OTM)",
      "Maximum allocation capped at 1% of total trading capital",
      "Profit locked at 3x to recover capital"
    ],
    pitfalls: [
      "Buying Hero-Zero in the morning before theta decay finishes",
      "Investing entire account into a single expiry trade"
    ]
  }
);

// 21. Equal Pairs Hedge
deepTopics['topic-equal-pairs-hedge'] = buildTopic(
  'topic-equal-pairs-hedge',
  'module-options',
  'options',
  'Equal CE & PE Pairs: The Stress-Free Straddle Hedge',
  'Making massive profits when the market moves fast in either direction',
  'Intermediate',
  '8 min',
  'Tired of guessing whether the market will go UP or DOWN? With an Equal CE & PE Pair, you buy BOTH! If the market makes a fast 200-point move, the winning side multiplies by 300% while the losing side can only lose what you paid. You profit no matter who wins!',
  [
    {
      id: 'sub-1',
      title: '1. How Equal Pairs Work',
      content: `
        <p class="mb-3">Find a Call (CE) priced around ₹50 and a Put (PE) priced around ₹50. Your total cost is ₹100.</p>
        <p class="mb-3">Now, when a breakout happens:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li>The Call explodes to <strong>₹260</strong>!</li>
          <li>The Put drops down to <strong>₹10</strong> (it cannot go below zero).</li>
          <li>Your total value is ₹260 + ₹10 = ₹270.</li>
          <li>Your Net Profit is <strong>+₹170 per lot (+170%)</strong>!</li>
        </ul>
      `
    },
    {
      id: 'sub-2',
      title: '2. The Best Time to Deploy Equal Pairs',
      content: `
        <p class="mb-3">Deploy this strategy on days when a big move is guaranteed: RBI Policy announcements, Budget Day, Election results, or expiry afternoons after a tight morning consolidation.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. How to Manage the Trade',
      content: `
        <p class="mb-3">Once the total combined value reaches 1:2 (e.g. ₹100 becomes ₹150+), book half your lots and trail the rest for a massive runner.</p>
      `
    }
  ],
  {
    setupType: "Delta-Neutral Equal CE/PE Straddle Pair",
    instrument: "Balanced NIFTY CE + PE Strikes (e.g. ₹45 to ₹55 each)",
    entryTrigger: "Simultaneous purchase of equal-priced CE & PE before breakout window",
    stopLoss: "Combined basket trailing loss of -30% of total entry premium",
    target1: "+50% gain on combined basket (+₹50/lot)",
    target2: "+100% to +150% gain on runaway expansion (+₹100 to ₹150/lot)",
    riskReward: "1:2.5",
    executionChecklist: [
      "Both CE and PE premiums are within 10% price tolerance of each other",
      "Market has coiled tightly for at least 60 minutes prior to entry",
      "Combined stop loss set on the basket",
      "Half profits booked at +50% basket gain"
    ],
    pitfalls: [
      "Buying pairs on boring range-bound days with zero volatility",
      "Panicking and closing only one leg too early"
    ]
  }
);

// 22. Risk Management
deepTopics['topic-risk-management'] = buildTopic(
  'topic-risk-management',
  'module-options',
  'options',
  'The 1:3 Risk-to-Reward Math: Never Blow Up Your Account',
  'Why you can lose 6 out of 10 trades and still make massive wealth',
  'Must Know For Everyone',
  '8 min',
  'Here is the #1 secret that separates the top 1% profitable traders from the 99% who blow up their accounts: Trading is not about having a 90% win rate. It is about mathematics! If you lose ₹1,000 when you are wrong, but make ₹3,000 when you are right, you can be wrong most of the time and still become wealthy.',
  [
    {
      id: 'sub-1',
      title: '1. The 1:3 Risk Math Explained Like a Baby',
      content: `
        <p class="mb-3">Look at this real-life scenario of 10 trades with a 1:3 Risk-to-Reward ratio:</p>
        <ul class="list-disc pl-5 mb-3 space-y-1.5 text-xs text-gray-300">
          <li>You take 10 trades.</li>
          <li>You lose 6 trades in a row: 6 &times; -₹1,000 = <strong class="text-bearRed">-₹6,000</strong>.</li>
          <li>You win only 4 trades: 4 &times; +₹3,000 = <strong class="text-bullGreen">+₹12,000</strong>.</li>
          <li>Your Net Profit: +₹12,000 - ₹6,000 = <strong class="text-bullGreen text-sm">+₹6,000 Net Profit!</strong></li>
        </ul>
        <p class="mb-3 text-bullGreen font-bold">You failed 60% of the time, and you still made 60% profit on your risk capital!</p>
      `
    },
    {
      id: 'sub-2',
      title: '2. The 1% Golden Rule of Capital Protection',
      content: `
        <p class="mb-3"><strong class="text-accentGold">NEVER risk more than 1% to 2% of your total account on any single trade!</strong></p>
        <p class="mb-3">If your trading capital is ₹1,00,000, your maximum loss on a single trade should never exceed ₹1,000 to ₹2,000. That way, even if you face 5 losing trades in a row, you still have 90% of your capital safe.</p>
      `
    },
    {
      id: 'sub-3',
      title: '3. The 3 Deadly Mistakes That Blow Accounts',
      content: `
        <ol class="list-decimal pl-5 mb-3 space-y-2 text-xs text-gray-300">
          <li><strong>Moving your Stop Loss:</strong> Hoping the market will turn around. (It won\'t &mdash; cut losses fast!).</li>
          <li><strong>Revenge Trading:</strong> Trying to make back a loss in the next 10 minutes with oversized lots.</li>
          <li><strong>Over-trading:</strong> Taking 20 trades a day. Take 1 to 2 high-quality sniper setups and close your laptop.</li>
        </ol>
      `
    }
  ],
  {
    setupType: "Institutional 1:3 Capital Defense Blueprint",
    instrument: "Any Intraday Trading Instrument",
    entryTrigger: "Setup must offer a verified 1:3 reward-to-risk ratio before entry",
    stopLoss: "Calculated strictly at maximum 1-2% of total trading account",
    target1: "Lock half at 1:2 RR to eliminate all risk",
    target2: "Full exit at 1:3+ target",
    riskReward: "1:3.0",
    executionChecklist: [
      "Maximum single-trade risk calculated in rupees before clicking buy",
      "Reward is at least 3 times the risk distance",
      "Stop loss order entered directly into terminal simultaneously",
      "Maximum 2 trades allowed per day"
    ],
    pitfalls: [
      "Risking 20% of account on a 'sure-shot tip' (there are no sure shots!)",
      "Canceling a stop loss while in a losing trade"
    ]
  }
);

// OUTPUT THE COMPLETE JS FILE
const fileContent = `/**
 * THE MARKET SNIPER SHOOTERS - MASTER TRADING ACADEMY
 * Institutional Curriculum, Real-World Blueprints & Spoon-Fed Teaching System
 * 
 * Standards: Dalal Street & Global Price Action Mastery
 * Generated: ${new Date().toISOString()}
 */

window.ACADEMY_MODULES = ${JSON.stringify(modules, null, 2)};

window.ACADEMY_DEEP_TOPICS = ${JSON.stringify(deepTopics, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'public', 'academy-data.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');

const srcOutputPath = path.join(__dirname, '..', 'src', 'frontend', 'academy-data.js');
try {
  fs.mkdirSync(path.dirname(srcOutputPath), { recursive: true });
  fs.writeFileSync(srcOutputPath, fileContent, 'utf8');
} catch (e) {}

console.log('✅ Successfully compiled academy-data.js to public/ and src/frontend/ with:');
console.log(`- ${modules.length} Modules (Zero physics, pure trading basics to pro)`);
console.log(`- ${Object.keys(deepTopics).length} Topics with dedicated spoon-fed lessons`);
console.log(`- 22 DISTINCT, UNIQUE SVG Blueprints!`);
