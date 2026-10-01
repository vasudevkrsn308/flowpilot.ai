const { AuditLog } = require('../db/models');

const auditService = {
  async log({
    entityType,
    entityId,
    action,
    actorId = 'SYSTEM',
    actorName = 'FlowPilot Engine',
    actorRole = 'SYSTEM',
    summary,
    metadata = {}
  }) {
    try {
      const record = await AuditLog.create({
        entityType,
        entityId: String(entityId),
        action,
        actorId: String(actorId),
        actorName,
        actorRole,
        summary,
        metadata,
        createdAt: new Date()
      });
      return record;
    } catch (err) {
      console.error('[AuditService] Failed to record audit entry:', err.message);
      return null;
    }
  },

  async getRecentLogs(limit = 100, filter = {}) {
    return AuditLog.find(filter);
  }
};

module.exports = auditService;
