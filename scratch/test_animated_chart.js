/**
 * Test Animated Candlestick Chart Engine
 */

function generateAnimatedChart() {
  return `<svg viewBox="0 0 900 480" class="w-full h-auto rounded-xl shadow-2xl border border-[#2a2e39]" style="background-color: #131722; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <style>
      @keyframes candleReplay {
        0%, 15% { opacity: 0.2; }
        25%, 100% { opacity: 1; }
      }
      @keyframes triggerPulse {
        0%, 100% { filter: drop-shadow(0 0 2px #089981); opacity: 0.9; }
        50% { filter: drop-shadow(0 0 10px #089981); opacity: 1; }
      }
      @keyframes sweepAlert {
        0%, 100% { fill-opacity: 0.15; stroke-width: 1.2px; }
        50% { fill-opacity: 0.4; stroke-width: 2px; }
      }
      @keyframes priceBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      .anim-candle-late { animation: candleReplay 4s infinite alternate; }
      .anim-pulse { animation: triggerPulse 2s infinite ease-in-out; }
      .anim-sweep { animation: sweepAlert 2s infinite ease-in-out; }
      .anim-blink { animation: priceBlink 1.2s infinite; }
    </style>
  </defs>

  <!-- Top Bar -->
  <rect x="0" y="0" width="900" height="36" fill="#131722"/>
  <line x1="0" y1="36" x2="900" y2="36" stroke="#2a2e39" stroke-width="1"/>
  <text x="16" y="23" fill="#d1d4dc" font-size="12" font-weight="bold">NIFTY 50 • 5m • NSE</text>
  <circle cx="150" cy="19" r="4" fill="#089981" class="anim-blink"/>
  <text x="162" y="23" fill="#089981" font-size="11" font-weight="bold">LIVE CANDLESTICK REPLAY PLAYBACK</text>

  <!-- Right Price Axis -->
  <rect x="815" y="36" width="85" height="444" fill="#131722"/>
  <line x1="815" y1="36" x2="815" y2="480" stroke="#2a2e39" stroke-width="1"/>
  <text x="825" y="100" fill="#787b86" font-size="10">23,380.0</text>
  <text x="825" y="180" fill="#787b86" font-size="10">23,300.0</text>
  <text x="825" y="260" fill="#787b86" font-size="10">23,220.0</text>
  <text x="825" y="340" fill="#787b86" font-size="10">23,140.0</text>

  <!-- Grid lines -->
  <line x1="50" y1="100" x2="815" y2="100" stroke="#1e222d" stroke-dasharray="2"/>
  <line x1="50" y1="180" x2="815" y2="180" stroke="#1e222d" stroke-dasharray="2"/>
  <line x1="50" y1="260" x2="815" y2="260" stroke="#1e222d" stroke-dasharray="2"/>
  <line x1="50" y1="340" x2="815" y2="340" stroke="#1e222d" stroke-dasharray="2"/>

  <!-- Candlesticks Sample -->
  <g>
    <!-- Bearish Run -->
    <line x1="100" y1="120" x2="100" y2="200" stroke="#f23645" stroke-width="1.2"/>
    <rect x="94" y="130" width="12" height="55" fill="#f23645"/>

    <line x1="140" y1="170" x2="140" y2="245" stroke="#f23645" stroke-width="1.2"/>
    <rect x="134" y="180" width="12" height="50" fill="#f23645"/>

    <line x1="180" y1="210" x2="180" y2="295" stroke="#f23645" stroke-width="1.2"/>
    <rect x="174" y="225" width="12" height="55" fill="#f23645"/>

    <!-- Sweep Candle (Long Rejection Tail) -->
    <line x1="220" y1="260" x2="220" y2="360" stroke="#089981" stroke-width="1.5"/>
    <rect x="214" y="265" width="12" height="25" fill="#089981"/>

    <!-- Sweep Zone Alert Box -->
    <rect x="50" y="335" width="765" height="30" fill="#f23645" class="anim-sweep" stroke="#f23645" stroke-dasharray="3"/>
    <text x="60" y="352" fill="#f23645" font-size="10" font-family="monospace" font-weight="bold">LIQUIDITY SWEEP ZONE // RETAIL STOP RUN</text>

    <!-- Breakout Candle (Pulsing) -->
    <g class="anim-pulse">
      <line x1="260" y1="220" x2="260" y2="300" stroke="#089981" stroke-width="2"/>
      <rect x="252" y="230" width="16" height="60" fill="#089981" stroke="#089981"/>
    </g>

    <!-- Later Candles -->
    <g class="anim-candle-late">
      <line x1="300" y1="180" x2="300" y2="250" stroke="#089981" stroke-width="1.2"/>
      <rect x="294" y="190" width="12" height="45" fill="#089981"/>

      <line x1="340" y1="140" x2="340" y2="210" stroke="#089981" stroke-width="1.2"/>
      <rect x="334" y="150" width="12" height="48" fill="#089981"/>

      <line x1="380" y1="100" x2="380" y2="170" stroke="#089981" stroke-width="1.2"/>
      <rect x="374" y="110" width="12" height="50" fill="#089981"/>
    </g>
  </g>

  <!-- Long Position Box Tool -->
  <g class="anim-pulse">
    <!-- Green Target Box -->
    <rect x="260" y="110" width="400" height="120" fill="#089981" fill-opacity="0.18" stroke="#089981" stroke-width="1.2"/>
    <text x="270" y="130" fill="#089981" font-size="10" font-family="monospace" font-weight="bold">TARGET: +150.0 pts (1:3.0 RR)</text>

    <!-- Red Stop Loss Box -->
    <rect x="260" y="230" width="400" height="60" fill="#f23645" fill-opacity="0.18" stroke="#f23645" stroke-width="1.2"/>
    <text x="270" y="280" fill="#f23645" font-size="10" font-family="monospace" font-weight="bold">STOP LOSS: -50.0 pts</text>
  </g>

  <!-- Horizontal Level Line -->
  <line x1="50" y1="230" x2="815" y2="230" stroke="#089981" stroke-width="2" stroke-dasharray="4"/>
  <rect x="815" y="220" width="85" height="20" fill="#089981" rx="2"/>
  <text x="822" y="234" fill="#000000" font-size="9.5" font-family="monospace" font-weight="bold">ENTRY 23,250</text>
</svg>`;
}

module.exports = { generateAnimatedChart };
