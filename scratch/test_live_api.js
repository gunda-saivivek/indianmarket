const http = require('http');

// First login as admin to get token
const loginData = JSON.stringify({
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
    'Content-Length': loginData.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log('Login success:', json.success);
    const token = json.token;

    // Now test /api/live-data
    http.get({
      hostname: 'localhost',
      port: 7171,
      path: '/api/live-data?index=nifty',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', c => body2 += c);
      res2.on('end', () => {
        const live = JSON.parse(body2);
        console.log('Live spot:', live.spot);
        console.log('bullTrades count:', live.bullTrades ? live.bullTrades.length : 0);
        console.log('bearTrades count:', live.bearTrades ? live.bearTrades.length : 0);
        if (live.bullTrades && live.bullTrades[0]) {
          console.log('Sample bullTrade:');
          console.log(' - Name:', live.bullTrades[0].name);
          console.log(' - Entry:', live.bullTrades[0].entryMin, '-', live.bullTrades[0].entryMax);
          console.log(' - SL:', live.bullTrades[0].sl);
          console.log(' - TP1:', live.bullTrades[0].tp1);
          console.log(' - Reason:', live.bullTrades[0].reason ? live.bullTrades[0].reason.substring(0, 60) + '...' : 'NONE');
          console.log(' - News Effect:', live.bullTrades[0].newsEffect ? live.bullTrades[0].newsEffect.substring(0, 60) + '...' : 'NONE');
        }
      });
    });
  });
});

req.write(loginData);
req.end();
