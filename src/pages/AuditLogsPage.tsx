import React, { useState } from 'react';
import { AuditLogItem } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Eye, 
  Terminal, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Filter
} from 'lucide-react';

interface AuditLogsPageProps {
  auditLogs: AuditLogItem[];
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' ? true : log.action.startsWith(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportLogs = () => {
    const headers = ['ID', 'Action', 'Performed By', 'Timestamp', 'IP Address', 'Status', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.action}"`,
      `"${l.performedBy}"`,
      `"${l.timestamp}"`,
      l.ipAddress,
      'SUCCESS',
      `"${l.details}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smartcorp_audit_trail_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: AuditLogItem) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          {log.timestamp}
        </span>
      )
    },
    {
      key: 'action',
      header: 'Event Action',
      render: (log: AuditLogItem) => (
        <Badge variant={log.action.includes('SECURITY') || log.action.includes('DELETE') ? 'red' : 'indigo'}>
          {log.action}
        </Badge>
      )
    },
    {
      key: 'performedBy',
      header: 'Performed By',
      render: (log: AuditLogItem) => (
        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {log.performedBy}
        </span>
      )
    },
    {
      key: 'ipAddress',
      header: 'Client IP',
      render: (log: AuditLogItem) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{log.ipAddress}</span>
      )
    },
    {
      key: 'details',
      header: 'Audit Description',
      render: (log: AuditLogItem) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-xs block">{log.details}</span>
      )
    },
    {
      key: 'actions',
      header: 'Inspect',
      render: (log: AuditLogItem) => (
        <Button
          size="sm"
          variant="outline"
          icon={<Eye className="w-3.5 h-3.5" />}
          onClick={() => setSelectedLog(log)}
          className="text-xs py-1 px-2"
        >
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="page-title-icon text-indigo-600 dark:text-indigo-400" /> Enterprise Audit Logs & Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Security audit trail, authentication logs, database mutations, and administrative compliance records.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportLogs}
          className="bg-indigo-600 hover:bg-indigo-700 text-xs"
        >
          Export Audit Trail (CSV)
        </Button>
      </div>

      {/* Audit Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-indigo-600">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500">Total Recorded Events</span>
              <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{auditLogs.length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 border dark:border-indigo-900/60 rounded-lg">
              <Terminal className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500">Authentication Success</span>
              <h3 className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">100%</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-300 border dark:border-emerald-900/60 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500">Security Events</span>
              <h3 className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-300 mt-1">
                {auditLogs.filter(l => l.action.includes('SECURITY') || l.action.includes('LOGIN')).length}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-slate-950 text-amber-600 dark:text-amber-300 border dark:border-amber-900/60 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card>
        <CardBody className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
              >
                <option value="ALL">All Categories</option>
                <option value="EMPLOYEE">Employee Actions</option>
                <option value="PROJECT">Project Actions</option>
                <option value="TASK">Task Actions</option>
                <option value="SECURITY">Security / Auth</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            Showing <strong>{filteredLogs.length}</strong> of <strong>{auditLogs.length}</strong> events
          </span>
        </CardBody>
      </Card>

      {/* Main Audit Log Table */}
      <Card>
        <CardBody className="p-0">
          <Table
            columns={columns}
            data={paginatedLogs}
            keyExtractor={(log) => log.id}
          />
        </CardBody>
      </Card>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredLogs.length / pageSize) || 1}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={filteredLogs.length}
      />

      {/* Audit Log Detail Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="Audit Log Detail Inspector"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 uppercase font-bold block text-xs">Log Event ID</span>
                <span className="font-bold text-slate-900 dark:text-white">#{selectedLog.id}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block text-xs">Action Category</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block text-xs">Timestamp</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedLog.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold block text-xs">Origin IP</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedLog.ipAddress}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 uppercase font-bold block text-xs">Performed By</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.performedBy}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Event Narrative</span>
              <p className="p-3 bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedLog.details}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-mono">Raw Event Payload (JSON)</span>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded border border-slate-800 font-mono text-xs overflow-x-auto">
{JSON.stringify({
  id: selectedLog.id,
  action: selectedLog.action,
  performedBy: selectedLog.performedBy,
  ipAddress: selectedLog.ipAddress,
  timestamp: selectedLog.timestamp,
  details: selectedLog.details,
  status: "SUCCESS",
  environment: "PRODUCTION"
}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
