const { makeSvg } = require('./build_full_academy.js');

const module6Topics = {
  // 16. RSI DIVERGENCE (REGULAR VS HIDDEN)
  "topic-rsi-divergence": {
    id: "topic-rsi-divergence",
    moduleId: "module-indicators",
    category: "indicators",
    title: "RSI Divergence Mastery: Regular vs Hidden Signals",
    subtitle: "De-coding momentum deceleration before it shows on candlesticks",
    moduleTitle: "Momentum Filters, RSI Divergences & VWAP Benchmark",
    level: "Advanced",
    readTime: "12 min",
    analystNote: "Price tells you where the market has been; momentum tells you where the market has the power to go. A divergence between Price and the Relative Strength Index (RSI) is the earliest warning that institutional velocity has detached from retail price chasing.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Physics of Momentum: Velocity of Price vs Rate of Change" },
      { id: "sub-2", title: "2. Regular Divergence: Catching Violent Institutional Trend Reversals" },
      { id: "sub-3", title: "3. Hidden Divergence: The Secret Trend Continuation Footprint" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. The Overbought Fallacy: Why Strong Bull Trends Stay Above RSI 70 for Days" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Physics of Momentum: Velocity of Price vs Rate of Change",
        content: `
          <p class="mb-3">The Relative Strength Index (RSI) measures the internal speed and change of price movements. When price makes a higher high, but the RSI makes a noticeably lower high, price is moving upward on <strong>borrowed time</strong>.</p>
          <p class="mb-3">Institutional buying volume has dried up, and market makers are simply lifting offers into thin retail air. A sharp reversal is imminent.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Regular Divergence: Catching Violent Institutional Trend Reversals",
        content: `
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Regular Bearish Divergence:</strong> Price makes Higher High (HH), but RSI makes Lower High (LH). Setup for PE Put buy or short trade.</li>
            <li><strong>Regular Bullish Divergence:</strong> Price makes Lower Low (LL), but RSI makes Higher Low (HL). Setup for CE Call buy or long reversal.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Hidden Divergence: The Secret Trend Continuation Footprint",
        content: `
          <p class="mb-3">Hidden divergence is the elite trend-following weapon:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>Hidden Bullish Divergence:</strong> Price makes a Higher Low (HL) during a pullback, but RSI makes a deeper Lower Low (LL). This proves that even though momentum flushed violently, price refused to drop below structural support. When buyers step in, the trend explodes higher with massive force.</li>
          </ul>
        `
      }
    ],
    tradeDetails: {
      setupType: "RSI Momentum Divergence Structural Exhaustion",
      instrument: "NIFTY Spot / ATM Option",
      entryTrigger: "Breakout of the intermediate candle low/high that connects the divergence peaks",
      stopLoss: "1 tick above/below the divergence price extreme (-45 pts)",
      target1: "RSI crosses 50 centerline / first horizontal support (+90 pts / 1:2.0 RR)",
      target2: "Opposing oversold/overbought zone (+160 pts / 1:3.5 RR)",
      riskReward: "1:3.5",
      executionChecklist: [
        "Divergence clearly visible across at least 10 to 25 candles on 5-min or 15-min chart",
        "RSI is in extreme overbought (&gt;70) or oversold (&lt;30) territory during initial peak",
        "Price action prints a clear reversal candle (engulfing or pin bar) at the second peak",
        "Volume declines on the second peak compared to the first"
      ],
      pitfalls: [
        "Blindly shorting an RSI that is merely overbought (&gt;70) without a confirmed divergence",
        "Trading divergence across tiny 1-minute chart micro-swings"
      ]
    },
    svgBlueprint: makeSvg("RSI REGULAR BEARISH DIVERGENCE", "Price Makes Higher High vs RSI Making Lower High", `
      <!-- Price Chart Top Half -->
      <line x1="80" y1="180" x2="680" y2="180" stroke="#1d2432" stroke-width="2"/>
      <text x="60" y="70" fill="#f7a600" font-size="10" font-family="monospace">PRICE ACTION (NIFTY 50)</text>

      <!-- Price Peaks (Higher High) -->
      <path d="M 100 150 L 220 90 L 320 135 L 450 70 L 560 170" fill="none" stroke="#00c076" stroke-width="3"/>
      <circle cx="220" cy="90" r="6" fill="#00c076"/>
      <text x="190" y="80" fill="#00c076" font-size="10" font-family="monospace">HIGH 1 (23,250)</text>

      <circle cx="450" cy="70" r="6" fill="#00c076"/>
      <text x="420" y="55" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">HIGHER HIGH (23,380)</text>

      <!-- Price Trendline Rising -->
      <line x1="220" y1="90" x2="450" y2="70" stroke="#00c076" stroke-width="2.5" stroke-dasharray="4"/>

      <!-- RSI Panel Bottom Half -->
      <rect x="60" y="210" width="620" height="110" fill="#151922" stroke="#232936" rx="6"/>
      <line x1="60" y1="240" x2="680" y2="240" stroke="#ff3b57" stroke-dasharray="2"/>
      <text x="70" y="235" fill="#ff3b57" font-size="9" font-family="monospace">OVERBOUGHT 70 LINE</text>

      <line x1="60" y1="295" x2="680" y2="295" stroke="#00c076" stroke-dasharray="2"/>
      <text x="70" y="290" fill="#00c076" font-size="9" font-family="monospace">OVERSOLD 30 LINE</text>

      <!-- RSI Curve (Lower High) -->
      <path d="M 100 280 L 220 225 L 320 270 L 450 255 L 560 300" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="220" cy="225" r="5" fill="#ff3b57"/>
      <text x="210" y="218" fill="#ff3b57" font-size="9" font-family="monospace">RSI: 78</text>

      <circle cx="450" cy="255" r="5" fill="#ff3b57"/>
      <text x="440" y="248" fill="#ff3b57" font-size="9" font-family="monospace">RSI: 62 (LOWER HIGH!)</text>

      <!-- RSI Divergence Trendline Falling -->
      <line x1="220" y1="225" x2="450" y2="255" stroke="#ff3b57" stroke-width="2.5" stroke-dasharray="4"/>
      <text x="280" y="260" fill="#ff3b57" font-size="11" font-family="monospace" font-weight="bold">BEARISH MOMENTUM EXHAUSTION</text>

      <!-- Reversal Breakdown Arrow -->
      <path d="M 450 70 L 580 175" fill="none" stroke="#ff3b57" stroke-width="4"/>
      <rect x="520" y="110" width="160" height="24" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" rx="4"/>
      <text x="530" y="126" fill="#ff3b57" font-size="10" font-family="monospace" font-weight="bold">PE PUT BUY ENTRY</text>
    `)
  },

  // 17. VWAP & STANDARD DEVIATION BANDS
  "topic-vwap-bands": {
    id: "topic-vwap-bands",
    moduleId: "module-indicators",
    category: "indicators",
    title: "VWAP & Standard Deviation Bands (±1σ, ±2σ)",
    subtitle: "How institutional execution algorithms (TWAP/VWAP) benchmark every fill",
    moduleTitle: "Momentum Filters, RSI Divergences & VWAP Benchmark",
    level: "Intermediate to Advanced",
    readTime: "12 min",
    analystNote: "Mutual funds and domestic institutional investors (DIIs) do not execute orders using candlestick patterns. They execute using volume-weighted execution algorithms. If an institutional trader buys above VWAP, they are fired for buying at a premium. VWAP is the true gravitational baseline of Dalal Street.",
    tableOfContents: [
      { id: "sub-1", title: "1. The Volume Weighted Average Price: The True Value Line of Dalal Street" },
      { id: "sub-2", title: "2. Standard Deviation Envelopes (±1σ, ±2σ): Overextended Mean Reversion Zones" },
      { id: "sub-3", title: "3. Anchored VWAP: Anchoring to Major RBI Announcements & Swing Lows" },
      { id: "sub-4", title: "4. Visual Technical Blueprint (Picture Form)" },
      { id: "sub-5", title: "5. Sniper Trade Execution Matrix" },
      { id: "sub-6", title: "6. Trying to Fade a Flat VWAP Trend Day (The Freight Train Error)" }
    ],
    subTopics: [
      {
        id: "sub-1",
        title: "1. The Volume Weighted Average Price: The True Value Line of Dalal Street",
        content: `
          <p class="mb-3">Unlike simple moving averages (SMAs) which treat low-volume holiday bars equal to massive option expiry blocks, VWAP weights every tick by exact trade volume:</p>
          <div class="bg-tradeDark p-3 rounded-lg border border-tradeBorder font-mono text-xs text-accentGold my-2">
            VWAP = &sum;(Price &times; Volume) &divide; &sum;(Volume)
          </div>
          <p class="mb-3">Above VWAP = Institutional Bullish Territory. Below VWAP = Institutional Bearish Territory.</p>
        `
      },
      {
        id: "sub-2",
        title: "2. Standard Deviation Envelopes (±1σ, ±2σ): Overextended Mean Reversion Zones",
        content: `
          <ul class="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-300">
            <li><strong>+1&sigma; and -1&sigma; Bands:</strong> 68.2% of all daily volume trades within this envelope. This is the normal value area.</li>
            <li><strong>+2&sigma; and -2&sigma; Bands:</strong> 95.4% of all volume trades within 2 standard deviations. When price touches +2&sigma; on a range day, it is statistically overextended. Buying here is retail suicide; smart money fades this back to VWAP.</li>
          </ul>
        `
      },
      {
        id: "sub-3",
        title: "3. Anchored VWAP: Anchoring to Major RBI Announcements & Swing Lows",
        content: `
          <p class="mb-3">Do not reset VWAP only at 9:15 AM each morning. Anchor your VWAP to major market structural events: the RBI Interest Rate decision candle, Union Budget day, or the swing low of the week.</p>
        `
      }
    ],
    tradeDetails: {
      setupType: "VWAP Standard Deviation Mean Reversion / Trend Pullback",
      instrument: "NIFTY Spot / ATM Option",
      entryTrigger: "Trend Play: First test of central VWAP line | Reversion Play: Rejection at +2σ band",
      stopLoss: "1 tick beyond 15-min candle extreme (-45 pts)",
      target1: "Central VWAP line (for mean reversion) or +1σ band (+85 pts / 1:2.0 RR)",
      target2: "+2σ band (for trend runners) (+150 pts / 1:3.3 RR)",
      riskReward: "1:3.3",
      executionChecklist: [
        "VWAP slope is clearly trending (upward or downward, not flat)",
        "Price pulls back to VWAP and produces an immediate rejection wick",
        "Volume dries up on the approach to VWAP and surges upon bounce",
        "Only take first 2 tests of VWAP; afternoon tests are susceptible to gamma chop"
      ],
      pitfalls: [
        "Fading price at +2σ on a runaway trend day with strong foreign institutional buying",
        "Trading when price chops through VWAP back and forth every 3 minutes"
      ]
    },
    svgBlueprint: makeSvg("INSTITUTIONAL VWAP BANDS", "Central VWAP & ±2σ Statistical Extremes", `
      <!-- +2σ Upper Band -->
      <path d="M 80 80 Q 300 65 680 90" fill="none" stroke="#ff3b57" stroke-width="2" stroke-dasharray="3"/>
      <text x="540" y="80" fill="#ff3b57" font-size="10" font-family="monospace">+2&sigma; STATISTICAL EXTREME (OVERBOUGHT)</text>

      <!-- +1σ Band -->
      <path d="M 80 130 Q 300 120 680 145" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2"/>

      <!-- Central VWAP Line (The Value Line) -->
      <path d="M 80 180 Q 300 175 680 195" fill="none" stroke="#f7a600" stroke-width="3.5"/>
      <text x="500" y="215" fill="#f7a600" font-size="11" font-family="monospace" font-weight="bold">CENTRAL VWAP LINE (INSTITUTIONAL VALUE)</text>

      <!-- -1σ Band -->
      <path d="M 80 230 Q 300 230 680 250" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2"/>

      <!-- -2σ Lower Band -->
      <path d="M 80 280 Q 300 285 680 305" fill="none" stroke="#00c076" stroke-width="2" stroke-dasharray="3"/>
      <text x="540" y="320" fill="#00c076" font-size="10" font-family="monospace">-2&sigma; OVERSOLD REVERSION ZONE</text>

      <!-- Price Action Bouncing on VWAP -->
      <path d="M 100 120 L 220 180 L 340 100 L 460 185 L 600 70" fill="none" stroke="#00c076" stroke-width="3"/>
      <circle cx="220" cy="180" r="7" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="170" y="200" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">VWAP BOUNCE 1</text>

      <circle cx="460" cy="185" r="7" fill="#00c076" stroke="#ffffff" stroke-width="2"/>
      <text x="410" y="200" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold">VWAP BOUNCE 2 (CALL ENTRY)</text>
    `)
  }
};

module.exports = { module6Topics };
