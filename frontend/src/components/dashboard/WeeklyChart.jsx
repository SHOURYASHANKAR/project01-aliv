import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/context/HabitContext';
import { getWeekDates, formatDate } from '@/lib/habitStorage';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyChart = () => {
  const { habits, completions } = useHabits();
  const weekDates = getWeekDates();
  const today = formatDate(new Date());

  const weeklyData = useMemo(() => {
    return weekDates.map((date, index) => {
      const dayCompletions = completions.filter(c => c.date === date);
      const completedCount = dayCompletions.length;
      const percentage = habits.length > 0 
        ? Math.round((completedCount / habits.length) * 100) 
        : 0;
      
      return {
        date,
        day: DAY_NAMES[index],
        completed: completedCount,
        total: habits.length,
        percentage,
        isToday: date === today,
      };
    });
  }, [weekDates, completions, habits.length, today]);

  const maxPercentage = Math.max(...weeklyData.map(d => d.percentage), 1);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">This Week</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((day) => {
            const height = (day.percentage / 100) * 100;
            
            return (
              <div 
                key={day.date} 
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="relative w-full h-24 flex items-end justify-center">
                  <div 
                    className={cn(
                      "w-full max-w-[32px] rounded-t-md transition-all duration-500",
                      day.isToday 
                        ? "bg-primary" 
                        : day.percentage > 0 
                          ? "bg-primary/40" 
                          : "bg-muted"
                    )}
                    style={{ 
                      height: `${Math.max(height, 4)}%`,
                      minHeight: '4px'
                    }}
                  />
                  
                  {/* Percentage label on hover */}
                  {day.percentage > 0 && (
                    <span className="absolute -top-5 text-xs font-medium text-muted-foreground">
                      {day.percentage}%
                    </span>
                  )}
                </div>
                
                <span className={cn(
                  "text-xs font-medium",
                  day.isToday ? "text-primary" : "text-muted-foreground"
                )}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/40" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;
