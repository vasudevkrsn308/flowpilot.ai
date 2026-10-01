import React from 'react';
import { Clock, CheckCircle2, XCircle, RotateCw, Check } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const { t } = useI18n();
  const raw = (status || '').trim();
  const norm = raw.toUpperCase().replace(/\s+/g, '_');

  // Status mapping
  let config = {
    label: raw || 'Pending',
    bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    icon: Clock,
    iconColor: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500'
  };

  if (norm === 'COMPLETED' || norm === 'DONE') {
    config = {
      label: t('status_completed', 'Completed'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 font-semibold',
      icon: Check, // Very clear green checkmark icon
      iconColor: 'text-emerald-600 dark:text-emerald-400 stroke-[3]',
      dot: 'bg-emerald-500'
    };
  } else if (norm === 'ACCEPTED' || norm === 'APPROVED') {
    config = {
      label: norm === 'APPROVED' ? 'Approved' : t('status_accepted', 'Accepted'),
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80 font-semibold',
      icon: CheckCircle2,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      dot: 'bg-indigo-500'
    };
  } else if (norm === 'DENIED' || norm === 'REJECTED' || norm === 'CANCELLED') {
    config = {
      label: norm === 'REJECTED' ? 'Rejected' : t('status_denied', 'Denied'),
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/80 font-semibold',
      icon: XCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      dot: 'bg-rose-500'
    };
  } else if (norm === 'IN_PROGRESS' || norm === 'PROCESSING') {
    config = {
      label: t('status_in_progress', 'In Progress'),
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80 font-semibold',
      icon: RotateCw,
      iconColor: 'text-purple-600 dark:text-purple-400 animate-spin',
      dot: 'bg-purple-500 animate-pulse'
    };
  } else if (norm === 'PENDING' || norm === 'PENDING_APPROVAL' || norm === 'OPEN') {
    config = {
      label: t('status_pending', 'Pending'),
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80 font-semibold',
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500 animate-pulse'
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm gap-2' : size === 'xs' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-0.5 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs font-medium tracking-tight whitespace-nowrap transition-colors ${config.bg} ${sizeClasses} ${className}`}
      role="status"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}></span>
      </span>
      <Icon className={`${size === 'lg' ? 'w-4 h-4' : size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${config.iconColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
