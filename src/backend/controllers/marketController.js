const { getAuthUser, findUserByEmail } = require('../services/authService');

async function handleLiveData(req, res, parsedUrl, handleNseData, handleSensexData) {
  const user = getAuthUser(req, parsedUrl);
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Please log in to view live market signals.' }));
    return;
  }

  const fresh = await findUserByEmail(user.email);
  if (!fresh || (fresh.status !== 'approved' && fresh.role !== 'admin')) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Access Pending: Your account is awaiting Administrator approval by Sai Vivek.',
      status: fresh?.status || 'pending'
    }));
    return;
  }

  const index = (parsedUrl.query.index || 'nifty').toLowerCase();
  const expiryType = (parsedUrl.query.expiryType || 'current').toLowerCase();

  try {
    let data = null;
    if (index === 'sensex') {
      data = await handleSensexData(expiryType);
    } else {
      data = await handleNseData(index, expiryType);
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error('API error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleLiveNews(req, res, parsedUrl, fetchLiveNews) {
  const user = getAuthUser(req, parsedUrl);
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  try {
    const news = await fetchLiveNews();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store'
    });
    res.end(JSON.stringify({ success: true, news }));
  } catch (err) {
    console.error('News fetch error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to fetch live news' }));
  }
}

module.exports = {
  handleLiveData,
  handleLiveNews
};
