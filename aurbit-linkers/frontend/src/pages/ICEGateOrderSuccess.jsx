import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, ArrowLeft, LayoutDashboard, FileText, Download } from 'lucide-react';

export default function ICEGateOrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state || {};

  console.log("========== ICEGATE ORDER SUCCESS ==========");
  console.log("Location state:", order);
  console.log("Order _id:", order?._id);
  console.log("Order applicationId:", order?.applicationId);
  console.log("Order orderId:", order?.orderId);
  console.log("Order service:", order?.service);

  if (!order.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <p className="text-slate-600 mb-4">No order information found.</p>
          <button
            onClick={() => navigate('/icegate')}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            Back to ICEGATE
          </button>
        </div>
      </div>
    );
  }

  const paymentDate = order.date
    ? new Date(order.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const detailRow = (label, value) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-navy-900 text-right max-w-[55%]">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate('/icegate')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to ICEGATE
        </button>

        {/* Main Success Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Green Success Banner */}
          <div className="bg-emerald-50 px-6 sm:px-8 py-8 sm:py-10 text-center border-b border-emerald-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-5">
              <CheckCircle size={40} className="text-emerald-600" strokeWidth={2} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">✔ Payment Successful</h1>
            <p className="text-base text-slate-600 max-w-md mx-auto">
              Thank you for your purchase. Your ICEGATE Registration request has been submitted successfully.
            </p>
          </div>

          {/* Order Details Section */}
          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Order Details</h2>
            <div className="bg-gray-50/80 rounded-xl px-4 sm:px-5 py-2">
              {detailRow('Order ID', order.orderId)}
              {detailRow('Payment ID', order.paymentId)}
              {detailRow('Customer Name', order.customerName)}
              {detailRow('Mobile Number', order.mobile)}
              {detailRow('Service', order.service || 'ICEGATE Registration')}
              {detailRow('Amount Paid', `₹${Number(order.amount).toLocaleString('en-IN')}`)}
              {detailRow('Payment Date', paymentDate)}
              {detailRow(
                'Payment Status',
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle size={14} strokeWidth={2.5} />
                  Paid
                </span>
              )}
            </div>
          </div>

          {/* What's Next Section */}
          <div className="px-6 sm:px-8 py-6 border-t border-gray-100">
            <h2 className="text-sm font-bold text-navy-900 mb-4 flex items-center gap-2">
              <ChevronRight size={18} className="text-emerald-600" />
              What's Next
            </h2>
            <ul className="space-y-3">
              {[
                'Our team will review your ICEGATE registration within 24 hours.',
                'We will assist with document submission and DSC linking.',
                'After successful verification, your ICEGATE account will be activated.',
                'You can track the application status from your dashboard anytime.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 pb-8 space-y-3">
            <button
              onClick={() => navigate('/service/application/details', { state: order })}
              className="w-full h-[48px] rounded-xl bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              View My Application
            </button>
            <button
              onClick={() => {
                const receipt = [
                  '=== AURBIT LINKERS - Payment Receipt ===',
                  '',
                  `Order ID: ${order.orderId}`,
                  `Payment ID: ${order.paymentId}`,
                  `Date: ${paymentDate}`,
                  `Customer: ${order.customerName}`,
                  `Mobile: ${order.mobile}`,
                  `Service: ${order.service || 'ICEGATE Registration'}`,
                  `Amount: ₹${Number(order.amount).toLocaleString('en-IN')}`,
                  `Status: Paid`,
                  '',
                  'Thank you for choosing Aurbit Linkers!',
                  '========================================',
                ].join('\n');
                const blob = new Blob([receipt], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `receipt-${order.orderId}.txt`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="w-full h-[48px] rounded-xl border border-gray-200 bg-white text-navy-900 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Receipt
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full h-[48px] rounded-xl border border-gray-200 bg-white text-navy-900 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={16} />
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-slate-400 mt-5">
          You will receive updates on your registered mobile number and email.
        </p>
      </div>
    </div>
  );
}