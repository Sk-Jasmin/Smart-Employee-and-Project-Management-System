import React, { useState } from 'react';
import { Role, NotificationItem } from '../types';
import { 
  Bell, 
  Sun, 
  Moon, 
  Download, 
  User as UserIcon, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  Calendar,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: number) => void;
  onDownloadProject: () => void;
  onNavigateToCode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  darkMode,
  setDarkMode,
  notifications,
  markNotificationRead,
  onDownloadProject,
  onNavigateToCode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
          S
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-base md:text-lg leading-tight flex items-center gap-2">
            Smart Enterprise System
            <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Spring Boot 3 + Java 21
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Production Employee & Project Management Suite
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">

        {/* Download Backend ZIP Button */}
        <button
          onClick={onDownloadProject}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-md shadow-emerald-600/20"
          title="Download complete runnable Spring Boot 3 Java backend project"
        >
          <Download className="w-4 h-4" />
          <span>Export Backend ZIP</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Static Compact Role Badge */}
          <div 
            className="hidden lg:flex items-center gap-1 px-2 py-0.5 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-900/60 rounded-md select-none cursor-default pointer-events-none"
            title={`Logged in as ${currentRole}`}
          >
            <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Role: <span className="font-extrabold">{currentRole}</span></span>
          </div>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-6">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer ${
                        n.isRead
                          ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                          : 'bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-200 border border-indigo-100 dark:border-indigo-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs">{n.title}</span>
                        <span className="text-xs text-slate-400">{n.createdAt}</span>
                      </div>
                      <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {currentRole[0]}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                {currentRole === 'ADMIN' ? 'System Administrator' : currentRole === 'MANAGER' ? 'Project Manager' : 'Alex Morgan'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize mt-0.5">
                {currentRole.toLowerCase()}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">System Administrator</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">alex.morgan@smartcorp.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={onNavigateToCode}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  View Java Source Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
