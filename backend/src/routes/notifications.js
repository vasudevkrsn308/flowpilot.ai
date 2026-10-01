const express = require('express');
const router = express.Router();
const { Notification } = require('../db/models');
const { authenticate } = require('../middleware/auth');

// GET /api/notifications
router.get('/', authenticate, async (req, res, next) => {
  try {
    const list = await Notification.find({ userId: req.user.id });
    const unreadCount = list.filter(n => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      notifications: list
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticate, async (req, res, next) => {
  try {
    const list = await Notification.find({ userId: req.user.id });
    for (const item of list) {
      if (!item.read) {
        await Notification.findByIdAndUpdate(item._id || item.id, { read: true });
      }
    }
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
