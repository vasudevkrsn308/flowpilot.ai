import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MetricsCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  color = 'indigo',
  tooltip = '',
  isCheckmark = false
}) {
  const { reducedMotion } = useTheme();
  const [displayValue, setDisplayValue] = useState(() => (reducedMotion ? value : 0));
  const [showTooltip, setShowTooltip] = useState(false);

  // Initial count-up animation for numbers on mount
  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    // If value is numeric, count up
    const num = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num <= 0) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = Math.ceil(num / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        if (String(value).includes('%')) {
          setDisplayValue(`${start}%`);
        } else if (String(value).includes(',')) {
          setDisplayValue(start.toLocaleString());
        } else {
          setDisplayValue(start);
        }
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, reducedMotion]);

  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/60',
      text: 'text-indigo-600 dark:text-indigo-400',
      bar: 'bg-indigo-500'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/60',
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/60',
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-100 dark:border-purple-900/60',
      text: 'text-purple-600 dark:text-purple-400',
      bar: 'bg-purple-500'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/60',
      text: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-blue-500'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/60',
      text: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-rose-500'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      {/* Subtle top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${scheme.bar} opacity-75`} />

      <div className="flex items-start justify-between">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            {tooltip && (
              <div
                className="relative inline-block cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                title={tooltip}
              >
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[11px] leading-tight text-center shadow-xl z-30 pointer-events-none animate-fade-in border border-slate-700">
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {displayValue}
            </h3>
            {isCheckmark && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" title="Completed verified">
                ✓
              </span>
            )}
          </div>
        </div>

        <div
          className={`p-3 rounded-2xl ${scheme.bg} ${scheme.border} border ${scheme.text} shadow-xs group-hover:scale-110 transition-transform duration-300 shrink-0`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <span className="truncate mr-2">{subtitle}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold shrink-0 ${
              trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
