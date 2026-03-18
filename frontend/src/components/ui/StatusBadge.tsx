import type { AttendanceStatus } from '../../types';

interface StatusBadgeProps {
  status: AttendanceStatus;
}

const config: Record<AttendanceStatus, { label: string; className: string }> = {
  Present:  { label: 'Authorized',  className: 'px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-600 font-black text-[10px] uppercase tracking-wider border border-cyan-100 shadow-sm shadow-cyan-50' },
  Absent:   { label: 'Incomplete',   className: 'px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-wider border border-rose-100 shadow-sm shadow-rose-50' },
  Late:     { label: 'Delayed',     className: 'px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 font-black text-[10px] uppercase tracking-wider border border-amber-100 shadow-sm shadow-amber-50' },
  'Half Day': { label: 'Partial', className: 'px-3 py-1.5 rounded-xl bg-primary-50 text-primary-600 font-black text-[10px] uppercase tracking-wider border border-primary-100 shadow-sm shadow-primary-50' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status] ?? { label: status, className: 'px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 font-black text-[10px] uppercase tracking-wider' };
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </span>
  );
}
