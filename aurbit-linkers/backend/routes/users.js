const express = require('express');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - admin only
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash -resetPasswordToken -resetPasswordExpires').sort({ createdAt: -1 });
    // map to safe shape
    const safe = users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
    return res.json({ users: safe });
  } catch (err) {
    console.error('GET /api/users error', err);
    return res.status(500).json({ message: 'Could not fetch users' });
  }
});

module.exports = router;
