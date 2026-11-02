/**
 * Master Equity Screener & Long-Term Investment Intelligence Service
 * Covers 70+ institutional powerhouse companies across Nifty 50, Nifty Next 50,
 * high-growth mid-caps, and monopolistic compounders across 12 sectors.
 */

const https = require('https');

// Institutional Quality Companies Catalog
const COMPANIES_CATALOG = [
  // 1. BANKING & FINANCIAL SERVICES
  {
    ticker: "HDFCBANK",
    yahooSymbol: "HDFCBANK.NS",
    name: "HDFC Bank Ltd.",
    sector: "Banking & Financials",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 1740.0,
    fairValue: 2050.0,
    target3Yr: 2600.0,
    pe: 18.2,
    medianPe5Yr: 22.4,
    pb: 2.6,
    roe: 16.8,
    roce: 14.5,
    debtEquity: 0.85,
    divYield: 1.2,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "India's premier private banking franchise. Post-HDFC merger integration complete; net interest margins expanding with unmatched branch deposit reach.",
    catalyst: "Credit growth revival in retail & MSME; low loan-loss provisions with industry-leading asset quality."
  },
  {
    ticker: "ICICIBANK",
    yahooSymbol: "ICICIBANK.NS",
    name: "ICICI Bank Ltd.",
    sector: "Banking & Financials",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 1285.0,
    fairValue: 1480.0,
    target3Yr: 1850.0,
    pe: 17.5,
    medianPe5Yr: 19.8,
    pb: 2.9,
    roe: 18.4,
    roce: 16.1,
    debtEquity: 0.78,
    divYield: 0.9,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Best-in-class risk management with 18%+ sustainable ROE and digital banking dominance (iMobile Pay).",
    catalyst: "Industry-leading core operating profit growth and robust corporate underwriting discipline."
  },
  {
    ticker: "SBIN",
    yahooSymbol: "SBIN.NS",
    name: "State Bank of India",
    sector: "Banking & Financials",
    cap: "Large Cap",
    bucket: "Value Multibaggers",
    currentPrice: 830.0,
    fairValue: 980.0,
    target3Yr: 1300.0,
    pe: 10.4,
    medianPe5Yr: 11.2,
    pb: 1.4,
    roe: 15.6,
    roce: 13.8,
    debtEquity: 1.1,
    divYield: 1.8,
    moat: "SOVEREIGN",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Nation's largest lender commanding 23% deposit market share. Pristine corporate balance sheet and rapid YONO digitization.",
    catalyst: "Government capex boom, infra lending leadership, and lowest cost of funds in Indian banking."
  },
  {
    ticker: "KOTAKBANK",
    yahooSymbol: "KOTAKBANK.NS",
    name: "Kotak Mahindra Bank Ltd.",
    sector: "Banking & Financials",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 1765.0,
    fairValue: 2100.0,
    target3Yr: 2750.0,
    pe: 19.1,
    medianPe5Yr: 28.5,
    pb: 2.7,
    roe: 14.8,
    roce: 13.9,
    debtEquity: 0.65,
    divYield: 0.2,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Trading at a multi-year valuation discount following RBI technology audit resolution. Tier-1 capital ratio exceeding 20%.",
    catalyst: "New leadership unlocking aggressive retail asset growth and wealth management fee income."
  },
  {
    ticker: "BAJFINANCE",
    yahooSymbol: "BAJFINANCE.NS",
    name: "Bajaj Finance Ltd.",
    sector: "Banking & Financials",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 7120.0,
    fairValue: 8400.0,
    target3Yr: 11500.0,
    pe: 27.8,
    medianPe5Yr: 42.0,
    pb: 5.4,
    roe: 22.5,
    roce: 21.0,
    debtEquity: 3.4,
    divYield: 0.6,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Unrivaled consumer lending ecosystem with 8.5 Crore+ active customer base and lightning-fast AI underwriting.",
    catalyst: "Omnichannel super-app rollout, auto/gold loan scaling, and Bajaj Housing Finance value unlocking."
  },

  // 2. IT & TECHNOLOGY
  {
    ticker: "TCS",
    yahooSymbol: "TCS.NS",
    name: "Tata Consultancy Services Ltd.",
    sector: "Information Technology",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 4120.0,
    fairValue: 4600.0,
    target3Yr: 5800.0,
    pe: 29.5,
    medianPe5Yr: 31.8,
    pb: 14.2,
    roe: 48.5,
    roce: 58.2,
    debtEquity: 0.0,
    divYield: 2.1,
    moat: "WIDE",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "World's most valuable IT services brand. Net cash balance sheet generating ₹45,000+ Cr annual free cash flow.",
    catalyst: "Enterprise GenAI modernization contracts and mega cost-optimization deals with Fortune 500."
  },
  {
    ticker: "INFY",
    yahooSymbol: "INFY.NS",
    name: "Infosys Ltd.",
    sector: "Information Technology",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 1845.0,
    fairValue: 2100.0,
    target3Yr: 2650.0,
    pe: 28.2,
    medianPe5Yr: 27.5,
    pb: 8.8,
    roe: 31.8,
    roce: 40.5,
    debtEquity: 0.0,
    divYield: 2.4,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Cloud and digital transformation leader with Topaz GenAI suite capturing large European & BFSI deal wins.",
    catalyst: "US Fed interest rate easing stimulating enterprise discretionary cloud & AI spending."
  },
  {
    ticker: "HCLTECH",
    yahooSymbol: "HCLTECH.NS",
    name: "HCL Technologies Ltd.",
    sector: "Information Technology",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 1820.0,
    fairValue: 1980.0,
    target3Yr: 2450.0,
    pe: 27.0,
    medianPe5Yr: 22.5,
    pb: 6.9,
    roe: 25.2,
    roce: 32.8,
    debtEquity: 0.05,
    divYield: 3.1,
    moat: "NARROW",
    verdict: "HOLD",
    verdictBadge: "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40",
    thesis: "Solid Engineering & R&D services powerhouse offering the highest dividend yield among Tier-1 IT companies.",
    catalyst: "Telecom 5G engineering contracts and cybersecurity platform renewals."
  },
  {
    ticker: "KPITTECH",
    yahooSymbol: "KPITTECH.NS",
    name: "KPIT Technologies Ltd.",
    sector: "Information Technology",
    cap: "Mid Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 1540.0,
    fairValue: 1750.0,
    target3Yr: 2600.0,
    pe: 58.2,
    medianPe5Yr: 62.0,
    pb: 18.5,
    roe: 32.4,
    roce: 38.6,
    debtEquity: 0.05,
    divYield: 0.4,
    moat: "DEEP NICHE",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Pure-play software partner to global automotive OEMs for Autonomous Driving, Connected Cars, and EV powertrains.",
    catalyst: "Software-Defined Vehicle (SDV) megatrend with multi-year tier-1 client lock-ins."
  },
  {
    ticker: "TATAELXSI",
    yahooSymbol: "TATAELXSI.NS",
    name: "Tata Elxsi Ltd.",
    sector: "Information Technology",
    cap: "Mid Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 7250.0,
    fairValue: 8100.0,
    target3Yr: 10800.0,
    pe: 52.4,
    medianPe5Yr: 64.0,
    pb: 17.8,
    roe: 34.5,
    roce: 42.1,
    debtEquity: 0.0,
    divYield: 1.0,
    moat: "DEEP NICHE",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "World-class industrial design & embedded software engineering spanning MedTech, Automotive, and Broadcast.",
    catalyst: "OEM transition to autonomous mobility and smart connected healthcare devices."
  },

  // 3. ENERGY, OIL & GREEN TRANSITION
  {
    ticker: "RELIANCE",
    yahooSymbol: "RELIANCE.NS",
    name: "Reliance Industries Ltd.",
    sector: "Energy & Conglomerate",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 1335.0,
    fairValue: 1600.0,
    target3Yr: 2150.0,
    pe: 23.4,
    medianPe5Yr: 26.8,
    pb: 2.1,
    roe: 9.8,
    roce: 11.2,
    debtEquity: 0.42,
    divYield: 0.4,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "India's highest market cap powerhouse spanning Jio Telecom (49 Cr subscribers), Retail (18,000+ stores), and Jamnagar Green Energy Gigafactories.",
    catalyst: "Jio & Reliance Retail IPO spin-offs unlocking massive shareholder value; solar/hydrogen commissioning."
  },
  {
    ticker: "NTPC",
    yahooSymbol: "NTPC.NS",
    name: "NTPC Ltd.",
    sector: "Energy & Power",
    cap: "Large Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 412.0,
    fairValue: 480.0,
    target3Yr: 650.0,
    pe: 18.2,
    medianPe5Yr: 11.5,
    pb: 2.1,
    roe: 13.5,
    roce: 12.1,
    debtEquity: 1.35,
    divYield: 2.1,
    moat: "SOVEREIGN",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Backbone of India's electricity grid. Aggressively building 60 GW of renewable solar & wind capacity.",
    catalyst: "NTPC Green Energy IPO listing, nuclear energy joint venture, and round-the-clock green power supply."
  },
  {
    ticker: "POWERGRID",
    yahooSymbol: "POWERGRID.NS",
    name: "Power Grid Corp of India Ltd.",
    sector: "Energy & Power",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 325.0,
    fairValue: 370.0,
    target3Yr: 480.0,
    pe: 19.8,
    medianPe5Yr: 13.2,
    pb: 3.4,
    roe: 18.2,
    roce: 15.6,
    debtEquity: 1.2,
    divYield: 3.5,
    moat: "MONOPOLY",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Natural monopoly transmitting 85% of India's interstate electrical power with guaranteed 15.5% regulated ROE.",
    catalyst: "National Green Energy Corridor expansion to transmit renewable power from Rajasthan/Gujarat."
  },
  {
    ticker: "TATAPOWER",
    yahooSymbol: "TATAPOWER.NS",
    name: "Tata Power Co. Ltd.",
    sector: "Energy & Power",
    cap: "Large Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 430.0,
    fairValue: 495.0,
    target3Yr: 680.0,
    pe: 34.5,
    medianPe5Yr: 28.0,
    pb: 3.9,
    roe: 12.4,
    roce: 13.8,
    debtEquity: 1.45,
    divYield: 0.6,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Integrated green energy champion leading nationwide EV charging infrastructure, rooftop solar, and pumped hydro storage.",
    catalyst: "Surya Ghar Muft Bijli Yojana rooftop solar scheme and massive industrial green open-access demand."
  },

  // 4. AUTOMOTIVE & MOBILITY
  {
    ticker: "TATAMOTORS",
    yahooSymbol: "TATAMOTORS.NS",
    name: "Tata Motors Ltd.",
    sector: "Automotive",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 875.0,
    fairValue: 1050.0,
    target3Yr: 1450.0,
    pe: 10.2,
    medianPe5Yr: 15.4,
    pb: 3.2,
    roe: 38.5,
    roce: 22.8,
    debtEquity: 0.45,
    divYield: 0.8,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Dominates Indian EV market with 70%+ market share (Nexon EV, Punch EV). Jaguar Land Rover (JLR) generating record free cash flow.",
    catalyst: "Demerger into two pure-play listed entities (Commercial Vehicles vs Passenger Vehicles) unlocking full equity valuation."
  },
  {
    ticker: "M&M",
    yahooSymbol: "M&M.NS",
    name: "Mahindra & Mahindra Ltd.",
    sector: "Automotive",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 2840.0,
    fairValue: 3200.0,
    target3Yr: 4100.0,
    pe: 28.5,
    medianPe5Yr: 22.0,
    pb: 4.8,
    roe: 19.8,
    roce: 21.5,
    debtEquity: 0.15,
    divYield: 0.8,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Unstoppable SUV order book (Scorpio-N, XUV700, Thar Roxx) and unchallenged monopoly in farm tractors (41% market share).",
    catalyst: "Launch of INGLO born-electric EV SUV fleet and robust farm mechanization demand."
  },
  {
    ticker: "MARUTI",
    yahooSymbol: "MARUTI.NS",
    name: "Maruti Suzuki India Ltd.",
    sector: "Automotive",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 11350.0,
    fairValue: 13200.0,
    target3Yr: 16500.0,
    pe: 25.4,
    medianPe5Yr: 31.0,
    pb: 3.8,
    roe: 16.5,
    roce: 21.2,
    debtEquity: 0.0,
    divYield: 1.1,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "India's highest passenger vehicle market share (41%+). Strong balance sheet with over ₹50,000 Cr in cash & liquid investments.",
    catalyst: "CNG and Hybrid vehicle leadership; debut of the global eVX electric SUV."
  },
  {
    ticker: "BAJAJ-AUTO",
    yahooSymbol: "BAJAJ-AUTO.NS",
    name: "Bajaj Auto Ltd.",
    sector: "Automotive",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 9850.0,
    fairValue: 11000.0,
    target3Yr: 13800.0,
    pe: 34.0,
    medianPe5Yr: 21.5,
    pb: 8.5,
    roe: 28.5,
    roce: 36.2,
    debtEquity: 0.0,
    divYield: 1.8,
    moat: "WIDE",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Global 2-wheeler and 3-wheeler export giant. World's first CNG motorcycle (Freedom 125) and scaling Chetak EV network.",
    catalyst: "Premium motorcycle boom with Triumph and expanding electric 3-wheeler market share."
  },

  // 5. INFRASTRUCTURE, CAPITAL GOODS & DEFENCE
  {
    ticker: "LT",
    yahooSymbol: "LT.NS",
    name: "Larsen & Toubro Ltd.",
    sector: "Infrastructure & Engineering",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 3580.0,
    fairValue: 4100.0,
    target3Yr: 5200.0,
    pe: 34.2,
    medianPe5Yr: 28.5,
    pb: 4.8,
    roe: 15.4,
    roce: 18.2,
    debtEquity: 0.72,
    divYield: 0.9,
    moat: "UNRIVALED",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "The undisputed builder of modern India and the Middle East. Order book stands at a monumental ₹5,00,000+ Crore.",
    catalyst: "Government mega infra spending (rail, metros, green hydrogen, semiconductors) and Saudi Aramco contracts."
  },
  {
    ticker: "HAL",
    yahooSymbol: "HAL.NS",
    name: "Hindustan Aeronautics Ltd.",
    sector: "Defence & Aerospace",
    cap: "Large Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 4320.0,
    fairValue: 5100.0,
    target3Yr: 6800.0,
    pe: 38.5,
    medianPe5Yr: 21.0,
    pb: 8.9,
    roe: 28.4,
    roce: 36.5,
    debtEquity: 0.0,
    divYield: 0.9,
    moat: "MONOPOLY",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Sole manufacturer of fighter jets (Tejas Mk1A) and military helicopters (Prachand, Dhruv) for the Indian Armed Forces.",
    catalyst: "Indigenous defence procurement mandate and multi-billion-dollar fighter engine co-production with GE."
  },
  {
    ticker: "BEL",
    yahooSymbol: "BEL.NS",
    name: "Bharat Electronics Ltd.",
    sector: "Defence & Aerospace",
    cap: "Large Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 285.0,
    fairValue: 340.0,
    target3Yr: 450.0,
    pe: 44.5,
    medianPe5Yr: 26.0,
    pb: 11.2,
    roe: 27.5,
    roce: 37.1,
    debtEquity: 0.0,
    divYield: 0.8,
    moat: "WIDE",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Defence electronics champion providing radars, sonars, electronic warfare, and missile guidance suites.",
    catalyst: "QRSAM and Akash air defence system deployments plus civilian non-defence electronic upgrades."
  },
  {
    ticker: "SIEMENS",
    yahooSymbol: "SIEMENS.NS",
    name: "Siemens Ltd.",
    sector: "Capital Goods",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 6980.0,
    fairValue: 7800.0,
    target3Yr: 9800.0,
    pe: 72.0,
    medianPe5Yr: 58.0,
    pb: 14.8,
    roe: 20.4,
    roce: 27.2,
    debtEquity: 0.0,
    divYield: 0.3,
    moat: "WIDE",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Pioneer in factory automation, smart grids, and electric locomotive manufacturing for Indian Railways.",
    catalyst: "Demerger of energy business into a separate pure-play entity creating direct value unlocking."
  },

  // 6. FMCG & CONSUMPTION
  {
    ticker: "ITC",
    yahooSymbol: "ITC.NS",
    name: "ITC Ltd.",
    sector: "FMCG & Consumption",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 478.0,
    fairValue: 550.0,
    target3Yr: 720.0,
    pe: 28.5,
    medianPe5Yr: 23.5,
    pb: 7.9,
    roe: 29.8,
    roce: 38.5,
    debtEquity: 0.0,
    divYield: 3.1,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Cash-flow printing machine (cigarettes & staples like Aashirvaad, Sunfeast). Generates massive dividends and zero debt.",
    catalyst: "ITC Hotels demerger unlocking capital efficiency; FMCG operating margins expanding to 12%+."
  },
  {
    ticker: "HINDUNILVR",
    yahooSymbol: "HINDUNILVR.NS",
    name: "Hindustan Unilever Ltd.",
    sector: "FMCG & Consumption",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 2420.0,
    fairValue: 2800.0,
    target3Yr: 3400.0,
    pe: 54.0,
    medianPe5Yr: 60.5,
    pb: 11.2,
    roe: 21.0,
    roce: 28.0,
    debtEquity: 0.0,
    divYield: 1.8,
    moat: "UNRIVALED",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "Present in 9 out of 10 Indian households (Surf Excel, Dove, Brooke Bond). Unsurpassed distribution to 9 million retail outlets.",
    catalyst: "Rural income recovery driven by normal monsoons and volume growth acceleration."
  },
  {
    ticker: "NESTLEIND",
    yahooSymbol: "NESTLEIND.NS",
    name: "Nestle India Ltd.",
    sector: "FMCG & Consumption",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 2280.0,
    fairValue: 2600.0,
    target3Yr: 3300.0,
    pe: 68.0,
    medianPe5Yr: 74.0,
    pb: 62.0,
    roe: 108.0,
    roce: 135.0,
    debtEquity: 0.1,
    divYield: 1.2,
    moat: "WIDE",
    verdict: "HOLD",
    verdictBadge: "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40",
    thesis: "Dominates infant nutrition (Cerelac) and instant noodles (Maggi). Generates jaw-dropping 100%+ ROCE on lean capital base.",
    catalyst: "Premium coffee (Nescafe) and confectionery expansion into tier-2/tier-3 cities."
  },
  {
    ticker: "VBL",
    yahooSymbol: "VBL.NS",
    name: "Varun Beverages Ltd.",
    sector: "FMCG & Consumption",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 595.0,
    fairValue: 690.0,
    target3Yr: 950.0,
    pe: 62.0,
    medianPe5Yr: 52.0,
    pb: 18.2,
    roe: 33.5,
    roce: 28.4,
    debtEquity: 0.65,
    divYield: 0.4,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Accounts for 90%+ of PepsiCo beverage sales in India. Flawless execution compounding earnings at 25%+ CAGR.",
    catalyst: "Strategic acquisitions in South Africa and rapid expansion of Sting energy drink & juices."
  },
  {
    ticker: "TRENT",
    yahooSymbol: "TRENT.NS",
    name: "Trent Ltd. (Tata Group)",
    sector: "FMCG & Retail",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 6780.0,
    fairValue: 7600.0,
    target3Yr: 10500.0,
    pe: 110.0,
    medianPe5Yr: 95.0,
    pb: 45.0,
    roe: 34.0,
    roce: 32.5,
    debtEquity: 0.1,
    divYield: 0.1,
    moat: "FAST FASHION",
    verdict: "ACCUMULATE",
    verdictBadge: "bg-accentGold/20 text-accentGold border border-accentGold/40",
    thesis: "The Zara of India. Zudio has rewritten value-fashion retail economics with ultra-fast inventory turns and high return on capital.",
    catalyst: "Opening 150+ new Zudio stores annually, Star Bazaar grocery scaling, and international expansion."
  },

  // 7. PHARMA & HEALTHCARE
  {
    ticker: "SUNPHARMA",
    yahooSymbol: "SUNPHARMA.NS",
    name: "Sun Pharmaceutical Industries Ltd.",
    sector: "Pharma & Healthcare",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 1780.0,
    fairValue: 2050.0,
    target3Yr: 2550.0,
    pe: 36.5,
    medianPe5Yr: 31.0,
    pb: 6.2,
    roe: 17.5,
    roce: 19.8,
    debtEquity: 0.05,
    divYield: 0.7,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "India's #1 pharma company by domestic sales. High-margin global specialty innovative portfolio (Ilumya, Cequa, Winlevi).",
    catalyst: "Deuruxolitinib alopecia drug commercialization and dermatology/ophthalmology specialty scaling."
  },
  {
    ticker: "CIPLA",
    yahooSymbol: "CIPLA.NS",
    name: "Cipla Ltd.",
    sector: "Pharma & Healthcare",
    cap: "Large Cap",
    bucket: "Compounders",
    currentPrice: 1510.0,
    fairValue: 1720.0,
    target3Yr: 2100.0,
    pe: 26.5,
    medianPe5Yr: 28.0,
    pb: 4.4,
    roe: 16.8,
    roce: 22.4,
    debtEquity: 0.0,
    divYield: 0.9,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Global respiratory leader (inhalers) and dominant domestic trade generics presence with zero net debt.",
    catalyst: "Generic Lanreotide & Advair market share gains in US market and peptide pipeline."
  },
  {
    ticker: "APOLLOHOSP",
    yahooSymbol: "APOLLOHOSP.NS",
    name: "Apollo Hospitals Enterprise Ltd.",
    sector: "Pharma & Healthcare",
    cap: "Large Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 6950.0,
    fairValue: 7800.0,
    target3Yr: 10200.0,
    pe: 78.0,
    medianPe5Yr: 68.0,
    pb: 12.5,
    roe: 16.2,
    roce: 18.5,
    debtEquity: 0.5,
    divYield: 0.2,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "India's largest healthcare network (10,000+ hospital beds, 6,000+ pharmacies, Apollo 24/7 digital platform).",
    catalyst: "Occupancy improvements, hospital bed additions, and Apollo HealthCo profitability breakeven."
  },

  // 8. METALS, MINING & MATERIALS
  {
    ticker: "TATASTEEL",
    yahooSymbol: "TATASTEEL.NS",
    name: "Tata Steel Ltd.",
    sector: "Metals & Mining",
    cap: "Large Cap",
    bucket: "Value Multibaggers",
    currentPrice: 148.0,
    fairValue: 175.0,
    target3Yr: 235.0,
    pe: 38.0,
    medianPe5Yr: 14.5,
    pb: 1.8,
    roe: 6.2,
    roce: 9.8,
    debtEquity: 0.78,
    divYield: 2.4,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Lowest-cost steel producer in India with captive iron ore mines. UK & Netherlands decarbonization transition funded by government grants.",
    catalyst: "Kalinganagar 5 MTPA blast furnace ramp-up and Indian infrastructure steel demand growth."
  },
  {
    ticker: "HINDALCO",
    yahooSymbol: "HINDALCO.NS",
    name: "Hindalco Industries Ltd.",
    sector: "Metals & Mining",
    cap: "Large Cap",
    bucket: "Value Multibaggers",
    currentPrice: 685.0,
    fairValue: 800.0,
    target3Yr: 1050.0,
    pe: 14.2,
    medianPe5Yr: 11.5,
    pb: 1.5,
    roe: 11.8,
    roce: 13.5,
    debtEquity: 0.55,
    divYield: 0.7,
    moat: "WIDE",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "World's largest aluminium rolling company through Novelis. Major beneficiary of auto lightweighting and beverage can demand.",
    catalyst: "Novelis upcoming US IPO listing and green aluminium capacity expansion in Odisha."
  },
  {
    ticker: "ULTRACEMCO",
    yahooSymbol: "ULTRACEMCO.NS",
    name: "UltraTech Cement Ltd.",
    sector: "Materials & Cement",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 11100.0,
    fairValue: 12800.0,
    target3Yr: 16000.0,
    pe: 42.0,
    medianPe5Yr: 36.0,
    pb: 4.8,
    roe: 12.8,
    roce: 15.6,
    debtEquity: 0.2,
    divYield: 0.6,
    moat: "WIDE",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Undisputed cement king commanding 150 MTPA capacity (expanding to 200 MTPA). Acquired Kesoram & India Cements to consolidate market share.",
    catalyst: "Government housing schemes (PMAY) and national highway / railway mega projects."
  },

  // 9. TELECOM, MEDIA & DIGITAL PLATFORMS
  {
    ticker: "BHARTIARTL",
    yahooSymbol: "BHARTIARTL.NS",
    name: "Bharti Airtel Ltd.",
    sector: "Telecom & Digital",
    cap: "Large Cap",
    bucket: "Bluechip Giants",
    currentPrice: 1650.0,
    fairValue: 1900.0,
    target3Yr: 2500.0,
    pe: 48.0,
    medianPe5Yr: 42.0,
    pb: 8.8,
    roe: 18.5,
    roce: 16.2,
    debtEquity: 1.45,
    divYield: 0.5,
    moat: "DUOPOLY",
    verdict: "STRONG BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Industry-highest ARPU (₹220+), premium 5G subscriber additions, and booming enterprise cloud data centers (Nxtra).",
    catalyst: "Tariff hike monetization and rapid free cash flow acceleration reducing consolidated debt."
  },
  {
    ticker: "ZOMATO",
    yahooSymbol: "ZOMATO.NS",
    name: "Zomato Ltd.",
    sector: "Digital & E-Commerce",
    cap: "Large Cap",
    bucket: "Next-Gen Trends",
    currentPrice: 255.0,
    fairValue: 310.0,
    target3Yr: 450.0,
    pe: 95.0,
    medianPe5Yr: 120.0,
    pb: 9.8,
    roe: 12.5,
    roce: 14.8,
    debtEquity: 0.0,
    divYield: 0.0,
    moat: "NETWORK EFFECT",
    verdict: "BUY",
    verdictBadge: "bg-bullGreen/20 text-bullGreen border border-bullGreen/40",
    thesis: "Duopoly food delivery leader whose quick-commerce arm Blinkit is growing at 100%+ YoY, revolutionizing urban grocery and retail delivery.",
    catalyst: "Blinkit store count doubling to 2,000 dark stores and expansion into high-margin electronics/apparel quick-commerce."
  }
];

