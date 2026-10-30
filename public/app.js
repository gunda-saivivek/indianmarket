/**
 * The Market Sniper Shooters - Frontend Application Engine
 */

let state = {
  currentIndex: 'nifty',
  activeTab: 'equal',
  activeExpiry: 'current',
  filterText: '',
  data: null,
  refreshTimer: null,
  refreshInterval: 3000,
  activeModalStrike: null,
  prevSpot: null,
  prevLTP: {}
};

// Initial startup
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  startPolling();
});

function switchIndex(indexName) {
  state.currentIndex = indexName;
  ['btnNifty', 'btnSensex', 'btnBankNifty'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all text-gray-400 hover:text-white';
  });

  const activeId = indexName === 'nifty' ? 'btnNifty' : indexName === 'sensex' ? 'btnSensex' : 'btnBankNifty';
  const activeEl = document.getElementById(activeId);
  if (activeEl) {
    activeEl.className = 'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all bg-bullGreen text-black shadow';
  }

  document.getElementById('spotLabel').textContent = `${indexName.toUpperCase()} SPOT`;
  fetchLiveData();
}

function switchTab(tab) {
  state.activeTab = tab;
  ['tabEqual', 'tabHero', 'tabLadder'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition text-gray-400 hover:text-white';
  });

  const activeBtnId = tab === 'equal' ? 'tabEqual' : tab === 'hero' ? 'tabHero' : 'tabLadder';
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) {
    activeBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition bg-tradeCard text-white border border-tradeBorder';
  }

  document.getElementById('viewEqual').classList.toggle('hidden', tab !== 'equal');
  document.getElementById('viewHero').classList.toggle('hidden', tab !== 'hero');
  document.getElementById('viewLadder').classList.toggle('hidden', tab !== 'ladder');
}

function onExpiryChange() {
  const sel = document.getElementById('expirySelect');
  state.activeExpiry = sel.value;
  fetchLiveData();
}

function filterStrikes() {
  state.filterText = document.getElementById('strikeSearch').value.trim();
  if (state.data) renderUI(state.data);
}

function startPolling() {
  fetchLiveData();
  if (state.refreshTimer) clearInterval(state.refreshTimer);
  state.refreshTimer = setInterval(fetchLiveData, state.refreshInterval);
}

