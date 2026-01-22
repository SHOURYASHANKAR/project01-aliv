import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { 
  Trophy, 
  Target, 
  Calendar as CalendarIcon,
  TrendingUp,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/context/HabitContext';
import { getMonthDates, formatDate, calculateStreak, calculateLongestStreak } from '@/lib/habitStorage';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(145, 35%, 42%)',  // Primary sage
  'hsl(220, 70%, 55%)',  // Blue
  'hsl(25, 85%, 55%)',   // Orange
  'hsl(280, 55%, 55%)',  // Purple
  'hsl(180, 50%, 45%)',  // Teal
  'hsl(45, 90%, 50%)',   // Yellow
];

export const StatisticsView = () => {
  const { habits, completions, categories, stats } = useHabits();

  // Completion by category
  const categoryData = useMemo(() => {
    const data = categories.map(category => {
      const categoryHabits = habits.filter(h => h.categoryId === category.id);
      const categoryCompletions = completions.filter(c => 
        categoryHabits.some(h => h.id === c.habitId)
      );
      
      return {
        name: category.name,
        habits: categoryHabits.length,
        completions: categoryCompletions.length,
      };
    }).filter(d => d.habits > 0);
    
    return data;
  }, [categories, habits, completions]);

  // Monthly completion trend
  const monthlyData = useMemo(() => {
    const now = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthDates = getMonthDates(date.getFullYear(), date.getMonth());
      
      const monthCompletions = completions.filter(c => 
        monthDates.includes(c.date)
      );
      
      const possibleCompletions = habits.length * monthDates.length;
      const rate = possibleCompletions > 0 
        ? Math.round((monthCompletions.length / possibleCompletions) * 100)
        : 0;
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        completions: monthCompletions.length,
        rate,
      });
    }
    
    return data;
  }, [completions, habits.length]);

  // Habit performance
  const habitPerformance = useMemo(() => {
    return habits.map(habit => {
      const habitCompletions = completions.filter(c => c.habitId === habit.id);
      const streak = calculateStreak(habit.id, completions);
      const longestStreak = calculateLongestStreak(habit.id, completions);
      
      // Last 30 days rate
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentCompletions = habitCompletions.filter(c => 
        new Date(c.date) >= thirtyDaysAgo
      );
      const rate = Math.round((recentCompletions.length / 30) * 100);
      
      return {
        id: habit.id,
        name: habit.name,
        totalCompletions: habitCompletions.length,
        currentStreak: streak,
        longestStreak,
        rate,
        category: categories.find(c => c.id === habit.categoryId)?.name || 'Personal',
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [habits, completions, categories]);

  // Best performing habit
  const bestHabit = habitPerformance[0];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Statistics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress and performance
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            No data yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start tracking habits to see your statistics and progress over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your progress and performance over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completions.length}</p>
                <p className="text-xs text-muted-foreground">Total Completions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Trophy className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.bestStreak || 0}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CalendarIcon className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.avgCompletionRate || 0}%</p>
                <p className="text-xs text-muted-foreground">Avg. Rate (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent p-2">
                <Award className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{habits.length}</p>
                <p className="text-xs text-muted-foreground">Active Habits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Monthly Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    name="Completions"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Habits by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="habits"
                    nameKey="name"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name} ({entry.habits})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habit Performance Table */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Habit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 pr-4">
                    Habit
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                    Category
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">
                    Rate (30d)
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">
                    Current
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 pl-4">
                    Best
                  </th>
                </tr>
              </thead>
              <tbody>
                {habitPerformance.map((habit, index) => (
                  <tr 
                    key={habit.id}
                    className={cn(
                      "border-b border-border last:border-0",
                      index === 0 && "bg-warning-light"
                    )}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Trophy className="h-4 w-4 text-warning" />
                        )}
                        <span className="text-sm font-medium">{habit.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {habit.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${habit.rate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10">
                          {habit.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn(
                        "text-sm font-medium",
                        habit.currentStreak >= 7 && "text-warning"
                      )}>
                        {habit.currentStreak}🔥
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className="text-sm text-muted-foreground">
                        {habit.longestStreak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsView;
