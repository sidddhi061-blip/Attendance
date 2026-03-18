import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Search, Filter, CheckCircle2, 
  Clock, XCircle, AlertCircle, ChevronRight,
  CalendarCheck, UserCheck, LayoutGrid, List
} from 'lucide-react';
import { attendanceApi } from '../api/attendance';
import { MarkAttendanceModal } from '../components/attendance/MarkAttendanceModal';
import { LoadingPage } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { Attendance as AttendanceRecord, AttendanceStatus } from '../types';
import { format } from 'date-fns';

const STATUS_OPTIONS: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Half Day'];

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await attendanceApi.getAll({ date_from: dateFilter, date_to: dateFilter });
      setRecords(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => { load(); }, [load]);

  const filteredRecords = records.filter(rec => 
    (rec.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     rec.employee_code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === '' || rec.status === statusFilter)
  );

  const stats = {
    present: records.filter(r => r.status === 'Present').length,
    late: records.filter(r => r.status === 'Late').length,
    absent: records.filter(r => r.status === 'Absent').length,
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-8 page-enter">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Access Control Logs</h2>
          <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <Calendar size={16} className="text-accent-500" />
            Monitoring session data for {format(new Date(dateFilter), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <button 
          onClick={() => setIsMarkModalOpen(true)}
          className="btn btn-primary flex items-center gap-2 px-8 py-4 rounded-[2rem] font-black shadow-xl shadow-primary-200 bg-primary-600 text-white hover:bg-primary-700 transition-all hover:scale-105"
        >
          <UserCheck size={20} />
          Manual Entry
        </button>
      </div>

      {/* Modern Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 bg-cyan-50 border-cyan-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-200">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-cyan-900">{stats.present}</p>
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Authorized</p>
          </div>
        </div>
        <div className="card p-6 bg-amber-50 border-amber-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-900">{stats.late}</p>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Delayed</p>
          </div>
        </div>
        <div className="card p-6 bg-rose-50 border-rose-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-rose-900">{stats.absent}</p>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Incomplete</p>
          </div>
        </div>
      </div>

      {/* Advanced Control Bar */}
      <div className="card p-4 bg-white/50 backdrop-blur-sm border-gray-100 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search system logs..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="date" 
            className="px-6 py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-colors border-none outline-none cursor-pointer"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <select
            className="px-6 py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-colors border-none outline-none appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter Status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* High-End Log Table */}
      <div className="card overflow-hidden border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Node Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Authorization</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="group hover:bg-accent-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-sm font-black text-primary-700">
                          {rec.employee_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{rec.employee_name}</p>
                          <p className="text-[10px] font-bold text-gray-400">UID: {rec.employee_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        {rec.created_at ? format(new Date(rec.created_at), 'hh:mm a') : '--:--'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={rec.status} />
                    </td>
                    <td className="px-8 py-6">
                      <button className="p-2 text-gray-400 hover:text-accent-600 transition-colors">
                        <AlertCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                        <CalendarCheck size={32} />
                      </div>
                      <p className="text-sm font-bold text-gray-400">No session logs found for current filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MarkAttendanceModal 
        open={isMarkModalOpen} 
        onClose={() => setIsMarkModalOpen(false)} 
        onSuccess={load} 
      />
    </div>
  );
}
