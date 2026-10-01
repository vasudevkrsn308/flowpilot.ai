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
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Natural Language',
      details: def.trigger || 'Employee Requisition submitted via Web or Chat'
    },
    {
      id: 'classification',
      title: '2. AI Classification',
      subtitle: 'Gemini 1.5 Cognitive Engine',
      icon: BrainCircuit,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
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
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: `${def.policyRules?.length || 2} Active Rules`,
      details: def.policyRules?.map(r => `${r.name}: ${r.condition}`).join(' | ') || 'Spend limit matrix & prohibited vendor checks'
    },
    {
      id: 'approval',
      title: '4. Human Authorization',
      subtitle: 'Routing Matrix',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: `${def.approvalSteps?.length || 1} Stage`,
      details: def.approvalSteps?.map(s => `${s.role} (${s.timeoutHours || 24}h SLA)`).join(' → ') || 'Direct Department Manager Approval'
    },
    {
      id: 'tasks',
      title: '5. Automated Tasks',
      subtitle: 'Downstream Integration',
      icon: Cog,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      badge: `${def.downstreamTasks?.length || 2} Tasks`,
      details: def.downstreamTasks?.map(t => t.task).join(' • ') || 'ERP Purchase Order generation & Asset Registration'
    },
    {
      id: 'notifications',
      title: '6. Stakeholder Alerts',
      subtitle: 'Multi-Channel Push',
      icon: BellRing,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Real-time',
      details: def.notifications?.map(n => `${n.channel} (${n.target})`).join(' • ') || 'In-app push notifications & Slack webhooks'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Pipeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
              isActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isActive ? '● Live & Active Pipeline' : '○ Draft Staging'}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              {template.category || 'General Workflow'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">{template.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{template.description}</p>
        </div>

        {onActivate && (
          <button
            onClick={onActivate}
            disabled={isActivating}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 shadow-xs ${
              isActive
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isActivating ? 'Updating...' : isActive ? 'Deactivate Pipeline' : 'Activate Workflow'}</span>
          </button>
        )}
      </div>

      {/* Visual Pipeline Node Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div 
              key={node.id}
              className="relative group p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-card-hover hover:border-brand-300 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${node.color} border shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {node.badge}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{node.subtitle}</p>
                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors mt-0.5">
                    {node.title}
                  </h4>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {node.details}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono font-medium">
                  Stage {index + 1} of 6
                </span>
                {index < 5 && (
                  <span className="flex items-center gap-1 text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    Next <ArrowRight className="w-3.5 h-3.5" />
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
