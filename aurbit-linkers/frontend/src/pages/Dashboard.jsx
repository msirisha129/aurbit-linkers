import { useEffect, useState } from 'react';
import { Building2, Mail, Phone, Clock, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const statusStyles = {
  new: 'bg-gold-100 text-gold-700',
  contacted: 'bg-navy-100 text-navy-700',
  in_progress: 'bg-amber-100 text-amber-700',
  closed: 'bg-green-100 text-green-700',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/leads/mine')
      .then(({ data }) => setLeads(data.leads || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-cream min-h-[calc(100vh-72px)]">
      <div className="container-page py-12">
        <div className="mb-10">
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="font-display text-3xl text-navy-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <InfoCard icon={Mail} label="Email" value={user?.email} />
          <InfoCard icon={Phone} label="Phone" value={user?.phone || 'Not provided'} />
          <InfoCard icon={Building2} label="Company" value={user?.company || 'Not provided'} />
        </div>

        <div className="bg-white border border-navy-100 rounded-2xl shadow-soft">
          <div className="px-7 py-5 border-b border-navy-100 flex items-center gap-2.5">
            <Inbox size={18} className="text-gold-600" />
            <h2 className="font-display text-lg text-navy-900">Your enquiries</h2>
          </div>

          {loading ? (
            <p className="px-7 py-10 text-sm text-slate-muted text-center">Loading…</p>
          ) : leads.length === 0 ? (
            <div className="px-7 py-12 text-center">
              <p className="text-slate-muted text-sm">
                You haven't submitted any service requests yet. Browse the menu and select a
                service to get started — your enquiries will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-navy-50">
              {leads.map((lead) => (
                <li key={lead._id} className="px-7 py-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-navy-900">
                      {lead.serviceName || 'General enquiry'}
                    </p>
                    {lead.category && (
                      <p className="text-xs text-slate-muted mt-0.5">{lead.category}</p>
                    )}
                    {lead.message && (
                      <p className="text-sm text-slate-muted mt-2">{lead.message}</p>
                    )}
                    <p className="flex items-center gap-1.5 text-xs text-slate-muted mt-2.5">
                      <Clock size={13} />
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                      statusStyles[lead.status] || statusStyles.new
                    }`}
                  >
                    {(lead.status || 'new').replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-navy-100 rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-navy-700" />
      </div>
      <div>
        <p className="text-xs text-slate-muted">{label}</p>
        <p className="text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );
}
