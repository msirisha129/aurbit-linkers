import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/services';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container-page max-w-3xl">
        <div className="text-center mb-12">
          <p className="eyebrow justify-center inline-flex mb-3">Questions</p>
          <h2 className="font-display text-3xl text-navy-900">Frequently asked questions</h2>
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
