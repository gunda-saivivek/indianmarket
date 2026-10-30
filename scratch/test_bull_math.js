function walk(start, changes) {
  let p = start;
  return changes.map((c, i) => {
    const o = p;
    const change = c.chg || 0;
    const cClose = o + change;
    const h = Math.max(o, cClose) + (c.upWick !== undefined ? c.upWick : Math.abs(change) * 0.2 + 2);
    const l = Math.min(o, cClose) - (c.dnWick !== undefined ? c.dnWick : Math.abs(change) * 0.2 + 2);
    p = cClose;
    return {
      idx: i,
      o: parseFloat(o.toFixed(1)),
      h: parseFloat(h.toFixed(1)),
      l: parseFloat(l.toFixed(1)),
      c: parseFloat(cClose.toFixed(1)),
      v: c.v || 3500
    };
  });
}

const bullCandles = walk(23120, [
  { chg: -15, v: 3100 }, // 0: 23105
  { chg: -20, v: 3800 }, // 1: 23085
  { chg: -15, v: 4100 }, // 2: 23070
  // 3: Liquidity sweep with absorption tail (sweeps 23,040)
  { chg: 10, upWick: 4, dnWick: 30, v: 9200 }, // 3: 23080
  // 4: Strong displacement green
  { chg: 40, upWick: 5, dnWick: 2, v: 7800 }, // 4: 23120
  // 5: iFVG Breakout
  { chg: 45, upWick: 6, dnWick: 2, v: 9600 }, // 5: 23165
  // 6, 7: Pullback into iFVG
  { chg: 10, upWick: 5, dnWick: 3, v: 5100 }, // 6: 23175
  { chg: -20, upWick: 2, dnWick: 4, v: 3800 }, // 7: 23155
  // 8: EXACT ENTRY CANDLE - Retest Tap into 23,145!
  { chg: -10, upWick: 4, dnWick: 12, v: 6200 }, // 8: O: 23155, C: 23145, L: 23133, H: 23159
  // 9: Expansion post-entry
  { chg: 35, upWick: 5, dnWick: 2, v: 8400 }, // 9: 23180
  // 10: Momentum
  { chg: 40, upWick: 5, dnWick: 2, v: 9100 }, // 10: 23220
  // 11: Breakout Bar HITTING TARGET 1 (23,265)
  { chg: 50, upWick: 15, dnWick: 2, v: 10500 }, // 11: 23270, H: 23285
  // 12: Target 2 runner
  { chg: 35, upWick: 8, dnWick: 3, v: 8900 }
]);

console.log(bullCandles);
const preEntryHighs = bullCandles.slice(0, 8).map(c => c.h);
console.log("Max pre-entry high:", Math.max(...preEntryHighs));
console.log("Target 1: 23265. Is pre-entry max < 23265?", Math.max(...preEntryHighs) < 23265);
console.log("Entry candle 8 touches 23145?", bullCandles[8].l <= 23145 && bullCandles[8].h >= 23145);
console.log("Candle 11 hits 23265?", bullCandles[11].h >= 23265);
