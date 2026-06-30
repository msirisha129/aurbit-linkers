const mongoose = require('mongoose');

const dscApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      default: '',
    },
    service: {
      type: String,
      default: 'Digital Signature Certificate',
    },
    customerName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    certificateType: {
      type: String,
      default: 'Signature',
    },
    classType: {
      type: String,
      default: 'Class 3',
    },
    userType: {
      type: String,
      default: 'Individual',
    },
    validity: {
      type: String,
      default: '1',
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid',
    },
    applicationStatus: {
      type: String,
      enum: [
        'Documents Pending',
        'Under Review',
        'eKYC Pending',
        'Processing',
        'Issued',
        'Rejected',
      ],
      default: 'Documents Pending',
    },
    documents: [
      {
        name: { type: String },
        url: { type: String },
        status: { type: String, default: 'pending' },
        _id: false,
      },
    ],
    timeline: [
      {
        event: { type: String },
        date: { type: Date },
        note: { type: String },
        _id: false,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DSCApplication', dscApplicationSchema);