const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const matches = html.match(/id="view[^"]+"/g);
console.log('Views:', matches);