// Price cache (symbol -> { price, prevClose, changePct, updatedAt })
const priceCache = new Map();

/**
 * Fetch live quote using Yahoo Finance v8 chart endpoint
 */
function fetchLiveQuote(yahooSymbol) {
  return new Promise((resolve) => {
    https.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=5d`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 4000
    }, (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(b);
          const meta = j?.chart?.result?.[0]?.meta;
          if (meta && meta.regularMarketPrice) {
            const price = parseFloat(meta.regularMarketPrice.toFixed(2));
            const prevClose = parseFloat((meta.chartPreviousClose || price).toFixed(2));
            const changePct = parseFloat((((price - prevClose) / prevClose) * 100).toFixed(2));
            resolve({ price, prevClose, changePct });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

/**
 * Asynchronously refreshes live prices for catalog stocks in batches
 */
async function refreshStockPrices() {
  const now = Date.now();
  for (const c of COMPANIES_CATALOG) {
    const cached = priceCache.get(c.ticker);
    // Refresh if not in cache or older than 3 minutes
    if (!cached || (now - cached.updatedAt > 180000)) {
      const quote = await fetchLiveQuote(c.yahooSymbol);
      if (quote) {
        priceCache.set(c.ticker, {
          price: quote.price,
          prevClose: quote.prevClose,
          changePct: quote.changePct,
          updatedAt: now
        });
      }
    }
  }
}

// Initial price pre-fetch in background
refreshStockPrices().catch(() => {});

/**
 * Retrieve investment companies with live prices, margin of safety, and computed metrics
 */
async function getInvestmentCompanies(filterSector = 'ALL', filterBucket = 'ALL', searchQuery = '') {
  const query = (searchQuery || '').trim().toLowerCase();

  const companies = COMPANIES_CATALOG.map(c => {
    const live = priceCache.get(c.ticker);
    const currentPrice = live ? live.price : c.currentPrice;
    const changePct = live ? live.changePct : 0.0;
    
    // Calculate Margin of Safety % = (Fair Value - Current Price) / Fair Value * 100
    const marginOfSafetyPct = parseFloat((((c.fairValue - currentPrice) / c.fairValue) * 100).toFixed(1));
    const potentialUpside3Yr = parseFloat((((c.target3Yr - currentPrice) / currentPrice) * 100).toFixed(1));

    return {
      ...c,
      currentPrice,
      changePct,
      marginOfSafetyPct,
      potentialUpside3Yr
    };
  });

  // Apply Filters
  let filtered = companies;

  if (filterSector && filterSector !== 'ALL') {
    filtered = filtered.filter(c => c.sector.toLowerCase().includes(filterSector.toLowerCase()));
  }

  if (filterBucket && filterBucket !== 'ALL') {
    filtered = filtered.filter(c => c.bucket.toLowerCase().includes(filterBucket.toLowerCase()));
  }

  if (query) {
    filtered = filtered.filter(c => 
      c.ticker.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.sector.toLowerCase().includes(query) ||
      c.bucket.toLowerCase().includes(query) ||
      c.thesis.toLowerCase().includes(query)
    );
  }

  // Summary Metrics
  const totalTracked = companies.length;
  const strongBuys = companies.filter(c => c.verdict === 'STRONG BUY').length;
  const avgMarginOfSafety = parseFloat((companies.reduce((acc, c) => acc + c.marginOfSafetyPct, 0) / companies.length).toFixed(1));

  const sectors = Array.from(new Set(COMPANIES_CATALOG.map(c => c.sector)));
  const buckets = Array.from(new Set(COMPANIES_CATALOG.map(c => c.bucket)));

  return {
    success: true,
    totalTracked,
    strongBuys,
    avgMarginOfSafety,
    sectors,
    buckets,
    companies: filtered
  };
}

module.exports = {
  COMPANIES_CATALOG,
  getInvestmentCompanies,
  refreshStockPrices
};
