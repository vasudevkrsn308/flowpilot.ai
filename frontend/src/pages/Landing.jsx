import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Zap, 
  ShieldCheck, 
  Workflow, 
  Clock, 
  Layers, 
  Users, 
  Bot, 
  ShoppingBag, 
  ClipboardList, 
  BarChart3, 
  Shield, 
  Lock, 
  Star, 
  FileText, 
  TrendingUp,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import StatusBadge from '../components/StatusBadge';

export default function Landing() {
  const { user, demoLogin } = useAuth();
  const { t, formatCurrency } = useI18n();
  const navigate = useNavigate();

  // Workflow visualizer interactive active step
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(4); // Default on Manager Approval

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    navigate('/dashboard');
  };

  const workflowStages = [
    { id: 1, name: 'Request Submitted', status: 'Completed', icon: Check, color: 'emerald', tip: 'Plain text natural language input' },
    { id: 2, name: 'AI Understands Request', status: 'Completed', icon: Check, color: 'emerald', tip: 'Gemini cognitive entity extraction' },
    { id: 3, name: 'Policy & Budget Validation', status: 'Completed', icon: Check, color: 'emerald', tip: 'Spend threshold and vendor validation' },
    { id: 4, name: 'Manager Approval', status: 'Active', icon: Clock, color: 'purple', tip: 'Sarah Mitchell authorization queue' },
    { id: 5, name: 'Order Accepted or Denied', status: 'Upcoming', icon: CheckCircle2, color: 'indigo', tip: 'Decision threshold' },
    { id: 6, name: 'Procurement Processing', status: 'Upcoming', icon: Zap, color: 'slate', tip: 'Vendor PO generation' },
    { id: 7, name: 'Completed', status: 'Completed_Target', icon: Check, color: 'emerald', tip: 'Fulfilled & signed asset delivery' }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Background Decorative Gradients & Lavender Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-100/70 via-indigo-100/50 to-purple-100/40 dark:from-brand-950/40 dark:via-indigo-950/30 dark:to-purple-950/20 blur-[130px] rounded-full pointer-events-none -z-0"></div>
      <div className="absolute top-2/3 right-10 w-96 h-96 bg-brand-100/60 dark:bg-brand-950/30 blur-[100px] rounded-full pointer-events-none -z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-brand-700 dark:text-brand-300 shadow-2xs mb-6 font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Smart Automation Hackathon 2026 Edition</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Powered by Gemini AI</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Turn manual requests into{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              intelligent automated workflows.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Employees type requests in plain language. FlowPilotAI understands the intent, checks financial policy, routes approvals, dispatches procurement orders, and audits every step in real time.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xs hover:shadow-glow flex items-center gap-2 transition-all hover:scale-102"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xs transition-all"
            >
              Explore How It Works
            </a>
          </div>

          {/* 1-Click Role Profiles (Evaluation Shortcut) */}
          <div className="mt-10 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs max-w-2xl mx-auto">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-3 flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Evaluation Profiles (No Sign Up Needed)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickDemo('Employee')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-xs text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Employee</span>
                  <span className="text-[10px] text-brand-600 dark:text-brand-400 font-mono font-bold">Alex</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Submit plain requests and track visual workflow steps.
                </p>
              </button>

              <button
                onClick={() => handleQuickDemo('Manager')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-xs text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Manager</span>
                  <span className="text-[10px] text-amber-600 font-mono font-bold">Sarah</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Review pending items, approve requests, and trigger tasks.
                </p>
              </button>

              <button
                onClick={() => handleQuickDemo('Admin')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-xs text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Admin</span>
                  <span className="text-[10px] text-purple-600 font-mono font-bold">Devon</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Manage AI workflows, employees, permissions, and audit logs.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Interactive Workflow Visualization (7 Stages) */}
        <div id="how-it-works" className="mt-20 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              End-to-End Orchestration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              7-Stage Interactive Workflow Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Click any stage below to inspect how plain natural language translates into verified procurement orders.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            {/* Horizontal Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {workflowStages.map((stage) => {
                const isActive = activeWorkflowStep === stage.id;
                const isCompleted = stage.status === 'Completed' || stage.id === 7;
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    onClick={() => setActiveWorkflowStep(stage.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                      isActive
                        ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 shadow-sm ring-2 ring-brand-500/20'
                        : isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-400">0{stage.id}</span>
                        {isCompleted && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                        {isActive && !isCompleted && (
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs animate-pulse">
                            ●
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {stage.name}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                      {stage.tip}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Stage Detail Spotlight Box */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Stage {activeWorkflowStep}: {workflowStages[activeWorkflowStep - 1]?.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {workflowStages[activeWorkflowStep - 1]?.tip} • Automatic audit trail logging guaranteed.
                  </p>
                </div>
              </div>

              <Link
                to="/orders"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>View Live Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section A: Key Capabilities (6 Cards) */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Enterprise-Grade Workflow Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: 'AI Request Understanding',
                desc: 'Translates unstructured natural language into structured BOM, counts, specifications, and urgency tiers using Google Gemini.'
              },
              {
                icon: CheckCircle2,
                title: 'Smart Approval Routing',
                desc: 'Dynamically routes requisitions to departmental directors or finance admins based on organizational spending matrices.'
              },
              {
                icon: ShoppingBag,
                title: 'Procurement Order Management',
                desc: 'Tracks orders from Pending through Accepted, In Progress, and Completed with automated PO assignment and vendor dispatch.'
              },
              {
                icon: ShieldCheck,
                title: 'Policy & Budget Compliance',
                desc: 'Instantly validates orders against quarterly departmental budgets and restricted asset catalogs before alerting approvers.'
              },
              {
                icon: ClipboardList,
                title: 'Task Automation',
                desc: 'Generates downstream tasks for IT and facilities teams upon approval, closing the loop with verified receipt.'
              },
              {
                icon: FileText,
                title: 'Real-Time Audit Logging',
                desc: 'Cryptographically records every action, timestamp, actor, and policy snapshot with 1-click CSV compliance export.'
              }
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section C: Dashboard & Orders Preview Card */}
        <div className="mt-20 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-brand-600 uppercase">Interactive Live Telemetry</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Executive Dashboard & Orders Overview
              </h3>
            </div>
            <Link
              to="/orders"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore Orders Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Requests</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">248</span>
              <span className="text-[11px] text-emerald-600 font-bold">+14% MoM</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Pending Approvals</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">18</span>
              <span className="text-[11px] text-slate-500">Sarah Mitchell queue</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Tasks</span>
              <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">12</span>
              <span className="text-[11px] text-slate-500">IT & Facilities</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Completed Orders</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-emerald-600">86</span>
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">100% verified</span>
            </div>
          </div>
        </div>

        {/* Section D: Trust and Enterprise Benefits */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Enterprise Trust & Compliance by Design
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { icon: Users, label: 'Role-Based Access', sub: 'Employee, Manager, Admin' },
              { icon: Sparkles, label: 'AI-Powered Engine', sub: 'Gemini 1.5 Cognitive' },
              { icon: ShieldCheck, label: 'Policy Compliance', sub: 'Budget & Rule Checks' },
              { icon: FileText, label: 'Transparent Audit', sub: 'Immutable Event Logs' },
              { icon: TrendingUp, label: 'Faster Cycles', sub: '75% Latency Reduction' },
              { icon: Lock, label: 'Secure Processing', sub: 'Enterprise JWT & RBAC' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <Icon className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.sub}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section E: Testimonials */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Loved by Operations & Engineering Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Elena Rostova',
                title: 'VP of Technology Operations',
                company: 'FinVance Global',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                quote: 'FlowPilotAI eliminated 80% of back-and-forth approval emails. Our hardware provisioning turnaround dropped from 6 days to under 4 hours.'
              },
              {
                name: 'Marcus Vance',
                title: 'Director of Procurement',
                company: 'HyperScale Cloud',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                quote: 'The automated PO generation and policy checks are game-changing. We caught 18 budget overruns before orders were even dispatched.'
              },
              {
                name: 'Aisha Al-Mansoor',
                title: 'Principal Systems Architect',
                company: 'Apex Logistics',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                quote: 'The AI Workflow Generator blew our evaluators away. Describing what we needed in plain English and getting an active visual pipeline in seconds is magic.'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.title}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section F: Final CTA */}
        <div className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to automate the work that slows your team down?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-100 max-w-xl mx-auto">
            Experience the next era of intelligent AI workflow automation. Zero training needed.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/requests/new"
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-brand-700 hover:bg-brand-50 shadow-md transition-all hover:scale-102"
            >
              Start a Workflow
            </Link>
            <button
              onClick={() => handleQuickDemo('Manager')}
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-brand-700/80 hover:bg-brand-700 text-white border border-brand-400/40 transition-all"
            >
              Book a Demo (Explore as Sarah Mitchell)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
