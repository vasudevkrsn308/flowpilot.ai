import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function OpeningAnimation({ onComplete, forceReplay = false }) {
  const { isDark, reducedMotion } = useTheme();
  const [stage, setStage] = useState(0); // 0: init, 1: connecting nodes, 2: reveal wordmark, 3: pulse, 4: fade out
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // If not force replay, check if already shown in this session
    if (!forceReplay && sessionStorage.getItem('flowpilot_intro_shown')) {
      setVisible(false);
      onComplete?.();
      return;
    }

    if (reducedMotion) {
      // Immediate quick fade for reduced motion
      const t = setTimeout(() => {
        sessionStorage.setItem('flowpilot_intro_shown', 'true');
        setVisible(false);
        onComplete?.();
      }, 400);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setStage(1), 150); // node drawing
    const t2 = setTimeout(() => setStage(2), 650); // wordmark reveal
    const t3 = setTimeout(() => setStage(3), 1100); // AI connection pulse
    const t4 = setTimeout(() => setStage(4), 1650); // fade out
    const t5 = setTimeout(() => {
      sessionStorage.setItem('flowpilot_intro_shown', 'true');
      setVisible(false);
      onComplete?.();
    }, 1950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [forceReplay, reducedMotion, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('flowpilot_intro_shown', 'true');
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${isDark ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-indigo-50/70 via-white to-purple-50/60 text-slate-900'}`}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70"
      >
        Skip intro
      </button>

      {/* Animated FlowPilot SVG Nodes */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        {/* Ambient lavender/purple glow ring */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-600 blur-xl opacity-30 transition-all duration-700 ${
            stage >= 1 ? 'scale-110 opacity-60' : 'scale-90 opacity-20'
          }`}
        />

        <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100" fill="none">
          {/* Connection lines */}
          <path
            d="M25 50 L50 25 L75 50 L50 75 Z"
            stroke="url(#brandGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="200"
            strokeDashoffset={stage >= 1 ? '0' : '200'}
            className="transition-all duration-700 ease-out"
          />

          <path
            d="M50 25 L50 75 M25 50 L75 50"
            stroke="url(#brandGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="100"
            strokeDashoffset={stage >= 2 ? '0' : '100'}
            className="transition-all duration-500 ease-out opacity-75"
          />

          {/* Node 1: Left */}
          <circle
            cx="25"
            cy="50"
            r={stage >= 1 ? '6' : '0'}
            fill="#4f46e5"
            className="transition-all duration-300"
          />
          {/* Node 2: Top */}
          <circle
            cx="50"
            cy="25"
            r={stage >= 1 ? '6' : '0'}
            fill="#6366f1"
            className="transition-all duration-300 delay-100"
          />
          {/* Node 3: Right */}
          <circle
            cx="75"
            cy="50"
            r={stage >= 1 ? '6' : '0'}
            fill="#8b5cf6"
            className="transition-all duration-300 delay-200"
          />
          {/* Node 4: Bottom */}
          <circle
            cx="50"
            cy="75"
            r={stage >= 1 ? '6' : '0'}
            fill="#a855f7"
            className="transition-all duration-300 delay-300"
          />

          {/* Center AI Core Pulse */}
          <circle
            cx="50"
            cy="50"
            r={stage >= 3 ? '8' : stage >= 2 ? '6' : '0'}
            fill="#ffffff"
            stroke="#6366f1"
            strokeWidth="3"
            className="transition-all duration-300"
          />

          {/* Subtle AI connection pulse wave */}
          {stage >= 3 && (
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              className="animate-ping opacity-75 origin-center"
            />
          )}

          <defs>
            <linearGradient id="brandGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4f46e5" />
              <stop offset="0.5" stopColor="#6366f1" />
              <stop offset="1" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Title and Subtitle Reveal */}
      <div
        className={`text-center transition-all duration-500 transform ${
          stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
          FlowPilot<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600">AI</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          Intelligent Workflow Engine
        </p>
      </div>

      {/* Subtext pulse bar */}
      <div className="w-36 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ${
            stage >= 1 ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    </div>
  );
}
