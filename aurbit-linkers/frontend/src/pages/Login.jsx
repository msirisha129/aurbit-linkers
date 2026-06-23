import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await login(form);
    setSubmitting(false);
    if (result.ok) {
      navigate(redirectTo, { replace: true });
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
          <h1 className="font-display text-2xl text-navy-900 mb-1.5 text-center">Welcome back</h1>
          <p className="text-sm text-slate-muted text-center mb-7">
            Log in to manage your filings and registrations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label htmlFor="password" className="block text-xs font-medium text-navy-800 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white font-semibold text-sm py-3 hover:bg-navy-800 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-muted mt-6">
          New to Aurbit Linkers?{' '}
          <Link to="/signup" className="text-gold-600 font-semibold hover:text-gold-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
