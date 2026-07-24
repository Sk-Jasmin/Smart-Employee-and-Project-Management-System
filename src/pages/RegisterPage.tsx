import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { User, Mail, Lock, Phone, Building, UserCheck, Eye, EyeOff, CheckCircle2, ArrowRight, Sun, Moon } from 'lucide-react';
import { ToastMessage, ToastNotification } from '../components/ui/ToastNotification';

interface RegisterPageProps {
  onRegisterSuccess?: (user: any) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'Engineering'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local fallback
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

  const departments = [
    'Engineering',
    'Human Resources',
    'Sales',
    'Marketing',
    'Finance',
    'Operations',
    'Legal',
    'IT Support'
  ];

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const validatePassword = (pass: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(pass);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      addToast('error', 'Validation Error', 'Full Name is required.');
      return;
    }

    if (!formData.username.trim() || formData.username.length < 3) {
      addToast('error', 'Validation Error', 'Username must be at least 3 characters long.');
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      addToast('error', 'Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!formData.phone.trim()) {
      addToast('error', 'Validation Error', 'Phone Number is required.');
      return;
    }

    if (!validatePassword(formData.password)) {
      addToast(
        'error',
        'Password Security Requirements',
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('error', 'Password Mismatch', 'Password and Confirm Password do not match.');
      return;
    }

    if (!formData.department) {
      addToast('error', 'Validation Error', 'Please select a department.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register({
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        department: formData.department,
        role: 'EMPLOYEE'
      });

      addToast('success', 'Registration Successful', 'Your account has been created. Redirecting to dashboard...');

      if (onRegisterSuccess) {
        onRegisterSuccess(res.user);
      }

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      addToast('error', 'Registration Failed', err.message || 'Error creating account. Ensure username and email are unique.');
    } finally {
      setLoading(false);
    }
  };

  const isLengthValid = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/?]/.test(formData.password);

  const strengthScore = [isLengthValid, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!formData.password) return '';
    if (strengthScore <= 2) return 'Weak';
    if (strengthScore <= 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strengthScore <= 2) return { bar: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' };
    if (strengthScore <= 4) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' };
  };

  const strengthColor = getStrengthColor();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors duration-200">
          
          {/* Header Bar with 2 Options (Light / Dark Mode) Theme Switcher */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-slate-950 border dark:border-emerald-500/40 text-white dark:text-emerald-400 flex items-center justify-center font-black text-sm shadow-xs">
                S
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">SmartCorp Portal</span>
            </div>

            {/* 2-Option Light & Dark Mode Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleTheme(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-white text-emerald-700 shadow-xs'
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
                    ? 'bg-slate-900 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Title Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 rounded-xl mb-3 border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Employee Registration</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">
              Join the Smart Employee & Project Management Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    placeholder="e.g. Eleanor Vance"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <UserCheck className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="username"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    placeholder="e.g. eleanor.vance"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Corporate Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    placeholder="e.g. eleanor@smartcorp.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Department Dropdown */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Department <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    name="department"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors font-medium"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter & Requirements */}
              {formData.password && (
                <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Password Security Rating:</span>
                    <span className={`text-xs font-black uppercase tracking-wider ${strengthColor.text}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>

                  {/* Visual Progress Bar (5 segments) */}
                  <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-full rounded-full transition-all duration-300 ${
                          lvl <= strengthScore ? strengthColor.bar : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-2">Required Criteria:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={isLengthValid ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 8+ Characters
                    </div>
                    <div className={hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Uppercase Letter
                    </div>
                    <div className={hasLower ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Lowercase Letter
                    </div>
                    <div className={hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Number (0-9)
                    </div>
                    <div className={hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Special Character (@$!%*?&#)
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-slate-900 dark:hover:bg-slate-800 dark:border dark:border-emerald-500/60 dark:text-emerald-300 dark:hover:text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Already registered with SmartCorp? </span>
            <Link to="/login" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign In to Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