async function fetchLiveData() {
  try {
    const res = await fetch(`/api/live-data?index=${state.currentIndex}&expiryType=${state.activeExpiry}&_t=${Date.now()}`, {
      headers: {
        'bypass-tunnel-reminder': 'true'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.data = data;
    renderUI(data);

    // Update live timer indicator
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
    const timerEl = document.getElementById('liveTimer');
    if (timerEl) {
      timerEl.textContent = `LIVE • ${timeStr}`;
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function renderUI(data) {
  if (!data || !data.spot) return;

  // Render Top Spot Bar
  const spotEl = document.getElementById('liveSpot');
  const changeEl = document.getElementById('liveChange');
  const dayRangeEl = document.getElementById('dayRange');

  const currentSpot = data.spot;
  spotEl.textContent = currentSpot.toFixed(2);

  // Flash color on tick change
  if (state.prevSpot !== null) {
    if (currentSpot > state.prevSpot) {
      spotEl.classList.add('flash-green');
      setTimeout(() => spotEl.classList.remove('flash-green'), 600);
    } else if (currentSpot < state.prevSpot) {
      spotEl.classList.add('flash-red');
      setTimeout(() => spotEl.classList.remove('flash-red'), 600);
    }
  }
  state.prevSpot = currentSpot;

  const change = data.change || 0;
  const changePct = data.changePct || 0;
  const sign = change >= 0 ? '+' : '';
  changeEl.textContent = `${sign}${change.toFixed(2)} (${sign}${changePct.toFixed(2)}%)`;
  changeEl.className = `text-xs font-mono font-medium ${change >= 0 ? 'text-bullGreen' : 'text-bearRed'}`;

  dayRangeEl.textContent = `L: ${data.low || '--'} | H: ${data.high || '--'}`;

  // ATM & Metrics
  document.getElementById('atmStrike').textContent = data.atmStrike;
  document.getElementById('atmStraddle').textContent = `Straddle: ₹${data.atmStraddlePrice ? data.atmStraddlePrice.toFixed(1) : '--'}`;
  document.getElementById('lotSizeDisplay').textContent = `${data.lotSize} Qty/Lot`;
  document.getElementById('expiryDateLabel').textContent = `Expiry: ${data.expiryFormatted || data.expiryDate}`;

  // PCR Value
  const pcrEl = document.getElementById('pcrValue');
  const pcrBadge = document.getElementById('pcrBadge');
  const pcr = data.pcr || 1.0;
  pcrEl.textContent = pcr.toFixed(2);
  if (pcr > 1.15) {
    pcrBadge.textContent = 'BULLISH';
    pcrBadge.className = 'text-xs px-2 py-0.5 rounded font-semibold uppercase bg-bullGreen/20 text-bullGreen border border-bullGreen/30';
  } else if (pcr < 0.85) {
    pcrBadge.textContent = 'BEARISH';
    pcrBadge.className = 'text-xs px-2 py-0.5 rounded font-semibold uppercase bg-bearRed/20 text-bearRed border border-bearRed/30';
  } else {
    pcrBadge.textContent = 'NEUTRAL';
    pcrBadge.className = 'text-xs px-2 py-0.5 rounded font-semibold uppercase bg-accentGold/20 text-accentGold border border-accentGold/30';
  }

  // Render Strategy Section
  renderStrategySection(data.strategy, data.lotSize);

  // Render Equal Pairs
  renderEqualPairs(data.equalPairs || []);

  // Render Hero Zero
  renderHeroZero(data.heroPicks || { ce: [], pe: [] }, data.lotSize);

  // Render Ladder
  renderLadder(data.chain || [], data.atmStrike);

  if (window.lucide) lucide.createIcons();
}

/**
 * RENDER STRATEGY SECTION: WHAT TO BUY NOW
 */
function renderStrategySection(strat, lotSize) {
  if (!strat) return;

  const actionBadge = document.getElementById('strategyActionBadge');
  const timeNote = document.getElementById('strategyTimeNote');

  actionBadge.textContent = strat.action;
  if (strat.badgeColor === 'bullGreen') {
    actionBadge.className = 'text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-bullGreen/20 text-bullGreen border border-bullGreen/40';
  } else if (strat.badgeColor === 'bearRed') {
    actionBadge.className = 'text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-bearRed/20 text-bearRed border border-bearRed/40';
  } else {
    actionBadge.className = 'text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-accentGold/20 text-accentGold border border-accentGold/40';
  }

  if (timeNote) timeNote.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5"></i><span>${strat.timeNote}</span>`;

  // CE Pick
  if (strat.cePick) {
    document.getElementById('stratCeName').textContent = strat.cePick.name;
    document.getElementById('stratCeTrigger').textContent = `Wait for TradingView Spot > ${strat.cePick.triggerSpot}`;
    document.getElementById('stratCePrice').textContent = `₹${strat.cePick.ltp.toFixed(1)}`;
    document.getElementById('stratCeRisk').textContent = `Max Risk: ₹${strat.cePick.maxRisk}/lot`;
    document.getElementById('stratCeT1').textContent = `₹${strat.cePick.target1.toFixed(1)}`;
    document.getElementById('stratCeT2').textContent = `₹${strat.cePick.target2.toFixed(1)}`;
    document.getElementById('stratCeSL').textContent = `₹${strat.cePick.sl.toFixed(1)}`;
    document.getElementById('stratCeReason').textContent = strat.cePick.reason;
  }

  // PE Pick
  if (strat.pePick) {
    document.getElementById('stratPeName').textContent = strat.pePick.name;
    document.getElementById('stratPeTrigger').textContent = `Wait for TradingView Spot < ${strat.pePick.triggerSpot}`;
    document.getElementById('stratPePrice').textContent = `₹${strat.pePick.ltp.toFixed(1)}`;
    document.getElementById('stratPeRisk').textContent = `Max Risk: ₹${strat.pePick.maxRisk}/lot`;
    document.getElementById('stratPeT1').textContent = `₹${strat.pePick.target1.toFixed(1)}`;
    document.getElementById('stratPeT2').textContent = `₹${strat.pePick.target2.toFixed(1)}`;
    document.getElementById('stratPeSL').textContent = `₹${strat.pePick.sl.toFixed(1)}`;
    document.getElementById('stratPeReason').textContent = strat.pePick.reason;
  }
}

function copySpecificUpstox(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied "${text}" to clipboard! Paste it directly into Upstox search bar.`);
  });
}

function openStratModal(type) {
  if (!state.data || !state.data.strategy) return;
  const pick = type === 'CE' ? state.data.strategy.cePick : state.data.strategy.pePick;
  if (pick) {
    openTradeModal(pick.strike, type, pick.ltp, 'STRATEGY PICK');
  }
}
function renderEqualPairs(pairs) {
  const container = document.getElementById('equalPairsContainer');
  document.getElementById('equalPairsCount').textContent = pairs.length;

  if (pairs.length === 0) {
    container.innerHTML = `<div class="col-span-full py-8 text-center text-gray-500">No matching equal pairs currently found.</div>`;
    return;
  }

  const query = state.filterText.toLowerCase();
  const filtered = pairs.filter(p => 
    !query || 
    p.ceStrike.toString().includes(query) || 
    p.peStrike.toString().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  container.innerHTML = filtered.map((pair, index) => {
    // Check price changes for flash
    const ceKey = `${pair.ceStrike}_CE`;
    const peKey = `${pair.peStrike}_PE`;
    const prevCE = state.prevLTP[ceKey];
    const prevPE = state.prevLTP[peKey];

    let ceFlash = '';
    if (prevCE !== undefined) {
      if (pair.ceLtp > prevCE) ceFlash = 'text-bullGreen animate-pulse';
      else if (pair.ceLtp < prevCE) ceFlash = 'text-bearRed animate-pulse';
    }
    let peFlash = '';
    if (prevPE !== undefined) {
      if (pair.peLtp > prevPE) peFlash = 'text-bullGreen animate-pulse';
      else if (pair.peLtp < prevPE) peFlash = 'text-bearRed animate-pulse';
    }

    state.prevLTP[ceKey] = pair.ceLtp;
    state.prevLTP[peKey] = pair.peLtp;

    return `
      <div class="pair-card bg-tradeCard border border-tradeBorder rounded-xl p-4 space-y-3 relative overflow-hidden group">
        
        <!-- Header badge -->
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold tracking-wider px-2 py-0.5 rounded text-[10px] uppercase ${
            pair.category === 'HERO-ZERO' ? 'bg-bullGreen/20 text-bullGreen border border-bullGreen/30' :
            pair.category === 'ATM STRADDLE' ? 'bg-accentGold/20 text-accentGold border border-accentGold/30 font-extrabold' :
            'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }">
            ${pair.category}
          </span>
          <span class="text-gray-400 font-mono text-[11px]">Diff: ₹${Math.abs(pair.ceLtp - pair.peLtp).toFixed(1)}</span>
        </div>

        <!-- The Equal Strike Comparison -->
        <div class="grid grid-cols-2 gap-3 pt-1">
          
          <!-- CALL (CE) SIDE -->
          <div onclick="openTradeModal('${pair.ceStrike}', 'CE', ${pair.ceLtp}, '${pair.category}')" class="cursor-pointer bg-tradeDark/80 hover:bg-bullGreen/10 border border-tradeBorder hover:border-bullGreen/40 rounded-xl p-3 transition text-left group/ce">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-bullGreen font-mono">${pair.ceStrike} CE</span>
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 text-bullGreen opacity-60 group-hover/ce:opacity-100"></i>
            </div>
            <div class="text-lg font-bold font-mono text-white ${ceFlash}">₹${pair.ceLtp.toFixed(1)}</div>
            <div class="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
              <span>Target (2x)</span>
              <span class="text-bullGreen font-mono font-bold">₹${(pair.ceLtp * 2).toFixed(1)}</span>
            </div>
            <div class="mt-2 text-[10px] text-bullGreen/90 font-medium underline">Click for Why CE ↗</div>
          </div>

          <!-- PUT (PE) SIDE -->
          <div onclick="openTradeModal('${pair.peStrike}', 'PE', ${pair.peLtp}, '${pair.category}')" class="cursor-pointer bg-tradeDark/80 hover:bg-bearRed/10 border border-tradeBorder hover:border-bearRed/40 rounded-xl p-3 transition text-left group/pe">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-bearRed font-mono">${pair.peStrike} PE</span>
              <i data-lucide="arrow-down-right" class="w-3.5 h-3.5 text-bearRed opacity-60 group-hover/pe:opacity-100"></i>
            </div>
            <div class="text-lg font-bold font-mono text-white ${peFlash}">₹${pair.peLtp.toFixed(1)}</div>
            <div class="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
              <span>Target (2x)</span>
              <span class="text-bearRed font-mono font-bold">₹${(pair.peLtp * 2).toFixed(1)}</span>
            </div>
            <div class="mt-2 text-[10px] text-bearRed/90 font-medium underline">Click for Why PE ↘</div>
          </div>

        </div>

        <!-- Strategy Summary Note -->
        <div class="bg-tradeDark/50 rounded-lg p-2 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Combined Cost: <strong class="text-white font-mono">₹${(pair.ceLtp + pair.peLtp).toFixed(1)}</strong></span>
          <span class="text-accentGold text-[10px]">Active Liquid Strikes</span>
        </div>

      </div>
    `;
  }).join('');
}

/**
 * RENDER VIEW 2: HERO-ZERO HOTLIST
 */
function renderHeroZero(heroPicks, lotSize) {
  const container = document.getElementById('heroContainer');
  const ceList = heroPicks.ce || [];
  const peList = heroPicks.pe || [];

  document.getElementById('heroPicksCount').textContent = ceList.length + peList.length;

  container.innerHTML = `
    <!-- CE HERO ZERO -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-bullGreen flex items-center gap-2">
        <i data-lucide="trending-up" class="w-4 h-4"></i>
        Top Call (CE) Hero-Zero Picks
      </h3>

      <div class="space-y-3">
        ${ceList.length === 0 ? '<div class="text-xs text-gray-500 py-4">No CE strikes in ₹10-₹35 range</div>' : 
          ceList.map(item => `
            <div onclick="openTradeModal('${item.strike}', 'CE', ${item.ltp}, 'HERO-ZERO')" class="cursor-pointer bg-tradeCard hover:bg-bullGreen/10 border border-tradeBorder hover:border-bullGreen/50 rounded-xl p-4 transition space-y-2 group">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-bold font-mono text-white group-hover:text-bullGreen transition">${item.name || `${item.strike} CE`}</span>
                  <span class="text-xs text-gray-400 block">${item.distPts > 0 ? `+${item.distPts} pts above spot` : `${item.distPts} pts`}</span>
                </div>
                <div class="text-right">
                  <span class="text-lg font-bold font-mono text-bullGreen">₹${item.ltp.toFixed(2)}</span>
                  <span class="text-[10px] text-gray-500 block">Risk: ₹${(item.ltp * lotSize).toFixed(0)}/lot</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-tradeBorder/60 text-xs font-mono">
                <div class="bg-tradeDark/60 p-2 rounded">
                  <span class="text-[10px] text-gray-500 block">Target 1 (2x)</span>
                  <strong class="text-bullGreen">₹${(item.ltp * 2).toFixed(1)}</strong>
                </div>
                <div class="bg-tradeDark/60 p-2 rounded">
                  <span class="text-[10px] text-gray-500 block">Target 2 (3x)</span>
                  <strong class="text-cyan-400">₹${(item.ltp * 3).toFixed(1)}</strong>
                </div>
              </div>
              <div class="text-[11px] text-bullGreen font-semibold flex items-center justify-end gap-1 pt-1">
                <span>View Trade Reason & Targets</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>

    <!-- PE HERO ZERO -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-bearRed flex items-center gap-2">
        <i data-lucide="trending-down" class="w-4 h-4"></i>
        Top Put (PE) Hero-Zero Picks
      </h3>

      <div class="space-y-3">
        ${peList.length === 0 ? '<div class="text-xs text-gray-500 py-4">No PE strikes in ₹10-₹35 range</div>' : 
          peList.map(item => `
            <div onclick="openTradeModal('${item.strike}', 'PE', ${item.ltp}, 'HERO-ZERO')" class="cursor-pointer bg-tradeCard hover:bg-bearRed/10 border border-tradeBorder hover:border-bearRed/50 rounded-xl p-4 transition space-y-2 group">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-bold font-mono text-white group-hover:text-bearRed transition">${item.name || `${item.strike} PE`}</span>
                  <span class="text-xs text-gray-400 block">${item.distPts > 0 ? `-${item.distPts} pts below spot` : `${item.distPts} pts`}</span>
                </div>
                <div class="text-right">
                  <span class="text-lg font-bold font-mono text-bearRed">₹${item.ltp.toFixed(2)}</span>
                  <span class="text-[10px] text-gray-500 block">Risk: ₹${(item.ltp * lotSize).toFixed(0)}/lot</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-tradeBorder/60 text-xs font-mono">
                <div class="bg-tradeDark/60 p-2 rounded">
                  <span class="text-[10px] text-gray-500 block">Target 1 (2x)</span>
                  <strong class="text-bearRed">₹${(item.ltp * 2).toFixed(1)}</strong>
                </div>
                <div class="bg-tradeDark/60 p-2 rounded">
                  <span class="text-[10px] text-gray-500 block">Target 2 (3x)</span>
                  <strong class="text-cyan-400">₹${(item.ltp * 3).toFixed(1)}</strong>
                </div>
              </div>
              <div class="text-[11px] text-bearRed font-semibold flex items-center justify-end gap-1 pt-1">
                <span>View Trade Reason & Targets</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

/**
 * RENDER VIEW 3: FULL OPTION LADDER
 */
function renderLadder(chain, atmStrike) {
  const tbody = document.getElementById('ladderBody');
  const query = state.filterText.toLowerCase();

  const filtered = chain.filter(row => !query || row.strike.toString().includes(query));

  tbody.innerHTML = filtered.map(row => {
    const isATM = row.strike === atmStrike;
    const ceLtp = row.ceLtp || 0;
    const peLtp = row.peLtp || 0;

    return `
      <tr class="strike-row transition ${isATM ? 'bg-accentGold/10 font-bold border-y-2 border-accentGold/50' : ''}">
        <!-- CE REASON BUTTON -->
        <td class="py-2.5 px-4">
          <button onclick="openTradeModal('${row.strike}', 'CE', ${ceLtp}, '${isATM ? 'ATM' : 'CHAIN'}')" class="text-left text-bullGreen hover:underline text-[11px] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-bullGreen"></span>
            <span>Why Buy CE @ ₹${ceLtp.toFixed(1)}</span>
          </button>
        </td>

        <!-- CE LTP -->
        <td class="py-2.5 px-4 text-right text-sm font-bold text-bullGreen">
          ₹${ceLtp.toFixed(1)}
        </td>

        <!-- STRIKE -->
        <td class="py-2.5 px-4 text-center font-bold text-sm ${isATM ? 'text-accentGold bg-accentGold/20 rounded' : 'text-white bg-tradeDark/50'}">
          ${row.strike} ${isATM ? '<span class="text-[9px] uppercase px-1 rounded bg-accentGold text-black font-extrabold ml-1">ATM</span>' : ''}
        </td>

        <!-- PE LTP -->
        <td class="py-2.5 px-4 text-left text-sm font-bold text-bearRed">
          ₹${peLtp.toFixed(1)}
        </td>

        <!-- PE REASON BUTTON -->
        <td class="py-2.5 px-4">
          <button onclick="openTradeModal('${row.strike}', 'PE', ${peLtp}, '${isATM ? 'ATM' : 'CHAIN'}')" class="text-left text-bearRed hover:underline text-[11px] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-bearRed"></span>
            <span>Why Buy PE @ ₹${peLtp.toFixed(1)}</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * TRADE MODAL REASON GENERATOR
 */
function openTradeModal(strikeStr, type, ltp, category) {
  const strike = parseFloat(strikeStr);
  const spot = state.data?.spot || strike;
  const expiry = state.data?.expiryFormatted || 'Current Expiry';
  const lotSize = state.data?.lotSize || (state.currentIndex === 'sensex' ? 10 : 65);
  const indexName = state.currentIndex.toUpperCase();

  state.activeModalStrike = { strike, type, ltp, lotSize, indexName, expiry };

  // Setup modal UI
  const modal = document.getElementById('tradeModal');
  const typeBadge = document.getElementById('modalTypeBadge');
  const catBadge = document.getElementById('modalCategoryBadge');
  const title = document.getElementById('modalStrikeTitle');
  const expirySub = document.getElementById('modalExpirySub');

  typeBadge.textContent = type;
  if (type === 'CE') {
    typeBadge.className = 'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg bg-bullGreen text-black shadow-lg shadow-bullGreen/20';
  } else {
    typeBadge.className = 'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg bg-bearRed text-white shadow-lg shadow-bearRed/20';
  }

  title.textContent = `${indexName} ${strike} ${type}`;
  catBadge.textContent = category;
  expirySub.textContent = `${state.activeExpiry === 'current' ? 'Current Expiry' : 'Next Week Expiry'} | ${expiry}`;

  // Price points
  const t1 = (ltp * 2).toFixed(1);
  const t2 = (ltp * 3).toFixed(1);
  const sl = category === 'HERO-ZERO' ? '₹0.0 (Hold or 50%)' : `₹${(ltp * 0.5).toFixed(1)}`;

  document.getElementById('modalEntryPrice').textContent = `₹${ltp.toFixed(1)}`;
  document.getElementById('modalTarget1').textContent = `₹${t1}`;
  document.getElementById('modalTarget2').textContent = `₹${t2}`;
  document.getElementById('modalSL').textContent = sl;

  // GENERATE DEEP TRADING REASON
  generateTradingReason(strike, type, ltp, spot, category, indexName);

  // Setup Upstox copy string
  const upstoxString = `${indexName} ${expiry} ${strike} ${type}`;
  document.getElementById('upstoxCopyInput').value = upstoxString;

  // Lot Calculator
  document.getElementById('lotsSlider').value = 1;
  updateLotCalc();

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function generateTradingReason(strike, type, ltp, spot, category, indexName) {
  const triggerEl = document.getElementById('modalTriggerReason');
  const greekEl = document.getElementById('modalGreekReason');
  const riskEl = document.getElementById('modalRiskReason');
  const trendIcon = document.getElementById('modalTrendIcon');

  const diff = strike - spot;
  const isCall = type === 'CE';

  if (isCall) {
    trendIcon.setAttribute('data-lucide', 'trending-up');
    trendIcon.className = 'w-4 h-4 text-bullGreen shrink-0 mt-0.5';

    // Bullish trigger
    const breakoutTrigger = (spot + Math.min(35, Math.abs(diff) * 0.3)).toFixed(0);
    triggerEl.innerHTML = `
      Open <strong>${indexName} Spot Chart on TradingView</strong>. Wait for price to break and close above <span class="text-bullGreen font-mono font-bold">${breakoutTrigger}</span> on a 5-minute candle. Entering at breakout confirms institutional momentum.
    `;

    // Greek analysis
    if (ltp <= 35) {
      greekEl.innerHTML = `
        <strong>Gamma Explosion Play:</strong> Currently OTM with low delta (~0.18). A sudden 40–60 pt impulse move will cause Delta to double towards 0.40, catapulting this ₹${ltp.toFixed(1)} premium to <strong>₹${(ltp * 2).toFixed(1)} (2x / +100%)</strong> very rapidly.
      `;
    } else {
      greekEl.innerHTML = `
        <strong>High Delta (~0.50) ATM Ride:</strong> Every 1 point the index moves on TradingView, this option will move by ~0.50 points. Cleanest price action follow-through with minimal slippage.
      `;
    }

    // Risk setup
    riskEl.innerHTML = `
      Risk is strictly capped at ₹${ltp.toFixed(1)} per share. Follow the <strong>2x Rule:</strong> Sell 50% quantity when price hits ₹${(ltp * 2).toFixed(1)} to recover your full capital, making the remaining quantity 100% risk-free!
    `;

  } else {
    // Put (PE) Side
    trendIcon.setAttribute('data-lucide', 'trending-down');
    trendIcon.className = 'w-4 h-4 text-bearRed shrink-0 mt-0.5';

    const breakdownTrigger = (spot - Math.min(35, Math.abs(diff) * 0.3)).toFixed(0);
    triggerEl.innerHTML = `
      Open <strong>${indexName} Spot Chart on TradingView</strong>. Wait for price to break and close below <span class="text-bearRed font-mono font-bold">${breakdownTrigger}</span> on a 5-minute candle. Breakdown confirms bears taking control.
    `;

    if (ltp <= 35) {
      greekEl.innerHTML = `
        <strong>Panic Unwinding Gamma Blast:</strong> Put options gain velocity faster during market drops due to Implied Volatility (IV) spikes. A 50 pt fall can double this ₹${ltp.toFixed(1)} premium to <strong>₹${(ltp * 2).toFixed(1)}</strong> within 2 to 3 red candles!
      `;
    } else {
      greekEl.innerHTML = `
        <strong>Direct Bearish Delta (~-0.50):</strong> Direct point-for-point hedge or directional trend. Very responsive to breakdowns with strong delta sensitivity.
      `;
    }

    riskEl.innerHTML = `
      Max risk is ₹${ltp.toFixed(1)}. Cut trade if Spot reclaims support on TradingView, or hold to expiry if trading strict Hero-Zero with predefined loss.
    `;
  }
}

function updateLotCalc() {
  if (!state.activeModalStrike) return;
  const lots = parseInt(document.getElementById('lotsSlider').value);
  const { ltp, lotSize } = state.activeModalStrike;

  const totalQty = lots * lotSize;
  const capital = (ltp * totalQty).toFixed(0);
  const profit = capital; // at 2x, profit equals capital

  document.getElementById('calcLots').textContent = `${lots} Lot${lots > 1 ? 's' : ''}`;
  document.getElementById('calcQty').textContent = totalQty;
  document.getElementById('calcCapital').textContent = `₹${Number(capital).toLocaleString('en-IN')}`;
  document.getElementById('calcProfit').textContent = `+₹${Number(profit).toLocaleString('en-IN')}`;
}

function copyUpstoxString() {
  const input = document.getElementById('upstoxCopyInput');
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById('btnCopy');
    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Copied!</span>`;
    btn.classList.replace('bg-upstoxPurple', 'bg-bullGreen');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i><span>Copy</span>`;
      btn.classList.replace('bg-bullGreen', 'bg-upstoxPurple');
      if (window.lucide) lucide.createIcons();
    }, 2000);
  });
}

function closeModal() {
  document.getElementById('tradeModal').classList.add('hidden');
}

// ESC to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    const settings = document.getElementById('settingsModal');
    if (settings) settings.classList.add('hidden');
  }
});

function toggleSettingsModal() {
  const modal = document.getElementById('settingsModal');
  modal.classList.toggle('hidden');
}

function saveSettings() {
  const token = document.getElementById('upstoxTokenInput').value.trim();
  const interval = parseInt(document.getElementById('refreshInterval').value);
  state.refreshInterval = interval;
  startPolling();
  toggleSettingsModal();
}
