const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Add executive-charts.js to script tags
if (!html.includes('executive-charts.js')) {
  html = html.replace(
    '<script src="academy-data.js?v=4.0"></script>',
    '<script src="executive-charts.js?v=5.0"></script>\n  <script src="academy-data.js?v=5.0"></script>'
  );
  html = html.replace('app.js?v=4.0', 'app.js?v=5.0');
}

// 2. Replace Sidebar Section 2 & 3 with Modern Executive Workspaces + Tools
const oldSidebarSection2Start = '<!-- SECTION 2: LIVE TRADING TOOLS -->';
const oldSidebarSection3End = '<!-- Quick syllabus jumps -->';

const newSidebarNav = `<!-- SECTION 2: EXECUTIVE WORKSPACES (THE 3 PILLARS) -->
      <div class="space-y-1.5">
        <div class="px-2 text-[10px] font-bold uppercase tracking-wider text-accentGold flex items-center justify-between">
          <span>EXECUTIVE WORKSPACES</span>
          <span class="text-[9px] bg-accentGold/20 text-accentGold font-mono px-1.5 py-0.2 rounded font-bold">PRIMARY</span>
        </div>

        <button id="sideTabExecutive" onclick="switchTab('executive')" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 bg-tradeDark text-white border border-tradeBorder shadow-sm">
          <i data-lucide="layout-dashboard" class="w-4 h-4 text-accentGold"></i>
          <span class="flex-1">🎯 Executive Center</span>
        </button>

        <button id="sideTabBull" onclick="switchTab('bull')" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-bullGreen hover:bg-bullGreen/10 border border-transparent">
          <i data-lucide="trending-up" class="w-4 h-4 text-bullGreen"></i>
          <span class="flex-1">🟢 Bull Desk (CE Trades)</span>
          <span class="text-[9px] bg-bullGreen/20 text-bullGreen px-1.5 py-0.5 rounded-full font-mono font-bold" id="sideBullBadge">BUY CE</span>
        </button>

        <button id="sideTabBear" onclick="switchTab('bear')" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-bearRed hover:bg-bearRed/10 border border-transparent">
          <i data-lucide="trending-down" class="w-4 h-4 text-bearRed"></i>
          <span class="flex-1">🔴 Bear Desk (PE Trades)</span>
          <span class="text-[9px] bg-bearRed/20 text-bearRed px-1.5 py-0.5 rounded-full font-mono font-bold" id="sideBearBadge">BUY PE</span>
        </button>

        <button id="sideTabAcademy" onclick="openAcademyDashboard()" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-accentGold hover:bg-accentGold/10 border border-transparent">
          <i data-lucide="graduation-cap" class="w-4 h-4 text-accentGold"></i>
          <span class="flex-1">🎓 Learning Hub (Academy)</span>
          <span class="text-[9px] bg-accentGold/20 text-accentGold px-1.5 py-0.5 rounded-full font-mono font-bold">8 MODS</span>
        </button>
      </div>

      <!-- SECTION 3: SNIPER DESK TOOLS -->
      <div class="space-y-1 pt-2 border-t border-tradeBorder/60">
        <div class="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          DESK INTELLIGENCE TOOLS
        </div>

        <button id="sideTabEqual" onclick="switchTab('equal')" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-white hover:bg-tradeDark">
          <i data-lucide="scale" class="w-4 h-4 text-accentGold"></i>
          <span class="flex-1">Equal CE & PE Pairs</span>
          <span class="text-[10px] bg-accentGold/20 text-accentGold px-1.5 py-0.2 rounded-full font-mono" id="sideEqualCount">--</span>
        </button>

        <button id="sideTabHero" onclick="switchTab('hero')" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-white hover:bg-tradeDark">
          <i data-lucide="zap" class="w-4 h-4 text-bullGreen"></i>
          <span class="flex-1">Hero-Zero Hotlist</span>
          <span class="text-[10px] bg-bullGreen/20 text-bullGreen px-1.5 py-0.2 rounded-full font-mono" id="sideHeroCount">--</span>
        </button>

        <button id="sideTabNews" onclick="switchTab('news')" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-white hover:bg-tradeDark">
          <i data-lucide="newspaper" class="w-4 h-4 text-cyan-400"></i>
          <span class="flex-1">Live News & Impact</span>
          <span class="text-[9px] bg-cyan-400/20 text-cyan-400 px-1 py-0.2 rounded font-mono animate-pulse">LIVE</span>
        </button>

        <button id="sideTabLadder" onclick="switchTab('ladder')" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-white hover:bg-tradeDark">
          <i data-lucide="list" class="w-4 h-4 text-indigo-400"></i>
          <span class="flex-1">Full Option Ladder</span>
        </button>
      </div>

      <!-- Quick syllabus jumps -->`;

