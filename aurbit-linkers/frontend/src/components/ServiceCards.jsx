import { ArrowRight } from 'lucide-react';
import { getIcon } from '../lib/icons';
import { homepageCards } from '../data/services';

export default function ServiceCards({ onLearnMore }) {
  return (
    <section id="services" className="bg-white py-20 lg:py-24">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow justify-center inline-flex mb-3">What we handle</p>
          <h2 className="font-display text-3xl lg:text-[2.3rem] text-navy-900">
            Everything you need to register, manage, and grow your business at every stage
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageCards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <div
                key={card.key}
                className="group rounded-2xl border border-navy-100 p-7 hover:border-gold-300 hover:shadow-soft transition-all bg-cream/40"
              >
                <div className="w-11 h-11 rounded-xl bg-navy-900 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <h3 className="font-display text-lg text-navy-900 mb-2">{card.name}</h3>
                <p className="text-sm text-slate-muted leading-relaxed mb-5">{card.desc}</p>
                <button
                  onClick={() => onLearnMore(card)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 group-hover:gap-2.5 transition-all"
                >
                  Learn more <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
