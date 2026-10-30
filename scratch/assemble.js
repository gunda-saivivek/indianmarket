const fs = require('fs');
const path = require('path');

const { ACADEMY_MODULES } = require('./gen_modules.js');
const { module1Topics } = require('./gen_module1.js');
const { module2Topics } = require('./gen_module2.js');
const { module3Topics } = require('./gen_module3.js');
const { module4Topics } = require('./gen_module4.js');
const { module5Topics } = require('./gen_module5.js');
const { module6Topics } = require('./gen_module6.js');
const { module7Topics } = require('./gen_module7.js');
const { chartBlueprints } = require('./generate_tv_charts.js');

const allDeepTopics = {
  ...module1Topics,
  ...module2Topics,
  ...module3Topics,
  ...module4Topics,
  ...module5Topics,
  ...module6Topics,
  ...module7Topics
};

// Replace svgBlueprint with the photorealistic TradingView candlestick chart for all 20 topics!
let replacedCount = 0;
for (const [topicId, topicObj] of Object.entries(allDeepTopics)) {
  if (chartBlueprints[topicId]) {
    topicObj.svgBlueprint = chartBlueprints[topicId];
    replacedCount++;
  } else {
    console.warn('WARNING: Missing TV chart for:', topicId);
  }
}

console.log(`Replaced ${replacedCount} topic blueprints with photorealistic TradingView candlestick charts!`);

// Verify all topics in ACADEMY_MODULES have a matching deep topic
let missing = 0;
ACADEMY_MODULES.forEach(mod => {
  mod.topics.forEach(t => {
    if (!allDeepTopics[t.id]) {
      console.error('MISSING DEEP TOPIC FOR:', t.id);
      missing++;
    } else {
      // Ensure subTopics in module match deepTopic subTopics
      const deep = allDeepTopics[t.id];
      t.subTopics = deep.tableOfContents.map(toc => ({ id: toc.id, title: toc.title }));
    }
  });
});

if (missing > 0) {
  console.error(`FAILED: ${missing} topics missing deep content!`);
  process.exit(1);
}

// Generate the final client-side JavaScript file
const fileContent = `/**
 * THE MARKET SNIPER SHOOTERS - MASTER TRADING ACADEMY
 * Institutional Deep-Learning Curriculum, Sub-topics, Sub-sub-topics & Photorealistic TradingView Blueprints
 * 
 * Standards: Proprietary Trading Desks, Dalal Street & Wall Street Auction Market Theory
 * Generated: ${new Date().toISOString()}
 */

window.ACADEMY_MODULES = ${JSON.stringify(ACADEMY_MODULES, null, 2)};

window.ACADEMY_DEEP_TOPICS = ${JSON.stringify(allDeepTopics, null, 2)};
`;

const outputPath = path.join(__dirname, '../public/academy-data.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`SUCCESS! Generated ${outputPath} (${(fileContent.length / 1024).toFixed(1)} KB)`);
