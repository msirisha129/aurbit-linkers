export default function Logo({ variant = 'dark', className = '' }) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy-800';
  const subColor = variant === 'light' ? 'text-gold-300' : 'text-gold-600';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill={variant === 'light' ? '#0F2A5C' : '#0A1A3C'} />
        <circle cx="10" cy="11" r="2.6" fill="#C9974A" />
        <circle cx="24" cy="9.5" r="1.9" fill="#C9974A" />
        <circle cx="10.5" cy="24" r="1.9" fill="#C9974A" />
        <circle cx="23.5" cy="23" r="2.6" fill="#C9974A" />
        <path
          d="M10 11 L24 9.5 M10 11 L10.5 24 M24 9.5 L23.5 23 M10.5 24 L23.5 23"
          stroke="#C9974A"
          strokeWidth="1.1"
          opacity="0.6"
        />
      </svg>
      <span className={`font-display font-semibold text-xl leading-none ${textColor}`}>
        Aurbit <span className={subColor}>Linkers</span>
      </span>
    </div>
  );
}
