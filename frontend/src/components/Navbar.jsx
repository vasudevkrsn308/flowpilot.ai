import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Workflow, 
  PlusCircle, 
  LayoutDashboard, 
  CheckSquare, 
  ClipboardList, 
  ShieldAlert, 
  Sparkles, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  ExternalLink,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = async (role) => {
    await switchRole(role);
    setRoleMenuOpen(false);
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  FlowPilot<span className="text-brand-400">AI</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  SMART
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide">Intelligent Workflow Engine</p>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/requests/new"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/requests/new')
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-brand-400" />
                New Request
              </Link>

              {(user.role === 'Manager' || user.role === 'Admin') && (
                <Link
                  to="/approvals"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/approvals')
                      ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                  Approvals
                </Link>
              )}

              <Link
                to="/tasks"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/tasks')
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Tasks
              </Link>

              {(user.role === 'Admin' || user.role === 'Manager') && (
                <Link
                  to="/admin/audit-logs"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/audit-logs')
                      ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Audit Log
                </Link>
              )}

              {user.role === 'Admin' && (
                <Link
                  to="/admin/workflows"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive('/admin/workflows')
                      ? 'bg-gradient-to-r from-brand-600/30 to-purple-600/30 text-brand-200 border border-brand-500/50 shadow-glow'
                      : 'text-brand-300 hover:bg-brand-500/10 border border-brand-500/20'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
                  AI Workflows
                  <span className="text-[9px] bg-brand-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    WOW
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Quick Role Switcher for Hackathon Judges! */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:border-brand-500/50 text-slate-200 transition-all"
                  title="Click to instantly switch demo roles"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-400">Role:</span>
                  <span className="text-brand-300">{user.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl glass-card border border-slate-700/90 shadow-2xl p-1.5 z-50 animate-slide-up">
                    <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      ⚡ 1-Click Role Switcher (Demo)
                    </p>
                    <button
                      onClick={() => handleRoleSwitch('Employee')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user.role === 'Employee' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>👨‍💻 Employee (Alex Morgan)</span>
                      {user.role === 'Employee' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('Manager')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user.role === 'Manager' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>📋 Manager (Sarah Jenkins)</span>
                      {user.role === 'Manager' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('Admin')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user.role === 'Admin' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>⚡ Admin (Devon Vance)</span>
                      {user.role === 'Admin' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-glow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card border border-slate-700/80 shadow-2xl p-4 z-50 animate-slide-up">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-400" />
                        <h4 className="text-sm font-bold text-white">Notifications</h4>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-brand-400 hover:text-brand-300 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <div
                            key={n._id || n.id}
                            onClick={() => {
                              markAsRead(n._id || n.id);
                              if (n.link) navigate(n.link);
                              setNotifOpen(false);
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              n.read
                                ? 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-900'
                                : 'bg-brand-500/10 border-brand-500/30 text-slate-200 hover:bg-brand-500/15'
                            }`}
                          >
                            <p className="font-medium leading-snug">{n.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all text-xs text-slate-200"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl glass-card border border-slate-700/80 shadow-2xl p-2 z-50 animate-slide-up">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                        {user.role} • {user.department}
                      </span>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
