const localtunnel = require('localtunnel');
const fs = require('fs');

async function getPublicIP() {
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    return ipData.ip;
  } catch (e) {
    return '203.123.39.30';
  }
}

async function startTunnel() {
  const ip = await getPublicIP();
  console.log("Public IP / Tunnel Password:", ip);
  fs.writeFileSync('tunnel-ip.txt', ip);

  while (true) {
    try {
      console.log("Connecting to public tunnel server for Port 7171...");
      const tunnel = await localtunnel({ port: 7171 });
      console.log("=============================================================");
      console.log("🌐 PUBLIC ACCESS LINK READY!");
      console.log("👉 URL: " + tunnel.url);
      console.log("Tunnel Password (Your Public IP if prompted): " + ip);
      console.log("=============================================================");
      fs.writeFileSync('public-url.txt', tunnel.url);

      // Keep alive ping
      const pingInterval = setInterval(async () => {
        try {
          await fetch(tunnel.url, { headers: { 'bypass-tunnel-reminder': 'true' } });
        } catch (e) {}
      }, 25000);

      await new Promise((resolve) => {
        tunnel.on('close', () => {
          clearInterval(pingInterval);
          console.log("Tunnel closed. Reconnecting in 3 seconds...");
          resolve();
        });
        tunnel.on('error', (err) => {
          clearInterval(pingInterval);
          console.log("Tunnel error:", err.message, ". Reconnecting...");
          resolve();
        });
      });
    } catch (err) {
      console.error("Tunnel connection failed:", err.message, ". Retrying in 5 seconds...");
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

startTunnel();
