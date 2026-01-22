import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHabits } from '@/context/HabitContext';
import { HabitCard } from './HabitCard';
import { HabitDialog } from './HabitDialog';
import { cn } from '@/lib/utils';

export const HabitList = () => {
  const { habits, categories } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || habit.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [habits, searchQuery, selectedCategory]);

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };

  const handleDialogClose = (open) => {
    setDialogOpen(open);
    if (!open) {
      setEditingHabit(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Habits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your daily habits and build consistency
          </p>
        </div>
        
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Habit Cards */}
      {filteredHabits.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit, index) => (
            <div 
              key={habit.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <HabitCard habit={habit} onEdit={handleEdit} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            {habits.length === 0 ? 'No habits yet' : 'No habits found'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {habits.length === 0 
              ? 'Start building better habits by creating your first one.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {habits.length === 0 && (
            <Button onClick={() => setDialogOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create First Habit
            </Button>
          )}
        </div>
      )}

      {/* Dialog */}
      <HabitDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editHabit={editingHabit}
      />
    </div>
  );
};

export default HabitList;
