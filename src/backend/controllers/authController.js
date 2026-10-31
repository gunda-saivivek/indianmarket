const crypto = require('crypto');
const {
  hashPassword,
  findUserByEmail,
  createUser,
  activeSessions,
  createSessionToken,
  getAuthUser,
  isLegitGmail
} = require('../services/authService');
const { logFootprint } = require('../services/auditService');

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function handleLogin(req, res) {
  try {
    const { email, password } = await parseJsonBody(req);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      await logFootprint({ action: 'LOGIN', email: cleanEmail || 'empty', req, details: 'Missing email or password', status: 'FAILURE' });
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email and password are required' }));
      return;
    }

    const user = await findUserByEmail(cleanEmail);

    if (!user || user.passwordHash !== hashPassword(password)) {
      await logFootprint({ action: 'LOGIN', email: cleanEmail, req, details: 'Invalid email or password attempt', status: 'FAILURE' });
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid email or password' }));
      return;
    }

    if (user.status === 'rejected') {
      await logFootprint({ action: 'LOGIN', email: cleanEmail, name: user.name, role: user.role, req, details: 'Blocked: Revoked user tried to log in', status: 'BLOCKED' });
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Revoked: Your account access has been revoked by the Administrator.' }));
      return;
    }

    if (user.status === 'pending' && user.role !== 'admin') {
      await logFootprint({ action: 'LOGIN', email: cleanEmail, name: user.name, role: user.role, req, details: 'Login attempt while pending admin approval', status: 'PENDING' });
    } else {
      await logFootprint({ action: 'LOGIN', email: cleanEmail, name: user.name, role: user.role, req, details: 'User successfully signed in', status: 'SUCCESS' });
    }

    const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
    const token = createSessionToken(sessionUser);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, token, user: sessionUser }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleSignup(req, res) {
  try {
    const { name, email, password } = await parseJsonBody(req);
    if (!name || !email || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Name, Gmail address, and password are required' }));
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!isLegitGmail(cleanEmail)) {
      await logFootprint({ action: 'SIGNUP', email: cleanEmail, name, req, details: 'Invalid non-Gmail registration attempted', status: 'FAILURE' });
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Caution: Please enter a correct Gmail address (ending with @gmail.com)' }));
      return;
    }

    if (password.length < 6) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Password must be at least 6 characters long' }));
      return;
    }

    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
      await logFootprint({ action: 'SIGNUP', email: cleanEmail, name, req, details: 'Duplicate Gmail registration attempted', status: 'FAILURE' });
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'An account with this Gmail address already exists' }));
      return;
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      role: 'user',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await createUser(newUser);
    await logFootprint({ action: 'SIGNUP', email: cleanEmail, name: newUser.name, role: 'user', req, details: 'New user registered and queued for approval', status: 'SUCCESS' });

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Registration submitted successfully! Your account is awaiting approval by Administrator before access.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'pending'
      }
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleMe(req, res, parsedUrl) {
  const user = getAuthUser(req, parsedUrl);
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not authenticated' }));
    return;
  }

  const fresh = await findUserByEmail(user.email);
  if (fresh) {
    user.status = fresh.status;
    user.role = fresh.role;
    user.name = fresh.name;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, user }));
}

async function handleLogout(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = activeSessions.get(token);
    if (session) {
      await logFootprint({ action: 'LOGOUT', email: session.email, name: session.name, role: session.role, req, details: 'User signed out', status: 'SUCCESS' });
    }
    activeSessions.delete(token);
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true }));
}

module.exports = {
  parseJsonBody,
  handleLogin,
  handleSignup,
  handleMe,
  handleLogout
};