if (html.includes(oldSidebarSection2Start) && html.includes(oldSidebarSection3End)) {
  const sIdx = html.indexOf(oldSidebarSection2Start);
  const eIdx = html.indexOf(oldSidebarSection3End) + oldSidebarSection3End.length;
  html = html.substring(0, sIdx) + newSidebarNav + html.substring(eIdx);
}

// 3. Update top tabs bar
const oldTabsStart = '<!-- TABS BAR -->';
const oldTabsEnd = '<!-- VIEW 1: EQUAL CE & PE PAIRS';

const newTabsBar = `<!-- TABS BAR -->
    <div class="flex flex-wrap items-center justify-between border-b border-tradeBorder pb-2 gap-2">
      <div class="flex flex-wrap gap-1.5">
        <button id="tabExecutive" onclick="switchTab('executive')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition bg-tradeCard text-white border border-tradeBorder shadow">
          <i data-lucide="layout-dashboard" class="w-4 h-4 text-accentGold"></i>
          <span>🎯 Executive Hub</span>
        </button>

        <button id="tabBull" onclick="switchTab('bull')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-bullGreen">
          <i data-lucide="trending-up" class="w-4 h-4 text-bullGreen"></i>
          <span>🟢 Bull Desk (CE)</span>
        </button>

        <button id="tabBear" onclick="switchTab('bear')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-bearRed">
          <i data-lucide="trending-down" class="w-4 h-4 text-bearRed"></i>
          <span>🔴 Bear Desk (PE)</span>
        </button>

        <button id="tabAcademy" onclick="openAcademyDashboard()" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-accentGold">
          <i data-lucide="graduation-cap" class="w-4 h-4 text-accentGold"></i>
          <span>🎓 Master Academy</span>
        </button>

        <button id="tabEqual" onclick="switchTab('equal')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white">
          <i data-lucide="scale" class="w-4 h-4 text-accentGold"></i>
          <span>⚖️ Equal Pairs</span>
          <span class="text-[10px] bg-accentGold/20 text-accentGold px-1.5 py-0.5 rounded-full" id="equalPairsCount">--</span>
        </button>

        <button id="tabHero" onclick="switchTab('hero')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white">
          <i data-lucide="zap" class="w-4 h-4 text-bullGreen"></i>
          <span>⚡ Hero-Zero</span>
          <span class="text-[10px] bg-bullGreen/20 text-bullGreen px-1.5 py-0.5 rounded-full" id="heroPicksCount">--</span>
        </button>

        <button id="tabNews" onclick="switchTab('news')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white">
          <i data-lucide="newspaper" class="w-4 h-4 text-cyan-400"></i>
          <span>📰 Live News</span>
          <span class="text-[10px] bg-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
        </button>

        <button id="tabLadder" onclick="switchTab('ladder')" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white">
          <i data-lucide="list" class="w-4 h-4 text-indigo-400"></i>
          <span>📊 Ladder</span>
        </button>
      </div>

      <!-- Quick Search / Filter -->
      <div class="relative w-44">
        <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500"></i>
        <input type="text" id="strikeSearch" oninput="filterStrikes()" placeholder="Filter strike..." class="w-full bg-tradeCard border border-tradeBorder rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-bullGreen">
      </div>
    </div>\n\n    `;

