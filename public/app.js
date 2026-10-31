/**
 * The Market Sniper Shooters - Frontend Application Engine
 */

let state = {
  currentIndex: 'nifty',
  activeTab: 'executive',
  activeExpiry: 'current',
  filterText: '',
  data: null,
  newsData: null,
  refreshTimer: null,
  refreshInterval: 3000,
  activeModalStrike: null,
  prevSpot: null,
  prevLTP: {},
  token: localStorage.getItem('sniper_token') || null,
  currentUser: null
};

// Initial startup
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  initWorkstationCharts();
  switchTab('executive');
  checkAuthStatus();
});

function initWorkstationCharts() {
  const execBull = document.getElementById('execBullChartContainer');
  if (execBull && window.BULL_CHART_SVG) {
    execBull.innerHTML = window.BULL_CHART_SVG;
  }
  const execBear = document.getElementById('execBearChartContainer');
  if (execBear && window.BEAR_CHART_SVG) {
    execBear.innerHTML = window.BEAR_CHART_SVG;
  }
  const bullDesk = document.getElementById('bullDeskChartWrapper');
  if (bullDesk && window.BULL_CHART_SVG) {
    bullDesk.innerHTML = window.BULL_CHART_SVG;
  }
  const bearDesk = document.getElementById('bearDeskChartWrapper');
  if (bearDesk && window.BEAR_CHART_SVG) {
    bearDesk.innerHTML = window.BEAR_CHART_SVG;
  }
}

// ==========================================
// AUTHENTICATION & ACCESS CONTROL
// ==========================================

async function checkAuthStatus(manual = false) {
  if (!state.token) {
    showAuthModal('login');
    return;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'bypass-tunnel-reminder': 'true'
      }
    });

    if (!res.ok) {
      localStorage.removeItem('sniper_token');
      state.token = null;
      state.currentUser = null;
      showAuthModal('login');
      return;
    }

    const data = await res.json();
    state.currentUser = data.user;
    updateAuthUI();

    if (data.user.status === 'approved') {
      hideAuthModal();
      document.getElementById('pendingAlert').classList.add('hidden');
      startPolling();
    } else {
      // Pending or Rejected
      if (state.refreshTimer) clearInterval(state.refreshTimer);
      document.getElementById('pendingAlert').classList.remove('hidden');
      hideAuthModal();
      if (manual) {
        alert("Your status is still pending approval by the Administrator. Please check back soon!");
      }
    }
  } catch (err) {
    console.error('Auth check error:', err);
    if (!state.currentUser) showAuthModal();
  }
}

function updateAuthUI() {
  const userSection = document.getElementById('userHeaderSection');
  const adminBtn = document.getElementById('btnAdminPanel');
  const sideUserSection = document.getElementById('sideUserSection');
  const sideAdminBtn = document.getElementById('sideBtnAdmin');

  if (!state.currentUser) {
    if (userSection) {
      userSection.innerHTML = `
        <button onclick="showAuthModal('login')" class="px-3 py-1.5 rounded-lg bg-bullGreen hover:bg-bullGreen/90 text-black font-bold text-xs shadow transition">
          Sign In
        </button>
      `;
    }
    if (sideUserSection) {
      sideUserSection.innerHTML = `
        <button onclick="showAuthModal('login')" class="w-full py-2 rounded-lg bg-bullGreen hover:bg-bullGreen/90 text-black font-bold text-xs shadow flex items-center justify-center gap-1.5 transition">
          <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
          <span>Sign In / Request Access</span>
        </button>
      `;
    }
    if (adminBtn) adminBtn.classList.add('hidden');
    if (sideAdminBtn) sideAdminBtn.classList.add('hidden');
    const tabAdmin = document.getElementById('tabAdmin');
    const sideTabAdmin = document.getElementById('sideTabAdmin');
    if (tabAdmin) tabAdmin.classList.add('hidden');
    if (sideTabAdmin) sideTabAdmin.classList.add('hidden');
    if (window.lucide) lucide.createIcons();
    return;
  }

  const isAdmin = state.currentUser.role === 'admin';
  const tabAdmin = document.getElementById('tabAdmin');
  const sideTabAdmin = document.getElementById('sideTabAdmin');
  if (isAdmin) {
    if (adminBtn) adminBtn.classList.remove('hidden');
    if (sideAdminBtn) sideAdminBtn.classList.remove('hidden');
    if (tabAdmin) tabAdmin.classList.remove('hidden');
    if (sideTabAdmin) sideTabAdmin.classList.remove('hidden');
    checkPendingAdminUsers();
  } else {
    if (adminBtn) adminBtn.classList.add('hidden');
    if (sideAdminBtn) sideAdminBtn.classList.add('hidden');
    if (tabAdmin) tabAdmin.classList.add('hidden');
    if (sideTabAdmin) sideTabAdmin.classList.add('hidden');
  }

  if (userSection) {
    userSection.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 bg-tradeDark px-3 py-1.5 rounded-lg border border-tradeBorder text-xs">
          <span class="w-2 h-2 rounded-full ${state.currentUser.status === 'approved' ? 'bg-bullGreen' : 'bg-accentGold'}"></span>
          <span class="text-gray-200 font-semibold">${state.currentUser.name}</span>
        </div>
        <button onclick="openLogoutModal()" class="px-3 py-1.5 rounded-lg bg-bearRed/20 hover:bg-bearRed/30 text-bearRed border border-bearRed/40 font-bold text-xs flex items-center gap-1.5 transition shadow">
          <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
          <span>Log Out</span>
        </button>
      </div>
    `;
  }

  if (sideUserSection) {
    sideUserSection.innerHTML = `
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2 overflow-hidden">
          <span class="w-2 h-2 rounded-full shrink-0 ${state.currentUser.status === 'approved' ? 'bg-bullGreen' : 'bg-accentGold'}"></span>
          <div class="truncate">
            <div class="text-xs font-bold text-white truncate">${state.currentUser.name}</div>
            <div class="text-[10px] text-gray-400 capitalize">${state.currentUser.role} &bull; ${state.currentUser.status}</div>
          </div>
        </div>
        <button onclick="openLogoutModal()" title="Log Out" class="p-1.5 rounded-lg text-bearRed hover:bg-bearRed/20 transition">
          <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  }

  if (window.lucide) lucide.createIcons();
}

function showAuthModal(defaultTab = 'login') {
  document.getElementById('authModal').classList.remove('hidden');
  switchAuthTab(defaultTab);
  if (window.lucide) lucide.createIcons();
}

function hideAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('authTabLogin');
  const tabSignup = document.getElementById('authTabSignup');
  const formLogin = document.getElementById('loginForm');
  const formSignup = document.getElementById('signupForm');
  const alertEl = document.getElementById('authAlert');
  alertEl.classList.add('hidden');

  if (tab === 'login') {
    tabLogin.className = 'flex-1 py-2 rounded-lg bg-bullGreen text-black transition shadow';
    tabSignup.className = 'flex-1 py-2 rounded-lg text-gray-400 hover:text-white transition';
    formLogin.classList.remove('hidden');
    formSignup.classList.add('hidden');
  } else {
    tabSignup.className = 'flex-1 py-2 rounded-lg bg-accentGold text-black transition shadow';
    tabLogin.className = 'flex-1 py-2 rounded-lg text-gray-400 hover:text-white transition';
    formSignup.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('btnLoginSubmit');
  const alertEl = document.getElementById('authAlert');

  btn.disabled = true;
  btn.textContent = 'Verifying...';
  alertEl.classList.add('hidden');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    state.token = data.token;
    localStorage.setItem('sniper_token', data.token);
    state.currentUser = data.user;

    checkAuthStatus();
  } catch (err) {
    alertEl.textContent = err.message;
    alertEl.className = 'p-3 rounded-lg text-xs leading-relaxed bg-bearRed/20 text-bearRed border border-bearRed/30';
    alertEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In to Dashboard';
  }
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const btn = document.getElementById('btnSignupSubmit');
  const alertEl = document.getElementById('authAlert');

  btn.disabled = true;
  btn.textContent = 'Submitting Request...';
  alertEl.classList.add('hidden');

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');

    alertEl.innerHTML = `
      <div class="space-y-1">
        <div class="font-bold text-accentGold flex items-center gap-1.5">
          <span>⏳ Request Submitted Successfully!</span>
        </div>
        <p class="text-[11px] text-gray-300">
          Your account has been submitted and is awaiting approval by Administrator (Sai Vivek). Once approved, you can Sign In with your email & password.
        </p>
      </div>
    `;
    alertEl.className = 'p-3.5 rounded-xl text-xs leading-relaxed bg-accentGold/20 text-accentGold border border-accentGold/40 font-medium';
    alertEl.classList.remove('hidden');

    setTimeout(() => {
      switchAuthTab('login');
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').value = '';
    }, 3500);

  } catch (err) {
    alertEl.textContent = err.message;
    alertEl.className = 'p-3 rounded-lg text-xs leading-relaxed bg-bearRed/20 text-bearRed border border-bearRed/30';
    alertEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = '📝 Request Access from Admin';
  }
}

function openLogoutModal() {
  document.getElementById('logoutConfirmModal').classList.remove('hidden');
}

function closeLogoutModal() {
  document.getElementById('logoutConfirmModal').classList.add('hidden');
}

async function handleLogout() {
  if (state.token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${state.token}`, 'bypass-tunnel-reminder': 'true' }
      });
    } catch (e) {}
  }
  localStorage.removeItem('sniper_token');
  state.token = null;
  state.currentUser = null;
  if (state.refreshTimer) clearInterval(state.refreshTimer);

  closeLogoutModal();

  // Show clean logout message
  const alertEl = document.getElementById('authAlert');
  alertEl.textContent = "You have safely logged out of The Market Sniper Shooters.";
  alertEl.className = 'p-3 rounded-lg text-xs leading-relaxed bg-bullGreen/20 text-bullGreen border border-bullGreen/30';
  alertEl.classList.remove('hidden');

  showAuthModal();
  updateAuthUI();
}

// ==========================================
// ADMIN DASHBOARD ENGINE
// ==========================================

function openAdminModal() {
  document.getElementById('adminModal').classList.remove('hidden');
  const footerEmail = document.getElementById('adminFooterEmail');
  if (footerEmail && state.currentUser) {
    footerEmail.textContent = state.currentUser.email;
  }
  loadAdminUsers();
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.add('hidden');
}

async function checkPendingAdminUsers() {
  if (!state.token || state.currentUser?.role !== 'admin') return;
  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${state.token}`, 'bypass-tunnel-reminder': 'true' }
    });
    if (!res.ok) return;
    const data = await res.json();
    const pendingCount = (data.users || []).filter(u => u.status === 'pending').length;
    const badge = document.getElementById('pendingBadge');
    const sideBadge = document.getElementById('sidePendingBadge');

    const tabAdminBadge = document.getElementById('tabAdminBadge');
    const sideAdminTabBadge = document.getElementById('sideAdminTabBadge');
    if (pendingCount > 0) {
      if (badge) { badge.textContent = `${pendingCount}`; badge.classList.remove('hidden'); }
      if (sideBadge) { sideBadge.textContent = `${pendingCount}`; sideBadge.classList.remove('hidden'); }
      if (tabAdminBadge) { tabAdminBadge.textContent = `${pendingCount}`; tabAdminBadge.classList.remove('hidden'); }
      if (sideAdminTabBadge) { sideAdminTabBadge.textContent = `${pendingCount}`; sideAdminTabBadge.classList.remove('hidden'); }
    } else {
      if (badge) badge.classList.add('hidden');
      if (sideBadge) sideBadge.classList.add('hidden');
      if (tabAdminBadge) tabAdminBadge.classList.add('hidden');
      if (sideAdminTabBadge) sideAdminTabBadge.classList.add('hidden');
    }
  } catch (e) {}
}

