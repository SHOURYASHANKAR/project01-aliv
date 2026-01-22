import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'habits', label: 'My Habits', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
];

export const Sidebar = ({ 
  currentView, 
  onViewChange, 
  isOpen, 
  onClose 
}) => {
  const { stats } = useHabits();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out md:relative md:z-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-5 w-5 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="font-semibold text-foreground">
                Habit Flow
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 pt-4 md:pt-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  <span>{item.label}</span>
                  
                  {/* Badge for habits view */}
                  {item.id === 'habits' && stats && stats.totalHabits > 0 && (
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {stats.totalHabits}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          {stats && (
            <div className="border-t border-border p-4">
              <div className="rounded-lg bg-primary-light p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Today&apos;s Progress
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {stats.todayProgress}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/20">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${stats.todayProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {stats.completedToday} of {stats.totalHabits} completed
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border p-3">
            <p className="text-center text-xs text-muted-foreground">
              Data stored locally
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
