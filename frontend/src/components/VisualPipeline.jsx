import React from 'react';
import { 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  UserCheck, 
  Cog, 
  BellRing, 
  ArrowRight, 
  CheckCircle2,
  Sliders,
  ChevronDown
} from 'lucide-react';

export default function VisualPipeline({ template, onActivate, isActivating = false }) {
  if (!template) return null;

  const def = template.definition || {};
  const isActive = template.isActive;

  const nodes = [
    {
      id: 'trigger',
      title: '1. Ingestion Trigger',
      subtitle: 'Plain-Language Entrypoint',
      icon: Zap,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      badge: 'Natural Language',
      details: def.trigger || 'Employee Requisition submitted via Web or Chat'
    },
    {
      id: 'classification',
      title: '2. AI Classification',
      subtitle: 'Gemini 1.5 Cognitive Engine',
      icon: BrainCircuit,
      color: 'from-indigo-500/20 to-indigo-600/5 text-brand-400 border-brand-500/30',
      badge: 'LLM Powered',
      details: def.classificationNode?.features 
        ? def.classificationNode.features.join(' • ') 
        : 'Entity parsing, currency normalization & intent scoring'
    },
    {
      id: 'policy',
      title: '3. Policy Verification',
      subtitle: 'Rules & Governance Engine',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      badge: `${def.policyRules?.length || 2} Active Rules`,
      details: def.policyRules?.map(r => `${r.name}: ${r.condition}`).join(' | ') || 'Spend limit matrix & prohibited vendor checks'
    },
    {
      id: 'approval',
      title: '4. Human Authorization',
      subtitle: 'Routing Matrix',
      icon: UserCheck,
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
      badge: `${def.approvalSteps?.length || 1} Stage`,
      details: def.approvalSteps?.map(s => `${s.role} (${s.timeoutHours || 24}h SLA)`).join(' → ') || 'Direct Department Manager Approval'
    },
    {
      id: 'tasks',
      title: '5. Automated Tasks',
      subtitle: 'Downstream Integration',
      icon: Cog,
      color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/30',
      badge: `${def.downstreamTasks?.length || 2} Tasks`,
      details: def.downstreamTasks?.map(t => t.task).join(' • ') || 'ERP Purchase Order generation & Asset Registration'
    },
    {
      id: 'notifications',
      title: '6. Stakeholder Alerts',
      subtitle: 'Multi-Channel Push',
      icon: BellRing,
      color: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
      badge: 'Real-time',
      details: def.notifications?.map(n => `${n.channel} (${n.target})`).join(' • ') || 'In-app push notifications & Slack webhooks'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Pipeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-brand-500/30 shadow-glow">
        <div>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {isActive ? '● Live & Active' : '○ Draft Staging'}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
              {template.category || 'General Workflow'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">{template.name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{template.description}</p>
        </div>

        {onActivate && (
          <button
            onClick={onActivate}
            disabled={isActivating}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg ${
              isActive
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow border border-brand-400/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isActivating ? 'Updating...' : isActive ? 'Deactivate Pipeline' : 'Activate Workflow'}</span>
          </button>
        )}
      </div>

      {/* Visual Pipeline Node Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div 
              key={node.id}
              className="relative group p-5 rounded-2xl glass-card border transition-all duration-300 hover:border-brand-500/50 hover:-translate-y-1 hover:shadow-glow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${node.color} border shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {node.badge}
                  </span>
                </div>

                <div className="mt-3.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{node.subtitle}</p>
                  <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {node.title}
                  </h4>
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {node.details}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  Stage {index + 1} of 6
                </span>
                {index < 5 && (
                  <span className="flex items-center gap-1 text-brand-400 font-medium">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
