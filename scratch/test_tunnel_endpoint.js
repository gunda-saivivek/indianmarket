const https = require('https');

https.get('https://witty-dolls-help.loca.lt/', {
  headers: {
    'bypass-tunnel-reminder': 'true'
  }
}, (res) => {
  console.log("Tunnel HTTP Status:", res.statusCode);
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log("Received HTML length:", html.length);
    console.log("Has Bull Diagram:", html.includes("BULL DIAGRAM"));
    console.log("Has Bear Diagram:", html.includes("BEAR DIAGRAM"));
    console.log("Has Learning Hub:", html.includes("LEARNING HUB"));
    console.log("Has Back to Main Workstations:", html.includes("Back to Main Workstations"));
    console.log("Script version v=6.0:", html.includes("v=6.0"));
  });
}).on('error', (err) => {
  console.error("Tunnel error:", err.message);
});
