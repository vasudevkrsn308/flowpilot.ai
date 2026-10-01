import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const WorkflowStoreContext = createContext(null);

const INITIAL_ORDERS = [
  {
    id: 'ORD-1048',
    title: 'New office monitors for Design & Eng team',
    description: 'Procurement of 12 Dell UltraSharp 27" 4K USB-C monitors with dual monitor arms for new engineering and design workstation upgrades.',
    requester: 'Alex Johnson',
    department: 'IT',
    amount: 85000,
    currency: 'INR',
    submittedDate: '2026-10-01',
    assignedApprover: 'Sarah Mitchell',
    status: 'Pending',
    priority: 'High',
    vendor: 'Dell Enterprise Direct',
    poNumber: 'PO-2026-0912',
    category: 'Hardware',
    aiConfidence: 96,
    policyCheck: { passed: true, reason: 'Within IT standard hardware procurement threshold' },
    budgetCheck: { passed: true, allocated: 150000, remaining: 65000 },
    comments: [
      { id: 'c1', author: 'Alex Johnson', role: 'Employee', text: 'Urgent requirement as new hires arrive next Monday.', time: '10:15 AM' }
    ],
    timeline: [
      { step: 'Request Submitted', status: 'Completed', timestamp: '01 Oct 2026, 09:30 AM', desc: 'Natural language request submitted by Alex Johnson' },
      { step: 'AI Policy Check', status: 'Completed', timestamp: '01 Oct 2026, 09:31 AM', desc: 'Compliant with Hardware Tier B spend guidelines' },
      { step: 'Manager Review', status: 'Current', timestamp: '01 Oct 2026, 09:32 AM', desc: 'Awaiting decision from Sarah Mitchell' },
      { step: 'Order Accepted or Denied', status: 'Upcoming', timestamp: '-', desc: 'Approval threshold required' },
      { step: 'Procurement Processing', status: 'Upcoming', timestamp: '-', desc: 'Vendor PO generation' },
      { step: 'Completed', status: 'Upcoming', timestamp: '-', desc: 'Asset delivery and verification' },
    ]
  },
  {
    id: 'ORD-1047',
    title: 'Team software licenses (JetBrains & GitHub Copilot)',
    description: 'Annual enterprise renewals and 8 additional seat allocations for developer productivity tooling suite.',
    requester: 'Priya Shah',
    department: 'Engineering',
    amount: 42500,
    currency: 'INR',
    submittedDate: '2026-09-30',
    assignedApprover: 'Sarah Mitchell',
    status: 'Accepted',
    priority: 'Medium',
    vendor: 'JetBrains s.r.o / Microsoft',
    poNumber: 'PO-2026-0894',
    category: 'Software',
    aiConfidence: 98,
    policyCheck: { passed: true, reason: 'Approved SaaS vendor list' },
    budgetCheck: { passed: true, allocated: 80000, remaining: 37500 },
    comments: [
      { id: 'c2', author: 'Sarah Mitchell', role: 'Manager', text: 'Approved under standard engineering tooling budget.', time: '02:45 PM' }
    ],
    timeline: [
      { step: 'Request Submitted', status: 'Completed', timestamp: '30 Sep 2026, 11:20 AM', desc: 'Submitted by Priya Shah' },
      { step: 'AI Policy Check', status: 'Completed', timestamp: '30 Sep 2026, 11:21 AM', desc: 'Pre-approved vendor catalog verified' },
      { step: 'Manager Review', status: 'Completed', timestamp: '30 Sep 2026, 02:45 PM', desc: 'Approved by Sarah Mitchell' },
      { step: 'Order Accepted or Denied', status: 'Completed', timestamp: '30 Sep 2026, 02:46 PM', desc: 'Order Accepted' },
      { step: 'Procurement Processing', status: 'Current', timestamp: '30 Sep 2026, 03:00 PM', desc: 'Dispatching license keys' },
      { step: 'Completed', status: 'Upcoming', timestamp: '-', desc: 'Seat assignment confirmation' },
    ]
  },
  {
    id: 'ORD-1046',
    title: 'Marketing event studio camera kit',
    description: 'High-end cinema camera body, 24-70mm f/2.8 lens, wireless lavalier mics, and softbox lighting equipment.',
    requester: 'Daniel Lee',
    department: 'Marketing',
    amount: 67200,
    currency: 'INR',
    submittedDate: '2026-09-29',
    assignedApprover: 'Sarah Mitchell',
    status: 'Denied',
    denialReason: 'Exceeds remaining departmental quarterly discretionary equipment cap. Please resubmit under pooled Q1 budget.',
    priority: 'Low',
    vendor: 'B&H Commercial AV',
    poNumber: 'PO-2026-0870',
    category: 'Marketing',
    aiConfidence: 92,
    policyCheck: { passed: false, reason: 'Discretionary audiovisual threshold flagged' },
    budgetCheck: { passed: false, allocated: 50000, remaining: 12000 },
    comments: [
      { id: 'c3', author: 'Sarah Mitchell', role: 'Manager', text: 'Denied. Departmental cap exceeded for Q4.', time: '04:10 PM' }
    ],
    timeline: [
      { step: 'Request Submitted', status: 'Completed', timestamp: '29 Sep 2026, 01:10 PM', desc: 'Submitted by Daniel Lee' },
      { step: 'AI Policy Check', status: 'Completed', timestamp: '29 Sep 2026, 01:11 PM', desc: 'Budget limit warning triggered' },
      { step: 'Manager Review', status: 'Completed', timestamp: '29 Sep 2026, 04:10 PM', desc: 'Reviewed by Sarah Mitchell' },
      { step: 'Order Accepted or Denied', status: 'Denied', timestamp: '29 Sep 2026, 04:11 PM', desc: 'Denied: Exceeds quarterly budget allocation' },
      { step: 'Procurement Processing', status: 'Upcoming', timestamp: '-', desc: 'Cancelled' },
      { step: 'Completed', status: 'Upcoming', timestamp: '-', desc: 'Cancelled' },
    ]
  },
  {
    id: 'ORD-1045',
    title: 'Ergonomic workstations & office furniture',
    description: '6 motorized height-adjustable standing desks, 6 steelcase mesh chairs, and cable management trays for floor 3.',
    requester: 'Emma Wilson',
    department: 'Operations',
    amount: 120000,
    currency: 'INR',
    submittedDate: '2026-09-28',
    assignedApprover: 'Sarah Mitchell',
    status: 'Completed',
    completedAt: '2026-09-29T16:00:00.000Z',
    priority: 'Medium',
    vendor: 'Steelcase Workplaces Global',
    poNumber: 'PO-2026-0855',
    category: 'Facilities',
    aiConfidence: 97,
    policyCheck: { passed: true, reason: 'Facilities ergonomic wellness protocol compliant' },
    budgetCheck: { passed: true, allocated: 200000, remaining: 80000 },
    comments: [
      { id: 'c4', author: 'Emma Wilson', role: 'Operations', text: 'Desks delivered and assembled. All employees satisfied.', time: '04:00 PM' }
    ],
    timeline: [
      { step: 'Request Submitted', status: 'Completed', timestamp: '28 Sep 2026, 10:00 AM', desc: 'Submitted by Emma Wilson' },
      { step: 'AI Policy Check', status: 'Completed', timestamp: '28 Sep 2026, 10:01 AM', desc: 'Wellness ergonomic policy met' },
      { step: 'Manager Review', status: 'Completed', timestamp: '28 Sep 2026, 11:30 AM', desc: 'Approved by Sarah Mitchell' },
      { step: 'Order Accepted or Denied', status: 'Completed', timestamp: '28 Sep 2026, 11:31 AM', desc: 'Order Accepted' },
      { step: 'Procurement Processing', status: 'Completed', timestamp: '28 Sep 2026, 02:00 PM', desc: 'Dispatched via Steelcase Global' },
      { step: 'Completed', status: 'Completed', timestamp: '29 Sep 2026, 04:00 PM', desc: 'Delivery signed and confirmed' },
    ]
  },
  {
    id: 'ORD-1044',
    title: 'Surveillance & security camera expansion',
    description: 'Installation of 8 PoE 4K dome cameras, Cat6 cabling runs, and 16TB NVR expansion in server room.',
    requester: 'Ravi Kumar',
    department: 'Facilities',
    amount: 95000,
    currency: 'INR',
    submittedDate: '2026-09-27',
    assignedApprover: 'Sarah Mitchell',
    status: 'In Progress',
    priority: 'High',
    vendor: 'Hikvision & Allied Security Systems',
    poNumber: 'PO-2026-0842',
    category: 'Facilities',
    aiConfidence: 95,
    policyCheck: { passed: true, reason: 'Critical facility physical security compliance' },
    budgetCheck: { passed: true, allocated: 150000, remaining: 55000 },
    comments: [
      { id: 'c5', author: 'Ravi Kumar', role: 'Facilities', text: 'Cabling installation scheduled for this Thursday.', time: '11:15 AM' }
    ],
    timeline: [
      { step: 'Request Submitted', status: 'Completed', timestamp: '27 Sep 2026, 09:15 AM', desc: 'Submitted by Ravi Kumar' },
      { step: 'AI Policy Check', status: 'Completed', timestamp: '27 Sep 2026, 09:16 AM', desc: 'Physical security standards matched' },
      { step: 'Manager Review', status: 'Completed', timestamp: '27 Sep 2026, 11:45 AM', desc: 'Approved by Sarah Mitchell' },
      { step: 'Order Accepted or Denied', status: 'Completed', timestamp: '27 Sep 2026, 11:46 AM', desc: 'Order Accepted' },
      { step: 'Procurement Processing', status: 'Current', timestamp: '27 Sep 2026, 02:30 PM', desc: 'Hardware delivered; installation in progress' },
      { step: 'Completed', status: 'Upcoming', timestamp: '-', desc: 'Final sign-off' },
    ]
  },
  {
    id: 'ORD-1043',
    title: 'GPU Cloud Compute Cluster for AI model inference',
    description: 'Dedicated cloud compute instances on AWS with 4x A100 GPUs for next-gen workflow parsing automation.',
    requester: 'Devon Carter',
    department: 'Platform',
    amount: 180000,
    currency: 'INR',
    submittedDate: '2026-09-26',
    assignedApprover: 'Sarah Mitchell',
    status: 'Completed',
    completedAt: '2026-09-27T18:00:00.000Z',
    priority: 'High',
    vendor: 'Amazon Web Services',
    poNumber: 'PO-2026-0820',
    category: 'Infrastructure',
    aiConfidence: 99,
    policyCheck: { passed: true, reason: 'Approved under Hackathon & AI initiative' },
    budgetCheck: { passed: true, allocated: 250000, remaining: 70000 },
    comments: [
      { id: 'c6', author: 'Devon Carter', role: 'Admin', text: 'Cluster provisioned with low-latency VPC endpoints.', time: '06:00 PM' }
    ],
    timeline: [
      { step: 'Request Submitted', status: 'Completed', timestamp: '26 Sep 2026, 08:30 AM', desc: 'Submitted by Devon Carter' },
      { step: 'AI Policy Check', status: 'Completed', timestamp: '26 Sep 2026, 08:31 AM', desc: 'AI platform quota verified' },
      { step: 'Manager Review', status: 'Completed', timestamp: '26 Sep 2026, 10:15 AM', desc: 'Approved by Sarah Mitchell' },
      { step: 'Order Accepted or Denied', status: 'Completed', timestamp: '26 Sep 2026, 10:16 AM', desc: 'Order Accepted' },
      { step: 'Procurement Processing', status: 'Completed', timestamp: '26 Sep 2026, 11:00 AM', desc: 'AWS reserved instance activated' },
      { step: 'Completed', status: 'Completed', timestamp: '27 Sep 2026, 06:00 PM', desc: 'Cluster live and operational' },
    ]
  }
];