if (html.includes(oldTabsStart) && html.includes(oldTabsEnd)) {
  const tIdx1 = html.indexOf(oldTabsStart);
  const tIdx2 = html.indexOf(oldTabsEnd);
  html = html.substring(0, tIdx1) + newTabsBar + html.substring(tIdx2);
}

// 4. Create the New Views: viewExecutive, viewBullDesk, viewBearDesk
const executiveAndDesksHtml = `
    <!-- ========================================== -->
    <!-- 1. EXECUTIVE COMMAND CENTER (THE 3 PILLARS) -->
    <!-- ========================================== -->
    <section id="viewExecutive" class="space-y-6">

      <!-- Executive Hero Banner -->
      <div class="bg-gradient-to-r from-tradeCard via-[#11151f] to-tradeCard border-2 border-accentGold/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-56 h-56 bg-accentGold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-bullGreen animate-ping"></span>
              <span class="text-[10px] font-mono uppercase tracking-widest text-accentGold font-bold">DALAL STREET INSTITUTIONAL QUANT TERMINAL</span>
            </div>
            <h1 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              EXECUTIVE TRADING COMMAND CENTER
            </h1>
            <p class="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Welcome to the institutional trading desk. Select any workspace below: analyze the <strong>Bull Diagram</strong> for Call (CE) execution, the <strong>Bear Diagram</strong> for Put (PE) breakdown, or enter the <strong>Master Learning Hub</strong> for deep algorithmic training.
            </p>
          </div>

          <!-- Quick Index Switchers in Hero -->
          <div class="flex items-center gap-2 bg-tradeDark p-1.5 rounded-xl border border-tradeBorder">
            <button id="heroIdxNifty" onclick="switchIndex('nifty')" class="px-3.5 py-2 rounded-lg text-xs font-bold transition bg-bullGreen text-black shadow">
              NIFTY 50
            </button>
            <button id="heroIdxSensex" onclick="switchIndex('sensex')" class="px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white">
              SENSEX
            </button>
            <button id="heroIdxBankNifty" onclick="switchIndex('banknifty')" class="px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white">
              BANK NIFTY
            </button>
          </div>
        </div>
      </div>

      <!-- THE THREE PRIMARY WORKSPACE PILLARS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- PILLAR 1: BULL DIAGRAM & CALL (CE) WORKSPACE -->
        <div class="bg-tradeCard border-2 border-bullGreen/40 hover:border-bullGreen rounded-2xl p-5 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-bullGreen/5 rounded-full blur-2xl pointer-events-none"></div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2.5 py-1 rounded-md uppercase font-bold bg-bullGreen/15 text-bullGreen border border-bullGreen/30 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-bullGreen animate-pulse"></span>
                PILLAR 01 • BULL DESK
              </span>
              <span class="text-xs font-mono text-bullGreen font-bold" id="execBullSentiment">PCR: 1.22 (BULLISH)</span>
            </div>

            <div>
              <h2 class="text-lg font-black text-white group-hover:text-bullGreen transition flex items-center gap-2">
                🟢 BULL DIAGRAM & CE WORKSPACE
              </h2>
              <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                Institutional long expansion engine. Captures demand absorption sweeps, iFVG inversions, and high-conviction Call options with exact reasons and macro news effect.
              </p>
            </div>

            <!-- Embedded Interactive Bull Diagram Preview -->
            <div class="rounded-xl overflow-hidden border border-tradeBorder shadow-inner cursor-pointer" onclick="switchTab('bull')" title="Click to open Full Bull Workspace">
              <div id="execBullChartContainer">
                <!-- Bull SVG rendered dynamically -->
              </div>
            </div>

            <!-- Live CE Trade Summary Pill -->
            <div class="bg-tradeDark/90 p-3 rounded-xl border border-bullGreen/20 space-y-1.5 text-xs">
              <div class="flex items-center justify-between text-gray-300">
                <span class="text-gray-400 font-mono text-[11px]">Primary Call Recommendation:</span>
                <strong class="text-bullGreen font-mono font-bold" id="execBullStrike">NIFTY 23200 CE</strong>
              </div>
              <div class="flex items-center justify-between text-[11px] font-mono">
                <span class="text-gray-400">Entry Trigger:</span>
                <span class="text-white font-bold" id="execBullEntry">Spot &gt; 23,165</span>
              </div>
              <div class="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Targets: <strong class="text-bullGreen" id="execBullT1">₹182.0</strong> | <strong class="text-cyan-400" id="execBullT2">₹236.0</strong></span>
                <span>SL: <strong class="text-bearRed" id="execBullSL">₹105.0</strong></span>
              </div>
            </div>
          </div>

          <button onclick="switchTab('bull')" class="w-full py-3 rounded-xl bg-bullGreen hover:bg-bullGreen/90 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-bullGreen/20 mt-2">
            <span>Enter Bull Workspace (CE Execution)</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- PILLAR 2: BEAR DIAGRAM & PUT (PE) WORKSPACE -->
        <div class="bg-tradeCard border-2 border-bearRed/40 hover:border-bearRed rounded-2xl p-5 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-bearRed/5 rounded-full blur-2xl pointer-events-none"></div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2.5 py-1 rounded-md uppercase font-bold bg-bearRed/15 text-bearRed border border-bearRed/30 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-bearRed animate-pulse"></span>
                PILLAR 02 • BEAR DESK
              </span>
              <span class="text-xs font-mono text-bearRed font-bold" id="execBearSentiment">CE OI RESISTANCE WALL</span>
            </div>

            <div>
              <h2 class="text-lg font-black text-white group-hover:text-bearRed transition flex items-center gap-2">
                🔴 BEAR DIAGRAM & PE WORKSPACE
              </h2>
              <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                Institutional short breakdown engine. Executes Malaysian QMR retests, PDH liquidity hunts, and high-conviction Put options with exact reasons and macro news effect.
              </p>
            </div>

            <!-- Embedded Interactive Bear Diagram Preview -->
            <div class="rounded-xl overflow-hidden border border-tradeBorder shadow-inner cursor-pointer" onclick="switchTab('bear')" title="Click to open Full Bear Workspace">
              <div id="execBearChartContainer">
                <!-- Bear SVG rendered dynamically -->
              </div>
            </div>

            <!-- Live PE Trade Summary Pill -->
            <div class="bg-tradeDark/90 p-3 rounded-xl border border-bearRed/20 space-y-1.5 text-xs">
              <div class="flex items-center justify-between text-gray-300">
                <span class="text-gray-400 font-mono text-[11px]">Primary Put Recommendation:</span>
                <strong class="text-bearRed font-mono font-bold" id="execBearStrike">BANKNIFTY 51100 PE</strong>
              </div>
              <div class="flex items-center justify-between text-[11px] font-mono">
                <span class="text-gray-400">Entry Trigger:</span>
                <span class="text-white font-bold" id="execBearEntry">Spot &lt; 51,280</span>
              </div>
              <div class="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Targets: <strong class="text-bullGreen" id="execBearT1">₹310.0</strong> | <strong class="text-cyan-400" id="execBearT2">₹400.0</strong></span>
                <span>SL: <strong class="text-bearRed" id="execBearSL">₹180.0</strong></span>
              </div>
            </div>
          </div>

          <button onclick="switchTab('bear')" class="w-full py-3 rounded-xl bg-bearRed hover:bg-bearRed/90 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-bearRed/20 mt-2">
            <span>Enter Bear Workspace (PE Execution)</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- PILLAR 3: LEARNING HUB & INSTITUTIONAL ACADEMY -->
        <div class="bg-tradeCard border-2 border-accentGold/40 hover:border-accentGold rounded-2xl p-5 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-accentGold/5 rounded-full blur-2xl pointer-events-none"></div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2.5 py-1 rounded-md uppercase font-bold bg-accentGold/15 text-accentGold border border-accentGold/30 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-accentGold animate-pulse"></span>
                PILLAR 03 • ACADEMY
              </span>
              <span class="text-xs font-mono text-accentGold font-bold">8 MODULES • 22 TOPICS</span>
            </div>

            <div>
              <h2 class="text-lg font-black text-white group-hover:text-accentGold transition flex items-center gap-2">
                🎓 LEARNING HUB
              </h2>
              <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                Master proprietary trading desk curriculum. Malaysian SNR/QMR, DodgysDD iFVG, Atlas AMT, and animated candlestick blueprints with zero raw code.
              </p>
            </div>

            <!-- Academy Showcase Panel -->
            <div class="bg-tradeDark/90 rounded-xl p-4 border border-accentGold/20 space-y-2.5 cursor-pointer" onclick="openAcademyDashboard()">
              <div class="flex items-center justify-between text-xs font-bold text-white">
                <span class="flex items-center gap-1.5"><i data-lucide="book-open" class="w-4 h-4 text-accentGold"></i> Curriculum Highlights</span>
                <span class="text-[10px] font-mono text-bullGreen font-bold">100% CANDLESTICK REPLAYS</span>
              </div>
              <div class="space-y-1.5 text-xs text-gray-300">
                <div class="p-2 rounded-lg bg-tradeCard/80 border border-tradeBorder flex items-center justify-between">
                  <span class="truncate">01. Malaysian QMR & Umar 40% Wick</span>
                  <span class="text-[10px] text-accentGold font-mono">13 min</span>
                </div>
                <div class="p-2 rounded-lg bg-tradeCard/80 border border-tradeBorder flex items-center justify-between">
                  <span class="truncate">02. DodgysDD Inversion FVG (iFVG)</span>
                  <span class="text-[10px] text-cyan-400 font-mono">14 min</span>
                </div>
                <div class="p-2 rounded-lg bg-tradeCard/80 border border-tradeBorder flex items-center justify-between">
                  <span class="truncate">03. Atlas AMT PDH/PDL Sweeps</span>
                  <span class="text-[10px] text-indigo-400 font-mono">15 min</span>
                </div>
              </div>
              <div class="text-[10px] text-gray-400 font-mono text-center pt-1">
                ⚡ Zero Raw Code • Pure Indian Market Implementation
              </div>
            </div>
          </div>

          <button onclick="openAcademyDashboard()" class="w-full py-3 rounded-xl bg-accentGold hover:bg-accentGold/90 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-accentGold/20 mt-2">
            <span>Enter Learning Hub (Deep Academy)</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

      </div>

    </section>

    <!-- ========================================== -->
    <!-- 2. BULL WORKSPACE (CALL / CE EXECUTION DESK) -->
    <!-- ========================================== -->
    <section id="viewBullDesk" class="space-y-6 hidden">
      <!-- Desk Header with Back Button -->
      <div class="bg-gradient-to-r from-tradeCard via-tradeDark to-tradeCard border-2 border-bullGreen/40 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button onclick="switchTab('executive')" class="px-3 py-1.5 rounded-xl bg-tradeDark border border-tradeBorder hover:border-gray-500 text-gray-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Back to Executive Hub</span>
          </button>
          <div>
            <h2 class="text-lg font-black text-white flex items-center gap-2">
              🟢 INSTITUTIONAL BULL WORKSPACE • CALL (CE) DESK
            </h2>
            <p class="text-xs text-gray-400">High-Probability Long Trade Setups with Exact Entry, Stop Loss, Targets, Institutional Reason, and Live News Impact</p>
          </div>
        </div>
        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="px-3 py-1 rounded-lg bg-bullGreen/15 text-bullGreen font-bold border border-bullGreen/30">
            BULLISH MOMENTUM ACTIVE
          </span>
        </div>
      </div>

      <!-- Full-Width Interactive Bull Candlestick Diagram -->
      <div class="bg-tradeCard border border-tradeBorder rounded-2xl p-4 shadow-2xl">
        <div class="flex items-center justify-between mb-3 px-2">
          <span class="text-xs font-mono font-bold text-bullGreen flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-bullGreen animate-ping"></span>
            LIVE BULLISH CANDLESTICK REPLAY & POSITION TOOL
          </span>
          <span class="text-[11px] font-mono text-gray-400">Demand Sweep & iFVG Inversion Replay</span>
        </div>
        <div id="bullDeskChartWrapper" class="rounded-xl overflow-hidden border border-tradeBorder">
          <!-- Bull Chart Injected Here -->
        </div>
      </div>

      <!-- Curated CE Trades Container -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="crosshair" class="w-4 h-4 text-bullGreen"></i>
            Curated Institutional Call (CE) Recommendations
          </h3>
          <span class="text-xs text-gray-400 font-mono">Includes Entry, SL, TP, Reason & News Effect</span>
        </div>

        <!-- Trades Grid -->
        <div id="bullTradesContainer" class="grid grid-cols-1 gap-5">
          <!-- Dynamically Rendered CE Trades with Reason & News Effect -->
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- 3. BEAR WORKSPACE (PUT / PE EXECUTION DESK) -->
    <!-- ========================================== -->
    <section id="viewBearDesk" class="space-y-6 hidden">
      <!-- Desk Header with Back Button -->
      <div class="bg-gradient-to-r from-tradeCard via-tradeDark to-tradeCard border-2 border-bearRed/40 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button onclick="switchTab('executive')" class="px-3 py-1.5 rounded-xl bg-tradeDark border border-tradeBorder hover:border-gray-500 text-gray-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Back to Executive Hub</span>
          </button>
          <div>
            <h2 class="text-lg font-black text-white flex items-center gap-2">
              🔴 INSTITUTIONAL BEAR WORKSPACE • PUT (PE) DESK
            </h2>
            <p class="text-xs text-gray-400">High-Probability Short Trade Setups with Exact Entry, Stop Loss, Targets, Institutional Reason, and Live News Impact</p>
          </div>
        </div>
        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="px-3 py-1 rounded-lg bg-bearRed/15 text-bearRed font-bold border border-bearRed/30">
            BEARISH PRESSURE ACTIVE
          </span>
        </div>
      </div>

      <!-- Full-Width Interactive Bear Candlestick Diagram -->
      <div class="bg-tradeCard border border-tradeBorder rounded-2xl p-4 shadow-2xl">
        <div class="flex items-center justify-between mb-3 px-2">
          <span class="text-xs font-mono font-bold text-bearRed flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-bearRed animate-ping"></span>
            LIVE BEARISH CANDLESTICK REPLAY & POSITION TOOL
          </span>
          <span class="text-[11px] font-mono text-gray-400">Malaysian QMR & PDH Hunt Replay</span>
        </div>
        <div id="bearDeskChartWrapper" class="rounded-xl overflow-hidden border border-tradeBorder">
          <!-- Bear Chart Injected Here -->
        </div>
      </div>

      <!-- Curated PE Trades Container -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="crosshair" class="w-4 h-4 text-bearRed"></i>
            Curated Institutional Put (PE) Recommendations
          </h3>
          <span class="text-xs text-gray-400 font-mono">Includes Entry, SL, TP, Reason & News Effect</span>
        </div>

        <!-- Trades Grid -->
        <div id="bearTradesContainer" class="grid grid-cols-1 gap-5">
          <!-- Dynamically Rendered PE Trades with Reason & News Effect -->
        </div>
      </div>
    </section>
`;

// Insert the new sections right before VIEW 1: EQUAL CE & PE PAIRS
const view1Marker = '<!-- VIEW 1: EQUAL CE & PE PAIRS';
if (html.includes(view1Marker)) {
  html = html.replace(view1Marker, executiveAndDesksHtml + '\n\n    ' + view1Marker);
}

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('SUCCESS: Updated public/index.html with Executive Command Center, Bull Desk, and Bear Desk!');
