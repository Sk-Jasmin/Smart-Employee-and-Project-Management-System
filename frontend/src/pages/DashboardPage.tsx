import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, Employee, Project, TaskItem, AttendanceRecord, Announcement, AuditLogItem } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CorporateBarChart, CorporatePieChart } from '../components/ui/Charts';
import { DeadlineCountdown } from '../components/ui/DeadlineCountdown';
import { EmployeeProfileModal } from '../components/ui/EmployeeProfileModal';
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  Clock, 
  Plus, 
  TrendingUp,
  Volume2
} from 'lucide-react';

interface DashboardProps {
  currentRole: Role;
  employees: Employee[];
  projects: Project[];
  tasks: TaskItem[];
  announcements: Announcement[];
  attendance: AttendanceRecord[];
  auditLogs: AuditLogItem[];
}

export const DashboardPage: React.FC<DashboardProps> = ({
  currentRole,
  employees,
  projects,
  tasks,
  announcements,
  attendance,
}) => {
  const navigate = useNavigate();
  const [selectedProfileEmp, setSelectedProfileEmp] = useState<Employee | null>(null);

  // Metrics calculations
  const totalEmployees = employees.length;
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const openTasks = tasks.filter(t => t.status !== 'DONE').length;
  const presentCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 100;

  // Chart Data - Project Task Milestone Breakdown
  const projectProgressData = projects.map(p => {
    const projTasks = tasks.filter(t => t.projectId === p.id);
    const completed = projTasks.filter(t => t.status === 'DONE').length;
    const pending = projTasks.length - completed;
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      Completed: completed,
      Pending: pending
    };
  });

  const taskStatusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'TODO').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length },
    { name: 'In Review', value: tasks.filter(t => t.status === 'REVIEW').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'DONE').length }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border border-indigo-500/30 dark:border-slate-800 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="green" size="sm">{currentRole === 'EMPLOYEE' ? 'Employee Workspace' : 'Corporate Workspace'}</Badge>
            <span className="text-xs text-indigo-200 dark:text-slate-400">Role: <strong className="text-white font-extrabold">{currentRole}</strong></span>
          </div>
          <h1 className="text-base font-bold tracking-tight text-white">
            {currentRole === 'EMPLOYEE' ? 'My Operations & Task Workspace' : 'Executive Operations Dashboard'}
          </h1>
          <p className="text-xs text-indigo-100 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            {currentRole === 'EMPLOYEE'
              ? 'Overview of your assigned tasks, project progress, and sprint milestones.'
              : 'Real-time overview of personnel, project milestones, system attendance, and active tasks.'
            }
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentRole !== 'EMPLOYEE' ? (
            <>
              <Button
                variant="success"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => navigate('/projects')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                New Project
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => navigate('/employees')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Add Staff
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={<CheckSquare className="w-4 h-4" />}
              onClick={() => navigate('/tasks')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              My Tasks
            </Button>
          )}
        </div>
      </div>

      {/* Core KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-700 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                {currentRole === 'EMPLOYEE' ? 'My Assigned Tasks' : 'Total Personnel'}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {currentRole === 'EMPLOYEE' ? tasks.filter(t => t.assignedEmployeeId === 1).length : totalEmployees}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {currentRole === 'EMPLOYEE' ? 'Active sprint load' : '100% active status'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-slate-950 text-blue-800 dark:text-sky-300 border dark:border-sky-900/60 rounded-lg">
              {currentRole === 'EMPLOYEE' ? <CheckSquare className="w-6 h-6" /> : <Users className="w-6 h-6" />}
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                {currentRole === 'EMPLOYEE' ? 'Completed Tasks' : 'Active Projects'}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {currentRole === 'EMPLOYEE' ? tasks.filter(t => t.assignedEmployeeId === 1 && t.status === 'DONE').length : activeProjects}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {currentRole === 'EMPLOYEE' ? 'Verified sprint deliverables' : `Total ${projects.length} in portfolio`}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-slate-950 text-emerald-800 dark:text-emerald-300 border dark:border-emerald-900/60 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-teal-600 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                {currentRole === 'EMPLOYEE' ? 'Pending Deadlines' : 'Open Tasks'}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {currentRole === 'EMPLOYEE' ? tasks.filter(t => t.assignedEmployeeId === 1 && t.status !== 'DONE').length : openTasks}
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                {tasks.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length} high priority
              </p>
            </div>
            <div className="p-3 bg-teal-100 dark:bg-slate-950 text-teal-800 dark:text-teal-300 border dark:border-teal-900/60 rounded-lg">
              <CheckSquare className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-indigo-600 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{attendanceRate}%</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {presentCount} present today
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-slate-950 text-indigo-800 dark:text-indigo-300 border dark:border-indigo-900/60 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg p-4 flex items-start gap-3">
          <div className="p-2 bg-amber-600 text-white rounded shrink-0 mt-0.5">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase text-amber-800 dark:text-amber-300">Company Announcement</span>
              <Badge variant="yellow" size="sm">{announcements[0].priority}</Badge>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{announcements[0].title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{announcements[0].content}</p>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader action={<Button size="sm" variant="outline" onClick={() => navigate('/projects')}>View Projects</Button>}>
            Project Task Distribution & Sprint Milestones
          </CardHeader>
          <CardBody>
            <CorporateBarChart
              data={projectProgressData}
              xKey="name"
              bars={[
                { key: 'Completed', name: 'Completed Tasks', color: '#10b981' },
                { key: 'Pending', name: 'Pending / In Progress', color: '#6366f1' }
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader action={<Button size="sm" variant="outline" onClick={() => navigate('/tasks')}>All Tasks</Button>}>
            Task Status Distribution
          </CardHeader>
          <CardBody>
            <CorporatePieChart data={taskStatusData} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
              {taskStatusData.map((d) => (
                <div key={d.name} className="flex items-center justify-between px-2 py-1 bg-slate-100/60 dark:bg-slate-800 rounded">
                  <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Live Project Deadlines Card */}
      <Card className="border-l-4 border-l-indigo-600">
        <CardHeader action={<Button size="sm" variant="outline" onClick={() => navigate('/projects')}>All Projects</Button>}>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Project Deadlines & Milestones</span>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-500">Target: {p.deadline}</span>
                </div>
                <DeadlineCountdown deadline={p.deadline} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Employee Profile Dossier Modal */}
      <EmployeeProfileModal
        employee={selectedProfileEmp}
        isOpen={!!selectedProfileEmp}
        onClose={() => setSelectedProfileEmp(null)}
        tasks={tasks}
        projects={projects}
      />

    </div>
  );
};
