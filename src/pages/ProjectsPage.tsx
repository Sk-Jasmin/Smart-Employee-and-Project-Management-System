import React, { useState } from 'react';
import { Role, Project, Employee, Priority, ProjectStatus } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormInput';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { DeadlineCountdown } from '../components/ui/DeadlineCountdown';
import { EmployeeProfileModal } from '../components/ui/EmployeeProfileModal';
import { mockBackend } from '../services/api';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  Users, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle2
} from 'lucide-react';

interface ProjectsPageProps {
  currentRole: Role;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  employees: Employee[];
  tasks?: TaskItem[];
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  currentRole,
  projects,
  setProjects,
  employees,
  tasks = []
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [selectedProfileEmp, setSelectedProfileEmp] = useState<Employee | null>(null);

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    startDate: '2026-08-01',
    deadline: '2026-12-31',
    priority: 'HIGH' as Priority,
    status: 'IN_PROGRESS' as ProjectStatus,
    budget: 2500000,
    assignedEmployeeIds: [] as number[]
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormState({
      name: '',
      description: '',
      startDate: '2026-08-01',
      deadline: '2026-12-31',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      budget: 2500000,
      assignedEmployeeIds: [1, 2]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Project) => {
    setEditingProject(p);
    setFormState({
      name: p.name,
      description: p.description,
      startDate: p.startDate,
      deadline: p.deadline,
      priority: p.priority,
      status: p.status,
      budget: p.budget,
      assignedEmployeeIds: p.assignedEmployeeIds
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await mockBackend.deleteProject(deleteTargetId);
      setProjects(prev => prev.filter(p => p.id !== deleteTargetId));
      showAlert('success', 'Project successfully deleted from portfolio.');
    } catch {
      showAlert('error', 'Failed to delete project.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const updated = await mockBackend.updateProject(editingProject.id, formState);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        showAlert('success', `Project "${updated.name}" updated successfully.`);
      } else {
        const created = await mockBackend.createProject(formState);
        setProjects(prev => [created, ...prev]);
        showAlert('success', `Project "${created.name}" created successfully.`);
      }
      setIsModalOpen(false);
    } catch {
      showAlert('error', 'An error occurred while saving project.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="page-title-icon text-emerald-600 dark:text-emerald-500" /> Corporate Project Portfolio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Oversee active software engineering projects, capital budgets, and staff allocations.
          </p>
        </div>

        {(currentRole === 'ADMIN' || currentRole === 'MANAGER') && (
          <Button
            variant="success"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Create New Project
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

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          title="No Projects in Portfolio"
          description="Create your first corporate project to begin tracking milestones and budgets."
          icon="folder"
          actionLabel="Create Project"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const assignedStaff = employees.filter((e) => proj.assignedEmployeeIds.includes(e.id));
            const projTasks = (tasks || []).filter((t) => t.projectId === proj.id);
            const completedTasks = projTasks.filter((t) => t.status === 'DONE').length;
            const totalTasks = projTasks.length;
            const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <Card key={proj.id} className="hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 flex flex-col justify-between">
                
                <CardHeader className="justify-center text-center">
                  <div className="w-full text-center truncate">{proj.name}</div>
                </CardHeader>

                <CardBody className="p-4 space-y-4 flex-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[40px]">
                    {proj.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-100/70 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-bold block">Allocated Budget</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹{proj.budget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-bold block">Current Status</span>
                      <Badge variant={proj.status === 'COMPLETED' ? 'green' : 'blue'} size="sm">
                        {proj.status}
                      </Badge>
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

                  {/* Dates & Live Countdown */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {proj.deadline}</span>
                    </div>
                    <DeadlineCountdown deadline={proj.deadline} />
                  </div>

                  {/* Assigned Staff Avatars (Hidden for EMPLOYEE) */}
                  {currentRole !== 'EMPLOYEE' && (
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Team ({assignedStaff.length})
                      </span>
                      <div className="flex -space-x-2">
                        {assignedStaff.map((staff) => (
                          <button
                            key={staff.id}
                            onClick={() => setSelectedProfileEmp(staff)}
                            className="relative group cursor-pointer transition-transform hover:scale-110 hover:z-10 focus:outline-none"
                            title={`Click to view ${staff.firstName} ${staff.lastName}'s dossier`}
                          >
                            <img
                              src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                              alt={staff.firstName}
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>

                {/* Bottom Footer Row: Priority Tag on Left & Action Buttons on Right */}
                <div className="px-4 py-3 bg-slate-100/60 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      proj.priority === 'URGENT'
                        ? 'red'
                        : proj.priority === 'HIGH'
                        ? 'yellow'
                        : 'blue'
                    }
                    size="sm"
                  >
                    {proj.priority}
                  </Badge>

                  {currentRole !== 'EMPLOYEE' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Edit className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenEditModal(proj)}
                      >
                        Edit
                      </Button>
                      {currentRole === 'ADMIN' && (
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() => setDeleteTargetId(proj.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? `Edit Project: ${editingProject.name}` : 'Create New Project Record'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Project Title"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g. Enterprise Cloud Integration"
            required
          />

          <FormTextarea
            label="Scope & Deliverables Description"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            placeholder="Describe project objectives and scope..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={formState.startDate}
              onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
              required
            />
            <FormInput
              label="Target Deadline"
              type="date"
              value={formState.deadline}
              onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Priority"
              value={formState.priority}
              onChange={(e) => setFormState({ ...formState, priority: e.target.value as Priority })}
              options={[
                { value: 'LOW', label: 'LOW' },
                { value: 'MEDIUM', label: 'MEDIUM' },
                { value: 'HIGH', label: 'HIGH' },
                { value: 'URGENT', label: 'URGENT' }
              ]}
            />

            <FormSelect
              label="Status"
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value as ProjectStatus })}
              options={[
                { value: 'PLANNING', label: 'PLANNING' },
                { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
                { value: 'COMPLETED', label: 'COMPLETED' },
                { value: 'ON_HOLD', label: 'ON HOLD' }
              ]}
            />

            <FormInput
              label="Budget ($ USD)"
              type="number"
              value={formState.budget}
              onChange={(e) => setFormState({ ...formState, budget: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="success" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {editingProject ? 'Update Project' : 'Save Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Project Deletion"
        message="Are you sure you want to delete this project from the enterprise portfolio?"
        confirmText="Delete Project"
        variant="danger"
      />

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
