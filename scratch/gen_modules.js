/**
 * ACADEMY MODULES DEFINITION
 * Each topic includes an explicit subTopics array with id and title
 * so that the dashboard catalog cards can render them as direct click targets.
 */

const ACADEMY_MODULES = [
  {
    id: "module-candlesticks",
    number: "01",
    title: "The Quantum Physics of Candlesticks & Auction Market Theory",
    category: "candlesticks",
    badge: "FOUNDATIONAL TO INSTITUTIONAL",
    icon: "candlestick-chart",
    color: "bullGreen",
    summary: "Deconstruct the bid-ask auction engine. Learn how smart money absorbs retail liquidity, why wicks reveal institutional rejection, and how to execute high-probability candle reversals.",
    totalTopics: 4,
    readTime: "35 min",
    topics: [
      {
        id: "topic-candle-anatomy",
        title: "Candlestick Anatomy & Auction Mechanics",
        subtitle: "Bid-Ask Spread, Spread Mathematics & Conviction Analysis",
        readTime: "8 min",
        level: "Foundational",
        subTopics: [
          { id: "sub-1", title: "1. The Physics of the Order Book (Bids, Asks & Aggression)" },
          { id: "sub-2", title: "2. Real Body vs Wick Ratios & Conviction Mathematics" },
          { id: "sub-3", title: "3. Upper vs Lower Shadows: Rejection Mechanics" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Traps, Whipsaws & False Wick Cascades" }
        ]
      },
      {
        id: "topic-candle-hammer",
        title: "Hammer, Inverted Hammer & Liquidity Absorption",
        subtitle: "Trading Bottom Exhaustion & Stop-Loss Sweeps",
        readTime: "9 min",
        level: "Intermediate",
        subTopics: [
          { id: "sub-1", title: "1. Anatomy of Institutional Absorption at Key Extremes" },
          { id: "sub-2", title: "2. The 2:1 Wick-to-Body Standard & Volume Climax" },
          { id: "sub-3", title: "3. Shooting Star vs Inverted Hammer: Context Rules" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Traps: Mid-Range Hammers Without Support" }
        ]
      },
      {
        id: "topic-candle-engulfing",
        title: "Bullish & Bearish Engulfing Takeovers",
        subtitle: "Outside Reversal Bars & Institutional Order Absorption",
        readTime: "9 min",
        level: "Intermediate",
        subTopics: [
          { id: "sub-1", title: "1. The Outside Reversal Bar & Order Book Erasure" },
          { id: "sub-2", title: "2. Institutional Accumulation vs False Retail Engulfing" },
          { id: "sub-3", title: "3. Multi-Timeframe Confluence (Daily Key Level + 5M)" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Pitfalls: Low Volume Engulfings in Sideways Chop" }
        ]
      },
      {
        id: "topic-candle-stars",
        title: "Morning Star & Evening Star 3-Bar Cycles",
        subtitle: "The 50% Midpoint Penetration Rule & Momentum Exhaustion",
        readTime: "9 min",
        level: "Advanced",
        subTopics: [
          { id: "sub-1", title: "1. The 3-Phase Market Cycle (Impulse, Absorption, Displacement)" },
          { id: "sub-2", title: "2. The 50% Midpoint Rule: Validating Real Institutional Footprints" },
          { id: "sub-3", title: "3. Volume Footprint Signature Across the 3 Bars" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Traps: Gaps That Fail to Hold the Bar 1 Midpoint" }
        ]
      }
    ]
  },
  {
    id: "module-patterns",
    number: "02",
    title: "Classical Geometric Chart Patterns & Market Cycles",
    category: "patterns",
    badge: "PRICE ACTION GEOMETRY",
    icon: "trending-up",
    color: "accentGold",
    summary: "Master geometric consolidation and reversal structures. Filter false breakouts, calculate exact measured moves, and exploit retail trap patterns.",
    totalTopics: 4,
    readTime: "40 min",
    topics: [
      {
        id: "topic-double-bottom-top",
        title: "Double Bottom (W) & Double Top (M) Structures",
        subtitle: "Second Leg Liquidity Sweeps & Neckline Retest Confirmations",
        readTime: "10 min",
        level: "Intermediate",
        subTopics: [
          { id: "sub-1", title: "1. Geometry of W & M Formations: Failed Auction Mechanics" },
          { id: "sub-2", title: "2. The Leg 2 Liquidity Sweep Phenomenon (Turtle Soup Stop Run)" },
          { id: "sub-3", title: "3. Measured Move Projections (100% & 161.8% Extensions)" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Retest Traps & Entering Ahead of Neckline Confirmation" }
        ]
      },
      {
        id: "topic-head-shoulders",
        title: "Head & Shoulders Distribution & Inverse Accumulation",
        subtitle: "Quasimodo Pattern Dynamics & Asymmetric Volume Climax",
        readTime: "11 min",
        level: "Advanced",
        subTopics: [
          { id: "sub-1", title: "1. Institutional Inventory Offloading & Left Shoulder to Head" },
          { id: "sub-2", title: "2. The Quasimodo / Over-and-Under Structural Failure" },
          { id: "sub-3", title: "3. Slanted Neckline Geometry & Asymmetrical Volume Climax" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. False Right Shoulder Breakouts & Trapped Retail Buyers" }
        ]
      },
      {
        id: "topic-flags-pennants",
        title: "Bull Flags, Bear Flags & Momentum Pennants",
        subtitle: "Impulse Pole Mathematics & Orderly Volume Contraction",
        readTime: "9 min",
        level: "Intermediate",
        subTopics: [
          { id: "sub-1", title: "1. Impulse Pole Velocity & Institutional Capital Commitment" },
          { id: "sub-2", title: "2. Orderly Flag Channel & Volume Decay Signature" },
          { id: "sub-3", title: "3. Measured Move Calculation: Exact Duplication of Flagpole" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Flags That Degrade into Reversals: Time Invalidation Rules" }
        ]
      },
      {
        id: "topic-triangles-wedges",
        title: "Ascending/Descending Triangles & Wedges",
        subtitle: "Volatility Compression Coils & Explosive Energy Releases",
        readTime: "10 min",
        level: "Advanced",
        subTopics: [
          { id: "sub-1", title: "1. Volatility Compression Mechanics: Springs Coiling Before Explosion" },
          { id: "sub-2", title: "2. Ascending vs Descending Triangle Pressure Imbalances" },
          { id: "sub-3", title: "3. Falling & Rising Wedges: The Exhaustion Overlap Signature" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. The Apex Trap: Why Never to Trade Beyond 75% of Triangle Apex" }
        ]
      }
    ]
  },
  {
    id: "module-fibonacci",
    number: "03",
    title: "Fibonacci Universal Precision & Harmonic Confluence",
    category: "fibonacci",
    badge: "MATHEMATICAL ASYMMETRY",
    icon: "compass",
    color: "cyan-400",
    summary: "Harness the golden ratio algorithms that drive institutional computer executions. Locate exact reversal pivot pockets and mathematical profit targets.",
    totalTopics: 2,
    readTime: "25 min",
    topics: [
      {
        id: "topic-fib-golden-pocket",
        title: "Fibonacci Retracements & The 0.618 - 0.650 Golden Pocket",
        subtitle: "Institutional Algorithm Calibration & Mathematical Precision Zones",
        readTime: "12 min",
        level: "Advanced",
        subTopics: [
          { id: "sub-1", title: "1. The Golden Ratio: Nature's Algorithm in Modern Electronic Markets" },
          { id: "sub-2", title: "2. The 0.618 - 0.650 Golden Pocket: Smart Money Discount Entry" },
          { id: "sub-3", title: "3. Confluence Layering: Golden Pocket + VWAP + Breaker Blocks" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Retail Anchoring Traps: Selecting Incorrect Swing Extremes" }
        ]
      },
      {
        id: "topic-fib-extensions",
        title: "Fibonacci Extensions (1.272, 1.618 & 2.618)",
        subtitle: "Scientific Profit Targets: Never Exit a Runner Prematurely",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Mathematics of Trend Expansion & Impulse Projection" },
          { id: "sub-2", title: "2. The 1.272 Liquidity Sweep Extension (Stop Run Target)" },
          { id: "sub-3", title: "3. The 1.618 Golden Extension: Institutional Partial Profit-Taking Hub" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Leaving Money on the Table: Fighting Parabolic Trend Extensions" }
        ]
      }
    ]
  },
  {
    id: "module-supply-demand",
    number: "04",
    title: "Support, Resistance & Institutional Supply-Demand Zones",
    category: "supply-demand",
    badge: "INSTITUTIONAL LIQUIDITY",
    icon: "layers",
    color: "bearRed",
    summary: "Differentiate amateur support/resistance from genuine institutional supply and demand zones where banks leave billions in unexecuted limit orders.",
    totalTopics: 2,
    readTime: "25 min",
    topics: [
      {
        id: "topic-polarity-flip",
        title: "The Polarity Principle: S/R Role Reversals",
        subtitle: "Trapped Retail Orders, Breakout Re-tests & Liquidity Flips",
        readTime: "11 min",
        level: "Intermediate",
        subTopics: [
          { id: "sub-1", title: "1. The Psychology of Trapped Money: Why Resistance Becomes Support" },
          { id: "sub-2", title: "2. The Breakeven Effect: Order Book Absorption on the First Retest" },
          { id: "sub-3", title: "3. Retest Timing & The 3-Candle Confirmation Protocol" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Failed Polarity Flips: Recognizing Immediate Structural Breakdown" }
        ]
      },
      {
        id: "topic-supply-demand-zones",
        title: "Institutional Supply & Demand: RBR, DBD, RBD & DBR",
        subtitle: "Locating Unfilled Institutional Limit Orders on Dalal Street Indices",
        readTime: "14 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Supply & Demand vs Retail Support & Resistance: The Core Difference" },
          { id: "sub-2", title: "2. The 4 Institutional Structures: Rally-Base-Rally, Drop-Base-Drop, RBD, DBR" },
          { id: "sub-3", title: "3. Zone Scoring Matrix: Departure Speed, Freshness & Time Spent in Zone" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Stale Zones & Over-Tested Liquidity Pools" }
        ]
      }
    ]
  },
  {
    id: "module-smc",
    number: "05",
    title: "Smart Money Concepts (SMC) & Institutional Order Flow",
    category: "smc",
    badge: "ADVANCED PROPRIETARY",
    icon: "target",
    color: "indigo-400",
    summary: "Trade alongside market makers. Master Order Blocks, Fair Value Gaps (FVG), Liquidity Sweeps, and structural shifts (BOS & CHoCH).",
    totalTopics: 3,
    readTime: "36 min",
    topics: [
      {
        id: "topic-smc-order-blocks",
        title: "Institutional Order Blocks & Mitigation Mechanics",
        subtitle: "Central Bank Accumulation Footprints & 50% Mean Re-tests",
        readTime: "12 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. The Real Nature of an Order Block: Sponsoring the Directional Shift" },
          { id: "sub-2", title: "2. Mitigation Mechanics: Why the Market is Magnetized Back to the Origin" },
          { id: "sub-3", title: "3. High-Probability Order Block Criteria: Liquidity Sweep + Imbalance Creation" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Failed Order Blocks: Identifying Breaker Block Flips" }
        ]
      },
      {
        id: "topic-smc-fvg",
        title: "Fair Value Gaps (FVG) & Imbalance Inefficiencies",
        subtitle: "Trading Market Delivery Voids and the 50% Consequent Encroachment",
        readTime: "11 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Algorithmic Price Delivery: Why 3-Candle Imbalances Must Be Rebalanced" },
          { id: "sub-2", title: "2. Consequent Encroachment (C.E.): The 50% Precision Entry Trigger" },
          { id: "sub-3", title: "3. Inversion FVGs: When Imbalances Invert from Support to Resistance" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Trading Counter-Trend FVGs Without Market Structure Alignment" }
        ]
      },
      {
        id: "topic-smc-liquidity-sweeps",
        title: "Liquidity Sweeps, Stop Hunts & Structural Shifts (BOS / CHoCH)",
        subtitle: "Why 95% of Retail Traders Are Stopped Out Right Before the Run",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Where the Money Lies: Identifying Buy-Side & Sell-Side Liquidity Pools" },
          { id: "sub-2", title: "2. The Judas Swing: Morning London / Dalal Street Opening False Expansion" },
          { id: "sub-3", title: "3. Break of Structure (BOS) vs Change of Character (CHoCH)" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Jumping the Gun: Mistaking Minor Internal Wicks for Real Structural BOS" }
        ]
      }
    ]
  },
  {
    id: "module-indicators",
    number: "06",
    title: "Momentum Filters, RSI Divergences & VWAP Benchmark",
    category: "indicators",
    badge: "QUANTITATIVE EXECUTION",
    icon: "activity",
    color: "cyan-400",
    summary: "Eliminate lagging indicator noise. Master VWAP standard deviations and RSI momentum divergences to enter with pinpoint precision.",
    totalTopics: 2,
    readTime: "24 min",
    topics: [
      {
        id: "topic-rsi-divergence",
        title: "RSI Divergence Mastery: Regular vs Hidden Signals",
        subtitle: "De-coding Momentum Deceleration Before It Shows on Candles",
        readTime: "12 min",
        level: "Advanced",
        subTopics: [
          { id: "sub-1", title: "1. The Physics of Momentum: Velocity of Price vs Rate of Change" },
          { id: "sub-2", title: "2. Regular Divergence: Catching Violent Institutional Trend Reversals" },
          { id: "sub-3", title: "3. Hidden Divergence: The Secret Trend Continuation Footprint" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. The Overbought Fallacy: Why Strong Bull Trends Stay Above RSI 70 for Days" }
        ]
      },
      {
        id: "topic-vwap-bands",
        title: "VWAP & Standard Deviation Bands (±1σ, ±2σ)",
        subtitle: "How Institutional Execution Algorithms (TWAP/VWAP) Benchmark Every Fill",
        readTime: "12 min",
        level: "Intermediate to Advanced",
        subTopics: [
          { id: "sub-1", title: "1. The Volume Weighted Average Price: The True Value Line of Dalal Street" },
          { id: "sub-2", title: "2. Standard Deviation Envelopes (±1σ, ±2σ): Overextended Mean Reversion Zones" },
          { id: "sub-3", title: "3. Anchored VWAP: Anchoring to Major RBI Announcements & Swing Lows" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Trying to Fade a Flat VWAP Trend Day (The Freight Train Error)" }
        ]
      }
    ]
  },
  {
    id: "module-options",
    number: "07",
    title: "Options Greeks, Sniper Execution & The 1% Risk Blueprint",
    category: "options",
    badge: "SNIPER TRADING DESK",
    icon: "zap",
    color: "bullGreen",
    summary: "The crown jewel of The Market Sniper Shooters desk. Master delta acceleration, expiry gamma explosions, delta-neutral equal pairs, and 1:3 RR math.",
    totalTopics: 3,
    readTime: "35 min",
    topics: [
      {
        id: "topic-options-greeks-gamma",
        title: "Option Greeks & The 1:15 PM Gamma Explosion Playbook",
        subtitle: "Delta Acceleration, Theta Burn & Scalping ₹15-₹35 Expiry Strikes to 3x+",
        readTime: "12 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. The Greek Anatomy: Delta, Gamma, Theta Decay & Implied Volatility" },
          { id: "sub-2", title: "2. The Hyper-Gamma Blast Phenomenon: Why Gamma Approaches Infinity Near Expiry" },
          { id: "sub-3", title: "3. The 1:15 PM Rule & The Sweet Spot Strike Selection Strategy" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. The Theta Guillotine: Entering Before 1:00 PM on Sideways Days" }
        ]
      },
      {
        id: "topic-equal-pairs-hedge",
        title: "Equal CE & PE Pairs: The Delta-Neutral Breakout Hedge",
        subtitle: "Asymmetrical Payoff Mathematics: Unlimited Upside vs Capped Loss",
        readTime: "11 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Mathematical Payoff Asymmetry: Why the Winner Outruns the Loser" },
          { id: "sub-2", title: "2. Spotting Pre-Breakout Range Contractions on Nifty & Sensex" },
          { id: "sub-3", title: "3. Order Execution Protocol & Immediate Profit-Taking on 2x Blast" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Low-Volatility Chop Traps: When Neither Leg Explodes" }
        ]
      },
      {
        id: "topic-risk-management",
        title: "Institutional Capital Defense & The 1:3 Risk-to-Reward Math",
        subtitle: "Position Sizing Formula, The 3-Strike Rule & Emotional Discipline",
        readTime: "12 min",
        level: "Foundational to Elite",
        subTopics: [
          { id: "sub-1", title: "1. The Exact Position Sizing Formula: Calculating Lots Based on Stop Loss" },
          { id: "sub-2", title: "2. The Mathematical Proof of Asymmetry: Why a 40% Win Rate Generates Fortune" },
          { id: "sub-3", title: "3. The 3-Strike Daily Circuit Breaker Rule: Killing Revenge Trading" },
          { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. The 3 Deadly Sins: Averaging Down, Mental Stops & Overleveraging" }
        ]
      }
    ]
  }
];

module.exports = { ACADEMY_MODULES };
