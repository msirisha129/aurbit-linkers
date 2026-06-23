import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  FileText,
  MapPin,
  Award,
  Users,
  Rocket,
  User,
  MessageCircle,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import api from '../lib/api';

export const ICEGATE_STARTING_PRICE = '₹2,899';

export const TRUST_STATS = [
  { icon: Star, title: '4.8', subtitle: 'Verified Reviews' },
  { icon: Award, title: '15+ Years', subtitle: 'of Experience' },
  { icon: Users, title: '2 Lakh+', subtitle: 'Trusted across India' },
  { icon: MapPin, title: 'App Tracking', subtitle: 'Live status updates' },
];

export default function IcegateLanding() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [panGstin, setPanGstin] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  async function handleContinue() {
    setError('');
    setMsg('');
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill name, email and phone number.');
      return;
    }
    try {
      const payload = {
        name,
        email,
        phone,
        state: region,
        panGstin,
        serviceSlug: 'icegate-registration',
        serviceName: 'ICEGATE Registration',
        category: 'Registrations',
        source: 'icegate-landing-page',
      };
      const res = await api.post('/leads', payload);
      // Backend returns 201 with { message, lead } on success.
      if (res.status === 201 || (res.data && res.data.lead)) {
        // Pass applicant data to details page via router state
        navigate('/service/icegate-registration', { state: { name, email, phone, state: region, panGstin } });
      } else {
        setError(res.data?.message || 'Failed to submit lead.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Submission failed');
    }
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <section className="container-page text-center py-12">
        <h1 className="font-display text-3xl lg:text-4xl text-navy-900">
          Fast &amp; Reliable <span className="text-gold-600">ICEGATE Registration</span>
        </h1>
        <p className="text-slate-muted max-w-2xl mx-auto mt-4">
          Get registered on ICEGATE and manage your import-export customs filings online with ease. We ensure a quick, error-free ICEGATE registration so you stay connected with Indian Customs 24x7.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-white border">
          <Rocket size={16} className="text-navy-800" />
          <span className="text-sm">ICEGATE Registration - starts from {ICEGATE_STARTING_PRICE}</span>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="bg-white rounded-2xl shadow-soft p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-display text-xl text-navy-900 mb-3">Apply for ICEGATE Registration</h2>
            <p className="text-slate-muted mb-4">
              Get ICEGATE Registration in India quickly and hassle-free. We handle documentation, DSC linking, and portal approval to ensure seamless customs clearance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <User size={18} className="text-navy-800 mt-1" />
                <div>End-to-End ICEGATE Registration Assistance</div>
              </li>
              <li className="flex items-start gap-3">
                <FileText size={18} className="text-navy-800 mt-1" />
                <div>Customized Solutions for Your Business</div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="text-navy-800 mt-1" />
                <div>100% Online &amp; Paperless Process</div>
              </li>
              <li className="flex items-start gap-3">
                <Settings size={18} className="text-navy-800 mt-1" />
                <div>Quick Turnaround with Zero Hassle</div>
              </li>
            </ul>
          </div>

          <div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setMsg('Google sign-in coming soon')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md bg-white text-navy-800"
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t" />
                <div className="px-3 text-sm text-slate-muted">OR</div>
                <div className="flex-1 border-t" />
              </div>

              {msg && <div className="text-sm text-navy-800 mb-2">{msg}</div>}
              {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

              <div className="space-y-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border rounded-md" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
                <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="State (e.g., Maharashtra)" className="w-full px-3 py-2 border rounded-md" />
                <input value={panGstin} onChange={(e) => setPanGstin(e.target.value)} placeholder="PAN or GSTIN (optional)" className="w-full px-3 py-2 border rounded-md" />
                <div className="flex gap-2">
                  <div className="px-3 py-2 border rounded-md flex items-center gap-2">🇮🇳 +91</div>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="flex-1 px-3 py-2 border rounded-md" />
                </div>
                <button
                  onClick={handleContinue}
                  className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-navy-800 to-gold-500 text-white font-semibold"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-6">
        <div className="flex gap-4 justify-center flex-wrap">
          {TRUST_STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="px-4 py-3 rounded-md bg-white border text-center min-w-[160px]">
                <Icon size={20} className="text-gold-500 mx-auto" />
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm text-slate-muted">{s.subtitle}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-page py-8 text-center">
        <h3 className="font-display text-xl">Our Clients</h3>
        <div className="h-1 w-24 bg-gold-500 mx-auto my-3 rounded" />
        <div className="flex gap-3 justify-center flex-wrap mt-4">
          <div className="px-4 py-2 rounded bg-white text-slate-muted">Client A</div>
          <div className="px-4 py-2 rounded bg-white text-slate-muted">Client B</div>
          <div className="px-4 py-2 rounded bg-white text-slate-muted">Client C</div>
          <div className="px-4 py-2 rounded bg-white text-slate-muted">Client D</div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setMsg('Live chat coming soon')}
        className="fixed right-6 bottom-6 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
      >
        <MessageSquare size={16} /> Live Chat with Experts
      </button>
    </div>
  );
}
