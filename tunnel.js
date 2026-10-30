const { tunnelmole } = require('tunnelmole');
const fs = require('fs');

const PORT = process.env.PORT || 7171;

async function startTunnel() {
  console.log(`[TUNNELMOLE] Starting persistent zero-password tunnel for Port ${PORT}...`);
  try {
    const url = await tunnelmole({ port: PORT });
    console.log('=============================================================');
    console.log('🌐 100% DIRECT ZERO-PASSWORD PUBLIC ACCESS LINK READY!');
    console.log('👉 URL: ' + url);
    console.log('⚡ Direct Instant Access: NO passwords, NO IP prompts, NO reminder pages!');
    console.log('=============================================================');
    fs.writeFileSync('public-url.txt', url);
  } catch (err) {
    console.error('Fatal tunnel error:', err);
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
