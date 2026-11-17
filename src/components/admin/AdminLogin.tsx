import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2, UserPlus, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { user, isAdmin, isCheckingAuth, signIn, signUp, claimAdminAccess, signOut } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Invalid credentials.');
        }
      } else {
        const res = await signUp(email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create user account.');
        } else {
          setSuccessMessage('Account created! Now grant admin authorization below.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimAdmin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await claimAdminAccess();
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to grant admin privileges.');
      } else {
        setSuccessMessage('Admin privileges granted! Loading dashboard...');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If currently verifying session
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-4 max-w-sm w-full">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-white">Verifying administrator credentials...</p>
          <p className="text-xs text-slate-400">Authenticating with Supabase secure auth</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but not authorized in admin_users
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-4">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-6 max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold uppercase text-white">
              Authorization Required
            </h3>
            <p className="text-amber-300 text-sm font-medium">
              You are signed in, but you are not authorized as an admin.
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Signed in as: <span className="font-mono text-slate-300">{user.email}</span>
            </p>
            <p className="text-slate-500 text-[11px] font-mono">
              User ID: {user.id}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
              {successMessage}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleClaimAdmin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs py-3.5 px-4 rounded-xl shadow-glow-red transition-all cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Authorize as Shop Admin</span>
            </button>

            <button
              onClick={signOut}
              className="w-full text-xs text-slate-400 hover:text-white py-2"
            >
              Sign out and use a different account
            </button>

            <button
              onClick={onBackToSite}
              className="w-full text-xs text-brand-400 hover:underline py-1 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-card rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative z-10 space-y-6">
        {/* Top Back affordance */}
        <button
          onClick={onBackToSite}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto shadow-glow-red">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-extrabold uppercase text-white tracking-wider">
            Auto Service Admin Portal
          </h2>
          <p className="text-slate-400 text-xs">
            Authenticate to manage service bays, appointments, rates & shop schedules
          </p>
        </div>

        {/* Tab switcher: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 text-xs font-semibold uppercase py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 text-xs font-semibold uppercase py-2 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@precisionautorepair.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs py-3.5 px-4 rounded-xl shadow-glow-red transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Admin Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Protected with Supabase Authentication and Row-Level Security checks.
          </p>
        </div>
      </div>
    </div>
  );
};
