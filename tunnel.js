const { tunnelmole } = require('tunnelmole');
const fs = require('fs');

const PORT = process.env.PORT || 7171;

async function startTunnel() {
  while (true) {
    try {
      console.log(`[TUNNELMOLE] Initiating zero-password tunnel for Port ${PORT}...`);
      const url = await tunnelmole({ port: PORT });
      console.log('=============================================================');
      console.log('🌐 100% DIRECT ZERO-PASSWORD PUBLIC ACCESS LINK READY!');
      console.log('👉 URL: ' + url);
      console.log('⚡ Direct Instant Access: NO passwords, NO IP prompts, NO reminder pages!');
      console.log('=============================================================');
      fs.writeFileSync('public-url.txt', url);

      // Health-check keep-alive loop
      while (true) {
        await new Promise(r => setTimeout(r, 25000));
        try {
          const res = await fetch(url + '/api/live-data?index=nifty&expiryType=current');
          if (!res.ok && res.status !== 304) {
            console.log('[TUNNELMOLE] Keep-alive check returned status', res.status, '- Reconnecting...');
            break;
          }
        } catch (e) {
          console.log('[TUNNELMOLE] Keep-alive error:', e.message, '- Reconnecting...');
          break;
        }
      }
    } catch (err) {
      console.error('[TUNNELMOLE] Tunnel connection failed:', err.message);
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

startTunnel();
