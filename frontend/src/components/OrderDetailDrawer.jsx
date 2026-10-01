import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  User, 
  Calendar, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  Download, 
  Paperclip, 
  Sparkles,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useI18n } from '../context/I18nContext';

export default function OrderDetailDrawer({ order, isOpen, onClose }) {
  const { acceptOrder, denyOrder, completeOrder, addOrderComment } = useWorkflowStore();
  const { formatCurrency, formatDate } = useI18n();

  const [commentText, setCommentText] = useState('');
  const [denyModalOpen, setDenyModalOpen] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  if (!isOpen || !order) return null;

  const handleDenySubmit = (e) => {
    e.preventDefault();
    if (!denyReason.trim()) return;
    const ok = denyOrder(order.id, denyReason);
    if (ok) {
      setDenyModalOpen(false);
      setDenyReason('');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addOrderComment(order.id, commentText);
    setCommentText('');
  };

  const handleDownloadSummary = () => {
    const summaryText = `FLOWPILOT AI - ORDER SUMMARY
------------------------------------------------
Order ID: ${order.id}
Title: ${order.title}
Requester: ${order.requester} (${order.department})
Amount: ${order.amount} ${order.currency}
Status: ${order.status}
Submitted Date: ${order.submittedDate}
Approver: ${order.assignedApprover}
PO Number: ${order.poNumber || 'N/A'}
Vendor: ${order.vendor || 'N/A'}
Policy Check: ${order.policyCheck?.passed ? 'PASSED' : 'FLAGGED'}
------------------------------------------------
Generated on: ${new Date().toLocaleString()}
FlowPilot AI Intelligent Workflow Engine
`;
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Right-side on Desktop, Full-screen on Mobile) */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {order.id}
              </span>
              <StatusBadge status={order.status} size="sm" />
              {order.priority && <PriorityBadge priority={order.priority} />}
            </div>
            <h2 id="order-drawer-title" className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {order.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Requested by <strong className="text-slate-700 dark:text-slate-300">{order.requester}</strong> • {order.department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close order details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Top Quick Actions) */}
        <div className="px-5 py-3 bg-brand-50/40 dark:bg-brand-950/20 border-b border-brand-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {order.status === 'Pending' && (
              <>
                <button
                  onClick={() => acceptOrder(order.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accept Order
                </button>

                <button
                  onClick={() => setDenyModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Deny Order
                </button>
              </>
            )}

            {order.status !== 'Completed' && order.status !== 'Denied' && (
              <button
                onClick={() => completeOrder(order.id)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Mark as Completed
              </button>
            )}

            {order.status === 'Completed' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Order Completed & Verified</span>
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadSummary}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
            title="Download summary"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Summary</span>
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Denial Notice if Denied */}
          {order.status === 'Denied' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Order Denied</span>
              </div>
              <p className="text-xs mt-1 text-rose-800 dark:text-rose-300">
                {order.denialReason || 'Exceeds budget threshold.'}
              </p>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Total Amount</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block font-sans">
                {formatCurrency(order.amount)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Submitted</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {formatDate(order.submittedDate)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Assigned Approver</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block truncate">
                {order.assignedApprover}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Vendor PO</span>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 mt-1 block truncate">
                {order.poNumber || 'PO-PENDING'}
              </span>
            </div>
          </div>

          {/* Request Full Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              Requisition Details
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {order.description}
            </div>
          </div>

          {/* AI Policy & Budget Check Intelligence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">AI Policy Compliance</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1.5 leading-snug">
                {order.policyCheck?.reason || 'Verified against spend policies and catalog requirements.'}
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                AI Confidence Score: {order.aiConfidence || 95}%
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Budget Verification</span>
              </div>
              <p className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-1.5 leading-snug">
                Department Allocation: {formatCurrency(order.budgetCheck?.allocated || 100000)} • Remaining: {formatCurrency(order.budgetCheck?.remaining || 45000)}
              </p>
              <div className="mt-2 text-[10px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold">
                Status: {order.budgetCheck?.passed ? 'Budget Allocated & Reserved' : 'Requires Special Approval'}
              </div>
            </div>
          </div>

          {/* 6-Stage Visual Workflow Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              6-Stage Visual Workflow Timeline
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              {order.timeline.map((item, index) => {
                const isCompleted = item.status === 'Completed';
                const isCurrent = item.status === 'Current';
                const isDenied = item.status === 'Denied';

                return (
                  <div key={index} className="flex items-start gap-3 relative">
                    {/* Connecting line */}
                    {index < order.timeline.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-px ${
                          isCompleted
                            ? 'bg-emerald-400 dark:bg-emerald-600'
                            : isDenied
                            ? 'bg-rose-400'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/50 scale-105 animate-pulse'
                          : isDenied
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isDenied ? (
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isCurrent ? (
                        <span>{index + 1}</span>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isCompleted
                              ? 'text-emerald-900 dark:text-emerald-300'
                              : isCurrent
                              ? 'text-brand-700 dark:text-brand-300 font-extrabold'
                              : isDenied
                              ? 'text-rose-700 dark:text-rose-400 font-bold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.step}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Comments & Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
              Activity Notes & Comments
            </h4>

            <div className="space-y-2 mb-3">
              {order.comments && order.comments.length > 0 ? (
                order.comments.map(c => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-slate-200">{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No comments yet.</p>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a remark or note..."
                className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1 shadow-xs transition-colors"
              >
                <Send className="w-3 h-3" />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Deny Reason Modal */}
      {denyModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Deny Order {order.id}</span>
              </div>
              <button
                onClick={() => setDenyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDenySubmit} className="mt-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Mandatory Reason for Denial *
              </label>
              <textarea
                rows="3"
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="Explain why this order is being denied (e.g. Budget limit exceeded, unapproved vendor, etc.)"
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDenyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors"
                >
                  Confirm Denial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
