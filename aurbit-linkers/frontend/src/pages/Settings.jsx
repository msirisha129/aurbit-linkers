import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Settings(){
  const { user, loading: authLoading } = useAuth();
  const [general, setGeneral] = useState({ company: 'Aurbit Linkers', supportEmail: 'support@aurbit.com' });
  const [notifications, setNotifications] = useState({ email: true, leadAlerts: true });
  const [security, setSecurity] = useState({ sessionTimeout: 30, passwordPolicy: 'strong' });
  const [saved, setSaved] = useState(false);

  if (authLoading) return <div className="p-6">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  function save(){
    // local-state only as requested
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  }

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <p className="text-xs text-slate-500 mb-2">Admin Panel &gt; Settings</p>

      {/* Page Header */}
      <h1 className="font-display text-2xl mb-6 pb-4 border-b border-slate-200">Settings</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings Card */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-l-[3px] border-l-[#C9A84C]">
            <h2 className="font-semibold mb-5 flex items-center gap-2">
              <span className="text-lg">⚙️</span> General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Company Name</label>
                <input value={general.company} onChange={e=>setGeneral({...general, company: e.target.value})} className="w-full p-2.5 rounded border border-[#e2e8f0] focus:border-[#1a2744] focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,39,68,0.1)] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Support Email</label>
                <input value={general.supportEmail} onChange={e=>setGeneral({...general, supportEmail: e.target.value})} className="w-full p-2.5 rounded border border-[#e2e8f0] focus:border-[#1a2744] focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,39,68,0.1)] transition-all" />
              </div>
            </div>
          </section>

          {/* Notification Settings Card */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-l-[3px] border-l-[#C9A84C]">
            <h2 className="font-semibold mb-5 flex items-center gap-2">
              <span className="text-lg">🔔</span> Notification Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" checked={notifications.email} onChange={e=>setNotifications({...notifications, email: e.target.checked})} className="sr-only peer" />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-[#1a2744] peer-checked:border-[#1a2744] transition-colors flex items-center justify-center">
                    {notifications.email && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 group-hover:text-navy-900 transition-colors">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" checked={notifications.leadAlerts} onChange={e=>setNotifications({...notifications, leadAlerts: e.target.checked})} className="sr-only peer" />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-[#1a2744] peer-checked:border-[#1a2744] transition-colors flex items-center justify-center">
                    {notifications.leadAlerts && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 group-hover:text-navy-900 transition-colors">Lead Alerts</span>
              </label>
            </div>
          </section>

          {/* Security Settings Card */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-l-[3px] border-l-[#C9A84C]">
            <h2 className="font-semibold mb-5 flex items-center gap-2">
              <span className="text-lg">🔒</span> Security Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Session Timeout (minutes)</label>
                <input type="number" value={security.sessionTimeout} onChange={e=>setSecurity({...security, sessionTimeout: Number(e.target.value)})} className="w-full p-2.5 rounded border border-[#e2e8f0] focus:border-[#1a2744] focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,39,68,0.1)] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Password Policy</label>
                <select value={security.passwordPolicy} onChange={e=>setSecurity({...security, passwordPolicy: e.target.value})} className="w-full p-2.5 rounded border border-[#e2e8f0] focus:border-[#1a2744] focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,39,68,0.1)] transition-all">
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button onClick={save} className="bg-navy-700 text-white px-6 py-2.5 rounded hover:brightness-110 transition-all flex items-center gap-2 w-full sm:w-auto justify-center group">
              <span>Save Changes</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            {saved && <div className="text-sm text-green-600 font-medium">Saved (local)</div>}
          </div>
        </div>

        {/* Settings Tips Card */}
        <aside className="bg-[#1a2744] rounded-2xl p-6 shadow-lg text-white">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> Settings Tips
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">Changes are saved locally only. Integrate with backend when ready.</p>
        </aside>
      </div>
    </div>
  );
}
