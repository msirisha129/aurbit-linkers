import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DSCPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state || {};
  const [status, setStatus] = useState('initializing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // -------------------------------------------------------
    // Only run once on mount — create order & open Cashfree
    // -------------------------------------------------------
    if (!config.phone || !config.amount) {
      setStatus('error');
      setErrorMsg('No configuration found. Please start from the DSC page.');
      return;
    }

    let cancelled = false;

    async function initPayment() {
      try {
        setStatus('processing');
        console.log('DSCPayment: Creating order...');

        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: config.amount,
            customerName: config.email || 'Customer',
            customerEmail: config.email || 'customer@example.com',
            customerPhone: config.phone,
          }),
        });

        if (!res.ok) {
          let errorText = `HTTP ${res.status}`;
          try {
            const errData = await res.json();
            errorText = errData.message || errData.error || JSON.stringify(errData);
          } catch (_) {}
          throw new Error(errorText);
        }

        const data = await res.json();
        console.log('DSCPayment: Order created. Response:', data);

        if (cancelled) return;

        if (!data.payment_session_id) {
          setStatus('error');
          setErrorMsg('Failed to create payment: ' + JSON.stringify(data));
          return;
        }

        // Save order info to sessionStorage so PaymentCallback can retrieve it
        try {
          sessionStorage.setItem('dsc_pending_config', JSON.stringify(config));
        } catch (e) {}

        const { load } = await import('@cashfreepayments/cashfree-js');
        const cashfree = await load({ mode: 'sandbox' });

        console.log('DSCPayment: Opening Cashfree checkout...');

        // Open Cashfree modal — callbacks are for logging only.
        // Official confirmation happens via PaymentCallback after redirect.
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: '_modal',
          onSuccess: (result) => {
            console.log('DSCPayment: onSuccess callback (logging only):', result);
            // PaymentCallback will handle the official verification after redirect
          },
          onFailure: (error) => {
            console.log('DSCPayment: onFailure callback:', error);
            // If the modal shows failure (user closed it, etc.), navigate to failed page
            navigate('/service/dsc/payment-failed', {
              state: {
                ...config,
                reason: error?.message || error?.reason || 'Payment was cancelled or failed.',
              },
              replace: true,
            });
          },
        });
      } catch (err) {
        if (!cancelled) {
          console.error('DSCPayment: Initialization error:', err);
          setStatus('error');
          setErrorMsg(err.message || 'Payment initialization failed');
        }
      }
    }

    initPayment();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Payment Error</h2>
          <p className="text-slate-600 mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate('/service/dsc/details', { state: { ...config, paymentError: undefined } })}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            Go Back to Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-navy-900 mb-2">Initializing Payment...</h2>
        <p className="text-sm text-slate-600">Please wait while we redirect you to the secure payment gateway.</p>
      </div>
    </div>
  );
}