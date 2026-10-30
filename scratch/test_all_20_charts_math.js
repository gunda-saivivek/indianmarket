const { walk } = require('./build_master_academy_v4.js');

const tests = [
  {
    id: "topic-candle-anatomy",
    start: 23140,
    changes: [
      { chg: -15 }, { chg: -20 }, { chg: -18 }, { chg: -25 }, { chg: -12 },
      { chg: 10, upWick: 3, dnWick: 38 },
      { chg: 28, upWick: 4, dnWick: 2 },
      { chg: 22, upWick: 4, dnWick: 5 },
      { chg: 35 }, { chg: 30 }, { chg: 40, upWick: 10, dnWick: 2 },
      { chg: 25 }
    ],
    entryIdx: 7,
    entryPrice: 23105,
    t1: 23210,
    isLong: true
  },
  {
    id: "topic-candle-hammer",
    start: 51380,
    changes: [
      { chg: -40 }, { chg: -65 }, { chg: -50 }, { chg: -30 },
      { chg: 25, upWick: 4, dnWick: 95 },
      { chg: 45, upWick: 8, dnWick: 4 },
      { chg: 75 }, { chg: 65 }, { chg: 80, upWick: 15, dnWick: 4 },
      { chg: 50 }
    ],
    entryIdx: 5,
    entryPrice: 51235,
    t1: 51480,
    isLong: true
  },
  {
    id: "topic-candle-engulfing",
    start: 23360,
    changes: [
      { chg: -15 }, { chg: -18 }, { chg: -22 },
      { chg: -20, upWick: 3, dnWick: 4 },
      { chg: 52, upWick: 6, dnWick: 4 },
      { chg: 35 }, { chg: 30 }, { chg: 40, upWick: 10, dnWick: 2 },
      { chg: 30 }
    ],
    entryIdx: 4,
    entryPrice: 23330,
    t1: 23430,
    isLong: true
  },
  {
    id: "topic-candle-stars",
    start: 76420,
    changes: [
      { chg: -60 }, { chg: -90 },
      { chg: -120, upWick: 10, dnWick: 15 },
      { chg: 10, upWick: 18, dnWick: 25 },
      { chg: 140, upWick: 15, dnWick: 5 },
      { chg: 85 }, { chg: 95 }, { chg: 110, upWick: 20, dnWick: 10 },
      { chg: 90 }
    ],
    entryIdx: 4,
    entryPrice: 76280,
    t1: 76550,
    isLong: true
  },
  {
    id: "topic-double-bottom-top",
    start: 23240,
    changes: [
      { chg: -25 }, { chg: -35 },
      { chg: 10, upWick: 4, dnWick: 20 },
      { chg: 35 }, { chg: 30 },
      { chg: -30 }, { chg: -45 },
      { chg: 10, upWick: 4, dnWick: 25 },
      { chg: 45 }, { chg: 30 },
      { chg: 25, upWick: 8, dnWick: 18 },
      { chg: 40 }, { chg: 45, upWick: 12, dnWick: 3 },
      { chg: 35 }
    ],
    entryIdx: 10,
    entryPrice: 23265,
    t1: 23360,
    isLong: true
  },
  {
    id: "topic-head-shoulders",
    start: 23240,
    changes: [
      { chg: 30 }, { chg: 35 },
      { chg: -25 }, { chg: -25 },
      { chg: 45 }, { chg: 45 }, { chg: -35 }, { chg: -45 },
      { chg: 25 }, { chg: 15 },
      { chg: -45, upWick: 5, dnWick: 10 },
      { chg: -45 }, { chg: -50, upWick: 4, dnWick: 15 },
      { chg: -35 }
    ],
    entryIdx: 10,
    entryPrice: 23265,
    t1: 23175,
    isLong: false
  },
  {
    id: "topic-flags-pennants",
    start: 23100,
    changes: [
      { chg: 40 }, { chg: 45 }, { chg: 50 },
      { chg: -15 }, { chg: 10 }, { chg: -18 }, { chg: 8 }, { chg: -12 },
      { chg: 45, upWick: 6, dnWick: 2 },
      { chg: 40 }, { chg: 45, upWick: 10, dnWick: 2 },
      { chg: 35 }
    ],
    entryIdx: 8,
    entryPrice: 23235,
    t1: 23330,
    isLong: true
  },
  {
    id: "topic-triangles-wedges",
    start: 23180,
    changes: [
      { chg: 40 }, { chg: 25 },
      { chg: -30 }, { chg: -15 },
      { chg: 30 }, { chg: 15 },
      { chg: -18 }, { chg: -8 },
      { chg: 18 },
      { chg: -8 },
      { chg: 35, upWick: 8, dnWick: 3 },
      { chg: 45 }, { chg: 50, upWick: 12, dnWick: 2 },
      { chg: 35 }
    ],
    entryIdx: 10,
    entryPrice: 23250,
    t1: 23350,
    isLong: true
  },
  {
    id: "topic-fib-golden-pocket",
    start: 23050,
    changes: [
      { chg: 45 }, { chg: 65 }, { chg: 50 }, { chg: 60 },
      { chg: -45 }, { chg: 20 }, { chg: -50 }, { chg: -35 },
      { chg: 15, upWick: 4, dnWick: 20 },
      { chg: 35, upWick: 6, dnWick: 3 },
      { chg: 55 }, { chg: 60 }, { chg: 65, upWick: 15, dnWick: 2 },
      { chg: 45 }
    ],
    entryIdx: 9,
    entryPrice: 23185,
    t1: 23350,
    isLong: true
  },
  {
    id: "topic-fib-extensions",
    start: 23150,
    changes: [
      { chg: 35 }, { chg: 45 }, { chg: 40 },
      { chg: -25 }, { chg: -30 },
      { chg: 45 }, { chg: 30 },
      { chg: 25, upWick: 5, dnWick: 3 },
      { chg: 40 }, { chg: 45, upWick: 10, dnWick: 2 },
      { chg: 45 }
    ],
    entryIdx: 7,
    entryPrice: 23285,
    t1: 23360,
    isLong: true
  },
  {
    id: "topic-polarity-flip",
    start: 23160,
    changes: [
      { chg: 30 }, { chg: 25 },
      { chg: -25 }, { chg: -15 },
      { chg: 20 }, { chg: 15 },
      { chg: -18 },
      { chg: 45, upWick: 6, dnWick: 2 },
      { chg: 15 },
      { chg: -25 },
      { chg: -15, upWick: 4, dnWick: 12 },
      { chg: 45 }, { chg: 50, upWick: 12, dnWick: 2 },
      { chg: 35 }
    ],
    entryIdx: 10,
    entryPrice: 23220,
    t1: 23310,
    isLong: true
  },
  {
    id: "topic-supply-demand-zones",
    start: 51280,
    changes: [
      { chg: -50 }, { chg: -55 },
      { chg: 10, upWick: 6, dnWick: 5 },
      { chg: -5, upWick: 5, dnWick: 4 },
      { chg: 80, upWick: 8, dnWick: 2 },
      { chg: 65 },
      { chg: -45 }, { chg: -50 },
      { chg: -25, upWick: 6, dnWick: 25 },
      { chg: 75 }, { chg: 80, upWick: 15, dnWick: 2 },
      { chg: 60 }
    ],
    entryIdx: 8,
    entryPrice: 51200,
    t1: 51360,
    isLong: true
  },
  {
    id: "topic-smc-order-blocks",
    start: 23160,
    changes: [
      { chg: -15 }, { chg: -20 },
      { chg: -25, upWick: 4, dnWick: 8 },
      { chg: 55, upWick: 6, dnWick: 2 },
      { chg: 40 },
      { chg: -25 }, { chg: -25 },
      { chg: -15, upWick: 5, dnWick: 18 },
      { chg: 50 }, { chg: 55, upWick: 10, dnWick: 2 },
      { chg: 40 }
    ],
    entryIdx: 7,
    entryPrice: 23130,
    t1: 23230,
    isLong: true
  },
  {
    id: "topic-smc-fvg",
    start: 23180,
    changes: [
      { chg: 15, upWick: 6, dnWick: 2 },
      { chg: 65, upWick: 6, dnWick: 2 },
      { chg: 25, upWick: 8, dnWick: 4 },
      { chg: -15 }, { chg: -20 },
      { chg: -10, upWick: 4, dnWick: 15 },
      { chg: 45 }, { chg: 50, upWick: 10, dnWick: 2 },
      { chg: 35 }
    ],
    entryIdx: 5,
    entryPrice: 23230,
    t1: 23320,
    isLong: true
  },
  {
    id: "topic-smc-liquidity-sweeps",
    start: 23260,
    changes: [
      { chg: 30 }, { chg: 25 },
      { chg: -25 }, { chg: -20 },
      { chg: 22 }, { chg: 20 },
      { chg: -5, upWick: 35, dnWick: 3 },
      { chg: -45, upWick: 3, dnWick: 8 },
      { chg: -40 }, { chg: -45, upWick: 4, dnWick: 15 },
      { chg: -35 }
    ],
    entryIdx: 7,
    entryPrice: 23270,
    t1: 23190,
    isLong: false
  },
  {
    id: "topic-rsi-divergence",
    start: 23250,
    changes: [
      { chg: 25 }, { chg: 30 },
      { chg: -20 }, { chg: -18 },
      { chg: 35 }, { chg: 25 },
      { chg: -40, upWick: 4, dnWick: 8 },
      { chg: -45 }, { chg: -45, upWick: 5, dnWick: 12 },
      { chg: -35 }
    ],
    entryIdx: 6,
    entryPrice: 23300,
    t1: 23210,
    isLong: false
  },
  {
    id: "topic-vwap-bands",
    start: 23180,
    changes: [
      { chg: 25 }, { chg: 35 },
      { chg: -20 }, { chg: -18 },
      { chg: 12, upWick: 4, dnWick: 20 },
      { chg: 28, upWick: 5, dnWick: 3 },
      { chg: 40 }, { chg: 45, upWick: 10, dnWick: 2 },
      { chg: 35 }
    ],
    entryIdx: 5,
    entryPrice: 23225,
    t1: 23310,
    isLong: true
  },
  {
    id: "topic-options-greeks-gamma",
    start: 23270,
    changes: [
      { chg: -6 }, { chg: 8 }, { chg: -5 }, { chg: 7 }, { chg: -4 },
      { chg: 35, upWick: 6, dnWick: 2 },
      { chg: 45 }, { chg: 50, upWick: 15, dnWick: 2 },
      { chg: 40 }
    ],
    entryIdx: 5,
    entryPrice: 23290,
    t1: 23380,
    isLong: true
  },
  {
    id: "topic-equal-pairs-hedge",
    start: 23230,
    changes: [
      { chg: 5 }, { chg: -6 }, { chg: 5 }, { chg: -4 }, { chg: 4 },
      { chg: 35, upWick: 6, dnWick: 2 },
      { chg: 45 }, { chg: 50, upWick: 12, dnWick: 2 },
      { chg: 40 }
    ],
    entryIdx: 5,
    entryPrice: 23250,
    t1: 23350,
    isLong: true
  },
  {
    id: "topic-risk-management",
    start: 23180,
    changes: [
      { chg: -15 }, { chg: -20 },
      { chg: 15, upWick: 4, dnWick: 22 },
      { chg: 35, upWick: 5, dnWick: 3 },
      { chg: 40 }, { chg: 45 }, { chg: 45, upWick: 12, dnWick: 2 },
      { chg: 40 }
    ],
    entryIdx: 3,
    entryPrice: 23180,
    t1: 23310,
    isLong: true
  }
];

