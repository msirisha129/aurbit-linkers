const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
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
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    // Links the lead to whichever service/category the user clicked through the mega-menu
    serviceSlug: {
      type: String,
      trim: true,
    },
    serviceName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    source: {
      type: String,
      default: 'website',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_progress', 'completed', 'rejected', 'closed'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customsLocations: [
      {
        name: { type: String },
        code: { type: String },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
