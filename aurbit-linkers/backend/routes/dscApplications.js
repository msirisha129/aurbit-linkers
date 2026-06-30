const express = require('express');
const fs = require('fs');
const DSCApplication = require('../models/DSCApplication');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

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

// PUT /api/dsc/applications/:id/status — update application status (admin only)
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const { applicationStatus, timeline: newTimeline, documents } = req.body;

    const application = await DSCApplication.findById(req.params.id);
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

    console.log('DSC Application status updated:', application.applicationId);
    return res.json({ message: 'Application updated successfully', application });
  } catch (err) {
    console.error('Error updating DSC application:', err);
    return res.status(500).json({ message: 'Could not update application.' });
  }
});

// POST /api/dsc/applications/:id/documents — upload document
router.post('/:id/documents', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { documentName } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!documentName) {
      return res.status(400).json({ message: 'Document name is required' });
    }

    const application = await DSCApplication.findOne({ applicationId: req.params.id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user owns the application or is admin
    if (application.user && application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const newDocument = {
      name: documentName,
      fileName: req.file.originalname,
      url: fileUrl,
      filePath: path.join(__dirname, '../uploads', req.file.filename),
      uploadedAt: new Date(),
      status: 'Uploaded',
    };

    // Remove existing document with same name if exists
    application.documents = application.documents.filter(doc => doc.name !== documentName);
    application.documents.push(newDocument);

    // Add timeline event
    application.timeline.push({
      event: `${documentName} Uploaded`,
      date: new Date(),
      note: `Document "${documentName}" has been uploaded.`,
    });

    await application.save();

    console.log('Document uploaded:', documentName, 'for application:', application.applicationId);
    return res.json({ message: 'Document uploaded successfully', document: newDocument, application });
  } catch (err) {
    console.error('Error uploading document:', err);
    return res.status(500).json({ message: 'Could not upload document.' });
  }
});

// GET /api/applications/documents/:documentId — serve document file
router.get('/documents/:documentId', async (req, res) => {
  try {
    // This is a simplified version - in production, you'd validate access
    const filePath = path.join(__dirname, '../uploads', req.params.documentId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error('Error serving document:', err);
    return res.status(500).json({ message: 'Could not retrieve document.' });
  }
});

module.exports = router;
