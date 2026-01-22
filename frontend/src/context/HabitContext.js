import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getHabits,
  getCompletions,
  getCategories,
  getSettings,
  addHabit as addHabitStorage,
  updateHabit as updateHabitStorage,
  deleteHabit as deleteHabitStorage,
  toggleCompletion as toggleCompletionStorage,
  addCategory as addCategoryStorage,
  deleteCategory as deleteCategoryStorage,
  saveSettings,
  exportData,
  importData,
  getStats,
  isCompleted,
  calculateStreak,
} from '@/lib/habitStorage';

const HabitContext = createContext(null);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ theme: 'light' });
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      setHabits(getHabits());
      setCompletions(getCompletions());
      setCategories(getCategories());
      setSettings(getSettings());
      setStats(getStats());
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Update stats when habits or completions change
  useEffect(() => {
    if (!isLoading) {
      const newStats = getStats();
      setStats(newStats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits.length, completions.length, isLoading]);

  // Theme management
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings]);

  // Habit operations
  const addHabit = useCallback((habit) => {
    const newHabit = addHabitStorage(habit);
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, []);

  const updateHabit = useCallback((habitId, updates) => {
    const updated = updateHabitStorage(habitId, updates);
    if (updated) {
      setHabits(prev => prev.map(h => h.id === habitId ? updated : h));
    }
    return updated;
  }, []);

  const deleteHabit = useCallback((habitId) => {
    deleteHabitStorage(habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => prev.filter(c => c.habitId !== habitId));
  }, []);

  // Completion operations
  const toggleCompletion = useCallback((habitId, date) => {
    const updatedCompletions = toggleCompletionStorage(habitId, date);
    setCompletions(updatedCompletions);
  }, []);

  const checkIsCompleted = useCallback((habitId, date) => {
    return isCompleted(habitId, date, completions);
  }, [completions]);

  const getHabitStreak = useCallback((habitId) => {
    return calculateStreak(habitId, completions);
  }, [completions]);

  // Category operations
  const addCategory = useCallback((category) => {
    const newCategory = addCategoryStorage(category);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const deleteCategory = useCallback((categoryId) => {
    deleteCategoryStorage(categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  }, []);

  // Export/Import
  const handleExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((jsonString) => {
    const result = importData(jsonString);
    if (result.success) {
      setHabits(getHabits());
      setCompletions(getCompletions());
      setCategories(getCategories());
      setSettings(getSettings());
    }
    return result;
  }, []);

  const value = {
    // State
    habits,
    completions,
    categories,
    settings,
    stats,
    isLoading,
    
    // Theme
    toggleTheme,
    
    // Habit operations
    addHabit,
    updateHabit,
    deleteHabit,
    
    // Completion operations
    toggleCompletion,
    checkIsCompleted,
    getHabitStreak,
    
    // Category operations
    addCategory,
    deleteCategory,
    
    // Export/Import
    handleExport,
    handleImport,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export default HabitContext;
