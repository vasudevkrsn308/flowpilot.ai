const bcrypt = require('bcryptjs');
const { connectDB } = require('./db');
const { User, Request, ProcurementTask, Notification, AuditLog, WorkflowTemplate, Approval } = require('./models');

async function seedData() {
  console.log('[Seed] Seeding FlowPilot AI demo database...');
  await connectDB();

  // Clear existing records to ensure fresh demo state
  await User.deleteMany({});
  await Request.deleteMany({});
  await ProcurementTask.deleteMany({});
  await Notification.deleteMany({});
  await AuditLog.deleteMany({});
  await WorkflowTemplate.deleteMany({});
  await Approval.deleteMany({});

  const pwHash = await bcrypt.hash('password123', 10);

  // 1. Create Demo Users
  const employee = await User.create({
    name: 'Alex Morgan',
    email: 'employee@flowpilot.ai',
    passwordHash: pwHash,
    role: 'Employee',
    department: 'Engineering'
  });

  const manager = await User.create({
    name: 'Sarah Jenkins',
    email: 'manager@flowpilot.ai',
    passwordHash: pwHash,
    role: 'Manager',
    department: 'Engineering Leadership'
  });

  const admin = await User.create({
    name: 'Devon Vance',
    email: 'admin@flowpilot.ai',
    passwordHash: pwHash,
    role: 'Admin',
    department: 'IT Operations & Infrastructure'
  });

  const empId = String(employee._id || employee.id);
  const mgrId = String(manager._id || manager.id);
  const admId = String(admin._id || admin.id);

  console.log('[Seed] Created demo users: employee@flowpilot.ai, manager@flowpilot.ai, admin@flowpilot.ai');

  // 2. Create Workflow Templates
  const hwTemplate = await WorkflowTemplate.create({
    name: 'Employee Laptop & Hardware Provisioning',
    category: 'IT Procurement',
    description: 'Standard end-to-end procurement and asset allocation workflow for employee developer laptops and hardware.',
    isActive: true,
    createdByName: admin.name,
    definition: {
      trigger: 'Plain-language employee hardware requisition',
      classificationNode: {
        model: 'Gemini 1.5 Flash',
        features: ['Quantity extraction', 'Specs classification', 'Budget normalization']
      },
      policyRules: [
        { ruleId: 'POL-01', name: 'Spend Threshold Check', condition: 'Amount > ₹25,000', action: 'Route to Direct Department Manager' },
        { ruleId: 'POL-02', name: 'Approved Vendor Routing', condition: 'Brand in [Apple, Dell, Lenovo]', action: 'Assign enterprise catalog pricing' }
      ],
      approvalSteps: [
        { stepIndex: 1, role: 'Engineering Manager', timeoutHours: 24, autoEscalate: true }
      ],
      downstreamTasks: [
        { task: 'Dispatch Automated Purchase Order', system: 'ERP Procurement Engine', status: 'Automated' },
        { task: 'Asset Tag & MDM Enrollment', system: 'Jamf / Intune MDM', status: 'Automated' }
      ],
      notifications: [
        { channel: 'In-App Portal', target: 'Requester & Approver' },
        { channel: 'Slack #procurement-alerts', target: 'IT Helpdesk' }
      ]
    }
  });

  const saasTemplate = await WorkflowTemplate.create({
    name: 'SaaS Tool & Cloud Software License Approval',
    category: 'Software Operations',
    description: 'Security compliance and budget verification for dev tools, Figma seats, GitHub Copilot, and cloud licenses.',
    isActive: true,
    createdByName: admin.name,
    definition: {
      trigger: 'Employee software license request',
      classificationNode: {
        model: 'Gemini 1.5 Flash',
        features: ['License Seat Count', 'SOC2 / Vendor Security Audit', 'Pricing Schedule']
      },
      policyRules: [
        { ruleId: 'SEC-01', name: 'SOC-2 Compliance Verification', condition: 'Vendor meets ISO/SOC2', action: 'Allow provisioning' },
        { ruleId: 'BUD-02', name: 'Department Budget Head Check', condition: 'Annual Cost > $1,000', action: 'VP Approval Required' }
      ],
      approvalSteps: [
        { stepIndex: 1, role: 'Department Manager', timeoutHours: 12, autoEscalate: false },
        { stepIndex: 2, role: 'InfoSec Compliance Lead', timeoutHours: 24, autoEscalate: true }
      ],
      downstreamTasks: [
        { task: 'Okta SSO Provisioning', system: 'Identity Provider API', status: 'Automated' }
      ],
      notifications: [
        { channel: 'In-App Notification', target: 'Employee' },
        { channel: 'Slack', target: '#infosec-approvals' }
      ]
    }
  });

  // 3. Create Sample Requests
  // Request 1: PENDING_APPROVAL (The flagship employee laptop procurement!)
  const req1 = await Request.create({
    userId: empId,
    userName: employee.name,
    userEmail: employee.email,
    rawText: 'I need 5 laptops for new hires, budget ₹75,000.',
    category: 'Hardware & IT Equipment',
    structuredData: {
      category: 'Hardware & IT Equipment',
      items: [
        { type: 'Laptop Computer', quantity: 5, description: '5x Core i7 Enterprise Laptops for Q4 new hire engineering cohort' }
      ],
      estimatedAmount: 75000,
      currency: 'INR',
      priority: 'Medium',
      urgencyReason: 'Scheduled start date for onboardees is in 2 weeks',
      suggestedApprovalRequired: true,
      suggestedApproverRole: 'Manager',
      sentimentOrIntent: 'Standard new hire hardware requisition'
    },
    status: 'PENDING_APPROVAL',
    policyResult: {
      passed: true,
      requiresApproval: true,
      approvalLevel: 'Manager',
      reason: 'Requires Department Manager authorization (INR 75,000) per corporate spend policy.',
      matchedRules: [
        'POL-02: Standard Tier Requisition (₹15,001 - ₹1,00,000)',
        'POL-HW: Standard IT Hardware Catalog verification active'
      ],
      budgetStatus: 'STANDARD_MANAGER_REQUIRED'
    },
    assignedApproverId: mgrId,
    assignedApproverName: manager.name,
    currentStep: 'Manager Approval',
    workflowSteps: [
      { id: 'step-1', name: 'Request Created', status: 'DONE', timestamp: new Date(Date.now() - 3600000), details: 'Requisition submitted by Alex Morgan' },
      { id: 'step-2', name: 'AI Analysis', status: 'DONE', timestamp: new Date(Date.now() - 3500000), details: 'Gemini parsed 5 laptop units, category: Hardware, ₹75,000 total' },
      { id: 'step-3', name: 'Policy Check', status: 'DONE', timestamp: new Date(Date.now() - 3400000), details: 'Policy verified: Requires Manager authorization' },
      { id: 'step-4', name: 'Manager Approval', status: 'CURRENT', timestamp: new Date(Date.now() - 3300000), details: 'Awaiting review from Sarah Jenkins' },
      { id: 'step-5', name: 'Procurement', status: 'UPCOMING', timestamp: null, details: 'Purchase Order dispatch' },
      { id: 'step-6', name: 'Completed', status: 'UPCOMING', timestamp: null, details: 'Final delivery & inventory check' }
    ]
  });

  // Request 2: APPROVED with an Open Procurement Task
  const req2 = await Request.create({
    userId: empId,
    userName: employee.name,
    userEmail: employee.email,
    rawText: 'Ergonomic task chairs (3 units) for the design pod, budget ₹42,000',
    category: 'Office Infrastructure & Ergonomics',
    structuredData: {
      category: 'Office Infrastructure & Ergonomics',
      items: [
        { type: 'Ergonomic Chair', quantity: 3, description: '3x Lumbar-supported mesh task chairs' }
      ],
      estimatedAmount: 42000,
      currency: 'INR',
      priority: 'Low',
      urgencyReason: 'Workstation upgrade for UX designers',
      suggestedApprovalRequired: true,
      suggestedApproverRole: 'Manager',
      sentimentOrIntent: 'Ergonomics upgrade'
    },
    status: 'APPROVED',
    policyResult: {
      passed: true,
      requiresApproval: true,
      approvalLevel: 'Manager',
      reason: 'Requires Department Manager authorization per corporate spend policy.',
      matchedRules: ['POL-02: Standard Tier Requisition'],
      budgetStatus: 'WITHIN_THRESHOLD'
    },
    assignedApproverId: mgrId,
    assignedApproverName: manager.name,
    currentStep: 'Procurement',
    workflowSteps: [
      { id: 'step-1', name: 'Request Created', status: 'DONE', timestamp: new Date(Date.now() - 86400000), details: 'Requisition submitted by Alex Morgan' },
      { id: 'step-2', name: 'AI Analysis', status: 'DONE', timestamp: new Date(Date.now() - 86000000), details: 'AI parsed 3 ergonomic chairs, ₹42,000' },
      { id: 'step-3', name: 'Policy Check', status: 'DONE', timestamp: new Date(Date.now() - 85000000), details: 'Policy verified: Manager level' },
      { id: 'step-4', name: 'Manager Approval', status: 'DONE', timestamp: new Date(Date.now() - 43200000), details: 'Approved by Sarah Jenkins: "Approved. Essential for design team comfort."' },
      { id: 'step-5', name: 'Procurement', status: 'CURRENT', timestamp: new Date(Date.now() - 43000000), details: 'PO-2026-449102 generated and sent to vendor' },
      { id: 'step-6', name: 'Completed', status: 'UPCOMING', timestamp: null, details: 'Shipment in transit' }
    ]
  });

  const task2 = await ProcurementTask.create({
    requestId: String(req2._id || req2.id),
    type: 'PROCUREMENT',
    title: 'Procurement for Office Infrastructure & Ergonomics',
    status: 'IN_PROGRESS',
    assignedTo: 'Central IT Procurement Desk',
    vendor: 'Featherlite Corporate Commercial Furnishings',
    estimatedDeliveryDate: 'Oct 6, 2026',
    details: {
      items: [{ type: 'Ergonomic Task Chair', quantity: 3, description: 'Lumbar mesh chair' }],
      totalAmount: 42000,
      currency: 'INR',
      poNumber: 'PO-2026-449102',
      notes: 'Vendor has confirmed dispatch for Monday delivery'
    }
  });

  // Request 3: COMPLETED
  const req3 = await Request.create({
    userId: empId,
    userName: employee.name,
    userEmail: employee.email,
    rawText: '2x 4K UltraSharp Dell 27-inch monitors for frontend development workstation',
    category: 'Hardware & IT Equipment',
    structuredData: {
      category: 'Hardware & IT Equipment',
      items: [{ type: '4K External Monitor', quantity: 2, description: 'Dell UltraSharp 27" USB-C Hub Monitor' }],
      estimatedAmount: 58000,
      currency: 'INR',
      priority: 'Medium',
      urgencyReason: 'Dual monitor setup needed for responsive frontend testing',
      suggestedApprovalRequired: true,
      suggestedApproverRole: 'Manager',
      sentimentOrIntent: 'Workstation productivity monitor setup'
    },
    status: 'COMPLETED',
    policyResult: {
      passed: true,
      requiresApproval: true,
      approvalLevel: 'Manager',
      reason: 'Requires Department Manager authorization per corporate spend policy.',
      matchedRules: ['POL-02: Standard Tier Requisition'],
      budgetStatus: 'WITHIN_THRESHOLD'
    },
    assignedApproverId: mgrId,
    assignedApproverName: manager.name,
    currentStep: 'Completed',
    workflowSteps: [
      { id: 'step-1', name: 'Request Created', status: 'DONE', timestamp: new Date(Date.now() - 172800000), details: 'Submitted by Alex Morgan' },
      { id: 'step-2', name: 'AI Analysis', status: 'DONE', timestamp: new Date(Date.now() - 172000000), details: 'AI parsed 2x 4K Monitors' },
      { id: 'step-3', name: 'Policy Check', status: 'DONE', timestamp: new Date(Date.now() - 171000000), details: 'Policy verified' },
      { id: 'step-4', name: 'Manager Approval', status: 'DONE', timestamp: new Date(Date.now() - 150000000), details: 'Approved by Sarah Jenkins' },
      { id: 'step-5', name: 'Procurement', status: 'DONE', timestamp: new Date(Date.now() - 86400000), details: 'PO-2026-382910 fulfilled' },
      { id: 'step-6', name: 'Completed', status: 'DONE', timestamp: new Date(Date.now() - 14400000), details: 'Delivered to Floor 3 Engineering Desk' }
    ]
  });

  // 4. Create Initial Notifications
  await Notification.create({
    userId: mgrId,
    message: `⚡ Action Required: Alex Morgan requested 5 laptops (INR 75,000) for review.`,
    type: 'ACTION_REQUIRED',
    link: `/requests/${req1._id || req1.id}`
  });

  await Notification.create({
    userId: empId,
    message: `Requisition "${req1.rawText.substring(0, 30)}..." submitted. AI assigned to Sarah Jenkins for approval.`,
    type: 'INFO',
    link: `/requests/${req1._id || req1.id}`
  });

  await Notification.create({
    userId: empId,
    message: `🎉 Great news! Your request for Ergonomic chairs was APPROVED by Sarah Jenkins.`,
    type: 'SUCCESS',
    link: `/requests/${req2._id || req2.id}`
  });

  // 5. Create Initial Audit Logs
  await AuditLog.create({
    entityType: 'REQUEST',
    entityId: String(req1._id || req1.id),
    action: 'CREATED',
    actorId: empId,
    actorName: employee.name,
    actorRole: employee.role,
    summary: `Requisition submitted: "${req1.rawText}"`,
    metadata: { category: req1.category, rawText: req1.rawText }
  });

  await AuditLog.create({
    entityType: 'REQUEST',
    entityId: String(req1._id || req1.id),
    action: 'ANALYZED',
    actorId: 'SYSTEM',
    actorName: 'FlowPilot Gemini AI Engine',
    actorRole: 'SYSTEM',
    summary: 'AI parsed 5 laptops, identified ₹75,000 budget, set Medium priority',
    metadata: req1.structuredData
  });

  await AuditLog.create({
    entityType: 'REQUEST',
    entityId: String(req1._id || req1.id),
    action: 'POLICY_EVALUATED',
    actorId: 'SYSTEM',
    actorName: 'FlowPilot Policy Matrix',
    actorRole: 'SYSTEM',
    summary: 'Policy verified: Requires Manager Authorization per Policy Tier 2',
    metadata: req1.policyResult
  });

  await AuditLog.create({
    entityType: 'REQUEST',
    entityId: String(req2._id || req2.id),
    action: 'APPROVED',
    actorId: mgrId,
    actorName: manager.name,
    actorRole: manager.role,
    summary: `Manager Sarah Jenkins approved request for Ergonomic Chairs`,
    metadata: { comment: 'Approved. Essential for design team comfort.' }
  });

  await AuditLog.create({
    entityType: 'TASK',
    entityId: String(task2._id || task2.id),
    action: 'TASK_GENERATED',
    actorId: 'SYSTEM',
    actorName: 'FlowPilot Automation Dispatcher',
    actorRole: 'SYSTEM',
    summary: `Dispatched Purchase Order PO-2026-449102 to Featherlite Furnishings`,
    metadata: { poNumber: 'PO-2026-449102', vendor: task2.vendor }
  });

  console.log('[Seed] Database seeded with 3 demo users, 3 sample requests, 2 workflow templates, and audit logs!');
}

if (require.main === module) {
  seedData().then(() => {
    console.log('[Seed] Finished successfully. Exiting.');
    process.exit(0);
  }).catch(err => {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  });
}

module.exports = seedData;
