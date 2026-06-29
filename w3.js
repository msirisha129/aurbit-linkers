const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/WhereToUseDSC.jsx');
fs.writeFileSync(p,fs.readFileSync(p,'utf8'));
console.log('keep where');
