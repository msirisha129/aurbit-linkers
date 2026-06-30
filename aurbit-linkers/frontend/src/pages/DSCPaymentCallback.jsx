import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function DSCPaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      setStatus('error');
      setErrorMsg('No order ID received from payment gateway.');
      return;
    }

    console.log('PaymentCallback: Verifying order', orderId);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    // Step 1: Verify payment with Cashfree
    fetch(`${API_BASE}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Verification request failed with status ' + res.status);
        }
        return res.json();
      })
      .then(async (verification) => {
        console.log('PaymentCallback: Verification result:', verification);

        const isSuccess =
          verification?.payment_status === 'SUCCESS' ||
          verification?.payment_status === 'PAID' ||
          verification?.order_status === 'PAID' ||
          verification?.status === 'SUCCESS' ||
          verification?.status === 'PENDING' ||
          verification?.success === true;

        if (!isSuccess) {
          // Payment not successful
          let pendingConfig = {};
          try {
            const stored = sessionStorage.getItem('dsc_pending_config');
            if (stored) pendingConfig = JSON.parse(stored);
          } catch (e) {}

          console.log('PaymentCallback: Payment not successful. Status:', verification);
          navigate('/service/dsc/payment-failed', {
            state: {
              ...pendingConfig,
              reason:
                verification?.payment_message ||
                verification?.message ||
                'Payment could not be verified. Please try again.',
            },
            replace: true,
          });
          return;
        }

        // Payment is successful — build order data
        const paymentId =
          verification?.cf_payment_id ||
          verification?.payment_id ||
          verification?.reference_id ||
          'PAY_' + Date.now();

        const customerEmail =
          verification?.customer_details?.customer_email || '';
        const customerPhone =
          verification?.customer_details?.customer_phone || '';
        const customerName =
          verification?.customer_details?.customer_name ||
          customerEmail ||
          'Customer';

        // Step 2: Save DSC application to MongoDB (authenticated)
        try {
          const appResponse = await api.post('/dsc/applications', {
            orderId: verification.order_id || orderId,
            paymentId,
            customerName,
            email: customerEmail,
            mobile: customerPhone,
            certificateType: 'Signature',
            classType: 'Class 3',
            userType: 'Individual',
            validity: '1',
            amount: Number(verification.order_amount || 0),
          });
          console.log('PaymentCallback: DSC application saved:', appResponse.data);
        } catch (appErr) {
          // Log but don't block — the payment is already verified
          console.warn('PaymentCallback: Could not save DSC application to backend:', appErr);
        }

        // Step 3: Also save to localStorage for MyOrders page
        const now = new Date();
        const orderData = {
          orderId: verification.order_id || orderId,
          paymentId,
          amount: Number(verification.order_amount || 0),
          customerName,
          mobile: customerPhone,
          email: customerEmail,
          certificateType: 'Signature',
          classType: 'Class 3',
          userType: 'Individual',
          validity: '1',
          status: 'Paid',
          date: now.toISOString(),
          service: 'Digital Signature Certificate',
        };

        try {
          const existingOrders = JSON.parse(localStorage.getItem('dsc_orders') || '[]');
          existingOrders.unshift(orderData);
          localStorage.setItem('dsc_orders', JSON.stringify(existingOrders));
        } catch (e) {
          console.warn('Could not save order to localStorage:', e);
        }

        console.log('PaymentCallback: Payment verified, navigating to success...');
        navigate('/service/dsc/order-success', {
          state: orderData,
          replace: true,
        });
      })
      .catch((err) => {
        console.error('PaymentCallback: Verification error:', err);
        setStatus('error');
        setErrorMsg(
          'Could not verify payment status. ' +
            (err.message || 'Please check your order in My Orders.')
        );
      });
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Verification Error</h2>
          <p className="text-slate-600 mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate('/service/dsc')}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            Back to DSC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-navy-900 mb-2">Verifying Payment...</h2>
        <p className="text-sm text-slate-600">Please wait while we confirm your payment.</p>
      </div>
    </div>
  );
}