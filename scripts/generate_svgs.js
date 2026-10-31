const fs = require('fs');
const path = require('path');

// Helper to wrap SVG in responsive container
function wrapSvg(title, subtitle, content) {
  return `<svg viewBox="0 0 920 480" class="w-full h-auto rounded-2xl shadow-2xl border border-[#2a2e39]" style="background-color: #131722; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, sans-serif;">
  <defs>
    <style>
      @keyframes pulseGlow {
        0%, 100% { filter: drop-shadow(0 0 2px #00c076); opacity: 0.95; }
        50% { filter: drop-shadow(0 0 8px #00c076); opacity: 1; }
      }
      @keyframes pulseRed {
        0%, 100% { filter: drop-shadow(0 0 2px #ff3b57); opacity: 0.95; }
        50% { filter: drop-shadow(0 0 8px #ff3b57); opacity: 1; }
      }
      @keyframes pulseGold {
        0%, 100% { filter: drop-shadow(0 0 2px #f7a600); }
        50% { filter: drop-shadow(0 0 8px #f7a600); }
      }
      .anim-glow-green { animation: pulseGlow 2.5s infinite ease-in-out; }
      .anim-glow-red { animation: pulseRed 2.5s infinite ease-in-out; }
      .anim-glow-gold { animation: pulseGold 2.5s infinite ease-in-out; }
    </style>
  </defs>

  <!-- Top Bar -->
  <rect x="0" y="0" width="920" height="40" fill="#171b26"/>
  <line x1="0" y1="40" x2="920" y2="40" stroke="#2a2e39" stroke-width="1"/>
  
  <!-- Title Badge -->
  <rect x="14" y="8" width="340" height="24" rx="5" fill="#1e222d" stroke="#2a2e39" stroke-width="1"/>
  <text x="24" y="24" fill="#ffffff" font-size="11" font-weight="bold">${title}</text>
  <text x="365" y="24" fill="#f7a600" font-size="10.5" font-family="monospace">${subtitle}</text>

  <!-- Watermark -->
  <text x="460" y="250" fill="#ffffff" fill-opacity="0.03" font-size="28" font-family="monospace" font-weight="900" text-anchor="middle">THE MARKET SNIPER SHOOTERS</text>

  <!-- Diagram Content -->
  ${content}

  <!-- Bottom Bar -->
  <line x1="0" y1="455" x2="920" y2="455" stroke="#2a2e39" stroke-width="1"/>
  <text x="20" y="471" fill="#787b86" font-size="10" font-family="monospace">AUTHENTIC VISUAL BLUEPRINT • REAL-WORLD INSTITUTIONAL SETUP</text>
  <text x="900" y="471" fill="#00c076" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">DALAL STREET TRADING DESK</text>
</svg>`;
}

