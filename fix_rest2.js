const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/WhereToUseDSC.jsx');
const c=fs.readFileSync(p,'utf8');
const fixed=c.replace(/<div className="container-page">/g,'<div className="max-w-7xl mx-auto px-6 lg:px-8">').replace(/max-w-6xl mx-auto/g,'');
fs.writeFileSync(p,fixed);
console.log('fixed WhereToUseDSC');
