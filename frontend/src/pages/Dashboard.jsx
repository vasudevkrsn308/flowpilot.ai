import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Check, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye,
  BarChart3,
  Users,
  ClipboardList,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useI18n } from '../context/I18nContext';
import MetricsCard from '../components/MetricsCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import OrderDetailDrawer from '../components/OrderDetailDrawer';

export default function Dashboard() {
  const { user } = useAuth();
  const { orders, orderCounts, metrics, auditLogs, tasks, acceptOrder, completeOrder } = useWorkflowStore();
  const { t, formatCurrency, formatDate } = useI18n();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSeries, setActiveSeries] = useState({
    activity: true,
    completed: true,
    pending: true,
    denied: true
  });

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const recentOrders = orders.slice(0, 5);
  const pendingApprovals = orders.filter(o => o.status === 'Pending').slice(0, 3);
  const recentAuditEvents = auditLogs.slice(0, 5);
  const activeTasksDue = tasks.filter(t => !t.completed).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Welcome & Role Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              FlowPilot Control Center
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Role: <strong className="text-slate-800 dark:text-slate-200">{user?.role || 'Manager'}</strong> • {user?.department || 'Operations'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            Welcome back, {user?.name || 'Sarah Mitchell'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            You have <strong className="text-amber-600 dark:text-amber-400">{orderCounts.pending} orders</strong> and pending requisitions requiring your management authorization today.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/requests/new"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-xs hover:shadow-glow flex items-center gap-2 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('nav_new_request', 'New Request')}</span>
          </Link>
          <Link
            to="/orders"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* Top 6 Summary KPI Cards (Section 7 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricsCard
          title={t('dash_total_requests', 'Total Requests')}
          value="248"
          subtitle="All departments"
          trend="+14% MoM"
          trendPositive={true}
          icon={FileText}
          color="indigo"
          tooltip="Total employee requisitions submitted into FlowPilotAI"
        />

        <MetricsCard
          title={t('dash_pending_approvals', 'Pending Approvals')}
          value="18"
          subtitle="Action required"
          trend="+3 today"
          trendPositive={false}
          icon={Clock}
          color="amber"
          tooltip="Items waiting for manager sign-off"
        />

        <MetricsCard
          title={t('dash_active_tasks', 'Active Tasks')}
          value="12"
          subtitle="In fulfillment"
          trend="+2 new"
          trendPositive={true}
          icon={ClipboardList}
          color="blue"
          tooltip="Fulfillment orders actively being executed"
        />

        <MetricsCard
          title={t('dash_orders_in_progress', 'Orders in Progress')}
          value={orderCounts.inProgress}
          subtitle="Vendor dispatch"
          trend="+5 ongoing"
          trendPositive={true}
          icon={RefreshCw}
          color="purple"
          tooltip="Purchase orders currently in transit or configuration"
        />

        <MetricsCard
          title={t('dash_completed_orders', 'Completed Orders')}
          value={orderCounts.completed}
          subtitle="100% verified receipt"
          trend="+24% YoY"
          trendPositive={true}
          icon={Check} // VERY CLEAR GREEN CHECKMARK!
          color="emerald"
          isCheckmark={true}
          tooltip="Delivered items with verified receipt and closed audit trail"
        />

        <MetricsCard
          title={t('dash_audit_events', 'Audit Events')}
          value="1,284"
          subtitle="Immutable ledger"
          trend="100% logged"
          trendPositive={true}
          icon={ShieldCheck}
          color="emerald"
          tooltip="Cryptographically verified event entries in system ledger"
        />
      </div>

      {/* Section E: Quick Actions Shortcut Strip */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            {t('dash_quick_actions', 'Quick Actions & Platform Shortcuts')}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/requests/new"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" />
            <span>New Request</span>
          </Link>

          <Link
            to="/approvals"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Review Approvals</span>
          </Link>

          <Link
            to="/orders"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>View Orders ({orderCounts.pending})</span>
          </Link>

          <Link
            to="/employees"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Team & Employees</span>
          </Link>

          <Link
            to="/analytics"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Open Analytics</span>
          </Link>

          <Link
            to="/lighting-modes"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Lighting Demo</span>
          </Link>
        </div>
      </div>

      {/* Section A: Workflow Activity Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              {t('dash_workflow_activity', 'Workflow Activity Chart')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Overview of requests submitted, authorizations, and orders fulfilled.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Requests
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              Completed Orders
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              Pending
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Denied
            </span>
          </div>
        </div>

        {/* SVG Activity Chart */}
        <div className="h-56 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="800" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

            {/* Line: Requests */}
            <path
              d="M0 150 Q 150 110 300 80 T 550 50 T 800 35"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />
            {/* Line: Completed Orders */}
            <path
              d="M0 190 Q 150 170 300 140 T 550 100 T 800 70"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <circle cx="300" cy="140" r="4.5" fill="#10b981" />
            <circle cx="550" cy="100" r="4.5" fill="#10b981" />
            <circle cx="800" cy="70" r="4.5" fill="#10b981" />

            {/* Line: Denied */}
            <path
              d="M0 205 Q 150 200 300 195 T 550 190 T 800 185"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
            <span>01 Sep</span>
            <span>08 Sep</span>
            <span>15 Sep</span>
            <span>22 Sep</span>
            <span>01 Oct (Today)</span>
          </div>
        </div>
      </div>

      {/* Grid: Section B (Recent Orders) & Section C (Pending Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Section B: Recent Orders (7 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-600" />
                  {t('dash_recent_orders', 'Recent Orders')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Procurement pipeline orders with immediate fulfillment tracking.
                </p>
              </div>

              <Link
                to="/orders"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
              >
                <span>All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Request Title</th>
                    <th className="pb-2">Requester</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map(order => (
                    <tr
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {order.id}
                      </td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {order.title}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {order.requester}
                      </td>
                      <td className="py-3 font-extrabold text-slate-900 dark:text-white font-sans">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Showing latest {recentOrders.length} orders</span>
            <Link to="/orders" className="font-semibold text-brand-600 hover:underline">
              Manage complete order catalog →
            </Link>
          </div>
        </div>

        {/* Section C: Pending Actions (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {t('dash_pending_actions', 'Pending Actions')}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                Action Required
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Pending Approvals */}
              {pendingApprovals.map(ord => (
                <div
                  key={ord.id}
                  onClick={() => handleOrderClick(ord)}
                  className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300">{ord.id}</span>
                    <span className="text-[10px] font-bold text-amber-700 font-sans">{formatCurrency(ord.amount)}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1 leading-snug line-clamp-1">
                    {ord.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{ord.requester} • {ord.department}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptOrder(ord.id);
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px]"
                    >
                      Quick Approve
                    </button>
                  </div>
                </div>
              ))}

              {/* Tasks Due Today */}
              {activeTasksDue.map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400">{task.id}</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                    {task.title}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Due: {task.dueDate}</span>
                    <span className="text-brand-600 font-semibold">{task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/approvals"
            className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-center block transition-colors"
          >
            Open Approvals Queue →
          </Link>
        </div>
      </div>

      {/* Section D: Recent Audit Activity Stream */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              {t('dash_recent_audit', 'Recent Audit Activity')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Immutable cryptographically logged compliance trail across actors and AI modules.
            </p>
          </div>

          <Link
            to="/admin/audit-logs"
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            View Full Audit Log →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {recentAuditEvents.map(event => (
            <div
              key={event.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    event.source === 'AI' ? 'bg-purple-500' : event.source === 'Manager' ? 'bg-emerald-500' : 'bg-brand-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{event.user}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {event.source}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{event.action}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] self-end sm:self-auto">
                <span className="font-bold text-brand-600 dark:text-brand-400">{event.entity}</span>
                <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
