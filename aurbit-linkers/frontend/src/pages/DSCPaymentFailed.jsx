import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function DSCPaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state || {};

  const reason = config.reason || 'Payment was cancelled or failed. Please try again.';

  const handleRetry = () => {
    navigate('/service/dsc/details', {
      state: { ...config, paymentError: undefined, reason: undefined },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Red Failure Banner */}
          <div className="bg-red-50 px-8 py-8 text-center border-b border-red-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-5">
              <XCircle size={40} className="text-red-500" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Payment Failed</h1>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">{reason}</p>
          </div>

          <div className="px-6 py-6 space-y-3">
            <button
              onClick={handleRetry}
              className="w-full h-[48px] rounded-xl bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Retry Payment
            </button>
            <button
              onClick={() => navigate('/service/dsc')}
              className="w-full h-[48px] rounded-xl border border-gray-200 bg-white text-navy-900 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to DSC
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
}