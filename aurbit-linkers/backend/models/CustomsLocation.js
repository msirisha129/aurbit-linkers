const mongoose = require('mongoose');

const CustomsLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: {
      type: String,
      enum: ['sea_port', 'airport', 'icd_other'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomsLocation', CustomsLocationSchema);
