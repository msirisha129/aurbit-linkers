const express = require('express');
const ICEGATEApplication = require('../models/ICEGATEApplication');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/icegate/applications — create a new ICEGATE application after successful payment
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      customerName,
      email,
      mobile,
      amount,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const applicationId = 'ICE_' + Date.now();

    const application = await ICEGATEApplication.create({
      applicationId,
      orderId,
      paymentId: paymentId || '',
      customerName: customerName || '',
      email: email || '',
      mobile: mobile || '',
      amount: Number(amount) || 0,
      paymentStatus: 'Paid',
      applicationStatus: 'Documents Pending',
      documents: [],
      timeline: [
        {
          event: 'Payment Completed',
          date: new Date(),
          note: 'Payment was successfully verified.',
        },
        {
          event: 'Application Created',
          date: new Date(),
          note: 'ICEGATE registration application has been submitted.',
        },
      ],
      user: req.user._id,
    });

    console.log('ICEGATE Application created:', application.applicationId);

    return res.status(201).json({ message: 'Application created successfully', application });
  } catch (err) {
    console.error('Error creating ICEGATE application:', err);
    return res.status(500).json({ message: 'Could not create application. Please try again.' });
  }
});

// GET /api/icegate/applications/mine — logged-in user's own ICEGATE applications
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const applications = await ICEGATEApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ applications });
  } catch (err) {
    console.error('Error fetching ICEGATE applications:', err);
    return res.status(500).json({ message: 'Could not fetch applications.' });
  }
});

// GET /api/icegate/applications — admin: all ICEGATE applications
router.get('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  try {
    const applications = await ICEGATEApplication.find().sort({ createdAt: -1 });
    return res.json({ applications });
  } catch (err) {
    console.error('Error fetching all ICEGATE applications:', err);
    return res.status(500).json({ message: 'Could not fetch applications.' });
  }
});

// GET /api/icegate/applications/:id — get a single application by id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const application = await ICEGATEApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.user && application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    return res.json({ application });
  } catch (err) {
    console.error('Error fetching ICEGATE application:', err);
    return res.status(500).json({ message: 'Could not fetch application.' });
  }
});

// PUT /api/icegate/applications/:id/status — update application status (admin only)
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const { applicationStatus, timeline: newTimeline, documents } = req.body;

    const application = await ICEGATEApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (applicationStatus) {
      application.applicationStatus = applicationStatus;
    }

    if (newTimeline && Array.isArray(newTimeline)) {
      application.timeline = newTimeline;
    }

    if (documents && Array.isArray(documents)) {
      application.documents = documents;
    }

    await application.save();

    console.log('ICEGATE Application status updated:', application.applicationId);
    return res.json({ message: 'Application updated successfully', application });
  } catch (err) {
    console.error('Error updating ICEGATE application:', err);
    return res.status(500).json({ message: 'Could not update application.' });
  }
});

module.exports = router;
