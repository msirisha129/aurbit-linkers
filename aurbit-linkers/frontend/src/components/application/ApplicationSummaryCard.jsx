import { FileText, User, Calendar, Hash } from 'lucide-react';

export default function ApplicationSummaryCard({
  service,
  amount,
  customer,
  paymentDate,
  orderId,
}) {
  const detailRow = (label, value, Icon) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
          <Icon size={16} />
        </div>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-navy-900 text-right max-w-[60%]">{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-navy-900 mb-6">Order Summary</h2>
      <div className="bg-gray-50/80 rounded-xl px-5 py-3">
        {service && detailRow('Service', service, FileText)}
        {customer && detailRow('Customer Name', customer, User)}
        {orderId && detailRow('Order ID', orderId, Hash)}
        {amount && detailRow('Amount Paid', `₹${Number(amount).toLocaleString('en-IN')}`, FileText)}
        {paymentDate && detailRow('Payment Date', paymentDate, Calendar)}
      </div>
    </div>
  );
}