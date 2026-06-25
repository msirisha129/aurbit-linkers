import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Users(){
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (authLoading) return <div className="p-6">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  useEffect(()=>{
    let mounted = true;
    setLoading(true);
    api.get('/users')
      .then(res=>{
        if (!mounted) return;
        setUsers(res.data.users || []);
      })
      .catch(err=>{
        console.error('Failed to fetch users', err);
        if (!mounted) return;
        setError('Failed to load users');
      })
      .finally(()=> mounted && setLoading(false));
    return ()=>{ mounted = false; };
  }, []);

  const filtered = users.filter(u => (u.name+u.email+u.role).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl mb-6">Users</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 bg-white rounded-2xl p-4 shadow-soft">
          <div className="text-xs text-slate-muted">Total Users</div>
          <div className="text-3xl font-semibold mt-2">{users.length}</div>
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl p-4 shadow-soft flex items-center gap-3">
          <Search size={18} className="text-slate-500" />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users by name, email or role" className="flex-1 outline-none text-sm" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-soft overflow-x-auto p-4">
        {loading ? (
          <div className="p-6 text-center text-slate-muted">Loading users…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-slate-muted">No users found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-navy-50 text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u=> (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusTag({ status }){
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-slate-100 text-slate-700'
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}
