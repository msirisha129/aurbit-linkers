import { ArrowRight } from 'lucide-react';

export default function CTABanner({ onGetStarted }) {
  return (
    <section className="bg-cream py-20">
      <div className="container-page">
        <div className="rounded-3xl bg-navy-gradient px-8 py-14 text-center relative overflow-hidden">
          <svg className="absolute inset-0 opacity-20" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <line x1="80" y1="40" x2="220" y2="120" stroke="#C9974A" strokeWidth="1" />
            <line x1="220" y1="120" x2="120" y2="240" stroke="#C9974A" strokeWidth="1" />
            <line x1="600" y1="50" x2="720" y2="160" stroke="#C9974A" strokeWidth="1" />
            <circle cx="80" cy="40" r="3.5" fill="#C9974A" />
            <circle cx="220" cy="120" r="3" fill="#C9974A" />
            <circle cx="120" cy="240" r="4" fill="#C9974A" />
            <circle cx="600" cy="50" r="3" fill="#C9974A" />
            <circle cx="720" cy="160" r="4" fill="#C9974A" />
          </svg>

          <div className="relative">
            <p className="eyebrow justify-center inline-flex mb-4 text-gold-300">Get started</p>
            <h2 className="font-display text-3xl lg:text-4xl text-white mb-4">Ready to get started?</h2>
            <p className="text-navy-100 max-w-md mx-auto mb-8">
              Create an account to start your company registration or migrate your existing
              business. No credit card required to explore.
            </p>
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-500 text-navy-900 font-semibold text-[15px] hover:bg-gold-400 transition-colors"
            >
              Get Started
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
