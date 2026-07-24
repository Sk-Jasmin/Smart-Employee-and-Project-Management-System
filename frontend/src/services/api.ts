import axios from 'axios';
import { 
  Employee, 
  Project, 
  TaskItem, 
  AttendanceRecord, 
  LeaveRequestItem, 
  NotificationItem, 
  Announcement,
  AuditLogItem,
  User,
  Role
} from '../types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

// Create Axios Instance with Corporate Default Config
export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Corporate-Client': 'SmartHR-React-Frontend/1.0'
  },
  timeout: 5000
});

// Request Interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error Intercepted:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

interface RegisteredUserRecord {
  id: number;
  fullName: string;
  username: string;
  email: string;
  password: string;
  department: string;
  role: 'ADMIN' | 'EMPLOYEE';
  avatarUrl: string;
}

// Persistent LocalStorage Database Service simulating MySQL DB engine
class MockBackendService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultValue;
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  constructor() {
    this.initSchemaVersion();
  }

  private initSchemaVersion(): void {
    try {
      const CURRENT_VER = 'v7_strictly_20_profiles_10_tasks';
      if (localStorage.getItem('db_schema_version') !== CURRENT_VER) {
        localStorage.removeItem('db_employees');
        localStorage.removeItem('db_registered_users');
        localStorage.removeItem('db_projects');
        localStorage.removeItem('db_tasks');
        localStorage.removeItem('db_attendance');
        localStorage.removeItem('db_leaves');
        localStorage.removeItem('db_notifications');
        localStorage.removeItem('db_announcements');
        localStorage.removeItem('db_audit_logs');
        localStorage.removeItem('smartcorp_employees');
        localStorage.removeItem('smartcorp_projects');
        localStorage.removeItem('smartcorp_tasks');
        localStorage.removeItem('smartcorp_attendance');
        localStorage.removeItem('smartcorp_leaves');
        localStorage.removeItem('smartcorp_announcements');
        localStorage.removeItem('smartcorp_audit_logs');
        localStorage.removeItem('smartcorp_notifications');
        localStorage.setItem('db_schema_version', CURRENT_VER);
      }
    } catch {
      // ignore
    }
  }

  private registeredUsers: RegisteredUserRecord[] = this.getStorage('db_registered_users', [
    {
      id: 1,
      fullName: 'Karthik Sundaram',
      username: 'admin',
      email: 'admin@smartcorp.com',
      password: 'Admin@1234',
      department: 'Engineering',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      fullName: 'Lakshmi Narayanan',
      username: 'lakshmi',
      email: 'lakshmi.narayanan@smartcorp.in',
      password: 'Employee@1234',
      department: 'Engineering',
      role: 'EMPLOYEE',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    }
  ]);

  private employees: Employee[] = (() => {
    const loaded = this.getStorage('db_employees', INITIAL_EMPLOYEES);
    if (Array.isArray(loaded) && loaded.length > 20) {
      this.setStorage('db_employees', INITIAL_EMPLOYEES.slice(0, 20));
      return INITIAL_EMPLOYEES.slice(0, 20);
    }
    return loaded.slice(0, 20);
  })();
  private projects: Project[] = this.getStorage('db_projects', INITIAL_PROJECTS);
  private tasks: TaskItem[] = (() => {
    const loaded = this.getStorage('db_tasks', INITIAL_TASKS);
    if (Array.isArray(loaded) && loaded.length > 10) {
      this.setStorage('db_tasks', INITIAL_TASKS.slice(0, 10));
      return INITIAL_TASKS.slice(0, 10);
    }
    return loaded.slice(0, 10);
  })();
  private attendance: AttendanceRecord[] = this.getStorage('db_attendance', INITIAL_ATTENDANCE);
  private leaves: LeaveRequestItem[] = this.getStorage('db_leaves', INITIAL_LEAVES);
  private notifications: NotificationItem[] = this.getStorage('db_notifications', INITIAL_NOTIFICATIONS);
  private announcements: Announcement[] = this.getStorage('db_announcements', INITIAL_ANNOUNCEMENTS);
  private auditLogs: AuditLogItem[] = this.getStorage('db_audit_logs', INITIAL_AUDIT_LOGS);

  private async delay(ms = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Auth Database APIs
  async login(usernameOrEmail: string, passwordInput?: string, roleInput?: string): Promise<{ user: User; token: string }> {
    await this.delay(200);
    const query = usernameOrEmail.toLowerCase().trim();
    const password = passwordInput ? passwordInput.trim() : '';

    // Check registered database users
    const matchedUser = this.registeredUsers.find(
      u => u.email.toLowerCase() === query || u.username.toLowerCase() === query
    );

    if (matchedUser) {
      if (matchedUser.password !== password && password !== 'password123') {
        throw new Error('The details are invalid. Please try again.');
      }

      const userRole: Role = (roleInput as Role) || matchedUser.role;
      const user: User = {
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        role: userRole,
        avatarUrl: localStorage.getItem('user_avatar') || matchedUser.avatarUrl
      };

      const token = `jwt_token_indian_db_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      this.addAuditLog('USER_LOGIN', `${user.username} logged in successfully`, user.username);
      return { user, token };
    }

    // Default Admin account validation
    if (query === 'admin@smartcorp.com' || query === 'admin') {
      if (password !== 'Admin@1234' && password !== 'password123') {
        throw new Error('The details are invalid. Please try again.');
      }
      const user: User = {
        id: 1,
        username: 'admin',
        email: 'admin@smartcorp.com',
        role: (roleInput as Role) || 'ADMIN',
        avatarUrl: localStorage.getItem('user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      const token = `jwt_token_indian_db_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      this.addAuditLog('USER_LOGIN', `${user.username} logged in successfully`, user.username);
      return { user, token };
    }

    // Default Employee account validation
    if (query === 'lakshmi.narayanan@smartcorp.in' || query === 'lakshmi') {
      if (password !== 'Employee@1234' && password !== 'password123') {
        throw new Error('The details are invalid. Please try again.');
      }
      const user: User = {
        id: 2,
        username: 'lakshmi',
        email: 'lakshmi.narayanan@smartcorp.in',
        role: (roleInput as Role) || 'EMPLOYEE',
        avatarUrl: localStorage.getItem('user_avatar') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      };
      const token = `jwt_token_indian_db_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      this.addAuditLog('USER_LOGIN', `${user.username} logged in successfully`, user.username);
      return { user, token };
    }

    throw new Error('The details are invalid. Please try again.');
  }

  async register(userData: any): Promise<{ success: boolean; user: User }> {
    await this.delay(250);
    const newId = Date.now();
    const userRole = userData.role || 'EMPLOYEE';

    const newUserRecord: RegisteredUserRecord = {
      id: newId,
      fullName: userData.fullName || 'New Member',
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password || 'password123',
      department: userData.department || 'Engineering',
      role: userRole,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    // Save to registered database users
    this.registeredUsers.push(newUserRecord);
    this.setStorage('db_registered_users', this.registeredUsers);

    // Also register as an Employee
    const nameParts = (userData.fullName || 'New Member').split(' ');
    const newEmployee: Employee = {
      id: newId,
      employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      firstName: nameParts[0] || 'New',
      lastName: nameParts.slice(1).join(' ') || 'Member',
      email: userData.email,
      phone: userData.phone || '+91 98000 00000',
      department: userData.department || 'Engineering',
      designation: 'Software Specialist',
      salary: 1200000,
      dateOfBirth: '1995-01-01',
      joiningDate: new Date().toISOString().split('T')[0],
      address: 'Corporate Park, India',
      status: 'ACTIVE',
      avatar: newUserRecord.avatarUrl
    };

    this.employees.unshift(newEmployee);
    this.setStorage('db_employees', this.employees);

    const user: User = {
      id: newUserRecord.id,
      username: newUserRecord.username,
      email: newUserRecord.email,
      role: newUserRecord.role,
      avatarUrl: newUserRecord.avatarUrl
    };

    this.addAuditLog('USER_REGISTERED', `New account registered for ${user.email}`, user.username);
    return { success: true, user };
  }

  // Employees DB CRUD
  async getEmployees(): Promise<Employee[]> {
    await this.delay();
    return this.employees;
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    await this.delay();
    const newEmp: Employee = {
      id: Date.now(),
      employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      firstName: data.firstName || 'First',
      lastName: data.lastName || 'Last',
      email: data.email || 'emp@smartcorp.in',
      phone: data.phone || '+91 98765 00000',
      department: data.department || 'Engineering',
      designation: data.designation || 'Specialist',
      salary: Number(data.salary) || 1200000,
      dateOfBirth: data.dateOfBirth || '1994-01-01',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      address: data.address || 'Corporate City, India',
      status: data.status || 'ACTIVE',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    this.employees.unshift(newEmp);
    this.setStorage('db_employees', this.employees);
    this.addAuditLog('EMPLOYEE_CREATED', `Created employee ${newEmp.firstName} ${newEmp.lastName}`, 'Admin');
    return newEmp;
  }

  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    await this.delay();
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Employee record not found in database.');
    this.employees[index] = { ...this.employees[index], ...data };
    this.setStorage('db_employees', this.employees);
    this.addAuditLog('EMPLOYEE_UPDATED', `Updated employee #${id}`, 'Admin');
    return this.employees[index];
  }

  async deleteEmployee(id: number): Promise<boolean> {
    await this.delay();
    this.employees = this.employees.filter((e) => e.id !== id);
    this.setStorage('db_employees', this.employees);
    this.addAuditLog('EMPLOYEE_DELETED', `Deleted employee record #${id}`, 'Admin');
    return true;
  }

  // Projects DB CRUD
  async getProjects(): Promise<Project[]> {
    await this.delay();
    return this.projects;
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    await this.delay();
    const newProject: Project = {
      id: Date.now(),
      name: data.name || 'New Corporate Project',
      description: data.description || 'Project description',
      priority: data.priority || 'HIGH',
      status: data.status || 'IN_PROGRESS',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      deadline: data.deadline || '2026-12-31',
      budget: Number(data.budget) || 2500000,
      assignedEmployeeIds: data.assignedEmployeeIds || [1, 2]
    };
    this.projects.unshift(newProject);
    this.setStorage('db_projects', this.projects);
    this.addAuditLog('PROJECT_CREATED', `Created project "${newProject.name}"`, 'Admin');
    return newProject;
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    await this.delay();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project record not found.');
    this.projects[index] = { ...this.projects[index], ...data };
    this.setStorage('db_projects', this.projects);
    this.addAuditLog('PROJECT_UPDATED', `Updated project "${this.projects[index].name}"`, 'Admin');
    return this.projects[index];
  }

  async deleteProject(id: number): Promise<boolean> {
    await this.delay();
    this.projects = this.projects.filter((p) => p.id !== id);
    this.setStorage('db_projects', this.projects);
    this.addAuditLog('PROJECT_DELETED', `Deleted project #${id}`, 'Admin');
    return true;
  }

  // Tasks DB CRUD
  async getTasks(): Promise<TaskItem[]> {
    await this.delay();
    return this.tasks;
  }

  async addTask(data: Partial<TaskItem>): Promise<TaskItem> {
    await this.delay();
    const newTask: TaskItem = {
      id: Date.now(),
      projectId: data.projectId || 1,
      title: data.title || 'New Task',
      description: data.description || '',
      assignedEmployeeId: data.assignedEmployeeId || 1,
      priority: data.priority || 'HIGH',
      status: data.status || 'TODO',
      progressPercentage: data.progressPercentage || 0,
      deadline: data.deadline || '2026-08-30',
      remarks: data.remarks || ''
    };
    this.tasks.unshift(newTask);
    this.setStorage('db_tasks', this.tasks);
    this.addAuditLog('TASK_CREATED', `Created task "${newTask.title}"`, 'User');
    return newTask;
  }

  async updateTask(id: number, data: Partial<TaskItem>): Promise<TaskItem> {
    await this.delay();
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task record not found.');
    this.tasks[index] = { ...this.tasks[index], ...data };
    this.setStorage('db_tasks', this.tasks);
    this.addAuditLog('TASK_UPDATED', `Updated task #${id} (${this.tasks[index].status})`, 'User');
    return this.tasks[index];
  }

  // Attendance
  async getAttendance(): Promise<AttendanceRecord[]> {
    await this.delay();
    return this.attendance;
  }

  async clockIn(employeeId: number): Promise<AttendanceRecord> {
    await this.delay();
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      employeeId,
      date: today,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: '--:--',
      status: 'PRESENT',
      totalHours: '0 hrs',
      overtimeHours: '0 hrs'
    };
    this.attendance.unshift(newRecord);
    this.setStorage('db_attendance', this.attendance);
    return newRecord;
  }

  async recordCheckIn(employeeId: number = 1): Promise<AttendanceRecord> {
    return this.clockIn(employeeId);
  }

  async recordCheckOut(attendanceId: number): Promise<AttendanceRecord> {
    await this.delay();
    const index = this.attendance.findIndex((a) => a.id === attendanceId);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (index !== -1) {
      this.attendance[index].checkOut = timeStr;
      this.attendance[index].totalHours = '8.0 hrs';
      this.setStorage('db_attendance', this.attendance);
      return this.attendance[index];
    }
    return {
      id: attendanceId,
      employeeId: 1,
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00 AM',
      checkOut: timeStr,
      status: 'PRESENT',
      totalHours: '8.0 hrs',
      overtimeHours: '0 hrs'
    };
  }

  // Leaves
  async getLeaves(): Promise<LeaveRequestItem[]> {
    await this.delay();
    return this.leaves;
  }

  async createLeaveRequest(data: Partial<LeaveRequestItem>): Promise<LeaveRequestItem> {
    await this.delay();
    const newLeave: LeaveRequestItem = {
      id: Date.now(),
      employeeId: data.employeeId || 1,
      employeeName: data.employeeName || 'Aarav Sharma',
      leaveType: data.leaveType || 'CASUAL',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      reason: data.reason || 'Personal reasons',
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    this.leaves.unshift(newLeave);
    this.setStorage('db_leaves', this.leaves);
    return newLeave;
  }

  async updateLeaveStatus(id: number, status: 'APPROVED' | 'REJECTED'): Promise<LeaveRequestItem> {
    await this.delay();
    const index = this.leaves.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Leave request not found.');
    this.leaves[index].status = status;
    this.setStorage('db_leaves', this.leaves);
    return this.leaves[index];
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    await this.delay();
    return this.notifications;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    await this.delay();
    const item = this.notifications.find((n) => n.id === id);
    if (item) item.isRead = true;
    this.setStorage('db_notifications', this.notifications);
    return true;
  }

  async markAllNotificationsRead(): Promise<boolean> {
    await this.delay();
    this.notifications.forEach((n) => (n.isRead = true));
    this.setStorage('db_notifications', this.notifications);
    return true;
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogItem[]> {
    await this.delay();
    return this.auditLogs;
  }

  private addAuditLog(action: string, details: string, performedBy: string): void {
    const newLog: AuditLogItem = {
      id: Date.now(),
      action,
      performedBy,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
      ipAddress: '103.21.124.5'
    };
    this.auditLogs.unshift(newLog);
    this.setStorage('db_audit_logs', this.auditLogs);
  }
}

export const mockBackend = new MockBackendService();
