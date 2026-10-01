const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { WorkflowTemplate } = require('../db/models');
const { authenticate, requireRole } = require('../middleware/auth');
const aiService = require('../services/aiService');
const auditService = require('../services/auditService');

const generateSchema = z.object({
  description: z.string().min(5, 'Please provide a clear description of the workflow to automate')
});

// POST /api/workflow-templates/generate (WOW Feature AI Generation)
router.post('/generate', authenticate, requireRole(['Admin', 'Manager']), async (req, res, next) => {
  try {
    const parseResult = generateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: parseResult.error.flatten().fieldErrors
      });
    }

    const { description } = parseResult.data;
    const generatedTemplate = await aiService.generateWorkflowTemplate(description);

    res.json({
      success: true,
      message: 'Workflow template successfully synthesized by FlowPilot AI',
      template: generatedTemplate
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/workflow-templates (Save a template)
router.post('/', authenticate, requireRole(['Admin']), async (req, res, next) => {
  try {
    const { name, description, category, definition, isActive = true } = req.body;
    if (!name || !definition) {
      return res.status(400).json({ success: false, message: 'Name and definition are required' });
    }

    const template = await WorkflowTemplate.create({
      name,
      description: description || '',
      category: category || 'Operations',
      definition,
      isActive,
      createdByName: req.user.name
    });

    await auditService.log({
      entityType: 'WORKFLOW',
      entityId: template._id || template.id,
      action: 'CREATED',
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      summary: `Admin created workflow template: "${name}"`,
      metadata: { name, category }
    });

    res.status(201).json({
      success: true,
      message: 'Workflow template created and saved',
      template
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/workflow-templates
router.get('/', authenticate, async (req, res, next) => {
  try {
    const templates = await WorkflowTemplate.find({});
    res.json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/workflow-templates/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const template = await WorkflowTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (err) {
    next(err);
  }
});

// POST /api/workflow-templates/:id/activate (Toggle active/inactive status)
router.post('/:id/activate', authenticate, requireRole(['Admin']), async (req, res, next) => {
  try {
    const template = await WorkflowTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Workflow template not found' });
    }

    const nextState = !template.isActive;
    const updated = await WorkflowTemplate.findByIdAndUpdate(
      req.params.id,
      { isActive: nextState },
      { new: true }
    );

    await auditService.log({
      entityType: 'WORKFLOW',
      entityId: req.params.id,
      action: nextState ? 'ACTIVATED' : 'DEACTIVATED',
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      summary: `Admin ${nextState ? 'activated' : 'deactivated'} workflow template "${template.name}"`,
      metadata: { isActive: nextState }
    });

    res.json({
      success: true,
      message: `Workflow "${template.name}" is now ${nextState ? 'Active' : 'Inactive'}`,
      template: updated
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
