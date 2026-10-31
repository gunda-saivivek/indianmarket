function normalCDF(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);
  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * erf);
}

function bsPrice(S, K, T, r, sigma, type = 'CE') {
  if (T <= 0.0001) {
    return type === 'CE' ? Math.max(0.05, S - K) : Math.max(0.05, K - S);
  }
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  let price = 0;
  if (type === 'CE') {
    price = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    price = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  }
  return Math.max(0.5, parseFloat(price.toFixed(2)));
}

async function fetchNseDerivatives(symbol, expiryDate = null) {
  let endpoint = `https://groww.in/v1/api/option_chain_service/v1/option_chain/derivatives/${symbol}?_t=${Date.now()}`;
  if (expiryDate) endpoint += `&expiry=${expiryDate}`;

  const res = await fetch(endpoint, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  if (!res.ok) throw new Error(`Groww API error: ${res.status}`);
  return await res.json();
}

async function fetchSensexSpot() {
  try {
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const d = await res.json();
    const meta = d.chart?.result?.[0]?.meta;
    const spot = meta?.regularMarketPrice || 74675;
    const prevClose = meta?.chartPreviousClose || spot;
    const change = spot - prevClose;
    const changePct = (change / prevClose) * 100;
    const high = meta?.regularMarketDayHigh || spot + 250;
    const low = meta?.regularMarketDayLow || spot - 250;

    return { spot, change, changePct, high, low };
  } catch (err) {
    return { spot: 74675, change: 0, changePct: 0, high: 75000, low: 74500 };
  }
}

function formatDate(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function matchEqualPairs(chains, spot, lotSize, formattedExpiry, maxDist = 450) {
  const ceList = [];
  const peList = [];

  for (const item of chains) {
    const strike = item.strikePrice / 100;
    if (Math.abs(strike - spot) > maxDist) continue;

    if (item.callOption && item.callOption.ltp > 5) {
      ceList.push({ strike, ltp: item.callOption.ltp, name: item.callOption.longDisplayName });
    }
    if (item.putOption && item.putOption.ltp > 5) {
      peList.push({ strike, ltp: item.putOption.ltp, name: item.putOption.longDisplayName });
    }
  }

  const pairs = [];
  const usedPE = new Set();
  ceList.sort((a, b) => a.ltp - b.ltp);

  for (const ce of ceList) {
    let bestPE = null;
    let minDiff = Infinity;

    for (const pe of peList) {
      if (usedPE.has(pe.strike)) continue;
      const diff = Math.abs(ce.ltp - pe.ltp);
      const tolerance = Math.max(3, ce.ltp * 0.18);
      if (diff <= tolerance && diff < minDiff) {
        minDiff = diff;
        bestPE = pe;
      }
    }

    if (bestPE) {
      usedPE.add(bestPE.strike);
      const avgPrice = ((ce.ltp + bestPE.ltp) / 2).toFixed(1);
      const combinedPremium = (ce.ltp + bestPE.ltp).toFixed(1);
      const lotCost = (parseFloat(combinedPremium) * lotSize).toLocaleString('en-IN');
      const isAtmRange = Math.abs(ce.strike - spot) <= 150;

      pairs.push({
        ceStrike: ce.strike,
        ceLtp: ce.ltp,
        ceName: ce.name || `CE ${ce.strike}`,
        peStrike: bestPE.strike,
        peLtp: bestPE.ltp,
        peName: bestPE.name || `PE ${bestPE.strike}`,
        diff: minDiff.toFixed(1),
        avgPrice: parseFloat(avgPrice),
        combinedPremium: parseFloat(combinedPremium),
        lotCost: `₹${lotCost}`,
        expiry: formattedExpiry,
        status: isAtmRange ? 'ACTIVE_ATM' : 'MONITORING',
        signal: ce.ltp > bestPE.ltp ? 'BULLISH_BIAS' : 'BEARISH_BIAS',
        tradingViewRule: `When spot crosses ${Math.max(ce.strike, bestPE.strike)}, the winning option typically explodes 2x-3x while the losing side is strictly capped.`,
        suggestedStrategy: 'Straddle / Strangle In-The-Money Breakout',
        lotSize
      });
    }
  }

  pairs.sort((a, b) => Math.abs(((a.ceStrike + a.peStrike) / 2) - spot) - Math.abs(((b.ceStrike + b.peStrike) / 2) - spot));
  return pairs;
}

module.exports = {
  normalCDF,
  bsPrice,
  fetchNseDerivatives,
  fetchSensexSpot,
  formatDate,
  matchEqualPairs
};
