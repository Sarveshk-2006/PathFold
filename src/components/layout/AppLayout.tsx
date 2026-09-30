import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'student' | 'parent'>('student');

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar - desktop only */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed((p) => !p)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar viewMode={viewMode} onViewModeChange={setViewMode} />
        <main className="flex-1 overflow-y-auto">

          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
