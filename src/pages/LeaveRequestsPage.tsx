import React, { useState } from 'react';
import { Role, LeaveRequestItem, Employee, LeaveType } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormInput';
import { Table } from '../components/ui/Table';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { mockBackend } from '../services/api';
import { 
  Calendar, 
  Plus, 
  Check, 
  X,
  Clock,
  FileCheck,
  UserCheck,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface LeaveRequestsPageProps {
  currentRole: Role;
  leaves: LeaveRequestItem[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequestItem[]>>;
  employees: Employee[];
}

export const LeaveRequestsPage: React.FC<LeaveRequestsPageProps> = ({
  currentRole,
  leaves,
  setLeaves,
  employees
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
  const [selectedLeaveForWorkflow, setSelectedLeaveForWorkflow] = useState<LeaveRequestItem | null>(null);

  const [formState, setFormState] = useState({
    employeeId: 1,
    employeeName: 'Alex Morgan',
    leaveType: 'ANNUAL' as LeaveType,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    totalDays: 5,
    reason: 'Family summer vacation'
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const filteredLeaves = leaves.filter((l) =>
    statusFilter === 'ALL' ? true : l.status === statusFilter
  );

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await mockBackend.createLeaveRequest(formState);
      setLeaves(prev => [created, ...prev]);
      setIsApplyModalOpen(false);
      showAlert('success', 'Leave application submitted for manager workflow review.');
    } catch {
      showAlert('error', 'Failed to submit leave request.');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const updated = await mockBackend.updateLeaveStatus(id, 'APPROVED', currentRole, 'Approved by department lead.');
      setLeaves(prev => prev.map(l => l.id === id ? updated : l));
      showAlert('success', `Leave request #${id} approved successfully.`);
    } catch {
      showAlert('error', 'Failed to approve leave request.');
    }
  };

  const handleConfirmReject = async () => {
    if (rejectTargetId === null) return;
    try {
      const updated = await mockBackend.updateLeaveStatus(rejectTargetId, 'REJECTED', currentRole, 'Rejected due to project deliverable overlap.');
      setLeaves(prev => prev.map(l => l.id === rejectTargetId ? updated : l));
      showAlert('success', `Leave request #${rejectTargetId} rejected.`);
    } catch {
      showAlert('error', 'Failed to reject leave request.');
    } finally {
      setRejectTargetId(null);
    }
  };

  const columns = [
    {
      key: 'employeeName',
      header: 'Applicant',
      render: (l: LeaveRequestItem) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{l.employeeName}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Filed: {l.createdAt}</span>
        </div>
      )
    },
    {
      key: 'leaveType',
      header: 'Type',
      render: (l: LeaveRequestItem) => <Badge variant="blue">{l.leaveType}</Badge>
    },
    {
      key: 'dates',
      header: 'Duration',
      render: (l: LeaveRequestItem) => (
        <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
          {l.startDate} to {l.endDate} ({l.totalDays} days)
        </span>
      )
    },
    {
      key: 'workflow',
      header: 'Workflow Stage',
      render: (l: LeaveRequestItem) => (
        <button
          onClick={() => setSelectedLeaveForWorkflow(l)}
          className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
        >
          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>View Progress</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (l: LeaveRequestItem) => (
        <Badge
          variant={
            l.status === 'APPROVED'
              ? 'green'
              : l.status === 'PENDING'
              ? 'yellow'
              : 'red'
          }
          dot
        >
          {l.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Review Actions',
      align: 'center' as const,
      render: (l: LeaveRequestItem) => (
        <div className="flex items-center justify-center gap-1.5">
          {l.status === 'PENDING' && (currentRole === 'ADMIN' || currentRole === 'MANAGER') ? (
            <>
              <Button
                size="sm"
                variant="success"
                icon={<Check className="w-3.5 h-3.5" />}
                onClick={() => handleApprove(l.id)}
                className="bg-emerald-600 hover:bg-emerald-700 py-1 text-xs"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={<X className="w-3.5 h-3.5" />}
                onClick={() => setRejectTargetId(l.id)}
                className="bg-red-600 hover:bg-red-700 py-1 text-xs"
              >
                Reject
              </Button>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">
              {l.approvedBy ? `Reviewed by ${l.approvedBy}` : 'No actions pending'}
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="page-title-icon text-emerald-600 dark:text-emerald-500" /> Leave Management & Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-step leave approval engine, entitlement balance, and request tracking.
          </p>
        </div>

        <Button
          variant="success"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsApplyModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Apply for Leave
        </Button>
      </div>

      {/* Alert Banner */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onDismiss={() => setAlert(null)}
        />
      )}

      {/* Leave Entitlement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-600 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4">
            <span className="text-xs uppercase font-bold text-slate-500">Annual Leave</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">12 Days</span>
              <span className="text-xs text-slate-500">15 Total</span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4">
            <span className="text-xs uppercase font-bold text-slate-500">Sick Leave</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">10 Days</span>
              <span className="text-xs text-slate-500">10 Total</span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-600 hover:-translate-y-0.5 transition-transform duration-150">
          <CardBody className="p-4">
            <span className="text-xs uppercase font-bold text-slate-500">Casual Leave</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">6 Days</span>
              <span className="text-xs text-slate-500">7 Total</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded font-semibold cursor-pointer transition-colors duration-150 ${
              statusFilter === st
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          Submitted Leave Applications ({filteredLeaves.length})
        </CardHeader>
        <CardBody className="p-0">
          <Table
            columns={columns}
            data={filteredLeaves}
            keyExtractor={(item) => item.id}
            emptyMessage="No leave applications match the selected status filter."
          />
        </CardBody>
      </Card>

      {/* Workflow Progress Detail Modal */}
      {selectedLeaveForWorkflow && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLeaveForWorkflow(null)}
          title={`Leave Approval Workflow - Request #${selectedLeaveForWorkflow.id}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">{selectedLeaveForWorkflow.employeeName}</span>
                <span className="text-slate-500">{selectedLeaveForWorkflow.leaveType} • {selectedLeaveForWorkflow.totalDays} Days ({selectedLeaveForWorkflow.startDate} to {selectedLeaveForWorkflow.endDate})</span>
              </div>
              <Badge
                variant={
                  selectedLeaveForWorkflow.status === 'APPROVED'
                    ? 'green'
                    : selectedLeaveForWorkflow.status === 'PENDING'
                    ? 'yellow'
                    : 'red'
                }
              >
                {selectedLeaveForWorkflow.status}
              </Badge>
            </div>

            {/* Step-by-Step Approval Stepper */}
            <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              
              {/* Step 1 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Step 1: Application Submitted</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Filed by applicant on {selectedLeaveForWorkflow.createdAt}</p>
                  <p className="text-xs italic text-slate-600 dark:text-slate-300 mt-1 bg-slate-100 dark:bg-slate-800/40 p-2 rounded">
                    "{selectedLeaveForWorkflow.reason}"
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                  selectedLeaveForWorkflow.status === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : selectedLeaveForWorkflow.status === 'REJECTED'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}>
                  {selectedLeaveForWorkflow.status === 'APPROVED' ? <UserCheck className="w-4 h-4" /> : selectedLeaveForWorkflow.status === 'REJECTED' ? <X className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Step 2: Department Manager Review</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedLeaveForWorkflow.approvedBy ? `Reviewed by ${selectedLeaveForWorkflow.approvedBy}` : 'Pending department manager authorization'}
                  </p>
                  {selectedLeaveForWorkflow.adminRemarks && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Remarks: <em>{selectedLeaveForWorkflow.adminRemarks}</em>
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                  selectedLeaveForWorkflow.status === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Step 3: HR System Final Sign-off</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedLeaveForWorkflow.status === 'APPROVED' ? 'Automated leave quota deduction & calendar sync complete' : 'Awaiting Step 2 completion'}
                  </p>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedLeaveForWorkflow(null)}>Close Workflow</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Leave Application"
        maxWidth="md"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <FormSelect
            label="Leave Category"
            value={formState.leaveType}
            onChange={(e) => setFormState({ ...formState, leaveType: e.target.value as LeaveType })}
            options={[
              { value: 'ANNUAL', label: 'Annual Vacation Leave' },
              { value: 'SICK', label: 'Medical / Sick Leave' },
              { value: 'CASUAL', label: 'Casual Personal Leave' },
              { value: 'UNPAID', label: 'Unpaid Leave' }
            ]}
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
              label="End Date"
              type="date"
              value={formState.endDate}
              onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
              required
            />
          </div>

          <FormInput
            label="Total Calendar Days"
            type="number"
            value={formState.totalDays}
            onChange={(e) => setFormState({ ...formState, totalDays: Number(e.target.value) })}
            required
          />

          <FormTextarea
            label="Reason for Absence"
            value={formState.reason}
            onChange={(e) => setFormState({ ...formState, reason: e.target.value })}
            placeholder="Brief explanation for HR and Manager..."
            required
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button variant="success" type="submit" className="bg-emerald-600 hover:bg-emerald-700">Submit Application</Button>
          </div>
        </form>
      </Modal>

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={rejectTargetId !== null}
        onClose={() => setRejectTargetId(null)}
        onConfirm={handleConfirmReject}
        title="Confirm Leave Request Rejection"
        message="Are you sure you want to reject this employee leave application?"
        confirmText="Reject Application"
        variant="warning"
      />

    </div>
  );
};
