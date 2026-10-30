const fs = require('fs');
const path = require('path');

const { ACADEMY_MODULES } = require('./build_master_academy_v4.js');
const { module1Topics } = require('./gen_module1.js');
const { module2Topics } = require('./gen_module2.js');
const { deepTopicsV4 } = require('./gen_deep_topics_v4.js');
const { module3Topics } = require('./gen_module3.js');
const { module6Topics } = require('./gen_module6.js');
const { module7Topics } = require('./gen_module7.js');
const { chartBlueprints } = require('./generate_tv_charts.js');

// Merge all topic definitions
const allTopics = {
  ...module1Topics,
  ...module2Topics,
  ...deepTopicsV4,
  ...module3Topics,
  ...module6Topics,
  ...module7Topics
};

// Ensure every topic's SVG blueprint is upgraded to the animated TradingView candlestick chart!
for (const [id, t] of Object.entries(allTopics)) {
  if (deepTopicsV4[id] && deepTopicsV4[id].svgBlueprint) {
    t.svgBlueprint = deepTopicsV4[id].svgBlueprint;
  } else if (chartBlueprints[id]) {
    t.svgBlueprint = chartBlueprints[id];
  }
}

console.log('Total Modules:', ACADEMY_MODULES.length);
console.log('Total Deep Topics:', Object.keys(allTopics).length);

// Synchronize subtopics list in ACADEMY_MODULES
let missing = 0;
ACADEMY_MODULES.forEach(mod => {
  mod.topics.forEach(t => {
    if (!allTopics[t.id]) {
      console.error('MISSING DEEP TOPIC FOR:', t.id);
      missing++;
    } else {
      const deep = allTopics[t.id];
      t.subTopics = deep.tableOfContents.map(toc => ({ id: toc.id, title: toc.title }));
    }
  });
});

if (missing > 0) {
  console.error(`FAILED: ${missing} topics missing!`);
  process.exit(1);
}

// Generate the final client-side JavaScript file
const fileContent = `/**
 * THE MARKET SNIPER SHOOTERS - MASTER TRADING ACADEMY
 * Institutional Deep-Learning Curriculum, Sub-topics, Sub-sub-topics & Photorealistic TradingView Blueprints
 * 
 * Includes: Malaysian Trade Setup Method, DodgysDD Inversion FVG (iFVG), and Atlas AMT Liquidity Framework
 * Standards: Proprietary Trading Desks, Dalal Street & Wall Street Auction Market Theory
 * Generated: ${new Date().toISOString()}
 */

window.ACADEMY_MODULES = ${JSON.stringify(ACADEMY_MODULES, null, 2)};

window.ACADEMY_DEEP_TOPICS = ${JSON.stringify(allTopics, null, 2)};
`;

const outputPath = path.join(__dirname, '../public/academy-data.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`SUCCESS! Generated ${outputPath} (${(fileContent.length / 1024).toFixed(1)} KB)`);
