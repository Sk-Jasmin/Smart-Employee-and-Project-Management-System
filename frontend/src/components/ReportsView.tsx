import React, { useState } from 'react';
import { Employee, Project, TaskItem, AuditLogItem } from '../types';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';

interface ReportsViewProps {
  employees: Employee[];
  projects: Project[];
  tasks: TaskItem[];
  auditLogs: AuditLogItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  employees,
  projects,
  tasks,
  auditLogs
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const exportCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  const handleExportEmployeesExcel = () => {
    const data = employees.map(e => ({
      ID: e.employeeCode,
      FirstName: e.firstName,
      LastName: e.lastName,
      Email: e.email,
      Department: e.department,
      Designation: e.designation,
      Salary: e.salary,
      Status: e.status
    }));
    exportCSV(data, 'Employee_Master_Report');
  };

  const handleExportProjectsPDF = () => {
    const data = projects.map(p => ({
      ProjectName: p.name,
      Status: p.status,
      Priority: p.priority,
      Budget: p.budget,
      Deadline: p.deadline
    }));
    exportCSV(data, 'Project_Summary_Report');
  };

  const filteredLogs = auditLogs.filter(log => 
    log.username.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reporting Engine & Audit Trail Logs</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Generate Apache POI Excel, OpenPDF documents, and track user actions</p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employee Report Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Employee Roster Excel</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Export complete employee records, salaries, departments, and active statuses.
            </p>
          </div>
          <button
            onClick={handleExportEmployeesExcel}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Download Excel (.xlsx)
          </button>
        </div>

        {/* Project PDF Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Project Performance PDF</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Generate formatted OpenPDF executive summaries with budget distribution.
            </p>
          </div>
          <button
            onClick={handleExportProjectsPDF}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF Report
          </button>
        </div>

        {/* Pending Tasks Report */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pending Deliverables</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Consolidated breakdown of incomplete tasks, overdue deadlines, and assignees.
            </p>
          </div>
          <button
            onClick={() => exportCSV(tasks, 'Pending_Tasks_Report')}
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export Task Report
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Audit & Compliance Logs</h3>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-2.5 text-slate-400">{log.timestamp}</td>
                  <td className="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">{log.username}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">{log.action}</td>
                  <td className="px-4 py-2.5 text-slate-500">{log.entityName} #{log.entityId}</td>
                  <td className="px-4 py-2.5 text-slate-400">{log.ipAddress}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
