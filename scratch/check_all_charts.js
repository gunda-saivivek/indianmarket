const { ACADEMY_MODULES } = require('./build_master_academy_v4.js');
const { module1Topics } = require('./gen_module1.js');
const { module2Topics } = require('./gen_module2.js');
const { deepTopicsV4 } = require('./gen_deep_topics_v4.js');
const { module3Topics } = require('./gen_module3.js');
const { module6Topics } = require('./gen_module6.js');
const { module7Topics } = require('./gen_module7.js');
const { chartBlueprints } = require('./generate_tv_charts.js');

console.log("Checking all charts for chronological validity...");

// Let's inspect deepTopicsV4 and chartBlueprints
console.log("deepTopicsV4 keys:", Object.keys(deepTopicsV4));
console.log("chartBlueprints keys:", Object.keys(chartBlueprints));
