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
  AlertTriangle,
  Flame,
  ArrowRight,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import WorkflowStepper from '../components/WorkflowStepper';
import PriorityBadge from '../components/PriorityBadge';

const SAMPLE_PROMPTS = [
  {
    title: '5 Laptops (Flagship)',
    prompt: 'I need 5 laptops for new hires, budget ₹75,000.'
  },
  {
    title: 'Ergonomic Task Chairs',
    prompt: 'Ergonomic task chairs (3 units) for the design pod, budget ₹42,000'
  },
  {
    title: 'Dual 4K Monitors',
    prompt: '2x 4K UltraSharp Dell 27-inch monitors for frontend development workstation'
  },
  {
    title: 'Cloud ML Server',
    prompt: 'High-compute GPU cloud instances for model training, budget $2,400, urgent'
  }
];

export default function NewRequest() {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [rawText, setRawText] = useState('');
  const [priorityOverride, setPriorityOverride] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handleSelectPrompt = (prompt) => {
    setRawText(prompt);
    handleLivePreview(prompt);
  };

  const handleLivePreview = async (textToAnalyze = rawText) => {
    if (!textToAnalyze || textToAnalyze.trim().length < 5) return;
    setPreviewLoading(true);
    try {
      const res = await api.requests.analyzePreview(textToAnalyze);
      setPreviewData(res);
    } catch (err) {
      console.warn('Preview failed:', err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      showToast('Please describe what you need in the text area.', 'WARNING');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rawText: rawText.trim(),
        priority: priorityOverride || undefined
      };

      const res = await api.requests.create(payload);
      showToast('🎉 Requisition created and intelligent workflow initialized!', 'SUCCESS');
      
      const newId = res.request?._id || res.request?.id;
      navigate(`/requests/${newId}`);
    } catch (err) {
      showToast(err.message || 'Failed to submit request', 'WARNING');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30">
            Plain Language Ingestion
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400">Zero cumbersome forms required</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
          Create New Requisition
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Describe the equipment, software, or service you need in natural English. FlowPilot AI parses the entities, checks financial policies, and orchestrates approvals.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        
        {/* Quick Sample Prompt Chips */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
            💡 Sample Requisition Presets (Click to test):
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(item.prompt)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-brand-500/15 border border-slate-700/80 hover:border-brand-500/40 text-slate-300 hover:text-brand-200 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Friendly Text Area */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="rawTextInput" className="block text-sm font-semibold text-slate-200">
                Describe what you need in plain language:
              </label>
              <button
                type="button"
                onClick={() => handleLivePreview()}
                disabled={previewLoading || !rawText.trim()}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${previewLoading ? 'animate-spin' : ''}`} />
                Test AI Parse
              </button>
            </div>

            <div className="relative">
              <textarea
                id="rawTextInput"
                rows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                onBlur={() => handleLivePreview()}
                placeholder="Example: I need 5 laptops for new hires, budget ₹75,000."
                className="w-full rounded-2xl glass-input p-4 text-base placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 resize-y"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Optional Priority:</span>
              <div className="flex items-center gap-1.5">
                {['', 'Low', 'Medium', 'High'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityOverride(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      priorityOverride === p
                        ? 'bg-brand-500 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {p === '' ? 'Auto (AI)' : p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !rawText.trim()}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Orchestrating Workflow...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit & Launch Automated Workflow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Live AI Analysis & Policy Check Previews (If analyzed) */}
      {previewData && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-400" />
            <h3 className="text-base font-bold text-white">Live AI Extraction Preview</h3>
            <span className="text-xs text-slate-500 font-mono">(Instant Client Simulation)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Analysis Card */}
            <div className="rounded-2xl glass-card p-5 border border-brand-500/30 shadow-glow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-300 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Analysis Card
                </span>
                <PriorityBadge priority={priorityOverride || previewData.structuredData?.priority} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block mb-1">Identified Category</span>
                  <span className="font-semibold text-white block">
                    {previewData.structuredData?.category || 'Hardware'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block mb-1">Estimated Budget</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm block">
                    {previewData.structuredData?.currency || 'INR'} {previewData.structuredData?.estimatedAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Extracted Items
                </span>
                <div className="space-y-1.5">
                  {(previewData.structuredData?.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-200">
                      <span className="font-medium">• {item.type}</span>
                      <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-brand-300">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {previewData.structuredData?.urgencyReason && (
                <p className="text-xs text-slate-400 italic">
                  "{previewData.structuredData.urgencyReason}"
                </p>
              )}
            </div>

            {/* Policy Check Card */}
            <div className="rounded-2xl glass-card p-5 border border-emerald-500/30 shadow-glow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Policy Check Card
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  previewData.policyResult?.passed 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {previewData.policyResult?.passed ? 'Policy Compliant' : 'Policy Blocked'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Approval Required:</span>
                  <span className="font-bold text-white">
                    {previewData.policyResult?.requiresApproval ? `Yes – ${previewData.policyResult.approvalLevel}` : 'Auto-Approve'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Budget Threshold Tier:</span>
                  <span className="font-mono text-brand-300">
                    {previewData.policyResult?.budgetStatus}
                  </span>
                </div>
              </div>

              {/* Matched Rules */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Matched Policy Rules
                </span>
                {(previewData.policyResult?.matchedRules || []).map((rule, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                {previewData.policyResult?.reason}
              </p>
            </div>

          </div>

          {/* Stepper Preview */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Automated Stepper Pipeline Ready for Execution:
            </h4>
            <WorkflowStepper currentStep="Request Created" />
          </div>
        </div>
      )}

    </div>
  );
}
