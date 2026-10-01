import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowRight, 
  Building2, 
  FileText,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import StatusBadge from '../components/StatusBadge';

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.tasks.list();
      setTasks(res.tasks || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch tasks', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.tasks.updateStatus(id, status);
      showToast(`Task status updated to ${status}!`, 'SUCCESS');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'WARNING');
    }
  };

  const isManagerOrAdmin = user?.role === 'Manager' || user?.role === 'Admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Downstream Automation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Procurement & Fulfillment Tasks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Purchase Orders generated automatically upon managerial approval, tracked through vendor delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Total Orders: <strong>{tasks.length}</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent mb-2"></div>
          <p className="text-xs text-slate-400">Loading procurement orders...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-3xl glass-card p-12 text-center border border-slate-800">
          <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Procurement Tasks Active</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Procurement tasks are created automatically by FlowPilot AI when a manager approves a requisition.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id || task.id}
              className="rounded-3xl glass-card p-6 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                    {task.details?.poNumber || 'PO-2026-SYS'}
                  </span>
                  <StatusBadge status={task.status} />
                </div>

                <h3 className="text-base font-bold text-white mt-3">
                  {task.title}
                </h3>

                <div className="mt-4 space-y-2 text-xs bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vendor:</span>
                    <span className="font-semibold text-slate-200">{task.vendor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Value:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {task.details?.currency || 'INR'} {task.details?.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ETA Delivery:</span>
                    <span className="font-medium text-slate-300">{task.estimatedDeliveryDate || '3 Days'}</span>
                  </div>
                </div>

                {task.details?.items && task.details.items.length > 0 && (
                  <div className="mt-3 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Items: </span>
                    {task.details.items.map(i => `${i.quantity}x ${i.type}`).join(', ')}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/requests/${task.requestId}`)}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                >
                  View Request <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {isManagerOrAdmin && task.status !== 'COMPLETED' && (
                  <div className="flex items-center gap-2">
                    {task.status === 'OPEN' && (
                      <button
                        onClick={() => handleUpdateStatus(task._id || task.id, 'IN_PROGRESS')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        In Transit
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(task._id || task.id, 'COMPLETED')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow"
                    >
                      Deliver
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
