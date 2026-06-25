const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  console.log('[comparePassword] passwordHash exists:', !!this.passwordHash);
  console.log('[comparePassword] passwordHash length:', this.passwordHash?.length);
  const result = await bcrypt.compare(candidate, this.passwordHash);
  console.log('[comparePassword] match result:', result);
  return result;
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    _id: this._id,
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    company: this.company,
    role: this.role,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
