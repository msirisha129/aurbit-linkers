const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/FinalCTA.jsx');
const c=fs.readFileSync(p,'utf8');
const fixed=c.replace(/<div className="container-page relative z-10">/g,'<div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">').replace(/<div className="max-w-3xl mx-auto">/g,'<div className="w-full">');
fs.writeFileSync(p,fixed);
console.log('fixed FinalCTA');
