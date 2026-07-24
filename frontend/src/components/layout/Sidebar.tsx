import React from 'react';
import { NavLink } from 'react-router-dom';
import { Role } from '../../types';
import { 
  LayoutGrid, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  BarChart2, 
  Bell, 
  User, 
  Settings, 
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentRole?: Role;
  pendingLeaveCount?: number;
  unreadNotificationCount?: number;
}

/**
 * Dedicated Navigation Bar for Employee Role
 * Only displays allotted employee features: Dashboard, Projects, Tasks, Notifications, Profile.
 * Developer Tools section is completely removed.
 */
export const EmployeeSidebar: React.FC<{ unreadNotificationCount?: number }> = ({ unreadNotificationCount = 2 }) => {
  const employeeNavItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
    { path: '/projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart2 className="w-4 h-4" /> },
    { 
      path: '/notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeColor: 'bg-indigo-500 text-white font-extrabold dark:bg-slate-900 dark:text-sky-300 dark:border dark:border-sky-800'
    },
    { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="px-4 py-3.5 uppercase text-[10px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
        <span>Employee Workspace</span>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {employeeNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold border-l-4 border-indigo-400 dark:bg-slate-900 dark:text-indigo-400 dark:border-l-4 dark:border-indigo-400 dark:shadow-none'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full shadow-xs ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs">
        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Employee Portal
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold">v2.4.0</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
          SmartCorp Enterprise Engine &copy; 2026.
        </p>
      </div>
    </aside>
  );
};

/**
 * Dedicated Navigation Bar for Admin & Management Roles
 * Displays management features and only Swagger Specs under Developer Tools.
 */
export const AdminSidebar: React.FC<{ pendingLeaveCount?: number; unreadNotificationCount?: number }> = ({
  pendingLeaveCount = 1,
  unreadNotificationCount = 2
}) => {
  const adminNavItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
    { path: '/employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { path: '/projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { 
      path: '/attendance', 
      label: 'Attendance', 
      icon: <Calendar className="w-4 h-4" />,
      badge: pendingLeaveCount > 0 ? pendingLeaveCount : undefined,
      badgeColor: 'bg-emerald-500 text-slate-950 font-extrabold dark:bg-slate-900 dark:text-emerald-300 dark:border dark:border-emerald-800'
    },
    { path: '/reports', label: 'Audit Logs', icon: <BarChart2 className="w-4 h-4" /> },
    { 
      path: '/notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeColor: 'bg-indigo-500 text-white font-extrabold dark:bg-slate-900 dark:text-sky-300 dark:border dark:border-sky-800'
    },
    { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const adminSystemItems = [
    { path: '/swagger', label: 'Swagger Specs', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="px-4 py-3.5 uppercase text-[10px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
        <span>Admin Navigation</span>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold border-l-4 border-indigo-400 dark:bg-slate-900 dark:text-indigo-400 dark:border-l-4 dark:border-indigo-400 dark:shadow-none'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full shadow-xs ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-5 pb-2 px-3.5 uppercase text-[10px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Developer Tools</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>

        {adminSystemItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-100 text-indigo-800 border-l-2 border-indigo-600 font-bold dark:bg-slate-900 dark:text-indigo-300 dark:border-l-2 dark:border-indigo-400'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
              }`
            }
          >
            <span className="text-slate-500 dark:text-slate-400">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs">
        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Admin Console
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold">v2.4.0</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
          SmartCorp Enterprise Engine &copy; 2026.
        </p>
      </div>
    </aside>
  );
};

/**
 * Main Sidebar Router Component
 * Renders the separate EmployeeSidebar or AdminSidebar depending on currentRole
 */
export const Sidebar: React.FC<SidebarProps> = ({
  currentRole = 'ADMIN',
  pendingLeaveCount = 1,
  unreadNotificationCount = 2
}) => {
  if (currentRole === 'EMPLOYEE') {
    return <EmployeeSidebar unreadNotificationCount={unreadNotificationCount} />;
  }

  return (
    <AdminSidebar
      pendingLeaveCount={pendingLeaveCount}
      unreadNotificationCount={unreadNotificationCount}
    />
  );
};
