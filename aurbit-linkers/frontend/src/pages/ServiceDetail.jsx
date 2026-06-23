import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useServices } from '../context/ServicesContext';
import CustomsLocationSelector from '../components/CustomsLocationSelector';
import { useState } from 'react';

export default function ServiceDetail({ onEnquire }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { categories } = useServices();

  let service = null;
  let category = null;
  for (const cat of categories) {
    const found = cat.items?.find((i) => i.slug === slug);
    if (found) {
      service = found;
      category = cat;
      break;
    }
  }

  if (!service) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl text-navy-900 mb-3">Service not found</h1>
        <p className="text-slate-muted mb-6">This page may have moved or doesn't exist yet.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-full bg-navy-900 text-white text-sm font-semibold"
        >
          Back to home
        </button>
      </div>
    );
  }

  const checklist = [
    'Dedicated specialist assigned to your filing',
    'Document checklist prepared upfront',
    'Status updates at every milestone',
    'Audit-ready records stored securely',
  ];

  return (
    <div className="bg-cream">
      <section className="container-page py-16 lg:py-20">
        <p className="eyebrow mb-3">{category?.label}</p>
        <h1 className="font-display text-3xl lg:text-4xl text-navy-900 mb-5 max-w-2xl">
          {service.name}
        </h1>
        <p className="text-slate-muted max-w-xl leading-relaxed mb-8">
          {category?.summary ||
            'Our team handles the paperwork, filings, and follow-ups so you can focus on running your business.'}
        </p>
        <button
          onClick={() => onEnquire({ name: service.name, slug: service.slug, category: category?.label })}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-navy-900 text-white font-semibold text-[15px] hover:bg-navy-800 transition-colors"
        >
          Get started
          <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>

      {/* Tabs for ICEGATE / Import Export Code */}
      {(service.slug === 'icegate-registration' || service.slug === 'import-export-code') && (
        <ServiceCustomsTabs service={service} onEnquire={onEnquire} category={category} />
      )}

      <section className="bg-white border-t border-navy-100 py-14">
        <div className="container-page max-w-2xl">
          <h2 className="font-display text-xl text-navy-900 mb-6">What's included</h2>
          <ul className="space-y-3.5">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-muted">
                <CheckCircle2 size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function ServiceCustomsTabs({ service, onEnquire, category }) {
  const [active, setActive] = useState('details');
  const [selectedLocations, setSelectedLocations] = useState([]);

  function handleEnquire() {
    const payload = {
      name: service.name,
      slug: service.slug,
      category: category?.label,
      customsLocations: selectedLocations,
    };
    onEnquire && onEnquire(payload);
  }

  return (
    <section className="bg-white border-t border-navy-100 py-14">
      <div className="container-page max-w-3xl">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 -mb-px ${active === 'details' ? 'border-b-2 border-navy-900' : ''}`}
            onClick={() => setActive('details')}
          >
            Service Details
          </button>
          <button
            className={`px-4 py-2 -mb-px ${active === 'customs' ? 'border-b-2 border-navy-900' : ''}`}
            onClick={() => setActive('customs')}
          >
            Customs Location Details
          </button>
        </div>

        {active === 'details' && (
          <div>
            <h3 className="font-display text-xl mb-4">Service Details</h3>
            <p className="text-slate-muted">{service.description || 'Service information and steps.'}</p>
          </div>
        )}

        {active === 'customs' && (
          <div>
            <CustomsLocationSelector selectedLocations={selectedLocations} onChange={setSelectedLocations} />
            <div className="mt-6">
              <button
                onClick={handleEnquire}
                className="px-6 py-2 rounded-full bg-navy-900 text-white font-semibold"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
