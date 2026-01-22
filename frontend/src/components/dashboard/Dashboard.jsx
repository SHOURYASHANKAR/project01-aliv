import React from 'react';
import { 
  Target, 
  Flame, 
  TrendingUp, 
  CheckCircle2,
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitContext';
import { StatsCard } from './StatsCard';
import { TodayProgress } from './TodayProgress';
import { StreakLeaderboard } from './StreakLeaderboard';
import { WeeklyChart } from './WeeklyChart';
import { HabitDialog } from '@/components/habits/HabitDialog';

export const Dashboard = () => {
  const { stats, habits } = useHabits();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get motivational message
  const getMessage = () => {
    if (!stats) return 'Start tracking your habits today!';
    
    const { todayProgress, bestStreak, completedToday, totalHabits } = stats;
    
    if (totalHabits === 0) {
      return 'Create your first habit to get started!';
    }
    
    if (todayProgress === 100) {
      return '🎉 Amazing! All habits completed today!';
    }
    
    if (bestStreak >= 7) {
      return `🔥 You're on fire! ${bestStreak} day streak!`;
    }
    
    if (completedToday > 0) {
      return `Great progress! ${totalHabits - completedToday} more to go.`;
    }
    
    return 'Start your day strong! Complete a habit.';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {getGreeting()}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate()} — {getMessage()}
          </p>
        </div>
        
        {habits.length === 0 && (
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Habit
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today"
          value={`${stats?.todayProgress || 0}%`}
          subtitle={`${stats?.completedToday || 0} of ${stats?.totalHabits || 0} done`}
          icon={Target}
          variant="primary"
        />
        <StatsCard
          title="Best Streak"
          value={stats?.bestStreak || 0}
          subtitle="consecutive days"
          icon={Flame}
          variant="warning"
        />
        <StatsCard
          title="This Week"
          value={stats?.weekCompletions || 0}
          subtitle="completions"
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Avg. Rate"
          value={`${stats?.avgCompletionRate || 0}%`}
          subtitle="last 30 days"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Progress - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <TodayProgress />
          <WeeklyChart />
        </div>
        
        {/* Sidebar - Streak Leaderboard */}
        <div className="space-y-6">
          <StreakLeaderboard />
        </div>
      </div>

      {/* Habit Dialog */}
      <HabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
