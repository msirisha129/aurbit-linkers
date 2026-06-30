const express = require('express');
const DSCApplication = require('../models/DSCApplication');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/dsc/applications — create a new DSC application after successful payment
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      customerName,
      email,
      mobile,
      certificateType,
      classType,
      userType,
      validity,
      amount,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const applicationId = 'DSC_' + Date.now();

    const application = await DSCApplication.create({
      applicationId,
      orderId,
      paymentId: paymentId || '',
      customerName: customerName || '',
      email: email || '',
      mobile: mobile || '',
      certificateType: certificateType || 'Signature',
      classType: classType || 'Class 3',
      userType: userType || 'Individual',
      validity: validity || '1',
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
          note: 'DSC application has been submitted.',
        },
      ],
      user: req.user._id,
    });

    console.log('DSC Application created:', application.applicationId);

    return res.status(201).json({ message: 'Application created successfully', application });
  } catch (err) {
    console.error('Error creating DSC application:', err);
    return res.status(500).json({ message: 'Could not create application. Please try again.' });
  }
});

// GET /api/dsc/applications/mine — logged-in user's own DSC applications
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const applications = await DSCApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ applications });
  } catch (err) {
    console.error('Error fetching DSC applications:', err);
    return res.status(500).json({ message: 'Could not fetch applications.' });
  }
});

// GET /api/dsc/applications — admin: all DSC applications
router.get('/', requireAuth, async (req, res) => {
  // Only admin can see all
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  try {
    const applications = await DSCApplication.find().sort({ createdAt: -1 });
    return res.json({ applications });
  } catch (err) {
    console.error('Error fetching all DSC applications:', err);
    return res.status(500).json({ message: 'Could not fetch applications.' });
  }
});

// GET /api/dsc/applications/:id — get a single application by id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const application = await DSCApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    // Only allow if user owns it or is admin
    if (application.user && application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    return res.json({ application });
  } catch (err) {
    console.error('Error fetching DSC application:', err);
    return res.status(500).json({ message: 'Could not fetch application.' });
  }
});

module.exports = router;