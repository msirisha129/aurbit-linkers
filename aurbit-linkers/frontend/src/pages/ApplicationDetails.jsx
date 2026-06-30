import { useLocation, useNavigate } from 'react-router-dom';
import ApplicationHeader from '../components/application/ApplicationHeader';
import ApplicationSummaryCard from '../components/application/ApplicationSummaryCard';
import ApplicationTimeline from '../components/application/ApplicationTimeline';
import ApplicationActionButtons from '../components/application/ApplicationActionButtons';
import DocumentUploader from '../components/application/DocumentUploader';
import { FileText, Upload } from 'lucide-react';

export default function ApplicationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const application = location.state || {};

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

  const paymentDate = application.date
    ? new Date(application.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const documents = application.documents || [];

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

  const handleUpload = async (documentName, file) => {
    if (file === null) {
      return;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock upload:', documentName, file.name);
        resolve();
      }, 1000);
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