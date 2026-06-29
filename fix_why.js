const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/WhyChooseAurbit.jsx');
const c=fs.readFileSync(p,'utf8');
const fixed=c.replace(/className="" /g,'').replace(/gap-10 gap-12/g,'gap-12').replace(/<div className="max-w-7xl mx-auto px-6 lg:px-8">/g,'<div className="max-w-7xl mx-auto px-6 lg:px-8">');
fs.writeFileSync(p,fixed);
console.log('fixed WhyChooseAurbit');
