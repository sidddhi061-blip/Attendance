import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Building2,
  X,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/employees',  label: 'Employees',   icon: Users },
  { to: '/attendance', label: 'Attendance',  icon: CalendarCheck },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-primary-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-72 bg-white border-r border-primary-100
          flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-24 px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-accent-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 rotate-3 group-hover:rotate-0 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 tracking-tighter">Nexus<span className="text-primary-600">.</span></p>
              <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">Core OS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 mb-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            System Control
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group
                 ${isActive
                   ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 translate-x-1'
                   : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                  />
                  <span className="flex-1 tracking-tight">{label}</span>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(37,204,255,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-6 mt-auto">
          <div className="p-4 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center gap-4 group/user cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover/user:scale-105 transition-transform">
              <span className="text-lg font-black text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">System Admin</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Level 1 Access</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
