/**
 * MASTER TRADING ACADEMY BUILDER V4
 * Features:
 * 1. 8 Comprehensive Modules (including Malaysian Setup, iFVG DodgysDD, Atlas AMT & Liquidity)
 * 2. 100% Pure Candlestick Charts with Animated Replay (GIF-style playback)
 * 3. NO raw code blocks in text (Pure concepts & Indian Market Nifty/BankNifty implementations)
 * 4. Direct Sub-topic Redirection with smooth scrolling & gold highlight
 */

const fs = require('fs');
const path = require('path');
const { makeAnimatedTradingViewChart } = require('./tv_animated_engine.js');

function walk(start, changes) {
  let p = start;
  return changes.map(c => {
    const o = p;
    const change = c.chg || 0;
    const cClose = o + change;
    const h = Math.max(o, cClose) + (c.upWick || Math.abs(change) * 0.2 + 2);
    const l = Math.min(o, cClose) - (c.dnWick || Math.abs(change) * 0.2 + 2);
    p = cClose;
    return {
      o: parseFloat(o.toFixed(1)),
      h: parseFloat(h.toFixed(1)),
      l: parseFloat(l.toFixed(1)),
      c: parseFloat(cClose.toFixed(1)),
      v: c.v || 2500
    };
  });
}

// =========================================================================
// 1. MODULES DEFINITION
// =========================================================================
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. The Apex Trap: Why Never to Trade Beyond 75% of Triangle Apex" }
        ]
      }
    ]
  },
  {
    id: "module-malaysian",
    number: "03",
    title: "The Malaysian Trade Setup Method (Malaysian SNR & QMR)",
    category: "malaysian",
    badge: "PRECISION SNIPER METHOD",
    icon: "target",
    color: "cyan-400",
    summary: "The legendary Malaysian Price Action methodology. Master Major V-Shaped Peaks and Valleys, Hidden Base Support/Resistance, and the Malaysian Quasimodo Reversal (QMR) with the Umar 40% Rejection Wick rule.",
    totalTopics: 2,
    readTime: "26 min",
    topics: [
      {
        id: "topic-malaysian-snr",
        title: "Malaysian SNR: V-Shaped Peaks, Hidden Bases & Key Level Mastery",
        subtitle: "Drawing Institutional S&R Across Bodies and Base Wicks on Dalal Street",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. The Malaysian SNR Philosophy: Why Regular Retail Lines Fail" },
          { id: "sub-2", title: "2. Major V-Shaped Rejection Peaks & Inverted-V Valleys" },
          { id: "sub-3", title: "3. The Hidden Base (Doji/Gap Breakout): Finding the Real Smart Money Wall" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Retail Traps: Drawing Lines Across Choppy Consolidation" }
        ]
      },
      {
        id: "topic-malaysian-qmr",
        title: "Malaysian Quasimodo Reversal (QMR) & The Umar 40% Rejection Wick Rule",
        subtitle: "High, Low, Higher High Liquidity Sweep, Lower Low & Left Shoulder Retest",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. The Anatomy of Malaysian QMR: The 4 Structural Pivots" },
          { id: "sub-2", title: "2. The Umar 40% Rejection Wick Rule: Mathematical Proof of Absorption" },
          { id: "sub-3", title: "3. The Displacement Check: 35%+ Body Expansion Away from Key Level" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Entering Ahead of Displacement: Avoiding Premature Fades" }
        ]
      }
    ]
  },
  {
    id: "module-fvg-ifvg",
    number: "04",
    title: "Fair Value Gaps (FVG) & Inversion FVG (iFVG) — DodgysDD Framework",
    category: "fvg-ifvg",
    badge: "INSTITUTIONAL IMBALANCE",
    icon: "layers",
    color: "bearRed",
    summary: "The institutional imbalance masterclass. Learn standard 3-bar Fair Value Gaps and master the DodgysDD Inversion FVG (iFVG) where failed gaps flip into high-probability support/resistance zones.",
    totalTopics: 2,
    readTime: "25 min",
    topics: [
      {
        id: "topic-fvg-imbalance",
        title: "Standard 3-Bar Fair Value Gap (FVG) & 50% Consequent Encroachment",
        subtitle: "Trading Market Delivery Voids and Algorithmic Order Balancing",
        readTime: "12 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Algorithmic Price Delivery: Why 3-Bar Voids Must Be Rebalanced" },
          { id: "sub-2", title: "2. Consequent Encroachment (50% C.E.): The Precision Limit Order Trigger" },
          { id: "sub-3", title: "3. Premium vs Discount Array Alignment on Nifty & Bank Nifty" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Traps: Trading Counter-Trend FVGs Without Macro Bias" }
        ]
      },
      {
        id: "topic-ifvg-inversion",
        title: "Inversion FVG (iFVG): Violent Inversion Mechanics & Grey Box Retest Playbook",
        subtitle: "The DodgysDD Universal Setup: Trading Failed Gaps with 200 EMA Macro Confluence",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. What is an Inversion FVG (iFVG)? When Support Inverts into Resistance" },
          { id: "sub-2", title: "2. The 15-Bar Inversion Rule: Validating High-Velocity Institutional Breaks" },
          { id: "sub-3", title: "3. The 12-Bar Retest Window & Anti-Hunt ATR Stop Buffer" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Overholding Past Retest Window: When iFVGs Degrade into Chop" }
        ]
      }
    ]
  },
  {
    id: "module-liquidity-amt",
    number: "05",
    title: "Institutional Liquidity Sweeps & Auction Market Theory (Atlas AMT)",
    category: "liquidity-amt",
    badge: "AUCTION MARKET THEORY",
    icon: "activity",
    color: "indigo-400",
    summary: "Track where central banks and institutional algorithms engineer liquidity traps. Master PDH/PDL sweeps, Value Area High/Low (pVAH/pVAL), Point of Control (pPOC), and 9:15 AM Judas Swings.",
    totalTopics: 3,
    readTime: "38 min",
    topics: [
      {
        id: "topic-amt-pdh-pdl",
        title: "PDH & PDL Liquidity Sweeps: External vs Internal Range Order Flow",
        subtitle: "Hunting Resting Stops Above Previous Day High & Below Previous Day Low",
        readTime: "12 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. External vs Internal Range Liquidity: The Market's Eternal Delivery Loop" },
          { id: "sub-2", title: "2. The PDH / PDL Sweep Signature: Stop Hunts into False Breakouts" },
          { id: "sub-3", title: "3. Reclaim Execution: Entering on 5-Minute Candle Close Back Inside Range" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Runaway Trend Days: Recognizing Real Institutional Breakouts" }
        ]
      },
      {
        id: "topic-amt-value-areas",
        title: "Atlas AMT Playbook: Value Area (pVAH/pVAL) & Point of Control (pPOC) Reversals",
        subtitle: "The 3 Atlas Auction Methods: Fading pVAH, Dip Buying pVAL, and Deep PDL Reversals",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. Volume Profile Auction Distribution: 70% Value Area Mechanics" },
          { id: "sub-2", title: "2. Method 1: Short PDH + pVAH + pwPOC Value Area Rejection Fade" },
          { id: "sub-3", title: "3. Method 2 & 3: Long PDM + pVAL Dip Buys & Deep 1.272 Fib Sweeps" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Trading Against Volume Profile: The Value Migration Error" }
        ]
      },
      {
        id: "topic-judas-swing",
        title: "The Dalal Street Judas Swing & 9:15 AM Opening Trap Reversals",
        subtitle: "Deconstructing the First 30 Minutes of Market Open on Nifty & Bank Nifty",
        readTime: "13 min",
        level: "Institutional Elite",
        subTopics: [
          { id: "sub-1", title: "1. The Anatomy of a Judas Swing: The Engineered Morning Fakeout" },
          { id: "sub-2", title: "2. Asian & Pre-Market High/Low Liquidity Engineering" },
          { id: "sub-3", title: "3. The 9:45 AM Reversal Confirmation Rule: Entering with True Trend Direction" },
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Overtrading 9:15-9:30 AM: Why Impatient Retail Traders Always Lose" }
        ]
      }
    ]
  },
  {
    id: "module-fibonacci",
    number: "06",
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Leaving Money on the Table: Fighting Parabolic Trend Extensions" }
        ]
      }
    ]
  },
  {
    id: "module-indicators",
    number: "07",
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. Trying to Fade a Flat VWAP Trend Day (The Freight Train Error)" }
        ]
      }
    ]
  },
  {
    id: "module-options",
    number: "08",
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
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
          { id: "sub-4", title: "4. Animated Candlestick Replay Chart (GIF-Style)" },
          { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
          { id: "sub-6", title: "6. The 3 Deadly Sins: Averaging Down, Mental Stops & Overleveraging" }
        ]
      }
    ]
  }
];

module.exports = { ACADEMY_MODULES, walk };
