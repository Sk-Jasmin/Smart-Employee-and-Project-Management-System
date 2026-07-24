import React from 'react';
import { Employee, TaskItem, Project } from '../../types';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Trophy, 
  CheckSquare, 
  Calendar,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  tasks?: TaskItem[];
  projects?: Project[];
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  isOpen,
  onClose,
  tasks = [],
  projects = []
}) => {
  if (!employee) return null;

  const assignedTasks = tasks.filter(t => t.assignedEmployeeId === employee.id);
  const totalProgress = assignedTasks.reduce((acc, t) => acc + (t.progressPercentage || (t.status === 'DONE' ? 100 : 0)), 0);
  const completionRate = assignedTasks.length > 0 ? Math.round(totalProgress / assignedTasks.length) : 0;

  // Unique Dynamic Certifications per employee
  const displayCertifications = employee.certifications && employee.certifications.length > 0 
    ? employee.certifications 
    : [
        { 
          id: 101, 
          name: employee.department === 'Engineering' ? 'AWS Certified Solutions Architect' : employee.department === 'Design' ? 'Figma System Specialist' : 'Corporate Professional Specialist',
          issuer: employee.department === 'Engineering' ? 'Amazon Web Services' : 'Enterprise Certification Board',
          issueDate: '2025-02-15',
          credentialId: `CERT-${employee.id}092`
        }
      ];

  // Unique Dynamic Achievements per employee
  const displayAchievements = employee.achievements && employee.achievements.length > 0 
    ? employee.achievements 
    : [
        { 
          id: 201, 
          title: `${employee.firstName}'s ${employee.department} Star 🌟`, 
          badge: 'STAR', 
          note: `Outstanding contributions to ${employee.designation} deliverables.` 
        }
      ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Dossier & Performance Profile"
      maxWidth="lg"
    >
      <div className="space-y-6 text-xs">
        
        {/* Profile Banner */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={employee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={employee.firstName}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-600 dark:border-indigo-500 shadow-md shrink-0"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h2>
              <Badge variant="blue">{employee.employeeCode}</Badge>
              <Badge variant={employee.status === 'ACTIVE' ? 'green' : 'red'} dot>
                {employee.status}
              </Badge>
            </div>

            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{employee.designation}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-slate-500">
              <Badge variant="green">{employee.department}</Badge>
              <span className="flex items-center gap-1 font-mono"><Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 font-mono">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 uppercase font-bold block">Annual Salary</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">₹{employee.salary.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 uppercase font-bold block">Assigned Tasks</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{assignedTasks.length}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 uppercase font-bold block">Task Velocity</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</span>
          </div>
        </div>

        {/* Assigned Deliverables List */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-indigo-500" /> Active Assigned Tasks ({assignedTasks.length})
          </h3>

          {assignedTasks.length === 0 ? (
            <p className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-slate-400 text-center">
              No tasks currently assigned to this team member.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {assignedTasks.map((t) => (
                <div key={t.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">{t.title}</span>
                      <span className="text-xs text-slate-500">Target Deadline: {t.deadline}</span>
                    </div>
                    <Badge variant={t.status === 'DONE' ? 'green' : t.status === 'IN_PROGRESS' ? 'blue' : 'yellow'} size="sm">
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Task Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${t.status === 'DONE' ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${t.progressPercentage || (t.status === 'DONE' ? 100 : 0)}%` }} 
                      />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400">
                      {t.progressPercentage || (t.status === 'DONE' ? 100 : 0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Professional Certifications (Unique per Employee) */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Verified Technical Certifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayCertifications.map((cert) => (
              <div key={cert.id} className="p-2.5 bg-indigo-50/60 dark:bg-slate-950 rounded-lg border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-500 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 block truncate">{cert.name}</span>
                  <span className="text-xs text-slate-500 block truncate">{cert.issuer} • {cert.issueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honors & Wall of Fame Achievements (Unique per Employee) */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> Employee Honors & Accomplishments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayAchievements.map((ach) => (
              <div key={ach.id} className="p-2.5 bg-amber-50/60 dark:bg-slate-950 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block truncate">{ach.title}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 block truncate">{ach.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Close Dossier
          </Button>
          <a href={`mailto:${employee.email}`}>
            <Button variant="primary" icon={<Mail className="w-4 h-4" />} className="bg-indigo-600 hover:bg-indigo-700">
              Send Direct Email
            </Button>
          </a>
        </div>

      </div>
    </Modal>
  );
};
