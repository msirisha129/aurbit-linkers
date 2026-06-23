import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="container-page py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Logo variant="light" />
          <p className="mt-4 text-sm text-navy-200 max-w-xs leading-relaxed">
            India's AI-powered corporate registrations and compliance platform — linking your filings,
            deadlines, and records in one place.
          </p>
        </div>

        <FooterColumn
          title="Aurbit Linkers"
          links={[
            { label: 'About us', to: '/about' },
            { label: 'Learning Center', to: '/learning-center' },
            { label: 'Contact us', to: '/contact' },
          ]}
        />
        <FooterColumn
          title="Platforms"
          links={[
            { label: 'Business Search', to: '/business-search' },
            { label: 'Linkers Cloud', to: '/linkers-cloud' },
            { label: 'Developer Resources', to: '/developers' },
          ]}
        />
        <FooterColumn
          title="Usage"
          links={[
            { label: 'Terms & Conditions', to: '/terms' },
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Refund Policy', to: '/refund-policy' },
          ]}
        />
      </div>

      <div className="border-t border-navy-700">
        <div className="container-page py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-navy-300">
          <p>© {new Date().getFullYear()} Aurbit Linkers. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/confidentiality" className="hover:text-gold-300">Confidentiality Policy</Link>
            <Link to="/disclaimer" className="hover:text-gold-300">Disclaimer Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-navy-200 hover:text-gold-300 transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
