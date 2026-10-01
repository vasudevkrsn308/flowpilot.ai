const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'flowpilot_jwt_secret_smart_automation_hackathon_key_2026',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/flowpilot',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};
