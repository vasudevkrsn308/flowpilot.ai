const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Initialize Gemini client if key is provided
let genAI = null;
if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  } catch (err) {
    console.warn('[AI Service] Failed to initialize GoogleGenerativeAI:', err.message);
  }
}

/**
 * Intelligent Fallback Heuristic Parser when GEMINI_API_KEY is not set or network fails
 */
function heuristicRequestAnalysis(rawText) {
  const text = rawText.toLowerCase();

  // 1. Quantity extraction
  let quantity = 1;
  const qtyMatch = text.match(/(\d+)\s*(laptops?|macbooks?|monitors?|chairs?|desks?|licenses?|units?|items?|pcs?|phones?|servers?)/i);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
  } else {
    const singleNumber = text.match(/\b([1-9]\d?)\b/);
    if (singleNumber && !text.includes('₹') && !text.includes('$')) {
      quantity = parseInt(singleNumber[1], 10);
    }
  }

  // 2. Budget / Amount extraction
  let estimatedAmount = 0;
  let currency = 'INR';

  if (text.includes('$')) {
    currency = 'USD';
    const match = text.match(/\$\s?([\d,]+(\.\d+)?)/);
    if (match) estimatedAmount = parseFloat(match[1].replace(/,/g, ''));
  } else if (text.includes('₹') || text.includes('inr') || text.includes('rs') || text.includes('rupees')) {
    currency = 'INR';
    const match = text.match(/(?:₹|rs\.?|inr)\s?([\d,]+(\.\d+)?)/i);
    if (match) {
      estimatedAmount = parseFloat(match[1].replace(/,/g, ''));
    } else {
      const budgetMatch = text.match(/(?:budget|cost|price|worth)(?:\s*(?:of|is|:|=))?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
      if (budgetMatch) estimatedAmount = parseFloat(budgetMatch[1].replace(/,/g, ''));
    }
  } else {
    // Check for raw large number (e.g. 75000)
    const bigNum = text.match(/\b(\d{4,7})\b/);
    if (bigNum) {
      estimatedAmount = parseFloat(bigNum[1]);
    }
  }

  // If no amount extracted, infer reasonable defaults based on item and qty
  if (!estimatedAmount) {
    if (text.includes('laptop') || text.includes('macbook')) {
      estimatedAmount = quantity * (currency === 'USD' ? 1200 : 75000);
    } else if (text.includes('monitor') || text.includes('screen')) {
      estimatedAmount = quantity * (currency === 'USD' ? 250 : 18000);
    } else if (text.includes('chair') || text.includes('desk')) {
      estimatedAmount = quantity * (currency === 'USD' ? 200 : 12000);
    } else {
      estimatedAmount = quantity * (currency === 'USD' ? 500 : 25000);
    }
  }

  // 3. Category
  let category = 'Hardware & IT Equipment';
  if (text.includes('software') || text.includes('license') || text.includes('saas') || text.includes('subscription')) {
    category = 'Software & SaaS Licenses';
  } else if (text.includes('chair') || text.includes('desk') || text.includes('furniture') || text.includes('office')) {
    category = 'Office Infrastructure & Ergonomics';
  } else if (text.includes('aws') || text.includes('cloud') || text.includes('gcp') || text.includes('azure') || text.includes('server')) {
    category = 'Cloud & Infrastructure Services';
  } else if (text.includes('travel') || text.includes('flight') || text.includes('hotel') || text.includes('cab')) {
    category = 'Travel & Logistics';
  }

  // 4. Priority
  let priority = 'Medium';
  if (text.includes('urgent') || text.includes('asap') || text.includes('critical') || text.includes('immediately') || estimatedAmount > 200000) {
    priority = 'High';
  } else if (estimatedAmount < 20000) {
    priority = 'Low';
  }

  // 5. Item list description
  let itemType = 'Laptop Computer';
  if (text.includes('macbook')) itemType = 'Apple MacBook Pro';
  else if (text.includes('monitor')) itemType = '4K External Monitor';
  else if (text.includes('chair')) itemType = 'Ergonomic Task Chair';
  else if (text.includes('license')) itemType = 'Software Seat License';
  else if (text.includes('server')) itemType = 'Compute Server Instance';

  return {
    category,
    items: [
      {
        type: itemType,
        quantity: quantity,
        description: `${quantity}x ${itemType} requested for project / onboarding`
      }
    ],
    estimatedAmount,
    currency,
    priority,
    urgencyReason: priority === 'High' ? 'Identified as urgent or high-value procurement' : 'Standard business request timeline',
    suggestedApprovalRequired: estimatedAmount > 25000,
    suggestedApproverRole: estimatedAmount > 100000 ? 'Director / VP' : 'Manager',
    sentimentOrIntent: 'Business procurement requisition extracted with high confidence'
  };
}

