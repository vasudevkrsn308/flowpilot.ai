import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Workflow, 
  ArrowRight, 
  Plus, 
  Sliders, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import VisualPipeline from '../components/VisualPipeline';

const PRESETS = [
  'I want to automate employee laptop and hardware procurement.',
  'Automate SaaS tool licenses with security compliance check and Okta provisioning.',
  'Emergency cloud infrastructure server spend approval and quota increase.',
  'Corporate travel flights booking, spend threshold check and per-diem claim flow.'
];

export default function WorkflowGenerator() {
  const { showToast } = useNotifications();

  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activating, setActivating] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const fetchSavedTemplates = async () => {
    try {
      setLoadingSaved(true);
      const res = await api.workflows.list();
      setSavedTemplates(res.templates || []);
      if (res.templates && res.templates.length > 0 && !currentTemplate) {
        setCurrentTemplate(res.templates[0]);
      }
    } catch (err) {
      console.warn('Failed to load templates:', err.message);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedTemplates();
  }, []);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the workflow to automate', 'WARNING');
      return;
    }

    setGenerating(true);
    try {
      const res = await api.workflows.generate(description.trim());
      const generated = res.template;

      // Save as new template in DB
      const savedRes = await api.workflows.create({
        name: generated.name,
        category: generated.category || 'Operations',
        description: generated.description,
        definition: generated.definition,
        isActive: false // Starts as draft until activated
      });

      setCurrentTemplate(savedRes.template);
      showToast('✨ Workflow successfully synthesized by FlowPilot AI!', 'SUCCESS');
      fetchSavedTemplates();
    } catch (err) {
      showToast(err.message || 'Generation failed', 'WARNING');
    } finally {
      setGenerating(false);
    }
  };

  const handleActivateToggle = async () => {
    if (!currentTemplate) return;
    setActivating(true);
    try {
      const res = await api.workflows.toggleActive(currentTemplate._id || currentTemplate.id);
      setCurrentTemplate(res.template);

      if (res.template.isActive) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        showToast(`🎉 "${res.template.name}" is now LIVE and Active!`, 'SUCCESS');
      } else {
        showToast(`Workflow "${res.template.name}" moved to Draft.`, 'INFO');
      }

      fetchSavedTemplates();
    } catch (err) {
      showToast(err.message || 'Activation toggle failed', 'WARNING');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-500/20 to-purple-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5 shadow-glow">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              AI Workflow Architect (WOW Feature)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Generate a New Automated Workflow
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Describe any business process in plain language. The Gemini engine compiles an end-to-end multi-stage pipeline ready for activation.
          </p>
        </div>
      </div>

      {/* Input Formulation Card */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-brand-500/30 shadow-xl space-y-6">
        
        {/* Preset Prompt Pills */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
            💡 Quick Automation Ideas:
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDescription(preset)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-brand-500/15 border border-slate-700/80 hover:border-brand-500/40 text-slate-300 hover:text-brand-200 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{preset}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Describe the workflow you want to automate:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: I want to automate employee laptop requests."
              className="w-full rounded-2xl glass-input p-4 text-sm placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={generating || !description.trim()}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-glow flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Pipeline with Gemini...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Generate Workflow with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Visual Pipeline Canvas */}
      {currentTemplate ? (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-bold text-white">Visual Pipeline Blueprint</h3>
            </div>

            {/* Saved Templates Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">Active Templates:</span>
              <select
                value={currentTemplate._id || currentTemplate.id}
                onChange={(e) => {
                  const found = savedTemplates.find(t => (t._id || t.id) === e.target.value);
                  if (found) setCurrentTemplate(found);
                }}
                className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {savedTemplates.map(t => (
                  <option key={t._id || t.id} value={t._id || t.id}>
                    {t.name} ({t.isActive ? 'Active' : 'Draft'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render The Visual Pipeline */}
          <VisualPipeline
            template={currentTemplate}
            onActivate={handleActivateToggle}
            isActivating={activating}
          />
        </div>
      ) : (
        <div className="rounded-3xl glass-card p-12 text-center border border-slate-800">
          <BrainCircuit className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Pipeline Generated Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Type a workflow description above or pick a sample idea to see the visual 6-stage pipeline compiled in real-time.
          </p>
        </div>
      )}

    </div>
  );
}
