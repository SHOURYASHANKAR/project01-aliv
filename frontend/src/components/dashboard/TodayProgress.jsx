import React from 'react';
import { Check, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHabits } from '@/context/HabitContext';
import { formatDate } from '@/lib/habitStorage';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS = {
  health: 'bg-success',
  productivity: 'bg-habit-productivity',
  personal: 'bg-habit-personal',
  fitness: 'bg-habit-fitness',
  mindfulness: 'bg-habit-mindfulness',
  learning: 'bg-habit-learning',
};

export const TodayProgress = () => {
  const { habits, categories, checkIsCompleted, toggleCompletion, stats } = useHabits();
  
  const today = formatDate(new Date());
  
  const habitsWithStatus = habits.map(habit => ({
    ...habit,
    isCompleted: checkIsCompleted(habit.id, today),
    category: categories.find(c => c.id === habit.categoryId),
  }));

  // Sort: incomplete first, then completed
  const sortedHabits = [...habitsWithStatus].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  const completedCount = habitsWithStatus.filter(h => h.isCompleted).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (habitId) => {
    toggleCompletion(habitId, today);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Today&apos;s Habits</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 mt-2" />
      </CardHeader>
      
      <CardContent className="pt-0">
        {sortedHabits.length > 0 ? (
          <div className="space-y-2">
            {sortedHabits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  "hover:bg-muted/50",
                  habit.isCompleted && "opacity-60"
                )}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  habit.isCompleted 
                    ? "border-primary bg-primary" 
                    : "border-border hover:border-primary/50"
                )}>
                  {habit.isCompleted && (
                    <Check className="h-3 w-3 text-primary-foreground animate-check" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    habit.isCompleted && "line-through text-muted-foreground"
                  )}>
                    {habit.name}
                  </p>
                </div>
                
                <div 
                  className={cn(
                    "h-2 w-2 rounded-full",
                    CATEGORY_COLORS[habit.category?.color] || 'bg-muted'
                  )}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Circle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No habits to track today
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayProgress;
