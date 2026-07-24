import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../types';
import { authService } from '../services/authService';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sun, Moon, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { ToastMessage, ToastNotification } from '../components/ui/ToastNotification';

interface LoginPageProps {
  onLoginSuccess: (user: any, role: Role) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Handle role selection switch
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setAuthError(null);
  };

  // Local fallback if darkMode props are not passed
  const [localDarkMode, setLocalDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const isDark = darkMode !== undefined ? darkMode : localDarkMode;

  const handleToggleTheme = () => {
    const newMode = !isDark;
    if (setDarkMode) {
      setDarkMode(newMode);
    } else {
      setLocalDarkMode(newMode);
      if (newMode) {
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
    setAuthError(null);

    if (!usernameOrEmail.trim()) {
      addToast('error', 'Validation Error', 'Please enter your username or corporate email.');
      return;
    }

    if (!password) {
      addToast('error', 'Validation Error', 'Please enter your account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
        role: selectedRole
      });

      addToast('success', 'Authentication Successful', `Welcome back as ${selectedRole}!`);
      
      const finalRole: Role = selectedRole || res.user.role || 'ADMIN';
      onLoginSuccess(res.user, finalRole);

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err: any) {
      const errorMsg = err.message || 'The details are invalid. Please try again.';
      setAuthError(errorMsg);
      addToast('error', 'Authentication Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-7 relative transition-colors duration-200">
          
          {/* Theme Toggle in top-right */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Logo & Header */}
          <div className="text-center mb-5 pt-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg mb-2 shadow-md">
              S
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">SmartCorp Enterprise</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Select your role & sign in
            </p>
          </div>

          {/* Role Switcher Option (Admin vs Employee) */}
          <div className="mb-5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('EMPLOYEE')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'EMPLOYEE'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>
          </div>

          {/* Incorrect credentials inline error callout */}
          {authError && (
            <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
            
            {/* Username or Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email or Username
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  autoComplete="off"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors font-medium"
                  placeholder={selectedRole === 'ADMIN' ? 'admin@smartcorp.com' : 'lakshmi.narayanan@smartcorp.in'}
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors font-medium"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>

          <div className="text-center mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Don't have an account? </span>
            <Link to="/register" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Register
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
