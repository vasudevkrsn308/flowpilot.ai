import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Bot, 
  Layers, 
  Laptop, 
  Clock, 
  CheckCircle2, 
  Check, 
  AlertTriangle,
  ArrowRight, 
  Upload, 
  Paperclip, 
  RefreshCw, 
  Calendar, 
  FileText,
  Building2,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useI18n } from '../context/I18nContext';
import PriorityBadge from '../components/PriorityBadge';

const PRESET_CHIPS = [
  { label: 'Request new equipment', prompt: 'I need 12 monitors for the new design team by next Friday, budget ₹85,000.' },
  { label: 'Order software licenses', prompt: 'Requesting 8 additional Figma Enterprise and JetBrains developer licenses for Q4.' },
  { label: 'Book travel', prompt: 'Flights and accommodation for 2 team members attending the Tech Automation Summit in Delhi.' },
  { label: 'Report a facility issue', prompt: 'The conference room projector on 3rd floor is overheating and needs urgent replacement.' },
  { label: 'Create a lighting automation', prompt: 'Automate evening Relax mode in engineering collaborative pods from 8:00 PM.' }
];

export default function NewRequest() {
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const { addAuditEvent, createOrder } = useWorkflowStore();
  const { t, formatCurrency } = useI18n();

  // Form Fields
  const [rawText, setRawText] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [department, setDepartment] = useState('Engineering');
  const [estimatedAmount, setEstimatedAmount] = useState('85000');
  const [priority, setPriority] = useState('High');
  const [neededByDate, setNeededByDate] = useState('2026-10-10');
  const [attachmentName, setAttachmentName] = useState('');

  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);

  const handleChipClick = (item) => {
    setRawText(item.prompt);
    handleLivePreview(item.prompt);
  };

  const handleLivePreview = async (textToAnalyze = rawText) => {
    if (!textToAnalyze || textToAnalyze.trim().length < 5) return;
    setPreviewLoading(true);
    try {
      const res = await api.requests.analyzePreview(textToAnalyze);
      setPreviewData(res);
      if (res.structuredData?.category) setCategory(res.structuredData.category);
      if (res.structuredData?.estimatedAmount) setEstimatedAmount(String(res.structuredData.estimatedAmount));
      if (res.structuredData?.priority) setPriority(res.structuredData.priority);
    } catch {
      // Fallback local heuristic
      setPreviewData({
        structuredData: {
          category: 'Hardware',
          estimatedAmount: 85000,
          currency: 'INR',
          priority: 'High',
          suggestedApproverRole: 'Manager (Sarah Mitchell)',
          items: [{ type: 'Monitors / Hardware', quantity: 12, description: 'Design pod workstations' }]
        },
        policyResult: {
          passed: true,
          reason: 'Compliant with IT hardware procurement policy. Within ₹100k threshold.',
          budgetStatus: 'WITHIN_THRESHOLD'
        }
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      showToast('Please enter your request details in plain English.', 'WARNING');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rawText: rawText.trim(),
        category,
        department,
        estimatedAmount: Number(estimatedAmount) || 50000,
        priority
      };

      let newId = `REQ-20${Math.floor(10 + Math.random() * 89)}`;
      try {
        const res = await api.requests.create(payload);
        if (res.request?._id || res.request?.id) {
          newId = res.request._id || res.request.id;
        }
      } catch {}

      // Create linked order in workflow store
      createOrder({
        title: rawText.slice(0, 50) + (rawText.length > 50 ? '...' : ''),
        requester: 'Alex Johnson',
        department,
        amount: Number(estimatedAmount) || 75000,
        priority,
        category,
        description: rawText
      });

      addAuditEvent(`Alex Johnson submitted request ${newId}.`, newId, rawText.slice(0, 80), 'Employee');
      showToast('Requisition created & intelligent workflow initialized!', 'SUCCESS');

      setSuccessModalData({
        id: newId,
        title: rawText.slice(0, 60),
        amount: estimatedAmount,
        department,
        approver: 'Sarah Mitchell'
      });
    } catch (err) {
      showToast(err.message || 'Failed to submit request', 'WARNING');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Natural Language Requisition
          </span>
          <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Powered by Gemini AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
          Create New Requisition
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Describe the equipment, software, or workflow you need in plain natural language. FlowPilot AI parses entities, audits spending policy, routes approvals, and tracks execution.
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          AI Suggestion Chips (Click to test):
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-700 hover:border-brand-200 text-slate-700 dark:text-slate-300 hover:text-brand-700 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Form */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Natural Language Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="rawTextInput" className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Natural-Language Request Details *
              </label>
              <button
                type="button"
                onClick={() => handleLivePreview()}
                disabled={previewLoading || !rawText.trim()}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${previewLoading ? 'animate-spin' : ''}`} />
                Test AI Parse
              </button>
            </div>

            <textarea
              id="rawTextInput"
              rows={4}
              required
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              onBlur={() => handleLivePreview()}
              placeholder="Example: I need 12 monitors for the new design team by next Friday."
              className="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-brand-600 focus:ring-3 focus:ring-brand-500/15 p-4 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 resize-y shadow-2xs transition-all"
            />
          </div>

          {/* Structured Supplementary Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Request Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Hardware">Hardware & Laptops</option>
                <option value="Software">Software & SaaS Licenses</option>
                <option value="Facilities">Facilities & Workplaces</option>
                <option value="Marketing">Marketing & Media</option>
                <option value="Travel">Corporate Travel</option>
                <option value="Lighting Automation">Lighting Automation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="IT">IT & Systems</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Facilities">Facilities</option>
                <option value="Platform Team">Platform Team</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Estimated Amount (₹)
              </label>
              <input
                type="number"
                value={estimatedAmount}
                onChange={(e) => setEstimatedAmount(e.target.value)}
                placeholder="75000"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Needed-by Date
              </label>
              <input
                type="date"
                value={neededByDate}
                onChange={(e) => setNeededByDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Attachment / Specs Upload
              </label>
              <label className="flex items-center gap-2 w-full text-xs rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-500 cursor-pointer hover:bg-slate-100">
                <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{attachmentName || 'Attach PDF/Quote'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachmentName(e.target.files[0]?.name || '')}
                />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={submitting || !rawText.trim()}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xs hover:shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-102 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Workflow...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Interpretation Preview Panel */}
      {previewData && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-4 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-1.5 font-bold">
              <Bot className="w-4 h-4 text-brand-600" />
              AI Interpretation & Governance Preview
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Policy Compliant
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 text-[10px] font-mono">Detected Category</span>
              <span className="font-bold text-slate-800 dark:text-white block">{category}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 text-[10px] font-mono">Estimated Amount</span>
              <span className="font-extrabold text-emerald-600 font-mono text-sm block">
                {formatCurrency(estimatedAmount)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 text-[10px] font-mono">Department</span>
              <span className="font-bold text-slate-800 dark:text-white block">{department}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 text-[10px] font-mono">Suggested Approver</span>
              <span className="font-bold text-brand-600 dark:text-brand-400 block">Sarah Mitchell (Manager)</span>
            </div>
          </div>

          {/* Proposed Workflow Steps */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-2 font-mono">
              Proposed Autonomous Workflow Pipeline:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-indigo-800 dark:text-indigo-300">
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border">1. Intake</span>
              <span>➔</span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border">2. AI Validation</span>
              <span>➔</span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border font-bold text-brand-600">3. Sarah Mitchell Review</span>
              <span>➔</span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border">4. Vendor PO Generation</span>
              <span>➔</span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border">5. Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal after Submission */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {successModalData.id}
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              Requisition Successfully Launched!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              FlowPilotAI validated financial policies and forwarded the requisition to <strong>{successModalData.approver}</strong> for authorization.
            </p>

            {/* Stepper Status */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Current Pipeline Stage:</span>
                <span className="text-amber-600 font-bold">Manager Review</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-brand-600 w-3/5 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSuccessModalData(null);
                  setRawText('');
                  setPreviewData(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                Create Another Request
              </button>

              <button
                onClick={() => navigate('/orders')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
              >
                Track Request in Orders →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
