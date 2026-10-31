/**
 * Nifty & Sensex Option Level Calculator
 * 
 * Usage:
 *   node calculate.js <spot_entry> <spot_target> <spot_sl> <ce_premium> [pe_premium]
 * 
 * Example:
 *   node calculate.js 24500 24620 24440 280 270
 */

const args = process.argv.slice(2);

if (args.length < 4) {
  console.log(`
=============================================================
  NIFTY / SENSEX OPTION LEVEL CALCULATOR (NEXT WEEK EXPIRY)
=============================================================
Usage:
  node calculate.js <SpotEntry> <SpotTarget> <SpotSL> <CE_Premium> [PE_Premium]

Example:
  node calculate.js 24500 24620 24440 280 270
  `);
  process.exit(0);
}

const spotEntry = parseFloat(args[0]);
const spotTarget = parseFloat(args[1]);
const spotSL = parseFloat(args[2]);
const cePremium = parseFloat(args[3]);
const pePremium = args[4] ? parseFloat(args[4]) : cePremium;

// Next week ATM delta is typically ~0.50
const delta = 0.50;

const targetPoints = spotTarget - spotEntry;
const slPoints = spotEntry - spotSL;

const ceTarget = (cePremium + (targetPoints * delta)).toFixed(1);
const ceSL = (cePremium - (slPoints * delta)).toFixed(1);

const peTarget = (pePremium + (slPoints * delta)).toFixed(1);
const peSL = (pePremium - (targetPoints * delta)).toFixed(1);

console.log("\n=============================================================");
console.log("             TRADINGVIEW SPOT ANALYSIS");
console.log("=============================================================");
console.log(` Spot Entry:       ${spotEntry}`);
console.log(` Spot Target:      ${spotTarget} (${targetPoints >= 0 ? "+" : ""}${targetPoints} pts)`);
console.log(` Spot Stop Loss:   ${spotSL} (-${slPoints} pts)`);
console.log(` Risk-Reward (RR): 1 : ${(targetPoints / slPoints).toFixed(2)}`);

console.log("\n=============================================================");
console.log("     CALL OPTION (CE) - NEXT WEEK EXPIRY (ATM Strike)");
console.log("=============================================================");
console.log(` Buy Entry:        ₹${cePremium}`);
console.log(` Target Price:     ₹${ceTarget} (+₹${(ceTarget - cePremium).toFixed(1)})`);
console.log(` Stop Loss:        ₹${ceSL} (-₹${(cePremium - ceSL).toFixed(1)})`);

console.log("\n=============================================================");
console.log("     PUT OPTION (PE) - NEXT WEEK EXPIRY (If Trading Reversal)");
console.log("=============================================================");
console.log(` Buy Entry:        ₹${pePremium}`);
console.log(` Target Price:     ₹${peTarget} (+₹${(peTarget - pePremium).toFixed(1)})`);
console.log(` Stop Loss:        ₹${peSL} (-₹${(pePremium - peSL).toFixed(1)})`);
console.log("=============================================================\n");
