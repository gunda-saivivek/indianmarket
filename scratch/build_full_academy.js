/**
 * Script to generate complete institutional-grade academy-data.js
 * Contains all 20 topics across all 7 modules with full sub-topics,
 * sub-sub-topics, SVG visual blueprints, and execution parameter matrices.
 */

const fs = require('fs');
const path = require('path');

// Helper to create clean SVGs
function makeSvg(title, subtitle, elements) {
  return `<svg viewBox="0 0 760 360" class="w-full h-auto bg-[#0e131d] rounded-xl border border-tradeBorder">
  <defs>
    <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00c076"/><stop offset="100%" stop-color="#008c56"/></linearGradient>
    <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff3b57"/><stop offset="100%" stop-color="#b91c33"/></linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#171e2c" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#0e131d"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  
  <!-- Horizontal Price Levels -->
  <line x1="50" y1="70" x2="710" y2="70" stroke="#1d2432" stroke-dasharray="4"/>
  <line x1="50" y1="140" x2="710" y2="140" stroke="#1d2432" stroke-dasharray="4"/>
  <line x1="50" y1="210" x2="710" y2="210" stroke="#1d2432" stroke-dasharray="4"/>
  <line x1="50" y1="280" x2="710" y2="280" stroke="#1d2432" stroke-dasharray="4"/>
  
  <!-- Header Branding -->
  <text x="50" y="38" fill="#f7a600" font-size="12" font-family="monospace" font-weight="bold">THE MARKET SNIPER SHOOTERS // TECHNICAL BLUEPRINT</text>
  <text x="50" y="54" fill="#94a3b8" font-size="10" font-family="sans-serif">${title.toUpperCase()} &mdash; ${subtitle}</text>

  ${elements}
</svg>`;
}

module.exports = { makeSvg };
