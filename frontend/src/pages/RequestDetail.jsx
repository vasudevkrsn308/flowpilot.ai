import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  User, 
  FileText, 
  DollarSign, 
  AlertCircle,
  Truck,
  MessageSquare,
  History,
  Check,
  Send,
  Building2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import WorkflowStepper from '../components/WorkflowStepper';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [request, setRequest] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approval action form state
  const [decisionComment, setDecisionComment] = useState('');
  const [decisionLoading, setDecisionLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.requests.getById(id);
      setRequest(res.request);
      setApprovals(res.approvals || []);
      setTasks(res.tasks || []);
      setAuditLogs(res.auditLogs || []);
    } catch (err) {
      showToast(err.message || 'Could not load request details', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDecision = async (decision) => {
    setDecisionLoading(true);
    try {
      await api.requests.approve(id, {
        decision,
        comment: decisionComment.trim()
      });

      if (decision === 'APPROVED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast('🎉 Requisition approved! Procurement order dispatched.', 'SUCCESS');
      } else {
        showToast('Requisition has been declined.', 'WARNING');
      }

      setDecisionComment('');
      fetchDetail();
    } catch (err) {
      showToast(err.message || 'Decision submission failed', 'WARNING');
    } finally {
      setDecisionLoading(false);
    }
  };

  const handleAdvanceTask = async (taskId, nextStatus) => {
    try {
      await api.tasks.updateStatus(taskId, nextStatus);
      showToast(`Procurement task advanced to ${nextStatus}!`, 'SUCCESS');
      fetchDetail();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'WARNING');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent mb-3"></div>
        <p className="text-sm text-slate-400">Loading intelligent workflow telemetry...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Requisition Not Found</h2>
        <p className="text-sm text-slate-400 mt-2">The requested workflow ID does not exist or access was restricted.</p>
        <Link to="/dashboard" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const structured = request.structuredData || {};
  const policy = request.policyResult || {};
  const isManagerOrAdmin = user?.role === 'Manager' || user?.role === 'Admin';
  const isPending = request.status === 'PENDING_APPROVAL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Navigation & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Requisition #{String(request._id || request.id).substring(0, 8)}
            </h1>
            <StatusBadge status={request.status} size="lg" />
          </div>

          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Submitted by <strong>{request.userName || 'Employee'}</strong></span>
            <span>•</span>
            <span>{new Date(request.createdAt).toLocaleString()}</span>
          </p>
        </div>

        {/* Horizontal Progress Stepper Bar on Desktop */}
        <div className="hidden xl:block max-w-xl w-full">
          <WorkflowStepper steps={request.workflowSteps} currentStep={request.currentStep} status={request.status} />
        </div>
      </div>

      {/* Dual Column Layout: Left (Request + AI + Policy) | Right (Workflow Stepper + Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Telemetry, AI Extraction & Policy */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Original Request Card */}
          <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
                <FileText className="w-4 h-4 text-brand-400" />
                Original Requisition Prompt
              </span>
              <PriorityBadge priority={structured.priority} />
            </div>

            <p className="text-base text-white font-medium bg-slate-900/80 p-4 rounded-2xl border border-slate-800 leading-relaxed font-sans">
              "{request.rawText}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span>Category: <strong className="text-slate-200">{request.category}</strong></span>
              <span>•</span>
              <span>Assigned Approver: <strong className="text-brand-300">{request.assignedApproverName || 'Department Manager'}</strong></span>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="rounded-3xl glass-card p-6 border border-brand-500/30 shadow-glow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-300 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Gemini AI Cognitive Breakdown
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                100% Parsed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Normalized Budget</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {structured.currency || 'INR'} {structured.estimatedAmount?.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Intent Category</span>
                <span className="font-semibold text-slate-200 block truncate">
                  {structured.category || 'Hardware'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block mb-1">Priority Rating</span>
                <span className="font-semibold text-white block">
                  {structured.priority || 'Medium'} Tier
                </span>
              </div>
            </div>

            {/* Extracted Items Table */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Extracted Bill of Materials (BOM)
              </span>
              <div className="space-y-2">
                {(structured.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div>
                      <p className="font-semibold text-white">{item.type}</p>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-brand-300">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {structured.urgencyReason && (
              <p className="text-xs text-slate-400 italic bg-brand-500/5 p-3 rounded-xl border border-brand-500/10">
                💡 AI Rationale: "{structured.urgencyReason}"
              </p>
            )}
          </div>

          {/* Policy Check Card */}
          <div className="rounded-3xl glass-card p-6 border border-emerald-500/30 shadow-glow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Corporate Policy Evaluation
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                policy.passed 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {policy.passed ? 'Policy Verified' : 'Policy Violation'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Approval Required:</span>
                <span className="font-bold text-white">
                  {policy.requiresApproval ? `Yes – ${policy.approvalLevel}` : 'Auto-Approved'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Governance Tier:</span>
                <span className="font-mono text-brand-300">{policy.budgetStatus}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-slate-300 leading-relaxed">
                {policy.reason}
              </div>
            </div>

            {/* Matched Rules Checklist */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Evaluated Corporate Spend Rules
              </span>
              {(policy.matchedRules || []).map((rule, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Downstream Procurement Tasks Card (If Approved) */}
          {tasks.length > 0 && (
            <div className="rounded-3xl glass-card p-6 border border-cyan-500/30 shadow-glow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-bold">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  Downstream Procurement Order
                </span>
                <span className="text-xs font-mono text-slate-400">
                  PO Generated Automatically
                </span>
              </div>

              {tasks.map((t) => (
                <div key={t._id || t.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.title}</h4>
                      <p className="text-xs font-mono text-cyan-300 mt-0.5">PO: {t.details?.poNumber}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Vendor Channel</span>
                      <span className="font-medium text-slate-300">{t.vendor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Estimated Delivery</span>
                      <span className="font-medium text-emerald-400">{t.estimatedDeliveryDate || '3 Business Days'}</span>
                    </div>
                  </div>

                  {isManagerOrAdmin && t.status !== 'COMPLETED' && (
                    <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                      {t.status === 'OPEN' && (
                        <button
                          onClick={() => handleAdvanceTask(t._id || t.id, 'IN_PROGRESS')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          Mark In Transit
                        </button>
                      )}
                      <button
                        onClick={() => handleAdvanceTask(t._id || t.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow transition-all"
                      >
                        Confirm Delivery (Complete)
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column (5 cols): Workflow Stepper & Approval Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Manager / Admin Decision Action Card (If Pending) */}
          {isPending && isManagerOrAdmin && (
            <div className="rounded-3xl glass-card p-6 border border-amber-500/40 shadow-glow space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Manager Approval Decision</h3>
                  <p className="text-xs text-slate-400">Formal authorization required for this requisition</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Approval Notes or Feedback:
                </label>
                <textarea
                  rows={2}
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  placeholder="e.g. Approved. Necessary equipment for upcoming quarter."
                  className="w-full rounded-xl glass-input p-3 text-xs placeholder-slate-500 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={decisionLoading}
                  onClick={() => handleDecision('REJECTED')}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Decline Request</span>
                </button>

                <button
                  type="button"
                  disabled={decisionLoading}
                  onClick={() => handleDecision('APPROVED')}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-success border border-emerald-400/40 flex items-center justify-center gap-1.5 transition-all hover:scale-102"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Approve & Dispatch PO</span>
                </button>
              </div>
            </div>
          )}

          {/* If already decided, show Decision Record Card */}
          {approvals.length > 0 && (
            <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Recorded Approval Decision
              </span>
              {approvals.map((app) => (
                <div key={app._id || app.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-400" />
                      {app.approverName} ({app.approverRole})
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.decision === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {app.decision}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic">
                    "{app.comment || 'No comment provided'}"
                  </p>

                  <span className="text-[10px] text-slate-500 font-mono block">
                    Recorded at {new Date(app.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Visual Workflow Stepper (Vertical Detailed View) */}
          <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-sm font-bold text-white">Workflow Execution Pipeline</h3>
              <span className="text-[10px] font-mono text-brand-400">Step 1 to 6</span>
            </div>
            
            <WorkflowStepper
              steps={request.workflowSteps}
              currentStep={request.currentStep}
              status={request.status}
              orientation="vertical"
            />
          </div>

          {/* Audit Trail for this request */}
          <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <History className="w-4 h-4 text-brand-400" />
              Request Audit History
            </span>

            <div className="space-y-3 pt-2 text-xs">
              {auditLogs.length === 0 ? (
                <p className="text-slate-500 text-xs">No audit events recorded</p>
              ) : (
                auditLogs.map((l) => (
                  <div key={l._id || l.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">{l.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
                      {l.summary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
