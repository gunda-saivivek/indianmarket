const fs = require('fs');
const content = fs.readFileSync('server.js', 'utf8');
const idx = content.indexOf("'/api/option-chain'");
console.log(content.substring(idx - 100, idx + 800));
