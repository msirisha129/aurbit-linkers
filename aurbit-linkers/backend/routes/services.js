const express = require('express');
const ServiceCategory = require('../models/ServiceCategory');

const router = express.Router();

// GET /api/services -> all categories with their menu items, ordered for nav
router.get('/', async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ order: 1 });
    return res.json({ categories });
  } catch (err) {
    console.error('Fetch services error:', err);
    return res.status(500).json({ message: 'Could not load services.' });
  }
});

// GET /api/services/:key -> single category detail
router.get('/:key', async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({ key: req.params.key.toLowerCase() });
    if (!category) {
      return res.status(404).json({ message: 'Service category not found.' });
    }
    return res.json({ category });
  } catch (err) {
    console.error('Fetch service error:', err);
    return res.status(500).json({ message: 'Could not load this service category.' });
  }
});

module.exports = router;
