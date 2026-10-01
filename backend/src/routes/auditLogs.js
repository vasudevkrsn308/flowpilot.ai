const express = require('express');
const router = express.Router();
const { AuditLog } = require('../db/models');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/audit-logs (Admin / Manager)
router.get('/', authenticate, requireRole(['Admin', 'Manager']), async (req, res, next) => {
  try {
    const { entityType, action, search } = req.query;
    let filter = {};

    if (entityType && entityType !== 'ALL') {
      filter.entityType = entityType;
    }
    if (action && action !== 'ALL') {
      filter.action = action;
    }

    let logs = await AuditLog.find(filter);

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        (l.summary && l.summary.toLowerCase().includes(q)) ||
        (l.actorName && l.actorName.toLowerCase().includes(q)) ||
        (l.entityId && l.entityId.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