const INITIAL_EMPLOYEES = [
  {
    id: 'emp-1',
    name: 'Sarah Mitchell',
    email: 'manager@flowpilot.ai',
    title: 'Director of Operations',
    department: 'Operations',
    role: 'Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 18,
    approvalsCompleted: 142,
    currentWorkload: 'Optimal (68%)',
    phone: '+91 98201 44521',
    location: 'Bangalore / Remote',
    joined: 'Jan 2024'
  },
  {
    id: 'emp-2',
    name: 'Alex Johnson',
    email: 'employee@flowpilot.ai',
    title: 'Senior Frontend Engineer',
    department: 'IT',
    role: 'Employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 34,
    approvalsCompleted: 0,
    currentWorkload: 'High (88%)',
    phone: '+91 98765 12345',
    location: 'Bangalore Office',
    joined: 'Mar 2024'
  },
  {
    id: 'emp-3',
    name: 'Devon Carter',
    email: 'admin@flowpilot.ai',
    title: 'Head of IT & Platform Operations',
    department: 'Platform Team',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 12,
    approvalsCompleted: 210,
    currentWorkload: 'Moderate (72%)',
    phone: '+91 98111 88990',
    location: 'Bangalore Office',
    joined: 'Aug 2023'
  },
  {
    id: 'emp-4',
    name: 'Priya Shah',
    email: 'priya.shah@flowpilot.ai',
    title: 'Lead Software Architect',
    department: 'Engineering',
    role: 'Employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 22,
    approvalsCompleted: 15,
    currentWorkload: 'Optimal (65%)',
    phone: '+91 98450 77112',
    location: 'Remote',
    joined: 'Nov 2024'
  },
  {
    id: 'emp-5',
    name: 'Daniel Lee',
    email: 'daniel.lee@flowpilot.ai',
    title: 'Senior Marketing Specialist',
    department: 'Marketing',
    role: 'Employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 16,
    approvalsCompleted: 0,
    currentWorkload: 'Low (42%)',
    phone: '+91 99234 55671',
    location: 'Mumbai Office',
    joined: 'Feb 2025'
  },
  {
    id: 'emp-6',
    name: 'Emma Wilson',
    email: 'emma.wilson@flowpilot.ai',
    title: 'Operations Coordinator',
    department: 'Operations',
    role: 'Employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 29,
    approvalsCompleted: 8,
    currentWorkload: 'Optimal (60%)',
    phone: '+91 98881 22334',
    location: 'Bangalore Office',
    joined: 'May 2025'
  },
  {
    id: 'emp-7',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@flowpilot.ai',
    title: 'Facilities & Workplace Manager',
    department: 'Facilities',
    role: 'Employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    requestsSubmitted: 45,
    approvalsCompleted: 30,
    currentWorkload: 'High (85%)',
    phone: '+91 97123 44556',
    location: 'Bangalore Office',
    joined: 'Jan 2023'
  }
];

