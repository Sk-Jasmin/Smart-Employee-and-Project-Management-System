import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onDismiss,
  className = ''
}) => {
  const alertStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-slate-950 dark:border-emerald-900/60 dark:text-emerald-300',
    error: 'bg-red-50 border-red-300 text-red-900 dark:bg-slate-950 dark:border-rose-900/60 dark:text-rose-300',
    warning: 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-slate-950 dark:border-amber-900/60 dark:text-amber-300',
    info: 'bg-blue-50 border-blue-300 text-blue-900 dark:bg-slate-950 dark:border-sky-900/60 dark:text-sky-300'
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    error: <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
  };

  return (
    <div
      className={`p-3.5 border rounded-md transition-all duration-150 flex items-start justify-between gap-3 text-xs shadow-2xs ${alertStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        {icons[type]}
        <div>
          {title && <h5 className="font-bold text-xs leading-tight mb-0.5">{title}</h5>}
          <p className="leading-relaxed opacity-95">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-current transition-colors cursor-pointer shrink-0"
          title="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
