import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Badge } from './Badge';

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'project' | 'holiday' | 'leave' | 'meeting';
}

const EVENTS: CalendarEvent[] = [
  { date: '2026-07-22', title: 'Q3 Product Sync Meeting', type: 'meeting' },
  { date: '2026-07-25', title: 'Sarah Jenkins Birthday', type: 'holiday' },
  { date: '2026-07-28', title: 'Dashboard Cards Sprint Deadline', type: 'project' },
  { date: '2026-08-01', title: 'Mobile HR App Kickoff', type: 'project' },
  { date: '2026-08-10', title: 'Alex Morgan Annual Leave', type: 'leave' }
];

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 22)); // July 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    dayCells.push(day);
  }

  const getEventForDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return EVENTS.filter((e) => e.date === dateStr);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 text-base">
          <CalendarIcon className="w-4 h-4 text-blue-700 dark:text-blue-500" />
          <span>{monthNames[month]} {year}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {dayCells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }

          const dayEvents = getEventForDay(day);
          const isToday = day === 22 && month === 6 && year === 2026;

          return (
            <div
              key={day}
              className={`h-9 flex flex-col items-center justify-center rounded border transition-colors relative cursor-pointer font-semibold ${
                isToday
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-600 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span>{day}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.map((ev, i) => (
                    <span
                      key={i}
                      title={ev.title}
                      className={`w-1.5 h-1.5 rounded-full ${
                        ev.type === 'meeting'
                          ? 'bg-blue-500'
                          : ev.type === 'project'
                          ? 'bg-emerald-500'
                          : ev.type === 'holiday'
                          ? 'bg-amber-500'
                          : 'bg-purple-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Upcoming Events</span>
        {EVENTS.slice(0, 3).map((ev, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 text-slate-800 dark:text-slate-200">
            <span className="font-semibold truncate max-w-[200px]">{ev.title}</span>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  ev.type === 'meeting'
                    ? 'blue'
                    : ev.type === 'project'
                    ? 'green'
                    : ev.type === 'holiday'
                    ? 'yellow'
                    : 'purple'
                }
                size="sm"
              >
                {ev.date.split('-').slice(1).join('/')}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
