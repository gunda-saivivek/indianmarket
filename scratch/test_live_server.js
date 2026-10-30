const http = require('http');

http.get('http://localhost:7171/api/live-data?symbol=nifty', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log("Status:", res.statusCode);
      console.log("Symbol:", data.symbol, "Spot:", data.spot);
      console.log("Bull trades count:", (data.bullTrades || []).length);
      console.log("Bear trades count:", (data.bearTrades || []).length);
      if (data.bullTrades && data.bullTrades.length > 0) {
        console.log("Sample Bull Trade:", data.bullTrades[0].name, "LTP:", data.bullTrades[0].ltp, "SL:", data.bullTrades[0].sl, "TP1:", data.bullTrades[0].tp1);
        console.log("Sample Reason:", data.bullTrades[0].reason);
        console.log("Sample News:", data.bullTrades[0].newsEffect);
      }
    } catch (e) {
      console.error("Parse error:", e);
    }
  });
}).on('error', (err) => {
  console.error("HTTP error:", err.message);
});
