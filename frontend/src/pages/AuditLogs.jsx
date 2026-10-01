import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  FileJson, 
  Eye, 
  RefreshCw, 
  Check, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useI18n } from '../context/I18nContext';
import { Link } from 'react-router-dom';

export default function AuditLogs() {
  const { auditLogs } = useWorkflowStore();
  const { t, formatDate } = useI18n();

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (sourceFilter !== 'ALL' && log.source !== sourceFilter) return false;
      if (typeFilter !== 'ALL' && log.entityType !== typeFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q) ||
          log.entity.toLowerCase().includes(q) ||
          (log.details && log.details.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [auditLogs, sourceFilter, typeFilter, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['Timestamp,User,Role,Action,Entity,EntityType,Status,Source,Details'];
    const rows = filteredLogs.map(l =>
      `"${l.timestamp}","${l.user}","${l.role}","${l.action.replace(/"/g, '""')}","${l.entity}","${l.entityType}","${l.status}","${l.source}","${(l.details || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FlowPilot_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              SOC2 & ISO 27001 Compliance Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            Immutable Enterprise Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Complete cryptographic audit trail recording all AI parsings, policy evaluations, and managerial authorizations in real time.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, user, order, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Sources</option>
              <option value="AI">AI Engine</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Entity Types</option>
              <option value="ORDER">Orders</option>
              <option value="REQUEST">Requests</option>
              <option value="AUTH">Auth / Permissions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Timestamp</th>
              <th className="py-3.5 px-3">Actor & Source</th>
              <th className="py-3.5 px-3">Action</th>
              <th className="py-3.5 px-3">Related Entity</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  No audit entries found matching current filter parameters.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedEvent(log)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pl-6 pr-3 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{log.user}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                          log.source === 'AI'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : log.source === 'Manager'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {log.source}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-3">
                    {log.entity.startsWith('ORD') ? (
                      <Link
                        to="/orders"
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        {log.entity}
                      </Link>
                    ) : (
                      <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                        {log.entity}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3 h-3 stroke-[3]" />
                      {log.status || 'VERIFIED'}
                    </span>
                  </td>

                  <td className="py-3.5 pr-6 text-right">
                    <button
                      onClick={() => setSelectedEvent(log)}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Audit Telemetry Event Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Event ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedEvent.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono">{new Date(selectedEvent.timestamp).toUTCString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Actor:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.user} ({selectedEvent.role})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Origin Source:</span>
                  <span>{selectedEvent.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Entity:</span>
                  <span className="font-mono font-bold text-brand-600">{selectedEvent.entity}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Action Executed:
                </span>
                <p className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                  {selectedEvent.action}
                </p>
              </div>

              {selectedEvent.details && (
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Event Snapshot & Policy Metadata:
                  </span>
                  <p className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {selectedEvent.details}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
