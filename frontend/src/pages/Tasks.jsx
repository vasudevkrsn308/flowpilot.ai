import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Calendar, 
  Building2, 
  X,
  ArrowRight,
  MoreVertical,
  Plus
} from 'lucide-react';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, toggleTask, showToast } = useWorkflowStore();
  const { t, formatDate } = useI18n();

  const [activeTab, setActiveTab] = useState('My Tasks'); // 'My Tasks', 'Team Tasks', 'Due Today', 'Overdue', 'Completed Tasks'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Tab filter
      if (activeTab === 'My Tasks') {
        // In demo, show tasks assigned to Sarah Mitchell, Alex Johnson, or team
        if (task.completed) return false;
      } else if (activeTab === 'Team Tasks') {
        if (task.completed) return false;
      } else if (activeTab === 'Due Today') {
        if (task.completed) return false;
      } else if (activeTab === 'Overdue') {
        if (task.completed || task.dueDate >= '2026-10-01') return false;
      } else if (activeTab === 'Completed Tasks') {
        if (!task.completed) return false;
      }

      // Department filter
      if (selectedDept !== 'All' && task.department !== selectedDept) return false;

      // Priority filter
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.id.toLowerCase().includes(q) ||
          task.title.toLowerCase().includes(q) ||
          task.assignee.toLowerCase().includes(q) ||
          task.relatedOrder.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [tasks, activeTab, selectedDept, selectedPriority, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Downstream Task Automation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            Operational & Procurement Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track asset tagging, hardware allocations, and delivery sign-offs automatically dispatched upon approval.
          </p>
        </div>

        {/* Tab Toggle Strip */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto overflow-x-auto shadow-2xs">
          {[
            { id: 'My Tasks', label: 'My Tasks' },
            { id: 'Team Tasks', label: 'Team Tasks' },
            { id: 'Due Today', label: 'Due Today' },
            { id: 'Overdue', label: 'Overdue' },
            { id: 'Completed Tasks', label: 'Completed Tasks', check: true }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? tab.check
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.check && <Check className="w-3 h-3 stroke-[3]" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks by ID, title, assignee, order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="IT">IT</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Facilities">Facilities</option>
              <option value="Platform Team">Platform Team</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No tasks in this view</h3>
            <p className="text-xs text-slate-500 mt-1">All downstream fulfillment orders are currently up to date.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.completed;

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 shadow-xs'
                }`}
              >
                {/* Left: Checkbox + Title + Meta */}
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-slate-400">{task.id}</span>
                      <span className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {task.relatedOrder}
                      </span>
                      <PriorityBadge priority={task.priority} />
                      <span className="text-xs text-slate-400">• {task.department}</span>
                    </div>

                    <h3
                      className={`text-sm font-bold ${
                        isCompleted
                          ? 'text-slate-500 line-through'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Assignee, Due Date & Status */}
                <div className="flex items-center gap-4 text-xs self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Assignee</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{task.assignee}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Due Date</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{task.dueDate}</span>
                  </div>

                  {/* Status Badge with green checkmark on Completed */}
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600 dark:text-emerald-400" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <StatusBadge status={task.status} size="sm" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Details Drawer */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="w-full sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  {selectedTask.id} • TASK DETAILS
                </span>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTask.title}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={selectedTask.status} />
                  <PriorityBadge priority={selectedTask.priority} />
                </div>
              </div>

              <div className="mt-6 space-y-3 text-xs p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Related Order:</span>
                  <span className="font-mono font-bold text-brand-600">{selectedTask.relatedOrder}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assignee:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTask.assignee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span>{selectedTask.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span>{selectedTask.dueDate}</span>
                </div>
                {selectedTask.completedAt && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Completed On:</span>
                    <span>{selectedTask.completedAt}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  toggleTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedTask.completed
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{selectedTask.completed ? 'Mark as Incomplete' : 'Mark Task Completed'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
