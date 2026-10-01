import React, { useState, useEffect } from 'react';
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
  History
} from 'lucide-react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';

export default function Approvals() {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const [pendingRes, histRes] = await Promise.all([
        api.approvals.getPending(),
        api.approvals.getHistory()
      ]);
      setPendingRequests(pendingRes.requests || []);
      setHistory(histRes.history || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch approvals', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const filteredPending = pendingRequests.filter(req => {
    const matchesSearch = !searchTerm || 
      (req.rawText && req.rawText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.userName && req.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.category && req.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || req.structuredData?.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Manager Authorization Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Approvals & Governance Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review requisitions routed to your tier based on AI policy rules and financial thresholds.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-2xl glass-card border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Decision History ({history.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by requisition title, requester or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs placeholder-slate-500 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5" /> Priority:
              </span>
              {['ALL', 'High', 'Medium', 'Low'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    priorityFilter === p
                      ? 'bg-brand-500 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Pending List Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent mb-2"></div>
              <p className="text-xs text-slate-400">Loading pending requests...</p>
            </div>
          ) : filteredPending.length === 0 ? (
            <div className="rounded-3xl glass-card p-12 text-center border border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">All Caught Up!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                There are no pending requisitions awaiting authorization in your queue right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPending.map((req) => (
                <div
                  key={req._id || req.id}
                  className="rounded-3xl glass-card p-6 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {req.category || 'General IT'}
                      </span>
                      <PriorityBadge priority={req.structuredData?.priority} />
                    </div>

                    <h3 className="text-lg font-bold text-white mt-3 line-clamp-2 group-hover:text-brand-300 transition-colors">
                      "{req.rawText}"
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Requester</span>
                        <span className="font-semibold text-slate-200">{req.userName || 'Employee'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Budget Required</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">
                          {req.structuredData?.currency || 'INR'} {req.structuredData?.estimatedAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {req.policyResult?.reason && (
                      <p className="mt-3 text-xs text-slate-400 line-clamp-2">
                        🛡️ Policy check: {req.policyResult.reason}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>

                    <button
                      onClick={() => navigate(`/requests/${req._id || req.id}`)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-glow flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* History Tab */
        <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl overflow-x-auto">
          {history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-12">No approval decisions recorded yet</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Decision</th>
                  <th className="pb-3">Approver</th>
                  <th className="pb-3">Request ID</th>
                  <th className="pb-3">Comment Notes</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((h) => (
                  <tr key={h._id || h.id} className="hover:bg-slate-900/50">
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        h.decision === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {h.decision}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-200">
                      {h.approverName} ({h.approverRole})
                    </td>
                    <td className="py-3.5 font-mono text-brand-300">
                      #{String(h.requestId).substring(0, 8)}
                    </td>
                    <td className="py-3.5 text-slate-300 max-w-xs truncate">
                      "{h.comment || 'N/A'}"
                    </td>
                    <td className="py-3.5 font-mono text-slate-400">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/requests/${h.requestId}`)}
                        className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}
