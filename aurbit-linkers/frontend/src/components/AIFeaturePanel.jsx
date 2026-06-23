import { getIcon } from '../lib/icons';
import { homepageCards } from '../data/services';

const pills = homepageCards.map((c) => ({ name: c.name, icon: c.icon }));

export default function AIFeaturePanel() {
  return (
    <section className="bg-cream py-20 lg:py-24 overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="eyebrow mb-4">AI-Powered</p>
          <h2 className="font-display text-3xl lg:text-[2.3rem] text-navy-900 mb-6 leading-tight">
            Compliance, linked end to end
          </h2>
          <p className="text-slate-muted leading-relaxed mb-5">
            Stay compliant with automated help for GST filing, income tax returns, ROC compliance,
            and annual filings — with smart reminders and a full audit trail.
          </p>
          <p className="text-slate-muted leading-relaxed">
            Connect banks, payment gateways, and government portals in one workflow so
            reconciliations, journal posting, and return-ready records stay in sync. Extend
            invoicing and compliance flows with developer-friendly APIs and webhooks.
          </p>
        </div>

        <div className="relative h-[420px] hidden sm:block">
          <svg viewBox="0 0 520 420" className="w-full h-full" aria-hidden="true">
            {pills.map((_, i) => {
              const cx = 130;
              const cy = 210;
              const tx = 470;
              const ty = 40 + i * 68;
              return (
                <path
                  key={i}
                  d={`M ${cx} ${cy} C ${cx + 90} ${cy - 10}, ${tx - 110} ${ty}, ${tx - 40} ${ty}`}
                  fill="none"
                  stroke={['#C9974A', '#7C97C9', '#DDB86C', '#4F73B6', '#E9D09C', '#16356B'][i % 6]}
                  strokeWidth="1.4"
                  strokeDasharray="4 4"
                  opacity="0.65"
                />
              );
            })}
          </svg>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-3xl bg-navy-gradient shadow-gold flex flex-col items-center justify-center text-center px-4">
            <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center mb-3">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
            </div>
            <p className="text-white font-display text-sm leading-tight">Aurbit<br/>Linkers</p>
            <p className="text-gold-300 text-[10px] uppercase tracking-wider mt-1.5">Compliance Cloud</p>
          </div>

          <div className="absolute right-0 top-0 flex flex-col gap-2.5 w-[230px]">
            {pills.map((pill, i) => {
              const Icon = getIcon(pill.icon);
              return (
                <div
                  key={pill.name}
                  className="flex items-center gap-2.5 bg-white rounded-full pl-2.5 pr-4 py-2 shadow-soft border border-navy-100"
                >
                  <div className="w-7 h-7 rounded-full bg-navy-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-navy-700" />
                  </div>
                  <span className="text-[13px] font-medium text-navy-800 whitespace-nowrap">{pill.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
