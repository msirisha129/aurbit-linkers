/**
 * seedAdmin.js
 *
 * Creates (or promotes) a real admin user so that
 * Forgot Password / Reset Password / Login all work end-to-end.
 *
 * Run with:
 *   node config/seedAdmin.js
 *   (from the backend/ directory, or `npm run seed:admin` if added to package.json)
 *
 * Reads credentials from env (with safe defaults for first-time local setup):
 *   ADMIN_EMAIL     - admin email
 *   ADMIN_PASSWORD  - plain-text password (will be hashed with bcrypt, cost 10)
 *   ADMIN_NAME      - display name
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'mothuri29@gamil.com')
  .toLowerCase()
  .trim();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@sirisha29';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seedAdmin() {
  await connectDB();

  console.log('--- Admin seed ---');
  console.log('Target email :', ADMIN_EMAIL);

  // Normalize like the model would (lowercase + trim)
  const email = ADMIN_EMAIL;

  // Always re-hash from the plain-text password provided here
  // so that the stored hash is guaranteed valid for this exact password.
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: ADMIN_NAME,
      email,
      passwordHash,
      role: 'admin',
    });
    console.log('Admin created');
  } else {
    user.passwordHash = passwordHash;
    user.role = 'admin';
    // Clear any stale reset state so a previous bad attempt doesn't interfere
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    console.log('Admin already exists');
    console.log('Admin promoted successfully');
  }

  console.log('--- Admin document ---');
  console.log({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    passwordHashLength: user.passwordHash.length,
    passwordHashPrefix: user.passwordHash.slice(0, 7), // e.g. "$2a$10$"
    resetPasswordToken: user.resetPasswordToken,
    resetPasswordExpires: user.resetPasswordExpires,
  });

  await mongoose.connection.close();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Admin seed failed:', err);
  process.exit(1);
});
