import React, { useState } from 'react';
import { Employee, Project, TaskItem, AuditLogItem } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormTextarea } from '../components/ui/FormInput';
import { ToastMessage, ToastNotification } from '../components/ui/ToastNotification';
import { AuditLogsPage } from './AuditLogsPage';
import { 
  BarChart2, 
  Download, 
  Users, 
  Briefcase,
  Clock,
  Printer,
  Sparkles,
  Send,
  Mail,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

interface ReportsPageProps {
  currentRole?: Role;
  currentUser?: User | null;
  employees: Employee[];
  projects: Project[];
  tasks: TaskItem[];
  auditLogs: AuditLogItem[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  currentRole = 'ADMIN',
  currentUser,
  employees,
  projects,
  tasks,
  auditLogs
}) => {
  const [mainTab, setMainTab] = useState<'reports' | 'audit-logs'>('reports');
  const [activeReportTab, setActiveReportTab] = useState<'employee-tasks' | 'project-progress' | 'pending-tasks'>('employee-tasks');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isEmployeeRole = currentRole === 'EMPLOYEE';

  // Find employee matching currentUser (or fallback to Lakshmi Narayanan empId 2)
  const currentEmp = isEmployeeRole
    ? employees.find(e => 
        (currentUser?.email && e.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser?.fullName && `${e.firstName} ${e.lastName}`.toLowerCase() === currentUser.fullName.toLowerCase())
      ) || employees.find(e => e.id === 2) || employees[0]
    : null;

  const myEmpId = currentEmp ? currentEmp.id : null;

  // Filter tasks, projects, employees based on role
  const displayTasks = isEmployeeRole && myEmpId
    ? tasks.filter(t => t.assignedEmployeeId === myEmpId)
    : tasks;

  const displayProjects = isEmployeeRole && myEmpId
    ? projects.filter(p => p.assignedEmployeeIds?.includes(myEmpId) || displayTasks.some(t => t.projectId === p.id))
    : projects;

  const displayEmployees = isEmployeeRole && currentEmp
    ? [currentEmp]
    : employees;

  // Department Payroll / Compensation Tally
  const totalPayroll = displayEmployees.reduce((sum: number, e: Employee) => sum + Number(e.salary), 0);
  const totalProjectBudget = displayProjects.reduce((sum: number, p: Project) => sum + Number(p.budget), 0);

  // CSV Exporter
  const handleExportCSV = () => {
    let headers = ['ID', 'Code', 'Name', 'Email', 'Department', 'Designation', 'Salary', 'Status'];
    let rows = displayEmployees.map(e => [
      e.id,
      e.employeeCode,
      `"${e.firstName} ${e.lastName}"`,
      e.email,
      e.department,
      `"${e.designation}"`,
      e.salary,
      e.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', isEmployeeRole ? 'my_assigned_performance_report.csv' : 'smartcorp_executive_analytics_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isEmployeeRole && mainTab === 'audit-logs') {
    return (
      <div className="space-y-6">
        {/* Unified Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setMainTab('reports')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <span>Executive Reports & Analytics</span>
          </button>
          <button
            onClick={() => setMainTab('audit-logs')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-xs transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>System Audit Trail</span>
          </button>
        </div>

        <AuditLogsPage auditLogs={auditLogs} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Unified Nav Tabs for Admin */}
      {!isEmployeeRole && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setMainTab('reports')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-xs transition-all cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-white" />
            <span>Executive Reports & Analytics</span>
          </button>
          <button
            onClick={() => setMainTab('audit-logs')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>System Audit Trail</span>
          </button>
        </div>
      )}

      <ToastNotification toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="page-title-icon text-indigo-600 dark:text-indigo-400" /> Reports & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEmployeeRole 
              ? `Personal performance report, assigned task breakdown, and project telemetry for ${currentEmp?.firstName} ${currentEmp?.lastName}.`
              : 'Departmental compensation metrics, staff task breakdowns, and project progress telemetry.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
            className="text-xs"
          >
            Print PDF
          </Button>

          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-900 text-xs"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-indigo-600">
          <CardBody className="p-4">
            <span className="text-xs uppercase font-bold text-slate-500">
              {isEmployeeRole ? 'My Annual Salary' : 'Annual Payroll Liability'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                ₹{totalPayroll.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                {isEmployeeRole ? `${currentEmp?.department}` : `${employees.length} Staff`}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardBody className="p-4">
            <span className="text-xs uppercase font-bold text-slate-500">
              {isEmployeeRole ? 'My Assigned Projects' : 'Portfolio Capital Commitment'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {isEmployeeRole ? displayProjects.length : `₹${totalProjectBudget.toLocaleString()}`}
              </span>
              <span className="text-xs text-slate-500">
                {isEmployeeRole ? 'Active Assignments' : `${projects.length} Active Projects`}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-teal-600">
          <CardBody className="p-4">
            <span className="text-xs uppercase font-bold text-slate-500">
              {isEmployeeRole ? 'My Assigned Tasks' : 'Average Compensation / Head'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {isEmployeeRole 
                  ? displayTasks.length
                  : `₹${employees.length > 0 ? Math.round(totalPayroll / employees.length).toLocaleString() : 0}`}
              </span>
              <span className="text-xs text-slate-500">
                {isEmployeeRole 
                  ? `${displayTasks.filter(t => t.status === 'DONE').length} Completed` 
                  : 'Per Annum'}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Report Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveReportTab('employee-tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReportTab === 'employee-tasks'
              ? 'bg-indigo-600 text-white shadow-md dark:bg-slate-900 dark:text-indigo-400 dark:border dark:border-indigo-500/60'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isEmployeeRole ? 'My Task Performance' : 'Employee Task Breakdown'}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('project-progress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReportTab === 'project-progress'
              ? 'bg-indigo-600 text-white shadow-md dark:bg-slate-900 dark:text-indigo-400 dark:border dark:border-indigo-500/60'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isEmployeeRole ? 'My Assigned Projects' : 'Project Progress Report'}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('pending-tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReportTab === 'pending-tasks'
              ? 'bg-indigo-600 text-white shadow-md dark:bg-slate-900 dark:text-indigo-400 dark:border dark:border-indigo-500/60'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isEmployeeRole ? 'My Pending Tasks' : 'Pending Task Report'} ({displayTasks.filter(t => t.status !== 'DONE').length})</span>
        </button>
      </div>

      {/* TAB 1: Employee-Wise Task Report */}
      {activeReportTab === 'employee-tasks' && (
        <Card>
          <CardHeader>{isEmployeeRole ? 'My Task Performance Summary' : 'Employee Task Breakdown'}</CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100/90 dark:bg-slate-950 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Assigned Tasks</th>
                    <th className="px-4 py-3">Completed</th>
                    <th className="px-4 py-3">Completion %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {displayEmployees.map((emp) => {
                    const empTasks = displayTasks.filter(t => t.assignedEmployeeId === emp.id);
                    const doneTasks = empTasks.filter(t => t.status === 'DONE');
                    const rate = empTasks.length > 0 ? Math.round((doneTasks.length / empTasks.length) * 100) : 0;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                          <div className="text-[10px] text-slate-500">{emp.email}</div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="blue">{emp.department}</Badge></td>
                        <td className="px-4 py-3 font-mono font-bold">{empTasks.length}</td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{doneTasks.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${rate}%` }} />
                            </div>
                            <span className="font-mono font-bold">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB 2: Project Progress Report */}
      {activeReportTab === 'project-progress' && (
        <Card>
          <CardHeader>{isEmployeeRole ? 'My Assigned Projects' : 'Project Milestones & Capital Progress'}</CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100/90 dark:bg-slate-950 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Project Title</th>
                    <th className="px-4 py-3">Budget</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {displayProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="px-4 py-3 font-mono font-semibold">₹{p.budget.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant="blue">{p.status}</Badge></td>
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">{p.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB 3: Pending Task Report */}
      {activeReportTab === 'pending-tasks' && (
        <Card>
          <CardHeader>{isEmployeeRole ? 'My Pending Tasks' : 'Pending Tasks Audit'}</CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100/90 dark:bg-slate-950 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Task Title</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {displayTasks.filter(t => t.status !== 'DONE').map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{t.title}</td>
                      <td className="px-4 py-3"><Badge variant={t.priority === 'URGENT' ? 'red' : 'yellow'}>{t.priority}</Badge></td>
                      <td className="px-4 py-3"><Badge variant="blue">{t.status}</Badge></td>
                      <td className="px-4 py-3 font-mono text-rose-600 dark:text-rose-400 font-bold">{t.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

    </div>
  );
};
