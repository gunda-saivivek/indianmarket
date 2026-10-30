const { ACADEMY_MODULES } = require('./build_master_academy_v4.js');

let total = 0;
ACADEMY_MODULES.forEach(m => {
  console.log(`\nModule ${m.number}: ${m.title}`);
  m.topics.forEach(t => {
    total++;
    console.log(`  - [${t.id}] ${t.title}`);
  });
});
console.log(`\nTotal topics across modules: ${total}`);
