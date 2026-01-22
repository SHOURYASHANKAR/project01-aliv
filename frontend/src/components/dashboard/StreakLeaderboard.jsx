import React from 'react';
import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/context/HabitContext';
import { cn } from '@/lib/utils';

export const StreakLeaderboard = () => {
  const { stats, habits } = useHabits();
  
  if (!stats || !stats.streaks) return null;

  // Get top 5 habits by streak
  const topStreaks = [...stats.streaks]
    .filter(s => s.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-warning" />;
    if (index === 1) return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    return null;
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-destructive';
    if (streak >= 14) return 'text-warning';
    if (streak >= 7) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Flame className="h-4 w-4 text-warning" />
          Active Streaks
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {topStreaks.length > 0 ? (
          <div className="space-y-3">
            {topStreaks.map((item, index) => {
              const habit = habits.find(h => h.id === item.habitId);
              if (!habit) return null;
              
              return (
                <div 
                  key={item.habitId}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg",
                    index === 0 && "bg-warning-light"
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    {getRankIcon(index) || (
                      <span className="text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {habit.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Flame className={cn("h-4 w-4", getStreakColor(item.streak))} />
                    <span className={cn(
                      "text-sm font-semibold",
                      getStreakColor(item.streak)
                    )}>
                      {item.streak}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Flame className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Complete habits to start streaks
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakLeaderboard;
