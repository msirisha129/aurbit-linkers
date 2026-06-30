 import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ICEGatePaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  console.log("STEP 4 - Callback page mounted");

  useEffect(() => {
    const orderId = searchParams.get('order_id');

    console.log("========== ICEGATE CALLBACK ==========");
    console.log("Order ID From URL:", orderId);

    if (!orderId) {
      setStatus('error');
      setErrorMsg('No order ID received from payment gateway.');
      return;
    }

    console.log('ICEGateCallback: Verifying order', orderId);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    // Step 1: Verify payment with Cashfree
    console.log("STEP 5 - Calling verify-payment");
    console.log("Verifying order:", orderId);
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
        console.log("STEP 6 - Verify response", verification);
        console.log('ICEGateCallback: Verification result:', verification);
        console.log("Verification order_id:", verification?.order_id);
        console.log("Verification payment_status:", verification?.payment_status);

        const isSuccess =
          verification?.payment_status === 'SUCCESS' ||
          verification?.payment_status === 'PAID' ||
          verification?.order_status === 'PAID' ||
          verification?.status === 'SUCCESS' ||
          verification?.status === 'PENDING' ||
          verification?.success === true;

        if (!isSuccess) {
          console.log('ICEGateCallback: Payment not successful. Status:', verification);
          navigate('/service/icegate-registration/payment-failed', {
            state: {
              reason:
                verification?.payment_message ||
                verification?.message ||
                'Payment could not be verified. Please try again.',
            },
            replace: true,
          });
          return;
        }

        // Payment is successful
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

        // Step 2: Save ICEGATE application to MongoDB (authenticated)
        console.log("STEP 7 - Creating ICEGATE application");
        console.log("Application payload:", {
          orderId: verification.order_id || orderId,
          paymentId,
          customerName,
          email: customerEmail,
          mobile: customerPhone,
          amount: Number(verification.order_amount || 2899),
        });
        try {
          const appResponse = await api.post('/icegate/applications', {
            orderId: verification.order_id || orderId,
            paymentId,
            customerName,
            email: customerEmail,
            mobile: customerPhone,
            amount: Number(verification.order_amount || 2899),
          });
          console.log("STEP 8 - Application created", appResponse.data);
          console.log('ICEGateCallback: Application saved:', appResponse.data);
          console.log("Created application _id:", appResponse.data?.application?._id);
          console.log("Created application applicationId:", appResponse.data?.application?.applicationId);
          console.log("Created application orderId:", appResponse.data?.application?.orderId);
        } catch (appErr) {
          console.warn('ICEGateCallback: Could not save application to backend:', appErr);
        }

        // Step 3: Navigate to success page
        const now = new Date();
        const orderData = {
          orderId: verification.order_id || orderId,
          paymentId,
          amount: Number(verification.order_amount || 0),
          customerName,
          mobile: customerPhone,
          email: customerEmail,
          status: 'Paid',
          date: now.toISOString(),
          service: 'ICEGATE Registration',
        };

        console.log("STEP 9 - Navigating to success");
        console.log('ICEGateCallback: Payment verified, navigating to success...');
        console.log("Navigating with orderData:", orderData);
        navigate('/service/icegate-registration/order-success', {
          state: orderData,
          replace: true,
        });
      })
      .catch((err) => {
        console.error('ICEGateCallback: Verification error:', err);
        setStatus('error');
        setErrorMsg(
          'Could not verify payment status. ' +
            (err.message || 'Please contact support.')
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
            onClick={() => navigate('/icegate')}
            className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors"
          >
            Back to ICEGATE
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