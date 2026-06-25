import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

/**
 * Premium split-screen authentication page.
 *
 * Used by BOTH admins and users. After a successful login the role-based
 * redirect happens automatically:
 *   admin -> /admin/dashboard
 *   user  -> /dashboard
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Persist "remember me" preference on the email field for convenience.
  useEffect(() => {
    const savedEmail = localStorage.getItem('aurbit_login_email');
    if (savedEmail) {
      setForm((f) => ({ ...f, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const redirectTo = location.state?.from || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('aurbit_login_email', form.email);
    } else {
      localStorage.removeItem('aurbit_login_email');
    }

    setSubmitting(true);
    try {
      const result = await login(form);
      setSubmitting(false);

      if (result?.ok) {
        const role = result.user?.role;

if (role === 'admin') {
  navigate('/admin', { replace: true });
} else {
  navigate('/dashboard', { replace: true });
}
      } else {
        setError(result?.message || 'Invalid credentials');
      }
    } catch (err) {
      setSubmitting(false);
      setError(err?.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* ============== LEFT PANEL (branding) ============== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-navy-500/20 blur-3xl" />

        <div className="relative z-10">
          <Logo variant="light" className="mb-14" />

          <h1 className="font-display text-4xl xl:text-5xl font-bold tracking-tight leading-tight max-w-lg">
            Aurbit Linkers Workspace
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-md leading-relaxed">
            Manage registrations, compliance services, filings and business operations
            from one secure platform.
          </p>

          {/* Feature cards */}
          <div className="mt-12 grid grid-cols-1 gap-4 max-w-md">
            <FeatureCard
              label="Registrations"
              description="Company, ICEGATE, MSME & tax registrations end-to-end"
            />
            <FeatureCard
              label="Compliance Services"
              description="Filings, returns and statutory compliance in one place"
            />
            <FeatureCard
              label="Business Dashboard"
              description="Track every request, document and renewal securely"
            />
          </div>
        </div>

        {/* Secure login badge */}
        <div className="relative z-10 flex items-center gap-2 text-white/70 text-sm">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Secure login · 256-bit SSL encryption</span>
        </div>
      </div>

      {/* ============== RIGHT PANEL (form) ============== */}
      <div className="w-full lg:w-1/2 bg-cream flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile-only branding (left panel is hidden on mobile) */}
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          {/* Desktop logo on right panel */}
          <div className="hidden lg:block mb-10">
            <Logo />
          </div>

          <h2 className="font-display text-3xl font-bold text-navy-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-muted mt-2">
            Sign in to continue to your Aurbit Linkers account.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-800 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-navy-100 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-navy-100 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-muted hover:text-navy-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-navy-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-navy-200 text-navy-900 focus:ring-gold-400"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-gold-600 hover:text-gold-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center bg-navy-900 hover:bg-navy-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-slate-muted pt-2">
              New to Aurbit Linkers?{' '}
              <Link to="/signup" className="text-gold-600 font-semibold hover:text-gold-700">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ label, description }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/10 transition">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{label}</h3>
          <p className="text-xs text-white/70 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
