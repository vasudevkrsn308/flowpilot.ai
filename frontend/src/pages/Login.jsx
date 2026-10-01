import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Workflow, Lock, Mail, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const { showToast } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'WARNING');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to FlowPilot AI!', 'SUCCESS');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    try {
      await demoLogin(role);
      showToast(`Logged in successfully as ${role}!`, 'SUCCESS');
      navigate('/dashboard');
    } catch (err) {
      showToast('Demo login failed', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 shadow-glow mb-4">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to FlowPilot AI
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Intelligent Enterprise Requisition & Workflow Orchestration
          </p>
        </div>

        {/* 1-Click Demo Profiles for Judges */}
        <div className="p-4 rounded-2xl glass-card border border-brand-500/30 shadow-glow space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-brand-300 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            1-Click Hackathon Evaluator Login:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('Employee')}
              className="py-2 px-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-slate-200 transition-all text-center"
            >
              👨‍💻 Employee
            </button>
            <button
              type="button"
              onClick={() => handleDemo('Manager')}
              className="py-2 px-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-slate-200 transition-all text-center"
            >
              📋 Manager
            </button>
            <button
              type="button"
              onClick={() => handleDemo('Admin')}
              className="py-2 px-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-slate-200 transition-all text-center"
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        {/* Traditional Form Card */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@flowpilot.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow flex items-center justify-center gap-1.5 transition-all hover:scale-102 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
