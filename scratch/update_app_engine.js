const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../public/app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. Set default activeTab to 'executive'
code = code.replace("activeTab: 'equal',", "activeTab: 'executive',");

// 2. Replace switchTab implementation
const oldSwitchTabStart = 'function switchTab(tab) {';
const oldSwitchTabEnd = '// ==========================================\n// LIVE MARKET NEWS & IMPACT ENGINE';

const newSwitchTabAndDesks = `function switchTab(tab) {
  state.activeTab = tab;
  
  // Top bar buttons
  const topTabs = [
    { id: 'tabExecutive', activeClass: 'text-white bg-tradeCard border border-tradeBorder shadow' },
    { id: 'tabBull', activeClass: 'text-bullGreen bg-bullGreen/20 border border-bullGreen/60 shadow' },
    { id: 'tabBear', activeClass: 'text-bearRed bg-bearRed/20 border border-bearRed/60 shadow' },
    { id: 'tabAcademy', activeClass: 'text-accentGold bg-accentGold/20 border border-accentGold/60 shadow' },
    { id: 'tabEqual', activeClass: 'text-white bg-tradeCard border border-tradeBorder shadow' },
    { id: 'tabHero', activeClass: 'text-bullGreen bg-bullGreen/20 border border-bullGreen/60 shadow' },
    { id: 'tabNews', activeClass: 'text-cyan-400 bg-cyan-400/20 border border-cyan-400/60 shadow' },
    { id: 'tabLadder', activeClass: 'text-white bg-tradeCard border border-tradeBorder shadow' }
  ];

  topTabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (!el) return;
    const tabName = t.id.replace('tab', '').toLowerCase();
    if (tab === tabName) {
      el.className = \`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition \${t.activeClass}\`;
    } else {
      el.className = 'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white';
    }
  });

  // Sidebar navigation buttons
  const sideTabs = [
    { id: 'sideTabExecutive', activeClass: 'bg-tradeDark text-white border border-tradeBorder shadow-sm' },
    { id: 'sideTabBull', activeClass: 'bg-bullGreen/15 text-bullGreen border border-bullGreen/40 shadow-sm' },
    { id: 'sideTabBear', activeClass: 'bg-bearRed/15 text-bearRed border border-bearRed/40 shadow-sm' },
    { id: 'sideTabAcademy', activeClass: 'bg-accentGold/20 text-accentGold border-2 border-accentGold shadow-md' },
    { id: 'sideTabEqual', activeClass: 'bg-tradeDark text-white border border-tradeBorder shadow-sm' },
    { id: 'sideTabHero', activeClass: 'bg-tradeDark text-white border border-tradeBorder shadow-sm' },
    { id: 'sideTabNews', activeClass: 'bg-tradeDark text-white border border-tradeBorder shadow-sm' },
    { id: 'sideTabLadder', activeClass: 'bg-tradeDark text-white border border-tradeBorder shadow-sm' }
  ];

  sideTabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (!el) return;
    const tabName = t.id.replace('sideTab', '').toLowerCase();
    if (tab === tabName) {
      el.className = \`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 \${t.activeClass}\`;
    } else {
      el.className = 'w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 text-gray-400 hover:text-white hover:bg-tradeDark border border-transparent';
    }
  });

  const views = {
    executive: document.getElementById('viewExecutive'),
    bull: document.getElementById('viewBullDesk'),
    bear: document.getElementById('viewBearDesk'),
    academy: document.getElementById('viewAcademy'),
    equal: document.getElementById('viewEqual'),
    hero: document.getElementById('viewHero'),
    news: document.getElementById('viewNews'),
    ladder: document.getElementById('viewLadder')
  };

  Object.entries(views).forEach(([vKey, el]) => {
    if (el) el.classList.toggle('hidden', tab !== vKey);
  });

  if (tab === 'news') {
    loadLiveNews();
  } else if (tab === 'academy') {
    initAcademy();
  } else if (tab === 'bull' || tab === 'bear' || tab === 'executive') {
    if (state.lastData) {
      renderExecutiveHub(state.lastData);
      renderBullDesk(state.lastData);
      renderBearDesk(state.lastData);
    }
  }

  // Close mobile drawer on navigation
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('mobileSidebarBackdrop');
  if (sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
  }

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// EXECUTIVE COMMAND CENTER & INDIVIDUAL WORKSPACES
// ==========================================

function renderExecutiveHub(data) {
  if (!data) return;

  // 1. Inject Bull Chart SVG
  const bullContainer = document.getElementById('execBullChartContainer');
  if (bullContainer && window.BULL_CHART_SVG) {
    bullContainer.innerHTML = window.BULL_CHART_SVG;
  }

  // 2. Inject Bear Chart SVG
  const bearContainer = document.getElementById('execBearChartContainer');
  if (bearContainer && window.BEAR_CHART_SVG) {
    bearContainer.innerHTML = window.BEAR_CHART_SVG;
  }

  // 3. Update Bull Pillar Summary
  const topBull = (data.bullTrades && data.bullTrades[0]) || null;
  if (topBull) {
    const elStrike = document.getElementById('execBullStrike');
    const elEntry = document.getElementById('execBullEntry');
    const elT1 = document.getElementById('execBullT1');
    const elT2 = document.getElementById('execBullT2');
    const elSL = document.getElementById('execBullSL');
    if (elStrike) elStrike.textContent = topBull.name;
    if (elEntry) elEntry.textContent = \`Buy ₹\${topBull.entryMin} - ₹\${topBull.entryMax} (Spot > \${topBull.triggerSpot})\`;
    if (elT1) elT1.textContent = \`₹\${topBull.tp1}\`;
    if (elT2) elT2.textContent = \`₹\${topBull.tp2}\`;
    if (elSL) elSL.textContent = \`₹\${topBull.sl}\`;
  }

  // 4. Update Bear Pillar Summary
  const topBear = (data.bearTrades && data.bearTrades[0]) || null;
  if (topBear) {
    const elStrike = document.getElementById('execBearStrike');
    const elEntry = document.getElementById('execBearEntry');
    const elT1 = document.getElementById('execBearT1');
    const elT2 = document.getElementById('execBearT2');
    const elSL = document.getElementById('execBearSL');
    if (elStrike) elStrike.textContent = topBear.name;
    if (elEntry) elEntry.textContent = \`Buy ₹\${topBear.entryMin} - ₹\${topBear.entryMax} (Spot < \${topBear.triggerSpot})\`;
    if (elT1) elT1.textContent = \`₹\${topBear.tp1}\`;
    if (elT2) elT2.textContent = \`₹\${topBear.tp2}\`;
    if (elSL) elSL.textContent = \`₹\${topBear.sl}\`;
  }

  // Index badges in hero
  ['heroIdxNifty', 'heroIdxSensex', 'heroIdxBankNifty'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const isCur = (id === 'heroIdxNifty' && state.currentIndex === 'nifty') ||
                  (id === 'heroIdxSensex' && state.currentIndex === 'sensex') ||
                  (id === 'heroIdxBankNifty' && state.currentIndex === 'banknifty');
    if (isCur) {
      btn.className = 'px-3.5 py-2 rounded-lg text-xs font-bold transition bg-bullGreen text-black shadow';
    } else {
      btn.className = 'px-3.5 py-2 rounded-lg text-xs font-semibold transition text-gray-400 hover:text-white';
    }
  });
}

function renderBullDesk(data) {
  if (!data) return;

  // Chart Wrapper
  const chartWrap = document.getElementById('bullDeskChartWrapper');
  if (chartWrap && window.BULL_CHART_SVG) {
    chartWrap.innerHTML = window.BULL_CHART_SVG;
  }

  // Trades Container
  const container = document.getElementById('bullTradesContainer');
  if (container) {
    const trades = data.bullTrades || [];
    if (trades.length === 0) {
      container.innerHTML = \`<div class="p-8 text-center text-gray-400">Loading Bullish Call (CE) Setups...</div>\`;
    } else {
      container.innerHTML = trades.map(renderMillionaireTradeCard).join('');
    }
  }
}

function renderBearDesk(data) {
  if (!data) return;

  // Chart Wrapper
  const chartWrap = document.getElementById('bearDeskChartWrapper');
  if (chartWrap && window.BEAR_CHART_SVG) {
    chartWrap.innerHTML = window.BEAR_CHART_SVG;
  }

  // Trades Container
  const container = document.getElementById('bearTradesContainer');
  if (container) {
    const trades = data.bearTrades || [];
    if (trades.length === 0) {
      container.innerHTML = \`<div class="p-8 text-center text-gray-400">Loading Bearish Put (PE) Setups...</div>\`;
    } else {
      container.innerHTML = trades.map(renderMillionaireTradeCard).join('');
    }
  }
}

function renderMillionaireTradeCard(trade) {
  const isCE = trade.type === 'CE';
  const themeBorder = isCE ? 'border-bullGreen/40 hover:border-bullGreen' : 'border-bearRed/40 hover:border-bearRed';
  const badgeStyle = isCE ? 'bg-bullGreen/15 text-bullGreen border-bullGreen/30' : 'bg-bearRed/15 text-bearRed border-bearRed/30';
  const ltpColor = isCE ? 'text-bullGreen' : 'text-bearRed';
  const lotSize = trade.lotSize || 65;

  return \`
    <div class="bg-tradeCard border-2 \${themeBorder} rounded-2xl p-6 space-y-4 shadow-2xl transition group relative overflow-hidden">
      
      <!-- Top Title & Badge Strip -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-tradeBorder/80 pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-xs font-mono px-2.5 py-1 rounded-md font-bold uppercase \${badgeStyle} border flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full \${isCE ? 'bg-bullGreen' : 'bg-bearRed'} animate-ping"></span>
            \${trade.badge || (isCE ? 'BULLISH SETUP' : 'BEARISH SETUP')}
          </span>
          <h4 class="text-base font-extrabold text-white font-mono">
            \${trade.setupName}
          </h4>
        </div>
        <div class="flex items-center gap-2 font-mono">
          <span class="text-xs text-gray-400">Target Risk/Reward:</span>
          <span class="text-xs font-bold text-accentGold px-2 py-0.5 rounded bg-accentGold/10 border border-accentGold/30">
            \${trade.riskReward}
          </span>
        </div>
      </div>

      <!-- Strike, LTP & Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-tradeDark p-4 rounded-xl border border-tradeBorder font-mono">
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Option Strike</span>
          <strong class="text-base font-bold text-white">\${trade.name}</strong>
        </div>
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Current Premium (LTP)</span>
          <strong class="text-xl font-bold \${ltpColor}">₹\${trade.ltp.toFixed(1)}</strong>
        </div>
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Recommended Entry Range</span>
          <strong class="text-sm font-bold text-white">₹\${trade.entryMin} - ₹\${trade.entryMax}</strong>
          <span class="text-[10px] text-gray-400 block">Trigger: Spot \${isCE ? '>' : '<'} \${trade.triggerSpot}</span>
        </div>
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Stop Loss (SL)</span>
          <strong class="text-sm font-bold text-bearRed">₹\${trade.sl} (-₹\${trade.slPts} pts)</strong>
        </div>
      </div>

      <!-- Targets Row -->
      <div class="grid grid-cols-2 gap-3 font-mono text-center">
        <div class="p-3 rounded-xl bg-bullGreen/10 border border-bullGreen/30">
          <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Target 1 (Conservative Milestone)</span>
          <strong class="text-base font-bold text-bullGreen">₹\${trade.tp1} (+₹\${trade.tp1Pts} pts)</strong>
        </div>
        <div class="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30">
          <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Target 2 (Runner Multi-Bagger)</span>
          <strong class="text-base font-bold text-cyan-400">₹\${trade.tp2} (+₹\${trade.tp2Pts} pts)</strong>
        </div>
      </div>

      <!-- 1. INSTITUTIONAL REASON BOX (MANDATORY REQUIREMENT) -->
      <div class="p-4 rounded-xl bg-[#0d121c] border border-tradeBorder space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-bold text-accentGold uppercase tracking-wide">
          <i data-lucide="shield-check" class="w-4 h-4"></i>
          <span>Institutional Technical Blueprint (Why to Enter This Trade)</span>
        </div>
        <p class="text-xs text-gray-200 leading-relaxed font-sans">
          \${trade.reason}
        </p>
      </div>

      <!-- 2. LIVE NEWS EFFECT & MACRO CATALYST BOX (MANDATORY REQUIREMENT) -->
      <div class="p-4 rounded-xl bg-[#09151e] border border-cyan-400/30 space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
          <i data-lucide="newspaper" class="w-4 h-4"></i>
          <span>Live News & Macro Catalyst Impact</span>
        </div>
        <p class="text-xs text-gray-200 leading-relaxed font-sans">
          \${trade.newsEffect}
        </p>
      </div>

      <!-- 3. INTERACTIVE LOTS SLIDER & LIVE CALCULATOR -->
      <div class="p-4 rounded-xl bg-tradeDark border border-tradeBorder space-y-3">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-gray-300">Quantity Allocation: <strong id="calcLotLabel_\${trade.id}" class="text-white">1 Lot (\${lotSize} Qty)</strong></span>
          <span class="text-gray-300">Capital Required: <strong id="calcCap_\${trade.id}" class="text-accentGold">₹\${Math.round(trade.ltp * lotSize).toLocaleString('en-IN')}</strong></span>
        </div>
        <input type="range" min="1" max="15" value="1" 
          oninput="updateTradeCalc('\${trade.id}', this.value, \${trade.ltp}, \${lotSize}, \${trade.tp1Pts}, \${trade.tp2Pts})" 
          class="w-full accent-bullGreen h-1.5 bg-tradeCard rounded-lg cursor-pointer">
        <div class="grid grid-cols-2 gap-2 text-xs font-mono text-center">
          <div class="p-2 rounded bg-tradeCard/80 border border-tradeBorder">
            <span class="text-[10px] text-gray-400 block">Expected Profit @ Target 1</span>
            <strong id="calcP1_\${trade.id}" class="text-bullGreen font-bold">+₹\${Math.round(trade.tp1Pts * lotSize).toLocaleString('en-IN')}</strong>
          </div>
          <div class="p-2 rounded bg-tradeCard/80 border border-tradeBorder">
            <span class="text-[10px] text-gray-400 block">Expected Profit @ Target 2</span>
            <strong id="calcP2_\${trade.id}" class="text-cyan-400 font-bold">+₹\${Math.round(trade.tp2Pts * lotSize).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3 pt-1">
        <button onclick="copyTradeString('\${trade.name}', \${trade.ltp}, \${trade.sl}, \${trade.tp1})" class="flex-1 py-3 rounded-xl bg-bullGreen hover:bg-bullGreen/90 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-bullGreen/20">
          <i data-lucide="copy" class="w-4 h-4"></i>
          <span>Copy for Upstox / Broker Order String</span>
        </button>
      </div>

    </div>
  \`;
}

function updateTradeCalc(tradeId, lots, ltp, lotSize, tp1Pts, tp2Pts) {
  const lotNum = parseInt(lots);
  const totalQty = lotNum * lotSize;
  const capital = Math.round(ltp * totalQty);
  const profit1 = Math.round(tp1Pts * totalQty);
  const profit2 = Math.round(tp2Pts * totalQty);

  const lbl = document.getElementById(\`calcLotLabel_\${tradeId}\`);
  const cap = document.getElementById(\`calcCap_\${tradeId}\`);
  const p1 = document.getElementById(\`calcP1_\${tradeId}\`);
  const p2 = document.getElementById(\`calcP2_\${tradeId}\`);

  if (lbl) lbl.textContent = \`\${lotNum} Lot\${lotNum > 1 ? 's' : ''} (\${totalQty} Qty)\`;
  if (cap) cap.textContent = \`₹\${capital.toLocaleString('en-IN')}\`;
  if (p1) p1.textContent = \`+₹\${profit1.toLocaleString('en-IN')}\`;
  if (p2) p2.textContent = \`+₹\${profit2.toLocaleString('en-IN')}\`;
}

function copyTradeString(name, ltp, sl, tp1) {
  const text = \`BUY \${name} LIMIT ₹\${ltp} SL ₹\${sl} TGT ₹\${tp1}\`;
  navigator.clipboard.writeText(text).then(() => {
    alert(\`Copied Order to Clipboard:\\n\${text}\`);
  }).catch(() => {
    // fallback
  });
}

// ==========================================
// LIVE MARKET NEWS & IMPACT ENGINE`;

if (code.includes(oldSwitchTabStart) && code.includes(oldSwitchTabEnd)) {
  const start = code.indexOf(oldSwitchTabStart);
  const end = code.indexOf(oldSwitchTabEnd);
  code = code.substring(0, start) + newSwitchTabAndDesks + code.substring(end + oldSwitchTabEnd.length);
}

// 3. Update renderUI to call the new desk renderers
const oldRenderUIStart = 'function renderUI(data) {\n  if (!data || !data.spot) return;';
const newRenderUIStart = `function renderUI(data) {
  if (!data || !data.spot) return;
  state.lastData = data;

  // Render Executive Command Center (3 Pillars) & Desks
  renderExecutiveHub(data);
  renderBullDesk(data);
  renderBearDesk(data);`;

if (code.includes(oldRenderUIStart)) {
  code = code.replace(oldRenderUIStart, newRenderUIStart);
}

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('SUCCESS: Updated public/app.js with Executive Center, Bull Desk, Bear Desk, and Millionaire Trades!');
