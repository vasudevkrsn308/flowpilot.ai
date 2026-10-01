import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WorkflowStoreProvider } from './context/WorkflowStoreContext';

import Navbar from './components/Navbar';
import OpeningAnimation from './components/OpeningAnimation';
import ToastContainer from './components/ToastContainer';
import SettingsModal from './components/SettingsModal';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import RequestDetail from './pages/RequestDetail';
import Approvals from './pages/Approvals';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import AuditLogs from './pages/AuditLogs';
import LightingModes from './pages/LightingModes';
import WorkflowGenerator from './pages/WorkflowGenerator';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const [replayIntro, setReplayIntro] = useState(false);
  const { visualTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col text-slate-900 dark:text-slate-100 selection:bg-brand-600 selection:text-white transition-colors relative ${
      visualTheme === 'neumorphism'
        ? 'bg-[#EEF1F7] dark:bg-[#121727]'
        : visualTheme === 'glassmorphism'
        ? 'bg-slate-50/80 dark:bg-[#070b14]'
        : 'bg-slate-50 dark:bg-slate-950'
    }`}>
      {/* Glassmorphism Ambient Light Orbs */}
      {visualTheme === 'glassmorphism' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-indigo-400/15 dark:bg-indigo-600/20 blur-[110px]" />
          <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-purple-400/12 dark:bg-purple-600/18 blur-[120px]" />
          <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full bg-sky-400/12 dark:bg-sky-600/15 blur-[130px]" />
        </div>
      )}

      {/* Brand Opening Loading Animation (Runs on first visit per session or when replayed) */}
      <OpeningAnimation
        forceReplay={replayIntro}
        onComplete={() => setReplayIntro(false)}
      />

      {/* Global Navbar */}
      <Navbar onReplayIntro={() => setReplayIntro(true)} />

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute>
                <NewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <Approvals />
              </ProtectedRoute>
            }
          />
          
          {/* Primary Feature: Orders */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />

          {/* Tasks */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Audit Logs */}
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          {/* Lighting Modes Automation Demo */}
          <Route
            path="/lighting-modes"
            element={
              <ProtectedRoute>
                <LightingModes />
              </ProtectedRoute>
            }
          />

          {/* AI Workflow Generator */}
          <Route
            path="/admin/workflows"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <WorkflowGenerator />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <SettingsModal />

      {/* Footer */}
      <footer className="border-t border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>FlowPilot AI • Intelligent Workflow Automation Engine • Smart Automation Hackathon 2026</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setReplayIntro(true)}
              className="text-brand-600 dark:text-brand-400 hover:underline"
            >
              Replay Brand Intro
            </button>
            <span>•</span>
            <span className="text-slate-400">Gemini 1.5 Cognitive Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <NotificationProvider>
              <WorkflowStoreProvider>
                <AppRoutes />
              </WorkflowStoreProvider>
            </NotificationProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </Router>
  );
}
