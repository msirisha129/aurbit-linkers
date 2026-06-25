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

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'aurbit-linkers-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customs-locations', customsLocationRoutes);
app.use('/api/users', userRoutes);

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