const INITIAL_TASKS = [
  {
    id: 'TSK-301',
    title: 'Verify monitor delivery & asset tag allocation',
    relatedOrder: 'ORD-1048',
    assignee: 'Alex Johnson',
    department: 'IT',
    priority: 'High',
    dueDate: '2026-10-03',
    status: 'In Progress',
    completed: false
  },
  {
    id: 'TSK-302',
    title: 'Provision JetBrains enterprise license key files',
    relatedOrder: 'ORD-1047',
    assignee: 'Priya Shah',
    department: 'Engineering',
    priority: 'Medium',
    dueDate: '2026-10-01',
    status: 'In Progress',
    completed: false
  },
  {
    id: 'TSK-303',
    title: 'Review camera cabling schedule with electrical contractor',
    relatedOrder: 'ORD-1044',
    assignee: 'Ravi Kumar',
    department: 'Facilities',
    priority: 'High',
    dueDate: '2026-10-02',
    status: 'Open',
    completed: false
  },
  {
    id: 'TSK-304',
    title: 'Standing desk ergonomics warranty registration',
    relatedOrder: 'ORD-1045',
    assignee: 'Emma Wilson',
    department: 'Operations',
    priority: 'Low',
    dueDate: '2026-09-29',
    status: 'Completed',
    completed: true,
    completedAt: '2026-09-29'
  },
  {
    id: 'TSK-305',
    title: 'AWS VPC peering security audit & subnet setup',
    relatedOrder: 'ORD-1043',
    assignee: 'Devon Carter',
    department: 'Platform Team',
    priority: 'High',
    dueDate: '2026-09-27',
    status: 'Completed',
    completed: true,
    completedAt: '2026-09-27'
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-1',
    timestamp: '2026-10-01T11:45:00.000Z',
    user: 'Sarah Mitchell',
    role: 'Manager',
    action: 'Accepted order ORD-1047.',
    entity: 'ORD-1047',
    entityType: 'ORDER',
    status: 'SUCCESS',
    source: 'Manager',
    details: 'Approved under annual software developer tooling quota.'
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-01T10:15:00.000Z',
    user: 'AI Policy Engine',
    role: 'AI',
    action: 'AI policy check passed for request REQ-2091.',
    entity: 'REQ-2091',
    entityType: 'REQUEST',
    status: 'SUCCESS',
    source: 'AI',
    details: 'Policy check matched standard IT hardware threshold (<= ₹100,000).'
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-30T16:20:00.000Z',
    user: 'Devon Carter',
    role: 'Admin',
    action: 'Devon Carter updated employee permissions.',
    entity: 'EMP-POL-24',
    entityType: 'AUTH',
    status: 'SUCCESS',
    source: 'Admin',
    details: 'Activated multi-factor authentication policy for financial approvers.'
  },
  {
    id: 'aud-4',
    timestamp: '2026-09-29T16:00:00.000Z',
    user: 'Sarah Mitchell',
    role: 'Manager',
    action: 'Order ORD-1045 marked as completed.',
    entity: 'ORD-1045',
    entityType: 'ORDER',
    status: 'SUCCESS',
    source: 'Manager',
    details: 'Asset delivery and verification signed by Emma Wilson.'
  },
  {
    id: 'aud-5',
    timestamp: '2026-09-29T13:10:00.000Z',
    user: 'Alex Johnson',
    role: 'Employee',
    action: 'Alex Johnson submitted request REQ-2095.',
    entity: 'REQ-2095',
    entityType: 'REQUEST',
    status: 'INFO',
    source: 'Employee',
    details: 'Natural language request parsed into 12x 4K monitor BOM.'
  }
];

