const express = require('express');
const router = express.Router();
const { ProcurementTask } = require('../db/models');
const { authenticate, requireRole } = require('../middleware/auth');
const workflowEngine = require('../services/workflowEngine');

// GET /api/tasks
router.get('/', authenticate, async (req, res, next) => {
  try {
    const tasks = await ProcurementTask.find({});
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks (Create a task)
router.post('/', authenticate, requireRole(['Manager', 'Admin']), async (req, res, next) => {
  try {
    const { requestId, title, type = 'PROCUREMENT', assignedTo, vendor, estimatedDeliveryDate, details = {} } = req.body;
    if (!requestId || !title) {
      return res.status(400).json({ success: false, message: 'requestId and title are required' });
    }

    const task = await ProcurementTask.create({
      requestId,
      title,
      type,
      status: 'OPEN',
      assignedTo: assignedTo || 'Central IT Procurement Desk',
      vendor: vendor || 'Corporate Authorized Supplier',
      estimatedDeliveryDate: estimatedDeliveryDate || '3 Business Days',
      details
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id (Update task status)
router.patch('/:id', authenticate, requireRole(['Manager', 'Admin']), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updatedTask = await workflowEngine.updateTaskStatus({
      taskId: req.params.id,
      newStatus: status,
      actor: req.user
    });

    res.json({
      success: true,
      message: `Task status updated to ${status}`,
      task: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
