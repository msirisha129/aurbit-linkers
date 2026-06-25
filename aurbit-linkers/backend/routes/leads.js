const express = require('express');
const { body, validationResult } = require('express-validator');

const Lead = require('../models/Lead');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/leads  (public - anyone clicking "Get Started" / a service link / contact form)
router.post('/', [body('name').trim().notEmpty().withMessage('Name is required')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Lead creation - express-validator errors:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
      // For ICEGATE location requests we relax email/phone requirement
        const { name, email, phone, serviceSlug, serviceName, category, message, source } = req.body;
        // Log when ICEGATE flow is used
        if (source === 'icegate-location-selector') {
          console.log('ICEGATE Location Request:', req.body);
        }
        // Validate email for normal leads (not icegate-location-selector)
        if (source !== 'icegate-location-selector') {
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.log('Lead creation - email validation failed for body:', { email });
            return res.status(400).json({ message: 'Enter a valid email' });
          }
        }
        // Log full incoming body for trace
        console.log('Lead creation - req.body:', req.body);
        // Accept either `customsLocations` (plural) or `customLocations` (common typo)
        const customsLocations = req.body.customsLocations || req.body.customLocations || [];
        console.log('Lead creation - received custom locations (raw):', { customsLocations, customLocations: req.body.customLocations });

      let lead;
      const leadData = {
        name,
        email,
        phone,
        serviceSlug,
        serviceName,
        category,
        message,
        source: source || 'website',
        customsLocations: Array.isArray(customsLocations) ? customsLocations : [],
        user: req.user ? req.user._id : null,
      };
      if (source === 'icegate-location-selector') {
        // Skip mongoose schema validation for ICEGATE short requests (email/phone optional)
        lead = new Lead(leadData);
        await lead.save({ validateBeforeSave: false });
      } else {
        lead = await Lead.create(leadData);
      }
      // Log saved document to verify persistence
      console.log('Saved customs locations:', lead.customsLocations);
      console.log('Lead saved - full doc id:', lead._id);

      return res.status(201).json({ message: 'Thanks! Our team will reach out shortly.', lead });
    } catch (err) {
      console.error('Lead creation error:', err);
      return res.status(500).json({ message: 'Could not submit your request. Please try again.' });
    }
  }
);

// GET /api/leads (authenticated users - demo mode: any logged-in user can view all enquiries)
router.get('/', requireAuth, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  console.log('GET /api/leads - returning leads count', leads.length);
  // log first lead customsLocations for quick trace (if any)
  if (leads.length > 0) console.log('Sample lead.customsLocations:', leads[0].customsLocations);
  return res.json({ leads });
});

// GET /api/leads/mine (logged-in user's own submitted enquiries)
router.get('/mine', requireAuth, async (req, res) => {
  const leads = await Lead.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json({ leads });
});

// GET /api/leads/:id (admin only)
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    console.log('GET /api/leads/:id - lead.customsLocations:', lead.customsLocations);
    return res.json({ lead });
  } catch (err) {
    console.error('Get lead error:', err);
    return res.status(500).json({ message: 'Could not fetch lead' });
  }
});

// PUT /api/leads/:id/status (admin only) - update status
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.status = status;
    lead.updatedAt = new Date();
    await lead.save();
    return res.json({ message: 'Status updated', lead });
  } catch (err) {
    console.error('Update lead status error:', err);
    return res.status(500).json({ message: 'Could not update status' });
  }
});

// PATCH /api/leads/:id - update fields like notes or status (admin only)
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const { notes, status } = req.body;
    if (typeof notes !== 'undefined') lead.notes = notes;
    if (typeof status !== 'undefined') lead.status = status;
    lead.updatedAt = new Date();
    await lead.save();
    return res.json({ message: 'Lead updated', lead });
  } catch (err) {
    console.error('Patch lead error:', err);
    return res.status(500).json({ message: 'Could not update lead' });
  }
});

// DELETE /api/leads/:id (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    await lead.remove();
    return res.json({ message: 'Lead deleted' });
  } catch (err) {
    console.error('Delete lead error:', err);
    return res.status(500).json({ message: 'Could not delete lead' });
  }
});



module.exports = router;
