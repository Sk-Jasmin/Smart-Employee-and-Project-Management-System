import React from 'react';
import { AuditLogItem } from '../../types';
import { CheckCircle2, UserCheck, FolderPlus, FileText, Clock } from 'lucide-react';

interface TimelineProps {
  logs: AuditLogItem[];
  title?: string;
}

export const TimelineWidget: React.FC<TimelineProps> = ({ logs, title = 'Audit Activity Log' }) => {
  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    if (action.includes('PROJECT')) return <FolderPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    if (action.includes('EMPLOYEE')) return <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-base flex items-center gap-2">
        <Clock className="w-4 h-4 text-emerald-600" />
        <span>{title}</span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {logs.slice(0, 5).map((log) => (
          <div key={log.id} className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs">
              {getActionIcon(log.action)}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                <span className="font-semibold text-blue-700 dark:text-blue-400">{log.action}</span>
                <span className="text-slate-500 dark:text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{log.details}</p>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>By: <span className="font-medium text-slate-700 dark:text-slate-300">@{log.username}</span></span>
                <span>IP: {log.ipAddress}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
