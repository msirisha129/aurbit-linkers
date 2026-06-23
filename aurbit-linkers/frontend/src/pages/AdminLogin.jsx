import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    // Use real auth endpoint
    const res = await login({ email, password });
    if (res.ok) {
      // fetch current user to decide redirect
      try {
        const me = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('aurbit_token')}` } });
        if (me.ok) {
          const body = await me.json();
          const role = body.user?.role;
          if (role === 'admin') navigate('/admin');
          else navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/dashboard');
      }
    } else {
      setError(res.message || 'Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-2">Aurbit Linkers — Admin Login</h2>
        <p className="text-sm text-slate-500 mb-4">Demo admin panel access</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full mt-1 px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full mt-1 px-3 py-2 border rounded" required />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex items-center justify-between">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
            <div className="text-sm text-slate-500">Use demo: admin@aurbitlinkers.com / Admin@123</div>
          </div>
        </form>
      </div>
    </div>
  );
}
