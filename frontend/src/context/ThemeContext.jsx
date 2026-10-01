import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const VISUAL_THEMES = [
  {
    id: 'default',
    name: 'FlowPilot Default',
    desc: 'Clean, high-clarity SaaS interface for everyday work.',
    badge: 'Enterprise SaaS'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    desc: 'Frosted, layered surfaces with subtle depth and ambient color.',
    badge: 'Modern Glass'
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    desc: 'Soft, tactile surfaces with gentle raised and pressed controls.',
    badge: 'Soft UI'
  }
];

export function ThemeProvider({ children }) {
  // Color mode: 'light' | 'dark' | 'system'
  const [theme, setThemeState] = useState(() => localStorage.getItem('flowpilot_theme') || 'light');
  
  // Interface visual theme: 'default' | 'glassmorphism' | 'neumorphism'
  const [visualTheme, setVisualThemeState] = useState(() => localStorage.getItem('flowpilot_visual_theme') || 'default');

  const [reducedMotion, setReducedMotionState] = useState(() => localStorage.getItem('flowpilot_reduced_motion') === 'true');
  const [reducedTransparency, setReducedTransparency] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    }
    return false;
  });

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [notificationPrefs, setNotificationPrefsState] = useState(() => {
    try {
      const saved = localStorage.getItem('flowpilot_notif_prefs');
      return saved ? JSON.parse(saved) : { inApp: true, email: true, approvals: true, orderUpdates: true };
    } catch {
      return { inApp: true, email: true, approvals: true, orderUpdates: true };
    }
  });

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Sync color mode (light / dark)
  useEffect(() => {
    localStorage.setItem('flowpilot_theme', theme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isDark]);

  // Sync visual interface theme (default / glassmorphism / neumorphism)
  useEffect(() => {
    localStorage.setItem('flowpilot_visual_theme', visualTheme);
    document.documentElement.setAttribute('data-visual-theme', visualTheme);
    
    // Manage theme class names
    document.documentElement.classList.remove('theme-default', 'theme-glassmorphism', 'theme-neumorphism');
    document.documentElement.classList.add(`theme-${visualTheme}`);

    // If animations are allowed, apply temporary smooth transition class
    if (!reducedMotion && typeof document !== 'undefined') {
      document.body.classList.add('theme-switching');
      const timer = setTimeout(() => {
        document.body.classList.remove('theme-switching');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visualTheme, reducedMotion]);

  // Sync reduced motion
  useEffect(() => {
    localStorage.setItem('flowpilot_reduced_motion', String(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Listen for OS reduced transparency change
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const handler = (e) => setReducedTransparency(e.matches);
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode) => {
    setThemeState(mode);
  };

  const setVisualTheme = (vTheme) => {
    if (['default', 'glassmorphism', 'neumorphism'].includes(vTheme)) {
      setVisualThemeState(vTheme);
    }
  };

  const setReducedMotion = (val) => {
    setReducedMotionState(val);
  };

  const setNotificationPrefs = (newPrefs) => {
    setNotificationPrefsState(newPrefs);
    localStorage.setItem('flowpilot_notif_prefs', JSON.stringify(newPrefs));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
        visualTheme,
        setVisualTheme,
        VISUAL_THEMES,
        reducedMotion,
        setReducedMotion,
        reducedTransparency,
        settingsModalOpen,
        setSettingsModalOpen,
        notificationPrefs,
        setNotificationPrefs
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
