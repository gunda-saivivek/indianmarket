/**
 * Hero-Zero Trade Scanner & Level Finder
 * 
 * Scans live option chain for the sweet-spot strikes (₹10 - ₹35)
 * and calculates exact entry, targets (2x, 3x, 5x), and Upstox strike names.
 * 
 * Usage:
 *   node hero-zero.js
 */

async function fetchOptionChain() {
  const url = 'https://groww.in/v1/api/option_chain_service/v1/option_chain/derivatives/nifty';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function main() {
  try {
    process.stdout.write("Scanning live market for Hero-Zero opportunities...\r");
    const data = await fetchOptionChain();
    const spot = data.livePrice?.value;
    const currentExpiry = data.optionChain?.expiryDetailsDto?.currentExpiry;
    const lotSize = data.optionChain?.expiryDetailsDto?.expiryLotSize || 65;

    if (!spot || !currentExpiry) {
      console.log("\nUnable to fetch live market data.");
      return;
    }

    const d = new Date(currentExpiry);
    const formattedExpiry = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    const chains = data.optionChain?.optionChains || [];

    // Filter strikes with LTP between ₹10 and ₹35 (The Golden Hero-Zero zone)
    const ceCandidates = [];
    const peCandidates = [];

    for (const item of chains) {
      const strike = item.strikePrice / 100;
      const ce = item.callOption;
      const pe = item.putOption;

      if (ce && ce.ltp >= 10 && ce.ltp <= 35) {
        ceCandidates.push({
          strike,
          ltp: ce.ltp,
          name: ce.longDisplayName || `NIFTY ${formattedExpiry} ${strike} CE`,
          ptsFromSpot: (strike - spot).toFixed(0)
        });
      }

      if (pe && pe.ltp >= 10 && pe.ltp <= 35) {
        peCandidates.push({
          strike,
          ltp: pe.ltp,
          name: pe.longDisplayName || `NIFTY ${formattedExpiry} ${strike} PE`,
          ptsFromSpot: (spot - strike).toFixed(0)
        });
      }
    }

    console.log("\n=============================================================");
    console.log("            🎯 LIVE HERO-ZERO SCANNER (NIFTY)");
    console.log("=============================================================");
    console.log(` Current Nifty Spot:   ${spot.toFixed(2)}`);
    console.log(` Expiry Date:          ${currentExpiry} (${formattedExpiry})`);
    console.log(` Lot Size:             ${lotSize} qty/lot`);

    console.log("\n=============================================================");
    console.log(" 🚀 CALL (CE) HERO-ZERO PICKS  [If TradingView Breaks HIGH]");
    console.log("=============================================================");
    if (ceCandidates.length === 0) {
      console.log(" No CE strikes currently in the ₹10 - ₹35 sweet spot.");
    } else {
      ceCandidates.slice(0, 3).forEach((c, idx) => {
        const doubleTarget = (c.ltp * 2).toFixed(1);
        const tripleTarget = (c.ltp * 3).toFixed(1);
        const maxRisk = (c.ltp * lotSize).toFixed(0);

        console.log(`\n Option #${idx + 1}: ${c.name}`);
        console.log(` • Upstox Search:    NIFTY ${formattedExpiry} ${c.strike} CE`);
        console.log(` • Entry Price:      ₹${c.ltp} (Max Risk per lot: ₹${maxRisk})`);
        console.log(` • Target 1 (2x):    ₹${doubleTarget} (+100% gain)`);
        console.log(` • Target 2 (3x):    ₹${tripleTarget} (+200% gain)`);
        console.log(` • Distance:         Needs ~${c.ptsFromSpot} pts rally on TradingView`);
      });
    }

    console.log("\n=============================================================");
    console.log(" 🩸 PUT (PE) HERO-ZERO PICKS   [If TradingView Breaks LOW]");
    console.log("=============================================================");
    if (peCandidates.length === 0) {
      console.log(" No PE strikes currently in the ₹10 - ₹35 sweet spot.");
    } else {
      peCandidates.slice(-3).reverse().forEach((p, idx) => {
        const doubleTarget = (p.ltp * 2).toFixed(1);
        const tripleTarget = (p.ltp * 3).toFixed(1);
        const maxRisk = (p.ltp * lotSize).toFixed(0);

        console.log(`\n Option #${idx + 1}: ${p.name}`);
        console.log(` • Upstox Search:    NIFTY ${formattedExpiry} ${p.strike} PE`);
        console.log(` • Entry Price:      ₹${p.ltp} (Max Risk per lot: ₹${maxRisk})`);
        console.log(` • Target 1 (2x):    ₹${doubleTarget} (+100% gain)`);
        console.log(` • Target 2 (3x):    ₹${tripleTarget} (+200% gain)`);
        console.log(` • Distance:         Needs ~${p.ptsFromSpot} pts fall on TradingView`);
      });
    }

    console.log("\n=============================================================");
    console.log(" ⚡ THE 3 GOLDEN RULES FOR HERO-ZERO TRADES");
    console.log("=============================================================");
    console.log(" 1. BEST TIME: Enter only after 1:15 PM when morning theta decay ends.");
    console.log(" 2. DO NOT GUESS: Mark the 12:00 PM - 1:15 PM consolidation range on TradingView.");
    console.log("    - If it breaks the HIGH -> Buy CE");
    console.log("    - If it breaks the LOW  -> Buy PE");
    console.log(" 3. RISK MANAGEMENT: When it hits Target 1 (2x), SELL HALF to make");
    console.log("    your trade completely free of risk, and ride the rest to 3x-5x!");
    console.log("=============================================================\n");

  } catch (err) {
    console.error("\nError scanning:", err.message);
  }
}

main();