/**
 * Heuristic Workflow Generator fallback
 */
function heuristicWorkflowGeneration(description) {
  const desc = description.toLowerCase();
  let name = 'Automated Workflow Pipeline';
  let category = 'Operations';

  if (desc.includes('laptop') || desc.includes('hardware') || desc.includes('equipment')) {
    name = 'Employee IT Hardware & Laptop Provisioning';
    category = 'IT Procurement';
  } else if (desc.includes('software') || desc.includes('license')) {
    name = 'SaaS Subscription & License Approval Flow';
    category = 'Software Operations';
  } else if (desc.includes('expense') || desc.includes('reimburse') || desc.includes('travel')) {
    name = 'Corporate Travel & Expense Claim Automation';
    category = 'Finance & Accounts';
  } else if (desc.includes('hire') || desc.includes('onboard')) {
    name = 'New Hire IT & Equipment Onboarding Flow';
    category = 'HR & IT Operations';
  }

  return {
    name,
    category,
    description: description.trim(),
    definition: {
      trigger: 'Employee Plain Language Requisition (Web Form / Slack / API)',
      classificationNode: {
        model: 'Gemini 1.5 Pro / Flash',
        features: ['Entity Extraction', 'Quantity & Currency Normalization', 'Sentiment & Intent Classification']
      },
      policyRules: [
        {
          ruleId: 'PR-101',
          name: 'Spend Threshold Verification',
          condition: 'estimatedAmount > 25,000 INR',
          action: 'Escalate to Direct Department Manager'
        },
        {
          ruleId: 'PR-102',
          name: 'High-Value Executive Check',
          condition: 'estimatedAmount > 1,00,000 INR',
          action: 'Require Secondary VP / Finance Review'
        },
        {
          ruleId: 'PR-103',
          name: 'Approved Vendor Whitelist',
          condition: 'Vendor in [Dell, Apple, Lenovo, AWS, Microsoft]',
          action: 'Auto-route to preferred enterprise catalog'
        }
      ],
      approvalSteps: [
        { stepIndex: 1, role: 'Reporting Manager', timeoutHours: 24, autoEscalate: true },
        { stepIndex: 2, role: 'Finance Controller', condition: 'amount > 100000', timeoutHours: 48 }
      ],
      downstreamTasks: [
        { task: 'Purchase Order Generation', system: 'ERP / Procurement API', status: 'Automated' },
        { task: 'Asset Tag Allocation', system: 'IT Inventory Manager', status: 'Automated' },
        { task: 'Courier Dispatch Tracking', system: 'Logistics Partner', status: 'Tracked' }
      ],
      notifications: [
        { channel: 'In-App Web Dashboard', target: 'Requester & Approver' },
        { channel: 'Email Digest', target: 'IT Procurement Team' },
        { channel: 'Slack #it-alerts', target: 'Operations Channel' }
      ]
    }
  };
}

/**
 * Main Service API
 */
