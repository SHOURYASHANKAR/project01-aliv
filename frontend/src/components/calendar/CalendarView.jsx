import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useHabits } from '@/context/HabitContext';
import { formatDate } from '@/lib/habitStorage';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarView = () => {
  const { habits, completions, checkIsCompleted, toggleCompletion } = useHabits();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState('all');
  
  const today = formatDate(new Date());

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1; // Convert to Monday-first (0-6)
    if (startDay < 0) startDay = 6;
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month days to show
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: formatDate(date),
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDate(date);
      days.push({
        date: dateStr,
        day: i,
        isCurrentMonth: true,
        isToday: dateStr === today,
      });
    }
    
    // Next month
    const remaining = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date: formatDate(date),
        day: i,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return days;
  }, [currentDate, today]);

  // Get completion status for a date
  const getCompletionStatus = (date) => {
    if (selectedHabitId === 'all') {
      const dayCompletions = completions.filter(c => c.date === date);
      const completedCount = dayCompletions.length;
      const total = habits.length;
      
      if (total === 0) return { level: 0, completed: 0, total: 0 };
      
      const percentage = (completedCount / total) * 100;
      let level = 0;
      if (percentage > 0) level = 1;
      if (percentage >= 25) level = 2;
      if (percentage >= 50) level = 3;
      if (percentage >= 75) level = 4;
      
      return { level, completed: completedCount, total };
    } else {
      const isCompleted = checkIsCompleted(selectedHabitId, date);
      return { 
        level: isCompleted ? 4 : 0, 
        completed: isCompleted ? 1 : 0, 
        total: 1 
      };
    }
  };

  // Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle day click
  const handleDayClick = (date) => {
    if (selectedHabitId !== 'all') {
      toggleCompletion(selectedHabitId, date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View your habit completion history
          </p>
        </div>
        
        <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Habits</SelectItem>
            {habits.map((habit) => (
              <SelectItem key={habit.id} value={habit.id}>
                {habit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg font-semibold min-w-[180px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div 
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <TooltipProvider delayDuration={0}>
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((day, index) => {
                const status = getCompletionStatus(day.date);
                const isClickable = selectedHabitId !== 'all';
                
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => isClickable && handleDayClick(day.date)}
                        disabled={!isClickable}
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative",
                          day.isCurrentMonth 
                            ? "text-foreground" 
                            : "text-muted-foreground/50",
                          day.isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                          isClickable && "cursor-pointer hover:bg-muted",
                          !isClickable && "cursor-default"
                        )}
                      >
                        <span className={cn(
                          "relative z-10",
                          day.isToday && "font-semibold text-primary"
                        )}>
                          {day.day}
                        </span>
                        
                        {/* Completion indicator */}
                        {status.level > 0 && day.isCurrentMonth && (
                          <div className={cn(
                            "absolute inset-1 rounded-md -z-0",
                            status.level === 1 && "bg-primary/15",
                            status.level === 2 && "bg-primary/30",
                            status.level === 3 && "bg-primary/50",
                            status.level === 4 && "bg-primary/70"
                          )} />
                        )}
                        
                        {/* Check mark for fully completed */}
                        {status.level === 4 && selectedHabitId !== 'all' && (
                          <Check className="absolute h-3 w-3 text-primary-foreground bottom-0.5 right-0.5" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{day.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {status.completed} of {status.total} completed
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "w-4 h-4 rounded-sm",
                  level === 0 && "bg-muted",
                  level === 1 && "bg-primary/15",
                  level === 2 && "bg-primary/30",
                  level === 3 && "bg-primary/50",
                  level === 4 && "bg-primary/70"
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </CardContent>
      </Card>

      {/* Heat Map Info */}
      {selectedHabitId === 'all' && habits.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Select a specific habit to toggle completions directly from the calendar
        </p>
      )}
    </div>
  );
};

export default CalendarView;
