import React from 'react';
import { X, ShieldCheck, Clock, User, Hash, FileJson, ArrowRight } from 'lucide-react';

export default function AuditDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Audit Record Entry
              </span>
              <h3 className="text-lg font-bold text-white">
                {log.action} on {log.entityType}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Details */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block mb-1">Timestamp</span>
            <span className="font-mono text-slate-200 font-medium">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block mb-1">Actor (Initiator)</span>
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" />
              {log.actorName || 'System'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Role: {log.actorRole || 'SYSTEM'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block mb-1">Entity ID</span>
            <span className="font-mono text-slate-300 font-medium truncate block" title={log.entityId}>
              {log.entityId}
            </span>
          </div>
        </div>

        {/* Human Readable Summary */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Summary Event Description
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {log.summary}
          </p>
        </div>

        {/* Deep Payload JSON Inspector */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-brand-400" />
              Immutable Context & Metadata
            </span>
            <span className="text-[10px] font-mono text-slate-500">JSON Payload</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs font-mono text-slate-300 overflow-x-auto max-h-60 selection:bg-brand-500">
            {JSON.stringify(log.metadata || {}, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
