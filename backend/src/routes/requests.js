const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { Request, User, Approval, ProcurementTask, Notification, AuditLog } = require('../db/models');
const { authenticate, requireRole } = require('../middleware/auth');
const aiService = require('../services/aiService');
const { evaluatePolicy } = require('../services/policyEngine');
const workflowEngine = require('../services/workflowEngine');
const auditService = require('../services/auditService');

// Request body validation
const createRequestSchema = z.object({
  rawText: z.string().min(5, 'Please provide at least a few words describing your request'),
  department: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional()
});

// POST /api/requests/analyze-preview (Live interactive AI test before submit)
router.post('/analyze-preview', authenticate, async (req, res, next) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ success: false, message: 'rawText is required' });
    }

    const structuredData = await aiService.analyzeRequest(rawText);
    const policyResult = evaluatePolicy(structuredData, req.user);

    res.json({
      success: true,
      structuredData,
      policyResult
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/requests (Full end-to-end creation)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const parseResult = createRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: parseResult.error.flatten().fieldErrors
      });
    }

    const { rawText, department } = parseResult.data;

    // 1. AI Analysis via Gemini LLM or Heuristics
    const structuredData = await aiService.analyzeRequest(rawText);
    if (parseResult.data.priority) {
      structuredData.priority = parseResult.data.priority;
    }

    // 2. Policy Engine evaluation
    const policyResult = evaluatePolicy(structuredData, req.user);

    // 3. Workflow Steps definition
    const workflowSteps = workflowEngine.generateInitialSteps(policyResult, structuredData);

    // 4. Find assigned manager for approval routing
    let assignedManager = await User.findOne({ role: 'Manager' });
    let assignedApproverId = assignedManager ? String(assignedManager._id || assignedManager.id) : null;
    let assignedApproverName = assignedManager ? assignedManager.name : 'Engineering Manager';

    // 5. Create Request Record
    const newRequest = await Request.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      rawText,
      category: structuredData.category || 'Hardware & IT Equipment',
      structuredData,
      status: policyResult.passed ? 'PENDING_APPROVAL' : 'REJECTED',
      policyResult,
      assignedApproverId,
      assignedApproverName,
      currentStep: policyResult.passed ? (policyResult.approvalLevel + ' Approval') : 'Policy Rejection',
      workflowSteps
    });

    const reqId = String(newRequest._id || newRequest.id);

    // 6. Notifications
    // Notify Requester
    await Notification.create({
      userId: req.user.id,
      message: `Requisition created: "${rawText.substring(0, 45)}...". AI has routed this to ${assignedApproverName} for authorization.`,
      type: 'INFO',
      link: `/requests/${reqId}`
    });

    // Notify Manager
    if (assignedApproverId) {
      await Notification.create({
        userId: assignedApproverId,
        message: `⚡ New Approval Required: ${req.user.name} requested ${structuredData.items?.length || 1} item(s) (${structuredData.currency} ${structuredData.estimatedAmount?.toLocaleString()}).`,
        type: 'ACTION_REQUIRED',
        link: `/requests/${reqId}`
      });
    }

    // 7. Enterprise Audit Logging
    await auditService.log({
      entityType: 'REQUEST',
      entityId: reqId,
      action: 'CREATED',
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      summary: `Employee submitted request: "${rawText.substring(0, 50)}..."`,
      metadata: { rawText }
    });

    await auditService.log({
      entityType: 'REQUEST',
      entityId: reqId,
      action: 'ANALYZED',
      actorId: 'SYSTEM',
      actorName: 'FlowPilot Gemini AI Engine',
      actorRole: 'SYSTEM',
      summary: `AI parsed ${structuredData.items?.length} item(s), estimated value ${structuredData.currency} ${structuredData.estimatedAmount}.`,
      metadata: structuredData
    });

    await auditService.log({
      entityType: 'REQUEST',
      entityId: reqId,
      action: 'POLICY_EVALUATED',
      actorId: 'SYSTEM',
      actorName: 'FlowPilot Policy Matrix',
      actorRole: 'SYSTEM',
      summary: `Policy check: ${policyResult.approvalLevel} Approval Required (${policyResult.budgetStatus}).`,
      metadata: policyResult
    });

    res.status(201).json({
      success: true,
      message: 'Request created and workflow initialized successfully',
      request: newRequest
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/requests (Role-filtered)
router.get('/', authenticate, async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'Employee') {
      filter = { userId: req.user.id };
    }
    // Managers and Admins see all requests

    const requests = await Request.find(filter);
    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/requests/:id (Details with approvals, tasks, audit history)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Check permissions: Employee can only view own request
    if (req.user.role === 'Employee' && String(request.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied to this request' });
    }

    const strId = String(request._id || request.id);
    const approvals = await Approval.find({ requestId: strId });
    const tasks = await ProcurementTask.find({ requestId: strId });
    const auditLogs = await AuditLog.find({ entityId: strId });

    res.json({
      success: true,
      request,
      approvals,
      tasks,
      auditLogs
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/requests/:id/approve (Manager / Admin decision)
router.post('/:id/approve', authenticate, requireRole(['Manager', 'Admin']), async (req, res, next) => {
  try {
    const { decision, comment } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'decision must be APPROVED or REJECTED' });
    }

    const result = await workflowEngine.processDecision({
      requestId: req.params.id,
      decision,
      comment,
      actor: req.user
    });

    res.json({
      success: true,
      message: `Request successfully marked as ${decision}`,
      ...result
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/requests/:id/decide (System / Manager / Admin decision alias)
router.post('/:id/decide', authenticate, requireRole(['Manager', 'Admin']), async (req, res, next) => {
  try {
    const { decision, comment } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'decision must be APPROVED or REJECTED' });
    }

    const result = await workflowEngine.processDecision({
      requestId: req.params.id,
      decision,
      comment,
      actor: req.user
    });

    res.json({
      success: true,
      message: `Decision recorded: ${decision}`,
      ...result
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/requests/:id/analyze (Re-run AI Cognitive Analysis)
router.post('/:id/analyze', authenticate, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const rawText = req.body.rawText || request.rawText;
    const structuredData = await aiService.analyzeRequest(rawText);
    const policyResult = evaluatePolicy(structuredData, req.user);

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      {
        rawText,
        structuredData,
        policyResult,
        category: structuredData.category || request.category
      },
      { new: true }
    );

    await auditService.log({
      entityType: 'REQUEST',
      entityId: req.params.id,
      action: 'RE_ANALYZED',
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      summary: `AI Re-analysis executed by ${req.user.name}`,
      metadata: structuredData
    });

    res.json({
      success: true,
      message: 'Request re-analyzed successfully',
      request: updated
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
