const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/FinalCTA.jsx');
fs.writeFileSync(p,`import { useEffect, useRef } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function FinalCTA() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const section = sectionRef.current; if(!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){ section.classList.add('animate-in'); observer.unobserve(entry.target); }
    },{ threshold: 0.15 });
    observer.observe(section); return () => observer.disconnect();
  },[]);
  return (
    <section ref={sectionRef} className="relative py-20 lg:py-24 overflow-hidden opacity-0 translate-y-8 transition-all duration-700 ease-out" style={{background:'linear-gradient(165deg, #F7F5F0 0%, #F5F0E8 40%, #FBF6EC 100%)'}}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-gold-300/20" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-gold-300/15" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-navy-200/15" />
        <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gold-500/5" />
      </div>
      <div className="container-page relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-[#E8E2D6] shadow-lg p-10 lg:p-14 text-center">
            <p className="eyebrow justify-center inline-flex mb-4 text-gold-600">Get Started Today</p>
            <h2 className="font-display text-[30px] md:text-[38px] lg:text-[42px] text-navy-900 leading-[1.08] tracking-[-0.5px] mb-5">Ready to Get Your Digital Signature Certificate?</h2>
            <p className="text-slate-muted max-w-xl mx-auto mb-8 leading-relaxed text-[15px]">Join 2,000+ businesses that trust Aurbit Linkers for fast, secure, and paperless DSC issuance. Get your certificate in under 30 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/service/dsc')} className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-navy-900 text-white font-semibold text-[15px] hover:bg-navy-800 transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
                Apply Now
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform duration-150" />
              </button>
              <a href="#" onClick={(e) => { e.preventDefault(); window.Tawk_API && window.Tawk_API.toggle(); }} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-navy-200 text-navy-800 font-semibold text-[15px] hover:bg-navy-50 hover:border-gold-400 transition-all duration-150 ease-out hover:scale-[1.02]">
                <Phone size={17} /> Talk to Expert
              </a>
            </div>
            <p className="text-xs text-slate-muted mt-6">🔒 No spam. No obligations. Get a free consultation today.</p>
          </div>
        </div>
      </div>
      <style>{\`.animate-in{opacity:1!important;transform:translateY(0)!important}\`}</style>
    </section>
  );
}
`);
console.log('done FinalCTA');
