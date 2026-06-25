import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Users, BarChart2 } from 'lucide-react';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Live clock state
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeString = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login({ email, password });

      // login() in AuthContext is expected to return an object like { success, token, ... }
      // Fall back to localStorage if it didn't return a token directly.
      const token =
        (result && (result.token || result.accessToken)) ||
        localStorage.getItem('aurbit_token');

      if (!token) {
        throw new Error('No authentication token received.');
      }

      // Fetch the current user using the Bearer token
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user profile.');
      }

      const data = await res.json();
      const user = data.user || data;

      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* ============== LEFT PANEL ============== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex-col justify-between p-12">
        {/* Branding */}
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Control Center</h1>
              <p className="text-sm text-slate-300">Manage your platform with confidence</p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 max-w-md">
            {/* Lead Management */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Lead Management</h3>
                  <p className="text-xs text-slate-300">Track, qualify and convert your leads</p>
                </div>
              </div>
            </div>

            {/* User Administration */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">User Administration</h3>
                  <p className="text-xs text-slate-300">Manage roles, permissions and access</p>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Analytics Dashboard</h3>
                  <p className="text-xs text-slate-300">Real-time insights and performance metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Clock */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm max-w-md">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Current Time</p>
          <p className="text-2xl font-semibold text-white tabular-nums">{timeString}</p>
          <p className="text-sm text-slate-300 mt-1">{dateString}</p>
        </div>

        {/* Secure login badge */}
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure login · 256-bit SSL encryption</span>
        </div>
      </div>

      {/* ============== RIGHT PANEL ============== */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8">
          {/* Mobile-only branding (since left panel is hidden on mobile) */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Admin Control Center</h1>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to continue to the Admin Control Center
          </p>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mt-6 mb-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aurbitlinkers.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-slate-900 hover:text-slate-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto sm:flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
              <span className="text-xs text-slate-500 sm:text-right">
                Demo: <span className="font-mono">admin@aurbitlinkers.com</span>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
