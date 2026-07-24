import React from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Zap, CheckCircle2, Clock, Activity, TrendingUp } from 'lucide-react';

interface ProductivityMeterProps {
  completedTasksCount?: number;
  totalTasksCount?: number;
  workHours?: number;
}

export const ProductivityMeter: React.FC<ProductivityMeterProps> = ({
  completedTasksCount = 14,
  totalTasksCount = 18,
  workHours = 7.5
}) => {
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 85;
  const score = Math.min(100, Math.round(completionRate * 0.7 + (workHours / 8) * 30));

  return (
    <Card className="hover:border-blue-400 dark:hover:border-blue-800 transition-colors duration-150">
      <CardHeader
        action={
          <Badge variant="green" size="sm" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> High Velocity
          </Badge>
        }
      >
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <Zap className="w-4 h-4 text-amber-500" /> Productivity Index
        </span>
      </CardHeader>
      <CardBody className="p-4 space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">{score}</span>
              <span className="text-xs text-slate-500 font-bold">/ 100</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              +4.2% higher than department average
            </p>
          </div>

          {/* Radial meter progress representation */}
          <div className="w-14 h-14 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute" />
          </div>
        </div>

        {/* Sub-metrics breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/80 dark:border-slate-800 pt-3">
          <div className="bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded">
            <span className="text-xs text-slate-400 uppercase font-bold block">Sprint Output</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {completedTasksCount} / {totalTasksCount} Tasks
            </span>
          </div>

          <div className="bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded">
            <span className="text-xs text-slate-400 uppercase font-bold block">Logged Hours</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> {workHours} Shift Hrs
            </span>
          </div>
        </div>

      </CardBody>
    </Card>
  );
};
