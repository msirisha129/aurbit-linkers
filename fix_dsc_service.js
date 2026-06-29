const fs=require('fs');
const p=require('path').join(process.cwd(),'src/pages/DSCService.jsx');
const c=fs.readFileSync(p,'utf8');
const fixed=c.replace(/<div className="min-h-screen bg-white">/g,'<div className="min-h-screen bg-white overflow-x-hidden">');
fs.writeFileSync(p,fixed);
console.log('fixed DSCService');
