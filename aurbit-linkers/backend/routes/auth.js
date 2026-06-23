const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

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
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
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

module.exports = router;
