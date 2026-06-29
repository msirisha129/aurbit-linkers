const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/WhyChooseAurbit.jsx');
fs.writeFileSync(p,`import { useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Lock, Headphones } from 'lucide-react';

const benefits = [
  { icon: ShieldCheck, title: 'Government Authorized Partners', desc: 'Certified through licensed Certifying Authorities under the IT Act, 2000.' },
  { icon: Zap, title: 'Fast Processing', desc: 'Certificates issued within 30 minutes of successful eKYC verification.' },
  { icon: Lock, title: 'Secure Verification', desc: 'End-to-end encrypted eKYC with 2048-bit key infrastructure and Aadhaar OTP.' },
  { icon: Headphones, title: 'Dedicated Support', desc: '24/7 expert assistance with average response time under 5 minutes on call and chat.' },
];
const stats = [
  { value: '30 min', label: 'Average Approval' },
  { value: '2K+', label: 'Businesses Served' },
  { value: '99.9%', label: 'Success Rate' },
];
export default function WhyChooseAurbit() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current; if(!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){ section.classList.add('animate-in'); observer.unobserve(entry.target); }
    },{ threshold: 0.1 });
    observer.observe(section); return () => observer.disconnect();
  },[]);
  return (
    <section ref={sectionRef} className="bg-[#F5F0E8] py-16 lg:py-20 opacity-0 translate-y-8 transition-all duration-700 ease-out">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Why Aurbit Linkers</p>
            <h2 className="font-display text-[30px] md:text-[36px] text-navy-900 leading-[1.15] tracking-[-0.5px] mb-5">India's Most Trusted <br className="hidden sm:block" /> DSC Partner</h2>
            <p className="text-slate-muted leading-relaxed mb-6 max-w-xl">We combine government-authorised infrastructure with modern technology to deliver the fastest, most secure Digital Signature Certificate experience in India.</p>
            <p className="text-slate-muted leading-relaxed max-w-xl">Our platform handles end-to-end processing — from guidance on class selection to final issuance — so your team stays focused on operations.</p>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {stats.map((s,i)=>(
                <div key={i} className="rounded-2xl bg-white p-5 border border-[#E8E2D6] shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-2xl font-bold text-navy-900 tracking-tight leading-none">{s.value}</p>
                  <p className="text-xs text-slate-muted mt-1.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b,i)=>{
                const Icon=b.icon;
                return (
                  <div key={i} className="group relative rounded-2xl bg-white p-6 border border-[#E8E2D6] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-[0_12px_32px_rgba(201,168,76,0.15),0_4px_16px_rgba(0,0,0,0.08)] h-[190px] flex flex-col">
                    <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-transparent opacity-70" />
                    <div className="w-14 h-14 rounded-xl bg-[#FBF6EC] border border-[#E9D09C]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className="text-gold-600" />
                    </div>
                    <h3 className="text-[22px] font-semibold text-navy-900 mb-1 tracking-tight leading-tight">{b.title}</h3>
                    <p className="text-[15px] text-slate-muted leading-relaxed line-clamp-3">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{\`.animate-in{opacity:1!important;transform:translateY(0)!important}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\`}</style>
    </section>
  );
}
`);
console.log('done WhyChooseAurbit');
