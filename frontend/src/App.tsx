import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Role, 
  Employee, 
  Project, 
  TaskItem, 
  AttendanceRecord, 
  LeaveRequestItem, 
  Announcement, 
  AuditLogItem, 
  NotificationItem,
  User 
} from './types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { BACKEND_FILES } from './data/backendCode';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';
import { ReportsPage } from './pages/ReportsPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeaveRequestsPage } from './pages/LeaveRequestsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SwaggerView } from './components/SwaggerView';
import { CodeExplorerView } from './components/CodeExplorerView';
import { PersonalNotesDrawer } from './components/ui/PersonalNotesDrawer';
import { authService } from './services/authService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('ADMIN');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('auth_token') && !!localStorage.getItem('auth_user');
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core Data Collections with localStorage persistence
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('smartcorp_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('smartcorp_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('smartcorp_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('smartcorp_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });
  const [leaves, setLeaves] = useState<LeaveRequestItem[]>(() => {
    const saved = localStorage.getItem('smartcorp_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('smartcorp_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('smartcorp_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smartcorp_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('smartcorp_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('smartcorp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('smartcorp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('smartcorp_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('smartcorp_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('smartcorp_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('smartcorp_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('smartcorp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    // Check initial auth state from localStorage
    authService.getCurrentUser().then((user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setCurrentRole(user.role || 'ADMIN');
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [darkMode]);

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDownloadProjectZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("smart-employee-management-backend");

    BACKEND_FILES.forEach(file => {
      folder?.file(file.path, file.content);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "smart-employee-management-backend.zip");
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const pendingLeaveCount = leaves.filter(l => l.status === 'PENDING').length;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-600 selection:text-white">
        
        {/* Render Navbar and Sidebar if authenticated */}
        {isAuthenticated && (
          <Navbar
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            notifications={notifications}
            markNotificationRead={markNotificationRead}
            onLogout={handleLogout}
            tasks={tasks}
            setTasks={setTasks}
          />
        )}

        <div className="flex-1 flex overflow-hidden">
          {isAuthenticated && (
            <Sidebar
              currentRole={currentRole}
              pendingLeaveCount={pendingLeaveCount}
              unreadNotificationCount={unreadCount}
            />
          )}

          <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            <Routes>
              {/* Public Auth Routes */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <LoginPage
                      onLoginSuccess={(user, role) => {
                        setCurrentUser(user);
                        setCurrentRole(role);
                        setIsAuthenticated(true);
                      }}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                    />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <RegisterPage
                      onRegisterSuccess={(user) => {
                        setCurrentUser(user);
                        setCurrentRole(user.role || 'EMPLOYEE');
                        setIsAuthenticated(true);
                      }}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                    />
                  )
                }
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole}>
                    <DashboardPage
                      currentRole={currentRole}
                      employees={employees}
                      projects={projects}
                      tasks={tasks}
                      announcements={announcements}
                      attendance={attendance}
                      auditLogs={auditLogs}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employees"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN']}>
                    <EmployeesPage
                      currentRole={currentRole}
                      employees={employees}
                      setEmployees={setEmployees}
                      tasks={tasks}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole}>
                    <ProjectsPage
                      currentRole={currentRole}
                      projects={projects}
                      setProjects={setProjects}
                      employees={employees}
                      tasks={tasks}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole}>
                    <TasksPage
                      currentRole={currentRole}
                      tasks={tasks}
                      setTasks={setTasks}
                      projects={projects}
                      employees={employees}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attendance"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN', 'MANAGER']}>
                    <AttendancePage
                      currentRole={currentRole}
                      attendance={attendance}
                      setAttendance={setAttendance}
                      employees={employees}
                      leaves={leaves}
                      setLeaves={setLeaves}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leave-requests"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN', 'MANAGER']}>
                    <LeaveRequestsPage
                      currentRole={currentRole}
                      leaves={leaves}
                      setLeaves={setLeaves}
                      employees={employees}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN', 'MANAGER']}>
                    <ReportsPage
                      employees={employees}
                      projects={projects}
                      tasks={tasks}
                      auditLogs={auditLogs}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN', 'MANAGER']}>
                    <AuditLogsPage auditLogs={auditLogs} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole}>
                    <NotificationsPage
                      notifications={notifications}
                      setNotifications={setNotifications}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN']}>
                    <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/swagger"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN', 'MANAGER']}>
                    <SwaggerView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/code"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole={currentRole} allowedRoles={['ADMIN', 'MANAGER']}>
                    <CodeExplorerView onDownloadProject={handleDownloadProjectZip} />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Personal Notes Drawer */}
        {isAuthenticated && <PersonalNotesDrawer />}

      </div>
    </BrowserRouter>
  );
}
