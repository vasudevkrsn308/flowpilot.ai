import React from 'react';
import { Flame, AlertTriangle, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority = 'Medium' }) {
  const norm = (priority || 'Medium').toLowerCase();

  if (norm === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <Flame className="w-3 h-3 text-rose-400 fill-rose-500/20" />
        High Priority
      </span>
    );
  }

  if (norm === 'low') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
        <ArrowDown className="w-3 h-3 text-slate-400" />
        Low Priority
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
      <AlertTriangle className="w-3 h-3 text-amber-400" />
      Medium Priority
    </span>
  );
}
