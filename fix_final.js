const fs=require('fs');
const path=require('path');
const base=path.join(process.cwd(),'src/components');

// Fix WhyChooseAurbit empty className and add w-full h-full to cards
let c=fs.readFileSync(path.join(base,'WhyChooseAurbit.jsx'),'utf8');
c=c.replace(/className="" /g,'').replace(/h-\[190px\] flex flex-col/g,'h-full flex flex-col');
fs.writeFileSync(path.join(base,'WhyChooseAurbit.jsx'),c);
console.log('fixed WhyChooseAurbit classes');

// Fix HowItWorks trailing space
c=fs.readFileSync(path.join(base,'HowItWorks.jsx'),'utf8');
c=c.replace(/className="relative w-full "]/g,'className="relative w-full"]');
fs.writeFileSync(path.join(base,'HowItWorks.jsx'),c);
console.log('fixed HowItWorks');

// Fix WhereToUseDSC grid
c=fs.readFileSync(path.join(base,'WhereToUseDSC.jsx'),'utf8');
c=c.replace(/className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 "]/g,'className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"]');
fs.writeFileSync(path.join(base,'WhereToUseDSC.jsx'),c);
console.log('fixed WhereToUseDSC');

// Fix ServicesGrid trailing space
c=fs.readFileSync(path.join(base,'ServicesGrid.jsx'),'utf8');
c=c.replace(/className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 "]/g,'className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"]');
fs.writeFileSync(path.join(base,'ServicesGrid.jsx'),c);
console.log('fixed ServicesGrid');

// Fix DSCService root wrapper with overflow-x-hidden
let dsc=fs.readFileSync(path.join(process.cwd(),'src/pages/DSCService.jsx'),'utf8');
dsc=dsc.replace(/<div className="min-h-screen bg-white">/g,'<div className="min-h-screen bg-white overflow-x-hidden">');
fs.writeFileSync(path.join(process.cwd(),'src/pages/DSCService.jsx'),dsc);
console.log('fixed DSCService');
