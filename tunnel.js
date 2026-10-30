const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  try {
    console.log("Connecting to public tunnel server...");
    const tunnel = await localtunnel({ port: 7171 });
    console.log("=============================================================");
    console.log("🌐 PUBLIC ACCESS LINK READY!");
    console.log("👉 URL: " + tunnel.url);
    console.log("=============================================================");
    fs.writeFileSync('public-url.txt', tunnel.url);

    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      console.log("Tunnel Password (Your Public IP if prompted): " + ipData.ip);
      fs.writeFileSync('tunnel-ip.txt', ipData.ip);
    } catch (e) {}

    tunnel.on('close', () => {
      console.log("Tunnel closed");
    });
  } catch (err) {
    console.error("Tunnel error:", err.message);
  }
})();
