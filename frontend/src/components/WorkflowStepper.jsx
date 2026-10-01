import React from 'react';
import { Check, Clock, AlertCircle, ShoppingCart, Sparkles, FileText, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

export default function WorkflowStepper({ steps = [], currentStep = '', status = 'PENDING_APPROVAL', orientation = 'horizontal' }) {
  // Fallback default 6 steps if not provided
  const standardSteps = [
    { name: 'Request Created', icon: FileText },
    { name: 'AI Analysis', icon: Sparkles },
    { name: 'Policy Check', icon: ShieldCheck },
    { name: 'Manager Approval', icon: CheckCircle2 },
    { name: 'Procurement', icon: ShoppingCart },
    { name: 'Completed', icon: Check }
  ];

  // Merge steps with standard metadata
  const displaySteps = steps.length > 0 ? steps : standardSteps.map((s, idx) => ({
    id: `step-${idx+1}`,
    name: s.name,
    status: idx === 0 ? 'DONE' : (idx === 1 ? 'CURRENT' : 'UPCOMING'),
    details: 'Step queued'
  }));

  const getStepIcon = (stepName) => {
    const norm = stepName.toLowerCase();
    if (norm.includes('created')) return FileText;
    if (norm.includes('ai') || norm.includes('analysis')) return Sparkles;
    if (norm.includes('policy')) return ShieldCheck;
    if (norm.includes('approval')) return CheckCircle2;
    if (norm.includes('procurement')) return ShoppingCart;
    return Check;
  };

  if (orientation === 'vertical') {
    return (
      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {displaySteps.map((step, idx) => {
          const isDone = step.status === 'DONE';
          const isCurrent = step.status === 'CURRENT';
          const isRejected = step.status === 'REJECTED' || (status === 'REJECTED' && isCurrent);
          const Icon = getStepIcon(step.name);

          return (
            <div key={step.id || idx} className="relative group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-[30px] top-1.5 flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : isRejected
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : isCurrent
                    ? 'bg-brand-500 border-white text-white shadow-glow animate-pulse-subtle'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                ) : (
                  <span className="text-xs font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Step details card */}
              <div
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-brand-500/10 border-brand-500/40 shadow-glow'
                    : isDone
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    : isRejected
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-brand-400' : isRejected ? 'text-rose-400' : 'text-slate-500'}`} />
                    <h4 className={`text-sm font-semibold tracking-wide ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : isRejected ? 'text-rose-300' : 'text-slate-400'}`}>
                      {step.name}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isCurrent
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-pulse'
                        : isRejected
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? 'Completed' : isCurrent ? 'In Progress' : isRejected ? 'Declined' : 'Upcoming'}
                  </span>
                </div>

                {step.details && (
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {step.details}
                  </p>
                )}

                {step.timestamp && (
                  <p className="mt-2 text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(step.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Stepper Bar
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Continuous background connector line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-slate-800 z-0"></div>

        {displaySteps.map((step, idx) => {
          const isDone = step.status === 'DONE';
          const isCurrent = step.status === 'CURRENT';
          const isRejected = step.status === 'REJECTED' || (status === 'REJECTED' && isCurrent);
          const Icon = getStepIcon(step.name);

          return (
            <div key={step.id || idx} className="relative z-10 flex flex-col items-center group">
              {/* Circle Node */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-glow-success'
                    : isRejected
                    ? 'bg-rose-950 border-rose-500 text-rose-400'
                    : isCurrent
                    ? 'bg-brand-600 border-white text-white shadow-glow scale-110'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
                title={step.name}
              >
                {isDone ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : isRejected ? (
                  <XCircle className="w-5 h-5" />
                ) : isCurrent ? (
                  <Icon className="w-5 h-5 animate-pulse" />
                ) : (
                  <Icon className="w-4 h-4 opacity-60" />
                )}
              </div>

              {/* Title label */}
              <div className="mt-2.5 text-center max-w-[100px]">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    isCurrent
                      ? 'text-brand-300 font-bold'
                      : isDone
                      ? 'text-slate-200'
                      : isRejected
                      ? 'text-rose-400'
                      : 'text-slate-500'
                  }`}
                >
                  {step.name}
                </p>
                <span
                  className={`text-[10px] block mt-0.5 ${
                    isDone
                      ? 'text-emerald-400'
                      : isCurrent
                      ? 'text-brand-400 font-medium'
                      : isRejected
                      ? 'text-rose-400'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? 'Done' : isCurrent ? 'Active' : isRejected ? 'Declined' : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
