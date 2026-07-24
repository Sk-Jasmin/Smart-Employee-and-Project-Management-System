import React, { useState } from 'react';
import { Role, Employee } from '../types';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect } from '../components/ui/FormInput';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmployeeProfileModal } from '../components/ui/EmployeeProfileModal';
import { mockBackend } from '../services/api';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter 
} from 'lucide-react';

interface EmployeesPageProps {
  currentRole: Role;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  tasks?: TaskItem[];
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({
  currentRole,
  employees,
  setEmployees,
  tasks = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'employeeCode' | 'department' | 'designation' | 'salary' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedProfileEmp, setSelectedProfileEmp] = useState<Employee | null>(null);
  
  // Alert feedback
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Confirm Dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleSort = (field: 'name' | 'employeeCode' | 'department' | 'designation' | 'salary' | 'status') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    designation: 'Java Specialist',
    salary: 1850000,
    status: 'ACTIVE' as const
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormState({
      firstName: '',
      lastName: '',
      email: '',
      department: 'Engineering',
      designation: 'Java Specialist',
      salary: 1850000,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormState({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      salary: emp.salary,
      status: emp.status
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await mockBackend.deleteEmployee(deleteTargetId);
      setEmployees(prev => prev.filter(e => e.id !== deleteTargetId));
      showAlert('success', 'Employee record terminated/deleted successfully.');
    } catch {
      showAlert('error', 'Failed to delete employee record.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const updated = await mockBackend.updateEmployee(editingEmployee.id, formState);
        setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
        showAlert('success', `Employee record for ${updated.firstName} ${updated.lastName} updated.`);
      } else {
        const created = await mockBackend.createEmployee(formState);
        setEmployees(prev => [created, ...prev]);
        showAlert('success', `New employee ${created.firstName} ${created.lastName} registered successfully.`);
      }
      setIsModalOpen(false);
    } catch {
      showAlert('error', 'An error occurred while saving employee record.');
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Employee];
    let bVal: any = b[sortBy as keyof Employee];

    if (sortBy === 'name') {
      aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
      bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      key: 'employeeCode',
      header: 'Emp Code',
      render: (emp: Employee) => <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{emp.employeeCode}</span>
    },
    {
      key: 'name',
      header: 'Employee Name',
      render: (emp: Employee) => (
        <button 
          onClick={() => setSelectedProfileEmp(emp)}
          className="flex items-center gap-3 text-left group cursor-pointer"
          title="Click to view full employee dossier"
        >
          <img
            src={emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={emp.firstName}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0 group-hover:ring-2 group-hover:ring-indigo-500 transition-all"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {emp.firstName} {emp.lastName}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{emp.email}</span>
          </div>
        </button>
      )
    },
    {
      key: 'department',
      header: 'Department',
      render: (emp: Employee) => <Badge variant="blue">{emp.department}</Badge>
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (emp: Employee) => <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{emp.designation}</span>
    },
    {
      key: 'salary',
      header: 'Compensation',
      render: (emp: Employee) => (
        <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
          ₹{emp.salary.toLocaleString()}/yr
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (emp: Employee) => (
        <Badge
          variant={
            emp.status === 'ACTIVE'
              ? 'green'
              : emp.status === 'ON_LEAVE'
              ? 'yellow'
              : 'red'
          }
          dot
        >
          {emp.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center' as const,
      render: (emp: Employee) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => handleOpenEditModal(emp)}
            title="Edit Employee"
          />
          {currentRole === 'ADMIN' && (
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
              onClick={() => setDeleteTargetId(emp.id)}
              title="Delete Record"
            />
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
            <Users className="page-title-icon text-blue-700 dark:text-blue-500" /> Employee Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage employee master records, roles, departments, and payroll details.
          </p>
        </div>

        {currentRole === 'ADMIN' && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
            className="bg-blue-700 hover:bg-blue-800"
          >
            Add New Employee
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

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or employee code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-150"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-150"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Table Container */}
      <Card>
        <CardHeader>
          Employee Roster ({filteredEmployees.length} total)
        </CardHeader>
        <CardBody className="p-0">
          <Table
            columns={columns}
            data={paginatedEmployees}
            keyExtractor={(item) => item.id}
            emptyMessage="No employees found matching search or department filter."
          />

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredEmployees.length / pageSize) || 1}
              onPageChange={(p) => setCurrentPage(p)}
              totalItems={filteredEmployees.length}
              pageSize={pageSize}
              onPageSizeChange={(sz) => setPageSize(sz)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? `Edit Employee #${editingEmployee.employeeCode}` : 'Register New Employee'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              value={formState.firstName}
              onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
              placeholder="e.g. Alex"
              required
            />
            <FormInput
              label="Last Name"
              value={formState.lastName}
              onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
              placeholder="e.g. Morgan"
              required
            />
          </div>

          <FormInput
            label="Corporate Email Address"
            type="email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            placeholder="e.g. alex.morgan@smartcorp.com"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Department"
              value={formState.department}
              onChange={(e) => setFormState({ ...formState, department: e.target.value })}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Product', label: 'Product' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Sales & Marketing', label: 'Sales & Marketing' }
              ]}
            />

            <FormInput
              label="Designation / Job Title"
              value={formState.designation}
              onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
              placeholder="e.g. Senior Software Developer"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Annual Salary ($ USD)"
              type="number"
              value={formState.salary}
              onChange={(e) => setFormState({ ...formState, salary: Number(e.target.value) })}
              required
            />

            <FormSelect
              label="Employment Status"
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'ON_LEAVE', label: 'ON LEAVE' },
                { value: 'TERMINATED', label: 'TERMINATED' }
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="bg-blue-700 hover:bg-blue-800">
              {editingEmployee ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Employee Termination / Deletion"
        message="Are you sure you want to permanently remove this employee record from the system database?"
        confirmText="Delete Record"
        variant="danger"
      />

      {/* Employee Profile Dossier Modal */}
      <EmployeeProfileModal
        employee={selectedProfileEmp}
        isOpen={!!selectedProfileEmp}
        onClose={() => setSelectedProfileEmp(null)}
        tasks={tasks}
      />

    </div>
  );
};
