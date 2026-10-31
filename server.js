/**
 * THE MARKET SNIPER SHOOTERS
 * Root Server Entry Point
 * 
 * Forwards execution to the modular backend architecture located at:
 * src/backend/server.js
 */

const path = require('path');

// Launch the modular backend server
module.exports = require(path.join(__dirname, 'src', 'backend', 'server.js'));
