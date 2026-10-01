import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Workflow, 
  Clock, 
  Layers, 
  Laptop, 
  Cpu, 
  Users,
  Terminal,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-0"></div>
      <div className="absolute top-2/3 right-10 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none -z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs text-brand-300 shadow-glow mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Smart Automation Hackathon 2026 Edition</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">Powered by Gemini AI</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Turn manual requests into{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              intelligent automated workflows.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Employees type requests in plain language. FlowPilot AI understands the intent, checks financial policy, routes approvals, dispatches procurement orders, and audits every step in real-time.
          </p>

          {/* Quick Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow flex items-center gap-2 transition-all hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/requests/new"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-brand-200" />
                  Try Live Request Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm glass-card hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
                >
                  Sign In / Register
                </Link>
              </>
            )}
          </div>

          {/* 1-Click Role Logins for Hackathon Evaluator */}
          <div className="mt-10 p-5 rounded-2xl glass-card border border-slate-800/80 max-w-2xl mx-auto">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Evaluation Profiles (No sign up needed!)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleQuickDemo('Employee')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-brand-300">Employee</span>
                  <span className="text-[10px] text-brand-400 font-mono">Alex</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Submit plain requests & track visual steps</p>
              </button>

              <button
                onClick={() => handleQuickDemo('Manager')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-brand-300">Manager</span>
                  <span className="text-[10px] text-amber-400 font-mono">Sarah</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Review pending items & trigger tasks</p>
              </button>

              <button
                onClick={() => handleQuickDemo('Admin')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-brand-300">Admin</span>
                  <span className="text-[10px] text-purple-400 font-mono">Devon</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">AI Workflow Generator & Audit logs</p>
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Workflow Preview Showcase */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl glass-card border border-brand-500/25 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold">
                Flagship Procurement Workflow
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                "I need 5 laptops for new hires, budget ₹75,000"
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AI Structured & Policy Passed
              </span>
            </div>
          </div>

          {/* Stepper Preview */}
          <div className="mt-6 py-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { title: '1. Request Created', status: 'Done', color: 'text-emerald-400', border: 'border-emerald-500/40 bg-emerald-500/10' },
                { title: '2. AI Analysis', status: 'Done', color: 'text-emerald-400', border: 'border-emerald-500/40 bg-emerald-500/10' },
                { title: '3. Policy Check', status: 'Done', color: 'text-emerald-400', border: 'border-emerald-500/40 bg-emerald-500/10' },
                { title: '4. Manager Approval', status: 'Active', color: 'text-amber-400', border: 'border-amber-500/40 bg-amber-500/10 shadow-glow' },
                { title: '5. Procurement', status: 'Upcoming', color: 'text-slate-400', border: 'border-slate-800 bg-slate-900/60' },
                { title: '6. Completed', status: 'Upcoming', color: 'text-slate-400', border: 'border-slate-800 bg-slate-900/60' }
              ].map((step, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${step.border} text-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                    <span className={`text-[10px] font-bold ${step.color}`}>{step.status}</span>
                  </div>
                  <p className="mt-2 font-semibold text-white truncate">{step.title.split('. ')[1]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Value comparison 3-column grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                Natural Language Understanding
              </div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Zero complicated 20-field requisition forms. The Gemini AI engine extracts items, counts, budget, category, and urgency automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Deterministic Policy Engine
              </div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Audits against corporate spend thresholds, vendor whitelists, and restricted item filters in milliseconds before notifying approvers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                AI Workflow Generator
              </div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Admins type what they want to automate in plain English. AI synthesizes a 6-stage visual pipeline with automated trigger and task generation.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
