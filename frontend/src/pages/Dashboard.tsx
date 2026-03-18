import { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, XCircle, Clock, Building2,
  RefreshCw, TrendingUp, CalendarDays, ArrowRight,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { LoadingPage } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import type { DashboardStats } from '../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, trend }: StatCardProps) {
  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
        <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
        {trend && <p className="text-xs text-emerald-600 font-semibold mt-1">{trend}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingPage />;
  if (error || !stats) return <ErrorState message={error || 'Failed to load dashboard'} onRetry={load} />;

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-8 page-enter">
      {/* Greeting banner - Ultra Modern Ocean Indigo */}
      <div className="card p-10 bg-gradient-to-br from-primary-800 via-primary-700 to-accent-600 text-white border-0 overflow-hidden relative group">
        {/* Animated Background Elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-accent-400/30 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-accent-300 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Analytics</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              Welcome back, <br/>
              <span className="text-accent-300">Operations Control</span> 🚀
            </h2>
            <p className="text-primary-100 font-medium opacity-80 flex items-center gap-2">
              <CalendarDays size={16} /> {today}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative group/rate overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-transparent opacity-0 group-hover/rate:opacity-100 transition-opacity" />
              <p className="relative text-5xl font-black tracking-tighter">{stats.attendance_rate_today}%</p>
              <p className="relative text-[10px] font-black text-primary-100 uppercase tracking-[0.3em] mt-2">Active Ratio</p>
            </div>
            <button
              onClick={load}
              className="w-14 h-14 rounded-full bg-white text-primary-700 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
              title="Sync Dashboard"
            >
              <RefreshCw size={24} className="group-hover/btn:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
        
        {/* Modern Progress Visualization */}
        <div className="mt-12 relative max-w-2xl">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-100">Workforce Utilization</span>
            <span className="text-lg font-black">{stats.present_today} <span className="text-sm font-medium opacity-60">/ {stats.total_employees}</span></span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 p-1">
            <div
              className="h-full bg-gradient-to-r from-accent-400 to-accent-300 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_20px_rgba(37,204,255,0.4)]"
              style={{ width: `${stats.attendance_rate_today}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" 
                   style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Glassmorphism style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Active Personnel"
          value={stats.total_employees}
          icon={Users}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={`${stats.total_departments} Departments`}
        />
        <StatCard
          label="Current Presence"
          value={stats.present_today}
          icon={CheckCircle2}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
        />
        <StatCard
          label="Absence Rate"
          value={stats.absent_today}
          icon={XCircle}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
        <StatCard
          label="Delayed Entry"
          value={stats.late_today}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          trend="Monitor closely"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent employees - Takes up 7 cols */}
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-gray-900 text-lg tracking-tight">Recent Employees</h3>
              <p className="text-xs text-gray-500 font-medium">Recently added members</p>
            </div>
            <Link to="/employees" className="btn btn-ghost btn-sm text-primary-600 group">
              View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          {stats.recent_employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users size={48} className="mb-3 opacity-20" />
              <p className="text-sm">No employees registered yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats.recent_employees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-100 hover:bg-primary-50/30 transition-all duration-200 group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm font-black text-primary-700">{emp.full_name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{emp.full_name}</p>
                    <p className="text-[11px] font-medium text-gray-500">{emp.department} · {emp.employee_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">{emp.total_present_days}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Days</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions - Takes up 5 cols */}
        <div className="card p-6 lg:col-span-5">
          <div className="mb-6">
            <h3 className="font-black text-gray-900 text-lg tracking-tight">Quick Actions</h3>
            <p className="text-xs text-gray-500 font-medium">Common tasks and shortcuts</p>
          </div>
          
          <div className="space-y-3">
            <Link
              to="/employees"
              className="flex items-center gap-4 p-4 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-all duration-200 group border border-transparent hover:border-primary-200"
            >
              <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
                <Users size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-primary-900">Manage Workforce</p>
                <p className="text-xs text-primary-600 font-medium">Employee records and profiles</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-400 group-hover:text-primary-600 transition-colors">
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link
              to="/attendance"
              className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all duration-200 group border border-transparent hover:border-emerald-200"
            >
              <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <CalendarDays size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-emerald-900">Mark Attendance</p>
                <p className="text-xs text-emerald-600 font-medium">Daily check-in/out records</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-400 group-hover:text-emerald-600 transition-colors">
                <ArrowRight size={16} />
              </div>
            </Link>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{stats.total_departments} Departments</p>
                  <p className="text-xs text-gray-400">Across the organization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <TrendingUp size={13} className="text-emerald-500" />
              <span>
                <span className="text-gray-600 font-medium">{stats.attendance_this_week} records</span> this week
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
