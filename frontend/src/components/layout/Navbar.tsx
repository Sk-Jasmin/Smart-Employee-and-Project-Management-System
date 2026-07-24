import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role, NotificationItem, TaskItem } from '../../types';
import { INITIAL_TASKS } from '../../data/mockData';
import { KeyboardShortcutsModal } from '../ui/KeyboardShortcutsModal';
import { 
  Bell, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Shield, 
  Settings, 
  Search,
  Code,
  FileText,
  Check,
  Bookmark,
  Keyboard,
  Clock,
  X,
  CheckSquare,
  ListTodo,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: number) => void;
  onLogout: () => void;
  tasks?: TaskItem[];
  setTasks?: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  darkMode,
  setDarkMode,
  notifications,
  markNotificationRead,
  onLogout,
  tasks: propTasks,
  setTasks
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'IN_PROGRESS' | 'TODO'>('ALL');

  // Fallback to initial tasks if propTasks is not passed
  const activeTasksList = propTasks || INITIAL_TASKS;

  // Recent Searches state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Engineering Java Developers',
    'Enterprise Cloud Integration',
    'Annual Vacation Leave Policy'
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }
    setShowSearchDropdown(false);
    navigate('/employees');
  };

  const removeSearchTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(s => s !== tag));
  };

  return (
    <>
      <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white sticky top-0 z-40 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-lg flex items-center justify-center font-black text-white text-xl tracking-wider shadow-md shadow-indigo-500/20 border border-indigo-400/40 group-hover:scale-105 transition-transform duration-200">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-none tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SmartCorp <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] uppercase font-black px-1.5 py-0.5 rounded shadow-xs">Enterprise</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight font-medium">
                Employee & Project Hub
              </span>
            </div>
          </Link>

          {/* Global Search Bar with Recent Searches */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-400 w-4 h-4" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search staff, projects, tasks... (Press Ctrl+K)"
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/90 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 font-medium"
              />
            </form>

            {/* Recent Searches Dropdown */}
            {showSearchDropdown && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Recent Searches</span>
                  <button onClick={() => setRecentSearches([])} className="hover:underline text-indigo-600 dark:text-indigo-400 font-semibold">Clear</button>
                </div>
                <div className="mt-1.5 space-y-1">
                  {recentSearches.map((tag, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchQuery(tag);
                        navigate('/employees');
                      }}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <span className="truncate">{tag}</span>
                      <X className="w-3 h-3 text-slate-400 hover:text-rose-500" onClick={(e) => removeSearchTag(tag, e)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Bookmarks Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Bookmarked Shortcuts"
              >
                <Bookmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>

              {showBookmarks && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Pinned Shortcuts
                  </div>
                  {currentRole === 'EMPLOYEE' ? (
                    <>
                      <Link to="/projects" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>Projects Portfolio</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">/projects</span>
                      </Link>
                      <Link to="/tasks" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>My Tasks Board</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">/tasks</span>
                      </Link>
                      <Link to="/reports" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>Reports</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">/reports</span>
                      </Link>
                      <Link to="/profile" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>My Profile</span>
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono">/profile</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/employees" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>Staff Directory</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">/employees</span>
                      </Link>
                      <Link to="/projects" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>Active Projects</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">/projects</span>
                      </Link>
                      <Link to="/attendance" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>Attendance</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">/attendance</span>
                      </Link>
                      <Link to="/swagger" onClick={() => setShowBookmarks(false)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium">
                        <span>Swagger Specs</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">/swagger</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Tasks Bar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTasksDropdown(!showTasksDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Tasks Bar - View & Manage Tasks"
              >
                <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-extrabold hidden lg:inline-block">Tasks Bar</span>
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-indigo-600 text-white rounded-full">
                  {activeTasksList.filter(t => t.status !== 'DONE').length}
                </span>
              </button>

              {showTasksDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 px-3 z-50 transition-all">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">Tasks Bar To-Do</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                        {activeTasksList.filter(t => t.status !== 'DONE').length} Active
                      </span>
                    </div>
                    <Link
                      to="/tasks"
                      onClick={() => setShowTasksDropdown(false)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      View All <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 mb-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-[11px]">
                    <button
                      onClick={() => setTaskFilter('ALL')}
                      className={`flex-1 py-1 rounded-md font-bold transition-all ${taskFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      All ({activeTasksList.length})
                    </button>
                    <button
                      onClick={() => setTaskFilter('IN_PROGRESS')}
                      className={`flex-1 py-1 rounded-md font-bold transition-all ${taskFilter === 'IN_PROGRESS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      In Progress ({activeTasksList.filter(t => t.status === 'IN_PROGRESS').length})
                    </button>
                    <button
                      onClick={() => setTaskFilter('TODO')}
                      className={`flex-1 py-1 rounded-md font-bold transition-all ${taskFilter === 'TODO' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      To Do ({activeTasksList.filter(t => t.status === 'TODO' || t.status === 'REVIEW').length})
                    </button>
                  </div>

                  {/* Tasks List */}
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {activeTasksList
                      .filter(t => {
                        if (taskFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
                        if (taskFilter === 'TODO') return t.status === 'TODO' || t.status === 'REVIEW';
                        return true;
                      })
                      .slice(0, 6)
                      .map((task) => {
                        const isUrgent = task.priority === 'URGENT';
                        const isHigh = task.priority === 'HIGH';
                        const isDone = task.status === 'DONE';

                        return (
                          <div
                            key={task.id}
                            className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-xs group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                  {task.title}
                                </span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                  {task.description}
                                </p>
                              </div>

                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                                isUrgent ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                                isHigh ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                                'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Progress bar & status */}
                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-2 flex-1 mr-3">
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      isDone ? 'bg-emerald-500' : isUrgent ? 'bg-rose-500' : 'bg-indigo-600'
                                    }`}
                                    style={{ width: `${task.progressPercentage}%` }}
                                  />
                                </div>
                                <span className="font-semibold text-[10px]">{task.progressPercentage}%</span>
                              </div>

                              <button
                                onClick={() => {
                                  if (setTasks) {
                                    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'DONE' ? 'IN_PROGRESS' : 'DONE', progressPercentage: t.status === 'DONE' ? 50 : 100 } : t));
                                  }
                                }}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                                  isDone
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isDone ? 'Done' : 'Complete'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/tasks"
                      onClick={() => setShowTasksDropdown(false)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      Open Tasks Board Management <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer hidden sm:block"
              title="Keyboard Hotkeys Guide"
            >
              <Keyboard className="w-4 h-4" />
            </button>



            {/* Static Compact Role Badge */}
            <div 
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-900/60 rounded-md select-none cursor-default pointer-events-none"
              title={`Logged in as ${currentRole}`}
            >
              <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Role: <span className="font-extrabold">{currentRole}</span></span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-amber-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notifications Center Link & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors cursor-pointer"
                title="Notifications Center"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-xs">Notifications</span>
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${
                          !n.isRead ? 'bg-indigo-50/60 dark:bg-slate-900/90 font-medium' : ''
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.createdAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-emerald-500 object-cover"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-slate-100">Alex Morgan</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">alex.morgan@smartcorp.com</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <User className="w-3.5 h-3.5" /> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </>
  );
};