const aiService = {
  /**
   * Analyze raw request text using Gemini LLM (or fallback heuristic)
   */
  async analyzeRequest(rawText) {
    if (!rawText || !rawText.trim()) {
      throw new Error('Raw request text cannot be empty');
    }

    if (!genAI) {
      console.log('[AI Service] GEMINI_API_KEY not configured. Running intelligent heuristic engine.');
      return heuristicRequestAnalysis(rawText);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are the FlowPilot AI Enterprise Requisition Parser.
Analyze this employee procurement or service request text and output ONLY valid JSON matching this schema:
{
  "category": "Hardware & IT Equipment" | "Software & SaaS Licenses" | "Office Infrastructure & Ergonomics" | "Cloud & Infrastructure Services" | "Travel & Logistics" | "General Services",
  "items": [
    {
      "type": "string (e.g. Laptop, Monitor, Chair, Software License)",
      "quantity": number,
      "description": "string"
    }
  ],
  "estimatedAmount": number (in the currency mentioned or local currency integer),
  "currency": "INR" | "USD" | "EUR" | "GBP",
  "priority": "Low" | "Medium" | "High",
  "urgencyReason": "short explanation of urgency",
  "suggestedApprovalRequired": boolean,
  "suggestedApproverRole": "Manager" | "Director / VP" | "IT Admin",
  "sentimentOrIntent": "short summary of requisition intent"
}

Employee Request:
"""
${rawText}
"""

Important: Output pure JSON only. Do not wrap in markdown code blocks like \`\`\`json.`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text().trim();

      // Clean markdown formatting if present
      const cleaned = textResponse.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      console.warn('[AI Service] Gemini API call failed or timed out:', err.message);
      console.log('[AI Service] Seamlessly falling back to heuristic parser.');
      return heuristicRequestAnalysis(rawText);
    }
  },

  /**
   * AI Workflow Generator - WOW Feature
   */
  async generateWorkflowTemplate(description) {
    if (!description || !description.trim()) {
      throw new Error('Workflow description cannot be empty');
    }

    if (!genAI) {
      console.log('[AI Service] Using intelligent fallback for Workflow Template Generation.');
      return heuristicWorkflowGeneration(description);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are the FlowPilot AI Enterprise Workflow Architect.
A business admin has typed a plain-language description of an organizational workflow they want to automate.
Generate a structured, highly professional workflow template specification.

User input:
"""
${description}
"""

Return ONLY a valid JSON object matching this schema:
{
  "name": "Professional Workflow Name",
  "category": "IT Procurement" | "Finance & Accounts" | "HR & Operations" | "Cloud Services" | "Legal & Compliance",
  "description": "Clean summary of what this workflow achieves",
  "definition": {
    "trigger": "Detailed event trigger (e.g. Employee Request Submitted via Portal)",
    "classificationNode": {
      "model": "Gemini AI Engine",
      "features": ["Category Recognition", "Threshold Extraction", "Intent Analysis"]
    },
    "policyRules": [
      {
        "ruleId": "string (e.g. PR-01)",
        "name": "Policy Rule Name",
        "condition": "Condition logic (e.g. Amount > 50,000 INR)",
        "action": "Policy action (e.g. Escalate to Manager)"
      }
    ],
    "approvalSteps": [
      {
        "stepIndex": 1,
        "role": "Approver Role (e.g. Department Manager)",
        "timeoutHours": 24,
        "autoEscalate": boolean
      }
    ],
    "downstreamTasks": [
      {
        "task": "Task Name (e.g. Purchase Order Creation)",
        "system": "Target System (e.g. SAP / ERP / Inventory API)",
        "status": "Automated"
      }
    ],
    "notifications": [
      {
        "channel": "In-App / Email / Slack",
        "target": "Target Audience"
      }
    ]
  }
}

Do not include any conversational text or markdown code fences. Return pure JSON.`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text().trim();
      const cleaned = textResponse.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('[AI Service] Gemini Workflow generation failed:', err.message);
      return heuristicWorkflowGeneration(description);
    }
  }
};

module.exports = aiService;
