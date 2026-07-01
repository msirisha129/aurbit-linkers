import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Eye, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ApplicationStatusBadge from '../components/application/ApplicationStatusBadge';

export default function MyApplications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const [dscRes, icegateRes] = await Promise.all([
          api.get('/dsc/applications/mine').catch(() => ({ data: { applications: [] } })),
          api.get('/icegate/applications/mine').catch(() => ({ data: { applications: [] } })),
        ]);

        if (!cancelled) {
          const dscApps = (dscRes.data.applications || []).map((app) => ({
            ...app,
            service: app.service || 'Digital Signature Certificate',
          }));

          const icegateApps = (icegateRes.data.applications || []).map((app) => ({
            ...app,
            service: app.service || 'ICEGATE Registration',
          }));

          const merged = [...dscApps, ...icegateApps];

          console.log("========== MY APPLICATIONS ==========");
          console.log("DSC count:", dscApps.length, "ICEGATE count:", icegateApps.length);
          console.log("DSC Applications:", dscApps.map(a => ({ _id: a._id, applicationId: a.applicationId, orderId: a.orderId, service: a.service })));
          console.log("ICEGATE Applications:", icegateApps.map(a => ({ _id: a._id, applicationId: a.applicationId, orderId: a.orderId, service: a.service })));

          merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setApplications(merged);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplicationClick = (application) => {
    navigate(`/service/application/details?id=${application._id || application.applicationId || application.orderId}`, { state: application });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#1a2744] flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900">My Applications</h1>
            <p className="text-sm text-slate-500">View all your applications</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-sm text-slate-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-navy-900 mb-1">No Applications Yet</h2>
            <p className="text-sm text-slate-500 mb-4">
              You haven't submitted any applications yet. Browse our services to get started.
            </p>
            <button
              onClick={() => navigate('/service/dsc')}
              className="px-6 py-3 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#15203a] transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id || app.applicationId}
                onClick={() => handleApplicationClick(app)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-navy-900 truncate">
                        {app.service}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                      <span>
                        Application: <strong className="text-navy-900">{app.applicationId}</strong>
                      </span>
                      {app.orderId && (
                        <span>
                          Order: <strong className="text-navy-900">{app.orderId}</strong>
                        </span>
                      )}
                      <span>
                        Amount: <strong className="text-navy-900">₹{Number(app.amount).toLocaleString('en-IN')}</strong>
                      </span>
                      {app.createdAt && (
                        <span>
                          Date:{' '}
                          <strong className="text-navy-900">
                            {new Date(app.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ApplicationStatusBadge status={app.applicationStatus || 'Documents Pending'} />
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle size={12} />
                      {app.paymentStatus || 'Paid'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}