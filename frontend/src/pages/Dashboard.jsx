import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import MetricsCard from '../components/MetricsCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [reqRes, appRes, logsRes] = await Promise.all([
        api.requests.list(),
        (user?.role === 'Manager' || user?.role === 'Admin') ? api.approvals.getPending() : Promise.resolve({ requests: [] }),
        (user?.role === 'Admin' || user?.role === 'Manager') ? api.auditLogs.list() : Promise.resolve({ logs: [] })
      ]);

      setRequests(reqRes.requests || []);
      setPendingApprovals(appRes.requests || []);
      setRecentLogs((logsRes.logs || []).slice(0, 7));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === 'PENDING_APPROVAL').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 border border-brand-500/20 shadow-glow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30">
              FlowPilot Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Role: <strong className="text-white">{user?.role}</strong> ({user?.department})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {user?.role === 'Manager'
              ? `You have ${pendingApprovals.length} request(s) awaiting your decision.`
              : user?.role === 'Admin'
              ? 'Real-time orchestration overview across all organizational units and automated workflows.'
              : 'Submit requisitions in plain language. Track live AI analysis, policy audits, and approvals.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-3 rounded-xl glass-card hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-brand-400' : ''}`} />
          </button>

          <Link
            to="/requests/new"
            className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow flex items-center gap-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricsCard
          title="Total Requisitions"
          value={totalRequests}
          subtitle="Processed by FlowPilot"
          trend="+18% this month"
          trendPositive={true}
          icon={FileText}
          color="indigo"
        />

        <MetricsCard
          title="Pending Approvals"
          value={pendingCount}
          subtitle="Action required queue"
          trend={pendingCount > 0 ? "Requires review" : "Inbox zero"}
          trendPositive={pendingCount === 0}
          icon={Clock}
          color="amber"
        />

        <MetricsCard
          title="Approved & Fulfilled"
          value={approvedCount}
          subtitle="Purchase orders generated"
          trend="94.2% approval rate"
          trendPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />

        <MetricsCard
          title="Avg Cycle Time"
          value="1.8 hrs"
          subtitle="From submission to PO"
          trend="7.5x faster than manual"
          trendPositive={true}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Pending Approvals Section (For Managers & Admins) */}
      {(user?.role === 'Manager' || user?.role === 'Admin') && pendingApprovals.length > 0 && (
        <div className="rounded-3xl glass-card p-6 border border-amber-500/30 shadow-glow">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pending Approvals Queue</h3>
                <p className="text-xs text-slate-400">Requisitions awaiting formal managerial review</p>
              </div>
            </div>
            <Link
              to="/approvals"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View Full Approvals Inbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((req) => (
              <div
                key={req._id || req.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {req.category || 'General IT'}
                    </span>
                    <PriorityBadge priority={req.structuredData?.priority} />
                  </div>

                  <h4 className="text-base font-bold text-white mt-2.5 line-clamp-2">
                    "{req.rawText}"
                  </h4>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Requester</span>
                      <span className="font-medium text-slate-200">{req.userName || 'Employee'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Estimated Value</span>
                      <span className="font-bold text-emerald-400">
                        {req.structuredData?.currency || 'INR'} {req.structuredData?.estimatedAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                    {req.policyResult?.approvalLevel || 'Manager'} Approval
                  </span>

                  <button
                    onClick={() => navigate(`/requests/${req._id || req.id}`)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-glow flex items-center gap-1.5 transition-all"
                  >
                    <span>Review Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Dual Grid: Requests Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Requests / All Requisitions Table */}
        <div className="lg:col-span-2 rounded-3xl glass-card p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">
                {user?.role === 'Employee' ? 'My Requisitions' : 'All Requests & Pipeline'}
              </h3>
              <p className="text-xs text-slate-400">Track real-time status and active workflow stages</p>
            </div>
            <Link
              to="/requests/new"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              + Create Request
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">No requests submitted yet</p>
                <p className="text-xs text-slate-500 mt-1">Start by describing your equipment or service need</p>
                <Link
                  to="/requests/new"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white shadow-glow"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create First Requisition
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-semibold">Request</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Current Step</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {requests.map((r) => (
                    <tr 
                      key={r._id || r.id}
                      onClick={() => navigate(`/requests/${r._id || r.id}`)}
                      className="group hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <td className="py-4 pr-3 max-w-[220px]">
                        <p className="font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                          {r.rawText}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          by {r.userName || 'Employee'} • {new Date(r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </td>

                      <td className="py-4 pr-3">
                        <span className="inline-block text-[11px] font-medium text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[120px]">
                          {r.category || 'General'}
                        </span>
                      </td>

                      <td className="py-4 pr-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {r.structuredData?.currency || 'INR'} {r.structuredData?.estimatedAmount?.toLocaleString()}
                      </td>

                      <td className="py-4 pr-3 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>

                      <td className="py-4 pr-3 whitespace-nowrap">
                        <span className="text-xs text-brand-300 font-medium bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                          {r.currentStep || 'Manager Approval'}
                        </span>
                      </td>

                      <td className="py-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-brand-300 text-xs font-semibold">
                          View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                Audit Stream
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No recent events recorded</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log._id || log.id} className="relative pl-5 before:absolute before:left-1 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-800 text-xs">
                    <span className="absolute -left-0.5 top-1.5 w-2 h-2 rounded-full bg-brand-500"></span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-200">{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {log.summary}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      Actor: {log.actorName} ({log.actorRole})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                to="/admin/audit-logs"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
              >
                <span>View Full Enterprise Audit Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
