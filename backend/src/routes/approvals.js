const express = require('express');
const router = express.Router();
const { Request, Approval } = require('../db/models');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/approvals/pending (Manager / Admin pending list)
router.get('/pending', authenticate, requireRole(['Manager', 'Admin']), async (req, res, next) => {
  try {
    const pendingRequests = await Request.find({ status: 'PENDING_APPROVAL' });
    res.json({
      success: true,
      count: pendingRequests.length,
      requests: pendingRequests
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/approvals/history
router.get('/history', authenticate, requireRole(['Manager', 'Admin']), async (req, res, next) => {
  try {
    const history = await Approval.find({});
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
