import { ArrowRight } from 'lucide-react';
import { getIcon } from '../lib/icons';
import { homepageCards } from '../data/services';

export default function ServiceCards({ onLearnMore }) {
  return (
    <section id="services" className="bg-white py-20 lg:py-24">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-[720px] mx-auto mb-16">
          <p className="eyebrow justify-center inline-flex mb-4 text-[12px] tracking-[2px] font-semibold uppercase text-navy-600">What we handle</p>
          <h2 className="text-[30px] md:text-[36px] lg:text-[36px] text-navy-900 leading-[1.2] tracking-[-0.5px] font-semibold">
            Business Compliance Made Simple
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homepageCards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <div
                key={card.key}
                className="group rounded-[16px] border border-navy-100 bg-white p-6 hover:border-gold-400 transition-all duration-250 hover:-translate-y-1 flex flex-col"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(201, 168, 76, 0.15), 0 4px 16px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                <div className="w-[52px] h-[52px] rounded-lg bg-gold-50 flex items-center justify-center mb-5 border border-gold-200 group-hover:scale-110 transition-transform duration-250">
                  <Icon size={24} className="text-gold-600" />
                </div>
                <h3 className="text-[22px] text-navy-900 mb-3 font-semibold tracking-tight leading-tight">{card.name}</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-5 flex-grow">{card.desc}</p>
                <button
                  onClick={() => onLearnMore(card)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors duration-250 group/btn mt-auto"
                >
                  <span className="relative">
                    Learn more
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 group-hover/btn:w-full transition-all duration-250"></span>
                  </span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-250" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
