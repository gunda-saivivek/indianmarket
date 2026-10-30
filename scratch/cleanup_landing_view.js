const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Remove old METRICS & CONTROL BAR + LIVE STRATEGY SECTION
const oldStartMarker = '<!-- METRICS & CONTROL BAR -->';
const oldEndMarker = '<!-- TABS BAR -->';

if (html.includes(oldStartMarker) && html.includes(oldEndMarker)) {
  const startIdx = html.indexOf(oldStartMarker);
  const endIdx = html.indexOf(oldEndMarker);
  html = html.substring(0, startIdx) + html.substring(endIdx);
  console.log('Removed legacy metrics & strategy clutter from above tabs!');
}

// 2. Ensure viewEqual is hidden
html = html.replace('<section id="viewEqual" class="space-y-4">', '<section id="viewEqual" class="space-y-4 hidden">');

// 3. Enhance viewExecutive with clean integrated metrics ribbon right below hero
const execHeroEnd = '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">';
const metricsRibbon = `<!-- Compact Institutional Metrics Ribbon -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div class="bg-tradeCard p-3 rounded-xl border border-tradeBorder">
          <span class="text-[10px] text-gray-500 uppercase block">ATM Strike Level</span>
          <div class="flex items-baseline justify-between mt-0.5">
            <strong class="text-lg font-bold text-accentGold" id="atmStrike">--</strong>
            <span class="text-[10px] text-gray-400" id="atmStraddle">Straddle: ₹--</span>
          </div>
        </div>
        <div class="bg-tradeCard p-3 rounded-xl border border-tradeBorder">
          <span class="text-[10px] text-gray-500 uppercase block">Market Bias / PCR</span>
          <div class="flex items-center justify-between mt-0.5">
            <strong class="text-lg font-bold text-white" id="pcrValue">--</strong>
            <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase" id="pcrBadge">NEUTRAL</span>
          </div>
        </div>
        <div class="bg-tradeCard p-3 rounded-xl border border-tradeBorder">
          <span class="text-[10px] text-gray-500 uppercase block">Active Expiry</span>
          <div class="flex items-center justify-between mt-0.5">
            <select id="expirySelect" onchange="onExpiryChange()" class="bg-tradeDark border border-tradeBorder text-white text-xs rounded px-1.5 py-0.5 focus:outline-none">
              <option value="current">Current Week</option>
              <option value="next">Next Week</option>
            </select>
            <span class="text-[10px] text-gray-400" id="expiryDateLabel">--</span>
          </div>
        </div>
        <div class="bg-tradeCard p-3 rounded-xl border border-tradeBorder">
          <span class="text-[10px] text-gray-500 uppercase block">Lot Size / Risk</span>
          <div class="flex items-baseline justify-between mt-0.5">
            <strong class="text-base font-bold text-bullGreen" id="lotSizeDisplay">65 Qty/Lot</strong>
            <span class="text-[10px] text-gray-400">Fixed Stop Protection</span>
          </div>
        </div>
      </div>\n\n      ` + execHeroEnd;

if (!html.includes('id="atmStrike"') && html.includes(execHeroEnd)) {
  html = html.replace(execHeroEnd, metricsRibbon);
  console.log('Integrated clean metrics ribbon into viewExecutive!');
}

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('SUCCESS: Cleaned up public/index.html');
