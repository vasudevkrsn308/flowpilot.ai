import React from 'react';
import { Clock, CheckCircle2, XCircle, PackageCheck, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const norm = (status || '').toUpperCase();

  const config = {
    PENDING_APPROVAL: {
      label: 'Pending Approval',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
      dot: 'bg-amber-400 animate-ping'
    },
    APPROVED: {
      label: 'Approved',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      dot: 'bg-emerald-400'
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: XCircle,
      dot: 'bg-rose-400'
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-brand-500/10 text-brand-300 border-brand-500/30',
      icon: PackageCheck,
      dot: 'bg-brand-400'
    },
    OPEN: {
      label: 'Open',
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      icon: Clock,
      dot: 'bg-sky-400'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      icon: AlertCircle,
      dot: 'bg-indigo-400 animate-pulse'
    }
  };

  const item = config[norm] || {
    label: status || 'Unknown',
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock,
    dot: 'bg-slate-400'
  };

  const Icon = item.icon;
  const sizeClasses = size === 'lg' ? 'px-3.5 py-1.5 text-sm gap-2' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${item.bg} ${sizeClasses}`}>
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${item.dot}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${item.dot.split(' ')[0]}`}></span>
      </span>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{item.label}</span>
    </span>
  );
}
