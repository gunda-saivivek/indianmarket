const { makeAnimatedTradingViewChart } = require('./tv_animated_engine.js');
const { walk } = require('./build_master_academy_v4.js');

// 4. iFVG Inversion (DodgysDD)
// Bullish FVG created at candles 2-3, broken by giant red candle 4
// Retest of inverted FVG at candle 8 (23,340)
// Post-entry drop to target 1 (23,220)
const ifvgCandles = walk(23310, [
  { chg: 20, v: 4200 }, // 0: 23330
  { chg: 25, upWick: 5, dnWick: 3, v: 4800 }, // 1: High 23360
  { chg: 40, upWick: 6, dnWick: 2, v: 5500 }, // 2: 23395 (FVG created)
  { chg: 15, upWick: 8, dnWick: 4, v: 4100 }, // 3: 23410
  // Violent Inversion Candle (breaks below 23,360)
  { chg: -75, upWick: 4, dnWick: 6, v: 13500 }, // 4: 23335
  { chg: -35, v: 8900 }, // 5: 23300
  { chg: -20, v: 7200 }, // 6: 23280 (Structure low 23274)
  // Pullback into inverted FVG (23,340)
  { chg: 35, v: 3100 }, // 7: 23315
  { chg: 15, upWick: 15, dnWick: 3, v: 9200 }, // 8: EXACT ENTRY CANDLE! O: 23315, H: 23345, C: 23330
  // Downward continuation
  { chg: -45, v: 10200 }, // 9: 23285
  { chg: -50, v: 9500 }, // 10: 23235
  { chg: -35, upWick: 4, dnWick: 12, v: 8800 } // 11: Low 23188 (Hits Target 1: 23220)
]);

console.log("4. iFVG pre-entry min low:", Math.min(...ifvgCandles.slice(0, 8).map(c => c.l)));
console.log("4. iFVG entry candle 8 touches 23340?", ifvgCandles[8].l <= 23340 && ifvgCandles[8].h >= 23340);
console.log("4. iFVG post-entry hits 23220?", ifvgCandles.slice(9).some(c => c.l <= 23220));

// 5. AMT PDH/PDL Sweep
const pdhCandles = walk(23260, [
  { chg: 30, v: 4100 }, // 0: 23290
  { chg: 35, v: 4800 }, // 1: 23325
  { chg: 30, v: 5200 }, // 2: 23355
  { chg: 20, v: 5800 }, // 3: 23375
  // Candle 4: PDH Sweep Wick (sweeps to 23,415, closes 23,370)
  { chg: -5, upWick: 45, dnWick: 3, v: 12800 }, // 4: High 23415
  // Candle 5: Reclaim Confirmation (EXACT ENTRY CANDLE, closes below PDH at 23,345)
  { chg: -25, upWick: 4, dnWick: 8, v: 10500 }, // 5: O: 23370, C: 23345, L: 23337, H: 23374
  // Markdown
  { chg: -45, v: 8900 }, // 6: 23300
  { chg: -40, v: 7900 }, // 7: 23260
  { chg: -50, upWick: 5, dnWick: 15, v: 9200 }, // 8: Low 23195 (Hits Target 1: 23220)
  { chg: -35, v: 7600 } // 9
]);

console.log("5. PDH pre-entry min low:", Math.min(...pdhCandles.slice(0, 5).map(c => c.l)));
console.log("5. PDH entry candle 5 touches 23355?", pdhCandles[5].l <= 23355 && pdhCandles[5].h >= 23355);
console.log("5. PDH post-entry hits 23220?", pdhCandles.slice(6).some(c => c.l <= 23220));

// 6. Atlas AMT Value Areas (pVAH Rejection Fade)
const amtCandles = walk(23220, [
  { chg: 30, v: 4200 }, // 0: 23250
  { chg: 35, v: 4900 }, // 1: 23285
  // Candle 2: Spike to pVAH (23,310) with rejection wick to 23,335
  { chg: 10, upWick: 40, dnWick: 4, v: 9800 }, // 2: High 23335, C: 23295
  // Candle 3: EXACT ENTRY CANDLE - Rejection down into Value Area (O: 23295, C: 23275, touches 23285)
  { chg: -20, upWick: 10, dnWick: 5, v: 8500 }, // 3: H: 23305, L: 23270
  { chg: -30, v: 6200 }, // 4: 23245
  { chg: -30, v: 7100 }, // 5: 23215
  { chg: -25, upWick: 4, dnWick: 18, v: 8400 }, // 6: Low 23172 (Hits Target 1: 23210)
  { chg: -20, v: 6400 } // 7
]);

console.log("6. AMT pre-entry min low:", Math.min(...amtCandles.slice(0, 3).map(c => c.l)));
console.log("6. AMT entry candle 3 touches 23285?", amtCandles[3].l <= 23285 && amtCandles[3].h >= 23285);
console.log("6. AMT post-entry hits 23210?", amtCandles.slice(4).some(c => c.l <= 23210));

// 7. Judas Swing 9:15 AM
const judasCandles = walk(23210, [
  { chg: 35, v: 8500 }, // 0: 23245
  { chg: 45, v: 9800 }, // 1: 23290
  // Candle 2: Sweep of Pre-Market High (High 23,325, Close 23,285)
  { chg: -5, upWick: 40, dnWick: 4, v: 14200 }, // 2: Judas Trap Wick!
  // Candle 3: Trap Confirmed (Displacement red candle)
  { chg: -45, upWick: 4, dnWick: 6, v: 12100 }, // 3: 23240
  // Candle 4: EXACT ENTRY CANDLE (Retest bounce fails at 23,250)
  { chg: -15, upWick: 18, dnWick: 4, v: 9500 }, // 4: O: 23240, H: 23258, L: 23221, C: 23225
  // Markdown
  { chg: -45, v: 9200 }, // 5: 23180
  { chg: -45, upWick: 5, dnWick: 12, v: 9100 }, // 6: Low 23123 (Hits Target 1: 23140)
  { chg: -30, v: 8100 } // 7
]);

console.log("7. Judas pre-entry min low:", Math.min(...judasCandles.slice(0, 4).map(c => c.l)));
console.log("7. Judas entry candle 4 touches 23250?", judasCandles[4].l <= 23250 && judasCandles[4].h >= 23250);
console.log("7. Judas post-entry hits 23140?", judasCandles.slice(5).some(c => c.l <= 23140));
