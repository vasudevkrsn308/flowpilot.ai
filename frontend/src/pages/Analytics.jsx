import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw, 
  Zap, 
  AlertCircle, 
  PieChart, 
  Activity, 
  Users, 
  Building2, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const { user } = useAuth();
  const { orderCounts, metrics, orders, employees } = useWorkflowStore();
  const { t, formatCurrency } = useI18n();

  const [dateRange, setDateRange] = useState('30d'); // '7d', '30d', '90d', 'year'
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeSeries, setActiveSeries] = useState({
    submitted: true,
    approved: true,
    accepted: true,
    denied: true,
    completed: true
  });

  // Query Assistant State
  const [queryInput, setQueryInput] = useState('');
  const [queryAnswer, setQueryAnswer] = useState(null);

  const toggleSeries = (key) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock answers for Analytics Query Assistant
  const handleAskAssistant = (prompt) => {
    const q = (prompt || queryInput).toLowerCase();
    if (q.includes('denied') || q.includes('why')) {
      setQueryAnswer({
        query: prompt || queryInput,
        title: 'Order Denial Root Cause Analysis',
        summary: '4 orders were denied in the last 30 days. 75% were due to departmental quarterly discretionary hardware caps being exceeded in Marketing and Facilities.',
        recommendation: 'Recommend pooling Q1 budgets across Design & Marketing to prevent unnecessary procurement stops.'
      });
    } else if (q.includes('approval time') || q.includes('longest')) {
      setQueryAnswer({
        query: prompt || queryInput,
        title: 'Longest Approval Cycle: Marketing (7.1 hrs)',
        summary: 'Marketing has the highest average review latency at 7.1 hours, compared to 2.4 hours in IT and 3.1 hours in Operations.',
        recommendation: 'Enable automated fast-track approval for recurring vendor orders under ₹25,000.'
      });
    } else if (q.includes('completed') || q.includes('month')) {
      setQueryAnswer({
        query: prompt || queryInput,
        title: 'Completed Orders Telemetry',
        summary: `86 procurement orders successfully delivered with 100% verified receipt. Total fulfilled capital expenditure: ₹3.82M.`,
        recommendation: 'All 86 completed orders have zero open audit flags.'
      });
    } else if (q.includes('pending') || q.includes('task')) {
      setQueryAnswer({
        query: prompt || queryInput,
        title: 'Active Workload Bottleneck Analysis',
        summary: 'Ravi Kumar (Facilities) currently has 3 active tasks relating to camera and cabling installations. IT has 2 asset tagging tickets.',
        recommendation: 'Workload is within healthy parameters (<88%). No escalation needed.'
      });
    } else {
      setQueryAnswer({
        query: prompt || queryInput,
        title: 'FlowPilot AI Workflow Telemetry',
        summary: `Analyzed 248 enterprise requests. AI policy auto-compliance rate is 94.1%, resulting in 126 employee hours saved this month.`,
        recommendation: 'Platform health is optimal.'
      });
    }
    setQueryInput('');
  };

  // Funnel Data
  const funnelStages = [
    { name: 'Requests Submitted', count: 248, pct: '100%', drop: null },
    { name: 'AI Policy Checks Passed', count: 233, pct: '94.0%', drop: '-6%' },
    { name: 'Sent for Approval', count: 218, pct: '87.9%', drop: '-6.1%' },
    { name: 'Approved by Managers', count: 180, pct: '72.5%', drop: '-15.4%' },
    { name: 'Converted to Orders', count: 145, pct: '58.4%', drop: '-14.1%' },
    { name: 'Completed & Delivered', count: 86, pct: '34.6%', drop: null, check: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {t('nav_analytics', 'Analytics')}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track workflow performance, approval latency, order fulfillment, and AI automation impact.
          </p>
        </div>

        {/* Controls: Date range & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Range Selector */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${dateRange === '7d' ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              7D
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${dateRange === '30d' ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              30D
            </button>
            <button
              onClick={() => setDateRange('90d')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${dateRange === '90d' ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              90D
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${dateRange === 'year' ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Year
            </button>
          </div>

          <button
            onClick={() => alert('Exporting Analytics Executive Report (PDF/CSV)...')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 15 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 my-6">
        <MetricsCard
          title="Total Requests"
          value="248"
          subtitle="+14% vs prev period"
          trend="+14%"
          trendPositive={true}
          icon={Activity}
          color="indigo"
          tooltip="Total plain-language requests submitted"
        />

        <MetricsCard
          title="Approval Rate"
          value="82.4%"
          subtitle="Accepted / Decisions"
          trend="+3.2%"
          trendPositive={true}
          icon={TrendingUp}
          color="emerald"
          tooltip="Percentage of reviewed items receiving manager approval"
        />

        <MetricsCard
          title="Avg Approval Time"
          value="4.2 hrs"
          subtitle="Reduced from 18 hrs"
          trend="-18%"
          trendPositive={true}
          icon={Clock}
          color="blue"
          tooltip="Mean duration between request submission and approval decision"
        />

        <MetricsCard
          title="Orders Completed"
          value={orderCounts.completed}
          subtitle="100% verified receipt"
          trend="+24%"
          trendPositive={true}
          icon={Check} // Green Checkmark!
          color="emerald"
          isCheckmark={true}
          tooltip="Total fulfilled orders stamped with green checkmark"
        />

        <MetricsCard
          title="Auto-Success Rate"
          value="96.8%"
          subtitle="Zero manual routing"
          trend="+1.5%"
          trendPositive={true}
          icon={Zap}
          color="purple"
          tooltip="Workflows automatically classified and routed without intervention"
        />

        <MetricsCard
          title="Policy Compliance"
          value="94.1%"
          subtitle="Within corporate budget"
          trend="+2.1%"
          trendPositive={true}
          icon={ShieldCheck}
          color="emerald"
          tooltip="Requisitions compliant with financial spending limits"
        />
      </div>

      {/* Section A: Workflow Activity Over Time Area Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Workflow Activity Over Time
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive timeline of submissions, approval outcomes, and order completions.
            </p>
          </div>

          {/* Series Toggles */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => toggleSeries('submitted')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                activeSeries.submitted ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200' : 'text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Submitted
            </button>
            <button
              onClick={() => toggleSeries('approved')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                activeSeries.approved ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200' : 'text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Approved
            </button>
            <button
              onClick={() => toggleSeries('completed')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                activeSeries.completed ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200' : 'text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Completed ✓
            </button>
            <button
              onClick={() => toggleSeries('denied')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                activeSeries.denied ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200' : 'text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Denied
            </button>
          </div>
        </div>

        {/* Clean Interactive SVG Area/Line Chart */}
        <div className="relative h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
            <line x1="0" y1="220" x2="800" y2="220" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

            {/* Submitted Series (Indigo) */}
            {activeSeries.submitted && (
              <>
                <path
                  d="M0 160 Q 150 120 300 90 T 550 60 T 800 45"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  className="transition-all duration-500"
                />
                <path
                  d="M0 160 Q 150 120 300 90 T 550 60 T 800 45 L 800 220 L 0 220 Z"
                  fill="url(#indigoGrad)"
                  opacity="0.15"
                />
              </>
            )}

            {/* Approved Series (Purple) */}
            {activeSeries.approved && (
              <path
                d="M0 180 Q 150 150 300 120 T 550 90 T 800 70"
                fill="none"
                stroke="#9333ea"
                strokeWidth="2.5"
                className="transition-all duration-500"
              />
            )}

            {/* Completed Series (Emerald with visible green dots) */}
            {activeSeries.completed && (
              <>
                <path
                  d="M0 200 Q 150 180 300 150 T 550 110 T 800 80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="transition-all duration-500"
                />
                <circle cx="300" cy="150" r="5" fill="#10b981" />
                <circle cx="550" cy="110" r="5" fill="#10b981" />
                <circle cx="800" cy="80" r="5" fill="#10b981" />
              </>
            )}

            {/* Denied Series (Rose) */}
            {activeSeries.denied && (
              <path
                d="M0 215 Q 150 210 300 205 T 550 200 T 800 195"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="transition-all duration-500"
              />
            )}

            <defs>
              <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
            <span>Week 1 (01 Sep)</span>
            <span>Week 2 (08 Sep)</span>
            <span>Week 3 (15 Sep)</span>
            <span>Week 4 (22 Sep)</span>
            <span>Week 5 (01 Oct)</span>
          </div>
        </div>
      </div>

      {/* Grid: Donut Chart Breakdown & Approval Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Section B: Order Status Breakdown (Donut Chart) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-600" />
              Order Status Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution across active order fulfillment stages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            {/* Donut SVG */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="14" />
                {/* Completed (Emerald) - 52% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="125 240" strokeDashoffset="0" />
                {/* In Progress (Purple) - 20% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="48 240" strokeDashoffset="-125" />
                {/* Accepted (Indigo) - 18% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="14" strokeDasharray="42 240" strokeDashoffset="-173" />
                {/* Pending (Amber) - 8% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray="20 240" strokeDashoffset="-215" />
                {/* Denied (Rose) - 2% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="14" strokeDasharray="5 240" strokeDashoffset="-235" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white block font-sans">
                  {orderCounts.completed}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block flex items-center justify-center gap-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Completed
                </span>
              </div>
            </div>

            {/* Legend with Icons & Percentages */}
            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    Completed
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCounts.completed} (52%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">In Progress</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCounts.inProgress} (20%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Accepted</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCounts.accepted} (18%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Pending</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCounts.pending} (8%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Denied</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCounts.denied} (2%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Approval Funnel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              Approval Stage Funnel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step-by-step conversion and drop-off rate from plain text request to order fulfillment.
            </p>
          </div>

          <div className="space-y-3 mt-4">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {stage.check && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                    {stage.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{stage.count}</span>
                    <span className="text-[10px] text-slate-400">({stage.pct})</span>
                    {stage.drop && (
                      <span className="text-[10px] text-rose-500 font-bold">{stage.drop}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      stage.check
                        ? 'bg-emerald-500'
                        : idx === 0
                        ? 'bg-brand-600'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: stage.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Department Performance & Request Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Section E: Department Performance Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-brand-600" />
            Departmental Workflow Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                  <th className="pb-2">Department</th>
                  <th className="pb-2">Requests</th>
                  <th className="pb-2">Approval %</th>
                  <th className="pb-2">Avg Time</th>
                  <th className="pb-2 text-right">Order Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {[
                  { dept: 'IT & Hardware', reqs: 94, rate: '88.2%', time: '2.4 hrs', spend: 850000 },
                  { dept: 'Engineering', reqs: 68, rate: '92.1%', time: '3.1 hrs', spend: 425000 },
                  { dept: 'Operations', reqs: 42, rate: '84.0%', time: '4.5 hrs', spend: 320000 },
                  { dept: 'Facilities', reqs: 26, rate: '78.5%', time: '5.2 hrs', spend: 195000 },
                  { dept: 'Marketing', reqs: 18, rate: '64.0%', time: '7.1 hrs', spend: 167200 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{row.dept}</td>
                    <td className="py-2.5">{row.reqs}</td>
                    <td className="py-2.5 text-emerald-600 font-bold">{row.rate}</td>
                    <td className="py-2.5 text-slate-500 font-mono">{row.time}</td>
                    <td className="py-2.5 text-right font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(row.spend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D: Request Categories Horizontal Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            Top Request Categories by Spend
          </h3>

          <div className="space-y-4">
            {[
              { name: 'Hardware & Laptops', count: 88, spend: 1250000, pct: '85%' },
              { name: 'Software & SaaS Licenses', count: 64, spend: 680000, pct: '65%' },
              { name: 'Facilities & Ergonomics', count: 42, spend: 450000, pct: '45%' },
              { name: 'Cloud Infrastructure', count: 24, spend: 380000, pct: '38%' },
              { name: 'Lighting Automation', count: 18, spend: 120000, pct: '22%' },
              { name: 'Marketing & Events', count: 12, spend: 85000, pct: '15%' },
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">{cat.count} reqs</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(cat.spend)}</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-500" style={{ width: cat.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section G: AI Automation Impact Cards */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white dark:from-slate-900 dark:to-brand-950/40 border border-brand-200/80 dark:border-brand-900/60 shadow-xs mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            AI Automation Impact Telemetry
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-mono uppercase text-slate-400 block">Hours Saved</span>
            <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1 block">
              126 hrs
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">This month</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-mono uppercase text-slate-400 block">Manual Steps Replaced</span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
              1,420
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Automated routing</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-mono uppercase text-slate-400 block">Parsing Accuracy</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
              93.4%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Gemini 1.5 entity extraction</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-mono uppercase text-slate-400 block">Policy Issues Flagged</span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
              18
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Compliance violations stopped</span>
          </div>
        </div>
      </div>

      {/* Section J: Analytics Query Assistant */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Ask FlowPilot AI (Analytics Query Assistant)
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Query your organizational workflow and order telemetry in plain English.
        </p>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {[
            'Why are orders being denied?',
            'Which department has the longest approval time?',
            'Show completed orders this month.',
            'Which employees have the most pending tasks?'
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAssistant(chip)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
            >
              💬 {chip}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (queryInput.trim()) handleAskAssistant();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask anything about your workflow or order metrics (e.g. 'What was total hardware spend?')..."
            className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze
          </button>
        </form>

        {/* Assistant Answer Card */}
        {queryAnswer && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 animate-slide-up text-xs">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{queryAnswer.title}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
              {queryAnswer.summary}
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
              💡 Recommendation: {queryAnswer.recommendation}
            </p>
          </div>
        )}
      </div>

      {/* Link to Audit Log CTA */}
      <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Need raw cryptographic audit history?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inspect immutable event logs with actor timestamps and entity snapshots.
          </p>
        </div>
        <Link
          to="/admin/audit-logs"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
        >
          <span>View Audit Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
