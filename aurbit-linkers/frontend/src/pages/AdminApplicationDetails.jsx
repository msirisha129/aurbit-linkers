import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ApplicationHeader from '../components/application/ApplicationHeader';
import ApplicationSummaryCard from '../components/application/ApplicationSummaryCard';
import ApplicationTimeline from '../components/application/ApplicationTimeline';
import AdminDocumentReview from '../components/application/AdminDocumentReview';
import ApplicationStatusBadge from '../components/application/ApplicationStatusBadge';

export default function AdminApplicationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const application = location.state || {};
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [documents, setDocuments] = useState(application.documents || []);
  const [timeline, setTimeline] = useState(application.timeline || []);
  const [localDocuments, setLocalDocuments] = useState(application.documents || []);

  useEffect(() => {
    if (!application._id && application.orderId) {
      fetchApplicationDetails();
    }
  }, []);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const endpoint = application.service?.toLowerCase().includes('dsc')
        ? `/dsc/applications/${application._id || application.orderId}`
        : `/icegate/applications/${application._id || application.orderId}`;

      const { data } = await api.get(endpoint);
      if (data.application) {
        setDocuments(data.application.documents || []);
        setLocalDocuments(data.application.documents || []);
        setTimeline(data.application.timeline || []);
      }
    } catch (err) {
      console.error('Failed to fetch application details:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTimelineEvent = (event, note) => {
    const newEvent = {
      event,
      date: new Date(),
      note,
    };
    setTimeline([...timeline, newEvent]);
    return [...timeline, newEvent];
  };

  const updateStatus = async (newStatus, eventName, note) => {
    setActionLoading(true);
    try {
      const updatedTimeline = addTimelineEvent(eventName, note);
      const endpoint = application.service?.toLowerCase().includes('dsc')
        ? `/dsc/applications/${application._id}/status`
        : `/icegate/applications/${application._id}/status`;

      await api.put(endpoint, {
        applicationStatus: newStatus,
        timeline: updatedTimeline,
        documents,
      });

      console.log('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status:', err);
      setTimeline(timeline);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveDocuments = () => {
    updateStatus('Under Review', 'Documents Approved', 'All documents have been approved by admin.');
  };

  const handleRaiseQuery = () => {
    const queryNote = prompt('Enter query details:');
    if (queryNote) {
      updateStatus('Query Raised', 'Query Raised', queryNote);
    }
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      updateStatus('Rejected', 'Application Rejected', reason);
    }
  };

  const handleMarkUnderReview = () => {
    updateStatus('Under Review', 'Under Review', 'Application is now under review.');
  };

  const handleMarkCompleted = () => {
    updateStatus('Completed', 'Completed', 'Application has been completed successfully.');
  };

  const getRequiredDocuments = (service) => {
    const serviceLower = (service || '').toLowerCase();
    if (serviceLower.includes('dsc')) {
      return ['PAN Card', 'Aadhaar Card', 'Passport Size Photo', 'Address Proof'];
    }
    if (serviceLower.includes('icegate')) {
      return ['PAN Card', 'Incorporation Certificate', 'Address Proof', 'DSC Certificate'];
    }
    return ['PAN Card', 'Address Proof', 'ID Proof'];
  };

  if (!application.orderId && !application._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <p className="text-slate-600 mb-4">No application information found.</p>
          <button
            onClick={() => navigate('/admin/applications')}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/applications')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </button>

        {/* Application Header */}
        <div className="mb-6">
          <ApplicationHeader
            serviceName={application.service || 'Application'}
            applicationId={application.applicationId || application.orderId}
            applicationStatus={application.applicationStatus || 'Documents Pending'}
            paymentStatus={application.paymentStatus || 'Paid'}
          />
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Customer Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm font-semibold text-navy-900">{application.customerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-semibold text-navy-900">{application.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="text-sm font-semibold text-navy-900">{application.mobile || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Order ID</p>
              <p className="text-sm font-semibold text-navy-900 font-mono">{application.orderId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="mb-6">
          <ApplicationSummaryCard
            service={application.service}
            amount={application.amount}
            customer={application.customerName}
            paymentDate={application.createdAt}
            orderId={application.orderId}
          />
        </div>

        {/* Uploaded Documents */}
        <AdminDocumentReview
          service={application.service}
          requiredDocuments={getRequiredDocuments(application.service)}
          documents={localDocuments}
          onView={(docName, doc) => {
            console.log('View document:', docName, doc);
            if (doc?.url) {
              window.open(doc.url, '_blank');
            } else {
              alert(`Viewing: ${docName}\nFile: ${doc?.fileName || doc?.name}`);
            }
          }}
          onDownload={(docName, doc) => {
            console.log('Download document:', docName, doc);
            if (doc?.url) {
              const link = document.createElement('a');
              link.href = doc.url;
              link.download = doc.fileName || doc.name;
              link.click();
            } else {
              alert(`Downloading: ${docName}\nFile: ${doc?.fileName || doc?.name}`);
            }
          }}
        />

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-navy-900 mb-6">Application Timeline</h2>
          <ApplicationTimeline timeline={timeline} />
        </div>

        {/* Action Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Admin Actions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={handleApproveDocuments}
              disabled={actionLoading || application.applicationStatus === 'Under Review'}
              className="h-[48px] rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={16} />
              Approve Documents
            </button>
            <button
              onClick={handleMarkUnderReview}
              disabled={actionLoading || application.applicationStatus === 'Under Review'}
              className="h-[48px] rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock size={16} />
              Mark Under Review
            </button>
            <button
              onClick={handleRaiseQuery}
              disabled={actionLoading}
              className="h-[48px] rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertCircle size={16} />
              Raise Query
            </button>
            <button
              onClick={handleMarkCompleted}
              disabled={actionLoading || application.applicationStatus === 'Completed'}
              className="h-[48px] rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={16} />
              Mark Completed
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading || application.applicationStatus === 'Rejected'}
              className="h-[48px] rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-2"
            >
              <XCircle size={16} />
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}