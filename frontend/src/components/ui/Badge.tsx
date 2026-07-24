import React from 'react';

export type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'indigo' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs font-bold'
  };

  const variantStyles = {
    blue: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-slate-950 dark:text-sky-300 dark:border-sky-900/60',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-slate-950 dark:text-emerald-300 dark:border-emerald-900/60',
    yellow: 'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-slate-950 dark:text-amber-300 dark:border-amber-900/60',
    red: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-slate-950 dark:text-rose-300 dark:border-rose-900/60',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800',
    indigo: 'bg-violet-50 text-violet-700 border border-violet-200/80 dark:bg-slate-950 dark:text-indigo-300 dark:border-indigo-900/60',
    purple: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200/80 dark:bg-slate-950 dark:text-purple-300 dark:border-purple-900/60'
  };

  const dotColor = {
    blue: 'bg-indigo-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-rose-500',
    gray: 'bg-slate-400',
    indigo: 'bg-violet-500',
    purple: 'bg-fuchsia-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} />}
      {children}
    </span>
  );
};
