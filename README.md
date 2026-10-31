# 🎯 The Market Sniper Shooters

> **Institutional-Grade Options Trading Workstation & Live Market Intelligence**  
> Benchmarks: **NIFTY 50**, **SENSEX**, and **BANK NIFTY** • Built for Dalal Street Traders

---

## 📁 Clean Enterprise Architecture

The codebase is organized into a clean full-stack order (`src/frontend`, `src/backend`, `tools/`, `scripts/`):

```text
indian-market/
├── .github/                     # GitHub Actions CI/CD workflows
│   └── workflows/
│       └── deploy.yml           # Automated Render deployment on every git push
├── src/
│   ├── backend/                 # Backend Node.js Server & APIs
│   │   ├── controllers/         # Business logic & Route handlers
│   │   ├── services/            # NSE Derivative & Yahoo market data fetchers
│   │   ├── data/                # Data storage
│   │   │   └── users.json       # Master user accounts store
│   │   └── server.js            # Main backend application server
│   └── frontend/                # Frontend Web Application (Single Page App)
│       ├── assets/              # Icons & visual assets
│       ├── style.css            # Custom CSS & Obsidian Dark / Crisp Light themes
│       ├── app.js               # Workstation UI, options chains, and indicators
│       ├── academy-data.js      # 22 Masterclass learning lessons (Spoon-fed)
│       ├── executive-charts.js  # Candlestick chart templates
│       └── index.html           # Main dashboard user interface
├── public/                      # Static distribution directory served by backend
├── scripts/                     # Automation, compilation & build scripts
│   ├── trigger-deploy.js        # Instant Render deploy hook trigger
│   ├── build_full_academy.js    # Compiles academy curriculum & SVG blueprints
│   └── generate_svgs.js         # 22 distinct SVG candlestick trade blueprints
├── tools/                       # CLI calculation & helper utilities
│   ├── calculate.js             # Option level & target calculator
│   ├── hero-zero.js             # Expiry day gamma analyzer
│   ├── live-levels.js           # Live support/resistance finder
│   └── tunnel.js                # Port forwarding utility
├── .gitignore                   # Ignore logs, temporary scratch scripts, node_modules
├── package.json                 # Project configuration & npm scripts
├── server.js                    # Root server entry point (delegates to src/backend/server.js)
├── start.bat                    # 1-click Windows desktop launcher
└── README.md                    # Project documentation & architecture
```

---

## 🌟 Workstation Features

1. **🎯 Automated Strategy Engine ("What to Buy Now"):**
   - Automatically detects Put-Call Ratio (PCR) and intraday range.
   - Computes the #1 recommended Call (CE) and Put (PE) strike with exact entry prices, trigger levels, and risk-to-reward ratios.

2. **⚖️ Equal CE & PE Pairs Matcher:**
   - Pairs strikes with balanced premiums (e.g. ₹50 CE with ₹50 PE).
   - Designed for big breakout moves: the winning leg multiplies 2x–4x while risk is strictly capped at entry cost.

3. **🚀 1:15 PM Expiry Day Hero-Zero Hotlist:**
   - Real-time screening of ₹10 to ₹35 explosive gamma strikes on expiry afternoons.

4. **🌙 / ☀️ Workstation Appearance (Theme Switcher):**
   - **Obsidian Dark:** High-contrast night trading theme with vibrant neon indicators.
   - **Crisp Light:** Clean, readable daytime workstation mode.
   - Accessible via **Settings** or the **`🌙 / ☀️` Quick Toggle** on the top navigation bar.

5. **🎓 Master Trading Academy (Spoon-Fed Learning):**
   - 22 structured lessons from Candlestick Anatomy to 1:3 Risk Management.
   - Written in simple, conversational English with everyday analogies (Zero confusing physics jargon!).
   - **22 Unique Visual Blueprints:** Every lesson includes a distinct, custom TradingView-style diagram.

6. **🛡️ Private Trading Network & Access Clearance:**
   - Strict Gmail verification (`@gmail.com`).
   - Admin clearance workflow: All registered traders require approval by Master Admin before market streaming activates.
   - Persistent PostgreSQL database (`DATABASE_URL`) with automatic JSON fallback.

---

## 🚀 Quick Start Locally

### Prerequisites
- Node.js (v18+)

### Running the App
```bash
# 1. Clone repository
git clone https://github.com/gunda-saivivek/indianmarket.git
cd indianmarket

# 2. Install dependencies
npm install

# 3. Start local workstation
npm start
```

Open **`http://localhost:7171`** in your browser.

---

## ☁️ Continuous Deployment (Render)

- **Production URL:** [https://market-sniper-atsx.onrender.com](https://market-sniper-atsx.onrender.com)
- **CI/CD:** Automated via `.github/workflows/deploy.yml` and Render Deploy Hook. Any push to `main` builds and deploys in ~60 seconds.

---

## 🔐 Master Administrator
- **Admin Email:** `gsv.200000@gmail.com`
- **Admin Password:** `Money@2027#`
- **Admin Desk:** Accessible from the top header (`👑 Admin Panel`) when logged in as administrator.
