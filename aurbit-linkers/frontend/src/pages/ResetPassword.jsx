import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../lib/api';

export default function ResetPassword(){
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    setMessage('');
    if(password.length < 8){ setError('Password must be at least 8 characters'); return; }
    if(password !== confirm){ setError('Passwords do not match'); return; }
    setSubmitting(true);
    try {
      const resp = await api.post('/auth/reset-password', { token, password });
      const returnedUser = resp?.data?.user;
      setMessage(resp?.data?.message || 'Password reset successful. You can now log in.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to reset password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-cream px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8"><Logo/></div>
        <div className="bg-white border border-navy-100 rounded-2xl shadow-soft p-8">
          <h1 className="font-display text-2xl text-navy-900 mb-1.5 text-center">Reset password</h1>
          <p className="text-sm text-slate-muted text-center mb-6">Set a new password for your account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-navy-800 mb-1">New password</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm" placeholder="At least 8 characters" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-800 mb-1">Confirm password</label>
              <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} type="password" className="w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm" placeholder="Repeat password" />
            </div>
            {message && <div className="text-sm text-emerald-700">{message}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white py-3">
              {submitting && <Loader2 size={16} className="animate-spin"/>}
              {submitting? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
