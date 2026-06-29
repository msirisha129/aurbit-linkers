try {
  const p = require('./node_modules/@swc/core');
  const r = p.parseFile('src/pages/DSCService.jsx', { syntax: 'ecmascript', tsx: true });
  console.log('Parse OK');
} catch (e) {
  console.log('Parse Error:', e.message);
}
