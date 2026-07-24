import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none flex items-center justify-center z-10 w-5 h-5"
              style={{ minWidth: '20px' }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            {...props}
            style={{ 
              paddingLeft: icon ? '3rem' : '0.75rem',
              ...props.style 
            }}
            className={`w-full py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors font-medium ${
              icon ? 'pr-3 pl-12' : 'px-3'
            } ${
              error
                ? 'border-red-500 dark:border-red-500'
                : 'border-slate-300 dark:border-slate-700'
            } ${className}`}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">{helperText}</p>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors font-medium ${
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-slate-300 dark:border-slate-700'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = 'FormSelect';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors font-medium ${
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-slate-300 dark:border-slate-700'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';
