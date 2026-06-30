import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Eye, ArrowLeft } from 'lucide-react';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dsc_orders') || '[]');
      setOrders(saved);
    } catch (e) {
      console.warn('Could not load orders:', e);
    }
  }, []);

  const getStatusBadge = (status) => {
    const isPaid = status === 'Paid';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          isPaid
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {status || 'Pending'}
      </span>
    );
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
            <h1 className="text-xl font-bold text-navy-900">My Orders</h1>
            <p className="text-sm text-slate-500">View your DSC order history</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-navy-900 mb-1">No Orders Yet</h2>
            <p className="text-sm text-slate-500 mb-4">You haven't placed any DSC orders yet.</p>
            <button
              onClick={() => navigate('/service/dsc')}
              className="px-6 py-3 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#15203a] transition-colors"
            >
              Buy DSC Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/service/dsc/orders/${order.orderId}`, { state: order })}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-navy-900 truncate">
                        {order.service || 'Digital Signature Certificate'}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                      <span>Order: <strong className="text-navy-900">{order.orderId}</strong></span>
                      <span>Amount: <strong className="text-navy-900">₹{Number(order.amount).toLocaleString('en-IN')}</strong></span>
                      {order.date && (
                        <span>
                          Date:{' '}
                          <strong className="text-navy-900">
                            {new Date(order.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Eye size={15} className="text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}