async function loadAdminUsers() {
  const tbody = document.getElementById('adminUsersBody');
  const pageTbody = document.getElementById('adminPageUsersBody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-gray-500">Loading user registry...</td></tr>`;
  if (pageTbody) pageTbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-gray-500">Loading user registry...</td></tr>`;

  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${state.token}`, 'bypass-tunnel-reminder': 'true' }
    });
    if (!res.ok) throw new Error("Failed to load users");
    const data = await res.json();
    const users = data.users || [];

    // Update pending badge
    const pendingCount = users.filter(u => u.status === 'pending').length;
    const badge = document.getElementById('pendingBadge');
    const sideBadge = document.getElementById('sidePendingBadge');
    if (pendingCount > 0) {
      if (badge) { badge.textContent = `${pendingCount}`; badge.classList.remove('hidden'); }
      if (sideBadge) { sideBadge.textContent = `${pendingCount}`; sideBadge.classList.remove('hidden'); }
    } else {
      if (badge) badge.classList.add('hidden');
      if (sideBadge) sideBadge.classList.add('hidden');
    }

    // Update admin page statistics
    const statTotal = document.getElementById('adminStatTotal');
    const statPending = document.getElementById('adminStatPending');
    const statPendingBadge = document.getElementById('adminStatPendingBadge');
    const statApproved = document.getElementById('adminStatApproved');
    const statCurrentEmail = document.getElementById('adminStatCurrentEmail');
    const tabAdminBadge = document.getElementById('tabAdminBadge');
    const sideAdminTabBadge = document.getElementById('sideAdminTabBadge');

    if (statTotal) statTotal.textContent = users.length;
    if (statPending) statPending.textContent = pendingCount;
    if (statPendingBadge) statPendingBadge.classList.toggle('hidden', pendingCount === 0);
    if (statApproved) statApproved.textContent = users.filter(u => u.status === 'approved').length;
    if (statCurrentEmail) statCurrentEmail.textContent = state.currentUser?.email || 'Sai Vivek (Admin)';
    if (tabAdminBadge) { tabAdminBadge.textContent = pendingCount; tabAdminBadge.classList.toggle('hidden', pendingCount === 0); }
    if (sideAdminTabBadge) { sideAdminTabBadge.textContent = pendingCount; sideAdminTabBadge.classList.toggle('hidden', pendingCount === 0); }

    if (users.length === 0) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-gray-500">No registered users yet.</td></tr>`;
      if (pageTbody) pageTbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-gray-500">No registered users yet.</td></tr>`;
      return;
    }

    const usersHtml = users.map(u => {
      const isSelf = u.email.toLowerCase() === state.currentUser?.email.toLowerCase();
      const dateStr = new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

      let statusBadge = '';
      if (u.status === 'approved') {
        statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-bullGreen/20 text-bullGreen border border-bullGreen/30">APPROVED</span>';
      } else if (u.status === 'pending') {
        statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-accentGold/20 text-accentGold border border-accentGold/30 animate-pulse">PENDING</span>';
      } else {
        statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-bearRed/20 text-bearRed border border-bearRed/30">REJECTED</span>';
      }

      return `
        <tr class="hover:bg-tradeCard/50 transition">
          <td class="py-3 px-4">
            <strong class="text-white block font-medium">${u.name}</strong>
            <span class="text-gray-400 text-[11px]">${u.email}</span>
          </td>
          <td class="py-3 px-4">
            <span class="text-xs uppercase font-bold ${u.role === 'admin' ? 'text-accentGold' : 'text-gray-400'}">${u.role}</span>
          </td>
          <td class="py-3 px-4">
            ${statusBadge}
          </td>
          <td class="py-3 px-4 text-gray-500 text-[11px]">
            ${dateStr}
          </td>
          <td class="py-3 px-4 text-right space-x-1.5">
            ${isSelf ? '<span class="text-[11px] text-gray-500 italic">Current User</span>' : `
              ${u.status !== 'approved' ? `
                <button onclick="handleAdminUserAction('${u.email}', 'approve')" class="px-2.5 py-1 bg-bullGreen hover:bg-bullGreen/90 text-black font-bold text-[11px] rounded transition shadow">
                  ✅ Grant Access
                </button>
              ` : `
                <button onclick="handleAdminUserAction('${u.email}', 'reject')" class="px-2.5 py-1 bg-tradeBorder hover:bg-bearRed/20 hover:text-bearRed text-gray-400 text-[11px] rounded transition">
                  🚫 Revoke
                </button>
              `}
              <button onclick="handleAdminUserAction('${u.email}', 'delete')" title="Delete User" class="p-1 text-gray-500 hover:text-bearRed transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');

    if (tbody) tbody.innerHTML = usersHtml;
    if (pageTbody) pageTbody.innerHTML = usersHtml;

    if (window.lucide) lucide.createIcons();

  } catch (err) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-bearRed">${err.message}</td></tr>`;
    if (pageTbody) pageTbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-bearRed">${err.message}</td></tr>`;
  }
}

