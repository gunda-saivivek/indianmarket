function formatTimeAgo(pubDateStr) {
  if (!pubDateStr) return 'Just now';
  const diffMs = Date.now() - new Date(pubDateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

function parseGoogleNewsRss(xml) {
  const items = [];
  const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?(?:<source[^>]*>(.*?)<\/source>)?[\s\S]*?<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 12) {
    const rawTitle = match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/&amp;/g, '&');
    const parts = rawTitle.split(' - ');
    const source = parts.length > 1 ? parts.pop() : (match[4] || 'Financial News');
    const cleanTitle = parts.join(' - ');

    items.push({
      title: cleanTitle,
      link: match[2],
      pubDate: match[3],
      source: source || 'Financial News',
      timeAgo: formatTimeAgo(match[3])
    });
  }
  return items;
}

let newsCache = { data: null, timestamp: 0 };

async function fetchFinancialNews() {
  if (newsCache.data && (Date.now() - newsCache.timestamp < 120000)) {
    return newsCache.data;
  }

  const query = encodeURIComponent('Nifty 50 Sensex Indian Stock Market RBI Inflation');
  const feedUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

  try {
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) throw new Error('News fetch failed');
    const xml = await res.text();
    const articles = parseGoogleNewsRss(xml);
    newsCache = { data: articles, timestamp: Date.now() };
    return articles;
  } catch (e) {
    return newsCache.data || [];
  }
}

module.exports = {
  fetchFinancialNews,
  formatTimeAgo
};
