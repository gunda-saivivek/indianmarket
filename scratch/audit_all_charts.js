const { makeAnimatedTradingViewChart } = require('./tv_animated_engine.js');
const { chartBlueprints } = require('./generate_tv_charts.js');
const { deepTopicsV4 } = require('./gen_deep_topics_v4.js');

console.log("Auditing all charts in deepTopicsV4 and chartBlueprints...");

// Let's inspect the parameters of each chart
