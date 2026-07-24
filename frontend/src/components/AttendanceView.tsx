import React, { useState } from 'react';
import { AttendanceRecord, LeaveRequestItem, Employee, Role } from '../types';
import { 
  Clock, 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  UserCheck, 
  Check, 
  X 
} from 'lucide-react';

interface AttendanceViewProps {
  currentRole: Role;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  leaves: LeaveRequestItem[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequestItem[]>>;
  employees: Employee[];
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentRole,
  attendance,
  setAttendance,
  leaves,
  setLeaves,
  employees
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // New leave form
  const [leaveForm, setLeaveForm] = useState<Partial<LeaveRequestItem>>({
    leaveType: 'ANNUAL',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    reason: 'Personal leave request'
  });

  const handleCheckInToggle = () => {
    if (!isCheckedIn) {
      const newRecord: AttendanceRecord = {
        id: Date.now(),
        employeeId: 1,
        employeeName: 'Alex Morgan',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut: 'In Progress',
        status: 'PRESENT',
        workHours: 0,
        remarks: 'Clocked in via Web Portal'
      };
      setAttendance(prev => [newRecord, ...prev]);
      setIsCheckedIn(true);
    } else {
      setAttendance(prev => prev.map(a => a.employeeId === 1 ? { ...a, checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), workHours: 8.0 } : a));
      setIsCheckedIn(false);
    }
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: LeaveRequestItem = {
      id: Date.now(),
      employeeId: 1,
      employeeName: 'Alex Morgan',
      leaveType: leaveForm.leaveType || 'ANNUAL',
      startDate: leaveForm.startDate || '2026-08-10',
      endDate: leaveForm.endDate || '2026-08-14',
      totalDays: 5,
      reason: leaveForm.reason || 'Family vacation',
      status: 'PENDING',
      createdAt: new Date().toLocaleString()
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowLeaveModal(false);
  };

  const handleLeaveStatus = (leaveId: number, status: 'APPROVED' | 'REJECTED') => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status, approvedBy: 'Admin' } : l));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Logs & Leave Workflow</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Clock-in/out tracking, work hours calculation, and leave request management</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckInToggle}
            className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 ${
              isCheckedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isCheckedIn ? 'Clock Out Now' : 'Quick Check In'}
          </button>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Apply Leave
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 transition-all ${
            activeTab === 'attendance'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Daily Attendance Sheet ({attendance.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`pb-3 transition-all ${
            activeTab === 'leaves'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Leave Applications ({leaves.length})
        </button>
      </div>

      {activeTab === 'attendance' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Employee Name</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Check In</th>
                  <th className="px-4 py-3.5">Check Out</th>
                  <th className="px-4 py-3.5">Work Hours</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendance.map((rec) => {
                  const empName = rec.employeeName || employees.find(e => e.id === rec.employeeId)?.firstName + ' ' + (employees.find(e => e.id === rec.employeeId)?.lastName || '') || `Employee #${rec.employeeId}`;
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{empName}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{rec.date}</td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{rec.checkIn}</td>
                      <td className="px-4 py-3 font-medium text-rose-600 dark:text-rose-400">{rec.checkOut}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{rec.workHours || 8} hrs</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        rec.status === 'LATE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{rec.remarks || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Dates & Total</th>
                  <th className="px-4 py-3.5">Reason</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{l.employeeName}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">{l.leaveType}</td>
                    <td className="px-4 py-3">
                      <div>{l.startDate} &rarr; {l.endDate}</div>
                      <div className="text-[10px] text-slate-400">{l.totalDays} Days</div>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-slate-500">{l.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        l.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {l.status === 'PENDING' && (currentRole === 'ADMIN' || currentRole === 'MANAGER') ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleLeaveStatus(l.id, 'APPROVED')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                            title="Approve Leave"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleLeaveStatus(l.id, 'REJECTED')}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300"
                            title="Reject Leave"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">{l.approvedBy ? `By ${l.approvedBy}` : 'Processed'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Leave Application</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="MATERNITY">Maternity / Paternity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
