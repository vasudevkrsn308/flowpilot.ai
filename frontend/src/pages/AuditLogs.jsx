import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  FileJson, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import AuditDetailModal from '../components/AuditDetailModal';

export default function AuditLogs() {
  const { showToast } = useNotifications();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // Filters
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.auditLogs.list({
        entityType: entityFilter,
        action: actionFilter,
        search: searchTerm
      });
      setLogs(res.logs || []);
    } catch (err) {
      showToast(err.message || 'Failed to load audit logs', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter, actionFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Time', 'Entity', 'Entity ID', 'Action', 'Actor Name', 'Actor Role', 'Summary'];
    const rows = logs.map(l => [
      new Date(l.createdAt).toISOString(),
      l.entityType,
      l.entityId,
      l.action,
      l.actorName,
      l.actorRole,
      `"${(l.summary || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flowpilot_audit_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit trail exported to CSV successfully', 'SUCCESS');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SOC2 & ISO 27001 Compliance Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Immutable Enterprise Audit Trail
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete cryptographic audit trail recording all AI parsings, policy evaluations, and managerial approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="p-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold glass-card hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl glass-card p-4 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by summary keywords, entity ID or actor name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs placeholder-slate-500 focus:ring-2 focus:ring-brand-500"
          />
        </form>

        {/* Entity Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-mono">Entity:</span>
          {['ALL', 'REQUEST', 'APPROVAL', 'TASK', 'WORKFLOW', 'AUTH'].map(type => (
            <button
              key={type}
              onClick={() => setEntityFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                entityFilter === type
                  ? 'bg-brand-600 text-white font-bold shadow-glow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl glass-card p-6 border border-slate-800 shadow-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent mb-2"></div>
            <p className="text-xs text-slate-400">Loading audit records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No audit records matching your current filter.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Entity</th>
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Actor / System</th>
                <th className="pb-3 font-semibold">Event Summary</th>
                <th className="pb-3 font-semibold text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr
                  key={log._id || log.id}
                  onClick={() => setSelectedLog(log)}
                  className="group hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pr-4 whitespace-nowrap font-mono text-slate-400">
                    {new Date(log.createdAt).toLocaleString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>

                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {log.entityType}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 whitespace-nowrap font-bold text-white group-hover:text-brand-300 transition-colors">
                    {log.action}
                  </td>

                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-brand-400" />
                      <span className="font-semibold text-slate-200">{log.actorName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Role: {log.actorRole}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 text-slate-300 max-w-md truncate">
                    {log.summary}
                  </td>

                  <td className="py-3.5 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-400 group-hover:text-brand-300 font-semibold bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/20">
                      <Eye className="w-3 h-3" /> Inspect
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}

    </div>
  );
}
