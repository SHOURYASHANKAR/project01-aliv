import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Flame,
  Check 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useHabits } from '@/context/HabitContext';
import { getWeekDates, formatDate } from '@/lib/habitStorage';

const CATEGORY_STYLES = {
  health: 'category-health',
  productivity: 'category-productivity',
  personal: 'category-personal',
  fitness: 'category-fitness',
  mindfulness: 'category-mindfulness',
  learning: 'category-learning',
};

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const HabitCard = ({ habit, onEdit }) => {
  const { 
    categories, 
    toggleCompletion, 
    checkIsCompleted, 
    getHabitStreak, 
    deleteHabit 
  } = useHabits();
  
  const [isDeleting, setIsDeleting] = useState(false);

  const category = categories.find(c => c.id === habit.categoryId);
  const categoryStyle = CATEGORY_STYLES[category?.color] || CATEGORY_STYLES.personal;
  const weekDates = getWeekDates();
  const streak = getHabitStreak(habit.id);
  const today = formatDate(new Date());
  const isCompletedToday = checkIsCompleted(habit.id, today);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteHabit(habit.id);
    }, 200);
  };

  const handleToggle = (date) => {
    toggleCompletion(habit.id, date);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        "hover:shadow-md",
        isDeleting && "scale-95 opacity-0"
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate">
                {habit.name}
              </h3>
              {streak >= 3 && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-0.5 animate-streak-pulse">
                        <Flame className="h-4 w-4 text-warning" />
                        <span className="text-xs font-semibold streak-fire">
                          {streak}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{streak} day streak!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={cn("category-pill", categoryStyle)}>
                {category?.name || 'Personal'}
              </span>
              {habit.note && (
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {habit.note}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(habit)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Week View */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-1">
            {weekDates.map((date, index) => {
              const isToday = date === today;
              const isCompleted = checkIsCompleted(habit.id, date);
              
              return (
                <div 
                  key={date} 
                  className="flex flex-col items-center gap-1"
                >
                  <span className={cn(
                    "text-[10px] font-medium",
                    isToday ? "text-primary" : "text-muted-foreground"
                  )}>
                    {DAY_LABELS[index]}
                  </span>
                  <button
                    onClick={() => handleToggle(date)}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border hover:border-primary/50 hover:bg-primary/5",
                      isToday && !isCompleted && "border-primary/30 bg-primary/5"
                    )}
                  >
                    {isCompleted && (
                      <Check className="h-4 w-4 animate-check" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Today Toggle - Mobile */}
        <div className="mt-4 flex items-center justify-between md:hidden">
          <span className="text-sm text-muted-foreground">
            {isCompletedToday ? "Completed today!" : "Mark as done"}
          </span>
          <Button
            size="sm"
            variant={isCompletedToday ? "default" : "outline"}
            onClick={() => handleToggle(today)}
            className="gap-1.5"
          >
            {isCompletedToday ? (
              <>
                <Check className="h-4 w-4" />
                Done
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