// 22 DISTINCT REAL-WORLD SVGS
const svgBlueprints = {
  // 1. Candlestick Anatomy
  'topic-candle-anatomy': wrapSvg('CANDLESTICK ANATOMY', 'GREEN (BULLISH) VS RED (BEARISH)', `
    <!-- Bullish Candle (Green) -->
    <g transform="translate(180, 70)">
      <!-- Title -->
      <rect x="0" y="0" width="220" height="28" rx="6" fill="#09261a" stroke="#00c076" stroke-width="1"/>
      <text x="110" y="18" fill="#00c076" font-size="12" font-weight="bold" text-anchor="middle">🟢 GREEN CANDLE (BUYERS WON)</text>

      <!-- Upper Wick -->
      <line x1="110" y1="50" x2="110" y2="120" stroke="#00c076" stroke-width="3"/>
      <!-- Body -->
      <rect x="70" y="120" width="80" height="150" fill="#00c076" rx="3"/>
      <!-- Lower Wick -->
      <line x1="110" y1="270" x2="110" y2="330" stroke="#00c076" stroke-width="3"/>

      <!-- Annotations -->
      <!-- High -->
      <circle cx="110" cy="50" r="4" fill="#00c076"/>
      <line x1="110" y1="50" x2="20" y2="50" stroke="#00c076" stroke-width="1" stroke-dasharray="2"/>
      <rect x="-80" y="40" width="95" height="20" rx="3" fill="#151922" stroke="#00c076" stroke-width="1"/>
      <text x="-32" y="54" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">HIGH (Peak)</text>

      <!-- Close -->
      <circle cx="150" cy="120" r="4" fill="#ffffff"/>
      <line x1="150" y1="120" x2="210" y2="120" stroke="#ffffff" stroke-width="1" stroke-dasharray="2"/>
      <rect x="215" y="110" width="130" height="20" rx="3" fill="#151922" stroke="#00c076" stroke-width="1"/>
      <text x="280" y="124" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">CLOSE (Closed High)</text>

      <!-- Real Body -->
      <rect x="215" y="180" width="130" height="30" rx="3" fill="#09261a" stroke="#00c076" stroke-width="1"/>
      <text x="280" y="195" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">REAL BODY</text>
      <text x="280" y="206" fill="#00c076" font-size="8.5" text-anchor="middle">Strong Buying Power</text>

      <!-- Open -->
      <circle cx="150" cy="270" r="4" fill="#ffffff"/>
      <line x1="150" y1="270" x2="210" y2="270" stroke="#ffffff" stroke-width="1" stroke-dasharray="2"/>
      <rect x="215" y="260" width="130" height="20" rx="3" fill="#151922" stroke="#787b86" stroke-width="1"/>
      <text x="280" y="274" fill="#787b86" font-size="10" font-weight="bold" text-anchor="middle">OPEN (Started Here)</text>

      <!-- Low -->
      <circle cx="110" cy="330" r="4" fill="#00c076"/>
      <line x1="110" y1="330" x2="20" y2="330" stroke="#00c076" stroke-width="1" stroke-dasharray="2"/>
      <rect x="-80" y="320" width="95" height="20" rx="3" fill="#151922" stroke="#00c076" stroke-width="1"/>
      <text x="-32" y="334" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">LOW (Floor)</text>
    </g>

    <!-- Bearish Candle (Red) -->
    <g transform="translate(560, 70)">
      <!-- Title -->
      <rect x="0" y="0" width="220" height="28" rx="6" fill="#2c0f14" stroke="#ff3b57" stroke-width="1"/>
      <text x="110" y="18" fill="#ff3b57" font-size="12" font-weight="bold" text-anchor="middle">🔴 RED CANDLE (SELLERS WON)</text>

      <!-- Upper Wick -->
      <line x1="110" y1="50" x2="110" y2="100" stroke="#ff3b57" stroke-width="3"/>
      <!-- Body -->
      <rect x="70" y="100" width="80" height="170" fill="#ff3b57" rx="3"/>
      <!-- Lower Wick -->
      <line x1="110" y1="270" x2="110" y2="330" stroke="#ff3b57" stroke-width="3"/>

      <!-- Annotations -->
      <!-- High -->
      <circle cx="110" cy="50" r="4" fill="#ff3b57"/>
      <rect x="170" y="40" width="95" height="20" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="217" y="54" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">HIGH (Peak)</text>

      <!-- Open (Top of Red Body) -->
      <circle cx="70" cy="100" r="4" fill="#ffffff"/>
      <rect x="-80" y="90" width="130" height="20" rx="3" fill="#151922" stroke="#787b86" stroke-width="1"/>
      <text x="-15" y="104" fill="#787b86" font-size="10" font-weight="bold" text-anchor="middle">OPEN (Started High)</text>

      <!-- Close (Bottom of Red Body) -->
      <circle cx="70" cy="270" r="4" fill="#ffffff"/>
      <rect x="-80" y="260" width="130" height="20" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="-15" y="274" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">CLOSE (Closed Low)</text>

      <!-- Low -->
      <circle cx="110" cy="330" r="4" fill="#ff3b57"/>
      <rect x="170" y="320" width="95" height="20" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="217" y="334" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">LOW (Floor)</text>
    </g>
  `),

  // 2. Hammer & Inverted Hammer
  'topic-candle-hammer': wrapSvg('HAMMER CANDLE AT SUPPORT', 'BULLISH REVERSAL PINBAR SETUP', `
    <!-- Support Line -->
    <line x1="80" y1="340" x2="840" y2="340" stroke="#00c076" stroke-width="2" stroke-dasharray="4"/>
    <rect x="90" y="318" width="180" height="20" rx="3" fill="#09261a" stroke="#00c076" stroke-width="1"/>
    <text x="180" y="332" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">MAJOR SUPPORT LEVEL (FLOOR)</text>

    <!-- Downtrend Red Candles -->
    <line x1="160" y1="110" x2="160" y2="190" stroke="#ff3b57" stroke-width="2"/>
    <rect x="145" y="125" width="30" height="50" fill="#ff3b57" rx="2"/>

    <line x1="240" y1="160" x2="240" y2="250" stroke="#ff3b57" stroke-width="2"/>
    <rect x="225" y="180" width="30" height="55" fill="#ff3b57" rx="2"/>

    <line x1="320" y1="220" x2="320" y2="310" stroke="#ff3b57" stroke-width="2"/>
    <rect x="305" y="240" width="30" height="55" fill="#ff3b57" rx="2"/>

    <!-- The Hammer Candle -->
    <g class="anim-glow-green">
      <!-- Long Lower Wick (Tail) -->
      <line x1="420" y1="250" x2="420" y2="360" stroke="#00c076" stroke-width="3"/>
      <!-- Small Body at the Top -->
      <rect x="403" y="240" width="34" height="24" fill="#00c076" rx="2"/>
      <!-- Tiny Upper Wick -->
      <line x1="420" y1="235" x2="420" y2="240" stroke="#00c076" stroke-width="2"/>

      <!-- Rejection Tag -->
      <rect x="330" y="375" width="180" height="22" rx="4" fill="#151922" stroke="#00c076" stroke-width="1.2"/>
      <text x="420" y="390" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">LONG TAIL: BUYERS REJECTED LOWS</text>
    </g>

    <!-- Entry Trigger Line -->
    <line x1="400" y1="230" x2="780" y2="230" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="3"/>
    <rect x="445" y="205" width="160" height="22" rx="3" fill="#f7a600" fill-opacity="0.2" stroke="#f7a600" stroke-width="1"/>
    <text x="525" y="220" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">🎯 ENTRY: BUY ABOVE HIGH (23,150)</text>

    <!-- Stop Loss Line -->
    <line x1="400" y1="365" x2="650" y2="365" stroke="#ff3b57" stroke-width="1.5" stroke-dasharray="3"/>
    <rect x="445" y="370" width="150" height="22" rx="3" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" stroke-width="1"/>
    <text x="520" y="385" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">🛑 STOP LOSS: BELOW WICK (23,080)</text>

    <!-- Follow Through Green Candles (The Reversal Rally) -->
    <line x1="510" y1="180" x2="510" y2="260" stroke="#00c076" stroke-width="2"/>
    <rect x="495" y="190" width="30" height="60" fill="#00c076" rx="2"/>

    <line x1="600" y1="130" x2="600" y2="210" stroke="#00c076" stroke-width="2"/>
    <rect x="585" y="140" width="30" height="65" fill="#00c076" rx="2"/>

    <line x1="690" y1="80" x2="690" y2="160" stroke="#00c076" stroke-width="2"/>
    <rect x="675" y="90" width="30" height="65" fill="#00c076" rx="2"/>

    <!-- Target Line -->
    <line x1="400" y1="90" x2="840" y2="90" stroke="#00c076" stroke-width="2" stroke-dasharray="3"/>
    <rect x="715" y="70" width="130" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
    <text x="780" y="86" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">🏆 TARGET (+140 PTS)</text>
  `),

  // 3. Bullish & Bearish Engulfing
  'topic-candle-engulfing': wrapSvg('ENGULFING TAKEOVER PATTERNS', 'BULLISH ENGULFING VS BEARISH ENGULFING', `
    <!-- Left Panel: Bullish Engulfing -->
    <g transform="translate(60, 60)">
      <rect x="0" y="0" width="360" height="340" rx="12" fill="#171b26" stroke="#00c076" stroke-width="1"/>
      <text x="180" y="30" fill="#00c076" font-size="13" font-weight="bold" text-anchor="middle">🟢 BULLISH ENGULFING (BUY REVERSAL)</text>

      <!-- Small Red Candle -->
      <line x1="120" y1="140" x2="120" y2="220" stroke="#ff3b57" stroke-width="2"/>
      <rect x="105" y="155" width="30" height="50" fill="#ff3b57" rx="2"/>
      <text x="120" y="130" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">1. Small Red</text>

      <!-- Giant Green Candle Engulfing -->
      <g class="anim-glow-green">
        <line x1="200" y1="100" x2="200" y2="250" stroke="#00c076" stroke-width="2.5"/>
        <rect x="175" y="115" width="50" height="120" fill="#00c076" rx="3"/>
        <text x="200" y="90" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">2. Big Green Engulfs!</text>
      </g>

      <!-- Engulfing Bracket -->
      <line x1="165" y1="115" x2="165" y2="235" stroke="#f7a600" stroke-width="1.5"/>
      <line x1="160" y1="115" x2="165" y2="115" stroke="#f7a600" stroke-width="1.5"/>
      <line x1="160" y1="235" x2="165" y2="235" stroke="#f7a600" stroke-width="1.5"/>

      <rect x="40" y="270" width="280" height="45" rx="6" fill="#131722" stroke="#2a2e39" stroke-width="1"/>
      <text x="180" y="288" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">RULE: Green Body Completely Covers Red Body</text>
      <text x="180" y="303" fill="#00c076" font-size="9.5" text-anchor="middle">Signals aggressive institutional demand takeover.</text>
    </g>

    <!-- Right Panel: Bearish Engulfing -->
    <g transform="translate(480, 60)">
      <rect x="0" y="0" width="360" height="340" rx="12" fill="#171b26" stroke="#ff3b57" stroke-width="1"/>
      <text x="180" y="30" fill="#ff3b57" font-size="13" font-weight="bold" text-anchor="middle">🔴 BEARISH ENGULFING (SELL REVERSAL)</text>

      <!-- Small Green Candle -->
      <line x1="120" y1="150" x2="120" y2="230" stroke="#00c076" stroke-width="2"/>
      <rect x="105" y="165" width="30" height="50" fill="#00c076" rx="2"/>
      <text x="120" y="140" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">1. Small Green</text>

      <!-- Giant Red Candle Engulfing -->
      <g class="anim-glow-red">
        <line x1="200" y1="110" x2="200" y2="260" stroke="#ff3b57" stroke-width="2.5"/>
        <rect x="175" y="125" width="50" height="120" fill="#ff3b57" rx="3"/>
        <text x="200" y="100" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">2. Big Red Engulfs!</text>
      </g>

      <!-- Engulfing Bracket -->
      <line x1="165" y1="125" x2="165" y2="245" stroke="#f7a600" stroke-width="1.5"/>
      <line x1="160" y1="125" x2="165" y2="125" stroke="#f7a600" stroke-width="1.5"/>
      <line x1="160" y1="245" x2="165" y2="245" stroke="#f7a600" stroke-width="1.5"/>

      <rect x="40" y="270" width="280" height="45" rx="6" fill="#131722" stroke="#2a2e39" stroke-width="1"/>
      <text x="180" y="288" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">RULE: Red Body Completely Swallows Green Body</text>
      <text x="180" y="303" fill="#ff3b57" font-size="9.5" text-anchor="middle">Signals aggressive institutional supply dump at peak.</text>
    </g>
  `),

  // 4. Morning Star & Evening Star
  'topic-candle-stars': wrapSvg('MORNING STAR & EVENING STAR', '3-BAR INSTITUTIONAL REVERSAL CYCLES', `
    <!-- Morning Star Setup (Left) -->
    <g transform="translate(60, 60)">
      <rect x="0" y="0" width="370" height="340" rx="12" fill="#171b26" stroke="#00c076" stroke-width="1"/>
      <text x="185" y="28" fill="#00c076" font-size="12" font-weight="bold" text-anchor="middle">🌅 MORNING STAR (BULLISH 3-BAR CYCLE)</text>

      <!-- Candle 1: Big Bearish Red -->
      <line x1="80" y1="70" x2="80" y2="210" stroke="#ff3b57" stroke-width="2"/>
      <rect x="65" y="90" width="30" height="100" fill="#ff3b57" rx="2"/>
      <text x="80" y="235" fill="#ff3b57" font-size="9" text-anchor="middle">Bar 1: Strong Red</text>

      <!-- Candle 2: Small Star/Doji at Bottom -->
      <line x1="170" y1="190" x2="170" y2="250" stroke="#f7a600" stroke-width="2"/>
      <rect x="155" y="210" width="30" height="15" fill="#f7a600" rx="1"/>
      <text x="170" y="270" fill="#f7a600" font-size="9" font-weight="bold" text-anchor="middle">Bar 2: Star (Pause)</text>

      <!-- Candle 3: Big Bullish Green Breakout -->
      <g class="anim-glow-green">
        <line x1="260" y1="70" x2="260" y2="210" stroke="#00c076" stroke-width="2.5"/>
        <rect x="245" y="90" width="30" height="100" fill="#00c076" rx="2"/>
        <text x="260" y="235" fill="#00c076" font-size="9" font-weight="bold" text-anchor="middle">Bar 3: Strong Green</text>
      </g>

      <!-- 50% Benchmark Line -->
      <line x1="50" y1="140" x2="290" y2="140" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="185" y="135" fill="#38bdf8" font-size="9" text-anchor="middle">50% Line of Bar 1 (Green must close above)</text>

      <rect x="30" y="285" width="310" height="35" rx="6" fill="#131722" stroke="#2a2e39" stroke-width="1"/>
      <text x="185" y="306" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">ENTRY: Buy at close of Bar 3 | SL below Star</text>
    </g>

    <!-- Evening Star Setup (Right) -->
    <g transform="translate(480, 60)">
      <rect x="0" y="0" width="370" height="340" rx="12" fill="#171b26" stroke="#ff3b57" stroke-width="1"/>
      <text x="185" y="28" fill="#ff3b57" font-size="12" font-weight="bold" text-anchor="middle">🌆 EVENING STAR (BEARISH 3-BAR CYCLE)</text>

      <!-- Candle 1: Big Bullish Green -->
      <line x1="80" y1="110" x2="80" y2="250" stroke="#00c076" stroke-width="2"/>
      <rect x="65" y="130" width="30" height="100" fill="#00c076" rx="2"/>
      <text x="80" y="275" fill="#00c076" font-size="9" text-anchor="middle">Bar 1: Strong Green</text>

      <!-- Candle 2: Small Star/Doji at Top -->
      <line x1="170" y1="50" x2="170" y2="120" stroke="#f7a600" stroke-width="2"/>
      <rect x="155" y="75" width="30" height="15" fill="#f7a600" rx="1"/>
      <text x="170" y="45" fill="#f7a600" font-size="9" font-weight="bold" text-anchor="middle">Bar 2: Star (Exhaustion)</text>

      <!-- Candle 3: Big Bearish Red Breakdown -->
      <g class="anim-glow-red">
        <line x1="260" y1="110" x2="260" y2="250" stroke="#ff3b57" stroke-width="2.5"/>
        <rect x="245" y="130" width="30" height="100" fill="#ff3b57" rx="2"/>
        <text x="260" y="275" fill="#ff3b57" font-size="9" font-weight="bold" text-anchor="middle">Bar 3: Strong Red</text>
      </g>

      <!-- 50% Benchmark Line -->
      <line x1="50" y1="180" x2="290" y2="180" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="185" y="175" fill="#38bdf8" font-size="9" text-anchor="middle">50% Line of Bar 1 (Red must close below)</text>

      <rect x="30" y="285" width="310" height="35" rx="6" fill="#131722" stroke="#2a2e39" stroke-width="1"/>
      <text x="185" y="306" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">ENTRY: Sell / Buy PE at close of Bar 3 | SL above Star</text>
    </g>
  `),

  // 5. Double Bottom (W) & Double Top (M)
  'topic-double-bottom-top': wrapSvg('DOUBLE BOTTOM (W) & DOUBLE TOP (M)', 'PRICE ACTION REVERSAL GEOMETRY', `
    <!-- Left: Double Bottom W -->
    <g transform="translate(60, 50)">
      <rect x="0" y="0" width="370" height="360" rx="10" fill="#171b26" stroke="#00c076" stroke-width="1"/>
      <text x="185" y="28" fill="#00c076" font-size="12" font-weight="bold" text-anchor="middle">🟢 DOUBLE BOTTOM (W PATTERN)</text>

      <!-- Support Line -->
      <line x1="30" y1="280" x2="340" y2="280" stroke="#00c076" stroke-width="2" stroke-dasharray="3"/>
      <text x="40" y="272" fill="#00c076" font-size="9" font-weight="bold">SUPPORT FLOOR</text>

      <!-- Neckline -->
      <line x1="30" y1="140" x2="340" y2="140" stroke="#f7a600" stroke-width="2"/>
      <text x="40" y="132" fill="#f7a600" font-size="9" font-weight="bold">NECKLINE RESISTANCE</text>

      <!-- W Path -->
      <polyline points="40,90 100,280 180,140 260,280 320,80" fill="none" stroke="#00c076" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Bottom 1 & 2 circles -->
      <circle cx="100" cy="280" r="6" fill="#f7a600"/>
      <text x="100" y="305" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Bottom 1</text>

      <circle cx="260" cy="280" r="6" fill="#00c076"/>
      <text x="260" y="305" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">Bottom 2</text>

      <!-- Breakout Arrow -->
      <circle cx="295" cy="140" r="5" fill="#ffffff"/>
      <rect x="230" y="90" width="130" height="22" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="295" y="105" fill="#000000" font-size="9.5" font-weight="bold" text-anchor="middle">🎯 BUY ON BREAKOUT</text>
    </g>

    <!-- Right: Double Top M -->
    <g transform="translate(480, 50)">
      <rect x="0" y="0" width="370" height="360" rx="10" fill="#171b26" stroke="#ff3b57" stroke-width="1"/>
      <text x="185" y="28" fill="#ff3b57" font-size="12" font-weight="bold" text-anchor="middle">🔴 DOUBLE TOP (M PATTERN)</text>

      <!-- Resistance Ceiling -->
      <line x1="30" y1="100" x2="340" y2="100" stroke="#ff3b57" stroke-width="2" stroke-dasharray="3"/>
      <text x="40" y="92" fill="#ff3b57" font-size="9" font-weight="bold">RESISTANCE CEILING</text>

      <!-- Neckline -->
      <line x1="30" y1="230" x2="340" y2="230" stroke="#f7a600" stroke-width="2"/>
      <text x="40" y="222" fill="#f7a600" font-size="9" font-weight="bold">NECKLINE SUPPORT</text>

      <!-- M Path -->
      <polyline points="40,270 100,100 180,230 260,100 320,300" fill="none" stroke="#ff3b57" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Peak 1 & 2 circles -->
      <circle cx="100" cy="100" r="6" fill="#f7a600"/>
      <text x="100" y="80" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Top 1</text>

      <circle cx="260" cy="100" r="6" fill="#ff3b57"/>
      <text x="260" y="80" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">Top 2</text>

      <!-- Breakdown Arrow -->
      <circle cx="295" cy="230" r="5" fill="#ffffff"/>
      <rect x="230" y="240" width="130" height="22" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="295" y="255" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">🎯 SELL / BUY PE</text>
    </g>
  `),

  // 6. Head & Shoulders
  'topic-head-shoulders': wrapSvg('HEAD & SHOULDERS PATTERN', 'MAJOR REVERSAL FORMATION', `
    <g transform="translate(100, 60)">
      <!-- Neckline -->
      <line x1="50" y1="260" x2="680" y2="260" stroke="#f7a600" stroke-width="2.5" stroke-dasharray="4"/>
      <rect x="60" y="268" width="130" height="20" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="125" y="282" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">NECKLINE SUPPORT</text>

      <!-- Head & Shoulders Wave -->
      <path d="M 60,260 Q 140,110 200,260 Q 340,10 420,260 Q 500,120 580,260 L 660,370" fill="none" stroke="#ff3b57" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Left Shoulder -->
      <circle cx="140" cy="140" r="6" fill="#f7a600"/>
      <rect x="70" y="100" width="140" height="24" rx="4" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="140" y="116" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">LEFT SHOULDER (Peak 1)</text>

      <!-- Head -->
      <circle cx="340" cy="70" r="7" fill="#ff3b57" class="anim-glow-red"/>
      <rect x="260" y="25" width="160" height="26" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="340" y="42" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">👑 THE HEAD (Highest Peak)</text>

      <!-- Right Shoulder -->
      <circle cx="500" cy="150" r="6" fill="#f7a600"/>
      <rect x="430" y="105" width="140" height="24" rx="4" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="500" y="121" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">RIGHT SHOULDER (Lower)</text>

      <!-- Neckline Breakdown Trigger -->
      <circle cx="580" cy="260" r="7" fill="#00c076" class="anim-glow-green"/>
      <rect x="540" y="280" width="180" height="26" rx="5" fill="#ff3b57" stroke="#ffffff" stroke-width="1.2"/>
      <text x="630" y="297" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 ENTRY: SHORT ON BREAK</text>

      <!-- Target Arrow -->
      <line x1="630" y1="310" x2="630" y2="380" stroke="#00c076" stroke-width="2.5" stroke-dasharray="2"/>
      <rect x="570" y="380" width="120" height="22" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="630" y="395" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 TARGET HIT</text>
    </g>
  `),

  // 7. Bull & Bear Flags
  'topic-flags-pennants': wrapSvg('BULL FLAG CONTINUATION PATTERN', 'INSTITUTIONAL MOMENTUM SETUP', `
    <g transform="translate(100, 60)">
      <!-- The Flagpole (Strong Upward Impulse) -->
      <line x1="80" y1="340" x2="280" y2="80" stroke="#00c076" stroke-width="6" stroke-linecap="round"/>
      <rect x="70" y="200" width="130" height="24" rx="4" fill="#09261a" stroke="#00c076" stroke-width="1"/>
      <text x="135" y="216" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">🚀 THE FLAGPOLE</text>

      <!-- Flag Channel Lines (Downward Slanting) -->
      <line x1="260" y1="60" x2="520" y2="150" stroke="#f7a600" stroke-width="2.5"/>
      <line x1="240" y1="130" x2="500" y2="220" stroke="#f7a600" stroke-width="2.5"/>

      <!-- Shaded Flag Area -->
      <polygon points="260,60 520,150 500,220 240,130" fill="#f7a600" fill-opacity="0.08"/>

      <!-- Zigzag within channel -->
      <polyline points="280,80 320,160 380,105 420,185 480,135" fill="none" stroke="#ffffff" stroke-width="2"/>
      <rect x="330" y="125" width="120" height="20" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="390" y="139" fill="#f7a600" font-size="9" text-anchor="middle">FLAG CONSOLIDATION</text>

      <!-- Breakout -->
      <line x1="480" y1="135" x2="680" y2="30" stroke="#00c076" stroke-width="5" stroke-linecap="round" class="anim-glow-green"/>
      <circle cx="505" cy="145" r="6" fill="#00c076"/>

      <!-- Entry Callout -->
      <rect x="460" y="170" width="160" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1.2"/>
      <text x="540" y="186" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🎯 ENTRY: FLAG BREAKOUT</text>

      <!-- Target Box -->
      <rect x="620" y="10" width="150" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="695" y="27" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">🏆 TARGET = POLE LENGTH</text>
    </g>
  `),

  // 8. Triangles & Wedges
  'topic-triangles-wedges': wrapSvg('ASCENDING TRIANGLE BREAKOUT', 'BULLISH PRESSURE SQUEEZE', `
    <g transform="translate(100, 60)">
      <!-- Flat Resistance Ceiling -->
      <line x1="100" y1="100" x2="620" y2="100" stroke="#ff3b57" stroke-width="3"/>
      <rect x="110" y="70" width="180" height="22" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="200" y="85" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">FLAT RESISTANCE CEILING</text>

      <!-- Ascending Trendline (Higher Lows) -->
      <line x1="100" y1="340" x2="580" y2="100" stroke="#00c076" stroke-width="3"/>
      <rect x="140" y="315" width="200" height="22" rx="3" fill="#151922" stroke="#00c076" stroke-width="1"/>
      <text x="240" y="330" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">HIGHER LOWS (BUYERS AGGRESSIVE)</text>

      <!-- Bouncing Price Action Inside -->
      <polyline points="100,340 180,100 260,250 340,100 420,180 500,100" fill="none" stroke="#ffffff" stroke-width="2.5"/>

      <!-- Higher Lows Markers -->
      <circle cx="260" cy="250" r="5" fill="#00c076"/>
      <circle cx="420" cy="180" r="5" fill="#00c076"/>

      <!-- Breakout Explosive Arrow -->
      <line x1="500" y1="100" x2="680" y2="20" stroke="#00c076" stroke-width="5" stroke-linecap="round" class="anim-glow-green"/>
      <circle cx="530" cy="100" r="7" fill="#00c076"/>

      <rect x="540" y="115" width="180" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="630" y="132" fill="#000000" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 EXPLOSIVE CEILING BREAK</text>

      <!-- Target Milestone -->
      <rect x="650" y="5" width="140" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="720" y="21" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 TARGET REACHED</text>
    </g>
  `),

  // 9. Malaysian SNR
  'topic-malaysian-snr': wrapSvg('MALAYSIAN SNR: V-SHAPED PEAKS', 'SHARP REVERSAL KEY LEVELS', `
    <g transform="translate(80, 60)">
      <!-- Sharp V-Peak Resistance Level -->
      <line x1="80" y1="120" x2="720" y2="120" stroke="#ff3b57" stroke-width="2" stroke-dasharray="4"/>
      <rect x="80" y="90" width="190" height="22" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="175" y="105" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">SHARP V-PEAK RESISTANCE</text>

      <!-- Original V Peak -->
      <polyline points="100,280 200,120 280,300" fill="none" stroke="#ff3b57" stroke-width="4"/>
      <circle cx="200" cy="120" r="6" fill="#ff3b57"/>
      <text x="200" y="80" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Sharp V (Origin)</text>

      <!-- Price Retesting the Level Later -->
      <polyline points="280,300 420,240 520,120" fill="none" stroke="#00c076" stroke-width="3"/>
      
      <!-- Rejection at Retest -->
      <circle cx="520" cy="120" r="7" fill="#ff3b57" class="anim-glow-red"/>
      <line x1="520" y1="120" x2="680" y2="340" stroke="#ff3b57" stroke-width="4.5" stroke-linecap="round"/>

      <rect x="450" y="135" width="200" height="26" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="550" y="152" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 ENTRY: RETEST OF V-PEAK</text>

      <rect x="580" y="320" width="140" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="650" y="336" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 TARGET REACHED</text>
    </g>
  `),

  // 10. Malaysian QMR
  'topic-malaysian-qmr': wrapSvg('MALAYSIAN QUASIMODO REVERSAL (QMR)', 'HIGHER HIGH LIQUIDITY SWEEP & LEFT SHOULDER RETEST', `
    <g transform="translate(80, 50)">
      <!-- Left Shoulder Horizontal Line -->
      <line x1="80" y1="160" x2="720" y2="160" stroke="#f7a600" stroke-width="2" stroke-dasharray="3"/>
      <rect x="80" y="130" width="180" height="22" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="170" y="145" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">LEFT SHOULDER (QMR LEVEL)</text>

      <!-- QMR Structure (H -> L -> HH -> LL) -->
      <!-- High (Left Shoulder) -->
      <polyline points="80,260 180,160 260,260 380,80 480,340 560,160 680,360" fill="none" stroke="#ff3b57" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

      <circle cx="180" cy="160" r="6" fill="#f7a600"/>
      <text x="180" y="185" fill="#f7a600" font-size="11" font-weight="bold" text-anchor="middle">H (High)</text>

      <circle cx="260" cy="260" r="6" fill="#ffffff"/>
      <text x="260" y="285" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">L (Low)</text>

      <!-- Higher High (Sweep) -->
      <circle cx="380" cy="80" r="7" fill="#ff3b57" class="anim-glow-red"/>
      <text x="380" y="60" fill="#ff3b57" font-size="12" font-weight="bold" text-anchor="middle">HH (Trap Sweep)</text>

      <!-- Lower Low (Break of Structure) -->
      <circle cx="480" cy="340" r="6" fill="#ff3b57"/>
      <text x="480" y="365" fill="#ff3b57" font-size="11" font-weight="bold" text-anchor="middle">LL (Structure Broken)</text>

      <!-- Exact QMR Entry at Retest of Left Shoulder -->
      <circle cx="560" cy="160" r="8" fill="#00c076" class="anim-glow-green"/>
      <rect x="520" y="105" width="200" height="28" rx="5" fill="#00c076" stroke="#ffffff" stroke-width="1.2"/>
      <text x="620" y="123" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">🎯 QMR ENTRY: RETEST OF H</text>
    </g>
  `),

  // 11. Fair Value Gap (FVG)
  'topic-fvg-imbalance': wrapSvg('3-BAR FAIR VALUE GAP (FVG)', 'INSTITUTIONAL IMBALANCE & RETEST BOX', `
    <g transform="translate(140, 60)">
      <!-- Candle 1: Normal Green -->
      <line x1="120" y1="200" x2="120" y2="340" stroke="#00c076" stroke-width="2"/>
      <rect x="100" y="230" width="40" height="80" fill="#00c076" rx="2"/>
      <text x="120" y="365" fill="#787b86" font-size="10" font-weight="bold" text-anchor="middle">Candle 1</text>
      <circle cx="120" cy="200" r="4" fill="#f7a600"/>

      <!-- Candle 2: GIANT Explosive Green Displacement -->
      <line x1="240" y1="60" x2="240" y2="280" stroke="#00c076" stroke-width="2.5"/>
      <rect x="215" y="80" width="50" height="170" fill="#00c076" rx="3"/>
      <text x="240" y="365" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">Candle 2 (Big Move)</text>

      <!-- Candle 3: Following Green -->
      <line x1="360" y1="40" x2="360" y2="150" stroke="#00c076" stroke-width="2"/>
      <rect x="340" y="60" width="40" height="60" fill="#00c076" rx="2"/>
      <text x="360" y="365" fill="#787b86" font-size="10" font-weight="bold" text-anchor="middle">Candle 3</text>
      <circle cx="360" cy="150" r="4" fill="#38bdf8"/>

      <!-- THE FVG SHADED BOX (Between Candle 1 High and Candle 3 Low) -->
      <rect x="120" y="150" width="460" height="50" fill="#38bdf8" fill-opacity="0.18" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3"/>
      
      <!-- FVG Tag -->
      <rect x="420" y="160" width="180" height="24" rx="4" fill="#131722" stroke="#38bdf8" stroke-width="1"/>
      <text x="510" y="176" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">FAIR VALUE GAP (IMBALANCE)</text>

      <!-- Candle 4 Retesting FVG -->
      <line x1="480" y1="120" x2="480" y2="180" stroke="#ff3b57" stroke-width="2"/>
      <rect x="465" y="130" width="30" height="35" fill="#ff3b57" rx="2"/>
      
      <!-- Entry Bounce Arrow -->
      <line x1="480" y1="180" x2="600" y2="40" stroke="#00c076" stroke-width="4" stroke-linecap="round" class="anim-glow-green"/>
      <circle cx="480" cy="180" r="6" fill="#00c076"/>
      <rect x="480" y="210" width="160" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="560" y="226" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🎯 BUY ON RETEST OF GAP</text>
    </g>
  `),

  // 12. Inversion FVG (iFVG)
  'topic-ifvg-inversion': wrapSvg('INVERSION FVG (iFVG) BLUEPRINT', 'VIOLATED GAP TURNS INTO OPPOSITE ZONE', `
    <g transform="translate(100, 60)">
      <!-- Original FVG Zone Box -->
      <rect x="80" y="160" width="650" height="60" fill="#f7a600" fill-opacity="0.15" stroke="#f7a600" stroke-width="1.5" stroke-dasharray="4"/>
      <rect x="90" y="130" width="180" height="22" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="180" y="145" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">ORIGINAL BULLISH FVG BOX</text>

      <!-- Sellers violently smash through it -->
      <line x1="120" y1="80" x2="340" y2="300" stroke="#ff3b57" stroke-width="4.5" stroke-linecap="round"/>
      <rect x="250" y="250" width="160" height="22" rx="3" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="330" y="265" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">SMASHED THROUGH! (INVERSION)</text>

      <!-- Retest from underneath -->
      <line x1="340" y1="300" x2="480" y2="180" stroke="#00c076" stroke-width="3"/>
      
      <!-- Rejection down from iFVG ceiling -->
      <circle cx="480" cy="180" r="7" fill="#ff3b57" class="anim-glow-red"/>
      <line x1="480" y1="180" x2="660" y2="350" stroke="#ff3b57" stroke-width="5" stroke-linecap="round"/>

      <rect x="420" y="125" width="220" height="26" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1.2"/>
      <text x="530" y="142" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 iFVG ENTRY: RETEST FROM BELOW</text>

      <rect x="580" y="340" width="130" height="22" rx="3" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="645" y="355" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 TARGET REACHED</text>
    </g>
  `),

  // 13. PDH & PDL Sweeps
  'topic-amt-pdh-pdl': wrapSvg('PREVIOUS DAY HIGH / LOW SWEEPS', 'STOP HUNTING & LIQUIDITY ABSORPTION', `
    <g transform="translate(80, 50)">
      <!-- PDH Line -->
      <line x1="60" y1="130" x2="740" y2="130" stroke="#ff3b57" stroke-width="2.5" stroke-dasharray="4"/>
      <rect x="70" y="100" width="190" height="22" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="165" y="115" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">PREVIOUS DAY HIGH (PDH)</text>

      <!-- PDL Line -->
      <line x1="60" y1="330" x2="740" y2="330" stroke="#00c076" stroke-width="2.5" stroke-dasharray="4"/>
      <rect x="70" y="338" width="190" height="22" rx="3" fill="#151922" stroke="#00c076" stroke-width="1"/>
      <text x="165" y="353" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">PREVIOUS DAY LOW (PDL)</text>

      <!-- Morning False Breakout Above PDH (The Sweep Trap) -->
      <path d="M 120,240 Q 220,180 320,130 L 380,80 L 420,140 Q 520,240 640,330" fill="none" stroke="#ff3b57" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Sweep Circle & Callout -->
      <circle cx="380" cy="80" r="7" fill="#f7a600" class="anim-glow-gold"/>
      <rect x="300" y="35" width="160" height="26" rx="4" fill="#f7a600" stroke="#ffffff" stroke-width="1"/>
      <text x="380" y="52" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🚨 PDH SWEEP (RETAIL TRAPPED)</text>

      <!-- Short Entry on breakdown back inside range -->
      <circle cx="420" cy="140" r="7" fill="#00c076" class="anim-glow-green"/>
      <rect x="440" y="145" width="180" height="26" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="530" y="162" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">🎯 ENTRY: SHORT BACK INTO RANGE</text>

      <!-- Target at PDL -->
      <circle cx="640" cy="330" r="6" fill="#00c076"/>
      <rect x="580" y="300" width="130" height="22" rx="3" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="645" y="315" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 TARGET = PDL LINE</text>
    </g>
  `),

  // 14. Atlas AMT Value Areas
  'topic-amt-value-areas': wrapSvg('VOLUME PROFILE: VALUE AREA (VAH/VAL/POC)', 'AUCTION MARKET THEORY 80% ROTATION RULE', `
    <g transform="translate(100, 50)">
      <!-- Value Area High (VAH) -->
      <line x1="50" y1="90" x2="680" y2="90" stroke="#ff3b57" stroke-width="2"/>
      <rect x="60" y="65" width="160" height="20" rx="3" fill="#151922" stroke="#ff3b57" stroke-width="1"/>
      <text x="140" y="79" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">VAH (VALUE AREA HIGH)</text>

      <!-- Point of Control (POC - Highest Volume) -->
      <line x1="50" y1="210" x2="680" y2="210" stroke="#f7a600" stroke-width="2.5" stroke-dasharray="3"/>
      <rect x="60" y="195" width="220" height="22" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="170" y="210" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">POC (POINT OF CONTROL - HIGHEST VOLUME)</text>

      <!-- Value Area Low (VAL) -->
      <line x1="50" y1="330" x2="680" y2="330" stroke="#00c076" stroke-width="2"/>
      <rect x="60" y="338" width="160" height="20" rx="3" fill="#151922" stroke="#00c076" stroke-width="1"/>
      <text x="140" y="352" fill="#00c076" font-size="10" font-weight="bold" text-anchor="middle">VAL (VALUE AREA LOW)</text>

      <!-- Rotation Path from VAL to VAH (80% Rule) -->
      <path d="M 120,330 Q 240,320 340,210 Q 440,110 560,90" fill="none" stroke="#00c076" stroke-width="4.5" stroke-linecap="round"/>

      <circle cx="120" cy="330" r="7" fill="#00c076" class="anim-glow-green"/>
      <rect x="140" y="300" width="170" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="225" y="316" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🎯 BUY AT VAL (DISCOUNT)</text>

      <circle cx="340" cy="210" r="6" fill="#f7a600"/>
      <text x="340" y="185" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Target 1: POC (Fair Price)</text>

      <circle cx="560" cy="90" r="7" fill="#00c076"/>
      <rect x="500" y="55" width="130" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="565" y="71" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 TARGET 2: VAH</text>
    </g>
  `),

  // 15. Judas Swing
  'topic-judas-swing': wrapSvg('THE 9:15 AM OPENING JUDAS SWING', 'HOW SMART MONEY TRAPS AMATEURS AT MARKET OPEN', `
    <g transform="translate(80, 50)">
      <!-- Key Resistance -->
      <line x1="60" y1="150" x2="740" y2="150" stroke="#f7a600" stroke-width="2" stroke-dasharray="3"/>
      <rect x="70" y="125" width="160" height="20" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="150" y="139" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">DAY HIGH RESISTANCE</text>

      <!-- 9:15 Fake Pump -->
      <path d="M 120,250 L 220,90 L 320,180 L 460,340" fill="none" stroke="#ff3b57" stroke-width="4.5" stroke-linecap="round"/>

      <!-- 9:15 Trap Tag -->
      <circle cx="220" cy="90" r="7" fill="#ff3b57" class="anim-glow-red"/>
      <rect x="140" y="45" width="160" height="26" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="220" y="62" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">⏰ 9:15-9:20 AM FAKE PUMP</text>

      <!-- Real Trend Reversal at 9:30 -->
      <circle cx="320" cy="180" r="7" fill="#00c076" class="anim-glow-green"/>
      <rect x="340" y="170" width="210" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="445" y="187" fill="#000000" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 9:30 AM REAL MOVE (SHORT)</text>

      <!-- Target -->
      <rect x="420" y="340" width="150" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="495" y="356" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🏆 DAY LOW HIT (+150 PTS)</text>
    </g>
  `),

  // 16. Fibonacci Golden Pocket
  'topic-fib-golden-pocket': wrapSvg('FIBONACCI 0.618 - 0.650 GOLDEN POCKET', 'THE HIGH PROBABILITY INSTITUTIONAL BOUNCE ZONE', `
    <g transform="translate(100, 50)">
      <!-- Fib Levels -->
      <line x1="50" y1="80" x2="680" y2="80" stroke="#787b86" stroke-width="1.5"/>
      <text x="690" y="84" fill="#787b86" font-size="10" font-family="monospace">0.0 (Swing High)</text>

      <line x1="50" y1="160" x2="680" y2="160" stroke="#787b86" stroke-width="1"/>
      <text x="690" y="164" fill="#787b86" font-size="10" font-family="monospace">0.382</text>

      <line x1="50" y1="210" x2="680" y2="210" stroke="#787b86" stroke-width="1"/>
      <text x="690" y="214" fill="#787b86" font-size="10" font-family="monospace">0.500 (Halfway)</text>

      <!-- GOLDEN POCKET SHADED ZONE (0.618 to 0.650) -->
      <rect x="50" y="240" width="630" height="40" fill="#f7a600" fill-opacity="0.2" stroke="#f7a600" stroke-width="1.5"/>
      <text x="690" y="264" fill="#f7a600" font-size="11" font-weight="bold" font-family="monospace">0.618 - 0.650 GOLDEN POCKET</text>

      <line x1="50" y1="340" x2="680" y2="340" stroke="#787b86" stroke-width="1.5"/>
      <text x="690" y="344" fill="#787b86" font-size="10" font-family="monospace">1.0 (Swing Low)</text>

      <!-- Wave 1 up, Pullback into Golden Zone, Wave 3 Explosion -->
      <polyline points="80,340 260,80 440,255 640,30" fill="none" stroke="#00c076" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Bounce Circle in Golden Pocket -->
      <circle cx="440" cy="255" r="8" fill="#f7a600" class="anim-glow-gold"/>
      <rect x="340" y="275" width="200" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1.2"/>
      <text x="440" y="292" fill="#000000" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 ENTRY: BUY IN GOLDEN POCKET</text>
    </g>
  `),

  // 17. Fibonacci Extensions
  'topic-fib-extensions': wrapSvg('FIBONACCI EXTENSION TARGETS', '1.272 & 1.618 EXPANSION TARGETS', `
    <g transform="translate(100, 50)">
      <!-- Extension Levels -->
      <line x1="50" y1="60" x2="680" y2="60" stroke="#00c076" stroke-width="2" stroke-dasharray="3"/>
      <text x="690" y="64" fill="#00c076" font-size="11" font-weight="bold" font-family="monospace">1.618 EXTENSION TARGET</text>

      <line x1="50" y1="120" x2="680" y2="120" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="690" y="124" fill="#38bdf8" font-size="10" font-family="monospace">1.272 EXTENSION</text>

      <line x1="50" y1="200" x2="680" y2="200" stroke="#787b86" stroke-width="1"/>
      <text x="690" y="204" fill="#787b86" font-size="10" font-family="monospace">1.000 (Peak of Wave 1)</text>

      <line x1="50" y1="320" x2="680" y2="320" stroke="#787b86" stroke-width="1"/>
      <text x="690" y="324" fill="#787b86" font-size="10" font-family="monospace">0.000 (Base)</text>

      <!-- 3-Wave Expansion -->
      <polyline points="80,320 220,200 320,280 560,60" fill="none" stroke="#00c076" stroke-width="4.5" stroke-linecap="round"/>

      <text x="140" y="240" fill="#ffffff" font-size="11" font-weight="bold">Wave 1</text>
      <text x="280" y="240" fill="#f7a600" font-size="11" font-weight="bold">Wave 2 Pullback</text>
      <text x="440" y="140" fill="#00c076" font-size="12" font-weight="bold">Wave 3 Expansion 🚀</text>

      <circle cx="560" cy="60" r="7" fill="#00c076" class="anim-glow-green"/>
      <rect x="490" y="15" width="150" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="565" y="32" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">🏆 1.618 PROFIT BOOKING</text>
    </g>
  `),

  // 18. RSI Divergence
  'topic-rsi-divergence': wrapSvg('BULLISH RSI DIVERGENCE', 'PRICE MAKES LOWER LOW, RSI MAKES HIGHER LOW', `
    <!-- Top Half: Price Action -->
    <g transform="translate(80, 50)">
      <rect x="0" y="0" width="760" height="170" rx="8" fill="#171b26" stroke="#2a2e39" stroke-width="1"/>
      <text x="20" y="25" fill="#ffffff" font-size="11" font-weight="bold">NIFTY 50 SPOT PRICE (MAKING LOWER LOWS)</text>

      <polyline points="60,60 160,130 280,80 440,150 560,40" fill="none" stroke="#ff3b57" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Low 1 & Low 2 on Price -->
      <circle cx="160" cy="130" r="5" fill="#f7a600"/>
      <text x="160" y="150" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">Low 1</text>

      <circle cx="440" cy="150" r="5" fill="#ff3b57"/>
      <text x="440" y="165" fill="#ff3b57" font-size="10" font-weight="bold" text-anchor="middle">Low 2 (Lower Low)</text>

      <!-- Downward Trendline on Price -->
      <line x1="160" y1="130" x2="440" y2="150" stroke="#ff3b57" stroke-width="2" stroke-dasharray="3"/>
    </g>

    <!-- Bottom Half: RSI Indicator -->
    <g transform="translate(80, 240)">
      <rect x="0" y="0" width="760" height="170" rx="8" fill="#171b26" stroke="#00c076" stroke-width="1"/>
      <text x="20" y="25" fill="#00c076" font-size="11" font-weight="bold">RSI (14) INDICATOR (MAKING HIGHER LOWS = HIDDEN POWER!)</text>

      <!-- 30 Oversold Line -->
      <line x1="40" y1="120" x2="720" y2="120" stroke="#787b86" stroke-width="1" stroke-dasharray="2"/>
      <text x="730" y="124" fill="#787b86" font-size="9" font-family="monospace">30 OVERSOLD</text>

      <polyline points="60,90 160,135 280,80 440,105 560,50" fill="none" stroke="#00c076" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Low 1 & Low 2 on RSI -->
      <circle cx="160" cy="135" r="5" fill="#f7a600"/>
      <circle cx="440" cy="105" r="6" fill="#00c076" class="anim-glow-green"/>

      <!-- Upward Trendline on RSI -->
      <line x1="160" y1="135" x2="440" y2="105" stroke="#00c076" stroke-width="2.5"/>

      <rect x="470" y="90" width="220" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="580" y="107" fill="#000000" font-size="10.5" font-weight="bold" text-anchor="middle">🎯 BULLISH DIVERGENCE CONFIRMED</text>
    </g>
  `),

  // 19. VWAP Bands
  'topic-vwap-bands': wrapSvg('VWAP & STANDARD DEVIATION BANDS', 'MEAN REVERSION & OVERBOUGHT / OVERSOLD EXECUTION', `
    <g transform="translate(80, 50)">
      <!-- +2 Sigma Upper Band -->
      <line x1="60" y1="80" x2="740" y2="80" stroke="#ff3b57" stroke-width="2" stroke-dasharray="3"/>
      <text x="70" y="70" fill="#ff3b57" font-size="10" font-weight="bold">+2σ BAND (EXTREME OVERBOUGHT - SELL ZONE)</text>

      <!-- VWAP Benchmark Center -->
      <line x1="60" y1="200" x2="740" y2="200" stroke="#f7a600" stroke-width="3"/>
      <rect x="70" y="188" width="180" height="24" rx="4" fill="#151922" stroke="#f7a600" stroke-width="1.2"/>
      <text x="160" y="204" fill="#f7a600" font-size="10.5" font-weight="bold" text-anchor="middle">VWAP (INSTITUTIONAL AVERAGE)</text>

      <!-- -2 Sigma Lower Band -->
      <line x1="60" y1="320" x2="740" y2="320" stroke="#00c076" stroke-width="2" stroke-dasharray="3"/>
      <text x="70" y="340" fill="#00c076" font-size="10" font-weight="bold">-2σ BAND (EXTREME DISCOUNT - BUY ZONE)</text>

      <!-- Price Oscillating Between Bands -->
      <path d="M 80,200 Q 180,75 280,200 Q 380,325 480,200 Q 580,75 680,180" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Buy at -2 Sigma -->
      <circle cx="380" cy="325" r="7" fill="#00c076" class="anim-glow-green"/>
      <rect x="300" y="345" width="160" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="380" y="361" fill="#000000" font-size="10" font-weight="bold" text-anchor="middle">🎯 BUY AT -2σ (DISCOUNT)</text>

      <!-- Sell at +2 Sigma -->
      <circle cx="180" cy="75" r="7" fill="#ff3b57" class="anim-glow-red"/>
      <rect x="195" y="85" width="160" height="24" rx="4" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="275" y="101" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">🛑 SELL AT +2σ (EXPENSIVE)</text>
    </g>
  `),

  // 20. Options Greeks & Gamma Explosion
  'topic-options-greeks-gamma': wrapSvg('OPTIONS 1:15 PM GAMMA EXPLOSION', 'EXPIRY DAY HERO-ZERO PAYOFF CURVE', `
    <g transform="translate(80, 50)">
      <!-- Axes -->
      <line x1="80" y1="340" x2="740" y2="340" stroke="#2a2e39" stroke-width="2"/>
      <line x1="80" y1="50" x2="80" y2="340" stroke="#2a2e39" stroke-width="2"/>

      <text x="80" y="35" fill="#00c076" font-size="12" font-weight="bold">OPTION PREMIUM (₹)</text>
      <text x="730" y="365" fill="#787b86" font-size="11" font-weight="bold" text-anchor="end">INDEX MOVEMENT (POINTS) ➔</text>

      <!-- Linear Delta Curve -->
      <line x1="80" y1="320" x2="400" y2="280" stroke="#787b86" stroke-width="2" stroke-dasharray="3"/>
      <text x="220" y="270" fill="#787b86" font-size="10">Slow Morning Decay</text>

      <!-- Exponential Gamma Curve after 1:15 PM -->
      <path d="M 400,280 Q 480,260 560,180 Q 640,60 680,50" fill="none" stroke="#00c076" stroke-width="5" stroke-linecap="round" class="anim-glow-green"/>

      <!-- Milestone 1: ₹20 entry -->
      <circle cx="400" cy="280" r="6" fill="#f7a600"/>
      <rect x="330" y="300" width="140" height="22" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="400" y="315" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">BUY AT ₹20 (1:15 PM)</text>

      <!-- Milestone 2: ₹140 explosive profit -->
      <circle cx="680" cy="50" r="8" fill="#00c076"/>
      <rect x="580" y="15" width="190" height="26" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="675" y="32" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">🚀 ₹140+ (+600% GAMMA BLAST)</text>
    </g>
  `),

  // 21. Equal Pairs Hedge
  'topic-equal-pairs-hedge': wrapSvg('EQUAL CE & PE PAIR STRADDLE BREAKOUT', 'DELTA-NEUTRAL BIG MOVE HEDGE', `
    <g transform="translate(80, 50)">
      <!-- Entry baseline -->
      <line x1="60" y1="200" x2="740" y2="200" stroke="#f7a600" stroke-width="2" stroke-dasharray="3"/>
      <rect x="70" y="175" width="230" height="22" rx="3" fill="#151922" stroke="#f7a600" stroke-width="1"/>
      <text x="185" y="190" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">BUY CE @ ₹50 + PE @ ₹50 (INVEST: ₹100)</text>

      <!-- Market Explodes Upward -->
      <!-- CE Explodes to ₹260 -->
      <path d="M 300,200 Q 450,150 640,60" fill="none" stroke="#00c076" stroke-width="5" stroke-linecap="round" class="anim-glow-green"/>
      <circle cx="640" cy="60" r="7" fill="#00c076"/>
      <rect x="530" y="30" width="170" height="24" rx="4" fill="#00c076" stroke="#ffffff" stroke-width="1"/>
      <text x="615" y="46" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle">CALL (CE) WINS: ₹260</text>

      <!-- PE decays to max ₹10 floor -->
      <path d="M 300,200 Q 450,260 640,310" fill="none" stroke="#ff3b57" stroke-width="3" stroke-linecap="round"/>
      <circle cx="640" cy="310" r="5" fill="#ff3b57"/>
      <rect x="530" y="320" width="170" height="22" rx="3" fill="#ff3b57" stroke="#ffffff" stroke-width="1"/>
      <text x="615" y="335" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">PUT (PE) LOSES: ₹10</text>

      <!-- Math Result Box -->
      <rect x="220" y="270" width="280" height="50" rx="8" fill="#09261a" stroke="#00c076" stroke-width="1.5"/>
      <text x="360" y="292" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">TOTAL PAYOUT: ₹260 + ₹10 = ₹270</text>
      <text x="360" y="310" fill="#00c076" font-size="11" font-weight="bold" text-anchor="middle">NET PROFIT: +₹170 PER LOT (+170%)</text>
    </g>
  `),

  // 22. Risk Management
  'topic-risk-management': wrapSvg('1:3 RISK-TO-REWARD BLUEPRINT', 'CAPITAL PRESERVATION & WIN-RATE MATHEMATICS', `
    <g transform="translate(80, 50)">
      <!-- Visual Trade Box -->
      <g transform="translate(80, 60)">
        <!-- Green Target Box (3x size) -->
        <rect x="0" y="0" width="260" height="180" fill="#00c076" fill-opacity="0.2" stroke="#00c076" stroke-width="2"/>
        <text x="130" y="95" fill="#00c076" font-size="16" font-weight="bold" text-anchor="middle">+₹3,000 PROFIT (3R)</text>

        <!-- Entry Line -->
        <line x1="0" y1="180" x2="260" y2="180" stroke="#f7a600" stroke-width="3"/>
        <text x="130" y="175" fill="#f7a600" font-size="10" font-weight="bold" text-anchor="middle">🎯 ENTRY LEVEL</text>

        <!-- Red Stop Loss Box (1x size) -->
        <rect x="0" y="180" width="260" height="60" fill="#ff3b57" fill-opacity="0.2" stroke="#ff3b57" stroke-width="2"/>
        <text x="130" y="215" fill="#ff3b57" font-size="14" font-weight="bold" text-anchor="middle">-₹1,000 RISK (1R)</text>
      </g>

      <!-- The Truth Matrix Table (Right side) -->
      <g transform="translate(380, 50)">
        <rect x="0" y="0" width="360" height="260" rx="10" fill="#171b26" stroke="#2a2e39" stroke-width="1"/>
        <text x="180" y="30" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">WHY 1:3 RISK-REWARD MAKES YOU WEALTHY</text>

        <line x1="20" y1="45" x2="340" y2="45" stroke="#2a2e39" stroke-width="1"/>

        <text x="30" y="75" fill="#787b86" font-size="11">Take 10 Trades at 1:3 Ratio:</text>
        <text x="30" y="105" fill="#ff3b57" font-size="11">❌ Lose 6 Trades (-₹1,000 × 6) =</text>
        <text x="330" y="105" fill="#ff3b57" font-size="11" font-weight="bold" text-anchor="end">-₹6,000</text>

        <text x="30" y="135" fill="#00c076" font-size="11">✅ Win Only 4 Trades (+₹3,000 × 4) =</text>
        <text x="330" y="135" fill="#00c076" font-size="11" font-weight="bold" text-anchor="end">+₹12,000</text>

        <line x1="20" y1="160" x2="340" y2="160" stroke="#00c076" stroke-width="1.5"/>

        <text x="30" y="190" fill="#ffffff" font-size="13" font-weight="bold">NET RESULT (Only 40% Win Rate):</text>
        <text x="330" y="190" fill="#00c076" font-size="15" font-weight="900" text-anchor="end">+₹6,000 PROFIT</text>

        <rect x="20" y="215" width="320" height="32" rx="4" fill="#09261a" stroke="#00c076" stroke-width="1"/>
        <text x="180" y="235" fill="#00c076" font-size="10.5" font-weight="bold" text-anchor="middle">Golden Rule: Cut losses fast. Let winners run.</text>
      </g>
    </g>
  `)
};

console.log('Generated 22 distinct, custom SVG blueprints!');

// Export the SVGs so we can assemble academy-data.js
module.exports = { svgBlueprints };
