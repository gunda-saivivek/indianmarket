const https = require('https');

const DEPLOY_HOOK = process.env.RENDER_DEPLOY_HOOK || 'https://api.render.com/deploy/srv-dbinkdijnfac73b4gj5g?key=e81aui2q1Yw';

console.log('🚀 Triggering Render Deployment...');
const req = https.request(DEPLOY_HOOK, { method: 'POST' }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Render deployment triggered successfully!');
      console.log('Deploy ID:', JSON.parse(body)?.deploy?.id || body);
    } else {
      console.error('❌ Failed to trigger deploy. Status:', res.statusCode, body);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Network error triggering deploy:', err.message);
});

req.end();
