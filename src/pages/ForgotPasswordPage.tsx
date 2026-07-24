import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, ArrowLeft, Send, Sun, Moon } from 'lucide-react';
import { ToastMessage, ToastNotification } from '../components/ui/ToastNotification';

interface ForgotPasswordPageProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ darkMode, setDarkMode }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [localDarkMode, setLocalDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const isDark = darkMode !== undefined ? darkMode : localDarkMode;

  const handleToggleTheme = (mode: boolean) => {
    if (setDarkMode) {
      setDarkMode(mode);
    } else {
      setLocalDarkMode(mode);
      if (mode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme_mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme_mode', 'light');
      }
    }
  };

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      addToast('error', 'Validation Error', 'Please enter your corporate email address.');
      return;
    }

    setLoading(true);

    try {
      const msg = await authService.forgotPassword(email.trim());
      setSubmitted(true);
      addToast('success', 'Reset Link Dispatched', msg);
    } catch (err: any) {
      addToast('error', 'Request Failed', err.message || 'Unable to process password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors duration-200">
          
          {/* Header Bar with Back Link & 2-Option Theme Switcher */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <Link to="/login" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>

            {/* 2-Option Light & Dark Mode Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleTheme(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Light Mode"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleTheme(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 text-indigo-300 border border-indigo-500/40 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Forgot Password</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">
              Enter your registered corporate email to receive a password recovery link
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300 text-xs rounded-lg text-center mb-4">
              <strong className="block font-bold mb-1">Reset Instructions Dispatched!</strong>
              If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Corporate Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors font-medium"
                    placeholder="e.g. employee@smartcorp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-slate-900 dark:hover:bg-slate-800 dark:border dark:border-indigo-500/60 dark:text-indigo-300 dark:hover:text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Sending Email...</span>
                ) : (
                  <>
                    <span>Send Recovery Instructions</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Need to test password reset UI directly? </span>
            <Link to="/reset-password?token=demo_token_123" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Open Reset Password Screen
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
