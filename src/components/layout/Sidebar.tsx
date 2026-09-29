import { cn } from '@/utils';
import { getInitials } from '@/utils';
import { demoStudent } from '@/data';
import {
  LayoutDashboard,
  Map,
  GitBranch,
  BarChart2,
  DollarSign,
  FlaskConical,
  Shield,
  CheckSquare,
  ChevronRight,
  Users,
  BookOpen,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', id: 'nav-overview' },
  { to: '/future-map', icon: Map, label: 'Future Map', id: 'nav-future-map' },
  { to: '/pathways', icon: GitBranch, label: 'Explore Paths', id: 'nav-pathways' },
  { to: '/compare', icon: BarChart2, label: 'Compare', id: 'nav-compare' },
  { to: '/finance', icon: DollarSign, label: 'Finance', id: 'nav-finance' },
  { to: '/what-if', icon: FlaskConical, label: 'What-If', id: 'nav-whatif' },
  { to: '/plan-bc', icon: Shield, label: 'Plan B / C', id: 'nav-planbc' },
  { to: '/decision', icon: CheckSquare, label: 'Decision', id: 'nav-decision' },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  viewMode?: 'student' | 'parent';
  onViewModeChange?: (mode: 'student' | 'parent') => void;
}

export function Sidebar({
  collapsed = false,
  onCollapseToggle,
  viewMode = 'student',
  onViewModeChange,
}: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-neutral-200 h-full transition-all duration-200 ease-in-out overflow-hidden',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-4 py-5 border-b border-neutral-100', collapsed && 'px-3 justify-center')}>
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-navy-800 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-navy-900 tracking-tight">CareerPath</span>
            <span className="text-[10px] font-medium text-neutral-400 tracking-wide uppercase">Simulator</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                id={item.id}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-navy-50 text-navy-800 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
                  collapsed && 'justify-center px-0'
                )}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-[18px] w-[18px] transition-colors',
                    isActive ? 'text-navy-700' : 'text-neutral-400 group-hover:text-neutral-600'
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-navy-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-neutral-100 p-3 space-y-2">
        {/* View mode toggle */}
        {!collapsed && (
          <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg p-1 gap-1">
            <button
              id="view-toggle-student"
              onClick={() => onViewModeChange?.('student')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                viewMode === 'student'
                  ? 'bg-white text-navy-800 shadow-sm border border-neutral-200'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <BookOpen className="h-3 w-3" />
              Student
            </button>
            <button
              id="view-toggle-parent"
              onClick={() => onViewModeChange?.('parent')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                viewMode === 'parent'
                  ? 'bg-white text-navy-800 shadow-sm border border-neutral-200'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <Users className="h-3 w-3" />
              Parent
            </button>
          </div>
        )}

        {/* Student profile */}
        <NavLink
          to="/profile"
          id="nav-profile"
          className={cn(
            'flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors group',
            collapsed && 'justify-center'
          )}
        >
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(demoStudent.name)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">{demoStudent.name}</p>
              <p className="text-xs text-neutral-500">Class {demoStudent.class} · {demoStudent.board}</p>
            </div>
          )}
          {!collapsed && (
            <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          )}
        </NavLink>
      </div>

      {/* Collapse toggle */}
      {onCollapseToggle && (
        <button
          id="sidebar-collapse-toggle"
          onClick={onCollapseToggle}
          className={cn(
            'border-t border-neutral-100 py-2.5 w-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors text-xs gap-1.5',
          )}
        >
          <ChevronRight
            className={cn('h-4 w-4 transition-transform duration-200', !collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        id="mobile-menu-toggle"
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors"
        aria-label="Open navigation"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative flex flex-col w-72 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-navy-800 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-navy-900">CareerPath</span>
                  <span className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Simulator</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-3 overflow-y-auto">
              <div className="px-2 space-y-0.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'bg-navy-50 text-navy-800 font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      )}
                    >
                      <item.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-navy-700' : 'text-neutral-400')} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
