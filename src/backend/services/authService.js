const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const ROOT_USERS_FILE = path.join(ROOT_DIR, 'users.json');

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } else if (fs.existsSync(ROOT_USERS_FILE)) {
      return JSON.parse(fs.readFileSync(ROOT_USERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading users.json:', e);
  }

  const defaultAdmin = [{
    id: 'admin-1',
    name: 'Sai Vivek (Admin)',
    email: 'gsv.200000@gmail.com',
    passwordHash: hashPassword('Money@2027#'),
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString()
  }];
  saveUsers(defaultAdmin);
  return defaultAdmin;
}

function saveUsers(users) {
  try {
    fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(ROOT_USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {}
}

let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'user',
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `).then(async () => {
      const check = await pgPool.query('SELECT COUNT(*) FROM users');
      if (parseInt(check.rows[0].count, 10) === 0) {
        await pgPool.query(`
          INSERT INTO users (id, name, email, password_hash, role, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (email) DO NOTHING
        `, [
          'admin-1',
          'Sai Vivek (Admin)',
          'gsv.200000@gmail.com',
          hashPassword('Money@2027#'),
          'admin',
          'approved'
        ]);
        console.log('✅ PostgreSQL database connected and Master Admin seeded!');
      } else {
        console.log('✅ PostgreSQL database connected with active persistent storage!');
      }
    }).catch(err => {
      console.error('PostgreSQL init error:', err.message);
    });
  } catch (pgErr) {
    console.error('Could not load pg client:', pgErr.message);
  }
}

async function getAllUsers() {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT id, name, email, role, status, created_at as "createdAt" FROM users ORDER BY created_at DESC');
      return res.rows;
    } catch (e) {
      console.error('Error querying pgPool getAllUsers:', e.message);
    }
  }
  return loadUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt
  }));
}

async function findUserByEmail(email) {
  const clean = (email || '').toLowerCase().trim();
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT id, name, email, password_hash as "passwordHash", role, status, created_at as "createdAt" FROM users WHERE LOWER(email) = $1', [clean]);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.error('Error querying pgPool findUserByEmail:', e.message);
    }
  }
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === clean) || null;
}

async function createUser(newUser) {
  const clean = (newUser.email || '').toLowerCase().trim();
  if (pgPool) {
    try {
      await pgPool.query(`
        INSERT INTO users (id, name, email, password_hash, role, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        newUser.id,
        newUser.name,
        clean,
        newUser.passwordHash,
        newUser.role || 'user',
        newUser.status || 'pending',
        newUser.createdAt || new Date().toISOString()
      ]);
      return newUser;
    } catch (e) {
      console.error('Error creating user in pgPool:', e.message);
    }
  }
  const users = loadUsers();
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

async function updateUserStatus(email, status) {
  const clean = (email || '').toLowerCase().trim();
  if (pgPool) {
    try {
      await pgPool.query('UPDATE users SET status = $1 WHERE LOWER(email) = $2', [status, clean]);
    } catch (e) {
      console.error('Error updating status in pgPool:', e.message);
    }
  }
  const users = loadUsers();
  const u = users.find(x => x.email.toLowerCase() === clean);
  if (u) {
    u.status = status;
    saveUsers(users);
  }
}

async function deleteUserByEmail(email) {
  const clean = (email || '').toLowerCase().trim();
  if (pgPool) {
    try {
      await pgPool.query('DELETE FROM users WHERE LOWER(email) = $1', [clean]);
    } catch (e) {
      console.error('Error deleting user in pgPool:', e.message);
    }
  }
  let users = loadUsers();
  users = users.filter(u => u.email.toLowerCase() !== clean);
  saveUsers(users);
}

const activeSessions = new Map();

function getAuthUser(req, parsedUrl) {
  const authHeader = req.headers['authorization'];
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (parsedUrl && parsedUrl.query && parsedUrl.query.token) {
    token = parsedUrl.query.token;
  }
  if (!token) return null;
  return activeSessions.get(token) || null;
}

function isLegitGmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|googlemail\.com)$/i.test(clean);
}

module.exports = {
  hashPassword,
  loadUsers,
  saveUsers,
  getAllUsers,
  findUserByEmail,
  createUser,
  updateUserStatus,
  deleteUserByEmail,
  activeSessions,
  getAuthUser,
  isLegitGmail
};
