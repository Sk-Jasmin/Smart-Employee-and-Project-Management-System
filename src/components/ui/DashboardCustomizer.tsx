import React from 'react';
import { Button } from './Button';
import { SlidersHorizontal, Check, Eye } from 'lucide-react';

export interface WidgetVisibility {
  kpiCards: boolean;
  announcements: boolean;
  productivity: boolean;
  heatmap: boolean;
  birthdays: boolean;
  news: boolean;
  charts: boolean;
  timeline: boolean;
}

interface DashboardCustomizerProps {
  visibility: WidgetVisibility;
  onChange: (newVis: WidgetVisibility) => void;
}

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  visibility,
  onChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleWidget = (key: keyof WidgetVisibility) => {
    onChange({
      ...visibility,
      [key]: !visibility[key]
    });
  };

  const widgetLabels: { key: keyof WidgetVisibility; label: string }[] = [
    { key: 'kpiCards', label: 'KPI Statistics Cards' },
    { key: 'announcements', label: 'Announcements Banner' },
    { key: 'productivity', label: 'Productivity Index Meter' },
    { key: 'heatmap', label: 'Sprint Activity Heatmap' },
    { key: 'birthdays', label: 'Staff Birthdays Widget' },
    { key: 'news', label: 'Company News Feed' },
    { key: 'charts', label: 'Analytics Charts' },
    { key: 'timeline', label: 'Project Milestones Timeline' }
  ];

  return (
    <div className="relative inline-block text-left">
      <Button
        variant="outline"
        size="sm"
        icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs"
      >
        Customize Dashboard
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-3 z-50 text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" /> Visible Dashboard Cards
            </span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {widgetLabels.map((w) => (
              <label
                key={w.key}
                className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer transition-colors"
              >
                <span className="text-slate-700 dark:text-slate-300">{w.label}</span>
                <input
                  type="checkbox"
                  checked={visibility[w.key]}
                  onChange={() => toggleWidget(w.key)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
