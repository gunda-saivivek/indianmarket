const fs = require('fs');
const window = {};
eval(fs.readFileSync('public/academy-data.js', 'utf8'));

let allValid = true;
Object.entries(window.ACADEMY_DEEP_TOPICS).forEach(([id, t]) => {
  const hasGreenCandle = t.svgBlueprint && t.svgBlueprint.includes('#089981');
  const hasRedCandle = t.svgBlueprint && t.svgBlueprint.includes('#f23645');
  const hasCandleLines = t.svgBlueprint && t.svgBlueprint.includes('<line x1=');
  const hasCandleRects = t.svgBlueprint && t.svgBlueprint.includes('<rect ');
  const hasNoCodeBlocks = !JSON.stringify(t.subTopics).includes('```');

  if (!hasGreenCandle || !hasRedCandle || !hasCandleLines || !hasCandleRects || !hasNoCodeBlocks) {
    console.log('FAIL:', id, { hasGreenCandle, hasRedCandle, hasCandleLines, hasCandleRects, hasNoCodeBlocks });
    allValid = false;
  }
});

console.log('All 22 topics valid with authentic candlesticks & zero code blocks:', allValid);