async function handleAdminUserAction(email, action) {
  if (action === 'delete' && !confirm(`Are you sure you want to delete user ${email}?`)) {
    return;
  }

  try {
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`,
        'bypass-tunnel-reminder': 'true'
      },
      body: JSON.stringify({ email, action })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Action failed");

    loadAdminUsers();
  } catch (err) {
    alert(err.message);
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('mobileSidebarBackdrop');
  if (!sidebar) return;

  const isClosed = sidebar.classList.contains('-translate-x-full');
  if (isClosed) {
    sidebar.classList.remove('-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
  }
}

function switchIndex(indexName) {
  state.currentIndex = indexName;
  
  // Top index buttons (if present)
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

  // Sidebar index buttons
  ['sideBtnNifty', 'sideBtnSensex', 'sideBtnBankNifty'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between border border-transparent hover:border-tradeBorder hover:bg-tradeDark text-gray-300';
  });

  const sideActiveId = indexName === 'nifty' ? 'sideBtnNifty' : indexName === 'sensex' ? 'sideBtnSensex' : 'sideBtnBankNifty';
  const sideActiveEl = document.getElementById(sideActiveId);
  if (sideActiveEl) {
    const activeColor = indexName === 'nifty' 
      ? 'border-bullGreen/40 bg-bullGreen/15 text-white' 
      : indexName === 'sensex' 
      ? 'border-accentGold/40 bg-accentGold/15 text-white' 
      : 'border-indigo-500/40 bg-indigo-500/15 text-white';
    sideActiveEl.className = `w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between border ${activeColor} shadow-sm`;
  }

  const activeDesk = document.getElementById('activeDeskLabel');
  if (activeDesk) {
    const label = indexName === 'nifty' ? 'NIFTY 50' : indexName === 'sensex' ? 'SENSEX' : 'BANK NIFTY';
    const dot = indexName === 'nifty' ? 'bg-bullGreen' : indexName === 'sensex' ? 'bg-accentGold' : 'bg-indigo-400';
    activeDesk.innerHTML = `<span class="w-2 h-2 rounded-full ${dot}"></span> ${label}`;
  }

  document.getElementById('spotLabel').textContent = `${indexName.toUpperCase()} SPOT`;
  fetchLiveData();

  // Close mobile drawer on navigation
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('mobileSidebarBackdrop');
  if (sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
  }
}

function switchTab(tab) {
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
    { id: 'tabLadder', activeClass: 'text-white bg-tradeCard border border-tradeBorder shadow' },
    { id: 'tabAdmin', activeClass: 'text-accentGold bg-accentGold/20 border border-accentGold/60 shadow' }
  ];

  topTabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (!el) return;
    const tabName = t.id.replace('tab', '').toLowerCase();
    if (tab === tabName) {
      el.className = `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${t.activeClass}`;
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
    { id: 'sideTabLadder', activeClass: 'bg-tradeDark text-white border border-tradeBorder shadow-sm' },
    { id: 'sideTabAdmin', activeClass: 'bg-accentGold/20 text-accentGold border-2 border-accentGold shadow-md' }
  ];

  sideTabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (!el) return;
    const tabName = t.id.replace('sideTab', '').toLowerCase();
    if (tab === tabName) {
      el.className = `w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${t.activeClass}`;
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
    ladder: document.getElementById('viewLadder'),
    admin: document.getElementById('viewAdmin')
  };

  Object.entries(views).forEach(([vKey, el]) => {
    if (el) el.classList.toggle('hidden', tab !== vKey);
  });

  if (tab === 'news') {
    loadLiveNews(true);
  } else if (tab === 'academy') {
    initAcademy();
  } else if (tab === 'admin') {
    loadAdminUsers();
  } else if (tab === 'equal') {
    if (state.lastData) renderEqualPairs(state.lastData.equalPairs || []);
  } else if (tab === 'hero') {
    if (state.lastData) renderHeroZero(state.lastData.heroPicks || { ce: [], pe: [] }, state.lastData.lotSize);
  } else if (tab === 'ladder') {
    if (state.lastData) renderLadder(state.lastData.chain || [], state.lastData.atmStrike);
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
    if (elEntry) elEntry.textContent = `Buy ₹${topBull.entryMin} - ₹${topBull.entryMax} (Spot > ${topBull.triggerSpot})`;
    if (elT1) elT1.textContent = `₹${topBull.tp1}`;
    if (elT2) elT2.textContent = `₹${topBull.tp2}`;
    if (elSL) elSL.textContent = `₹${topBull.sl}`;
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
    if (elEntry) elEntry.textContent = `Buy ₹${topBear.entryMin} - ₹${topBear.entryMax} (Spot < ${topBear.triggerSpot})`;
    if (elT1) elT1.textContent = `₹${topBear.tp1}`;
    if (elT2) elT2.textContent = `₹${topBear.tp2}`;
    if (elSL) elSL.textContent = `₹${topBear.sl}`;
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
      container.innerHTML = `<div class="p-8 text-center text-gray-400">Loading Bullish Call (CE) Setups...</div>`;
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
      container.innerHTML = `<div class="p-8 text-center text-gray-400">Loading Bearish Put (PE) Setups...</div>`;
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

  return `
    <div class="bg-tradeCard border-2 ${themeBorder} rounded-2xl p-6 space-y-4 shadow-2xl transition group relative overflow-hidden">
      
      <!-- Top Title & Badge Strip -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-tradeBorder/80 pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-xs font-mono px-2.5 py-1 rounded-md font-bold uppercase ${badgeStyle} border flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full ${isCE ? 'bg-bullGreen' : 'bg-bearRed'} animate-ping"></span>
            ${trade.badge || (isCE ? 'BULLISH SETUP' : 'BEARISH SETUP')}
          </span>
          <h4 class="text-base font-extrabold text-white font-mono">
            ${trade.setupName}
          </h4>
        </div>
        <div class="flex items-center gap-2 font-mono">
          <span class="text-xs text-gray-400">Target Risk/Reward:</span>
          <span class="text-xs font-bold text-accentGold px-2 py-0.5 rounded bg-accentGold/10 border border-accentGold/30">
            ${trade.riskReward}
          </span>
        </div>
      </div>

      <!-- Strike, LTP & Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-tradeDark p-4 rounded-xl border border-tradeBorder font-mono">
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Option Strike</span>
          <strong class="text-base font-bold text-white">${trade.name}</strong>
        </div>
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Current Premium (LTP)</span>
          <strong class="text-xl font-bold ${ltpColor}">₹${trade.ltp.toFixed(1)}</strong>
        </div>
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Recommended Entry Range</span>
          <strong class="text-sm font-bold text-white">₹${trade.entryMin} - ₹${trade.entryMax}</strong>
          <span class="text-[10px] text-gray-400 block">Trigger: Spot ${isCE ? '>' : '<'} ${trade.triggerSpot}</span>
        </div>
        <div>
          <span class="text-[10px] text-gray-500 uppercase block">Stop Loss (SL)</span>
          <strong class="text-sm font-bold text-bearRed">₹${trade.sl} (-₹${trade.slPts} pts)</strong>
        </div>
      </div>

      <!-- Targets Row -->
      <div class="grid grid-cols-2 gap-3 font-mono text-center">
        <div class="p-3 rounded-xl bg-bullGreen/10 border border-bullGreen/30">
          <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Target 1 (Conservative Milestone)</span>
          <strong class="text-base font-bold text-bullGreen">₹${trade.tp1} (+₹${trade.tp1Pts} pts)</strong>
        </div>
        <div class="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30">
          <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Target 2 (Runner Multi-Bagger)</span>
          <strong class="text-base font-bold text-cyan-400">₹${trade.tp2} (+₹${trade.tp2Pts} pts)</strong>
        </div>
      </div>

      <!-- 1. INSTITUTIONAL REASON BOX (MANDATORY REQUIREMENT) -->
      <div class="p-4 rounded-xl bg-[#0d121c] border border-tradeBorder space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-bold text-accentGold uppercase tracking-wide">
          <i data-lucide="shield-check" class="w-4 h-4"></i>
          <span>Institutional Technical Blueprint (Why to Enter This Trade)</span>
        </div>
        <p class="text-xs text-gray-200 leading-relaxed font-sans">
          ${trade.reason}
        </p>
      </div>

      <!-- 2. LIVE NEWS EFFECT & MACRO CATALYST BOX (MANDATORY REQUIREMENT) -->
      <div class="p-4 rounded-xl bg-[#09151e] border border-cyan-400/30 space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
          <i data-lucide="newspaper" class="w-4 h-4"></i>
          <span>Live News & Macro Catalyst Impact</span>
        </div>
        <p class="text-xs text-gray-200 leading-relaxed font-sans">
          ${trade.newsEffect}
        </p>
      </div>

      <!-- 3. INTERACTIVE LOTS SLIDER & LIVE CALCULATOR -->
      <div class="p-4 rounded-xl bg-tradeDark border border-tradeBorder space-y-3">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-gray-300">Quantity Allocation: <strong id="calcLotLabel_${trade.id}" class="text-white">1 Lot (${lotSize} Qty)</strong></span>
          <span class="text-gray-300">Capital Required: <strong id="calcCap_${trade.id}" class="text-accentGold">₹${Math.round(trade.ltp * lotSize).toLocaleString('en-IN')}</strong></span>
        </div>
        <input type="range" min="1" max="15" value="1" 
          oninput="updateTradeCalc('${trade.id}', this.value, ${trade.ltp}, ${lotSize}, ${trade.tp1Pts}, ${trade.tp2Pts})" 
          class="w-full accent-bullGreen h-1.5 bg-tradeCard rounded-lg cursor-pointer">
        <div class="grid grid-cols-2 gap-2 text-xs font-mono text-center">
          <div class="p-2 rounded bg-tradeCard/80 border border-tradeBorder">
            <span class="text-[10px] text-gray-400 block">Expected Profit @ Target 1</span>
            <strong id="calcP1_${trade.id}" class="text-bullGreen font-bold">+₹${Math.round(trade.tp1Pts * lotSize).toLocaleString('en-IN')}</strong>
          </div>
          <div class="p-2 rounded bg-tradeCard/80 border border-tradeBorder">
            <span class="text-[10px] text-gray-400 block">Expected Profit @ Target 2</span>
            <strong id="calcP2_${trade.id}" class="text-cyan-400 font-bold">+₹${Math.round(trade.tp2Pts * lotSize).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3 pt-1">
        <button onclick="copyTradeString('${trade.name}', ${trade.ltp}, ${trade.sl}, ${trade.tp1})" class="flex-1 py-3 rounded-xl bg-bullGreen hover:bg-bullGreen/90 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-bullGreen/20">
          <i data-lucide="copy" class="w-4 h-4"></i>
          <span>Copy for Upstox / Broker Order String</span>
        </button>
      </div>

    </div>
  `;
}

function updateTradeCalc(tradeId, lots, ltp, lotSize, tp1Pts, tp2Pts) {
  const lotNum = parseInt(lots);
  const totalQty = lotNum * lotSize;
  const capital = Math.round(ltp * totalQty);
  const profit1 = Math.round(tp1Pts * totalQty);
  const profit2 = Math.round(tp2Pts * totalQty);

  const lbl = document.getElementById(`calcLotLabel_${tradeId}`);
  const cap = document.getElementById(`calcCap_${tradeId}`);
  const p1 = document.getElementById(`calcP1_${tradeId}`);
  const p2 = document.getElementById(`calcP2_${tradeId}`);

  if (lbl) lbl.textContent = `${lotNum} Lot${lotNum > 1 ? 's' : ''} (${totalQty} Qty)`;
  if (cap) cap.textContent = `₹${capital.toLocaleString('en-IN')}`;
  if (p1) p1.textContent = `+₹${profit1.toLocaleString('en-IN')}`;
  if (p2) p2.textContent = `+₹${profit2.toLocaleString('en-IN')}`;
}

function copyTradeString(name, ltp, sl, tp1) {
  const text = `BUY ${name} LIMIT ₹${ltp} SL ₹${sl} TGT ₹${tp1}`;
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied Order to Clipboard:\n${text}`);
  }).catch(() => {
    // fallback
  });
}

