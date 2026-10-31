const { parseJsonBody } = require('./authController');
const {
  getAllUsers,
  findUserByEmail,
  updateUserStatus,
  deleteUserByEmail,
  getAuthUser,
  activeSessions
} = require('../services/authService');

async function handleGetUsers(req, res, parsedUrl) {
  const user = getAuthUser(req, parsedUrl);
  if (!user || user.role !== 'admin') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Admin access required' }));
    return;
  }

  const users = await getAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, users }));
}

async function handleAdminAction(req, res, parsedUrl) {
  const user = getAuthUser(req, parsedUrl);
  if (!user || user.role !== 'admin') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Admin access required' }));
    return;
  }

  try {
    const { email, action } = await parseJsonBody(req);
    const cleanEmail = (email || '').toLowerCase().trim();
    const targetUser = await findUserByEmail(cleanEmail);

    if (!targetUser) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    if (action === 'delete') {
      if (targetUser.role === 'admin') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cannot delete the admin account' }));
        return;
      }
      await deleteUserByEmail(cleanEmail);
    } else if (action === 'approve') {
      await updateUserStatus(cleanEmail, 'approved');
    } else if (action === 'reject') {
      await updateUserStatus(cleanEmail, 'rejected');
    }

    for (const [t, s] of activeSessions.entries()) {
      if (s.email.toLowerCase() === cleanEmail) {
        if (action === 'delete' || action === 'reject') {
          activeSessions.delete(t);
        } else {
          s.status = action === 'approve' ? 'approved' : targetUser.status;
        }
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: action === 'reject' ? 'User access revoked successfully' : `User ${action}d successfully`
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleGetStats(req, res, parsedUrl) {
  const user = getAuthUser(req, parsedUrl);
  if (!user || user.role !== 'admin') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Admin access required' }));
    return;
  }

  const users = await getAllUsers();
  const total = users.length;
  const pending = users.filter(u => u.status === 'pending').length;
  const approved = users.filter(u => u.status === 'approved').length;
  const rejected = users.filter(u => u.status === 'rejected').length;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    stats: { totalUsers: total, pending, approved, rejected }
  }));
}

module.exports = {
  handleGetUsers,
  handleAdminAction,
  handleGetStats
};
