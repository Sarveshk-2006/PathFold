import { getInitials, formatCurrency } from '@/utils';
import { demoStudent } from '@/data';
import { HelpCircle, Bell } from 'lucide-react';
import { MobileSidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/future-map': 'Future Map',
  '/pathways': 'Explore Paths',
  '/compare': 'Compare Pathways',
  '/finance': 'Finance Planner',
  '/what-if': 'What-If Scenarios',
  '/plan-bc': 'Plan B / C',
  '/decision': 'Decision Centre',
  '/profile': 'Your Profile',
};

interface TopBarProps {
  viewMode?: 'student' | 'parent';
  onViewModeChange?: (mode: 'student' | 'parent') => void;
}

export function TopBar({ viewMode = 'student', onViewModeChange }: TopBarProps) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'CareerPath';

  return (
    <header className="flex items-center gap-3 px-5 h-14 bg-white border-b border-neutral-200 sticky top-0 z-30">
      {/* Mobile menu */}
      <MobileSidebar viewMode={viewMode} onViewModeChange={onViewModeChange} />


      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-neutral-800 truncate">{pageTitle}</h1>
      </div>

      {/* Student metadata */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
        <span className="text-xs font-medium text-neutral-700">{demoStudent.name}</span>
        <span className="text-neutral-300">·</span>
        <span className="text-xs text-neutral-500">Class {demoStudent.class}</span>
        <span className="text-neutral-300">·</span>
        <span className="text-xs text-neutral-500">{demoStudent.overallPercentage}%</span>
        <span className="text-neutral-300">·</span>
        <span className="text-xs text-neutral-500">{formatCurrency(demoStudent.budgetINR, true)} budget</span>
      </div>

      {viewMode === 'parent' && (
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
          Parent View
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          id="topbar-help"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          title="Help"
          aria-label="Help"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
        <button
          id="topbar-notifications"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-navy-600" />
        </button>
        <div
          className="h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-white text-xs font-semibold ml-1 cursor-default"
          title={demoStudent.name}
        >
          {getInitials(demoStudent.name)}
        </div>
      </div>
    </header>
  );
}
