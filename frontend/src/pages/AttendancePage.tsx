import React, { useState } from 'react';
import { Role, AttendanceRecord, Employee, LeaveRequestItem } from '../types';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { QrCheckInModal } from '../components/ui/QrCheckInModal';
import { LeaveRequestsPage } from './LeaveRequestsPage';
import { mockBackend } from '../services/api';
import { 
  Clock, 
  LogOut, 
  UserCheck,
  QrCode,
  Calendar
} from 'lucide-react';

interface AttendancePageProps {
  currentRole: Role;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  employees: Employee[];
  leaves?: LeaveRequestItem[];
  setLeaves?: React.Dispatch<React.SetStateAction<LeaveRequestItem[]>>;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  currentRole,
  attendance,
  setAttendance,
  employees,
  leaves = [],
  setLeaves = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeAttendanceId, setActiveAttendanceId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleClockIn = async () => {
    try {
      const record = await mockBackend.recordCheckIn(1, 'Alex Morgan');
      setAttendance(prev => [record, ...prev]);
      setIsCheckedIn(true);
      setActiveAttendanceId(record.id);
      showAlert('success', 'Clock-In timestamp logged successfully at ' + record.checkIn);
    } catch {
      showAlert('error', 'Failed to log Clock-In timestamp.');
    }
  };

  const handleClockOut = async () => {
    if (!activeAttendanceId) return;
    try {
      const updated = await mockBackend.recordCheckOut(activeAttendanceId);
      setAttendance(prev => prev.map(a => a.id === updated.id ? updated : a));
      setIsCheckedIn(false);
      setActiveAttendanceId(null);
      showAlert('success', 'Clock-Out timestamp logged successfully at ' + updated.checkOut);
    } catch {
      showAlert('error', 'Failed to log Clock-Out timestamp.');
    }
  };

  const filteredAttendance = attendance.filter((a) => {
    const matchesSearch = a.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (a: AttendanceRecord) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{a.employeeName}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">ID: #{a.employeeId}</span>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (a: AttendanceRecord) => <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">{a.date}</span>
    },
    {
      key: 'checkIn',
      header: 'Check In Time',
      render: (a: AttendanceRecord) => <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">{a.checkIn}</span>
    },
    {
      key: 'checkOut',
      header: 'Check Out Time',
      render: (a: AttendanceRecord) => (
        <span className={`text-xs font-bold ${a.checkOut === 'In Progress' ? 'text-amber-600' : 'text-blue-700 dark:text-blue-400'}`}>
          {a.checkOut}
        </span>
      )
    },
    {
      key: 'workHours',
      header: 'Work Hours',
      render: (a: AttendanceRecord) => <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{a.workHours > 0 ? `${a.workHours} hrs` : '--'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: AttendanceRecord) => (
        <Badge
          variant={
            a.status === 'PRESENT'
              ? 'green'
              : a.status === 'LATE'
              ? 'yellow'
              : 'red'
          }
          dot
        >
          {a.status}
        </Badge>
      )
    },
    {
      key: 'remarks',
      header: 'Remarks',
      render: (a: AttendanceRecord) => <span className="text-xs text-slate-500 dark:text-slate-400">{a.remarks || 'None'}</span>
    }
  ];

  if (activeTab === 'leaves') {
    return (
      <div className="space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Attendance Log</span>
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-xs transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Leave Requests</span>
            {pendingCount > 0 && (
              <span className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        <LeaveRequestsPage
          currentRole={currentRole}
          leaves={leaves}
          setLeaves={setLeaves}
          employees={employees}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('attendance')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-xs transition-all cursor-pointer"
        >
          <Clock className="w-4 h-4 text-white" />
          <span>Attendance Log</span>
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Leave Requests</span>
          {pendingCount > 0 && (
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="page-title-icon text-blue-700 dark:text-blue-500" /> Attendance & Leaves
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor daily check-ins, check-outs, work hour tallies, and leave requests.
          </p>
        </div>

        {/* Live Clock In / Clock Out Card + QR Button */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<QrCode className="w-4 h-4 text-emerald-600" />}
            onClick={() => setIsQrModalOpen(true)}
            className="text-xs border-emerald-600/40 text-emerald-700 dark:text-emerald-300"
          >
            Digital QR Pass
          </Button>

          <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="text-xs">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Shift Clock</span>
              <span className="font-bold text-emerald-400">{isCheckedIn ? 'Status: Active Shift' : 'Status: Off Clock'}</span>
            </div>
            {isCheckedIn ? (
              <Button
                variant="danger"
                size="sm"
                icon={<LogOut className="w-4 h-4" />}
                onClick={handleClockOut}
                className="bg-red-600 hover:bg-red-700"
              >
                Clock Out
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                icon={<UserCheck className="w-4 h-4" />}
                onClick={handleClockIn}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Clock In Now
              </Button>
            )}
          </div>
        </div>
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
        <CardBody className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search employee attendance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-150"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            {['ALL', 'PRESENT', 'LATE', 'ABSENT'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded font-semibold cursor-pointer transition-colors duration-150 ${
                  statusFilter === st
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Main Attendance Table */}
      <Card>
        <CardHeader>
          Daily Attendance Ledger ({filteredAttendance.length} records)
        </CardHeader>
        <CardBody className="p-0">
          <Table
            columns={columns}
            data={filteredAttendance}
            keyExtractor={(item) => item.id}
            emptyMessage="No attendance logs found matching search or filter criteria."
          />
        </CardBody>
      </Card>

      {/* QR Check-In Modal */}
      <QrCheckInModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onCheckInSuccess={() => {
          handleClockIn();
          setIsQrModalOpen(false);
        }}
      />

    </div>
  );
};
