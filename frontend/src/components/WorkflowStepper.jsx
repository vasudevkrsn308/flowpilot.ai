import React from 'react';
import { Check, Clock, AlertCircle, ShoppingCart, Sparkles, FileText, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

export default function WorkflowStepper({ steps = [], currentStep = '', status = 'PENDING_APPROVAL', orientation = 'horizontal' }) {
  // Standard fallback 6 steps
  const standardSteps = [
    { name: 'Request Created', icon: FileText },
    { name: 'AI Analysis', icon: Sparkles },
    { name: 'Policy Check', icon: ShieldCheck },
    { name: 'Manager Approval', icon: CheckCircle2 },
    { name: 'Procurement', icon: ShoppingCart },
    { name: 'Completed', icon: Check }
  ];

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

  // Calculate completion percentage for animated connector line
  const doneCount = displaySteps.filter(s => s.status === 'DONE').length;
  const progressPercent = Math.min(100, Math.max(0, (doneCount / (displaySteps.length - 1)) * 100));

  if (orientation === 'vertical') {
    return (
      <div className="relative pl-7 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {displaySteps.map((step, idx) => {
          const isDone = step.status === 'DONE';
          const isCurrent = step.status === 'CURRENT';
          const isRejected = step.status === 'REJECTED' || (status === 'REJECTED' && isCurrent);
          const Icon = getStepIcon(step.name);

          return (
            <div key={step.id || idx} className="relative group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-[35px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-xs'
                    : isRejected
                    ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xs'
                    : isCurrent
                    ? 'bg-brand-600 border-white text-white shadow-md ring-4 ring-brand-100 scale-105'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <Icon className="w-4 h-4 animate-pulse" />
                ) : (
                  <span className="text-xs font-mono font-semibold">{idx + 1}</span>
                )}
              </div>

              {/* Step details card */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-brand-50/70 border-brand-200 shadow-xs'
                    : isDone
                    ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    : isRejected
                    ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isDone ? 'text-emerald-600' : isCurrent ? 'text-brand-600' : isRejected ? 'text-rose-600' : 'text-slate-400'}`} />
                    <h4 className={`text-sm font-bold tracking-tight ${isCurrent ? 'text-slate-900' : isDone ? 'text-slate-800' : isRejected ? 'text-rose-800' : 'text-slate-500'}`}>
                      {step.name}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isCurrent
                        ? 'bg-brand-600 text-white border-brand-700 animate-pulse'
                        : isRejected
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isDone ? 'Completed' : isCurrent ? 'Active Stage' : isRejected ? 'Declined' : 'Upcoming'}
                  </span>
                </div>

                {step.details && (
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {step.details}
                  </p>
                )}

                {step.timestamp && (
                  <p className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
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

  // Horizontal Stepper Bar (Clean Enterprise Light with animated fill connector)
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Base connector line */}
        <div className="absolute top-5 left-4 right-4 h-1 bg-slate-200 rounded-full z-0"></div>
        {/* Animated fill progress connector line */}
        <div 
          className="absolute top-5 left-4 h-1 bg-gradient-to-r from-emerald-500 via-brand-500 to-indigo-600 rounded-full z-0 transition-all duration-700 ease-out"
          style={{ width: `calc(${progressPercent}% * 0.92)` }}
        ></div>

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
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-xs hover:scale-105'
                    : isRejected
                    ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xs'
                    : isCurrent
                    ? 'bg-brand-600 border-white text-white shadow-md ring-4 ring-brand-100 scale-110'
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
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
              <div className="mt-2.5 text-center max-w-[105px]">
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-brand-700'
                      : isDone
                      ? 'text-slate-800'
                      : isRejected
                      ? 'text-rose-700'
                      : 'text-slate-500 font-medium'
                  }`}
                >
                  {step.name}
                </p>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider block mt-0.5 ${
                    isDone
                      ? 'text-emerald-600 font-bold'
                      : isCurrent
                      ? 'text-brand-600 font-bold'
                      : isRejected
                      ? 'text-rose-600'
                      : 'text-slate-400'
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
