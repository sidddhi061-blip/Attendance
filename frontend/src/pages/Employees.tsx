import { useState, useEffect, useCallback } from 'react';
import { 
  Users, UserPlus, Search, Filter, 
  MoreVertical, Mail, Phone, Briefcase, 
  ChevronRight, Download, X, Trash2
} from 'lucide-react';
import { employeeApi } from '../api/employees';
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal';
import { LoadingPage } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import type { Employee } from '../types';
import toast from 'react-hot-toast';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await employeeApi.delete(id);
      toast.success(`${name} removed successfully`);
      load();
    } catch (err) {
      toast.error('Failed to delete employee');
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [emps, depts] = await Promise.all([
        employeeApi.getAll(searchTerm || undefined, deptFilter || undefined),
        employeeApi.getDepartments(),
      ]);
      setEmployees(emps);
      setDepartments(depts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, deptFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-8 page-enter">
      {/* Enhanced Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Workforce Hub</h2>
          <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <Users size={16} className="text-accent-500" />
            Managing {employees.length} active nodes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary flex items-center gap-2 px-5 py-3 rounded-2xl font-bold bg-white border-gray-100 hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export Data
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            <UserPlus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Modern Search & Filter Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center bg-white/50 backdrop-blur-sm border-gray-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by identity, ID, or sector..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-colors">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Dynamic Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="card p-6 group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white">
            {/* Design elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-accent-100 transition-colors" />
            
            <div className="relative space-y-6">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary-100 group-hover:scale-110 transition-transform">
                  {emp.full_name.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(emp.id, emp.full_name)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Employee"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">{emp.full_name}</h3>
                <p className="text-sm font-bold text-accent-600 mt-1 uppercase tracking-wider">{emp.department}</p>
                <p className="text-xs font-bold text-gray-400 mt-0.5">UID: {emp.employee_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network ID</p>
                  <p className="text-xs font-bold text-gray-700 truncate">{emp.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</p>
                  <p className="text-xs font-bold text-gray-700">{emp.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Briefcase size={14} />
                  </div>
                  <span className="text-xs font-black text-cyan-700 uppercase tracking-tighter">{emp.total_present_days} Cycles Active</span>
                </div>
                <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-accent-600 hover:text-white transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddEmployeeModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={load} 
      />
    </div>
  );
}
