import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs';

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[11px] gap-1 rounded-md text-xs font-medium',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-500/20 shadow-md focus:ring-indigo-500 dark:bg-slate-900 dark:bg-none dark:border dark:border-indigo-500/60 dark:text-indigo-300 dark:hover:bg-slate-800 dark:hover:text-white dark:shadow-none',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 dark:bg-slate-900 dark:border dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-100',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 shadow-md focus:ring-emerald-500 dark:bg-slate-900 dark:bg-none dark:border dark:border-emerald-500/60 dark:text-emerald-300 dark:hover:bg-slate-800 dark:hover:text-white dark:shadow-none',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-500/20 shadow-md focus:ring-rose-500 dark:bg-slate-900 dark:bg-none dark:border dark:border-rose-500/60 dark:text-rose-300 dark:hover:bg-slate-800 dark:hover:text-white dark:shadow-none',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
    ghost: 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
