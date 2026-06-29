const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/ServicesGrid.jsx');
fs.writeFileSync(p,`import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileBadge2, RefreshCw, Download, Search, Video, Building2, ArrowUpRight } from 'lucide-react';
const services = [
  { icon: FileBadge2, title: 'Apply for DSC', desc: 'New Class 2, Class 3, or DGFT digital signature certificate in minutes.', slug: '/service/dsc' },
  { icon: RefreshCw, title: 'Renew DSC', desc: 'Hassle-free renewal before expiry to keep your filings uninterrupted.', slug: '/service/dsc' },
  { icon: Download, title: 'Download Certificate', desc: 'Access your issued certificates anytime from your secure dashboard.', slug: '/service/dsc' },
  { icon: Search, title: 'Track Application', desc: 'Real-time status of your DSC application from submission to issuance.', link: '#' },
  { icon: Video, title: 'Video Verification', desc: 'Complete your in-person verification remotely via secure video call.', link: '#' },
  { icon: Building2, title: 'Enterprise Solutions', desc: 'Bulk DSC procurement and managed compliance for organizations.', slug: '/service/dsc' },
];
export default function ServicesGrid() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const section = sectionRef.current; if(!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){ section.classList.add('animate-in'); observer.unobserve(entry.target); }
    },{ threshold: 0.1 });
    observer.observe(section); return () => observer.disconnect();
  },[]);
  return (
    <section ref={sectionRef} className="bg-cream py-16 lg:py-20 opacity-0 translate-y-8 transition-all duration-700 ease-out">
      <div className="container-page">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <p className="eyebrow justify-center inline-flex mb-3">Our Services</p>
          <h2 className="font-display text-[30px] md:text-[36px] text-navy-900 leading-[1.15] tracking-[-0.5px]">Complete DSC Solutions</h2>
          <p className="text-slate-muted mt-4 max-w-lg mx-auto leading-relaxed">Everything you need — from application to renewal — under one roof.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="group relative rounded-2xl bg-white p-6 border border-[#E8E2D6] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-[0_12px_32px_rgba(201,168,76,0.15),0_4px_16px_rgba(0,0,0,0.08)] flex flex-col h-full">
                <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-transparent opacity-70" />
                <div className="w-14 h-14 rounded-xl bg-[#FBF6EC] border border-[#E9D09C]/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Icon size={24} className="text-gold-600" />
                </div>
                <h3 className="text-[18px] font-semibold text-navy-900 mb-2 tracking-tight">{svc.title}</h3>
                <p className="text-[15px] text-slate-muted leading-relaxed mb-4 flex-grow">{svc.desc}</p>
                <button onClick={() => { if (svc.slug) navigate(svc.slug); }} className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors duration-200 group/btn mt-auto">
                  <span className="relative">Learn more<span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold-500 group-hover/btn:w-full transition-all duration-300"></span></span>
                  <ArrowUpRight size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <style>{\`.animate-in{opacity:1!important;transform:translateY(0)!important}\`}</style>
    </section>
  );
}
`);
console.log('done ServicesGrid');
