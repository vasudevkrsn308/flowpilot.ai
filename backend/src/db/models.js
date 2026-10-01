const mongoose = require('mongoose');
const { getModel } = require('./db');

// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
  department: { type: String, default: 'Engineering' },
  managerId: { type: String, default: null }
}, { timestamps: true });

// 2. Request Schema
const RequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, default: 'Employee' },
  userEmail: { type: String, default: '' },
  rawText: { type: String, required: true },
  category: { type: String, default: 'General IT' },
  structuredData: {
    category: { type: String },
    items: [{
      type: { type: String },
      quantity: { type: Number, default: 1 },
      description: { type: String }
    }],
    estimatedAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    urgencyReason: { type: String },
    suggestedApprovalRequired: { type: Boolean, default: true },
    suggestedApproverRole: { type: String, default: 'Manager' },
    sentimentOrIntent: { type: String }
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING_APPROVAL'
  },
  policyResult: {
    passed: { type: Boolean, default: true },
    requiresApproval: { type: Boolean, default: true },
    approvalLevel: { type: String, default: 'Manager' },
    reason: { type: String },
    matchedRules: [{ type: String }],
    budgetStatus: { type: String, default: 'WITHIN_THRESHOLD' }
  },
  assignedApproverId: { type: String, default: null },
  assignedApproverName: { type: String, default: null },
  currentStep: { type: String, default: 'Manager Approval' },
  workflowSteps: [{
    id: { type: String },
    name: { type: String, required: true },
    status: { type: String, enum: ['DONE', 'CURRENT', 'UPCOMING', 'REJECTED'], default: 'UPCOMING' },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
  }]
}, { timestamps: true });

// 3. Approval Schema
const ApprovalSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  approverId: { type: String, required: true },
  approverName: { type: String, default: 'Manager' },
  approverRole: { type: String, default: 'Manager' },
  decision: { type: String, enum: ['APPROVED', 'REJECTED'], required: true },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 4. ProcurementTask Schema
const ProcurementTaskSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  type: { type: String, default: 'PROCUREMENT' },
  title: { type: String, default: 'Procurement Order' },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'OPEN'
  },
  assignedTo: { type: String, default: 'Central IT Procurement Team' },
  vendor: { type: String, default: 'Dell / Apple Enterprise Direct' },
  estimatedDeliveryDate: { type: String },
  details: {
    items: { type: Array, default: [] },
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    poNumber: { type: String },
    notes: { type: String }
  }
}, { timestamps: true });

// 5. Notification Schema
const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'ACTION_REQUIRED', 'SUCCESS', 'WARNING'], default: 'INFO' },
  read: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 6. AuditLog Schema
const AuditLogSchema = new mongoose.Schema({
  entityType: { type: String, required: true }, // 'REQUEST', 'APPROVAL', 'TASK', 'WORKFLOW', 'AUTH'
  entityId: { type: String, required: true },
  action: { type: String, required: true }, // 'CREATED', 'ANALYZED', 'POLICY_EVALUATED', 'APPROVED', 'REJECTED', 'TASK_GENERATED', 'ACTIVATED'
  actorId: { type: String, default: 'SYSTEM' },
  actorName: { type: String, default: 'FlowPilot AI Engine' },
  actorRole: { type: String, default: 'SYSTEM' },
  summary: { type: String, required: true },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

// 7. WorkflowTemplate Schema
const WorkflowTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'IT & Hardware' },
  definition: {
    trigger: { type: String, default: 'Employee Natural Language Request' },
    classificationNode: { type: Object },
    policyRules: [{ type: Object }],
    approvalSteps: [{ type: Object }],
    downstreamTasks: [{ type: Object }],
    notifications: [{ type: Object }]
  },
  isActive: { type: Boolean, default: true },
  createdByName: { type: String, default: 'Admin' }
}, { timestamps: true });

// Mongoose model registration
const MongooseUser = mongoose.models.User || mongoose.model('User', UserSchema);
const MongooseRequest = mongoose.models.Request || mongoose.model('Request', RequestSchema);
const MongooseApproval = mongoose.models.Approval || mongoose.model('Approval', ApprovalSchema);
const MongooseProcurementTask = mongoose.models.ProcurementTask || mongoose.model('ProcurementTask', ProcurementTaskSchema);
const MongooseNotification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
const MongooseAuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
const MongooseWorkflowTemplate = mongoose.models.WorkflowTemplate || mongoose.model('WorkflowTemplate', WorkflowTemplateSchema);

// Export unified model adapters
module.exports = {
  User: getModel('users', MongooseUser),
  Request: getModel('requests', MongooseRequest),
  Approval: getModel('approvals', MongooseApproval),
  ProcurementTask: getModel('procurementtasks', MongooseProcurementTask),
  Notification: getModel('notifications', MongooseNotification),
  AuditLog: getModel('auditlogs', MongooseAuditLog),
  WorkflowTemplate: getModel('workflowtemplates', MongooseWorkflowTemplate)
};
