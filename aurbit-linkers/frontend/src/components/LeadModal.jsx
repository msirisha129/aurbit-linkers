import { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import api, { getErrorMessage } from '../lib/api';

export default function LeadModal({ open, onClose, service }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setForm({ name: '', email: '', phone: '', message: '' });
      setStatus('idle');
      setErrorMsg('');
    }
    console.log('LeadModal mount/open -> service:', service);
  }, [open, service]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        serviceSlug: service?.slug,
        serviceName: service?.name,
        category: service?.category,
        // if customsLocations were provided (ICEGATE flow), mark source accordingly
        source: service && service.customsLocations ? 'icegate-location-selector' : 'website',
      };
      // include customsLocations when provided by service (e.g., ICEGATE flow)
      if (service && service.customsLocations) payload.customsLocations = service.customsLocations;

      console.log('Submitting lead payload', payload);
      const res = await api.post('/leads', payload);
      console.log('Lead POST response:', res && res.data ? res.data : res);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(getErrorMessage(err));
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-soft border border-navy-100 p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-muted hover:text-navy-800 transition-colors"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto text-gold-500 mb-3" size={42} />
            <h3 className="font-display text-xl text-navy-800 mb-2">Request received</h3>
            <p className="text-slate-muted text-sm">
              Thanks, {form.name.split(' ')[0]}. A compliance specialist will reach out within one business day.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 rounded-lg bg-navy-800 text-white text-sm font-medium hover:bg-navy-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-1.5">{service?.category || 'Get started'}</p>
            <h3 id="lead-modal-title" className="font-display text-xl text-navy-800 mb-1">
              {service?.name ? `Enquire about ${service.name}` : 'Tell us about your business'}
            </h3>
            <p className="text-sm text-slate-muted mb-5">
              Share a few details and our team will get back to you with next steps.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-navy-800 mb-1">
                  Full name
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-navy-800 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-navy-800 mb-1">
                  Phone number
                </label>
                <input
                  id="phone"
                    value={form.phone}
                    required
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-navy-800 mb-1">
                  What do you need help with? <span className="text-slate-muted">(optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none resize-none"
                  placeholder="A short note helps us prepare"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold-500 text-navy-900 font-semibold text-sm py-3 hover:bg-gold-400 transition-colors disabled:opacity-60"
              >
                {status === 'submitting' && <Loader2 size={16} className="animate-spin" />}
                {status === 'submitting' ? 'Submitting…' : 'Submit request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
