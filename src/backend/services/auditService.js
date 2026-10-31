const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const AUDIT_FILE = path.join(__dirname, '..', 'data', 'audit_logs.json');
const ROOT_AUDIT_FILE = path.join(ROOT_DIR, 'audit_logs.json');

// In-memory buffer of recent logs (capped at 500)
let inMemoryLogs = [];

function loadLogs() {
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      inMemoryLogs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
      return inMemoryLogs;
    } else if (fs.existsSync(ROOT_AUDIT_FILE)) {
      inMemoryLogs = JSON.parse(fs.readFileSync(ROOT_AUDIT_FILE, 'utf8'));
      return inMemoryLogs;
    }
  } catch (e) {
    console.error('Error reading audit_logs.json:', e.message);
  }
  return inMemoryLogs;
}

function saveLogs() {
  try {
    fs.mkdirSync(path.dirname(AUDIT_FILE), { recursive: true });
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(inMemoryLogs.slice(0, 500), null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(ROOT_AUDIT_FILE, JSON.stringify(inMemoryLogs.slice(0, 500), null, 2), 'utf8');
  } catch (e) {}
}

// Initial load
loadLogs();

// PostgreSQL Audit Table support if DATABASE_URL is present
let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    pgPool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        action VARCHAR(64) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(32),
        ip VARCHAR(128),
        user_agent TEXT,
        details TEXT,
        status VARCHAR(32) DEFAULT 'SUCCESS',
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `).then(() => {
      console.log('✅ Audit Log persistent database table initialized');
    }).catch(err => {
      console.error('Audit table init error:', err.message);
    });
  } catch (err) {
    console.error('Could not init PostgreSQL for audit logs:', err.message);
  }
}

function extractClientIp(req) {
  if (!req) return '127.0.0.1';
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
}

function extractUserAgent(req) {
  if (!req) return 'Unknown Client';
  return req.headers['user-agent'] || 'Unknown Client';
}

/**
 * Record an audit log entry (footprint)
 * @param {Object} entry
 * @param {string} entry.action - LOGIN, LOGOUT, SIGNUP, ACCESS_GRANTED, ACCESS_DENIED, ADMIN_APPROVE, ADMIN_REJECT, ADMIN_DELETE
 * @param {string} entry.email - User email
 * @param {string} [entry.name] - User name
 * @param {string} [entry.role] - User role
 * @param {Object} [entry.req] - Incoming HTTP request for IP/UA
 * @param {string} [entry.details] - Extra details
 * @param {string} [entry.status] - SUCCESS, FAILURE, BLOCKED
 */
async function logFootprint({ action, email, name, role, req, details, status = 'SUCCESS' }) {
  const ip = extractClientIp(req);
  const userAgent = extractUserAgent(req);
  const timestamp = new Date().toISOString();
  const id = 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  const logEntry = {
    id,
    action: action.toUpperCase(),
    email: email ? email.toLowerCase().trim() : 'anonymous',
    name: name || '',
    role: role || 'user',
    ip,
    userAgent,
    details: details || '',
    status: status.toUpperCase(),
    timestamp
  };

  // Prepend to in-memory list (latest first)
  inMemoryLogs.unshift(logEntry);
  if (inMemoryLogs.length > 500) {
    inMemoryLogs = inMemoryLogs.slice(0, 500);
  }
  saveLogs();

  // Persist to PostgreSQL if available
  if (pgPool) {
    try {
      await pgPool.query(`
        INSERT INTO audit_logs (id, action, email, name, role, ip, user_agent, details, status, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        id,
        logEntry.action,
        logEntry.email,
        logEntry.name,
        logEntry.role,
        logEntry.ip,
        logEntry.userAgent,
        logEntry.details,
        logEntry.status,
        timestamp
      ]);
    } catch (e) {
      console.error('Error inserting audit log to pgPool:', e.message);
    }
  }

  return logEntry;
}

async function getRecentFootprints(limit = 100) {
  if (pgPool) {
    try {
      const res = await pgPool.query(`
        SELECT id, action, email, name, role, ip, user_agent as "userAgent", details, status, timestamp
        FROM audit_logs
        ORDER BY timestamp DESC
        LIMIT $1
      `, [limit]);
      if (res.rows.length > 0) return res.rows;
    } catch (e) {
      console.error('Error querying pgPool audit_logs:', e.message);
    }
  }
  return inMemoryLogs.slice(0, limit);
}

async function clearFootprints() {
  inMemoryLogs = [];
  saveLogs();
  if (pgPool) {
    try {
      await pgPool.query('DELETE FROM audit_logs');
    } catch (e) {
      console.error('Error clearing audit_logs from pgPool:', e.message);
    }
  }
}

module.exports = {
  logFootprint,
  getRecentFootprints,
  clearFootprints,
  extractClientIp,
  extractUserAgent
};
