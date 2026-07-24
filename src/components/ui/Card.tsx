import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-xs dark:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}> = ({ children, className = '', action }) => {
  return (
    <div className={`px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center ${action ? 'justify-between' : 'justify-center'} bg-slate-100/80 dark:bg-slate-900/95 ${className}`}>
      <div className={`font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight ${action ? '' : 'w-full'}`}>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = 'p-5' }) => {
  return <div className={`text-slate-800 dark:text-slate-200 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`px-5 py-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 ${className}`}>
      {children}
    </div>
  );
};
