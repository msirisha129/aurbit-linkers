const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/HowItWorks.jsx');
fs.writeFileSync(p,`import { useEffect, useRef } from 'react';
import { Settings, Fingerprint, Download, Shield, FileCheck, Fingerprint as FP } from 'lucide-react';
const steps = [
  { icon: Settings, title: 'Configure your DSC', desc: 'Select class type, validity, and user type that fits your business need — complete the form in under 2 minutes.' },
  { icon: Fingerprint, title: 'Complete eKYC & Verification', desc: 'Verify your identity instantly via Aadhaar-based eKYC or video verification with our authorized officer.' },
  { icon: Download, title: 'Receive & Install Your Certificate', desc: 'Get your DSC instantly via email. Our guided installer helps you set it up on your system in minutes.' },
];
export default function HowItWorks() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current; if(!section) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){ section.classList.add('animate-in'); observer.unobserve(entry.target); }
      });
    },{ threshold: 0.15 });
    observer.observe(section); return () => observer.disconnect();
  },[]);
  useEffect(() => {
    const line = lineRef.current; if(!line) return;
    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){ line.style.height='100%'; observer.unobserve(entry.target); }
    },{ threshold: 0.2 });
    observer.observe(line); return () => observer.disconnect();
  },[]);
  return (
    <section ref={sectionRef} className="bg-white py-16 lg:py-20 overflow-hidden opacity-0 translate-y-8 transition-all duration-700 ease-out">
      <div className="container-page">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <p className="eyebrow justify-center inline-flex mb-3">How It Works</p>
          <h2 className="font-display text-[30px] md:text-[36px] text-navy-900 leading-[1.15] tracking-[-0.5px]">Get Your DSC in 3 Simple Steps</h2>
          <p className="text-slate-muted mt-4 max-w-lg mx-auto leading-relaxed">No paperwork, no agents. Fully digital from start to finish.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative pl-20 space-y-10">
            <div ref={lineRef} className="absolute left-[26px] top-4 w-[1.5px] bg-gradient-to-b from-gold-300 via-gold-200 to-transparent" style={{height:'0%',transition:'height 1400ms cubic-bezier(0.4,0,0.2,1)'}} />
            {steps.map((step,i)=>{
              const Icon=step.icon;
              return (
                <div key={i} className="relative">
                  <div className="absolute -left-20 top-0 w-14 h-14 rounded-full bg-cream border-2 border-gold-300 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                    <span className="text-gold-600 font-bold text-lg">{i+1}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-semibold text-navy-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-muted leading-relaxed pr-4">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[420px]">
              <div className="grid grid-cols-2 gap-4">
                {[[Shield,'Trusted'],[FileCheck,'Verified'],[FileCheck,'Approved'],[FP,'Biometric']].map(([Icon,l],idx)=>(
                  <div key={idx} className="rounded-2xl bg-white border border-[#E8E2D6] p-5 shadow-sm flex flex-col items-center text-center hover:border-gold-300 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-[#FBF6EC] border border-[#E9D09C]/40 flex items-center justify-center mb-3">
                      <Icon size={28} className="text-gold-600"/>
                    </div>
                    <span className="text-sm font-semibold text-navy-900">{l}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white border border-[#E8E2D6] p-6 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#FBF6EC] border-2 border-gold-300 flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                  <span className="text-gold-700 font-bold text-sm">DSC</span>
                </div>
                <div>
                  <p className="text-navy-900 font-semibold">Digital Signature Certificate</p>
                  <p className="text-sm text-slate-muted">2048-bit encrypted token</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{\`.animate-in{opacity:1!important;transform:translateY(0)!important}\`}</style>
    </section>
  );
}
`);
console.log('done HowItWorks v2');
