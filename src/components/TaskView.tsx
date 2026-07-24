import React, { useState } from 'react';
import { TaskItem, Employee, Project, Role, TaskStatus } from '../types';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Calendar,
  X,
  Sliders
} from 'lucide-react';

interface TaskViewProps {
  currentRole: Role;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  projects: Project[];
  employees: Employee[];
}

export const TaskView: React.FC<TaskViewProps> = ({
  currentRole,
  tasks,
  setTasks,
  projects,
  employees
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  const [formState, setFormState] = useState<Partial<TaskItem>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    progressPercentage: 0,
    remarks: '',
    deadline: '2026-08-15',
    projectId: 1,
    assignedEmployeeId: 1
  });

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'TODO', label: 'To Do', color: 'border-amber-500' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500' },
    { status: 'REVIEW', label: 'In Review', color: 'border-purple-500' },
    { status: 'DONE', label: 'Completed', color: 'border-emerald-500' }
  ];

  const handleUpdateProgress = (taskId: number, newProgress: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newStatus: TaskStatus = newProgress === 100 ? 'DONE' : newProgress > 0 ? 'IN_PROGRESS' : 'TODO';
        return { ...t, progressPercentage: newProgress, status: newStatus };
      }
      return t;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === Number(formState.projectId));
    const emp = employees.find(e => e.id === Number(formState.assignedEmployeeId));

    const newTask: TaskItem = {
      id: Date.now(),
      title: formState.title || 'New Task',
      description: formState.description || '',
      priority: formState.priority || 'MEDIUM',
      status: formState.status || 'TODO',
      progressPercentage: Number(formState.progressPercentage) || 0,
      remarks: formState.remarks || '',
      deadline: formState.deadline || '2026-08-15',
      projectId: Number(formState.projectId) || 1,
      projectName: proj?.name || 'Project',
      assignedEmployeeId: Number(formState.assignedEmployeeId) || 1,
      assignedEmployeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unassigned'
    };

    setTasks(prev => [newTask, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Task Management & Execution Board</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Kanban workflow tracking, remarks, progress percentage, and assignment</p>
        </div>

        <button
          onClick={() => {
            setFormState({
              title: '',
              description: '',
              priority: 'MEDIUM',
              status: 'TODO',
              progressPercentage: 0,
              remarks: '',
              deadline: '2026-08-15',
              projectId: projects[0]?.id || 1,
              assignedEmployeeId: employees[0]?.id || 1
            });
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.status);

          return (
            <div key={col.status} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
                <h3 className="task-column-title text-slate-800 dark:text-slate-200" style={{ fontSize: '13px', lineHeight: '17px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{col.label}</h3>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {colTasks.map((t) => {
                  const emp = employees.find(e => e.id === t.assignedEmployeeId);
                  const proj = projects.find(p => p.id === t.projectId);

                  return (
                    <div key={t.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                          {proj?.name || 'Project'}
                        </span>
                        <span className={`text-xs font-extrabold ${
                          t.priority === 'URGENT' ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {t.priority}
                        </span>
                      </div>

                      <h4 className="task-card-title text-slate-900 dark:text-white" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 700 }}>{t.title}</h4>
                      <p className="task-card-body text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{t.description}</p>

                      {/* Progress Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                          <span>Progress</span>
                          <span>{t.progressPercentage}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={t.progressPercentage}
                          onChange={(e) => handleUpdateProgress(t.id, Number(e.target.value))}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {t.remarks && (
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-500 dark:text-slate-400 italic">
                          "{t.remarks}"
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          {emp && <img src={emp.avatar} alt={emp.firstName} className="w-5 h-5 rounded-full object-cover" />}
                          <span className="font-medium text-slate-700 dark:text-slate-300">{emp ? `${emp.firstName}` : 'Unassigned'}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {t.deadline}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Create New Task Assignment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={formState.title || ''}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Project</label>
                  <select
                    value={formState.projectId}
                    onChange={(e) => setFormState({ ...formState, projectId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Employee</label>
                  <select
                    value={formState.assignedEmployeeId}
                    onChange={(e) => setFormState({ ...formState, assignedEmployeeId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Task Description</label>
                <textarea
                  rows={2}
                  value={formState.description || ''}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                  <select
                    value={formState.priority || 'MEDIUM'}
                    onChange={(e) => setFormState({ ...formState, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={formState.deadline || '2026-08-15'}
                    onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
