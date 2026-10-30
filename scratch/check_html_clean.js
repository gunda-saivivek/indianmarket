const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
console.log('Contains liveStrategySection:', html.includes('id="liveStrategySection"'));
console.log('Contains viewExecutive:', html.includes('id="viewExecutive"'));
console.log('Contains viewBullDesk:', html.includes('id="viewBullDesk"'));
console.log('Contains viewBearDesk:', html.includes('id="viewBearDesk"'));
console.log('viewEqual hidden:', html.includes('id="viewEqual" class="space-y-4 hidden"'));
