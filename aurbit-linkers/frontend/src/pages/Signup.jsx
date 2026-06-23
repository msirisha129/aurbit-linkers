import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await signup(form);
    setSubmitting(false);
    if (result.ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-cream px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="bg-white border border-navy-100 rounded-2xl shadow-soft p-8">
          <h1 className="font-display text-2xl text-navy-900 mb-1.5 text-center">Create your account</h1>
          <p className="text-sm text-slate-muted text-center mb-7">
            No credit card required to explore.
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
              <label htmlFor="company" className="block text-xs font-medium text-navy-800 mb-1">
                Company <span className="text-slate-muted">(optional)</span>
              </label>
              <input
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                placeholder="Company name"
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
                Phone <span className="text-slate-muted">(optional)</span>
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-navy-800 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold-500 text-navy-900 font-semibold text-sm py-3 hover:bg-gold-400 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-600 font-semibold hover:text-gold-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
