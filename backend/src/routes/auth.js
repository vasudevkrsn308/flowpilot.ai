const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const config = require('../config');
const { User } = require('../db/models');
const { authenticate } = require('../middleware/auth');
const auditService = require('../services/auditService');

// Zod schemas for input validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Employee', 'Manager', 'Admin']).optional().default('Employee'),
  department: z.string().optional().default('Engineering')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

function generateToken(user) {
  return jwt.sign(
    {
      id: String(user._id || user.id),
      email: user.email,
      role: user.role,
      name: user.name
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors
      });
    }

    const { name, email, password, role, department } = parseResult.data;

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      department
    });

    const token = generateToken(user);

    await auditService.log({
      entityType: 'AUTH',
      entityId: user._id || user.id,
      action: 'USER_REGISTERED',
      actorId: user._id || user.id,
      actorName: user.name,
      actorRole: user.role,
      summary: `New user ${user.name} registered with role ${user.role}`
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors
      });
    }

    const { email, password } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    await auditService.log({
      entityType: 'AUTH',
      entityId: user._id || user.id,
      action: 'USER_LOGIN',
      actorId: user._id || user.id,
      actorName: user.name,
      actorRole: user.role,
      summary: `User ${user.name} logged into FlowPilot portal`
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/demo-login (Convenience for hackathon judges!)
router.post('/demo-login', async (req, res, next) => {
  try {
    const { role = 'Employee' } = req.body;
    let targetEmail = 'employee@flowpilot.ai';
    if (role === 'Manager') targetEmail = 'manager@flowpilot.ai';
    if (role === 'Admin') targetEmail = 'admin@flowpilot.ai';

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      // Create user on-the-fly if seed hasn't run yet
      const pwHash = await bcrypt.hash('password123', 10);
      user = await User.create({
        name: role === 'Admin' ? 'Devon Vance (Admin)' : (role === 'Manager' ? 'Sarah Jenkins (Manager)' : 'Alex Morgan (Employee)'),
        email: targetEmail,
        passwordHash: pwHash,
        role,
        department: role === 'Admin' ? 'IT Operations' : 'Engineering'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Demo login successful as ${user.name}`,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me (Protected)
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
