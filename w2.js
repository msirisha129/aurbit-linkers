const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/HowItWorks.jsx');
const c = fs.readFileSync(p,'utf8');
const lines = c.split(/\r?\n/);
lines[0] = "import { useEffect, useRef } from 'react';";
lines[2] = "import { Settings, Fingerprint, Download, Shield, FileCheck, Fingerprint as FP } from 'lucide-react';";
fs.writeFileSync(p, lines.join('\n'));
console.log('done HowItWorks step1');
