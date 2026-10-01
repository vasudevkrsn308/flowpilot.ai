/**
 * Enterprise Policy Engine for FlowPilot AI
 * Evaluates corporate financial policies, department quotas, and authorization matrices.
 */

const BLOCKED_KEYWORDS = ['crypto', 'mining', 'personal gift', 'gaming console', 'casino', 'betting'];

function evaluatePolicy(structuredData, user = {}) {
  const { estimatedAmount = 0, currency = 'INR', category = '', items = [] } = structuredData;
  const matchedRules = [];
  let passed = true;
  let requiresApproval = true;
  let approvalLevel = 'Manager';
  let reason = '';
  let budgetStatus = 'WITHIN_THRESHOLD';

  // 1. Prohibited item keyword scan
  const itemTexts = items.map(i => `${i.type} ${i.description}`).join(' ').toLowerCase();
  for (const word of BLOCKED_KEYWORDS) {
    if (itemTexts.includes(word)) {
      passed = false;
      requiresApproval = true;
      approvalLevel = 'Compliance Review';
      budgetStatus = 'RESTRICTED_ITEM';
      matchedRules.push(`POL-00: Prohibited item keyword detected: "${word}"`);
      reason = `Request contains restricted category items (${word}) which violates corporate acceptable use policy.`;
      return { passed, requiresApproval, approvalLevel, reason, matchedRules, budgetStatus };
    }
  }

  // Normalize amount to INR equivalent for consistent threshold comparison
  let amountInINR = estimatedAmount;
  if (currency === 'USD') amountInINR = estimatedAmount * 85;
  else if (currency === 'EUR') amountInINR = estimatedAmount * 90;
  else if (currency === 'GBP') amountInINR = estimatedAmount * 105;

  // 2. Spend Threshold Policy
  if (amountInINR <= 15000) {
    // Under micro-purchase threshold
    matchedRules.push('POL-01: Micro-Requisition Tier (<= ₹15,000)');
    requiresApproval = true;
    approvalLevel = 'Team Lead';
    reason = 'Standard low-value equipment request. Fast-track approval granted under Policy Section 4.1.';
    budgetStatus = 'MICRO_TIER';
  } else if (amountInINR <= 100000) {
    // Standard Department Manager Approval
    matchedRules.push('POL-02: Standard Tier Requisition (₹15,001 - ₹1,00,000)');
    requiresApproval = true;
    approvalLevel = 'Manager';
    reason = `Requires Department Manager authorization (${currency} ${estimatedAmount.toLocaleString()}) per corporate spend policy.`;
    budgetStatus = 'STANDARD_MANAGER_REQUIRED';
  } else {
    // High-value capital expenditure
    matchedRules.push('POL-03: Capital Expenditure Tier (> ₹1,00,000)');
    requiresApproval = true;
    approvalLevel = 'Director / VP';
    reason = `High-value procurement exceeding ₹1,00,000. Escalated to Director / VP level review per financial governance rules.`;
    budgetStatus = 'HIGH_VALUE_ESCALATION';
  }

  // 3. Category specific policy rules
  if (category.toLowerCase().includes('hardware') || category.toLowerCase().includes('laptop')) {
    matchedRules.push('POL-HW: Standard IT Hardware Catalog verification active');
  } else if (category.toLowerCase().includes('software') || category.toLowerCase().includes('saas')) {
    matchedRules.push('POL-SW: Security & SOC2 vendor compliance checklist attached');
  }

  return {
    passed,
    requiresApproval,
    approvalLevel,
    reason,
    matchedRules,
    budgetStatus
  };
}

module.exports = {
  evaluatePolicy
};
