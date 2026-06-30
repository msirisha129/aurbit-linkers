import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, FileText, Download, LayoutDashboard } from 'lucide-react';

export default function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state || {};

  if (!order.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <p className="text-slate-600 mb-4">Order not found.</p>
          <button
            onClick={() => navigate('/service/dsc/orders')}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            View All Orders
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
    : 'N/A';

  const detailRow = (label, value) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-navy-900 text-right max-w-[55%]">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('/service/dsc/orders')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 sm:px-8 py-6 text-center border-b ${
            order.status === 'Paid'
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-yellow-50 border-yellow-100'
          }`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
              order.status === 'Paid' ? 'bg-emerald-100' : 'bg-yellow-100'
            }`}>
              <CheckCircle size={32} className={order.status === 'Paid' ? 'text-emerald-600' : 'text-yellow-600'} strokeWidth={2} />
            </div>
            <h1 className="text-xl font-bold text-navy-900 mb-1">Order Details</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              order.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {order.status || 'Pending'}
            </span>
          </div>

          {/* Order Details */}
          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Booking Details</h2>
            <div className="bg-gray-50/80 rounded-xl px-4 sm:px-5 py-2">
              {detailRow('Order ID', order.orderId)}
              {detailRow('Payment ID', order.paymentId)}
              {detailRow('Customer Name', order.customerName)}
              {detailRow('Mobile Number', order.mobile)}
              {detailRow('Email', order.email || 'N/A')}
              {detailRow('Service', order.service || 'Digital Signature Certificate')}
              {detailRow('Certificate Type', order.certificateType || 'Signature')}
              {detailRow('Class', order.classType || 'Class 3')}
              {detailRow('User Type', order.userType || 'Individual')}
              {detailRow('Validity', `${order.validity || '1'} Year${order.validity !== '1' ? 's' : ''}`)}
              {detailRow('Amount Paid', `₹${Number(order.amount).toLocaleString('en-IN')}`)}
              {detailRow('Payment Date', paymentDate)}
              {detailRow(
                'Payment Status',
                <span className={`inline-flex items-center gap-1.5 font-semibold ${
                  order.status === 'Paid' ? 'text-emerald-600' : 'text-yellow-600'
                }`}>
                  <CheckCircle size={14} strokeWidth={2.5} />
                  {order.status || 'Pending'}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 pb-8 space-y-3">
            <button
              onClick={() => navigate('/service/dsc/orders')}
              className="w-full h-[48px] rounded-xl bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              View All Orders
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
                  `Email: ${order.email || 'N/A'}`,
                  `Service: ${order.service || 'Digital Signature Certificate'}`,
                  `Certificate Type: ${order.certificateType || 'Signature'}`,
                  `Class: ${order.classType || 'Class 3'}`,
                  `User Type: ${order.userType || 'Individual'}`,
                  `Validity: ${order.validity || '1'} Year(s)`,
                  `Amount: ₹${Number(order.amount).toLocaleString('en-IN')}`,
                  `Status: ${order.status || 'Pending'}`,
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
      </div>
    </div>
  );
}