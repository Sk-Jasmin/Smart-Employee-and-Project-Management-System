import React, { useState } from 'react';
import { Role, TaskItem, Project, Employee, TaskStatus } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormInput';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { DeadlineCountdown } from '../components/ui/DeadlineCountdown';
import { EmployeeProfileModal } from '../components/ui/EmployeeProfileModal';
import { mockBackend } from '../services/api';
import { 
  CheckSquare, 
  Plus, 
  Clock 
} from 'lucide-react';

interface TasksPageProps {
  currentRole: Role;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  projects: Project[];
  employees: Employee[];
}

export const TasksPage: React.FC<TasksPageProps> = ({
  currentRole,
  tasks,
  setTasks,
  projects,
  employees
}) => {
  const [filterProject, setFilterProject] = useState<number | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedProfileEmp, setSelectedProfileEmp] = useState<Employee | null>(null);

  const [formState, setFormState] = useState({
    title: '',
    description: '',
    priority: 'HIGH' as const,
    status: 'TODO' as TaskStatus,
    progressPercentage: 0,
    remarks: '',
    deadline: '2026-08-15',
    projectId: projects[0]?.id || 1,
    assignedEmployeeId: employees[0]?.id || 1
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = filterProject === 'ALL' || t.projectId === filterProject;
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch = !searchTerm.trim() || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProject && matchesPriority && matchesStatus && matchesSearch;
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await mockBackend.addTask(formState);
      setTasks(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      showAlert('success', `Task "${created.title}" created successfully.`);
      setFormState({
        title: '',
        description: '',
        priority: 'HIGH',
        status: 'TODO',
        progressPercentage: 0,
        remarks: '',
        deadline: '2026-08-15',
        projectId: projects[0]?.id || 1,
        assignedEmployeeId: employees[0]?.id || 1
      });
    } catch {
      showAlert('error', 'Failed to create task.');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const updated = await mockBackend.updateTask(taskId, {
        status: newStatus,
        progressPercentage: newStatus === 'DONE' ? 100 : newStatus === 'REVIEW' ? 90 : newStatus === 'IN_PROGRESS' ? 50 : 0
      });
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      showAlert('success', `Task moved to ${newStatus.replace('_', ' ')}.`);
    } catch {
      showAlert('error', 'Failed to update task status.');
    }
  };

  const kanbanColumns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'TODO', title: 'To Do', color: 'border-slate-400' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-blue-600' },
    { id: 'REVIEW', title: 'In Review', color: 'border-amber-500' },
    { id: 'DONE', title: 'Completed', color: 'border-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="page-title-icon text-blue-700 dark:text-blue-500" /> Task Management Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agile task progression, sprint assignments, and deadline tracking.
          </p>
        </div>

        {currentRole !== 'EMPLOYEE' && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800"
          >
            Create Task
          </Button>
        )}
      </div>

      {/* Alert Banner */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onDismiss={() => setAlert(null)}
        />
      )}

      {/* Filter Toolbar */}
      <Card>
        <CardBody className="p-4 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-3 text-xs w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="pl-3 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white rounded text-xs focus:ring-2 focus:ring-indigo-600 transition-all"
              />
            </div>

            {/* Project Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">Project:</span>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs focus:ring-2 focus:ring-indigo-600 transition-all"
              >
                <option value="ALL">All Projects ({tasks.length})</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs focus:ring-2 focus:ring-indigo-600 transition-all"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs focus:ring-2 focus:ring-indigo-600 transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">In Review</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
          </div>

        </CardBody>
      </Card>

      {/* KanBan Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kanbanColumns.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className="bg-[#f8f9fa] dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[500px]">
              
              <div className={`flex items-center justify-between pb-2 mb-2.5 border-b-2 ${col.color}`}>
                <h3 className="task-column-title text-slate-700 dark:text-slate-300" style={{ fontSize: '13px', lineHeight: '17px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{col.title}</h3>
                <span className="bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold px-1.5 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <EmptyState
                    title={`No tasks in ${col.title}`}
                    description="Drag or assign tasks to this column."
                    icon="inbox"
                    className="py-6 bg-transparent border-dashed text-xs"
                  />
                ) : (
                  columnTasks.map((task) => {
                    const assignee = employees.find(e => e.id === task.assignedEmployeeId);

                    return (
                      <Card key={task.id} className="hover:shadow-md hover:border-blue-300 dark:hover:border-slate-700 transition-all duration-150">
                        <CardBody className="p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant={
                                task.priority === 'URGENT'
                                  ? 'red'
                                  : task.priority === 'HIGH'
                                  ? 'yellow'
                                  : 'blue'
                              }
                              size="sm"
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-slate-400 font-mono">#{task.id}</span>
                          </div>

                          <div className="task-card-title text-slate-900 dark:text-slate-100 line-clamp-2" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 700 }} title={task.title}>{task.title}</div>
                          <p className="task-card-body text-slate-600 dark:text-slate-300 line-clamp-2">{task.description}</p>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                              <span>Completion</span>
                              <span>{task.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-600 h-full transition-all duration-150"
                                style={{ width: `${task.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Assigned By Metadata */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Assigned By:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{task.assignedBy || 'Corporate Management'}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <DeadlineCountdown deadline={task.deadline} />

                            {assignee && (
                              <button 
                                onClick={() => setSelectedProfileEmp(assignee)}
                                className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                                title={`Click to view ${assignee.firstName}'s profile dossier`}
                              >
                                <img
                                  src={assignee.avatar}
                                  alt={assignee.firstName}
                                  className="w-4 h-4 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                />
                                <span className="truncate max-w-[80px] font-bold">{assignee.firstName}</span>
                              </button>
                            )}
                          </div>

                          {/* Quick Move Selector (Hidden for EMPLOYEE) */}
                          {currentRole !== 'EMPLOYEE' && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-xs text-slate-400 uppercase font-bold">Move:</span>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                              >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REVIEW">In Review</option>
                                <option value="DONE">Completed</option>
                              </select>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Sprint Task"
        maxWidth="lg"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <FormInput
            label="Task Title"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            placeholder="e.g. Implement JWT Authentication Filter"
            required
          />

          <FormTextarea
            label="Task Requirements & Specs"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            placeholder="Describe acceptance criteria..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Assigned Project"
              value={formState.projectId}
              onChange={(e) => setFormState({ ...formState, projectId: Number(e.target.value) })}
              options={projects.map(p => ({ value: p.id, label: p.name }))}
            />

            <FormSelect
              label="Assigned Engineer"
              value={formState.assignedEmployeeId}
              onChange={(e) => setFormState({ ...formState, assignedEmployeeId: Number(e.target.value) })}
              options={employees.map(e => ({ value: e.id, label: `${e.firstName} ${e.lastName} (${e.department})` }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Priority Level"
              value={formState.priority}
              onChange={(e) => setFormState({ ...formState, priority: e.target.value as any })}
              options={[
                { value: 'LOW', label: 'LOW' },
                { value: 'MEDIUM', label: 'MEDIUM' },
                { value: 'HIGH', label: 'HIGH' },
                { value: 'URGENT', label: 'URGENT' }
              ]}
            />

            <FormInput
              label="Target Deadline"
              type="date"
              value={formState.deadline}
              onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="bg-blue-700 hover:bg-blue-800">Save Task</Button>
          </div>
        </form>
      </Modal>

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
