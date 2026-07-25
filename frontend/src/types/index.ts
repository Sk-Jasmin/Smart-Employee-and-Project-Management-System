export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface EmployeeCertification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
}

export interface EmployeeAchievement {
  id: number;
  title: string;
  badge: string;
  note: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  dateOfBirth: string;
  joiningDate: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  avatar?: string;
  certifications?: EmployeeCertification[];
  achievements?: EmployeeAchievement[];
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  budget: number;
  assignedEmployeeIds: number[];
  assignedEmployeeNames?: string[];
  taskCount?: number;
  completedTaskCount?: number;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  progressPercentage: number;
  remarks: string;
  deadline: string;
  projectId: number;
  projectName?: string;
  assignedEmployeeId?: number;
  assignedEmployeeName?: string;
  assignedBy?: string;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName?: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
  workHours?: number;
  totalHours?: string | number;
  overtimeHours?: string | number;
  remarks?: string;
}

export type LeaveType = 'ANNUAL' | 'SICK' | 'CASUAL' | 'MATERNITY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequestItem {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays?: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  adminRemarks?: string;
  createdAt?: string;
  appliedDate?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdBy?: string;
  createdAt: string;
  postedBy?: string;
}

export interface AuditLogItem {
  id: number;
  username?: string;
  action: string;
  entityName?: string;
  entityId?: number;
  ipAddress: string;
  details: string;
  timestamp: string;
  performedBy?: string;
}

export interface NotificationItem {
  id: number;
  recipientUsername?: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'LEAVE_UPDATE' | 'ANNOUNCEMENT' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface BackendFile {
  path: string;
  category: 'config' | 'security' | 'controller' | 'service' | 'repository' | 'entity' | 'dto' | 'mapper' | 'exception' | 'utils' | 'test' | 'resource' | 'root';
  content: string;
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  category: 'WORK' | 'PERSONAL' | 'URGENT' | 'IDEAS';
  color: string;
  isPinned: boolean;
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  path: string;
  category: 'PAGE' | 'PROJECT' | 'EMPLOYEE' | 'TASK';
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: 'COMPANY' | 'TECH' | 'HR' | 'EVENT';
  author: string;
  readTime: string;
  date: string;
  imageUrl?: string;
}

export interface LeaveApprovalStep {
  stepName: string;
  approver: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  timestamp?: string;
  remarks?: string;
}

export interface ProductivityMetrics {
  score: number; // 0 - 100
  tasksCompleted: number;
  tasksDue: number;
  punctualityRate: number;
  focusHours: number;
}

export interface AppSettings {
  timezone: string;
  dateFormat: string;
  language: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  sessionTimeout: string;
  twoFactorAuth: boolean;
}
