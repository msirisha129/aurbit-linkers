import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is a Class 3 Digital Signature Certificate?',
    a: 'A Class 3 DSC is a secure digital certificate used for signing documents, GST filing, MCA filings, DGFT, ICEGATE, tender submissions and other government services.',
  },
  {
    q: 'How long does DSC issuance take?',
    a: 'Most Digital Signature Certificates are issued within 30 minutes after successful Aadhaar eKYC verification and document approval.',
  },
  {
    q: 'Which documents are required for a DSC?',
    a: 'Generally Aadhaar, PAN, mobile number, email address and identity verification are required. Additional documents may be needed for organizations.',
  },
  {
    q: 'Can I use one DSC for GST, MCA and Income Tax?',
    a: 'Yes. Depending on your certificate type, the same DSC can be used across multiple government portals including GST, MCA and Income Tax.',
  },
  {
    q: 'How do I renew my Digital Signature Certificate?',
    a: 'You can renew your DSC online before expiry by completing a fresh verification process through the renewal portal.',
  },
  {
    q: 'Is Aadhaar eKYC mandatory?',
    a: 'Yes. Aadhaar-based eKYC or another approved verification method is required before issuing a Digital Signature Certificate.',
  },
];

export default function DSCFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="eyebrow inline-flex mb-3">Questions</p>
          <h2 className="font-display text-3xl text-navy-900 mb-3">
            Frequently asked questions
          </h2>
        </div>

        <div className="divide-y divide-navy-100 border-t border-b border-navy-100">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-navy-900 text-[15px]">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-gold-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-sm text-slate-muted leading-relaxed pb-5 pr-8">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}