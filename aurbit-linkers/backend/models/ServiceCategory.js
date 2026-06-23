const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const serviceCategorySchema = new mongoose.Schema(
  {
    // Matches a top-nav key: startup | registrations | trademark | gst | income-tax | mca | compliance | global
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: { type: String, required: true, trim: true },
    icon: { type: String, default: 'building' }, // icon name used by lucide-react on the frontend
    order: { type: Number, default: 0 },
    // Card shown on homepage grid
    summary: { type: String, trim: true, maxlength: 220 },
    // Items shown in the mega-menu dropdown for this category
    items: [serviceItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
