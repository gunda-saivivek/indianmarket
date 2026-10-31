const { exec } = require('child_process');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const RENDER_DEPLOY_HOOK = process.env.RENDER_DEPLOY_HOOK || 'https://api.render.com/deploy/srv-dbinkdijnfac73b4gj5g?key=e81aui2q1Yw';

let isSyncing = false;
let pendingReason = null;
let syncDebounceTimer = null;

/**
 * Triggers the Render Deploy Hook asynchronously to initiate zero-downtime CI/CD deployment.
 */
function triggerRenderDeployHook() {
  return new Promise((resolve) => {
    try {
      if (!RENDER_DEPLOY_HOOK) return resolve({ skipped: true });
      const req = https.request(RENDER_DEPLOY_HOOK, { method: 'POST', timeout: 8000 }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          console.log(`[CI/CD] Render Deploy Hook triggered (Status ${res.statusCode})`);
          resolve({ success: res.statusCode >= 200 && res.statusCode < 300, statusCode: res.statusCode, body: data });
        });
      });
      req.on('error', (err) => {
        console.warn(`[CI/CD] Render Deploy Hook request warning:`, err.message);
        resolve({ error: err.message });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ timeout: true });
      });
      req.end();
    } catch (e) {
      resolve({ error: e.message });
    }
  });
}

/**
 * Performs git commit and push of user records to origin main,
 * triggering the GitHub Actions automated CI/CD pipeline and Render deployment.
 */
function runGitSync(reason) {
  if (isSyncing) {
    pendingReason = reason;
    return;
  }
  isSyncing = true;

  const commitMsg = `sync(database): auto-sync user changes [${reason || 'user update'}]`;
  const cmd = `git add users.json src/backend/data/users.json && git commit -m "${commitMsg.replace(/"/g, '\\"')}" && git push origin main`;

  console.log(`[AUTO-SYNC] Initiating background Git & CI/CD synchronization: "${reason}"...`);

  exec(cmd, { cwd: ROOT_DIR }, (err, stdout, stderr) => {
    isSyncing = false;
    if (err) {
      // If nothing to commit, stdout or stderr may state "nothing to commit"
      if ((stdout && stdout.includes('nothing to commit')) || (stderr && stderr.includes('nothing to commit'))) {
        console.log(`[AUTO-SYNC] No changes to commit in users.json.`);
      } else {
        console.warn(`[AUTO-SYNC] Git commit/push warning:`, err.message || stderr);
      }
    } else {
      console.log(`[AUTO-SYNC] ✅ Successfully committed and pushed user updates to GitHub main branch!`);
    }

    // Trigger Render Deploy Hook as well to ensure immediate update
    triggerRenderDeployHook().catch(() => {});

    // If another sync request came in while this was executing, process it now
    if (pendingReason) {
      const nextReason = pendingReason;
      pendingReason = null;
      setTimeout(() => runGitSync(nextReason), 2000);
    }
  });
}

/**
 * Public function to sync user changes to Git and CI/CD with safe debouncing.
 * Called whenever a user is added, approved, rejected, or deleted.
 */
function syncUsersToGitAndCiCd(reason = 'user records updated') {
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }
  syncDebounceTimer = setTimeout(() => {
    runGitSync(reason);
  }, 1000);
}

module.exports = {
  syncUsersToGitAndCiCd,
  triggerRenderDeployHook
};
