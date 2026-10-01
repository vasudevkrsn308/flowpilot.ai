import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Workflow, 
  PlusCircle, 
  LayoutDashboard, 
  CheckSquare, 
  ShoppingBag, 
  BarChart3, 
  Users, 
  ClipboardList, 
  ShieldAlert, 
  Sparkles, 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  Sliders, 
  LogOut, 
  ChevronDown, 
  Check, 
  Menu, 
  X,
  Search,
  Zap,
  Play,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useWorkflowStore } from '../context/WorkflowStoreContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n, SUPPORTED_LANGUAGES } from '../context/I18nContext';

export default function Navbar({ onReplayIntro }) {
  const { user, logout, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { orderCounts } = useWorkflowStore();
  const { isDark, toggleTheme, theme, setTheme, visualTheme, setVisualTheme, VISUAL_THEMES, setSettingsModalOpen } = useTheme();
  const { lang, setLang, t, isRTL } = useI18n();

  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown states
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const roleRef = useRef(null);
  const themeRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) setLangMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (roleRef.current && !roleRef.current.contains(event.target)) setRoleMenuOpen(false);
      if (themeRef.current && !themeRef.current.contains(event.target)) setThemeMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = async (role) => {
    await switchRole(role);
    setRoleMenuOpen(false);
    navigate('/dashboard');
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.native.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-brand-600 dark:text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-sans">
                  FlowPilot<span className="text-brand-600 dark:text-brand-400">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  SMART
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wide font-medium">
                Intelligent Workflow Engine
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {t('nav_dashboard', 'Dashboard')}
            </Link>

            <Link
              to="/requests/new"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/requests/new')
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-brand-600" />
              {t('nav_new_request', 'New Request')}
            </Link>

            <Link
              to="/approvals"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/approvals')
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
              {t('nav_approvals', 'Approvals')}
            </Link>

            {/* Orders - Highlighted as Primary Feature */}
            <Link
              to="/orders"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/orders')
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('nav_orders', 'Orders')}</span>
              {orderCounts?.pending > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </Link>

            <Link
              to="/analytics"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/analytics')
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              {t('nav_analytics', 'Analytics')}
            </Link>

            <Link
              to="/employees"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/employees')
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {t('nav_employees', 'Employees')}
            </Link>

            <Link
              to="/tasks"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/tasks')
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              {t('nav_tasks', 'Tasks')}
            </Link>

            <Link
              to="/admin/audit-logs"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/admin/audit-logs')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              {t('nav_audit_log', 'Audit Log')}
            </Link>

            <Link
              to="/lighting-modes"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/lighting-modes')
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Example Lighting Modes automation use case"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">{t('nav_lighting_modes', 'Lighting Modes')}</span>
            </Link>
          </nav>
        </div>

        {/* Right-Side Header Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* 1. Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Select language"
              title="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="hidden sm:inline font-mono">{currentLangObj.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-slide-up">
                <div className="relative mb-2">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    className="w-full text-[11px] pl-7 pr-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {filteredLanguages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        lang === l.code
                          ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{l.native} ({l.name})</span>
                      {lang === l.code && <Check className="w-3.5 h-3.5 text-brand-600 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Theme Controls: Light/Dark Toggle + Quick Appearance Menu */}
          <div className="flex items-center gap-1 sm:gap-1.5" ref={themeRef}>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Toggle light or dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Quick Appearance Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1 ${
                  themeMenuOpen || visualTheme !== 'default'
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/20 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
                aria-label="Quick appearance & visual theme menu"
                title={`Visual Theme: ${visualTheme === 'glassmorphism' ? 'Glassmorphism' : visualTheme === 'neumorphism' ? 'Neumorphism' : 'Default'}`}
              >
                <Palette className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="hidden xl:inline text-[10px] font-mono font-bold capitalize">
                  {visualTheme === 'glassmorphism' ? 'Glass' : visualTheme === 'neumorphism' ? 'Soft UI' : 'Default'}
                </span>
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-brand-600" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Quick Appearance</h4>
                    </div>
                    <button
                      onClick={() => {
                        setThemeMenuOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                    >
                      More settings →
                    </button>
                  </div>

                  {/* 3 Visual Themes Switcher */}
                  <div className="mt-2.5 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block px-1">
                      Interface Theme
                    </span>

                    {VISUAL_THEMES.map(vt => {
                      const isSelected = visualTheme === vt.id;
                      return (
                        <button
                          key={vt.id}
                          onClick={() => {
                            setVisualTheme(vt.id);
                            setThemeMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent'
                          }`}
                        >
                          <div>
                            <span className="block font-bold">{vt.name}</span>
                            <span className="text-[10px] opacity-75 font-normal block leading-tight">{vt.desc}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-brand-600 stroke-[3] shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Color Mode Quick Row */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block px-1 mb-1.5">
                      Color Mode
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => setTheme('light')}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          theme === 'light'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 font-bold border border-amber-200'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <Sun className="w-3 h-3 text-amber-500" />
                        <span>Light</span>
                      </button>

                      <button
                        onClick={() => setTheme('dark')}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          theme === 'dark'
                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 font-bold border border-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <Moon className="w-3 h-3 text-indigo-500" />
                        <span>Dark</span>
                      </button>

                      <button
                        onClick={() => setTheme('system')}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          theme === 'system'
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <span>System</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Role Selector (1-Click Demo Switcher) */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all shadow-2xs"
              title="1-Click Role Switcher"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400 font-normal">Role:</span>
              <span className="text-brand-700 dark:text-brand-300 font-bold">{user?.role || 'Manager'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-slide-up">
                <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  ⚡ 1-Click Role Switcher
                </p>
                <button
                  onClick={() => handleRoleSwitch('Employee')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    user?.role === 'Employee'
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="block font-bold">👨‍💻 Employee</span>
                    <span className="text-[10px] text-slate-400">Alex Johnson (IT)</span>
                  </div>
                  {user?.role === 'Employee' && <Check className="w-3.5 h-3.5 text-brand-600 stroke-[3]" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('Manager')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    user?.role === 'Manager'
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="block font-bold">📋 Manager</span>
                    <span className="text-[10px] text-slate-400">Sarah Mitchell (Operations)</span>
                  </div>
                  {user?.role === 'Manager' && <Check className="w-3.5 h-3.5 text-brand-600 stroke-[3]" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('Admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    user?.role === 'Admin'
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="block font-bold">⚡ Admin</span>
                    <span className="text-[10px] text-slate-400">Devon Carter (Platform)</span>
                  </div>
                  {user?.role === 'Admin' && <Check className="w-3.5 h-3.5 text-brand-600 stroke-[3]" />}
                </button>
              </div>
            )}
          </div>

          {/* 4. Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-2xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-slide-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-600" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n._id || n.id}
                        onClick={() => {
                          markAsRead(n._id || n.id);
                          if (n.link) navigate(n.link);
                          setNotifOpen(false);
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500'
                            : 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-100 dark:border-brand-900/60 text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        <p className="leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 5. User Avatar & Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px] shadow-2xs">
                {user ? user.name.charAt(0) : 'S'}
              </div>
              <span className="hidden sm:inline font-semibold text-slate-900 dark:text-white text-xs">
                {user ? user.name.split(' ')[0] : 'Sarah'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-slide-up">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Sarah Mitchell'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'manager@flowpilot.ai'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900">
                    {user?.role || 'Manager'} • {user?.department || 'Operations'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSettingsModalOpen(true);
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  {t('nav_settings', 'Settings & Preferences')}
                </button>

                {/* Interface Theme Picker inside User Profile Dropdown */}
                <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                      <Palette className="w-3 h-3 text-brand-600" />
                      Interface Theme
                    </span>
                  </div>
                  <div className="space-y-1">
                    {VISUAL_THEMES.map(vt => (
                      <button
                        key={vt.id}
                        onClick={() => {
                          setVisualTheme(vt.id);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          visualTheme === vt.id
                            ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{vt.name}</span>
                        {visualTheme === vt.id && <Check className="w-3.5 h-3.5 text-brand-600 stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {onReplayIntro && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onReplayIntro();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-brand-600" />
                    {t('nav_replay_intro', 'Replay Intro Animation')}
                  </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('nav_sign_out', 'Sign Out')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-4 animate-slide-up">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-600" />
              <span>{t('nav_dashboard', 'Dashboard')}</span>
            </Link>

            <Link
              to="/requests/new"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <PlusCircle className="w-4 h-4 text-brand-600" />
              <span>{t('nav_new_request', 'New Request')}</span>
            </Link>

            <Link
              to="/approvals"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <span>{t('nav_approvals', 'Approvals')}</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center justify-between p-3 rounded-2xl text-sm font-bold bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>{t('nav_orders', 'Orders (Primary)')}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white font-mono font-bold">
                {orderCounts?.pending} PENDING
              </span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>{t('nav_analytics', 'Analytics')}</span>
            </Link>

            <Link
              to="/employees"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>{t('nav_employees', 'Employees')}</span>
            </Link>

            <Link
              to="/tasks"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ClipboardList className="w-4 h-4 text-slate-600" />
              <span>{t('nav_tasks', 'Tasks')}</span>
            </Link>

            <Link
              to="/admin/audit-logs"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>{t('nav_audit_log', 'Audit Log')}</span>
            </Link>

            <Link
              to="/lighting-modes"
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Lighting Modes Automation</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* Mobile Visual Theme Switcher */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Interface Theme
              </span>
              <div className="grid grid-cols-3 gap-2">
                {VISUAL_THEMES.map(vt => (
                  <button
                    key={vt.id}
                    onClick={() => setVisualTheme(vt.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      visualTheme === vt.id
                        ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {vt.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Current Role</span>
              <span className="text-xs font-bold text-brand-600">{user?.role || 'Manager'}</span>
            </div>

            <button
              onClick={() => {
                setSettingsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Preferences & Language</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
