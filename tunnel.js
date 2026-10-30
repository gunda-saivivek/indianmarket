const { spawn } = require('child_process');
const fs = require('fs');

const PORT = process.env.PORT || 7171;

function runTunnel() {
  console.log(`Starting Direct Zero-Password Tunnel for Port ${PORT} via localhost.run...`);

  const ssh = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    '-o', 'ExitOnForwardFailure=yes',
    '-R', `80:localhost:${PORT}`,
    'nokey@localhost.run'
  ]);

  let activeUrl = null;

  ssh.stdout.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-z0-9]+\.lhr\.life/i);
    if (match && !activeUrl) {
      activeUrl = match[0];
      fs.writeFileSync('public-url.txt', activeUrl);
      console.log('=============================================================');
      console.log('🌐 100% DIRECT ZERO-PASSWORD PUBLIC ACCESS LINK READY!');
      console.log('👉 URL: ' + activeUrl);
      console.log('⚡ Direct Instant Access: NO passwords, NO IP prompts, NO reminder pages!');
      console.log('=============================================================');
    }
  });

  ssh.stderr.on('data', (data) => {
    const text = data.toString();
    // Ignore routine SSH warnings
    if (!text.includes('Pseudo-terminal') && !text.includes('Permanently added')) {
      console.log('[TUNNEL LOG]:', text.trim());
    }
  });

  // Keep-alive ping
  const pingInterval = setInterval(async () => {
    if (activeUrl) {
      try {
        await fetch(activeUrl);
      } catch (e) {}
    }
  }, 25000);

  ssh.on('close', (code) => {
    clearInterval(pingInterval);
    console.log(`Tunnel closed (code ${code}). Reconnecting in 3 seconds...`);
    setTimeout(runTunnel, 3000);
  });

  ssh.on('error', (err) => {
    clearInterval(pingInterval);
    console.error('Tunnel error:', err.message, '. Reconnecting in 5 seconds...');
    setTimeout(runTunnel, 5000);
  });
}

runTunnel();
