const fs=require('fs');
const p=require('path').join(process.cwd(),'src/components/DSCFAQ.jsx');
fs.writeFileSync(p,`import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
const faqs = [
  { q: 'What is a Digital Signature Certificate (DSC)?', a: 'A Digital Signature Certificate (DSC) is an electronic identity document issued by a licensed Certifying Authority under the IT Act, 2000. It binds your identity to a cryptographic key pair and is used to sign documents electronically — legally equivalent to a handwritten signature.' },
  { q: 'Which class of DSC should I choose?', a: 'Class 2 DSC is used for most filings — GST, Income Tax, MCA, EPFO, and Tenders. Class 3 DSC is required for high-security applications like ICEGATE, DGFT, e-Procurement, and Customs. We recommend Class 3 for broader compatibility.' },
  { q: 'How long does DSC approval take?', a: 'Once your eKYC and document verification are complete, the certificate is typically issued within 15–30 minutes. In rare cases where additional verification is needed, it may take up to 24 hours.' },
  { q: 'Which documents are required for a DSC?', a: 'For individuals: Aadhaar card and PAN card. For organizations: Aadhaar, PAN, GST certificate, incorporation certificate, and board resolution authorizing the signatory.' },
  { q: 'Is Aadhaar eKYC mandatory for DSC?', a: 'Yes, Aadhaar-based eKYC is mandatory for instant issuance. If you prefer not to use Aadhaar, video verification with a physical ID proof is available, though issuance may take slightly longer.' },
  { q: 'Can I renew my DSC before it expires?', a: 'Yes, we recommend renewing 30 days before expiry. Renewal is faster than a fresh application since your verification details are already on record.' },
];
export default function DSCFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
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
      <div className="container-page max-w-3xl">
        <div className="text-center mb-10">
          <p className="eyebrow justify-center inline-flex mb-3">FAQ</p>
          <h2 className="font-display text-[30px] md:text-[36px] text-navy-900 leading-[1.15] tracking-[-0.5px]">Frequently Asked Questions</h2>
          <p className="text-slate-muted mt-4 max-w-md mx-auto leading-relaxed">Everything you need to know about Digital Signature Certificates.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="group rounded-2xl border border-[#E8E2D6] bg-white shadow-sm transition-all duration-300 ease-out hover:border-gold-300 overflow-hidden">
                <button onClick={() => setOpenIndex(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200" aria-expanded={isOpen}>
                  <span className="font-medium text-navy-900 text-[15px] group-hover:text-navy-800 transition-colors pr-2">{item.q}</span>
                  <ChevronDown size={18} className={\`flex-shrink-0 text-gold-600 transition-all duration-300 ease-out \${isOpen ? 'rotate-180' : ''}\`} />
                </button>
                <div className={\`overflow-hidden transition-all duration-300 ease-out \${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}\`}>
                  <p className="text-[15px] text-slate-muted leading-relaxed px-6 pb-5">{item.a}</p>
                </div>
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
console.log('done DSCFAQ');
