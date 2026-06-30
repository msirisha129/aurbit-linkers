import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function ApplicationHeader({
  serviceName,
  applicationId,
  applicationStatus,
  paymentStatus,
}) {
  const getPaymentBadge = () => {
    if (paymentStatus === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
        Pending
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">{serviceName}</h1>
          <p className="text-sm text-slate-600 mt-2">
            Application ID: <span className="font-mono font-semibold text-navy-900">{applicationId}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {applicationStatus && <ApplicationStatusBadge status={applicationStatus} />}
          {paymentStatus && getPaymentBadge()}
        </div>
      </div>
    </div>
  );
}