// ==========================================
// LIVE MARKET NEWS & IMPACT ENGINE
// ==========================================

async function loadLiveNews(force = false) {
  const container = document.getElementById('newsCardsContainer');
  if (!container) return;

  if (force || !state.newsData) {
    if (!state.newsData) {
      container.innerHTML = `<div class="col-span-full py-12 text-center text-gray-400"><span class="animate-spin inline-block mr-2">⏳</span> Loading real-time market news headlines...</div>`;
    }
    try {
      const res = await fetch('/api/live-news', {
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (!res.ok) throw new Error("Could not fetch news");
      const data = await res.json();
      state.newsData = data.news || [];
      
      const badge = document.getElementById('newsLiveBadge');
      if (badge) {
        const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
        badge.textContent = `LIVE • ${timeStr}`;
      }
    } catch (e) {
      if (!state.newsData) {
        container.innerHTML = `<div class="col-span-full py-8 text-center text-bearRed">${e.message}</div>`;
      }
      return;
    }
  }

  const news = state.newsData || [];
  if (news.length === 0) {
    container.innerHTML = `<div class="col-span-full py-8 text-center text-gray-500">No recent market news found.</div>`;
    return;
  }

  container.innerHTML = news.map(item => {
    const imp = item.impact || { sentiment: 'NEUTRAL', badgeClass: 'bg-accentGold/20 text-accentGold border-accentGold/30', expectedImpact: '±15 pts', chartEffect: 'Consolidation' };

    return `
      <div class="bg-tradeCard border border-tradeBorder rounded-xl p-4 space-y-3 hover:border-gray-600 transition shadow flex flex-col justify-between">
        <div class="space-y-2">
          <!-- Top Tag & Time -->
          <div class="flex items-center justify-between text-xs">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${imp.badgeClass}">
              ${imp.sentiment} (${imp.expectedImpact})
            </span>
            <span class="text-[11px] text-gray-500 font-mono">${item.source} • ${item.timeAgo}</span>
          </div>

          <!-- Headline -->
          <h4 class="text-sm font-bold text-white hover:text-cyan-400 transition leading-snug">
            <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
          </h4>

          <!-- Chart Impact Effect -->
          <div class="bg-tradeDark/90 rounded-lg p-2.5 border border-tradeBorder text-xs text-gray-300">
            <span class="text-gray-400 text-[10px] block uppercase font-bold tracking-wider mb-0.5">Chart & Option Impact:</span>
            <p class="text-[11px] font-medium leading-relaxed">${imp.chartEffect}</p>
          </div>
        </div>

        <div class="pt-2 border-t border-tradeBorder/50 flex items-center justify-between text-xs">
          <span class="text-[10px] text-gray-500">Source: ${item.source}</span>
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline flex items-center gap-1 font-semibold text-[11px]">
            <span>Read Article</span>
            <i data-lucide="external-link" class="w-3 h-3"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
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
  if (!state.token) return;

  try {
    const headers = {
      'bypass-tunnel-reminder': 'true',
      'Authorization': `Bearer ${state.token}`
    };

    const res = await fetch(`/api/live-data?index=${state.currentIndex}&expiryType=${state.activeExpiry}&_t=${Date.now()}`, {
      headers
    });

    if (res.status === 401) {
      handleLogout();
      return;
    }
    if (res.status === 403) {
      if (state.refreshTimer) clearInterval(state.refreshTimer);
      document.getElementById('pendingAlert').classList.remove('hidden');
      return;
    }
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

    // Continuously stream real-time news in background every 20 seconds
    if (!state.lastNewsFetch || Date.now() - state.lastNewsFetch > 20000) {
      state.lastNewsFetch = Date.now();
      loadLiveNews(true);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function renderUI(data) {
  if (!data || !data.spot) return;
  state.lastData = data;

  // Render Executive Command Center (3 Pillars) & Desks
  renderExecutiveHub(data);
  renderBullDesk(data);
  renderBearDesk(data);

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

  // Update sidebar spot prices
  const sideSpotId = state.currentIndex === 'nifty' ? 'sideSpotNifty' : state.currentIndex === 'sensex' ? 'sideSpotSensex' : 'sideSpotBankNifty';
  const sideSpotEl = document.getElementById(sideSpotId);
  if (sideSpotEl) {
    sideSpotEl.textContent = `₹${currentSpot.toLocaleString('en-IN')}`;
  }

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
  if (!actionBadge) return; // Safely exit if strategy section was replaced by Executive Command Center

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
  const sideEqual = document.getElementById('sideEqualCount');
  if (sideEqual) sideEqual.textContent = pairs.length;

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
  const sideHero = document.getElementById('sideHeroCount');
  if (sideHero) sideHero.textContent = ceList.length + peList.length;

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

// ==========================================
// MASTER TRADING ACADEMY (LEARNING OBJECTS) ENGINE
// ==========================================

let academyState = {
  currentTopicId: 'topic-candle-anatomy',
  activeCategory: 'all',
  searchQuery: '',
  completedTopics: JSON.parse(localStorage.getItem('sniper_completed_topics') || '[]')
};

function initAcademy() {
  // If reader is open, refresh reader, otherwise show hub
  const readerView = document.getElementById('academyReaderView');
  if (readerView && !readerView.classList.contains('hidden') && academyState.currentTopicId) {
    renderTopicReaderContent(academyState.currentTopicId);
  } else {
    renderAcademyHub();
  }
}

function openAcademyDashboard() {
  switchTab('academy');
  const hubView = document.getElementById('academyHubView');
  const readerView = document.getElementById('academyReaderView');
  if (hubView) hubView.classList.remove('hidden');
  if (readerView) readerView.classList.add('hidden');
  renderAcademyHub();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToAcademyDashboard() {
  const hubView = document.getElementById('academyHubView');
  const readerView = document.getElementById('academyReaderView');
  if (hubView) hubView.classList.remove('hidden');
  if (readerView) readerView.classList.add('hidden');
  renderAcademyHub();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openAcademyWithCategory(cat) {
  openAcademyDashboard();
  filterAcademyCategory(cat);
}

function filterAcademyCategory(cat) {
  academyState.activeCategory = cat;
  
  const categories = ['all', 'candlesticks', 'patterns', 'malaysian', 'fvg-ifvg', 'liquidity-amt', 'fibonacci', 'indicators', 'options'];
  categories.forEach(c => {
    const btn = document.getElementById(`cat-${c}`);
    if (!btn) return;
    if (c === cat) {
      btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-bullGreen text-black shadow-lg shadow-bullGreen/20';
    } else {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-semibold transition bg-tradeDark text-gray-400 hover:text-white border border-tradeBorder';
    }
  });

  renderAcademyHub();
}

function searchAcademyLessons() {
  const input = document.getElementById('academySearchInput');
  academyState.searchQuery = (input ? input.value : '').toLowerCase().trim();
  renderAcademyHub();
}

function getAllTopicsList() {
  const all = [];
  (window.ACADEMY_MODULES || []).forEach(mod => {
    (mod.topics || []).forEach(top => {
      all.push({ ...top, moduleId: mod.id, moduleTitle: mod.title, category: mod.category });
    });
  });
  return all;
}

function renderAcademyHub() {
  const container = document.getElementById('academyModulesGrid');
  if (!container || !window.ACADEMY_MODULES) return;

  const modules = window.ACADEMY_MODULES.filter(mod => {
    const matchCat = academyState.activeCategory === 'all' || mod.category === academyState.activeCategory;
    const matchSearch = !academyState.searchQuery || 
      mod.title.toLowerCase().includes(academyState.searchQuery) ||
      mod.summary.toLowerCase().includes(academyState.searchQuery) ||
      (mod.topics || []).some(t => t.title.toLowerCase().includes(academyState.searchQuery) || t.subtitle.toLowerCase().includes(academyState.searchQuery));
    return matchCat && matchSearch;
  });

  if (modules.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-gray-500">
        <i data-lucide="search-x" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
        <h3 class="text-sm font-bold text-white mb-1">No Modules Match Your Search</h3>
        <p class="text-xs text-gray-400">Try searching for "Candlestick", "Hammer", "Fibonacci", "Order Block", or "Gamma".</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    updateAcademyProgress();
    return;
  }

  container.innerHTML = modules.map(mod => {
    const badgeColor = 
      mod.color === 'bullGreen' ? 'text-bullGreen bg-bullGreen/15 border-bullGreen/30' :
      mod.color === 'accentGold' ? 'text-accentGold bg-accentGold/15 border-accentGold/30' :
      mod.color === 'cyan-400' ? 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30' :
      mod.color === 'bearRed' ? 'text-bearRed bg-bearRed/15 border-bearRed/30' :
      mod.color === 'indigo-400' ? 'text-indigo-400 bg-indigo-400/15 border-indigo-400/30' :
      'text-bullGreen bg-bullGreen/15 border-bullGreen/30';

    return `
      <div class="bg-tradeCard border border-tradeBorder hover:border-gray-600 rounded-2xl p-6 space-y-5 shadow-xl transition flex flex-col justify-between group">
        
        <!-- Module Header -->
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-tradeDark border border-tradeBorder flex items-center justify-center font-mono font-black text-sm text-accentGold">
                ${mod.number}
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${badgeColor}">
                ${mod.badge}
              </span>
            </div>
            <span class="text-xs font-mono text-gray-400">⏱️ ${mod.readTime}</span>
          </div>

          <div>
            <h3 class="text-base font-bold text-white group-hover:text-accentGold transition leading-snug">
              ${mod.title}
            </h3>
            <p class="text-xs text-gray-400 mt-1.5 leading-relaxed">
              ${mod.summary}
            </p>
          </div>
        </div>

        <!-- Topics Inside Module -->
        <div class="pt-3 border-t border-tradeBorder/60 space-y-2.5">
          <div class="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mb-1 flex items-center justify-between">
            <span>Curriculum Topics (${(mod.topics || []).length}):</span>
            <span class="text-[9px] text-accentGold font-bold">CLICK TOPIC OR SUB-TOPIC TO ENTER</span>
          </div>
          <div class="space-y-2">
            ${(mod.topics || []).map(topic => {
              const isDone = academyState.completedTopics.includes(topic.id);
              const subs = topic.subTopics || [];
              return `
                <div class="p-3 rounded-xl bg-tradeDark/70 hover:bg-tradeDark border border-tradeBorder/80 hover:border-accentGold/60 transition shadow-sm space-y-2.5">
                  <!-- Main Topic Header (Clickable) -->
                  <div onclick="openTopicReader('${topic.id}')" class="cursor-pointer flex items-center justify-between gap-3 group/item">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                      <span class="text-xs ${isDone ? 'text-bullGreen' : 'text-gray-500'} shrink-0">
                        <i data-lucide="${isDone ? 'check-circle' : 'circle'}" class="w-4 h-4"></i>
                      </span>
                      <div class="truncate">
                        <h4 class="text-xs font-bold text-gray-200 group-hover/item:text-accentGold transition truncate">
                          ${topic.title}
                        </h4>
                        <p class="text-[10px] text-gray-400 truncate font-mono">
                          ${topic.subtitle}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span class="text-[10px] text-gray-400 font-mono">${topic.readTime}</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-accentGold group-hover/item:translate-x-0.5 transition"></i>
                    </div>
                  </div>

                  <!-- Direct Sub-Topic Navigation (User Requested) -->
                  ${subs.length > 0 ? `
                    <div class="pt-2 border-t border-tradeBorder/50">
                      <div class="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span class="text-accentGold/80 font-bold">Sub-topics (${subs.length}):</span>
                        <span class="text-[8px] text-gray-500 font-mono">Jump straight to section</span>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        ${subs.map(sub => `
                          <button onclick="event.stopPropagation(); openTopicReader('${topic.id}', '${sub.id}')" class="text-left px-2.5 py-1.5 rounded-lg bg-tradeCard/80 hover:bg-bullGreen/15 border border-tradeBorder/70 hover:border-bullGreen/50 text-gray-300 hover:text-white text-[11px] font-medium transition flex items-center gap-1.5 group/sub shadow-sm">
                            <span class="w-1.5 h-1.5 rounded-full bg-accentGold group-hover/sub:bg-bullGreen shrink-0"></span>
                            <span class="truncate">${sub.title}</span>
                          </button>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Start Module Button -->
        <div class="pt-2">
          <button onclick="openTopicReader('${(mod.topics && mod.topics[0]) ? mod.topics[0].id : ''}')" class="w-full py-2.5 rounded-xl bg-tradeDark hover:bg-bullGreen hover:text-black border border-tradeBorder hover:border-bullGreen text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
            <span>Study Module Deep Learning</span>
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
  updateAcademyProgress();
}

function openTopicReader(topicId, subTopicId = null) {
  switchTab('academy');
  const hubView = document.getElementById('academyHubView');
  const readerView = document.getElementById('academyReaderView');
  if (hubView) hubView.classList.add('hidden');
  if (readerView) readerView.classList.remove('hidden');

  academyState.currentTopicId = topicId;
  renderTopicReaderContent(topicId);

  if (subTopicId) {
    setTimeout(() => {
      scrollToSubTopic(subTopicId);
    }, 150);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function scrollToSubTopic(subId) {
  const el = document.getElementById(subId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Flash golden highlight ring so the user visually sees they arrived at their subtopic
    el.classList.add('ring-2', 'ring-accentGold', 'shadow-2xl', 'transition-all', 'duration-500');
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-accentGold');
    }, 2800);
  }
}

function renderTopicReaderContent(topicId) {
  const allTopics = getAllTopicsList();
  const currentIdx = allTopics.findIndex(t => t.id === topicId);
  const topicMeta = currentIdx >= 0 ? allTopics[currentIdx] : allTopics[0];
  const deepData = (window.ACADEMY_DEEP_TOPICS && window.ACADEMY_DEEP_TOPICS[topicId]) || null;

  // Breadcrumbs
  const bModule = document.getElementById('readerBreadcrumbModule');
  const bTitle = document.getElementById('readerBreadcrumbTitle');
  if (bModule) bModule.textContent = topicMeta ? topicMeta.moduleTitle : 'Module';
  if (bTitle) bTitle.textContent = topicMeta ? topicMeta.title : 'Topic';

  // Navigation Buttons
  const btnPrev = document.getElementById('readerBtnPrev');
  const btnNext = document.getElementById('readerBtnNext');
  if (btnPrev) {
    btnPrev.disabled = currentIdx <= 0;
    btnPrev.classList.toggle('opacity-50', currentIdx <= 0);
    btnPrev.classList.toggle('cursor-not-allowed', currentIdx <= 0);
  }
  if (btnNext) {
    btnNext.disabled = currentIdx >= allTopics.length - 1;
    btnNext.classList.toggle('opacity-50', currentIdx >= allTopics.length - 1);
    btnNext.classList.toggle('cursor-not-allowed', currentIdx >= allTopics.length - 1);
  }

  // Completion Button
  const isCompleted = academyState.completedTopics.includes(topicId);
  const compBtn = document.getElementById('readerBtnComplete');
  if (compBtn) {
    if (isCompleted) {
      compBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow bg-bullGreen text-black';
      compBtn.innerHTML = `<i data-lucide="check-circle" class="w-3.5 h-3.5"></i><span>Mastered ✓</span>`;
    } else {
      compBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow bg-tradeDark hover:bg-tradeBorder border border-tradeBorder text-gray-300';
      compBtn.innerHTML = `<i data-lucide="circle" class="w-3.5 h-3.5"></i><span>Mark as Mastered</span>`;
    }
  }

  // Render Table of Contents
  const tocContainer = document.getElementById('readerTocList');
  const tocCountEl = document.getElementById('readerTocCount');
  const tocItems = deepData ? deepData.tableOfContents || [] : [];
  if (tocCountEl) tocCountEl.textContent = `${tocItems.length} Sections`;
  if (tocContainer) {
    if (tocItems.length > 0) {
      tocContainer.innerHTML = tocItems.map(item => `
        <button onclick="scrollToSubTopic('${item.id}')" class="w-full text-left py-2 px-3 rounded-xl text-gray-300 hover:text-accentGold hover:bg-tradeDark/90 transition text-xs font-medium flex items-center justify-between group">
          <span class="truncate">${item.title}</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-accentGold transition shrink-0"></i>
        </button>
      `).join('');
    } else {
      tocContainer.innerHTML = `<div class="py-2 text-gray-500 text-[11px]">Overview, Blueprint & Execution</div>`;
    }
  }

  // Render Main Canvas
  const canvas = document.getElementById('readerCanvas');
  if (!canvas) return;

  const title = deepData ? deepData.title : (topicMeta ? topicMeta.title : 'Topic Masterclass');
  const subtitle = deepData ? deepData.subtitle : (topicMeta ? topicMeta.subtitle : '');
  const level = deepData ? deepData.level : (topicMeta ? topicMeta.level : 'Intermediate');
  const readTime = deepData ? deepData.readTime : (topicMeta ? topicMeta.readTime : '10 min');
  const analystNote = deepData ? deepData.analystNote : 'Focus strictly on institutional volume expansion and liquidity sweep confirmations before committing risk.';
  const trade = deepData ? deepData.tradeDetails : null;
  const svg = deepData ? deepData.svgBlueprint : '';

  const prevTopic = currentIdx > 0 ? allTopics[currentIdx - 1] : null;
  const nextTopic = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null;

  canvas.innerHTML = `
    <!-- Top Header of Lesson -->
    <div class="border-b border-tradeBorder pb-6 space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-mono px-2.5 py-0.5 rounded uppercase font-bold bg-accentGold/20 text-accentGold border border-accentGold/30">
          ${topicMeta ? topicMeta.category : 'MASTERCLASS'}
        </span>
        <span class="text-xs font-mono text-gray-400 bg-tradeDark px-2 py-0.5 rounded border border-tradeBorder">
          Level: ${level}
        </span>
        <span class="text-xs font-mono text-gray-400">
          ⏱️ ${readTime} Read
        </span>
      </div>

      <h1 class="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
        ${title}
      </h1>
      <p class="text-xs md:text-sm text-gray-300 font-medium leading-relaxed">
        ${subtitle}
      </p>
    </div>

    <!-- Proprietary Analyst Note -->
    <div class="bg-gradient-to-r from-accentGold/10 via-tradeDark to-tradeCard border border-accentGold/40 rounded-2xl p-5 flex items-start gap-3.5 text-xs leading-relaxed shadow-lg">
      <div class="w-9 h-9 rounded-xl bg-accentGold text-black font-bold flex items-center justify-center shrink-0 text-lg shadow">
        💡
      </div>
      <div>
        <strong class="text-accentGold uppercase tracking-wider block font-bold mb-1">Institutional Prop-Desk Analyst Insight:</strong>
        <p class="text-gray-200 leading-relaxed">${analystNote}</p>
      </div>
    </div>

    <!-- SUB-TOPICS & DEEP LEARNING THEORETICAL BREAKDOWN -->
    ${deepData && deepData.subTopics && deepData.subTopics.length > 0 ? `
      <div class="space-y-6">
        ${deepData.subTopics.map(sub => `
          <div id="${sub.id}" class="bg-tradeDark/60 border border-tradeBorder rounded-2xl p-6 space-y-3 scroll-mt-28">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-bullGreen"></i>
              <span>${sub.title}</span>
            </h3>
            <div class="text-xs text-gray-300 leading-relaxed">
              ${sub.content}
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- VISUAL TECHNICAL TRADE BLUEPRINT (PICTURE FORM SVG) -->
    <div id="sub-4" class="space-y-3 scroll-mt-28">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-bullGreen uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="image" class="w-4 h-4"></i>
          Technical Blueprint: Entry, Stop Loss & Targets in Picture Form
        </span>
        <span class="text-[10px] text-gray-400 font-mono">Candlestick & Order Flow Geometry</span>
      </div>
      <div class="w-full rounded-2xl overflow-hidden shadow-2xl border border-tradeBorder bg-[#0e131d]">
        ${svg}
      </div>
    </div>

    <!-- SNIPER TRADE EXECUTION PARAMETERS -->
    ${trade ? `
      <div id="sub-5" class="bg-tradeDark border-2 border-bullGreen/40 rounded-2xl p-6 space-y-5 shadow-2xl scroll-mt-28">
        <div class="flex items-center justify-between border-b border-tradeBorder pb-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-bullGreen flex items-center gap-1.5">
            <i data-lucide="crosshair" class="w-4 h-4"></i>
            Sniper Trade Execution Parameters Matrix
          </h3>
          <span class="text-xs font-mono font-bold text-accentGold bg-accentGold/10 px-2.5 py-0.5 rounded border border-accentGold/20">
            Risk-to-Reward: ${trade.riskReward || '1:3.0'}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="bg-tradeCard p-3.5 rounded-xl border border-tradeBorder">
            <span class="text-[10px] text-gray-500 uppercase font-mono block">Setup Pattern Type</span>
            <strong class="text-white text-xs">${trade.setupType || '--'}</strong>
          </div>
          <div class="bg-tradeCard p-3.5 rounded-xl border border-tradeBorder">
            <span class="text-[10px] text-gray-500 uppercase font-mono block">Recommended Target Instrument</span>
            <strong class="text-white text-xs">${trade.instrument || '--'}</strong>
          </div>
          <div class="bg-tradeCard p-3.5 rounded-xl border border-bullGreen/40">
            <span class="text-[10px] text-bullGreen uppercase font-mono block font-bold">🟢 Entry Trigger Condition</span>
            <span class="text-gray-200 text-xs">${trade.entryTrigger || '--'}</span>
          </div>
          <div class="bg-tradeCard p-3.5 rounded-xl border border-bearRed/40">
            <span class="text-[10px] text-bearRed uppercase font-mono block font-bold">🛑 Stop Loss Rule</span>
            <span class="text-gray-200 text-xs">${trade.stopLoss || '--'}</span>
          </div>
          <div class="bg-tradeCard p-3.5 rounded-xl border border-tradeBorder">
            <span class="text-[10px] text-gray-400 uppercase font-mono block">🎯 Target 1 (Lock 50% Profit)</span>
            <strong class="text-bullGreen text-xs">${trade.target1 || '--'}</strong>
          </div>
          <div class="bg-tradeCard p-3.5 rounded-xl border border-tradeBorder">
            <span class="text-[10px] text-gray-400 uppercase font-mono block">🚀 Target 2 (Runner Target)</span>
            <strong class="text-cyan-400 text-xs">${trade.target2 || '--'}</strong>
          </div>
        </div>

        <!-- Pre-Trade Confirmation Checklist -->
        ${trade.executionChecklist && trade.executionChecklist.length > 0 ? `
          <div class="pt-3 border-t border-tradeBorder/60 space-y-2.5">
            <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Pre-Trade Institutional Confirmation Checklist:</span>
            <div class="space-y-2">
              ${trade.executionChecklist.map(item => `
                <div class="flex items-center gap-2.5 text-xs text-gray-300">
                  <i data-lucide="check-square" class="w-4 h-4 text-bullGreen shrink-0"></i>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Pitfalls & Traps to Avoid -->
        ${trade.pitfalls && trade.pitfalls.length > 0 ? `
          <div id="sub-6" class="pt-3 border-t border-tradeBorder/60 space-y-2 scroll-mt-28">
            <span class="text-[10px] text-bearRed uppercase font-bold tracking-wider block flex items-center gap-1.5">
              <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
              Retail Traps & Common Execution Pitfalls:
            </span>
            <ul class="list-disc pl-5 space-y-1 text-xs text-gray-300">
              ${trade.pitfalls.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

      </div>
    ` : ''}

    <!-- Bottom Navigation Footer with Previous / Next Topic Links -->
    <div class="pt-6 border-t border-tradeBorder flex flex-wrap items-center justify-between gap-4">
      ${prevTopic ? `
        <button onclick="openTopicReader('${prevTopic.id}')" class="px-5 py-3 rounded-2xl bg-tradeDark hover:bg-tradeBorder border border-tradeBorder text-xs text-gray-300 hover:text-white transition flex items-center gap-3">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <div class="text-left">
            <span class="text-[10px] text-gray-500 block uppercase font-mono">Previous Masterclass</span>
            <span class="font-bold truncate max-w-xs block text-white">${prevTopic.title}</span>
          </div>
        </button>
      ` : `<div></div>`}

      <!-- Quick Back to Dashboard Button at Bottom -->
      <button onclick="backToAcademyDashboard()" class="px-4 py-2.5 rounded-xl bg-accentGold/10 hover:bg-accentGold/20 border border-accentGold/40 text-accentGold text-xs font-bold transition flex items-center gap-1.5">
        <i data-lucide="layout-grid" class="w-4 h-4"></i>
        <span>Return to Academy Dashboard</span>
      </button>

      ${nextTopic ? `
        <button onclick="openTopicReader('${nextTopic.id}')" class="px-5 py-3 rounded-2xl bg-bullGreen hover:bg-bullGreen/90 text-black font-bold text-xs transition flex items-center gap-3 shadow-lg shadow-bullGreen/20">
          <div class="text-right">
            <span class="text-[10px] text-black/70 block uppercase font-mono">Next Masterclass</span>
            <span class="font-bold truncate max-w-xs block">${nextTopic.title}</span>
          </div>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      ` : `<div></div>`}
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function navigateReader(direction) {
  const allTopics = getAllTopicsList();
  const currentIdx = allTopics.findIndex(t => t.id === academyState.currentTopicId);
  const newIdx = currentIdx + direction;
  if (newIdx >= 0 && newIdx < allTopics.length) {
    openTopicReader(allTopics[newIdx].id);
  }
}

function toggleCurrentTopicComplete() {
  const topicId = academyState.currentTopicId;
  if (!topicId) return;

  const idx = academyState.completedTopics.indexOf(topicId);
  if (idx >= 0) {
    academyState.completedTopics.splice(idx, 1);
  } else {
    academyState.completedTopics.push(topicId);
  }
  localStorage.setItem('sniper_completed_topics', JSON.stringify(academyState.completedTopics));
  renderTopicReaderContent(topicId);
  updateAcademyProgress();
}

function updateAcademyProgress() {
  const allTopics = getAllTopicsList();
  const total = allTopics.length || 20;
  const completed = academyState.completedTopics.length;
  const percent = Math.min(100, Math.round((completed / total) * 100));

  const label = document.getElementById('academyProgressLabel');
  const percentEl = document.getElementById('academyProgressPercent');
  const circle = document.getElementById('academyProgressCircle');

  if (label) label.textContent = `${completed} / ${total} Topics Mastered`;
  if (percentEl) percentEl.textContent = `${percent}%`;
  if (circle) {
    const circumference = 2 * Math.PI * 18; // ~113.1
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
}
