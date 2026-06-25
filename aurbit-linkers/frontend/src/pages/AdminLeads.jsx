import React, { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../lib/api';
import { getIcon } from '../lib/icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function isAdmin() {
  return !!localStorage.getItem('aurbit_admin');
}

function formatDate(d) {
  return new Date(d).toLocaleString();
}

function formatDateTwoLine(d) {
  if (!d) return '';
  const dt = new Date(d);
  const day = dt.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  const time = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day}\n${time}`;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchLeads() {
      setPageLoading(true);
      try {
          const res = await api.get('/leads');
          console.log('AdminLeads - GET /api/leads response:', res && res.data ? res.data : res);
          setLeads(res.data.leads || []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setPageLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // toast state for notifications (moved to top-level to preserve hook order)
  const [toast, setToast] = useState(null);
  
  const filteredLeads = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    function normalizeStatus(s) {
      if (!s) return 'new';
      const t = String(s).toLowerCase();
      if (t === 'in_progress' || t === 'in progress' || t === 'in-progress') return 'in-progress';
      if (t === 'completed') return 'completed';
      if (t === 'rejected') return 'rejected';
      if (t === 'contacted') return 'contacted';
      if (t === 'new') return 'new';
      return t;
    }

    const filtered = leads.filter((lead) => {
      const matchesSearch =
        (lead.name || '').toLowerCase().includes(searchTerm) ||
        (lead.email || '').toLowerCase().includes(searchTerm) ||
        (lead.phone || '').includes(searchTerm) ||
        (lead.serviceName || '').toLowerCase().includes(searchTerm);

      const leadStatus = normalizeStatus(lead.status);
      const matchesStatus = statusFilter === 'all' || leadStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    console.log('Status Filter:', statusFilter);
    console.log('Filtered Leads:', filtered);
    return filtered;
  }, [leads, query, statusFilter]);
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;


  async function refresh() {
    setPageLoading(true);
    try {
      const res = await api.get('/leads');
      setLeads(res.data.leads || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally { setPageLoading(false); }
  }

  async function updateStatus(id, status) {
    try {
      console.log('Updating lead status', { id, status });
      // use PATCH endpoint to persist and return updated lead
      const res = await api.patch(`/leads/${id}`, { status });
      console.log('Update response', res.data);
      // reflect immediate change locally
      setLeads((prev) => prev.map((p) => (p._id === id ? res.data.lead : p)));
      // update selected if it's the same
      if (selected && selected._id === id) setSelected(res.data.lead);
      // show toast
      setToast({ type: 'success', message: 'Lead status updated successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Update status error', err);
      const msg = getErrorMessage(err);
      setError(msg);
      setToast({ type: 'error', message: msg });
      setTimeout(() => setToast(null), 4000);
    }
  }

  async function handleSaveNotes() {
    if (!selected) return;
    const id = selected._id;
    const notes = selected.notes || '';
    console.log('handleSaveNotes - before API call', { id, notes });
    setPageLoading(true);
    try {
      // use PATCH to update notes field on the lead
      const res = await api.patch(`/leads/${id}`, { notes });
      console.log('handleSaveNotes - API response:', res && res.data ? res.data : res);
      // use returned lead (res.data.lead) when available, otherwise refresh
      const updatedLead = (res && res.data && res.data.lead) ? res.data.lead : (await api.get(`/leads/${id}`)).data.lead;
      console.log('handleSaveNotes - updated lead:', updatedLead);
      setSelected(updatedLead);
      // update in list
      setLeads(prev => prev.map(p => p._id === id ? updatedLead : p));
      setToast({ type: 'success', message: 'Notes saved' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('handleSaveNotes - error', err);
      const msg = getErrorMessage(err);
      setError(msg);
      setToast({ type: 'error', message: msg });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setPageLoading(false);
      console.log('handleSaveNotes - after API call complete');
    }
  }

  

  function statusBadge(status) {
    const s = (status || 'new').toString().toLowerCase();
    const map = {
      new: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      contacted: 'bg-sky-100 text-sky-800 border-sky-200',
      'in progress': 'bg-orange-100 text-orange-800 border-orange-200',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-emerald-700 text-white border-emerald-800',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const cls = map[s] || 'bg-gray-100 text-gray-800 border-gray-200';
    return <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm min-w-[80px] border ${cls}`}>{String(status)}</span>;
  }

  function exportCSV(rows) {
    if (!rows || rows.length === 0) return;
    const headers = ['Name','Email','Phone','Service','Status','Source','CreatedAt'];
    const csv = [headers.join(',')];
    rows.forEach(r => {
      const line = [r.name, r.email, r.phone, (r.serviceName||''), (r.status||''), (r.source||''), (r.createdAt||'')]
        .map(v => '"' + String(v || '').replace(/"/g,'""') + '"').join(',');
      csv.push(line);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (pageLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="container-page py-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {(() => {
          const total = leads.length;
          const counts = {
            new: leads.filter(l => { const s = (l.status||'new').toString().toLowerCase(); return s==='new' || s==='new'; }).length,
            'in-progress': leads.filter(l => { const s = (l.status||'').toString().toLowerCase(); return s==='in_progress' || s==='in-progress' || s==='in progress'; }).length,
            completed: leads.filter(l => (l.status||'').toString().toLowerCase()==='completed').length,
            rejected: leads.filter(l => (l.status||'').toString().toLowerCase()==='rejected').length,
            contacted: leads.filter(l => (l.status||'').toString().toLowerCase()==='contacted').length,
          };
          const cards = [
            { key: 'total', label: 'Total Leads', value: total, icon: 'sparkles', color: 'border-sky-500' },
            { key: 'new', label: 'New Leads', value: counts.new, icon: 'file-badge-2', color: 'border-emerald-500' },
            { key: 'in-progress', label: 'In Progress', value: counts['in-progress'], icon: 'clipboard-check', color: 'border-orange-400' },
            { key: 'completed', label: 'Completed', value: counts.completed, icon: 'shield-check', color: 'border-emerald-800' },
            { key: 'rejected', label: 'Rejected', value: counts.rejected, icon: 'banknote', color: 'border-red-500' },
            { key: 'contacted', label: 'Contacted', value: counts.contacted, icon: 'globe', color: 'border-sky-300' },
          ];
          return cards.map(c => {
            const Icon = getIcon(c.icon);
            return (
              <div key={c.key} className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 ${c.color}`}>
                <div className="p-3 rounded-md bg-gray-50">
                  <Icon className="w-6 h-6 text-slate-700" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-500">{c.label}</div>
                  <div className="font-semibold text-lg">{c.value}</div>
                </div>
              </div>
            );
          });
        })()}
      </div>
      {/* Recent leads list */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-3">Recent Leads</h2>
        {leads && leads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {leads.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,10).map(l => (
              <button type="button" key={l._id} onClick={async()=>{ try{ const res=await api.get(`/leads/${l._id}`); setSelected(res.data.lead); }catch(err){ setError(getErrorMessage(err)); } }} className="text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-150 flex items-stretch gap-3 border border-transparent hover:border-slate-200 cursor-pointer focus:outline-none">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-lg font-semibold text-slate-800">{(l.name || '-').charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{l.name || '-'}</div>
                  <div className="text-sm text-slate-500 truncate">{l.serviceName || l.service || 'ICEGATE Registration'}</div>
                </div>
                <div className="flex flex-col items-end justify-between w-36 ml-2">
                  <div className="w-full flex justify-end">
                    <div>{statusBadge(l.status || 'New')}</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 w-full text-right truncate">{formatDate(l.createdAt)}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 p-6 bg-white rounded-lg">
            <svg width="80" height="64" viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="64" rx="8" fill="#F1F5F9"/><path d="M20 44h40" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/><path d="M20 34h40" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/><circle cx="28" cy="22" r="8" fill="#E2E8F0"/></svg>
            <div>
              <div className="font-medium">No recent leads</div>
              <div className="text-sm text-slate-500">When leads arrive they'll show up here.</div>
            </div>
          </div>
        )}
      </div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-md ${toast.type==='success'?'bg-emerald-600 text-white':'bg-red-600 text-white'}`}>
          {toast.message}
        </div>
      )}
      <h1 className="font-display text-2xl mb-4">Leads</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, phone, service" className="px-3 py-2 border rounded-md flex-1" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-md">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex gap-2">
          <button onClick={refresh} className="px-3 py-2 rounded-md border bg-white">Refresh</button>
          <button onClick={() => exportCSV(filteredLeads)} className="px-3 py-2 rounded-md border bg-white">Export CSV</button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="p-6">No Leads Found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-soft">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l, idx) => (
                <tr key={l._id} className={`border-t transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-gray-100`}>
                  <td className="px-4 py-4 align-top">
                    <div>
                      <div className="font-medium">{l.name || '-'}</div>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">{l.email || '-'}</td>
                  <td className="px-4 py-4 align-top">{l.phone || '-'}</td>
                  <td className="px-4 py-4 align-top">{(l.serviceName || l.service || 'ICEGATE Registration')}</td>
                  <td className="px-4 py-4 align-top">{statusBadge(l.status || 'New')}</td>
                  <td className="px-4 py-4 align-top whitespace-pre-line">{formatDateTwoLine(l.createdAt)}</td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const ViewIcon = getIcon('file-badge-2');
                        return (
                          <button title="View" onClick={async()=>{ try{ const res=await api.get(`/leads/${l._id}`); console.log('AdminLeads - GET /api/leads/:id response:', res && res.data ? res.data : res); setSelected(res.data.lead); console.log('AdminLeads - selected lead customsLocations:', res.data.lead.customsLocations); }catch(err){ setError(getErrorMessage(err)); } }} className="p-2 rounded-md border bg-white hover:bg-slate-50">
                            <ViewIcon className="w-4 h-4 text-slate-700" />
                          </button>
                        );
                      })()}
                      {(() => {
                        const DelIcon = getIcon('banknote');
                        return (
                          <button title="Delete" onClick={async()=>{
                            if(!confirm('Delete this application? This action cannot be undone.')) return;
                            try{
                              setPageLoading(true);
                              await api.delete(`/leads/${l._id}`);
                              setLeads(prev => prev.filter(p=>p._id !== l._id));
                              setToast({ type: 'success', message: 'Application deleted' });
                              setTimeout(()=>setToast(null),3000);
                            } catch(err){
                              setError(getErrorMessage(err));
                              setToast({ type: 'error', message: getErrorMessage(err) });
                              setTimeout(()=>setToast(null),4000);
                            } finally { setPageLoading(false); }
                          }} className="p-2 rounded-md border bg-white hover:bg-red-50 text-red-600">
                            <DelIcon className="w-4 h-4" />
                          </button>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-lg">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg">Lead details</h3>
              <div className="space-x-2">
                <button onClick={()=>{ updateStatus(selected._id, 'contacted'); setSelected({ ...selected, status: 'contacted' }); }} className="px-3 py-1 rounded-md bg-sky-600 text-white">Mark Contacted</button>
                <button onClick={()=>{ updateStatus(selected._id, 'in_progress'); setSelected({ ...selected, status: 'in_progress' }); }} className="px-3 py-1 rounded-md bg-orange-500 text-white">Mark In Progress</button>
                <button onClick={()=>{ updateStatus(selected._id, 'completed'); setSelected({ ...selected, status: 'completed' }); }} className="px-3 py-1 rounded-md bg-emerald-600 text-white">Mark Completed</button>
                <button onClick={()=>{ updateStatus(selected._id, 'rejected'); setSelected({ ...selected, status: 'rejected' }); }} className="px-3 py-1 rounded-md bg-red-600 text-white">Mark Rejected</button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm text-slate-600">Name</div>
                  <div className="font-medium">{selected.name}</div>
                  <div className="mt-3 text-sm text-slate-600">Email</div>
                  <div className="font-medium">{selected.email}</div>
                  <div className="mt-3 text-sm text-slate-600">Phone</div>
                  <div className="font-medium">{selected.phone}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm text-slate-600">Service</div>
                  <div className="font-medium">{selected.serviceName || selected.service || 'ICEGATE Registration'}</div>
                  <div className="mt-3 text-sm text-slate-600">Source</div>
                  <div className="font-medium">{selected.source}</div>

                  <div className="mt-4">
                    <div className="text-sm text-slate-600 mb-2">Custom Locations</div>
                    <div className="border rounded-md p-4 bg-slate-50">
                      {selected.customsLocations && selected.customsLocations.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {selected.customsLocations.map((c, idx) => (
                            <li key={idx} className="text-sm">{typeof c === 'string' ? c : (c.name || c.code || JSON.stringify(c))}{typeof c === 'object' && c.code ? ` (${c.code})` : ''}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-slate-muted">None</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-slate-600">Internal Notes</label>
                <textarea value={selected.notes || ''} onChange={(e)=>setSelected({...selected, notes: e.target.value})} rows={4} className="w-full mt-2 border rounded p-2"></textarea>
                <div className="mt-3 flex gap-2">
                      <button onClick={handleSaveNotes} className="px-3 py-2 rounded-md bg-blue-600 text-white">Save Notes</button>
                      <button onClick={async()=>{
                        if(!confirm('Delete this application?')) return;
                        try{ setPageLoading(true); await api.delete(`/leads/${selected._id}`); setLeads(prev => prev.filter(p=>p._id !== selected._id)); setSelected(null); setToast({ type: 'success', message: 'Application deleted' }); setTimeout(()=>setToast(null),3000);}catch(err){ setError(getErrorMessage(err)); setToast({ type: 'error', message: getErrorMessage(err) }); setTimeout(()=>setToast(null),4000);} finally{ setPageLoading(false); }
                      }} className="px-3 py-2 rounded-md border text-red-600">Delete</button>
                      <button onClick={()=>setSelected(null)} className="px-3 py-2 rounded-md border">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
