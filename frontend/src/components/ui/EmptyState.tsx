import React from 'react';
import { FolderOpen, SearchX, Inbox, FilterX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'folder' | 'search' | 'inbox' | 'filter';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  icon = 'search',
  className = ''
}) => {
  const iconComponents = {
    folder: <FolderOpen className="w-8 h-8 text-slate-400 dark:text-slate-500 stroke-[1.5]" />,
    search: <SearchX className="w-8 h-8 text-slate-400 dark:text-slate-500 stroke-[1.5]" />,
    inbox: <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500 stroke-[1.5]" />,
    filter: <FilterX className="w-8 h-8 text-slate-400 dark:text-slate-500 stroke-[1.5]" />
  };

  return (
    <div className={`py-12 px-4 flex flex-col items-center justify-center text-center bg-[#f8f9fa]/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-3">
        {iconComponents[icon]}
      </div>
      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200" style={{ fontSize: '12px', lineHeight: '16px' }}>{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
