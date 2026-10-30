const http = require('http');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Guest Live Data Access ---');
  const guestRes = await request({
    hostname: 'localhost',
    port: 7171,
    path: '/api/live-data?index=nifty&expiryType=current',
    method: 'GET'
  });
  console.log('Guest live-data status:', guestRes.statusCode);
  if (guestRes.statusCode !== 200) {
    throw new Error('Guest live data failed: ' + guestRes.body);
  }
  const guestData = JSON.parse(guestRes.body);
  console.log('Guest live-data verified! Spot:', guestData.spot, 'Bull trades:', guestData.bullTrades?.length, 'Bear trades:', guestData.bearTrades?.length);

  console.log('\n--- 2. Testing Open Instant Signup ---');
  const testEmail = `newtrader_${Date.now()}@market.io`;
  const signupPayload = JSON.stringify({
    name: 'Pro Trader',
    email: testEmail,
    password: 'password123'
  });

  const signupRes = await request({
    hostname: 'localhost',
    port: 7171,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(signupPayload)
    }
  }, signupPayload);

  console.log('Signup status:', signupRes.statusCode);
  if (signupRes.statusCode !== 201) {
    throw new Error('Signup failed: ' + signupRes.body);
  }
  const signupData = JSON.parse(signupRes.body);
  console.log('Signup successful!');
  console.log('User status:', signupData.user.status);
  console.log('Token received:', signupData.token ? 'YES (length ' + signupData.token.length + ')' : 'NO');

  if (signupData.user.status !== 'approved') {
    throw new Error('User was not instantly approved!');
  }
  if (!signupData.token) {
    throw new Error('No token returned on signup!');
  }

  console.log('\n--- 3. Testing User Live Data with New Token ---');
  const userLiveRes = await request({
    hostname: 'localhost',
    port: 7171,
    path: '/api/live-data?index=nifty&expiryType=current',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${signupData.token}`
    }
  });
  console.log('User live-data status:', userLiveRes.statusCode);
  if (userLiveRes.statusCode !== 200) {
    throw new Error('User live data failed: ' + userLiveRes.body);
  }
  const userLiveData = JSON.parse(userLiveRes.body);
  console.log('User live-data spot:', userLiveData.spot, 'Bull trades:', userLiveData.bullTrades?.length);

  console.log('\n--- 4. Testing Static Files ---');
  const files = ['/executive-charts.js', '/academy-data.js', '/app.js', '/index.html'];
  for (const f of files) {
    const res = await request({
      hostname: 'localhost',
      port: 7171,
      path: f,
      method: 'GET'
    });
    console.log(`File ${f} status: ${res.statusCode} (length: ${res.body.length})`);
    if (res.statusCode !== 200) throw new Error(`File ${f} failed with status ${res.statusCode}`);
  }

  console.log('\n✅ ALL OPEN SIGNUP & DATA FLOW CHECKS PASSED 100%!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
