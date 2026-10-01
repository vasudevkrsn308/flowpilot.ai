import React from 'react';
import { Flame, AlertTriangle, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority = 'Medium' }) {
  const norm = (priority || 'Medium').toLowerCase();

  if (norm === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/90 dark:border-rose-800/80 shadow-xs">
        <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-rose-100 dark:fill-rose-900/40" />
        High Priority
      </span>
    );
  }

  if (norm === 'low') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
        <ArrowDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        Low Priority
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/80 shadow-xs">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      Medium Priority
    </span>
  );
}
