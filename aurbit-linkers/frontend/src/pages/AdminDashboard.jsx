import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Users, Inbox, CheckCircle, Clock, XCircle, PhoneCall, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchLeads() {
      setPageLoading(true);
        try {
        const res = await api.get('/leads');
        const leads = res.data.leads || [];
        // normalize statuses to canonical keys
        const normalized = leads.map(l => ({ ...l, status: ((l.status||'new')+'').toLowerCase().replace(/\s+/g,'_') }));
        const total = normalized.length;
        const byStatus = normalized.reduce((acc, l) => { acc[l.status] = (acc[l.status]||0)+1; return acc; }, {});
        const byService = normalized.reduce((acc, l) => { const k = l.serviceName || l.serviceSlug || 'Other'; acc[k] = (acc[k]||0)+1; return acc; }, {});
        setCounts({
          total,
          new: byStatus['new'] || 0,
          contacted: byStatus['contacted'] || 0,
          in_progress: byStatus['in_progress'] || 0,
          completed: byStatus['completed'] || 0,
          rejected: byStatus['rejected'] || 0,
          leads: normalized,
          byService,
          byStatus,
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
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  if (pageLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="container-page py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <aside className="col-span-1 bg-white rounded-lg p-4 shadow-soft">
          <h2 className="font-semibold mb-4">Admin Panel</h2>
          <nav className="space-y-2 text-sm">
            <Link to="/admin" className="block px-3 py-2 rounded hover:bg-navy-50">Dashboard</Link>
            <Link to="/admin/applications" className="block px-3 py-2 rounded hover:bg-navy-50">Applications</Link>
            <Link to="/admin/leads" className="block px-3 py-2 rounded hover:bg-navy-50">Leads</Link>
            <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-navy-50">Users</Link>
            <Link to="/admin/settings" className="block px-3 py-2 rounded hover:bg-navy-50">Settings</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-3 py-2 rounded border mt-3">Logout</button>
          </nav>
        </aside>

        <main className="col-span-5">
          <h1 className="font-display text-2xl mb-6">Dashboard</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <StatCard label="Total Applications" value={counts.total} color="blue" Icon={Users} />
            <StatCard label="New" value={counts.new} color="green" Icon={Inbox} />
            <StatCard label="In Progress" value={counts.in_progress} color="orange" Icon={Clock} />
            <StatCard label="Completed" value={counts.completed} color="emerald" Icon={CheckCircle} />
            <StatCard label="Rejected" value={counts.rejected} color="red" Icon={XCircle} />
            <StatCard label="Contacted" value={counts.contacted} color="cyan" Icon={PhoneCall} />
          </div>
          {/* Recent Leads */}
          <div className="bg-white rounded-lg p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold mb-3">Recent Applications</h2>
              <button onClick={() => window.location.reload()} className="text-sm text-navy-600">Refresh</button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
              {(counts.leads || []).slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,10).map((l) => (
                <div key={l._id} onClick={() => setSelected(l)} className="cursor-pointer bg-white border rounded-lg p-4 flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-semibold text-navy-900">{(l.name||'-').charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-navy-900">{l.name || (l.source==='icegate-location-selector' ? 'ICEGATE Request' : '-')}</div>
                        <div className="text-sm text-slate-muted">{l.serviceName || l.serviceSlug || '—'}</div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={l.status} />
                        <div className="text-xs text-slate-muted mt-2">{new Date(l.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40">
              <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">Application details</h3>
                  <button onClick={() => setSelected(null)} className="text-sm text-navy-600">Close</button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 text-sm text-slate-600">Name</div>
                    <div className="font-medium">{selected.name}</div>
                    <div className="mt-3 text-sm text-slate-600">Email</div>
                    <div className="font-medium">{selected.email}</div>
                    <div className="mt-3 text-sm text-slate-600">Phone</div>
                    <div className="font-medium">{selected.phone || '-'}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-slate-600">Service</div>
                    <div className="font-medium">{selected.serviceName || selected.serviceSlug || '-'}</div>
                    <div className="mt-3 text-sm text-slate-600">Source</div>
                    <div className="font-medium">{selected.source}</div>
                    <div className="mt-3 text-sm text-slate-600">Status</div>
                    <div className="font-medium">{selected.status}</div>
                  </div>
                </div>
                {selected.customsLocations && selected.customsLocations.length>0 && (
                  <div className="mt-4">
                    <div className="text-sm text-slate-600">Custom Locations</div>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {selected.customsLocations.map((c,idx)=>(<li key={idx}>{c.name || c.code || JSON.stringify(c)}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value=0, color='blue', Icon }){
  const gradients = {
    blue: 'from-blue-500 to-blue-300',
    green: 'from-lime-400 to-lime-200',
    orange: 'from-amber-400 to-amber-200',
    emerald: 'from-emerald-500 to-emerald-300',
    red: 'from-rose-500 to-rose-300',
    cyan: 'from-cyan-400 to-cyan-200'
  };
  const g = gradients[color] || gradients.blue;
  return (
    <div className={`rounded-2xl overflow-hidden bg-white shadow-soft transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className={`p-4 flex items-center gap-4`}>
        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center text-white`}>
          {Icon ? <Icon size={20} /> : null}
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-slate-muted">{label}</div>
          <div className="text-2xl font-semibold text-navy-900 mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status='' }){
  const s = (status||'new')+'';
  const map = {
    completed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-amber-100 text-amber-700',
    contacted: 'bg-sky-100 text-sky-700',
    rejected: 'bg-rose-100 text-rose-700',
    new: 'bg-emerald-50 text-emerald-700'
  };
  const cls = map[s] || map.new;
  return <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${cls}`}>{(s||'').replace('_',' ')}</span>;
}
