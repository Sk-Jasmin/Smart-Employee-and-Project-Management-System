import React, { useState } from 'react';
import { Employee, Role } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  UserCheck, 
  Cake,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EmployeeViewProps {
  currentRole: Role;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({
  currentRole,
  employees,
  setEmployees
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const filteredEmployees = employees.filter(emp => {
    const matchesQuery = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

    return matchesQuery && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Modal Form State
  const [formState, setFormState] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    salary: 95000,
    dateOfBirth: '1995-05-15',
    joiningDate: '2023-01-10',
    address: '456 Tech Park, San Francisco, CA',
    status: 'ACTIVE'
  });

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmp) {
      setEmployees(prev => prev.map(item => item.id === editingEmp.id ? { ...item, ...formState } as Employee : item));
    } else {
      const newEmp: Employee = {
        id: Date.now(),
        employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        firstName: formState.firstName || 'New',
        lastName: formState.lastName || 'Employee',
        email: formState.email || 'new.user@smartcorp.com',
        phone: formState.phone || '+1 (555) 000-0000',
        department: formState.department || 'Engineering',
        designation: formState.designation || 'Software Engineer',
        salary: formState.salary || 85000,
        dateOfBirth: formState.dateOfBirth || '1995-01-01',
        joiningDate: formState.joiningDate || '2024-01-01',
        address: formState.address || 'Address info',
        status: (formState.status as any) || 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      setEmployees(prev => [newEmp, ...prev]);
    }
    setShowAddModal(false);
    setEditingEmp(null);
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm('Are you sure you want to remove this employee record?')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Employee Management Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search, filter, and manage staff records with Spring Data JPA pagination</p>
        </div>

        {currentRole === 'ADMIN' && (
          <button
            onClick={() => {
              setEditingEmp(null);
              setFormState({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                department: 'Engineering',
                designation: 'Backend Developer',
                salary: 95000,
                dateOfBirth: '1995-06-20',
                joiningDate: '2023-05-01',
                address: 'San Francisco, CA',
                status: 'ACTIVE'
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Employee
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or employee code..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">Employee Name</th>
                <th className="px-4 py-3.5">Department & Role</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Salary</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No employee records match the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {emp.employeeCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.firstName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{emp.firstName} {emp.lastName}</span>
                          <span className="text-xs text-slate-400">DOB: {emp.dateOfBirth}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">{emp.designation}</div>
                      <div className="text-xs text-slate-400">{emp.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-700 dark:text-slate-300">{emp.email}</div>
                      <div className="text-xs text-slate-400">{emp.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      ${emp.salary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        emp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        emp.status === 'ON_LEAVE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingEmp(emp);
                          setFormState(emp);
                          setShowAddModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        title="Edit Employee"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {currentRole === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing page {currentPage} of {totalPages} ({filteredEmployees.length} total records)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingEmp ? 'Edit Employee Details' : 'Add New Employee Record'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formState.firstName || ''}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formState.lastName || ''}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formState.email || ''}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formState.department || ''}
                    onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formState.designation || ''}
                    onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Annual Salary ($)</label>
                  <input
                    type="number"
                    value={formState.salary || 0}
                    onChange={(e) => setFormState({ ...formState, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={formState.status || 'ACTIVE'}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