export function WorkflowStoreProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('flowpilot_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('flowpilot_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('flowpilot_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('flowpilot_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [toasts, setToasts] = useState([]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('flowpilot_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('flowpilot_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('flowpilot_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('flowpilot_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast Helper
  const showToast = (message, type = 'success', subtitle = '') => {
    const id = Date.now().toString();
    const newToast = { id, message, type, subtitle };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Audit Event Helper
  const addAuditEvent = (action, entity, details, source = 'Manager', status = 'SUCCESS') => {
    const newEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: source === 'AI' ? 'FlowPilot AI Engine' : 'Sarah Mitchell',
      role: source === 'AI' ? 'AI' : 'Manager',
      action,
      entity,
      entityType: entity.startsWith('ORD') ? 'ORDER' : 'REQUEST',
      status,
      source,
      details
    };
    setAuditLogs(prev => [newEvent, ...prev]);
  };

  // 1. Accept Order
  const acceptOrder = (orderId, note = '') => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map(step => {
            if (step.step === 'Order Accepted or Denied') {
              return { ...step, status: 'Completed', timestamp: new Date().toLocaleString(), desc: 'Order Accepted by Sarah Mitchell' };
            }
            if (step.step === 'Procurement Processing') {
              return { ...step, status: 'Current', timestamp: new Date().toLocaleString(), desc: 'Vendor PO generation underway' };
            }
            return step;
          });
          return {
            ...ord,
            status: 'Accepted',
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );

    addAuditEvent(`Sarah Mitchell accepted order ${orderId}.`, orderId, note || 'Approved by Manager under corporate policy.');
    showToast(`Order ${orderId} Accepted`, 'success', 'Order has been moved to Procurement Processing.');
  };

  // 2. Deny Order
  const denyOrder = (orderId, reason) => {
    if (!reason || !reason.trim()) {
      showToast('Denial reason is required', 'error');
      return false;
    }

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map(step => {
            if (step.step === 'Order Accepted or Denied') {
              return { ...step, status: 'Denied', timestamp: new Date().toLocaleString(), desc: `Denied: ${reason}` };
            }
            if (step.step === 'Procurement Processing' || step.step === 'Completed') {
              return { ...step, status: 'Upcoming', timestamp: '-', desc: 'Cancelled' };
            }
            return step;
          });
          return {
            ...ord,
            status: 'Denied',
            denialReason: reason,
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );

    addAuditEvent(`Sarah Mitchell denied order ${orderId}.`, orderId, `Reason: ${reason}`);
    showToast(`Order ${orderId} Denied`, 'error', reason);
    return true;
  };

  // 3. Complete Order (CRITICAL: Displays Green Checkmark)
  const completeOrder = (orderId) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map(step => {
            return {
              ...step,
              status: 'Completed',
              timestamp: step.timestamp === '-' ? new Date().toLocaleString() : step.timestamp
            };
          });
          return {
            ...ord,
            status: 'Completed',
            completedAt: new Date().toISOString(),
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );

    // Confetti celebration for order completion!
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    addAuditEvent(`Order ${orderId} marked as completed.`, orderId, 'Asset receipt confirmed and workflow finalized.');
    showToast(`Order ${orderId} marked as completed.`, 'success', 'Order visibly stamped with green completion checkmark.');
  };

  // 4. Create Order
  const createOrder = (orderData) => {
    const nextNum = 1040 + orders.length + 1;
    const orderId = `ORD-${nextNum}`;
    const newOrder = {
      id: orderId,
      title: orderData.title || 'Procurement Order',
      description: orderData.description || 'Enterprise workflow automated procurement.',
      requester: orderData.requester || 'Sarah Mitchell',
      department: orderData.department || 'Operations',
      amount: Number(orderData.amount) || 50000,
      currency: 'INR',
      submittedDate: new Date().toISOString().split('T')[0],
      assignedApprover: 'Sarah Mitchell',
      status: 'Pending',
      priority: orderData.priority || 'Medium',
      vendor: orderData.vendor || 'Authorized Enterprise Vendor',
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: orderData.category || 'General IT',
      aiConfidence: 94,
      policyCheck: { passed: true, reason: 'Verified via automated compliance rule engine' },
      budgetCheck: { passed: true, allocated: 100000, remaining: 50000 },
      comments: [],
      timeline: [
        { step: 'Request Submitted', status: 'Completed', timestamp: new Date().toLocaleString(), desc: 'Submitted by ' + (orderData.requester || 'Sarah Mitchell') },
        { step: 'AI Policy Check', status: 'Completed', timestamp: new Date().toLocaleString(), desc: 'Policy compliance check passed' },
        { step: 'Manager Review', status: 'Current', timestamp: new Date().toLocaleString(), desc: 'Pending manager review' },
        { step: 'Order Accepted or Denied', status: 'Upcoming', timestamp: '-', desc: 'Awaiting decision' },
        { step: 'Procurement Processing', status: 'Upcoming', timestamp: '-', desc: 'Vendor PO generation' },
        { step: 'Completed', status: 'Upcoming', timestamp: '-', desc: 'Fulfillment and sign-off' },
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    addAuditEvent(`Order ${orderId} created.`, orderId, `Title: ${newOrder.title}`);
    showToast(`Order ${orderId} created successfully`, 'success');
    return newOrder;
  };

  // 5. Add Comment to Order
  const addOrderComment = (orderId, commentText, author = 'Sarah Mitchell', role = 'Manager') => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author,
            role,
            text: commentText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...ord,
            comments: [...(ord.comments || []), newComment]
          };
        }
        return ord;
      })
    );
    showToast('Comment added', 'info');
  };

  // 6. Complete / Toggle Task
  const toggleTask = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          const status = nextCompleted ? 'Completed' : 'In Progress';
          if (nextCompleted) {
            addAuditEvent(`Task ${taskId} marked as completed.`, taskId, `Title: ${t.title}`);
            showToast(`Task ${taskId} Completed`, 'success');
          }
          return {
            ...t,
            completed: nextCompleted,
            status,
            completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : null
          };
        }
        return t;
      })
    );
  };

  // 7. Add Employee
  const addEmployee = (empData) => {
    const id = `emp-${employees.length + 1}`;
    const newEmp = {
      id,
      name: empData.name,
      email: empData.email,
      title: empData.title || 'Staff Member',
      department: empData.department || 'Engineering',
      role: empData.role || 'Employee',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      requestsSubmitted: 0,
      approvalsCompleted: 0,
      currentWorkload: 'Optimal (50%)',
      phone: empData.phone || '+91 98000 11223',
      location: 'Bangalore Office',
      joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    };
    setEmployees(prev => [newEmp, ...prev]);
    addAuditEvent(`Added new employee ${newEmp.name} (${newEmp.role}).`, id, `Department: ${newEmp.department}`, 'Admin');
    showToast(`Employee ${newEmp.name} added`, 'success');
    return newEmp;
  };

  // Real-time calculated KPI metrics
  const orderCounts = {
    pending: orders.filter(o => o.status === 'Pending').length + 11, // baseline + dynamic
    accepted: orders.filter(o => o.status === 'Accepted').length + 26,
    denied: orders.filter(o => o.status === 'Denied').length + 3,
    inProgress: orders.filter(o => o.status === 'In Progress').length + 30,
    completed: orders.filter(o => o.status === 'Completed').length + 84, // ensures baseline 86
  };

  const metrics = {
    totalRequests: 248 + (orders.length - INITIAL_ORDERS.length),
    pendingApprovals: 18 + orders.filter(o => o.status === 'Pending').length - 1,
    activeTasks: tasks.filter(t => !t.completed).length + 9,
    ordersInProgress: orderCounts.inProgress,
    completedOrders: orderCounts.completed,
    auditEventsCount: 1284 + (auditLogs.length - INITIAL_AUDIT_LOGS.length),
    approvalRate: 82.4,
    avgApprovalTimeHours: 4.2,
    automationSuccessRate: 96.8,
    policyComplianceRate: 94.1,
  };

  return (
    <WorkflowStoreContext.Provider
      value={{
        orders,
        employees,
        tasks,
        auditLogs,
        orderCounts,
        metrics,
        toasts,
        showToast,
        removeToast,
        acceptOrder,
        denyOrder,
        completeOrder,
        createOrder,
        addOrderComment,
        toggleTask,
        addEmployee,
        addAuditEvent
      }}
    >
      {children}
    </WorkflowStoreContext.Provider>
  );
}

export function useWorkflowStore() {
  const context = useContext(WorkflowStoreContext);
  if (!context) {
    throw new Error('useWorkflowStore must be used within a WorkflowStoreProvider');
  }
  return context;
}
