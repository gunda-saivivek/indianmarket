const http = require('http');

const loginPayload = JSON.stringify({
  email: 'gunda.saivivek@gmail.com',
  password: 'Money@2027#'
});

const req = http.request({
  hostname: 'localhost',
  port: 7171,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginPayload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log("Login Status:", res.statusCode, "Success:", data.success);
    const token = data.token;
    
    // Now fetch live data
    http.get({
      hostname: 'localhost',
      port: 7171,
      path: '/api/live-data?symbol=nifty',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        const live = JSON.parse(body2);
        console.log("Live Data Status:", res2.statusCode);
        console.log("Symbol:", live.symbol, "Spot:", live.spot);
        console.log("Bull Trades Count:", (live.bullTrades || []).length);
        console.log("Bear Trades Count:", (live.bearTrades || []).length);
        if (live.bullTrades && live.bullTrades.length > 0) {
          console.log("\n--- PRIMARY BULL TRADE ---");
          console.log("Name:", live.bullTrades[0].name);
          console.log("Entry Range:", live.bullTrades[0].entryMin, "-", live.bullTrades[0].entryMax);
          console.log("SL:", live.bullTrades[0].sl, `(-${live.bullTrades[0].slPts} pts)`);
          console.log("TP1:", live.bullTrades[0].tp1, `(+${live.bullTrades[0].tp1Pts} pts)`);
          console.log("TP2:", live.bullTrades[0].tp2, `(+${live.bullTrades[0].tp2Pts} pts)`);
          console.log("Reason:", live.bullTrades[0].reason);
          console.log("News Effect:", live.bullTrades[0].newsEffect);
        }
        if (live.bearTrades && live.bearTrades.length > 0) {
          console.log("\n--- PRIMARY BEAR TRADE ---");
          console.log("Name:", live.bearTrades[0].name);
          console.log("Entry Range:", live.bearTrades[0].entryMin, "-", live.bearTrades[0].entryMax);
          console.log("SL:", live.bearTrades[0].sl, `(-${live.bearTrades[0].slPts} pts)`);
          console.log("TP1:", live.bearTrades[0].tp1, `(+${live.bearTrades[0].tp1Pts} pts)`);
          console.log("TP2:", live.bearTrades[0].tp2, `(+${live.bearTrades[0].tp2Pts} pts)`);
          console.log("Reason:", live.bearTrades[0].reason);
          console.log("News Effect:", live.bearTrades[0].newsEffect);
        }
      });
    });
  });
});

req.write(loginPayload);
req.end();
