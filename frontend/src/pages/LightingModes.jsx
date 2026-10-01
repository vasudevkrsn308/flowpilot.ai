import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  PartyPopper, 
  Sliders, 
  Clock, 
  Check, 
  Calendar, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useWorkflowStore } from '../context/WorkflowStoreContext';

const MODES = [
  {
    id: 'relax',
    name: 'Relax Mode',
    title: 'Relax & Unwind',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    brightness: 35,
    temp: '2700K (Warm Amber)',
    desc: 'Warm amber hue with smooth dimming. Best for casual syncs, creative brainstorming, and evening breaks.',
    rule: 'At 9:00 PM, automatically activate Relax mode across all communal meeting hubs.',
    icon: Sun
  },
  {
    id: 'focus',
    name: 'Focus Mode',
    title: 'High-Productivity Focus',
    color: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.4)',
    bgGradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    brightness: 85,
    temp: '5000K (Cool Daylight)',
    desc: 'Bright neutral-white illumination with zero perceptible flicker. Calibrated for deep coding, design sprints, and documentation.',
    rule: 'When presentation mode or deep work sprint begins, activate Focus mode.',
    icon: Zap
  },
  {
    id: 'party',
    name: 'Party Mode',
    title: 'Team Celebration',
    color: '#9333ea',
    glowColor: 'rgba(147, 51, 234, 0.4)',
    bgGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    brightness: 60,
    temp: 'Dynamic Spectrum RGB',
    desc: 'Gentle cyclical accent gradient transitions. Elegant, dignified, and festive for hackathon wrap-ups and company milestone celebrations.',
    rule: 'When an all-hands or milestone event is marked active on company calendar, activate Party mode.',
    icon: PartyPopper
  },
  {
    id: 'night',
    name: 'Night Mode',
    title: 'Ultra-Low Energy Night',
    color: '#475569',
    glowColor: 'rgba(71, 85, 105, 0.3)',
    bgGradient: 'from-slate-700/20 via-indigo-900/10 to-transparent',
    brightness: 12,
    temp: '2200K (Low Amber Pathway)',
    desc: 'Ultra-low standby luminance with automated PIR motion sensor wake. Designed for facilities safety, energy economy, and off-hours surveillance.',
    rule: 'When no room motion is detected after 11:00 PM, activate Night mode.',
    icon: Moon
  }
];

export default function LightingModes() {
  const { showToast, addAuditEvent } = useWorkflowStore();
  const [activeModeId, setActiveModeId] = useState('focus');
  const [brightness, setBrightness] = useState(85);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const activeMode = MODES.find(m => m.id === activeModeId) || MODES[1];

  const handleSelectMode = (mode) => {
    setActiveModeId(mode.id);
    setBrightness(mode.brightness);
    showToast(`Lighting profile changed to ${mode.name}`, 'info');
  };

  const handleActivate = () => {
    addAuditEvent(`Activated Lighting Mode: ${activeMode.name}`, 'FAC-LIGHT-01', activeMode.rule, 'Manager');
    showToast(`${activeMode.name} Active in Facilities`, 'success', `Rule: "${activeMode.rule}" verified.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/90 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Lighting Modes Automation
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            WORKFLOW USE CASE DEMO
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          An example of how FlowPilotAI connects real-world IoT and facilities automation to plain-language policy rules, schedule triggers, and human oversight.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mode Selection Cards (4 Modes) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
            Select Lighting Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {MODES.map(mode => {
              const isSelected = mode.id === activeModeId;
              const Icon = mode.icon;

              return (
                <div
                  key={mode.id}
                  onClick={() => handleSelectMode(mode)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left flex items-start gap-4 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="p-3 rounded-xl shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${mode.color}20`,
                      color: mode.color
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {mode.name}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                      {mode.desc}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span>Brightness: {mode.brightness}%</span>
                      <span>•</span>
                      <span>{mode.temp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Room Preview Panel & Live Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
            {/* Ambient Room Illumination Simulation */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${activeMode.bgGradient} transition-all duration-700 pointer-events-none`}
            />

            {/* Simulated Room Interior Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Simulated Workplace Zone
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Main Engineering Collaborative Studio (Floor 3)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {brightness}% Luminance
                </span>
              </div>
            </div>

            {/* Room Visual Canvas */}
            <div className="relative z-10 my-6 h-56 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-6">
              {/* Ceiling Light Fixtures */}
              <div className="flex justify-around items-center">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-1.5 h-6 bg-slate-700 rounded-t" />
                    <div
                      className="w-12 h-3 rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: activeMode.color,
                        boxShadow: `0 0 ${brightness / 2}px ${brightness / 4}px ${activeMode.glowColor}`
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Studio Silhouette Preview */}
              <div className="text-center">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border border-white/10 transition-colors"
                  style={{ color: activeMode.color }}
                >
                  {activeMode.title}
                </span>
                <p className="text-[11px] text-slate-300 mt-2 max-w-md mx-auto">
                  {activeMode.desc}
                </p>
              </div>

              {/* Floor ambient reflection */}
              <div
                className="h-2 w-full rounded-full transition-all duration-700 opacity-60"
                style={{
                  background: `linear-gradient(to right, transparent, ${activeMode.color}, transparent)`
                }}
              />
            </div>

            {/* Slider & Automation Rules */}
            <div className="relative z-10 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Adjust Intensity</span>
                  <span className="font-mono text-slate-500">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              {/* Automation Rule Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Governing AI Automation Rule</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono leading-relaxed">
                  "{activeMode.rule}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setScheduleModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Profile</span>
                </button>

                <button
                  onClick={handleActivate}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs hover:shadow-glow transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Apply & Deploy Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Automation Execution History */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              Recent Automation Execution Log
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-700 dark:text-slate-300">Relax Mode triggered by time-of-day scheduler</span>
                <span className="text-[10px] text-slate-400 font-mono">Yesterday, 9:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-700 dark:text-slate-300">Night Mode activated (PIR motion sensor idle)</span>
                <span className="text-[10px] text-slate-400 font-mono">Yesterday, 11:15 PM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-700 dark:text-slate-300">Focus Mode engaged via Sprint calendar sync</span>
                <span className="text-[10px] text-slate-400 font-mono">Today, 09:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Schedule {activeMode.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set automated daily activation windows for meeting spaces.
            </p>
            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  defaultValue="21:00"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Target Zone
                </label>
                <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white">
                  <option>All Meeting Rooms (Floor 3)</option>
                  <option>Executive Boardroom</option>
                  <option>Cafeteria & Lounge</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setScheduleModalOpen(false);
                  showToast(`Schedule saved for ${activeMode.name}`, 'success');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
