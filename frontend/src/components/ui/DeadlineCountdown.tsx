import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DeadlineCountdownProps {
  deadline: string; // Format: 'YYYY-MM-DD' or ISO string
  className?: string;
  showIcon?: boolean;
}

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({
  deadline,
  className = '',
  showIcon = true
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isOverdue: boolean;
    diffMs: number;
  }>({ days: 0, hours: 0, minutes: 0, isOverdue: false, diffMs: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = new Date(deadline);
      // Set to end of day if only date is provided
      if (deadline.length <= 10) {
        targetDate.setHours(23, 59, 59, 999);
      }
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        const absDiff = Math.abs(diffMs);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes, isOverdue: true, diffMs });
      } else {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes, isOverdue: false, diffMs });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.isOverdue) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse ${className}`}>
        {showIcon && <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />}
        <span>Overdue by {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}{timeLeft.hours}h</span>
      </span>
    );
  }

  // Urgent: <= 2 days
  if (timeLeft.days <= 2) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ${className}`}>
        {showIcon && <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />}
        <span>Due in {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}{timeLeft.hours}h {timeLeft.minutes}m</span>
      </span>
    );
  }

  // Normal: > 2 days
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-emerald-50 text-emerald-800 dark:bg-slate-900 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 ${className}`}>
      {showIcon && <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
      <span>{timeLeft.days}d {timeLeft.hours}h left</span>
    </span>
  );
};
