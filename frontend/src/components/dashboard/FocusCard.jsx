import React, { useMemo } from 'react';
import { CheckCircle2, Flame, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/context/HabitContext';
import { formatDate } from '@/lib/habitStorage';
import { cn } from '@/lib/utils';

const getLastCompletionDate = (habitId, completions) => {
  const dates = completions
    .filter(completion => completion.habitId === habitId)
    .map(completion => completion.date)
    .sort();

  return dates.length > 0 ? dates[dates.length - 1] : null;
};

const getEncouragement = (rate) => {
  if (rate >= 80) return 'You are close to mastery—protect this streak.';
  if (rate >= 50) return 'A small push today can lift your weekly average.';
  if (rate >= 25) return 'A five-minute version still counts as progress.';
  return 'Start tiny today—momentum beats perfection.';
};

export const FocusCard = () => {
  const {
    habits,
    categories,
    completions,
    stats,
    checkIsCompleted,
    toggleCompletion,
  } = useHabits();

  const today = formatDate(new Date());

  const focusHabit = useMemo(() => {
    if (!stats?.completionRates?.length) return null;

    const sortedRates = [...stats.completionRates].sort((a, b) => a.rate - b.rate);
    const lowestRate = sortedRates[0];
    const habit = habits.find(item => item.id === lowestRate.habitId);

    if (!habit) return null;

    return {
      ...habit,
      rate: lowestRate.rate,
      streak:
        stats.streaks?.find(streak => streak.habitId === habit.id)?.streak ?? 0,
    };
  }, [habits, stats]);

  if (!focusHabit) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Focus for Today</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create a habit to unlock personalized nudges.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-lg border border-dashed border-muted-foreground/40 p-4 text-sm text-muted-foreground">
            Add your first habit and we will highlight the one that needs the most attention.
          </div>
        </CardContent>
      </Card>
    );
  }

  const category = categories.find(item => item.id === focusHabit.categoryId);
  const isCompletedToday = checkIsCompleted(focusHabit.id, today);
  const lastCompleted = getLastCompletionDate(focusHabit.id, completions);

  const handleToggle = () => {
    toggleCompletion(focusHabit.id, today);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Focus for Today</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your lowest consistency habit needs a small win.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {focusHabit.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {getEncouragement(focusHabit.rate)}
              </p>
            </div>
            {category && (
              <Badge variant="outline" className="capitalize">
                {category.name}
              </Badge>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>{focusHabit.rate}% rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>{focusHabit.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>
                {lastCompleted ? `Last: ${lastCompleted}` : 'No wins yet'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {isCompletedToday
              ? 'Nice! You already completed this habit today.'
              : 'Mark this habit complete when you finish today.'}
          </div>
          <Button
            size="sm"
            variant={isCompletedToday ? 'secondary' : 'default'}
            onClick={handleToggle}
            className={cn(isCompletedToday && 'cursor-default')}
            disabled={isCompletedToday}
          >
            {isCompletedToday ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusCard;