let allPassed = true;
tests.forEach(t => {
  const candles = walk(t.start, t.changes);
  const preEntry = candles.slice(0, t.entryIdx);
  const entryCandle = candles[t.entryIdx];
  const postEntry = candles.slice(t.entryIdx + 1);

  // Check 1: Pre-entry touches T1
  const preTouchT1 = t.isLong 
    ? preEntry.some(c => c.h >= t.t1)
    : preEntry.some(c => c.l <= t.t1);

  if (preTouchT1) {
    console.error(`FAIL [${t.id}]: Pre-entry touched Target 1!`);
    allPassed = false;
  }

  // Check 2: Entry candle touches entryPrice (within 15 pts)
  const entryTouch = (entryCandle.l <= t.entryPrice + 10) && (entryCandle.h >= t.entryPrice - 10);
  if (!entryTouch) {
    console.error(`FAIL [${t.id}]: Entry candle ${t.entryIdx} [${entryCandle.l}-${entryCandle.h}] didn't touch entryPrice ${t.entryPrice}!`);
    allPassed = false;
  }

  // Check 3: Post-entry hits Target 1
  const postHitT1 = t.isLong
    ? postEntry.some(c => c.h >= t.t1)
    : postEntry.some(c => c.l <= t.t1);
  if (!postHitT1) {
    console.error(`FAIL [${t.id}]: Post-entry failed to hit Target 1 ${t.t1}! Max/Min was ${t.isLong ? Math.max(...postEntry.map(c=>c.h)) : Math.min(...postEntry.map(c=>c.l))}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("ALL 20 CHARTS PASSED 100% CHRONOLOGICAL & PRICE ACTION VALIDATION!");
} else {
  console.error("SOME CHARTS FAILED VALIDATION!");
}
