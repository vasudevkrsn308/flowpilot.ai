const { Request, Approval, ProcurementTask, Notification, User } = require('../db/models');
const auditService = require('./auditService');

const workflowEngine = {
  /**
   * Initialize standard workflow pipeline steps for a new request
   */
  generateInitialSteps(policyResult, structuredData) {
    const approverRole = policyResult.approvalLevel || 'Manager';
    const now = new Date();

    return [
      {
        id: 'step-1',
        name: 'Request Created',
        status: 'DONE',
        timestamp: now,
        details: 'Plain language requisition submitted and queued for ingestion'
      },
      {
        id: 'step-2',
        name: 'AI Analysis',
        status: 'DONE',
        timestamp: now,
        details: `Identified ${structuredData.items?.length || 1} item(s) in category: "${structuredData.category}" with estimated value ${structuredData.currency} ${structuredData.estimatedAmount?.toLocaleString()}`
      },
      {
        id: 'step-3',
        name: 'Policy Check',
        status: 'DONE',
        timestamp: now,
        details: policyResult.reason || 'Corporate spend limits verified'
      },
      {
        id: 'step-4',
        name: `${approverRole} Approval`,
        status: 'CURRENT',
        timestamp: now,
        details: `Awaiting formal decision and authorization from ${approverRole}`
      },
      {
        id: 'step-5',
        name: 'Procurement',
        status: 'UPCOMING',
        timestamp: null,
        details: 'Automated vendor purchase order dispatch & asset registration'
      },
      {
        id: 'step-6',
        name: 'Completed',
        status: 'UPCOMING',
        timestamp: null,
        details: 'Physical delivery confirmation and asset assignment'
      }
    ];
  },

  /**
   * Handle manager/admin approval or rejection decision
   */
  async processDecision({ requestId, decision, comment, actor }) {
    const req = await Request.findById(requestId);
    if (!req) {
      throw new Error(`Request with ID ${requestId} not found`);
    }

    if (req.status !== 'PENDING_APPROVAL' && req.status !== 'DRAFT') {
      throw new Error(`Request is already in ${req.status} state`);
    }

    const now = new Date();

    // 1. Record Approval entry
    const approvalRecord = await Approval.create({
      requestId: String(req._id || req.id),
      approverId: String(actor.id || actor._id),
      approverName: actor.name || 'Approver',
      approverRole: actor.role || 'Manager',
      decision,
      comment: comment || (decision === 'APPROVED' ? 'Approved for fulfillment' : 'Declined per team budget'),
      createdAt: now
    });

    let updatedSteps = [...(req.workflowSteps || [])];
    let newStatus = req.status;
    let procurementTask = null;

    if (decision === 'APPROVED') {
      newStatus = 'APPROVED';

      // Update Step 4 (Approval) to DONE
      // Update Step 5 (Procurement) to CURRENT
      updatedSteps = updatedSteps.map(s => {
        if (s.name.includes('Approval')) {
          return { ...s, status: 'DONE', timestamp: now, details: `Authorized by ${actor.name} (${actor.role}): "${comment || 'Approved'}"` };
        }
        if (s.name.includes('Procurement')) {
          return { ...s, status: 'CURRENT', timestamp: now, details: 'Purchase Order generated. Transmitted to IT Procurement team.' };
        }
        return s;
      });

      // Generate Downstream Procurement Task
      const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDays = req.structuredData?.priority === 'High' ? 2 : 5;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

      procurementTask = await ProcurementTask.create({
        requestId: String(req._id || req.id),
        type: 'PROCUREMENT',
        title: `Procurement for ${req.category || 'IT Equipment'}`,
        status: 'OPEN',
        assignedTo: 'Central IT Procurement Desk',
        vendor: req.category?.includes('Hardware') ? 'Dell & Apple Enterprise Fulfillment' : 'Corporate Authorized Supplier',
        estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        details: {
          items: req.structuredData?.items || [],
          totalAmount: req.structuredData?.estimatedAmount || 0,
          currency: req.structuredData?.currency || 'INR',
          poNumber,
          notes: `Automated PO triggered by FlowPilot AI after Manager Approval by ${actor.name}`
        }
      });

      // Notify Requester
      await Notification.create({
        userId: String(req.userId),
        message: `🎉 Great news! Your request "${req.rawText.substring(0, 45)}..." was APPROVED by ${actor.name}. Procurement Order ${poNumber} has been opened.`,
        type: 'SUCCESS',
        link: `/requests/${req._id || req.id}`
      });

      // Audit Log
      await auditService.log({
        entityType: 'REQUEST',
        entityId: req._id || req.id,
        action: 'APPROVED',
        actorId: actor.id || actor._id,
        actorName: actor.name,
        actorRole: actor.role,
        summary: `Request approved by ${actor.name} (${actor.role}). Created Procurement Task ${poNumber}.`,
        metadata: { decision, comment, poNumber, taskId: procurementTask._id || procurementTask.id }
      });

      await auditService.log({
        entityType: 'TASK',
        entityId: procurementTask._id || procurementTask.id,
        action: 'TASK_GENERATED',
        actorId: 'SYSTEM',
        actorName: 'FlowPilot Automation Engine',
        actorRole: 'SYSTEM',
        summary: `Downstream Procurement Order ${poNumber} created automatically for ${req.category}.`,
        metadata: { poNumber, estimatedDeliveryDate: procurementTask.estimatedDeliveryDate }
      });

    } else {
      // REJECTED
      newStatus = 'REJECTED';
      updatedSteps = updatedSteps.map(s => {
        if (s.name.includes('Approval')) {
          return { ...s, status: 'REJECTED', timestamp: now, details: `Declined by ${actor.name}: "${comment || 'Budget constraints'}"` };
        }
        return s;
      });

      // Notify Requester
      await Notification.create({
        userId: String(req.userId),
        message: `Your request "${req.rawText.substring(0, 45)}..." was declined by ${actor.name}: ${comment || 'Budget constraints'}`,
        type: 'WARNING',
        link: `/requests/${req._id || req.id}`
      });

      // Audit Log
      await auditService.log({
        entityType: 'REQUEST',
        entityId: req._id || req.id,
        action: 'REJECTED',
        actorId: actor.id || actor._id,
        actorName: actor.name,
        actorRole: actor.role,
        summary: `Request rejected by ${actor.name} (${actor.role}). Reason: ${comment || 'No comment'}`,
        metadata: { decision, comment }
      });
    }

    // Update Request
    const updatedRequest = await Request.findByIdAndUpdate(
      req._id || req.id,
      {
        status: newStatus,
        workflowSteps: updatedSteps,
        currentStep: decision === 'APPROVED' ? 'Procurement' : 'Rejected'
      },
      { new: true }
    );

    return {
      request: updatedRequest,
      approval: approvalRecord,
      procurementTask
    };
  },

  /**
   * Advance Procurement task to In Progress or Completed
   */
  async updateTaskStatus({ taskId, newStatus, actor }) {
    const task = await ProcurementTask.findById(taskId);
    if (!task) throw new Error(`Task with id ${taskId} not found`);

    const updatedTask = await ProcurementTask.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true }
    );

    // If completed, update parent request step
    if (newStatus === 'COMPLETED') {
      const parentReq = await Request.findById(task.requestId);
      if (parentReq) {
        const now = new Date();
        const steps = (parentReq.workflowSteps || []).map(s => {
          if (s.name.includes('Procurement')) return { ...s, status: 'DONE', timestamp: now };
          if (s.name.includes('Completed')) return { ...s, status: 'DONE', timestamp: now, details: 'Assets delivered and confirmed received' };
          return s;
        });

        await Request.findByIdAndUpdate(parentReq._id || parentReq.id, {
          status: 'COMPLETED',
          currentStep: 'Completed',
          workflowSteps: steps
        });

        await Notification.create({
          userId: String(parentReq.userId),
          message: `📦 Shipment Completed! Your requisition "${parentReq.rawText.substring(0, 40)}..." has arrived.`,
          type: 'SUCCESS',
          link: `/requests/${parentReq._id || parentReq.id}`
        });

        await auditService.log({
          entityType: 'TASK',
          entityId: taskId,
          action: 'COMPLETED',
          actorId: actor.id || actor._id,
          actorName: actor.name,
          actorRole: actor.role,
          summary: `Procurement fulfillment completed for Request #${parentReq._id || parentReq.id}.`,
          metadata: { newStatus }
        });
      }
    }

    return updatedTask;
  }
};

module.exports = workflowEngine;
