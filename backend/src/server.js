const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB } = require('./db/db');
const { User } = require('./db/models');
const seedData = require('./db/seed');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const approvalRoutes = require('./routes/approvals');
const taskRoutes = require('./routes/tasks');
const auditLogRoutes = require('./routes/auditLogs');
const notificationRoutes = require('./routes/notifications');
const workflowRoutes = require('./routes/workflows');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow development origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'FlowPilot AI - Intelligent Workflow Automation',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/workflow-templates', workflowRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized error handling
app.use(errorHandler);

// Start Server
async function startServer() {
  try {
    await connectDB();

    // Check if users exist; if not, automatically seed initial demo data
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Automatically running initial seed...');
      await seedData();
    }

    const server = app.listen(config.port, () => {
      console.log('========================================================');
      console.log(`🚀 FlowPilot AI Backend running on port ${config.port}`);
      console.log(`📍 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`🔑 Demo Accounts:`);
      console.log(`   - Employee: employee@flowpilot.ai (password123)`);
      console.log(`   - Manager:  manager@flowpilot.ai (password123)`);
      console.log(`   - Admin:    admin@flowpilot.ai (password123)`);
      console.log('========================================================');
    });

    return server;
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
