import React, { useState } from 'react';
import "@/App.css";
import { HabitProvider } from '@/context/HabitContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { HabitList } from '@/components/habits/HabitList';
import { CalendarView } from '@/components/calendar/CalendarView';
import { StatisticsView } from '@/components/stats/StatisticsView';
import { Toaster } from '@/components/ui/sonner';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <HabitList />;
      case 'calendar':
        return <CalendarView />;
      case 'stats':
        return <StatisticsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 min-h-[calc(100vh-56px)] overflow-auto">
          <div className="container max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            {renderView()}
          </div>
        </main>
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}

export default App;
