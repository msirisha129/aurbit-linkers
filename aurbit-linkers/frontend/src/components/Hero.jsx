import { ArrowRight } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative overflow-hidden bg-cream pt-20 pb-24 lg:pt-28 lg:pb-32">
      {/* Ambient node field */}
      <svg
        className="node-field"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <style>
            {`
              .dot-travel-1 {
                animation: travelLine1 10s ease-in-out infinite;
              }
              .dot-travel-2 {
                animation: travelLine2 10s ease-in-out infinite;
              }
              .dot-travel-3 {
                animation: travelLine3 10s ease-in-out infinite;
              }
              .dot-travel-4 {
                animation: travelLine4 10s ease-in-out infinite;
              }
              @keyframes travelLine1 {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(260px, 130px); }
              }
              @keyframes travelLine2 {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(-120px, 200px); }
              }
              @keyframes travelLine3 {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(140px, 180px); }
              }
              @keyframes travelLine4 {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(-220px, 120px); }
              }
            `}
          </style>
        </defs>
        <g opacity="0.5">
          {/* Fixed connector lines */}
          <line x1="120" y1="90" x2="380" y2="220" stroke="#C9974A" strokeWidth="1" />
          <line x1="380" y1="220" x2="260" y2="420" stroke="#C9974A" strokeWidth="1" />
          <line x1="1180" y1="80" x2="1320" y2="260" stroke="#C9974A" strokeWidth="1" />
          <line x1="1320" y1="260" x2="1100" y2="380" stroke="#C9974A" strokeWidth="1" />
          
          {/* Animated traveling dots */}
          <circle className="dot-travel-1" cx="120" cy="90" r="4" fill="#C9974A" />
          <circle className="dot-travel-2" cx="380" cy="220" r="3" fill="#0F2A5C" />
          <circle className="dot-travel-3" cx="260" cy="420" r="5" fill="#C9974A" />
          <circle className="dot-travel-4" cx="1180" cy="80" r="3.5" fill="#0F2A5C" />
        </g>
      </svg>

      <div className="container-page relative">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow justify-center inline-flex mb-5">AI-Powered Compliance Cloud</p>
          <h1 className="font-display text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-navy-900 mb-6">
            India's compliance, linked &amp; automated
          </h1>
          <p className="text-lg text-slate-muted max-w-xl mx-auto mb-9 leading-relaxed">
            Aurbit Linkers connects MCA, GST, and Income Tax filings into one workflow — built on
            AI automation, expert review, and a paperless record trail.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-navy-900 text-white font-semibold text-[15px] hover:bg-navy-800 transition-colors"
            >
              Get Started
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-navy-200 text-navy-800 font-semibold text-[15px] hover:bg-navy-50 transition-colors"
            >
              Explore services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
