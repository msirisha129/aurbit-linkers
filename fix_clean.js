const fs=require('fs');
const path=require('path');
const base=path.join(process.cwd(),'src/components');

// Clean WhyChooseAurbit empty className
let c=fs.readFileSync(path.join(base,'WhyChooseAurbit.jsx'),'utf8');
c=c.replace(/className="" /g,'');
fs.writeFileSync(path.join(base,'WhyChooseAurbit.jsx'),c);
console.log('cleaned WhyChooseAurbit');

// Fix HowItWorks grid and illustration classes
c=fs.readFileSync(path.join(base,'HowItWorks.jsx'),'utf8');
c=c.replace('lg:grid-cols-2 gap-12 lg:gap-16','lg:grid-cols-[1.15fr_0.85fr] gap-12');
c=c.replace('className="relative w-full "','className="relative w-full"');
c=c.replace('className="rounded-2xl bg-white border border-[#E8E2D6] p-5 shadow-sm flex flex-col items-center text-center hover:border-gold-300 transition-colors"','className="rounded-2xl bg-white border border-[#E8E2D6] p-5 shadow-sm flex flex-col items-center text-center hover:border-gold-300 transition-colors w-full h-full overflow-hidden break-words"');
fs.writeFileSync(path.join(base,'HowItWorks.jsx'),c);
console.log('fixed HowItWorks');

// Clean ServicesGrid trailing space
c=fs.readFileSync(path.join(base,'ServicesGrid.jsx'),'utf8');
c=c.replace('gap-5 }].map','gap-5"].map').replace('className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 "','className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"');
fs.writeFileSync(path.join(base,'ServicesGrid.jsx'),c);
console.log('fixed ServicesGrid');

// Ensure WhereToUseDSC grid has w-full
c=fs.readFileSync(path.join(base,'WhereToUseDSC.jsx'),'utf8');
c=c.replace('className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 "','className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"');
fs.writeFileSync(path.join(base,'WhereToUseDSC.jsx'),c);
console.log('fixed WhereToUseDSC');
