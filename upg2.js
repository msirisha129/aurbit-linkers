const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/WhereToUseDSC.jsx');
fs.writeFileSync(p,`import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
const useCases = [
  { label: 'GST Filing', desc: 'Sign GSTR-1, GSTR-3B, and annual returns digitally.' },
  { label: 'Income Tax', desc: 'E-verify your ITR with your DSC for faster processing.' },
  { label: 'MCA', desc: 'File ROC forms, director reports, and annual returns.' },
  { label: 'ICEGATE', desc: 'Customs clearance, bill of entry, and export documentation.' },
  { label: 'DGFT', desc: 'Import-export code applications and certificate signing.' },
  { label: 'Trademark Filing', desc: 'Sign trademark applications and related submissions.' },
  { label: 'Tender Participation', desc: 'Bid on GeM, Railways, PSU, and government tenders.' },
  { label: 'EPFO', desc: 'File PF returns and compliance reports with digital signature.' },
  { label: 'Company Registration', desc: 'Sign SPICe+ forms and incorporation documents.' },
  { label: 'Import Export', desc: 'IEC applications, shipping bills, and courier shipments.' },
  { label: 'Banking', desc: 'Authorize financial documents, loan applications, and forms.' },
  { label: 'Document Signing', desc: 'Digitally sign PDFs, agreements, and legal documents.' },
];
export default function WhereToUseDSC() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current; if(!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){ section.classList.add('animate-in'); observer.unobserve(entry.target); }
    },{ threshold: 0.1 });
    observer.observe(section); return () => observer.disconnect();
  },[]);
  return (
    <section ref={sectionRef} className="bg-white py-16 lg:py-20 opacity-0 translate-y-8 transition-all duration-700 ease-out">
      <div className="container-page">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <p className="eyebrow justify-center inline-flex mb-3">Where It's Used</p>
          <h2 className="font-display text-[30px] md:text-[36px] text-navy-900 leading-[1.15] tracking-[-0.5px]">Where You Can Use a DSC</h2>
          <p className="text-slate-muted mt-4 max-w-lg mx-auto leading-relaxed">From tax filings to tender submissions — a DSC is your digital identity across Indian government portals.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {useCases.map((item, i) => (
            <div key={i} className="group rounded-2xl bg-white p-5 border border-[#E8E2D6] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold-400 hover:shadow-[0_12px_32px_rgba(201,168,76,0.12),0_4px_16px_rgba(0,0,0,0.06)]">
              <div className="flex items-start gap-3.5">
                <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#FBF6EC] border border-[#E9D09C]/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 size={16} className="text-gold-600" />
                </div>
                <div>
                  <span className="text-[15px] font-semibold text-navy-900 group-hover:text-navy-800 transition-colors">{item.label}</span>
                  <p className="text-sm text-slate-muted leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center max-w-2xl mx-auto py-5 px-8 rounded-2xl bg-cream border border-[#E8E2D6] shadow-sm">
          <p className="text-sm text-navy-800 font-medium leading-relaxed">🔒 One DSC works across all these portals. No need to buy separate certificates for each service.</p>
        </div>
      </div>
      <style>{\`.animate-in{opacity:1!important;transform:translateY(0)!important}\`}</style>
    </section>
  );
}
`);
console.log('done WhereToUseDSC');
