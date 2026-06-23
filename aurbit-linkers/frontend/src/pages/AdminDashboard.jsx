import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeads() {
      setPageLoading(true);
        try {
        const res = await api.get('/leads');
        const leads = res.data.leads || [];
        const total = leads.length;
        // normalize statuses to lowercase to avoid missing counts due to casing
        const byStatus = leads.reduce((acc, l) => {
          const s = (l.status || 'new').toString().toLowerCase();
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {});
        // Map to demo summary: Total, New, Contacted, Closed/Completed
        const closedCount = (byStatus['completed'] || 0) + (byStatus['closed'] || 0);
        setCounts({
          total,
          new: byStatus['new'] || 0,
          contacted: byStatus['contacted'] || 0,
          closed: closedCount,
          // keep raw leads for recent list
          leads,
        });
      } catch (err) {
        setError('Failed to load leads');
      } finally {
        setPageLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const { user, loading } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  if (pageLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="container-page py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <aside className="col-span-1 bg-white rounded-lg p-4 shadow-soft">
          <h2 className="font-semibold mb-4">Admin Panel</h2>
          <nav className="space-y-2 text-sm">
            <Link to="/admin" className="block px-3 py-2 rounded hover:bg-navy-50">Dashboard</Link>
            <Link to="/admin/leads" className="block px-3 py-2 rounded hover:bg-navy-50">Leads</Link>
            <Link to="#" className="block px-3 py-2 rounded hover:bg-navy-50">Users</Link>
            <Link to="#" className="block px-3 py-2 rounded hover:bg-navy-50">Settings</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-3 py-2 rounded border mt-3">Logout</button>
          </nav>
        </aside>

        <main className="col-span-5">
          <h1 className="font-display text-2xl mb-6">Dashboard</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-soft text-center">Total Leads<br /><div className="text-2xl font-semibold">{counts.total}</div></div>
            <div className="bg-white p-4 rounded-lg shadow-soft text-center">New Leads<br /><div className="text-2xl font-semibold">{counts.new}</div></div>
            <div className="bg-white p-4 rounded-lg shadow-soft text-center">Contacted<br /><div className="text-2xl font-semibold">{counts.contacted}</div></div>
            <div className="bg-white p-4 rounded-lg shadow-soft text-center">Closed<br /><div className="text-2xl font-semibold">{counts.closed}</div></div>
          </div>
          {/* Recent Leads */}
          <div className="bg-white rounded-lg p-4 shadow-soft">
            <h2 className="font-semibold mb-3">Recent Leads</h2>
            <div className="space-y-3">
              {(counts.leads || []).slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,6).map((l) => (
                <div key={l._id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">{l.name || (l.source==='icegate-location-selector' ? 'ICEGATE Request' : '-')}</div>
                    <div className="text-sm text-slate-muted">{l.email || '-'} • {l.phone || '-'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-muted">{new Date(l.createdAt).toLocaleString()}</div>
                    {l.source === 'icegate-location-selector' && <div className="mt-1 text-xs inline-block px-2 py-0.5 bg-gray-100 rounded text-gray-700">Customs Request</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
