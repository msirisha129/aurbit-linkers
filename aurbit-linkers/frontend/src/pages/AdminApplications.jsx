import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Eye, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ApplicationStatusBadge from '../components/application/ApplicationStatusBadge';

export default function AdminApplications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const statusTabs = ['All', 'Documents Pending', 'Query Raised', 'Under Review', 'Completed', 'Rejected'];

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.applicationStatus === activeTab));
    }
  }, [activeTab, applications]);

  const loadApplications = async () => {
    try {
      const [dscRes, icegateRes] = await Promise.all([
        api.get('/dsc/applications').catch(() => ({ data: { applications: [] } })),
        api.get('/icegate/applications').catch(() => ({ data: { applications: [] } })),
      ]);

      const dscApps = (dscRes.data.applications || []).map((app) => ({
        ...app,
        service: app.service || 'Digital Signature Certificate',
      }));

      const icegateApps = (icegateRes.data.applications || []).map((app) => ({
        ...app,
        service: app.service || 'ICEGATE Registration',
      }));

      const merged = [...dscApps, ...icegateApps];
      merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(merged);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationClick = (application) => {
    navigate('/admin/applications/details', { state: application });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
            <h1 className="text-xl font-bold text-navy-900">Applications Management</h1>
            <p className="text-sm text-slate-500">Review and manage all applications</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#1a2744] text-white'
                    : 'text-navy-900 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-sm text-slate-500">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-navy-900 mb-1">No Applications Found</h2>
            <p className="text-sm text-slate-500">
              {activeTab === 'All' 
                ? 'No applications have been submitted yet.' 
                : `No applications with status "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
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
                        Customer: <strong className="text-navy-900">{app.customerName || 'N/A'}</strong>
                      </span>
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