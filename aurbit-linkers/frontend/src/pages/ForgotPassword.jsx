import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../lib/api';

export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    setMessage('');
    if(!email) { setError('Please enter your email'); return; }
    setSubmitting(true);
    try{
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/forgot-password`;
      console.log('ForgotPassword: calling', url, 'payload', { email });
      const resp = await api.post('/auth/forgot-password', { email });
      console.log('ForgotPassword: response status', resp.status, 'data', resp.data);
      setMessage('If an account exists, a password reset link has been sent.');
    } catch(err){
      console.error('Forgot Password Error:', err);
      console.error('Response:', err?.response?.data || err?.response);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send reset email'
      );
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-cream px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8"><Logo/></div>
        <div className="bg-white border border-navy-100 rounded-2xl shadow-soft p-8">
          <h1 className="font-display text-2xl text-navy-900 mb-1.5 text-center">Forgot password</h1>
          <p className="text-sm text-slate-muted text-center mb-6">Enter your account email to receive a reset link.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-navy-800 mb-1">Email address</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm" placeholder="you@company.com" />
            </div>
            {message && <div className="text-sm text-emerald-700">{message}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white py-3">
              {submitting && <Loader2 size={16} className="animate-spin"/>}
              {submitting? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}