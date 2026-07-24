import React, { useState } from 'react';
import { Project, Employee, Role, Priority, ProjectStatus } from '../types';
import { 
  FolderKanban, 
  Plus, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X,
  Edit3,
  Trash2
} from 'lucide-react';

interface ProjectViewProps {
  currentRole: Role;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  employees: Employee[];
  tasks?: TaskItem[];
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  currentRole,
  projects,
  setProjects,
  employees,
  tasks = []
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formState, setFormState] = useState<Partial<Project>>({
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PLANNED',
    startDate: '2026-08-01',
    deadline: '2026-11-30',
    budget: 50000,
    assignedEmployeeIds: []
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formState } as Project : p));
    } else {
      const newProj: Project = {
        id: Date.now(),
        name: formState.name || 'New Initiative',
        description: formState.description || 'Project description',
        priority: formState.priority || 'MEDIUM',
        status: formState.status || 'PLANNED',
        startDate: formState.startDate || '2026-08-01',
        deadline: formState.deadline || '2026-11-30',
        budget: formState.budget || 50000,
        assignedEmployeeIds: formState.assignedEmployeeIds || [1, 2]
      };
      setProjects(prev => [newProj, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project & Deliverable Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track deadlines, team assignments, and budgets</p>
        </div>

        {(currentRole === 'ADMIN' || currentRole === 'MANAGER') && (
          <button
            onClick={() => {
              setEditingProject(null);
              setFormState({
                name: '',
                description: '',
                priority: 'HIGH',
                status: 'PLANNED',
                startDate: '2026-08-01',
                deadline: '2026-11-30',
                budget: 75000,
                assignedEmployeeIds: [1, 2]
              });
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        )}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const assignedEmps = employees.filter(e => proj.assignedEmployeeIds.includes(e.id));
          const projTasks = tasks.filter(t => t.projectId === proj.id);
          const completedTasks = projTasks.filter(t => t.status === 'DONE').length;
          const totalTasks = projTasks.length;
          const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      proj.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      proj.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white text-center">{proj.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {proj.description}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Start & Target</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{proj.startDate} &rarr; {proj.deadline}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Allocated</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{proj.budget.toLocaleString()}</span>
                </div>
              </div>

              {/* Dynamic Task Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Task Progress</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                    {completedTasks}/{totalTasks} Tasks ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progressPercent === 100
                        ? 'bg-emerald-500'
                        : progressPercent >= 50
                        ? 'bg-indigo-600'
                        : progressPercent > 0
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Assigned Employees */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Team Assigned ({assignedEmps.length})</span>
                <div className="flex -space-x-2 overflow-hidden">
                  {assignedEmps.map(emp => (
                    <img key={emp.id} src={emp.avatar} alt={emp.firstName} title={`${emp.firstName} (${emp.designation})`} className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" />
                  ))}
                </div>
              </div>

              {/* Bottom Row: Priority Tag & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  proj.priority === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                  proj.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {proj.priority} PRIORITY
                </span>

                {(currentRole === 'ADMIN' || currentRole === 'MANAGER') && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setFormState(proj);
                        setShowModal(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingProject ? 'Edit Project Specifications' : 'Define New Project'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formState.name || ''}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
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
                    onChange={(e) => setFormState({ ...formState, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={formState.status || 'PLANNED'}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as ProjectStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={formState.deadline || ''}
                    onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Budget ($)</label>
                  <input
                    type="number"
                    value={formState.budget || 0}
                    onChange={(e) => setFormState({ ...formState, budget: Number(e.target.value) })}
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
