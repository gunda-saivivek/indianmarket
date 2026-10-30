const { makeSvg } = require('./build_full_academy.js');

const module7Topics = {
  // 18. OPTION GREEKS & 1:15 PM GAMMA EXPLOSION
  "topic-options-greeks-gamma": {
    id: "topic-options-greeks-gamma",
    moduleId: "module-options",
    category: "options",
    title: "Option Greeks & The 1:15 PM Gamma Explosion Playbook",
    subtitle: "Delta acceleration, theta burn and scalping ₹15-₹35 expiry strikes to 3x+",
    moduleTitle: "Options Greeks, Sniper Execution & The 1% Risk Blueprint",
    level: "Institutional Elite",
    readTime: "12 min",
    analystNote: "On expiry afternoons, options pricing defies normal rules. As Time-to-Expiry ($T$) approaches zero, Gamma approaches infinity for At-The-Money strikes. A small 40-point move in Nifty can double or triple a ₹25 strike in 6 minutes because Delta accelerates from 0.15 to 0.75 instantly.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Greek Anatomy: Delta, Gamma, Theta Decay & Implied Volatility" },
      { id: "sub-2", title: "2. The Hyper-Gamma Blast Phenomenon: Why Gamma Approaches Infinity Near Expiry" },
      { id: "sub-3", title: "3. The 1:15 PM Rule & The Sweet Spot Strike Selection Strategy" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. The Theta Guillotine: Entering Before 1:00 PM on Sideways Days" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Greek Anatomy: Delta, Gamma, Theta Decay & Implied Volatility",
        content: `
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Delta (&Delta;):</strong> The rate of change of option price per 1-point move in the underlying index.</li>
            <li><strong>Gamma (&Gamma;):</strong> The acceleration of Delta. High gamma means delta changes violently with every tick.</li>
            <li><strong>Theta (&Theta;):</strong> Time decay. The enemy of the buyer in the morning, but completely neutral on explosive 5-minute afternoon breakouts.</li>
            <li><strong>Vega (&nu;):</strong> Sensitivity to Implied Volatility (IV).</li>
          </ul>
        `
      },
      {
        id: "sub-2",
        title: "2. The Hyper-Gamma Blast Phenomenon: Why Gamma Approaches Infinity Near Expiry",
        content: `
          <p class="mb-3">In the Black-Scholes formula, Gamma is inversely proportional to $\\sqrt{T}$ where $T$ is time remaining:</p>
          <div class="bg-tradeDark p-3 rounded-lg border border-tradeBorder font-mono text-xs text-accentGold my-2">
            &Gamma; &prop; 1 &divide; (S &times; &sigma; &times; &radic;T)
          </div>
          <p class="mb-3">As expiry afternoon approaches ($T \\rightarrow 0$), gamma spikes exponentially. If price crosses into your strike, delta leaps from 0.15 to 0.70. A ₹20 option suddenly behaves like a ₹75 option, producing the legendary <strong>Hero-Zero 200% to 500% profit surge</strong>.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. The 1:15 PM Rule & The Sweet Spot Strike Selection Strategy",
        content: `
          <p class="mb-3">Do not enter before 1:15 PM. Morning theta decay will eat 60% of your premium while you wait. Between 1:15 PM and 2:30 PM, market makers square off intraday short straddles. Look for strikes trading strictly in the <strong>₹15 to ₹35 sweet spot</strong> with expanding open interest unwinding.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Afternoon Gamma Blast Hero-Zero Expansion",
      instrument: "NIFTY / SENSEX Expiry Day OTM Option (₹15 - ₹35)",
      entryTrigger: "Underlying index breaks the 12:00 PM - 1:15 PM consolidation range high or low on 5-min candle",
      stopLoss: "Strict system SL at 40% of option premium (or ₹10 max loss)",
      target1: "2x (+100% gain) - SELL 50% LOTS IMMEDIATELY TO MAKE CAPITAL RISK-FREE",
      target2: "3.5x to 5x (+250% to +400% gain) - Hold runner with trailing stop",
      riskReward: "1:3.5",
      executionChecklist: [
        "Current local time is after 1:15 PM on the index's official expiry day",
        "Target strike premium is between ₹15 and ₹35",
        "Underlying spot index breaks morning consolidation range on 5-min chart",
        "Sell exactly half quantity when premium doubles (+100%)"
      ],
      pitfalls: [
        "Holding 100% quantity past 2:45 PM without taking any profit (threat of sudden zero collapse)",
        "Buying strikes priced above ₹60 (risk is too high for pure gamma blast)"
      ]
    },
    svgBlueprint: makeSvg("1:15 PM GAMMA EXPLOSION", "Hyper-Gamma Spike & Delta Acceleration Payoff", `
      <!-- Time Grid -->
      <line x1="80" y1="280" x2="680" y2="280" stroke="#64748b" stroke-width="2"/>
      <text x="80" y="300" fill="#64748b" font-size="10" font-family="monospace">9:15 AM</text>
      <text x="260" y="300" fill="#64748b" font-size="10" font-family="monospace">11:30 AM</text>
      <text x="420" y="300" fill="#f7a600" font-size="11" font-family="monospace" font-weight="bold">1:15 PM (ENTRY WINDOW)</text>
      <text x="640" y="300" fill="#ff3b57" font-size="10" font-family="monospace">3:30 PM</text>

      <!-- Theta Decay Zone (Morning Bleed) -->
      <path d="M 80 180 Q 240 220 420 250" fill="none" stroke="#ff3b57" stroke-width="2.5" stroke-dasharray="4"/>
      <text x="180" y="210" fill="#ff3b57" font-size="10" font-family="monospace">MORNING THETA DECAY (STRIKE ₹80 ➔ ₹22)</text>

      <!-- Gamma Explosion Curve at 1:15 PM -->
      <path d="M 420 250 Q 480 230 520 120 T 620 40" fill="none" stroke="#00c076" stroke-width="4.5"/>
      <circle cx="420" cy="250" r="8" fill="#f7a600"/>
      <text x="350" y="240" fill="#f7a600" font-size="10" font-family="monospace" font-weight="bold">BUY SWEET SPOT (₹22)</text>

      <!-- 2x Target Point -->
      <circle cx="490" cy="160" r="7" fill="#00c076"/>
      <line x1="420" y1="160" x2="680" y2="160" stroke="#00c076" stroke-dasharray="3"/>
      <text x="510" y="165" fill="#00c076" font-size="11" font-family="monospace" font-weight="bold">TARGET 1: ₹45 (+105% / LOCK PROFIT)</text>

      <!-- 4x Runner Target -->
      <circle cx="600" cy="55" r="8" fill="#38bdf8"/>
      <line x1="420" y1="55" x2="680" y2="55" stroke="#38bdf8" stroke-dasharray="3"/>
      <text x="510" y="48" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">RUNNER TARGET: ₹95 (4.3x BLAST)</text>
    `)
  },

  // 19. EQUAL CE & PE PAIRS (DELTA-NEUTRAL BREAKOUT HEDGE)
  "topic-equal-pairs-hedge": {
    id: "topic-equal-pairs-hedge",
    moduleId: "module-options",
    category: "options",
    title: "Equal CE & PE Pairs: The Delta-Neutral Breakout Hedge",
    subtitle: "Asymmetrical payoff mathematics: Unlimited upside vs strictly capped risk",
    moduleTitle: "Options Greeks, Sniper Execution & The 1% Risk Blueprint",
    level: "Institutional Elite",
    readTime: "11 min",
    analystNote: "The holy grail for trading Dalal Street without stress is eliminating directional bias. When Nifty compresses into a narrow range, buy matched CE and PE strikes of equal value (e.g., CE ₹45 and PE ₹45). Whichever direction price breaks, the winning leg expands exponentially while the losing leg's loss is strictly capped.",
    tableOfContents: [
      { id: "sub-1", title: "1. Mathematical Payoff Asymmetry: Why the Winner Outruns the Loser" },
      { id: "sub-2", title: "2. Spotting Pre-Breakout Range Contractions on Nifty & Sensex" },
      { id: "sub-3", title: "3. Order Execution Protocol & Immediate Profit-Taking on 2x Blast" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Low-Volatility Chop Traps: When Neither Leg Explodes" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. Mathematical Payoff Asymmetry: Why the Winner Outruns the Loser",
        content: `
          <p class="mb-3">Options have asymmetric convexity. If you purchase CE at ₹45 and PE at ₹45 (Total Investment = ₹90 per share):</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Losing Leg (Worst Case):</strong> Cannot fall below ₹0. Maximum decay is capped at -₹45. In reality, you exit around ₹15 (loss capped at -₹30).</li>
            <li><strong>Winning Leg (Best Case):</strong> Expands with delta and gamma, running to ₹140, ₹180, or ₹250 (+₹100 to +₹200 gain).</li>
            <li><strong>Net Result:</strong> Winning Leg (+₹110) minus Losing Leg (-₹30) = <strong>+₹80 Net Profit per share (+88% overall portfolio return)</strong> with zero directional guesswork!</li>
          </ul>
        `
      },
      {
        id: "sub-2",
        title: "2. Spotting Pre-Breakout Range Contractions on Nifty & Sensex",
        content: `
          <p class="mb-3">Do not deploy equal pairs randomly. The perfect condition is when Nifty has consolidated inside a narrow 40-point box for at least 75 minutes. The compression guarantees an explosive expansion release.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. Order Execution Protocol & Immediate Profit-Taking on 2x Blast",
        content: `
          <p class="mb-3">Buy both CE and PE simultaneously using our Sniper Tool. As soon as the total combined basket profit hits +50%, book half. Trail the winning runner.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Delta-Neutral Volatility Expansion Strangle",
      instrument: "Matched Equal CE & PE Strike Pair",
      entryTrigger: "Simultaneous buy when CE and PE are balanced within ₹3 premium difference",
      stopLoss: "Combined portfolio stop loss at -30% of total deployed basket capital",
      target1: "Total combined investment reaches +50% net profit",
      target2: "Total combined investment reaches +100% (2x) net profit",
      riskReward: "1:2.8",
      executionChecklist: [
        "Index is consolidating tightly near VWAP before an anticipated breakout",
        "Premiums of CE and PE are balanced within ₹3 of each other",
        "Both strikes have verified active open interest and tight bid-ask spreads",
        "Exit losing leg once it decays by 60% and ride winning leg runner"
      ],
      pitfalls: [
        "Deploying equal pairs on dead holiday chop days where theta eats both legs",
        "Exiting the winning leg too early out of fear while holding the losing leg"
      ]
    },
    svgBlueprint: makeSvg("EQUAL CE & PE ASYMMETRY", "Unlimited Breakout Upside vs Strictly Capped Loss", `
      <!-- Center Zero Line -->
      <line x1="80" y1="200" x2="680" y2="200" stroke="#64748b" stroke-width="2"/>
      <text x="80" y="190" fill="#64748b" font-size="10" font-family="monospace">ENTRY COST: CE ₹45 + PE ₹45 = ₹90 BASKET COST</text>

      <!-- Winning Leg Path (Curving Exponentially Up) -->
      <path d="M 120 200 Q 320 180 500 80 T 640 40" fill="none" stroke="#00c076" stroke-width="4"/>
      <text x="520" y="60" fill="#00c076" font-size="12" font-family="monospace" font-weight="bold">WINNING LEG: ₹45 ➔ ₹155 (+₹110)</text>

      <!-- Losing Leg Path (Decaying Slowly Down to Floor) -->
      <path d="M 120 200 Q 320 230 500 255 T 640 265" fill="none" stroke="#ff3b57" stroke-width="2.5" stroke-dasharray="4"/>
      <text x="500" y="280" fill="#ff3b57" font-size="11" font-family="monospace">LOSING LEG: ₹45 ➔ ₹15 (-₹30 CAPPED)</text>

      <!-- Net Profit Box -->
      <rect x="220" y="90" width="280" height="75" fill="#00c076" fill-opacity="0.18" stroke="#00c076" stroke-width="2" rx="8"/>
      <text x="360" y="115" fill="#00c076" font-size="13" font-family="monospace" font-weight="bold" text-anchor="middle">NET RESULT: +₹80 / SHARE</text>
      <text x="360" y="135" fill="#ffffff" font-size="11" font-family="monospace" text-anchor="middle">+88.8% Net Basket Return</text>
      <text x="360" y="152" fill="#f7a600" font-size="10" font-family="monospace" text-anchor="middle">Directional Guesswork: ZERO!</text>

      <circle cx="120" cy="200" r="8" fill="#f7a600"/>
    `)
  },

  // 20. RISK MANAGEMENT & 1:3 RR MATH
  "topic-risk-management": {
    id: "topic-risk-management",
    moduleId: "module-options",
    category: "options",
    title: "Institutional Capital Defense & The 1:3 Risk-to-Reward Math",
    subtitle: "How professional proprietary traders protect capital and compound wealth forever",
    moduleTitle: "Options Greeks, Sniper Execution & The 1% Risk Blueprint",
    level: "Foundational to Elite",
    readTime: "12 min",
    analystNote: "Amateur traders obsess over finding a 90% win-rate system. Institutional fund managers know that win-rate is irrelevant; mathematical asymmetry is everything. With a 1:3 Risk-to-Reward ratio, you can be WRONG 60% of the time and still generate immense wealth.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Exact Position Sizing Formula: Calculating Lots Based on Stop Loss" },
      { id: "sub-2", title: "2. The Mathematical Proof of Asymmetry: Why a 40% Win Rate Generates Fortune" },
      { id: "sub-3", title: "3. The 3-Strike Daily Circuit Breaker Rule: Killing Revenge Trading" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. The 3 Deadly Sins: Averaging Down, Mental Stops & Overleveraging" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Exact Position Sizing Formula: Calculating Lots Based on Stop Loss",
        content: `
          <p class="mb-3">Never choose your lot size first and adjust your stop loss to fit. ALWAYS determine your technical chart stop loss first, and calculate your exact lot size:</p>
          <div class="bg-tradeDark p-3 rounded-lg border border-tradeBorder font-mono text-xs text-accentGold my-2">
            Lots = (Total Capital &times; 1% Risk) &divide; (Technical Point Stop &times; Lot Size)
          </div>
          <p class="mb-3">If you have ₹2,00,000 capital, your max risk per trade is 1% = ₹2,000. If Nifty's stop loss is 20 points (₹500 per lot), you can trade exactly 4 lots. No more, no less.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. The Mathematical Proof of Asymmetry: Why a 40% Win Rate Generates Fortune",
        content: `
          <p class="mb-3">Let us examine 10 institutional trades risking ₹1,000 to make ₹3,000 (1:3 Risk to Reward):</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>6 Losing Trades (60% Loss Rate):</strong> 6 &times; -₹1,000 = -₹6,000.</li>
            <li><strong>4 Winning Trades (40% Win Rate):</strong> 4 &times; +₹3,000 = +₹12,000.</li>
            <li><strong>Net Portfolio Result:</strong> +₹12,000 - ₹6,000 = <strong>+₹6,000 NET PROFIT</strong>.</li>
          </ul>
          <p class="mb-3">You were wrong most of the time, and you still made 60% return on risk capital. That is the statistical power of institutional trading.</p>
        `
      },
      {
        id: "sub-3",
        title: "3. The 3-Strike Daily Circuit Breaker Rule: Killing Revenge Trading",
        content: `
          <p class="mb-3">If you hit 3 consecutive stop losses in a single trading day, your trading terminal must be locked automatically. Three consecutive losses prove either market conditions do not fit your strategy today or your emotional psychology is compromised. Step away and live to fight tomorrow.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "Institutional Asymmetric Capital Defense Protocol",
      instrument: "Trading Portfolio Risk Engine",
      entryTrigger: "Pre-calculated position size verified before clicking buy",
      stopLoss: "Hard broker stop loss placed immediately upon order execution",
      target1: "2R (Sell 50% lots, move stop loss to breakeven)",
      target2: "3.5R to 5R (Let final runner run with trailing stop)",
      riskReward: "1:3.0 Minimum",
      executionChecklist: [
        "Risk on this trade is strictly &le; 1% of total trading account balance",
        "Stop loss is based on technical market structure, not an arbitrary dollar figure",
        "Risk-to-reward ratio to the first major target is at least 1:2.0",
        "No open trades if daily 3-strike circuit breaker has triggered"
      ],
      pitfalls: [
        "Averaging down on a losing options position",
        "Increasing position size after a loss to 'win it back' (revenge trading)"
      ]
    },
    svgBlueprint: makeSvg("1:3 ASYMMETRIC RISK MATRIX", "Why 40% Win Rate Compounds Huge Institutional Fortunes", `
      <!-- Risk Box -->
      <rect x="80" y="160" width="160" height="70" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" stroke-width="2" rx="6"/>
      <text x="160" y="190" fill="#ff3b57" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">1R UNIT RISK</text>
      <text x="160" y="210" fill="#ffffff" font-size="11" font-family="monospace" text-anchor="middle">-₹1,000 MAX LOSS</text>

      <!-- Reward Box 1 (2R) -->
      <rect x="280" y="130" width="160" height="100" fill="#00c076" fill-opacity="0.2" stroke="#00c076" stroke-width="2" rx="6"/>
      <text x="360" y="170" fill="#00c076" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">2R REWARD (T1)</text>
      <text x="360" y="195" fill="#ffffff" font-size="11" font-family="monospace" text-anchor="middle">+₹2,000 (LOCK 50%)</text>

      <!-- Reward Box 2 (3.5R) -->
      <rect x="480" y="90" width="180" height="140" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2" rx="6"/>
      <text x="570" y="145" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold" text-anchor="middle">3.5R RUNNER (T2)</text>
      <text x="570" y="170" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">+₹3,500 PROFIT</text>

      <!-- Explanatory Banner -->
      <rect x="80" y="250" width="580" height="50" fill="#151922" stroke="#232936" rx="6"/>
      <text x="370" y="272" fill="#f7a600" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">10 TRADES: 6 LOSSES (-6R) + 4 WINS (+14R) = +8R NET INSTITUTIONAL PROFIT</text>
      <text x="370" y="288" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Math beats emotion every single time on Dalal Street.</text>
    `)
  }
};

module.exports = { module7Topics };
