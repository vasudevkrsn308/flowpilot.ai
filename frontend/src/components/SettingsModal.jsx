import React from 'react';
import { X, Globe, Moon, Sun, Monitor, Bell, Sliders, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n, SUPPORTED_LANGUAGES } from '../context/I18nContext';

export default function SettingsModal() {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    theme,
    setTheme,
    visualTheme,
    setVisualTheme,
    reducedMotion,
    setReducedMotion,
    notificationPrefs,
    setNotificationPrefs
  } = useTheme();

  const { lang, setLang, currency, setCurrency, dateFormat, setDateFormat, t } = useI18n();

  if (!settingsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Platform Preferences & Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize language, localization, display, and workflow rules.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. Language & Localization */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2 font-mono">
              <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Language & Regional Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  System Language
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.native} ({l.name}) {l.dir === 'rtl' ? '• RTL' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Currency Display
                </span>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    localStorage.setItem('flowpilot_currency', e.target.value);
                  }}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Date Format
                </span>
                <select
                  value={dateFormat}
                  onChange={(e) => {
                    setDateFormat(e.target.value);
                    localStorage.setItem('flowpilot_date_format', e.target.value);
                  }}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="DD MMM YYYY">DD MMM YYYY (e.g. 01 Oct 2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/01/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-01)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Time Format
                </span>
                <select
                  defaultValue="12-hour"
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="12-hour">12-hour (e.g. 02:45 PM)</option>
                  <option value="24-hour">24-hour (e.g. 14:45)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Appearance & Visual Themes */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2 font-mono">
              <Sun className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Appearance & Color Mode
            </label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  theme === 'light'
                    ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-xs font-bold block">Light Mode</span>
                  <span className="text-[10px] opacity-75">Clean daylight contrast</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  theme === 'dark'
                    ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-500" />
                <div>
                  <span className="text-xs font-bold block">Dark Mode</span>
                  <span className="text-[10px] opacity-75">Deep slate & navy</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  theme === 'system'
                    ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Monitor className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-xs font-bold block">System Sync</span>
                  <span className="text-[10px] opacity-75">Follow OS preference</span>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Interface Theme Selection (Default, Glassmorphism, Neumorphism) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                Interface Theme
              </label>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                Active: {visualTheme === 'glassmorphism' ? 'Glassmorphism' : visualTheme === 'neumorphism' ? 'Neumorphism' : 'FlowPilot Default'}
              </span>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2"
              role="radiogroup"
              aria-label="Interface theme selector"
            >
              {/* Theme 1: FlowPilot Default */}
              <button
                type="button"
                role="radio"
                aria-checked={visualTheme === 'default'}
                onClick={() => setVisualTheme('default')}
                className={`relative p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  visualTheme === 'default'
                    ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Mini Preview Box */}
                  <div className="h-20 w-full rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 flex flex-col justify-between border border-slate-200 dark:border-slate-700 mb-3 overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-2.5 rounded bg-brand-600"></div>
                      <div className="w-6 h-2 rounded bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
                      <div className="w-14 h-1.5 rounded bg-slate-400 dark:bg-slate-500"></div>
                      <div className="w-4 h-1.5 rounded bg-emerald-500"></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-2 rounded bg-indigo-600"></div>
                      <div className="w-8 h-2 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">FlowPilot Default</span>
                    {visualTheme === 'default' && (
                      <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Clean, high-clarity SaaS interface for everyday work.
                  </p>
                </div>
              </button>

              {/* Theme 2: Glassmorphism */}
              <button
                type="button"
                role="radio"
                aria-checked={visualTheme === 'glassmorphism'}
                onClick={() => setVisualTheme('glassmorphism')}
                className={`relative p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  visualTheme === 'glassmorphism'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Mini Preview Box */}
                  <div className="h-20 w-full rounded-xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-sky-400/20 p-2.5 flex flex-col justify-between border border-white/40 dark:border-white/10 mb-3 overflow-hidden relative backdrop-blur-md">
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-indigo-500/30 blur-md pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-12 h-2.5 rounded bg-brand-600 shadow-glow"></div>
                      <div className="w-6 h-2 rounded bg-white/60 dark:bg-white/30 backdrop-blur-xs"></div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 flex items-center justify-between shadow-2xs backdrop-blur-xs relative z-10">
                      <div className="w-14 h-1.5 rounded bg-slate-700 dark:bg-slate-300"></div>
                      <div className="w-4 h-1.5 rounded bg-emerald-500"></div>
                    </div>
                    <div className="flex items-center gap-1.5 relative z-10">
                      <div className="w-8 h-2 rounded bg-indigo-600 shadow-xs"></div>
                      <div className="w-8 h-2 rounded bg-white/40 dark:bg-white/20"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Glassmorphism</span>
                    {visualTheme === 'glassmorphism' && (
                      <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Frosted, layered surfaces with subtle depth and ambient color.
                  </p>
                </div>
              </button>

              {/* Theme 3: Neumorphism / Soft UI */}
              <button
                type="button"
                role="radio"
                aria-checked={visualTheme === 'neumorphism'}
                onClick={() => setVisualTheme('neumorphism')}
                className={`relative p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  visualTheme === 'neumorphism'
                    ? 'border-indigo-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-indigo-500/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Mini Preview Box */}
                  <div className="h-20 w-full rounded-xl bg-[#EEF1F7] dark:bg-[#121727] p-2.5 flex flex-col justify-between border border-white/70 dark:border-white/5 mb-3 overflow-hidden shadow-[inset_1px_1px_3px_#ffffff,3px_3px_6px_#d1d9e6] dark:shadow-[inset_1px_1px_3px_#1c243c,3px_3px_6px_#070a12]">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-2.5 rounded bg-brand-600"></div>
                      <div className="w-6 h-2 rounded bg-slate-300 dark:bg-slate-700 shadow-[inset_1px_1px_2px_#d1d9e6]"></div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#EEF1F7] dark:bg-[#121727] flex items-center justify-between shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] dark:shadow-[2px_2px_4px_#070a12,-2px_-2px_4px_#1c243c]">
                      <div className="w-14 h-1.5 rounded bg-slate-700 dark:text-slate-300"></div>
                      <div className="w-4 h-1.5 rounded bg-emerald-500"></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-2 rounded bg-indigo-600"></div>
                      <div className="w-8 h-2 rounded bg-[#EEF1F7] dark:bg-[#121727] shadow-[inset_1px_1px_2px_#d1d9e6]"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Neumorphism</span>
                    {visualTheme === 'neumorphism' && (
                      <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Soft, tactile surfaces with gentle raised and pressed controls.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reduced Motion Mode
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Disables decorative line pulses and replaces animations with simple fades.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                reducedMotion ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Toggle reduced motion"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Notification Preferences */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2 font-mono">
              <Bell className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Notification Settings
            </label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'approvals', label: 'Approval Required Alerts', desc: 'Trigger notifications when a request requires your review.' },
                { key: 'orderUpdates', label: 'Order Status Changes', desc: 'Alert when orders are accepted, denied, or completed.' },
                { key: 'inApp', label: 'In-App Toast Banners', desc: 'Show interactive floating feedback alerts.' }
              ].map(item => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs[item.key] ?? true}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        [item.key]: e.target.checked
                      })
                    }
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
