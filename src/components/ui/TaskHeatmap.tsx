import React from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Calendar, CheckSquare } from 'lucide-react';

export const TaskHeatmap: React.FC = () => {
  // Generate 28 days of activity intensity (0 = none, 1 = low, 2 = medium, 3 = high)
  const days = Array.from({ length: 28 }, (_, i) => {
    const intensity = (i * 7 + 3) % 4;
    return {
      day: i + 1,
      intensity,
      count: intensity === 0 ? 0 : intensity * 2 + 1
    };
  });

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 3: return 'bg-emerald-600 dark:bg-emerald-500';
      case 2: return 'bg-emerald-400 dark:bg-emerald-600';
      case 1: return 'bg-emerald-200 dark:bg-emerald-800';
      default: return 'bg-slate-200 dark:bg-slate-800';
    }
  };

  return (
    <Card>
      <CardHeader
        action={
          <Badge variant="green" size="sm">Last 28 Days</Badge>
        }
      >
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <CheckSquare className="w-4 h-4 text-emerald-600" /> Sprint Activity Heatmap
        </span>
      </CardHeader>
      <CardBody className="p-4 space-y-3">
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <div
              key={d.day}
              className={`h-7 rounded flex items-center justify-center text-xs font-bold font-mono transition-transform duration-150 hover:scale-110 cursor-pointer ${getIntensityColor(
                d.intensity
              )} ${d.intensity > 1 ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}
              title={`Day ${d.day}: ${d.count} tasks completed`}
            >
              {d.day}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-200 dark:bg-emerald-800" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-400 dark:bg-emerald-600" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 dark:bg-emerald-500" />
          </div>
          <span>More active</span>
        </div>
      </CardBody>
    </Card>
  );
};
