import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Eye, 
  AlertTriangle, 
  X,
  HelpCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useI18n } from '../context/I18nContext';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import OrderDetailDrawer from '../components/OrderDetailDrawer';

export default function Approvals() {
  const navigate = useNavigate();
  const { orders, acceptOrder, denyOrder, showToast, addAuditEvent } = useWorkflowStore();
  const { t, formatCurrency, formatDate } = useI18n();

  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending', 'Approved', 'Denied', 'All'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Deny modal state
  const [denyModalOpen, setDenyModalOpen] = useState(false);
  const [orderToDeny, setOrderToDeny] = useState(null);
  const [denyReason, setDenyReason] = useState('');

  // Request Info modal state
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [orderForInfo, setOrderForInfo] = useState(null);
  const [infoQuestion, setInfoQuestion] = useState('');

  const filteredItems = useMemo(() => {
    return orders.filter(ord => {
      // Tab filter
      if (activeTab === 'Pending' && ord.status !== 'Pending') return false;
      if (activeTab === 'Approved' && ord.status !== 'Accepted' && ord.status !== 'Completed') return false;
      if (activeTab === 'Denied' && ord.status !== 'Denied') return false;

      // Department filter
      if (selectedDept !== 'All' && ord.department !== selectedDept) return false;

      // Priority filter
      if (selectedPriority !== 'All' && ord.priority !== selectedPriority) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ord.id.toLowerCase().includes(q) ||
          ord.title.toLowerCase().includes(q) ||
          ord.requester.toLowerCase().includes(q) ||
          ord.department.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [orders, activeTab, selectedDept, selectedPriority, searchQuery]);

  const handleDenySubmit = (e) => {
    e.preventDefault();
    if (!orderToDeny || !denyReason.trim()) return;
    denyOrder(orderToDeny.id, denyReason);
    setDenyModalOpen(false);
    setOrderToDeny(null);
    setDenyReason('');
  };

  const handleRequestInfoSubmit = (e) => {
    e.preventDefault();
    if (!orderForInfo || !infoQuestion.trim()) return;
    addAuditEvent(`Requested more information for ${orderForInfo.id}.`, orderForInfo.id, `Query: "${infoQuestion}"`, 'Manager');
    showToast(`Information request sent to ${orderForInfo.requester}`, 'info');
    setInfoModalOpen(false);
    setOrderForInfo(null);
    setInfoQuestion('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs">
              Management Authorization Desk
            </span>
            <span className="text-xs text-slate-400 font-mono">• Sarah Mitchell Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            Approvals & Governance Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Review, authorize, or deny employee workflow requisitions evaluated by FlowPilot AI policy checks.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-2xs">
          {[
            { id: 'Pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
            { id: 'Approved', label: 'Approved', count: orders.filter(o => o.status === 'Accepted' || o.status === 'Completed').length },
            { id: 'Denied', label: 'Denied', count: orders.filter(o => o.status === 'Denied').length },
            { id: 'All', label: 'All', count: orders.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, title, requester..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="IT">IT</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
              <option value="Facilities">Facilities</option>
              <option value="Platform">Platform Team</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals Cards Grid */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Queue is Clear!</h3>
            <p className="text-xs text-slate-500 mt-1">No requisitions currently match your filter criteria.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedOrder(item);
                setDrawerOpen(true);
              }}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 transition-all cursor-pointer space-y-4"
            >
              {/* Top metadata row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
                    {item.id}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                  <PriorityBadge priority={item.priority} />
                  <span className="text-xs text-slate-400">• Submitted {formatDate(item.submittedDate)}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Requested Amount</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white font-sans">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Requester, AI Confidence & Policy Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Requester</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.requester}</span>
                  <span className="text-[11px] text-slate-500 block">{item.department}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">AI Confidence Score</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {item.aiConfidence || 95}% High Confidence
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Policy Audit Check</span>
                  <span className={`font-semibold flex items-center gap-1 mt-0.5 ${item.policyCheck?.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {item.policyCheck?.passed ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {item.policyCheck?.passed ? 'Spend Limits Verified' : 'Policy Warning'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    setSelectedOrder(item);
                    setDrawerOpen(true);
                  }}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Requisition Details</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOrderForInfo(item);
                      setInfoModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Request Info
                  </button>

                  {item.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => {
                          setOrderToDeny(item);
                          setDenyModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Deny</span>
                      </button>

                      <button
                        onClick={() => acceptOrder(item.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Authorize & Approve</span>
                      </button>
                    </>
                  )}

                  {item.status === 'Accepted' && (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                      Authorized by Manager
                    </span>
                  )}

                  {item.status === 'Completed' && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Fulfilled & Delivered
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Deny Reason Required Modal */}
      {denyModalOpen && orderToDeny && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Denial Notice for {orderToDeny.id}</span>
              </div>
              <button
                onClick={() => setDenyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDenySubmit} className="mt-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mandatory Denial Justification *
              </label>
              <textarea
                rows="3"
                required
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="State the corporate policy justification for denial..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDenyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                >
                  Confirm Denial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request More Information Modal */}
      {infoModalOpen && orderForInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Request Clarification from {orderForInfo.requester}
              </h3>
              <button
                onClick={() => setInfoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestInfoSubmit} className="mt-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Query for Employee
              </label>
              <textarea
                rows="3"
                required
                value={infoQuestion}
                onChange={(e) => setInfoQuestion(e.target.value)}
                placeholder="e.g. Please provide vendor quote or attach approval from IT architecture team."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInfoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
                >
                  Send Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
