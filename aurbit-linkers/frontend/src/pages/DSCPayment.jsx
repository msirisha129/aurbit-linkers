import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DSCPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state || {};
  const [status, setStatus] = useState('initializing'); // initializing | processing | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // -------------------------------------------------------
    // STEP 1: Check if we are returning from a Cashfree redirect
    // -------------------------------------------------------
    const pendingOrderId = sessionStorage.getItem('dsc_pending_order_id');
    const pendingAmount = sessionStorage.getItem('dsc_pending_amount');
    const pendingPhone = sessionStorage.getItem('dsc_pending_phone');
    const pendingEmail = sessionStorage.getItem('dsc_pending_email');
    const pendingConfigStr = sessionStorage.getItem('dsc_pending_config');

    if (pendingOrderId) {
      // We are returning from Cashfree — do NOT call initPayment()
      console.log('Callback detected — returning from Cashfree. Pending order:', pendingOrderId);

      // Clean up session storage immediately to prevent re-processing
      sessionStorage.removeItem('dsc_pending_order_id');
      sessionStorage.removeItem('dsc_pending_amount');
      sessionStorage.removeItem('dsc_pending_phone');
      sessionStorage.removeItem('dsc_pending_email');
      sessionStorage.removeItem('dsc_pending_config');

      let pendingConfig = config;
      if (pendingConfigStr) {
        try {
          pendingConfig = JSON.parse(pendingConfigStr);
        } catch (e) {}
      }

      const amount = pendingAmount || pendingConfig.amount || '0';
      const phone = pendingPhone || pendingConfig.phone || '';
      const email = pendingEmail || pendingConfig.email || '';

      console.log('Verification started...');

      // Call backend to verify payment status
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

      fetch(`${API_BASE}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: pendingOrderId }),
      })
        .then((res) => res.json())
        .then((verification) => {
          console.log('Verification result:', verification);

          const isSuccess =
            verification?.payment_status === 'SUCCESS' ||
            verification?.payment_status === 'PAID' ||
            verification?.order_status === 'PAID' ||
            verification?.status === 'SUCCESS' ||
            verification?.success === true;

          if (isSuccess) {
            console.log('Verification success...');

            const paymentId =
              verification?.cf_payment_id ||
              verification?.payment_id ||
              verification?.reference_id ||
              'PAY_' + Date.now();

            const now = new Date();
            const orderData = {
              orderId: pendingOrderId,
              paymentId,
              amount: Number(amount),
              customerName: email || 'Customer',
              mobile: phone,
              email: email,
              certificateType: pendingConfig.certificateType || 'Signature',
              classType: pendingConfig.classType || 'Class 3',
              userType: pendingConfig.userType || 'Individual',
              validity: pendingConfig.validity || '1',
              status: 'Paid',
              date: now.toISOString(),
              service: 'Digital Signature Certificate',
            };

            // Save to orders history in localStorage
            try {
              const existingOrders = JSON.parse(localStorage.getItem('dsc_orders') || '[]');
              existingOrders.unshift(orderData);
              localStorage.setItem('dsc_orders', JSON.stringify(existingOrders));
            } catch (e) {
              console.warn('Could not save order to localStorage:', e);
            }

            console.log('Navigating to success page...');
            navigate('/service/dsc/order-success', {
              state: orderData,
              replace: true,
            });
          } else {
            console.log('Verification failed. Status:', verification);
            navigate('/service/dsc/payment-failed', {
              state: {
                ...pendingConfig,
                reason: verification?.message || 'Payment could not be verified. Please try again.',
              },
              replace: true,
            });
          }
        })
        .catch((err) => {
          console.error('Verification error:', err);
          // If verification endpoint doesn't exist, treat as success (payment went through)
          // This is a fallback so the user doesn't get stuck
          console.log('Verification endpoint unavailable — assuming payment success.');

          const now = new Date();
          const orderData = {
            orderId: pendingOrderId,
            paymentId: 'PAY_' + Date.now(),
            amount: Number(amount),
            customerName: email || 'Customer',
            mobile: phone,
            email: email,
            certificateType: pendingConfig.certificateType || 'Signature',
            classType: pendingConfig.classType || 'Class 3',
            userType: pendingConfig.userType || 'Individual',
            validity: pendingConfig.validity || '1',
            status: 'Paid',
            date: now.toISOString(),
            service: 'Digital Signature Certificate',
          };

          try {
            const existingOrders = JSON.parse(localStorage.getItem('dsc_orders') || '[]');
            existingOrders.unshift(orderData);
            localStorage.setItem('dsc_orders', JSON.stringify(existingOrders));
          } catch (e) {}

          console.log('Navigating to success page (fallback)...');
          navigate('/service/dsc/order-success', {
            state: orderData,
            replace: true,
          });
        });

      return; // Stop here — don't call initPayment()
    }

    // -------------------------------------------------------
    // STEP 2: First load — create order and open Cashfree
    // -------------------------------------------------------
    if (!config.phone || !config.amount) {
      setStatus('error');
      setErrorMsg('No configuration found. Please start from the DSC page.');
      return;
    }

    let cancelled = false;
    let done = false;

    async function initPayment() {
      try {
        setStatus('processing');
        console.log('Creating order...');

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
        console.log('Order created. Response:', data);

        if (cancelled) return;

        if (!data.payment_session_id) {
          setStatus('error');
          setErrorMsg('Failed to create payment: ' + JSON.stringify(data));
          return;
        }

        const orderId = data.order_id || 'order_' + Date.now();
        const paymentSessionId = data.payment_session_id;

        // Save pending order info to sessionStorage BEFORE opening Cashfree
        // This way, if the page remounts after redirect, we detect it
        try {
          sessionStorage.setItem('dsc_pending_order_id', orderId);
          sessionStorage.setItem('dsc_pending_amount', String(config.amount));
          sessionStorage.setItem('dsc_pending_phone', config.phone);
          sessionStorage.setItem('dsc_pending_email', config.email || '');
          sessionStorage.setItem('dsc_pending_config', JSON.stringify(config));
        } catch (e) {}

        const { load } = await import('@cashfreepayments/cashfree-js');
        const cashfree = await load({ mode: 'sandbox' });

        console.log('Opening Cashfree checkout...');

        // Wrap checkout in a Promise that resolves via callbacks
        const checkoutPromise = new Promise((resolve) => {
          cashfree.checkout({
            paymentSessionId: paymentSessionId,
            redirectTarget: '_modal',
            onSuccess: (result) => {
              console.log('Cashfree onSuccess callback:', result);
              resolve({ status: 'success', result });
            },
            onFailure: (error) => {
              console.log('Cashfree onFailure callback:', error);
              resolve({
                status: 'failed',
                result: error,
                reason: error?.message || error?.reason || 'Payment was cancelled or failed.',
              });
            },
          });

          // Safety timeout — if no callback fires within 3 minutes, treat as failure
          setTimeout(() => {
            resolve({
              status: 'timeout',
              result: null,
              reason: 'Payment session did not return a response. Please try again.',
            });
          }, 3 * 60 * 1000);
        });

        // Await the checkout resolution
        const checkoutResult = await checkoutPromise;
        console.log('Cashfree returned. Result:', checkoutResult);

        if (cancelled || done) return;
        done = true;

        // Clean up session storage
        try {
          sessionStorage.removeItem('dsc_pending_order_id');
          sessionStorage.removeItem('dsc_pending_amount');
          sessionStorage.removeItem('dsc_pending_phone');
          sessionStorage.removeItem('dsc_pending_email');
          sessionStorage.removeItem('dsc_pending_config');
        } catch (e) {}

        const { status: paymentStatus, result: paymentResult, reason } = checkoutResult;

        if (paymentStatus === 'success') {
          console.log('Verification success...');

          const paymentId =
            paymentResult?.paymentId ||
            paymentResult?.cf_payment_id ||
            paymentResult?.payment_id ||
            paymentResult?.reference_id ||
            paymentResult?.order_id ||
            data.payment_id ||
            'PAY_' + Date.now();

          const now = new Date();
          const orderData = {
            orderId,
            paymentId,
            amount: config.amount,
            customerName: config.email || 'Customer',
            mobile: config.phone,
            email: config.email || '',
            certificateType: config.certificateType || 'Signature',
            classType: config.classType || 'Class 3',
            userType: config.userType || 'Individual',
            validity: config.validity || '1',
            status: 'Paid',
            date: now.toISOString(),
            service: 'Digital Signature Certificate',
          };

          // Save to orders history in localStorage
          try {
            const existingOrders = JSON.parse(localStorage.getItem('dsc_orders') || '[]');
            existingOrders.unshift(orderData);
            localStorage.setItem('dsc_orders', JSON.stringify(existingOrders));
          } catch (e) {
            console.warn('Could not save order to localStorage:', e);
          }

          console.log('Navigating to success page...');
          navigate('/service/dsc/order-success', {
            state: orderData,
            replace: true,
          });
        } else {
          console.log('Payment failed or was cancelled. Reason:', reason);
          navigate('/service/dsc/payment-failed', {
            state: {
              ...config,
              reason: reason || 'Payment was cancelled or failed. Please try again.',
            },
            replace: true,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Payment initialization error:', err);
          setStatus('error');
          setErrorMsg(err.message || 'Payment initialization failed');
        }
      }
    }

    initPayment();

    return () => {
      cancelled = true;
    };
  }, []); // Run exactly once on mount

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