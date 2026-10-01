# ⚡ FlowPilot AI – Intelligent Workflow Automation
> **Smart Automation Hackathon 2026** • Built by Principal Full-Stack Engineer, AI Systems Architect & Senior UI/UX Designer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)](https://nodejs.org/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%201.5-8e24aa.svg)](https://ai.google.dev/)

---

## 🎯 1. One-Line Idea
**FlowPilot AI** enables any enterprise employee to submit complex requisitions in plain language (e.g. *"I need 5 laptops for new hires, budget ₹75,000"*). FlowPilot's AI extracts structured specifications, evaluates spend thresholds against corporate governance policies, routes approvals to managers, automatically generates downstream procurement orders with vendor POs, sends multi-channel notifications, and preserves an immutable audit trail.

---

## 🚀 2. "WOW" Feature: AI Workflow Generator
Admins can automate entirely new organizational workflows simply by describing what they need in plain English (e.g., *"Automate employee laptop procurement"* or *"SaaS subscription approval with security review"*). 

The Gemini AI engine compiles an interactive **6-Stage Visual Pipeline**:
1. **Ingestion Trigger** (Natural Language Requisition Entrypoint)
2. **AI Classification & Extraction** (Gemini Entity, Quantity, and Intent Parser)
3. **Policy Verification** (Spend Matrix, Prohibited Items, and Budget Tiers)
4. **Human Authorization** (Manager/Director Routing Matrix)
5. **Automated Downstream Tasks** (ERP Purchase Order & Inventory Allocation)
6. **Stakeholder Alerts** (Real-time in-app notifications and webhooks)

Admins can inspect parameters and activate the pipeline with a single click!

---

## 🌟 3. Key Highlights & Polish

| Feature | Description |
| :--- | :--- |
| **Plain Language Ingestion** | No tedious 20-field enterprise forms. Type naturally or use instant preset chips. |
| **Cognitive Entity Parsing** | Accurately extracts item counts, specifications, normalized currency/amounts, and urgency. |
| **Deterministic Policy Engine** | Audits spend thresholds (`<= ₹15k`, `₹15k-₹100k`, `> ₹100k`), catalogs, and prohibited keywords. |
| **Visual Workflow Stepper** | Real-time multi-stage pipeline: `Request Created` ➔ `AI Analysis` ➔ `Policy Check` ➔ `Manager Approval` ➔ `Procurement` ➔ `Completed`. |
| **1-Click Demo Profiles** | Immediate 1-click role switching between **Employee (Alex)**, **Manager (Sarah)**, and **Admin (Devon)** directly in the UI. |
| **Downstream Automation** | Automatically generates structured Purchase Orders (`PO-2026-XXXX`) with vendor dispatch on approval. |
| **Enterprise Audit Trail** | Cryptographically logs every event with actor name, role, entity snapshot, and CSV export. |
| **Resilient Zero-Config DB** | Works seamlessly with MongoDB Atlas or local MongoDB; automatically falls back to an embedded zero-config JSON database if MongoDB isn't running. |

---

## 🛠️ 4. Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, JWT, bcryptjs, Zod, Mongoose, UUID
- **Database**: MongoDB with Mongoose (with automated embedded persistent fallback)
- **AI Engine**: Google Gemini API (`@google/generative-ai`) + intelligent fallback heuristics

---

## 💻 5. How to Run Locally

### Prerequisites
- **Node.js** v18+ (tested on v24.21)
- **NPM** v9+

---

### Step 1: Start Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=flowpilot_jwt_secret_smart_automation_hackathon_key_2026
DATABASE_URL=mongodb://127.0.0.1:27017/flowpilot
# Optional: Enter your Gemini API key below. If left empty, FlowPilot runs its built-in cognitive heuristic parser!
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
```

Run the backend server:
```bash
npm start
# or for auto-reload during dev:
npm run dev
```
> The database automatically seeds with 3 demo accounts, sample requests, and workflow templates upon first launch!

---

### Step 2: Start Frontend

In a separate terminal:
```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🔑 6. Demo Accounts (1-Click Login Available on UI)

| Role | Email | Password | Persona & Department |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@flowpilot.ai` | `password123` | Alex Morgan (Senior Frontend Dev, Engineering) |
| **Manager** | `manager@flowpilot.ai` | `password123` | Sarah Jenkins (Director of Engineering) |
| **Admin** | `admin@flowpilot.ai` | `password123` | Devon Vance (Head of IT Operations) |

*Tip: You can switch roles with 1 click from the navbar pill at any time!*

---

## 📡 7. API Architecture

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/demo-login` - 1-click evaluator login
- `GET /api/auth/me` - Current session

### Requisitions
- `POST /api/requests` - Submit request (AI parse + policy check + workflow init)
- `POST /api/requests/analyze-preview` - Interactive live AI preview
- `GET /api/requests` - Filtered list by role
- `GET /api/requests/:id` - Full telemetry, BOM, policy checks, tasks & stepper
- `POST /api/requests/:id/approve` - Manager decision (Approved/Rejected)

### Approvals & Tasks
- `GET /api/approvals/pending` - Manager review queue
- `GET /api/approvals/history` - Historical decision log
- `GET /api/tasks` - Downstream procurement orders
- `PATCH /api/tasks/:id` - Advance task fulfillment status

### AI Workflow Generator (Admin)
- `POST /api/workflow-templates/generate` - AI pipeline synthesis
- `POST /api/workflow-templates` - Save template
- `GET /api/workflow-templates` - List templates
- `POST /api/workflow-templates/:id/activate` - Toggle live activation

### Audit & Notifications
- `GET /api/audit-logs` - Query audit stream with filters
- `GET /api/notifications` - In-app push notifications
- `PATCH /api/notifications/:id/read` - Mark read

---

## 🏆 Hackathon Submission Checklist
- [x] End-to-end employee requisition lifecycle works seamlessly
- [x] AI Natural Language Requisition Understanding
- [x] Deterministic Policy Engine with Spend Thresholds
- [x] Manager Review Queue & Decision Recording
- [x] Automated Downstream Procurement Order Generation (`PO-2026-XXXX`)
- [x] 6-Stage Visual Workflow Stepper
- [x] AI Workflow Generator (WOW Feature) with 6-stage visual pipeline
- [x] Enterprise Audit Trail with CSV Export
- [x] Role-Based Access Control (Employee, Manager, Admin)
- [x] Premium Modern UI (Tailwind CSS, Glassmorphism, Plus Jakarta Sans, Confetti)
- [x] Zero-Friction 1-Click Role Switcher for Evaluators

---
*Crafted with excellence for Smart Automation Hackathon 2026.*
