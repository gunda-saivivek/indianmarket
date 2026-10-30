/**
 * Live Nifty Option Level Generator
 * Fetches live market spot, next-week expiry, ATM strikes, and real-time premiums automatically!
 * 
 * Usage:
 *   node live-levels.js [TargetSpot] [StopLossSpot]
 * 
 * Example:
 *   node live-levels.js 23250 23050
 */

async function fetchOptionChain(expiry = null) {
  let url = 'https://groww.in/v1/api/option_chain_service/v1/option_chain/derivatives/nifty';
  if (expiry) {
    url += `?expiry=${expiry}`;
  }
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch data: HTTP ${res.status}`);
  }
  return await res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const userTarget = args[0] ? parseFloat(args[0]) : null;
  const userSL = args[1] ? parseFloat(args[1]) : null;

  try {
    process.stdout.write("Fetching live market data for Nifty...\r");
    const baseData = await fetchOptionChain();
    const liveSpot = baseData.livePrice?.value;
    const expiries = baseData.optionChain?.expiryDetailsDto?.expiryDates || [];

    if (!liveSpot || expiries.length < 2) {
      console.log("\nCould not retrieve live market data at this moment.");
      return;
    }

    const currentExpiry = expiries[0];
    const nextExpiry = expiries[1];

    // Fetch next week option chain
    const nextWeekData = await fetchOptionChain(nextExpiry);
    const chains = nextWeekData.optionChain?.optionChains || [];

    // Find ATM strike (closest to spot)
    let closestItem = null;
    let minDiff = Infinity;

    for (const item of chains) {
      const strike = item.strikePrice / 100;
      const diff = Math.abs(strike - liveSpot);
      if (diff < minDiff) {
        minDiff = diff;
        closestItem = item;
      }
    }

    const atmStrike = closestItem.strikePrice / 100;
    const ce = closestItem.callOption;
    const pe = closestItem.putOption;

    const ceLtp = ce?.ltp || 0;
    const peLtp = pe?.ltp || 0;

    // Formatting date
    const d = new Date(nextExpiry);
    const formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    console.log("\n=============================================================");
    console.log("             LIVE MARKET SNAPSHOT (NIFTY)");
    console.log("=============================================================");
    console.log(` Current Nifty Spot:   ${liveSpot.toFixed(2)}`);
    console.log(` Next Week Expiry:     ${nextExpiry} (${formattedDate})`);
    console.log(` ATM Strike:           ${atmStrike}`);
    console.log(` Call (CE) Name:       ${ce?.longDisplayName || `NIFTY ${formattedDate} ${atmStrike} CE`}`);
    console.log(` Call (CE) Live LTP:   ₹${ceLtp}`);
    console.log(` Put (PE) Name:        ${pe?.longDisplayName || `NIFTY ${formattedDate} ${atmStrike} PE`}`);
    console.log(` Put (PE) Live LTP:    ₹${peLtp}`);

    if (userTarget !== null && userSL !== null) {
      const targetDiff = userTarget - liveSpot;
      const slDiff = liveSpot - userSL;

      // Delta for next week ATM is approx 0.50
      const delta = 0.50;

      const ceTarget = (ceLtp + (targetDiff * delta)).toFixed(1);
      const ceSL = Math.max(0, (ceLtp - (slDiff * delta))).toFixed(1);

      const peTarget = (peLtp + (slDiff * delta)).toFixed(1);
      const peSL = Math.max(0, (peLtp - (targetDiff * delta))).toFixed(1);

      console.log("\n=============================================================");
      console.log("             YOUR CALCULATED TRADE LEVELS");
      console.log("=============================================================");
      console.log(` TradingView Target:   ${userTarget} (${targetDiff >= 0 ? "+" : ""}${targetDiff.toFixed(1)} pts)`);
      console.log(` TradingView StopLoss: ${userSL} (-${slDiff.toFixed(1)} pts)`);

      console.log("\n--- IF BUYING CALL (CE) ---");
      console.log(` Strike to Buy:        NIFTY ${formattedDate} ${atmStrike} CE`);
      console.log(` Current Entry:        ₹${ceLtp}`);
      console.log(` Target Price:         ₹${ceTarget} (+₹${(ceTarget - ceLtp).toFixed(1)})`);
      console.log(` Stop Loss Price:      ₹${ceSL} (-₹${(ceLtp - ceSL).toFixed(1)})`);

      console.log("\n--- IF BUYING PUT (PE) ---");
      console.log(` Strike to Buy:        NIFTY ${formattedDate} ${atmStrike} PE`);
      console.log(` Current Entry:        ₹${peLtp}`);
      console.log(` Target Price:         ₹${peTarget} (+₹${(peTarget - peLtp).toFixed(1)})`);
      console.log(` Stop Loss Price:      ₹${peSL} (-₹${(peLtp - peSL).toFixed(1)})`);
      console.log("=============================================================\n");
    } else {
      console.log("\nTip: Pass your TradingView target and stop loss to calculate exact exit prices:");
      console.log(`     node live-levels.js <TargetSpot> <StopLossSpot>`);
      console.log(`Example:`);
      console.log(`     node live-levels.js ${(liveSpot + 100).toFixed(0)} ${(liveSpot - 50).toFixed(0)}\n`);
    }

  } catch (err) {
    console.error("\nError:", err.message);
  }
}

main();
