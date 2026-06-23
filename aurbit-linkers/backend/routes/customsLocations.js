const express = require('express');
const router = express.Router();
const CustomsLocation = require('../models/CustomsLocation');

// GET /api/customs-locations?category=&search=
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) {
      // support the new merged 'icd_other' category while existing records may still use old values
      if (category === 'icd_other') filter.category = { $in: ['icd_port', 'land_port', 'icd_other'] };
      else filter.category = category;
    }
    if (search) filter.name = { $regex: search, $options: 'i' };

    const locations = await CustomsLocation.find(filter).sort({ name: 1 }).lean();
    res.json({ success: true, data: locations });
  } catch (err) {
    console.error('Error fetching customs locations', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customs locations' });
  }
});

module.exports = router;
