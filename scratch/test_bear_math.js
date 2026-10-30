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

const bearCandles = walk(51270, [
  { chg: 35, upWick: 5, dnWick: 3 }, // 0
  { chg: 25, upWick: 6, dnWick: 2 }, // 1: High 51336
  { chg: -45, upWick: 4, dnWick: 6 }, // 2
  { chg: -55, upWick: 3, dnWick: 5 }, // 3: Low 51225
  { chg: 75, upWick: 8, dnWick: 4 }, // 4
  { chg: 15, upWick: 105, dnWick: 4 }, // 5: High 51425 (PDH sweep)
  { chg: -65, upWick: 4, dnWick: 8 }, // 6
  { chg: -75, upWick: 5, dnWick: 6 }, // 7: LL 51174
  { chg: 65, upWick: 6, dnWick: 4 }, // 8
  { chg: 70, upWick: 5, dnWick: 3 }, // 9: Close 51315
  { chg: -15, upWick: 20, dnWick: 4 }, // 10: Entry Candle! O: 51315, H: 51335, C: 51300
  { chg: -85, upWick: 5, dnWick: 8 }, // 11
  { chg: -75, upWick: 4, dnWick: 10 }, // 12
  { chg: -80, upWick: 6, dnWick: 20 }, // 13: Low 51040 (Hits Target 1: 51080)
  { chg: -65, upWick: 4, dnWick: 12 }  // 14
]);

console.log(bearCandles);
const preEntryLows = bearCandles.slice(0, 10).map(c => c.l);
console.log("Min pre-entry low:", Math.min(...preEntryLows));
console.log("Target 1: 51080. Is pre-entry min > 51080?", Math.min(...preEntryLows) > 51080);
console.log("Entry candle 10 touches 51330?", bearCandles[10].l <= 51330 && bearCandles[10].h >= 51330);
console.log("Candle 13 hits 51080?", bearCandles[13].l <= 51080);
