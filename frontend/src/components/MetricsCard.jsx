import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricsCard({ title, value, subtitle, trend, trendPositive = true, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'from-brand-500/20 to-brand-600/5',
      border: 'border-brand-500/20',
      text: 'text-brand-400',
      glow: 'group-hover:border-brand-500/40'
    },
    amber: {
      bg: 'from-amber-500/20 to-amber-600/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'group-hover:border-amber-500/40'
    },
    emerald: {
      bg: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'group-hover:border-emerald-500/40'
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'group-hover:border-purple-500/40'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`group relative overflow-hidden rounded-2xl glass-card p-6 border ${scheme.border} ${scheme.glow} transition-all duration-300 hover:-translate-y-1 hover:shadow-glow`}>
      {/* Background radial gradient accent */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${scheme.bg} blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60`}></div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-white tracking-tight font-sans">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-900/90 border border-slate-800 ${scheme.text} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        <span>{subtitle}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
