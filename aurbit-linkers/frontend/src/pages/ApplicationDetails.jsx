import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ApplicationHeader from '../components/application/ApplicationHeader';
import ApplicationSummaryCard from '../components/application/ApplicationSummaryCard';
import ApplicationTimeline from '../components/application/ApplicationTimeline';
import ApplicationActionButtons from '../components/application/ApplicationActionButtons';
import DocumentUploader from '../components/application/DocumentUploader';
import api from '../lib/api';

export default function ApplicationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(location.state || {});
  const [loading, setLoading] = useState(!location.state);
  const [documents, setDocuments] = useState(application.documents || []);

  useEffect(() => {
    // If no state passed (page refresh or direct navigation), fetch from backend
    if (!location.state || !location.state.orderId) {
      const appId = searchParams.get('id') || searchParams.get('orderId') || searchParams.get('applicationId');
      if (appId) {
        fetchApplication(appId);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchApplication = async (id) => {
    setLoading(true);
    try {
      // Try DSC first, then ICEGATE
      let found = null;
      try {
        const { data } = await api.get(`/dsc/applications/${id}`);
        if (data.application) found = data.application;
      } catch (e) {
        // Not found in DSC
      }
      if (!found) {
        try {
          const { data } = await api.get(`/icegate/applications/${id}`);
          if (data.application) found = data.application;
        } catch (e) {
          // Not found in ICEGATE either
        }
      }
      // Try finding by orderId or applicationId
      if (!found) {
        try {
          const { data } = await api.get(`/dsc/applications/mine`);
          const apps = data.applications || [];
          found = apps.find(a => a.orderId === id || a.applicationId === id || a._id === id);
        } catch (e) {}
      }
      if (!found) {
        try {
          const { data } = await api.get(`/icegate/applications/mine`);
          const apps = data.applications || [];
          found = apps.find(a => a.orderId === id || a.applicationId === id || a._id === id);
        } catch (e) {}
      }

      if (found) {
        setApplication(found);
        setDocuments(found.documents || []);
      }
    } catch (err) {
      console.error('Failed to fetch application:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-slate-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <p className="text-slate-600 mb-4">No application information found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const paymentDate = (application.paymentDate || application.createdAt || application.date)
    ? new Date(application.paymentDate || application.createdAt || application.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const getRequiredDocuments = (service) => {
    const serviceLower = (service || '').toLowerCase();
    if (serviceLower.includes('dsc')) {
      return [
        'PAN Card',
        'Aadhaar Card',
        'Passport Size Photo',
        'Address Proof',
      ];
    }
    if (serviceLower.includes('icegate')) {
      return [
        'PAN Card',
        'Incorporation Certificate',
        'Address Proof',
        'DSC Certificate',
      ];
    }
    if (serviceLower.includes('gst')) {
      return [
        'PAN Card',
        'Incorporation Certificate',
        'Address Proof',
        'Bank Details',
      ];
    }
    if (serviceLower.includes('trademark')) {
      return [
        'PAN Card',
        'Trademark Logo',
        'Address Proof',
        'Authorization Letter',
      ];
    }
    if (serviceLower.includes('iec')) {
      return [
        'PAN Card',
        'Incorporation Certificate',
        'Address Proof',
        'Bank Certificate',
      ];
    }
    if (serviceLower.includes('company')) {
      return [
        'PAN Card',
        'Incorporation Certificate',
        'Address Proof',
        'Director Details',
      ];
    }
    return ['PAN Card', 'Address Proof', 'ID Proof'];
  };

  const handleUpload = async (documentName, file, uploadedDoc) => {
    if (file === null) {
      // Remove document
      setDocuments(prev => prev.filter(doc => doc.name !== documentName));
      return;
    }
    
    // Add or update document in state
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.name !== documentName);
      return [...filtered, uploadedDoc];
    });
  };

  const handleDownloadReceipt = () => {
    const receipt = [
      '=== AURBIT LINKERS - Payment Receipt ===',
      '',
      `Order ID: ${application.orderId}`,
      `Payment ID: ${application.paymentId}`,
      `Date: ${paymentDate}`,
      `Customer: ${application.customerName}`,
      `Mobile: ${application.mobile}`,
      `Service: ${application.service || 'Application'}`,
      `Amount: ₹${Number(application.amount).toLocaleString('en-IN')}`,
      `Status: ${application.paymentStatus || 'Paid'}`,
      '',
      'Thank you for choosing Aurbit Linkers!',
      '========================================',
    ].join('\n');

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${application.orderId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewApplications = () => {
    navigate('/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* 1. Application Header */}
        <div className="mb-6">
          <ApplicationHeader
            serviceName={application.service || 'Application'}
            applicationId={application.orderId}
            applicationStatus={application.applicationStatus || 'Documents Pending'}
            paymentStatus={application.paymentStatus || 'Paid'}
          />
        </div>

        {/* 2. Application Summary */}
        <div className="mb-6">
          <ApplicationSummaryCard
            service={application.service}
            amount={application.amount}
            customer={application.customerName}
            paymentDate={paymentDate}
            orderId={application.orderId}
          />
        </div>

        {/* 3. Application Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-navy-900 mb-6">Application Timeline</h2>
          <ApplicationTimeline timeline={application.timeline || []} />
        </div>

        {/* 4. Uploaded Documents */}
        <DocumentUploader
          service={application.service}
          requiredDocuments={getRequiredDocuments(application.service)}
          uploadedDocuments={documents}
          onUpload={handleUpload}
          applicationId={application._id || application.orderId}
        />

        {/* 5. Application Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Actions</h2>
          <ApplicationActionButtons
            showReceipt={true}
            showApplications={true}
            showDashboard={true}
            onReceipt={handleDownloadReceipt}
            onApplications={handleViewApplications}
            onDashboard={handleGoToDashboard}
          />
        </div>
      </div>
    </div>
  );
}