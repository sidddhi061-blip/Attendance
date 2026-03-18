import { useState, useEffect } from 'react';
import { CalendarCheck, ChevronRight } from 'lucide-react';
import { attendanceApi } from '../../api/attendance';
import { employeeApi } from '../../api/employees';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';
import type { AttendanceCreate, AttendanceStatus, Employee } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Half Day'];

/** Returns today's date as YYYY-MM-DD in the user's LOCAL timezone (not UTC). */
function localToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function MarkAttendanceModal({ open, onClose, onSuccess }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmps, setLoadingEmps] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const today = localToday();
  const [form, setForm] = useState<AttendanceCreate>({
    employee_id: 0,
    date: today,
    status: 'Present',
    note: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AttendanceCreate, string>>>({});

  useEffect(() => {
    if (!open) return;
    setLoadingEmps(true);
    employeeApi
      .getAll()
      .then(setEmployees)
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoadingEmps(false));
  }, [open]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.employee_id) errs.employee_id = 'Select an employee';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await attendanceApi.mark({
        ...form,
        note: form.note?.trim() || undefined,
      });
      const emp = employees.find((e) => e.id === form.employee_id);
      toast.success(`Attendance marked for ${emp?.full_name ?? 'employee'}`);
      onSuccess();
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setForm({ employee_id: 0, date: today, status: 'Present', note: '' });
      setErrors({});
      onClose();
    }
  };

  const set = <K extends keyof AttendanceCreate>(k: K, v: AttendanceCreate[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const statusColors: Record<AttendanceStatus, string> = {
    Present:    'border-emerald-400 bg-emerald-50 text-emerald-700',
    Absent:     'border-red-400    bg-red-50    text-red-700',
    Late:       'border-amber-400  bg-amber-50  text-amber-700',
    'Half Day': 'border-blue-400   bg-blue-50   text-blue-700',
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Mark Attendance"
      description="Record daily status"
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <div className="space-y-6">
          {/* Employee */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Select Employee</label>
            {loadingEmps ? (
              <div className="w-full px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-gray-400 font-bold">
                <LoadingSpinner size="sm" /> <span>Syncing records...</span>
              </div>
            ) : (
              <div className="relative group">
                <select
                  value={form.employee_id || ''}
                  onChange={(e) => set('employee_id', Number(e.target.value))}
                  className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl text-sm font-bold appearance-none outline-none transition-all
                    ${errors.employee_id 
                      ? 'border-rose-100 bg-rose-50 text-rose-900 focus:border-rose-300' 
                      : 'border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5'}`}
                >
                  <option value="">Choose an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            )}
            {errors.employee_id && <p className="text-xs font-bold text-rose-500 ml-1">{errors.employee_id}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Date of Entry</label>
            <input
              type="date"
              value={form.date}
              max={today}
              onChange={(e) => set('date', e.target.value)}
              className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl text-sm font-bold outline-none transition-all
                ${errors.date 
                  ? 'border-rose-100 bg-rose-50 text-rose-900 focus:border-rose-300' 
                  : 'border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5'}`}
            />
            {errors.date && <p className="text-xs font-bold text-rose-500 ml-1">{errors.date}</p>}
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Work Status</label>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`px-6 py-4 text-sm font-black rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-2
                    ${form.status === s
                      ? `${statusColors[s]} shadow-lg shadow-current/10 scale-[1.02]`
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-600'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${form.status === s ? 'bg-current animate-pulse' : 'bg-gray-300'}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Notes <span className="lowercase font-normal opacity-60">(Optional)</span></label>
            <textarea
              value={form.note ?? ''}
              onChange={(e) => set('note', e.target.value)}
              placeholder="Add any specific observations..."
              rows={3}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all resize-none"
              maxLength={300}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={handleClose} 
            disabled={submitting} 
            className="flex-1 px-8 py-4 rounded-2xl bg-gray-50 text-gray-500 font-black hover:bg-gray-100 transition-all active:scale-95"
          >
            Discard
          </button>
          <button 
            type="submit" 
            disabled={submitting || loadingEmps} 
            className="flex-[2] px-8 py-4 rounded-2xl bg-primary-600 text-white font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {submitting ? <LoadingSpinner size="sm" /> : <CalendarCheck size={20} />}
            Finalize Entry
          </button>
        </div>
      </form>
    </Modal>
  );
}
