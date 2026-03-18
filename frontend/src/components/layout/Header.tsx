import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':  { title: 'Dashboard',            subtitle: 'Overview of your HR operations' },
  '/employees':  { title: 'Employee Management',  subtitle: 'Add, view, and manage employee records' },
  '/attendance': { title: 'Attendance Tracking',  subtitle: 'Record and monitor daily attendance' },
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] ?? { title: 'HRMS Lite', subtitle: '' };
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 -ml-1"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-gray-900 truncate">{page.title}</h1>
        <p className="text-xs text-gray-400 hidden sm:block truncate">{page.subtitle}</p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <span className="hidden md:block text-xs text-gray-400">{today}</span>
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-600 rounded-full" />
        </button>
      </div>
    </header>
  );
}
