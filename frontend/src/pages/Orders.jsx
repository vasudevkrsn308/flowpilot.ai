import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCw, 
  MoreVertical, 
  Eye, 
  ArrowUpDown, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import CreateOrderModal from '../components/CreateOrderModal';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useI18n } from '../context/I18nContext';

export default function Orders() {
  const { orders, orderCounts, acceptOrder, completeOrder } = useWorkflowStore();
  const { t, formatCurrency, formatDate } = useI18n();

  // Filters & State
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Pending', 'Accepted', 'Denied', 'In Progress', 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount_high', 'amount_low', 'status'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Tab Filter
        if (activeTab !== 'All' && order.status !== activeTab) {
          return false;
        }
        // Department Filter
        if (selectedDept !== 'All' && order.department !== selectedDept) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = order.id.toLowerCase().includes(q);
          const matchTitle = order.title.toLowerCase().includes(q);
          const matchRequester = order.requester.toLowerCase().includes(q);
          const matchDept = order.department.toLowerCase().includes(q);
          if (!matchId && !matchTitle && !matchRequester && !matchDept) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.submittedDate) - new Date(a.submittedDate);
        if (sortBy === 'oldest') return new Date(a.submittedDate) - new Date(b.submittedDate);
        if (sortBy === 'amount_high') return b.amount - a.amount;
        if (sortBy === 'amount_low') return a.amount - b.amount;
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
  }, [orders, activeTab, selectedDept, searchQuery, sortBy]);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order ID,Title,Requester,Department,Amount,Currency,Submitted Date,Approver,Status,PO Number'];
    const rows = filteredOrders.map(o => 
      `"${o.id}","${o.title.replace(/"/g, '""')}","${o.requester}","${o.department}",${o.amount},"${o.currency}","${o.submittedDate}","${o.assignedApprover}","${o.status}","${o.poNumber || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FlowPilot_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {t('orders_title', 'Orders')}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              PRIMARY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('orders_subtitle', 'Monitor, approve, and track workflow-related orders from submission to completion.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('action_export', 'Export CSV')}</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs hover:shadow-glow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('action_create_order', 'Create Order')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Cards (With Count-Up Animation) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
        <MetricsCard
          title={t('orders_pending_card', 'Pending Orders')}
          value={orderCounts.pending}
          subtitle="Awaiting review"
          trend="+3 today"
          trendPositive={true}
          icon={Clock}
          color="amber"
          tooltip="Orders awaiting manager approval or compliance review"
        />

        <MetricsCard
          title={t('orders_accepted_card', 'Accepted Orders')}
          value={orderCounts.accepted}
          subtitle="Authorized by manager"
          trend="+12% MoM"
          trendPositive={true}
          icon={CheckCircle2}
          color="indigo"
          tooltip="Approved orders moving into procurement execution"
        />

        <MetricsCard
          title={t('orders_denied_card', 'Denied Orders')}
          value={orderCounts.denied}
          subtitle="Non-compliant requests"
          trend="-2 this week"
          trendPositive={true}
          icon={XCircle}
          color="rose"
          tooltip="Orders flagged for policy violations or budget caps"
        />

        <MetricsCard
          title={t('orders_in_progress_card', 'Orders in Progress')}
          value={orderCounts.inProgress}
          subtitle="Active procurement"
          trend="+5 ongoing"
          trendPositive={true}
          icon={RotateCw}
          color="purple"
          tooltip="POs dispatched to enterprise vendors in fulfillment stage"
        />

        <MetricsCard
          title={t('orders_completed_card', 'Completed Orders')}
          value={orderCounts.completed}
          subtitle="100% verified & delivered"
          trend="+24% YoY"
          trendPositive={true}
          icon={Check} // VERY CLEAR GREEN CHECKMARK ICON!
          color="emerald"
          isCheckmark={true}
          tooltip="Delivered items with verified receipt and closed audit trail"
        />
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: 'All', label: t('status_all', 'All Orders'), count: orders.length },
              { id: 'Pending', label: t('status_pending', 'Pending'), count: orders.filter(o => o.status === 'Pending').length },
              { id: 'Accepted', label: t('status_accepted', 'Accepted'), count: orders.filter(o => o.status === 'Accepted').length },
              { id: 'In Progress', label: t('status_in_progress', 'In Progress'), count: orders.filter(o => o.status === 'In Progress').length },
              { id: 'Completed', label: t('status_completed', 'Completed'), count: orders.filter(o => o.status === 'Completed').length, check: true },
              { id: 'Denied', label: t('status_denied', 'Denied'), count: orders.filter(o => o.status === 'Denied').length },
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? tab.id === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs'
                        : 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {tab.check && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/80 dark:bg-slate-800 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('action_search', 'Search orders...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Departments</option>
              <option value="IT">IT</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
              <option value="Facilities">Facilities</option>
              <option value="Platform">Platform Team</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="amount_high">Highest Amount</option>
              <option value="amount_low">Lowest Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Order Table View */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                  onChange={toggleSelectAll}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </th>
              <th className="py-3.5 px-3">Order ID</th>
              <th className="py-3.5 px-3">Request Title</th>
              <th className="py-3.5 px-3">Requested By</th>
              <th className="py-3.5 px-3">Department</th>
              <th className="py-3.5 px-3">Amount</th>
              <th className="py-3.5 px-3">Submitted</th>
              <th className="py-3.5 px-3">Approver</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto">
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      {t('orders_empty_message', 'No orders match your filters.')}
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('All');
                        setSearchQuery('');
                        setSelectedDept('All');
                      }}
                      className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                    >
                      {t('action_clear_filters', 'Clear Filters')}
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => {
                const isSelected = selectedOrderIds.includes(order.id);
                const isCompleted = order.status === 'Completed';

                return (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order)}
                    className={`group cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50/50 dark:bg-brand-950/30'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                      {order.id}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {order.title}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {order.requester}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                        {order.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white font-sans whitespace-nowrap">
                      {formatCurrency(order.amount)}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(order.submittedDate)}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {order.assignedApprover}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {/* Status Badge with clearly visible green checkmark on Completed */}
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="py-3.5 pr-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRowClick(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {order.status === 'Pending' && (
                          <button
                            onClick={() => acceptOrder(order.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
                          >
                            Accept
                          </button>
                        )}

                        {!isCompleted && order.status !== 'Denied' && (
                          <button
                            onClick={() => completeOrder(order.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition-colors"
                            title="Complete Order"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            Complete
                          </button>
                        )}

                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="lg:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              {t('orders_empty_message', 'No orders match your filters.')}
            </p>
            <button
              onClick={() => {
                setActiveTab('All');
                setSearchQuery('');
                setSelectedDept('All');
              }}
              className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 hover:bg-brand-50"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              onClick={() => handleRowClick(order)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-slate-400">• {order.department}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {order.title}
                  </h3>
                </div>
                <StatusBadge status={order.status} size="xs" />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Amount</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(order.amount)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Requester</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {order.requester}
                  </span>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-50 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                {order.status === 'Pending' && (
                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    Accept
                  </button>
                )}
                {order.status !== 'Completed' && order.status !== 'Denied' && (
                  <button
                    onClick={() => completeOrder(order.id)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    Complete
                  </button>
                )}
                <button
                  onClick={() => handleRowClick(order)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
                >
                  View Details
                </button>
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

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
