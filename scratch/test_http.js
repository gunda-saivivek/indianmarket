const http = require('http');
http.get('http://localhost:7171', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Includes viewExecutive:', b.includes('id="viewExecutive"'));
    console.log('Includes viewBullDesk:', b.includes('id="viewBullDesk"'));
    console.log('Includes viewBearDesk:', b.includes('id="viewBearDesk"'));
    console.log('Includes executive-charts.js:', b.includes('executive-charts.js'));
  });
});
