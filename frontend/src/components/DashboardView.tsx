import React from 'react';
import { Employee, Project, TaskItem, Role, Announcement, AttendanceRecord } from '../types';
import { 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  Cake, 
  Megaphone, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  currentRole: Role;
  employees: Employee[];
  projects: Project[];
  tasks: TaskItem[];
  announcements: Announcement[];
  attendance: AttendanceRecord[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  employees,
  projects,
  tasks,
  announcements,
  attendance,
  onNavigateTab
}) => {
  const totalEmployees = employees.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const pendingTasks = totalTasks - completedTasks;
  const todayPresent = attendance.filter(a => a.status === 'PRESENT').length;

  // Upcoming birthdays in July
  const upcomingBirthdays = employees.filter(e => {
    const dob = new Date(e.dateOfBirth);
    return dob.getMonth() === 6; // July
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white shadow-xl shadow-indigo-600/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Welcome Back, {currentRole === 'ADMIN' ? 'Administrator' : currentRole === 'MANAGER' ? 'Project Manager' : 'Alex Morgan'}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Smart Employee & Project Control Center
          </h2>
          <p className="text-indigo-100/80 text-xs mt-1 max-w-2xl leading-relaxed">
            Real-time management dashboard backed by Spring Boot 3 Java backend REST services with JWT token authorization.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('code')}
          className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
        >
          View Spring Boot Backend
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('employees')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Workforce</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalEmployees}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% Active in System</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('projects')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Projects</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{activeProjects} <span className="text-xs font-normal text-slate-400">/ {totalProjects}</span></div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              {Math.round((activeProjects / (totalProjects || 1)) * 100)}% Execution Rate
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('tasks')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tasks Completed</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{completedTasks} <span className="text-xs font-normal text-slate-400">/ {totalTasks}</span></div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
              {pendingTasks} Tasks Pending Review
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('attendance')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Today's Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{todayPresent} <span className="text-xs font-normal text-slate-400">/ {totalEmployees}</span></div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              98% On-time Arrival Rate
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Projects & Task Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Key Projects Overview</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assigned employees and completion status</p>
              </div>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All Projects &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{proj.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      proj.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      proj.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{proj.description}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Deadline: {proj.deadline}</span>
                      <span>Budget: ${proj.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${proj.status === 'COMPLETED' ? 100 : 65}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks & Progress Tracker */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Task Deliverables</h3>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Task Board &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {tasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      t.status === 'DONE' ? 'bg-emerald-500' : t.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Assigned: {t.assignedEmployeeName || 'Alex Morgan'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{t.progressPercentage}%</div>
                      <div className="text-[10px] text-slate-400">{t.deadline}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Announcements & Birthday Alerts */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Team Announcements</h3>
            </div>
            <div className="mt-3 space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200 block">{a.title}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{a.content}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{a.createdAt} &bull; By {a.createdBy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Birthday Reminders */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Cake className="w-4 h-4 text-pink-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Upcoming Birthdays</h3>
            </div>
            <div className="mt-3 space-y-3">
              {upcomingBirthdays.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30">
                  <img src={b.avatar} alt={b.firstName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{b.firstName} {b.lastName}</h4>
                    <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">{b.department} &bull; DOB: {b.dateOfBirth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
