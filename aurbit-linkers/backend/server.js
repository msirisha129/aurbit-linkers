// Load environment variables early
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const serviceRoutes = require('./routes/services');
const customsLocationRoutes = require('./routes/customsLocations');
const userRoutes = require('./routes/users');

const https = require('https');

const app = express();

// --- Core middleware ---
// CORS - restrict to local dev origins for safety
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_ORIGIN || 'http://localhost:5175'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - origin: ${req.headers.origin}`);
  next();
});

// Basic rate limiting to protect auth + lead endpoints from abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Serve uploaded documents
app.use('/uploads', express.static('uploads'));

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'aurbit-linkers-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customs-locations', customsLocationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dsc/applications', require('./routes/dscApplications'));
app.use('/api/icegate/applications', require('./routes/icegateApplications'));

// ---- Cashfree payment order creation ----
app.post('/api/create-order', async (req, res) => {
  try {
    console.log("========== CREATE ORDER ==========");
    console.log("Request Body:", req.body);

    const { amount, customerName, customerEmail, customerPhone, callbackPath } = req.body;

    console.log('[create-order] callbackPath received:', callbackPath);

    const orderId = 'order_' + Date.now();
    const orderToken = 'token_' + Date.now();

    // Determine callback URL — default to DSC, allow override for ICEGATE
    const callbackBase = callbackPath || '/service/dsc/payment-callback';

    const returnUrl = 'http://localhost:5173' + callbackBase + '?order_id=' + orderId;
    console.log("Generated Order ID:", orderId);
    console.log("Generated Return URL:", returnUrl);

    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'cust_' + Date.now(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url:
          'http://localhost:5173' + callbackBase + '?order_id=' +
          orderId,
      },
    };

    console.log('Cashfree API request:', JSON.stringify(orderData));

    const postData = JSON.stringify(orderData);

    const options = {
      hostname: 'sandbox.cashfree.com',
      path: '/pg/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => (body += chunk));
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: response.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log('Cashfree response status:', response.status);
    const responseText = JSON.stringify(response.data);
    console.log('Cashfree raw response:', responseText);
    const data = response.data;
    console.log("Cashfree Response:", data);
    console.log("Payment Session:", data.payment_session_id);

    res.json(data);
  } catch (error) {
    console.error('Error creating Cashfree order:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ---- Cashfree payment verification ----
app.post('/api/verify-payment', async (req, res) => {
  try {
    console.log("========== VERIFY PAYMENT ==========");
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(400).json({ success: false, message: 'order_id is required' });
    }

    console.log("Incoming Order ID:", req.body.order_id);
    console.log('[verify-payment] Received order_id:', order_id);
    console.log('Verifying payment for order:', order_id);

    const options = {
      hostname: 'sandbox.cashfree.com',
      path: '/pg/orders/' + order_id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => (body += chunk));
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: response.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log('Cashfree verification response status:', response.status);
    console.log("Cashfree Verification Response:", response.data);
    console.log('Cashfree verification body:', JSON.stringify(response.data));

    if (response.status !== 200) {
      return res.status(response.status).json({
        success: false,
        message: 'Failed to verify payment with Cashfree',
        cashfree_error: response.data,
      });
    }

    const data = response.data;

    // Map Cashfree response to a clean format
    const result = {
      success: true,
      order_id: data.order_id,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      order_status: data.order_status,
      payment_status: data.payment_status || data.order_status,
      cf_order_id: data.cf_order_id,
      cf_payment_id: data.cf_payment_id || data.payment_session_id || null,
      payment_id: data.cf_payment_id || data.payment_session_id || 'PAY_' + Date.now(),
      customer_details: data.customer_details || {},
      payment_message: data.payment_message || data.order_note || '',
      status: data.order_status === 'PAID' ? 'SUCCESS' : data.order_status === 'ACTIVE' ? 'PENDING' : 'FAILED',
    };

    console.log("Response Returned To Frontend:", result);

    res.json(result);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// POST /api/test-email — send a diagnostic test email
const { sendTestEmail } = require('./utils/email');
app.post('/api/test-email', async (req, res) => {
  try {
    const result = await sendTestEmail();
    if (result.ok) {
      return res.json({ status: 'ok', messageId: result.messageId, message: 'Test email sent successfully' });
    } else {
      return res.status(500).json({ status: 'error', error: result.error });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err?.message || 'Unknown error' });
  }
});

// --- 404 handler ---
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong on our end.' });
});

const PORT = process.env.PORT || 5000;

const http = require('http');

connectDB()
  .then(() => {
    // Try to listen on the requested PORT, but if it's in use, attempt a few increments.
    const maxAttempts = 5;
    let attempt = 0;

    function tryListen(port) {
      attempt += 1;
      const server = http.createServer(app);

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is in use.`);
          if (attempt < maxAttempts) {
            const next = port + 1;
            console.log(`Attempting to listen on port ${next} (attempt ${attempt + 1}/${maxAttempts})`);
            setTimeout(() => tryListen(next), 200);
          } else {
            console.error(`Failed to bind to a port after ${maxAttempts} attempts. Last port tried: ${port}`);
            // Let process exit so operator can intervene; nodemon will not aggressively restart unless files change
            process.exit(1);
          }
        } else {
          console.error('Server error during startup:', err);
          process.exit(1);
        }
      });

      server.listen(port, () => {
        console.log(`Aurbit Linkers API running on http://localhost:${port}`);
      });
    }

    tryListen(Number(PORT));
  })
  .catch((err) => {
    console.error('Failed to connect to database, aborting startup.', err);
    process.exit(1);
  });

// Global handlers to prevent nodemon crash loops and provide diagnostics
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // exit after logging so supervisor can restart if needed
  process.exit(1);
});
