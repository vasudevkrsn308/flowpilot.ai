const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../config');

let isMongooseConnected = false;
const dataDir = path.join(__dirname, '../../data');
const localDbPath = path.join(dataDir, 'flowpilot.json');

// Ensure local data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory / file-based storage cache for zero-config fallback
let memoryStore = {
  users: [],
  requests: [],
  approvals: [],
  procurementtasks: [],
  notifications: [],
  auditlogs: [],
  workflowtemplates: []
};

// Load existing data if file exists
function loadLocalDb() {
  if (fs.existsSync(localDbPath)) {
    try {
      const raw = fs.readFileSync(localDbPath, 'utf8');
      memoryStore = { ...memoryStore, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('[DB] Could not parse local json store, initializing fresh:', e.message);
    }
  }
}

function persistLocalDb() {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {
    console.error('[DB] Error writing to local store:', e.message);
  }
}

loadLocalDb();

// Custom Embedded Model Class that mirrors Mongoose Model API
class EmbeddedModel {
  constructor(collectionName) {
    this.col = collectionName.toLowerCase();
    if (!memoryStore[this.col]) memoryStore[this.col] = [];
  }

  async find(filter = {}) {
    let items = memoryStore[this.col] || [];
    return this._filter(items, filter);
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async findById(id) {
    if (!id) return null;
    const strId = String(id);
    const item = (memoryStore[this.col] || []).find(x => String(x._id) === strId || String(x.id) === strId);
    return item ? { ...item } : null;
  }

  async create(data) {
    const now = new Date();
    const id = (Math.random().toString(36).substring(2, 9) + Date.now().toString(36));
    const record = {
      _id: id,
      id: id,
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
    memoryStore[this.col].push(record);
    persistLocalDb();
    return { ...record };
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const strId = String(id);
    const index = (memoryStore[this.col] || []).findIndex(x => String(x._id) === strId || String(x.id) === strId);
    if (index === -1) return null;

    const current = memoryStore[this.col][index];
    const updateData = update.$set ? { ...update.$set } : { ...update };
    delete updateData._id;
    delete updateData.id;

    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date()
    };
    memoryStore[this.col][index] = updated;
    persistLocalDb();
    return { ...updated };
  }

  async updateOne(filter, update) {
    const item = await this.findOne(filter);
    if (!item) return { matchedCount: 0, modifiedCount: 0 };
    await this.findByIdAndUpdate(item._id, update);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      const count = (memoryStore[this.col] || []).length;
      memoryStore[this.col] = [];
      persistLocalDb();
      return { deletedCount: count };
    }
    const before = (memoryStore[this.col] || []).length;
    memoryStore[this.col] = (memoryStore[this.col] || []).filter(item => !this._matches(item, filter));
    persistLocalDb();
    return { deletedCount: before - memoryStore[this.col].length };
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }

  _matches(item, filter) {
    for (const [key, val] of Object.entries(filter)) {
      if (key === '$or' && Array.isArray(val)) {
        const matchesOr = val.some(sub => this._matches(item, sub));
        if (!matchesOr) return false;
        continue;
      }
      if (val && typeof val === 'object' && val.$in) {
        if (!val.$in.includes(item[key])) return false;
        continue;
      }
      if (val && typeof val === 'object' && val.$ne !== undefined) {
        if (item[key] === val.$ne) return false;
        continue;
      }
      if (String(item[key]) !== String(val)) {
        return false;
      }
    }
    return true;
  }

  _filter(items, filter) {
    let result = items.filter(item => this._matches(item, filter));
    // Sort desc by createdAt by default
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

// Initialize Connection
async function connectDB() {
  if (process.env.USE_LOCAL_DB === 'true') {
    console.log('[FlowPilot DB] Using embedded zero-config local storage (data/flowpilot.json)');
    return false;
  }

  try {
    console.log(`[FlowPilot DB] Attempting connection to MongoDB at ${config.databaseUrl}...`);
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 2000
    });
    isMongooseConnected = true;
    console.log('[FlowPilot DB] Successfully connected to MongoDB database!');
    return true;
  } catch (err) {
    console.warn(`[FlowPilot DB] MongoDB connection skipped (${err.message}).`);
    console.log('[FlowPilot DB] Activated embedded local persistent storage (data/flowpilot.json).');
    console.log('[FlowPilot DB] Everything is 100% operational for your hackathon demo without needing a local Mongo service!');
    return false;
  }
}

function getModel(name, mongooseModel) {
  return {
    find: (filter) => (isMongooseConnected ? mongooseModel.find(filter).sort({ createdAt: -1 }) : new EmbeddedModel(name).find(filter)),
    findOne: (filter) => (isMongooseConnected ? mongooseModel.findOne(filter) : new EmbeddedModel(name).findOne(filter)),
    findById: (id) => (isMongooseConnected ? mongooseModel.findById(id) : new EmbeddedModel(name).findById(id)),
    create: (data) => (isMongooseConnected ? mongooseModel.create(data) : new EmbeddedModel(name).create(data)),
    findByIdAndUpdate: (id, update, opt) => (isMongooseConnected ? mongooseModel.findByIdAndUpdate(id, update, opt) : new EmbeddedModel(name).findByIdAndUpdate(id, update, opt)),
    updateOne: (filter, update) => (isMongooseConnected ? mongooseModel.updateOne(filter, update) : new EmbeddedModel(name).updateOne(filter, update)),
    deleteMany: (filter) => (isMongooseConnected ? mongooseModel.deleteMany(filter) : new EmbeddedModel(name).deleteMany(filter)),
    countDocuments: (filter) => (isMongooseConnected ? mongooseModel.countDocuments(filter) : new EmbeddedModel(name).countDocuments(filter))
  };
}

module.exports = {
  connectDB,
  getModel,
  isMongooseConnected: () => isMongooseConnected
};
