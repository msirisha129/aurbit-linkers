const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { sendResetPasswordEmail } = require('../utils/email');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
      const { name, email, password, phone, company } = req.body;

      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone,
        company,
        passwordHash,
      });

      const token = signToken(user);
      return res.status(201).json({ token, user: user.toSafeJSON() });
    } catch (err) {
      console.error('Signup error:', err);
      return res.status(500).json({ message: 'Could not create account. Please try again.' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const matches = await user.comparePassword(password);
      if (!matches) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = signToken(user);
      return res.json({ token, user: user.toSafeJSON() });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Could not log in. Please try again.' });
    }
  }
);

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user.toSafeJSON() });
});

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Enter a valid email')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email } = req.body;
      console.log('POST /api/auth/forgot-password hit, payload:', { email });

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      console.log('User lookup result:', !!user);

      if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(expires);

        try {
          await user.save();
          console.log('Saved reset token to user:', {
            id: user._id.toString(),
            resetPasswordToken: user.resetPasswordToken,
          });
        } catch (saveErr) {
          console.error('Failed to save reset token to user:', saveErr);
          return res.status(500).json({ message: 'Failed to save reset token' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5175';
        const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password/${token}`;
        console.log('Generated password reset URL:', resetUrl);

        try {
          const ok = await sendResetPasswordEmail(user.email, user.name, resetUrl);
          console.log('sendResetPasswordEmail returned:', ok);
          if (ok) {
            console.log('Reset email sent successfully');
          } else {
            console.log('Email sending reported failure');
          }
        } catch (emailErr) {
          console.error('Email send threw error:', emailErr);
        }
      }

      return res.json({
        message: 'If an account exists with that email, a reset link has been sent.',
      });
    } catch (err) {
      console.error('Forgot-password error:', err);
      return res.status(500).json({ message: 'Could not process request. Please try again.' });
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    // Diagnostics: log incoming body and extracted token
    console.log('RESET BODY:', req.body);
    console.log('RESET BODY KEYS:', Object.keys(req.body || {}));
    const tokenFromBody = req.body && req.body.token;
    console.log('RESET TOKEN:', tokenFromBody);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log full validation errors before returning 400
      console.log('Reset-password validation errors:', errors.array());
      return res.status(400).json({
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    try {
      const { token, password } = req.body;

      // Log token being used for lookup
      console.log('Looking for token:', token);

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });

      console.log('User found:', !!user);

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      user.passwordHash = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      const jwtToken = signToken(user);
      return res.json({ token: jwtToken, message: 'Password reset successful' });
    } catch (err) {
      console.error('Reset password error:', err);
      return res.status(500).json({ message: 'Could not reset password' });
    }
  }
);

module.exports = router;