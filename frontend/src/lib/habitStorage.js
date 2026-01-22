// Local Storage Keys
const STORAGE_KEYS = {
  HABITS: 'habitTracker_habits',
  COMPLETIONS: 'habitTracker_completions',
  CATEGORIES: 'habitTracker_categories',
  SETTINGS: 'habitTracker_settings',
};

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'health', name: 'Health', color: 'health' },
  { id: 'productivity', name: 'Productivity', color: 'productivity' },
  { id: 'personal', name: 'Personal', color: 'personal' },
  { id: 'fitness', name: 'Fitness', color: 'fitness' },
  { id: 'mindfulness', name: 'Mindfulness', color: 'mindfulness' },
  { id: 'learning', name: 'Learning', color: 'learning' },
];

// Helper: Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper: Format date to YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper: Get today's date formatted
export const getToday = () => formatDate(new Date());

// Helper: Get dates for current week
export const getWeekDates = (date = new Date()) => {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  
  const monday = new Date(current.setDate(diff));
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDate(d));
  }
  
  return dates;
};

// Helper: Get dates for a month
export const getMonthDates = (year, month) => {
  const dates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(formatDate(new Date(year, month, day)));
  }
  
  return dates;
};

// Helper: Calculate streak for a habit
export const calculateStreak = (habitId, completions) => {
  const habitCompletions = completions.filter(c => c.habitId === habitId);
  if (habitCompletions.length === 0) return 0;
  
  // Sort completions by date descending
  const sortedDates = [...new Set(habitCompletions.map(c => c.date))].sort().reverse();
  
  let streak = 0;
  let currentDate = new Date();
  
  // Check if completed today
  const today = formatDate(currentDate);
  const completedToday = sortedDates[0] === today;
  
  // If not completed today, check if completed yesterday to continue streak
  if (!completedToday) {
    currentDate.setDate(currentDate.getDate() - 1);
    const yesterday = formatDate(currentDate);
    if (sortedDates[0] !== yesterday) {
      return 0; // Streak broken
    }
  }
  
  // Count consecutive days
  for (const date of sortedDates) {
    const checkDate = formatDate(currentDate);
    if (date === checkDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (date < checkDate) {
      break;
    }
  }
  
  return streak;
};

// Helper: Calculate longest streak
export const calculateLongestStreak = (habitId, completions) => {
  const habitCompletions = completions.filter(c => c.habitId === habitId);
  if (habitCompletions.length === 0) return 0;
  
  const sortedDates = [...new Set(habitCompletions.map(c => c.date))].sort();
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
};

// Helper: Calculate completion rate for a habit
export const calculateCompletionRate = (habitId, completions, days = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const habitCompletions = completions.filter(c => {
    const date = new Date(c.date);
    return c.habitId === habitId && date >= startDate && date <= endDate;
  });
  
  return Math.round((habitCompletions.length / days) * 100);
};

// Categories
export const getCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const addCategory = (category) => {
  const categories = getCategories();
  const newCategory = { ...category, id: generateId() };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
};

export const deleteCategory = (categoryId) => {
  const categories = getCategories().filter(c => c.id !== categoryId);
  saveCategories(categories);
};

// Habits
export const getHabits = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveHabits = (habits) => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const addHabit = (habit) => {
  const habits = getHabits();
  const newHabit = {
    id: generateId(),
    name: habit.name,
    categoryId: habit.categoryId || 'personal',
    note: habit.note || '',
    createdAt: new Date().toISOString(),
    ...habit
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
};

export const updateHabit = (habitId, updates) => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === habitId);
  if (index !== -1) {
    habits[index] = { ...habits[index], ...updates };
    saveHabits(habits);
    return habits[index];
  }
  return null;
};

export const deleteHabit = (habitId) => {
  const habits = getHabits().filter(h => h.id !== habitId);
  saveHabits(habits);
  
  // Also remove completions for this habit
  const completions = getCompletions().filter(c => c.habitId !== habitId);
  saveCompletions(completions);
};

// Completions
export const getCompletions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveCompletions = (completions) => {
  localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
};

export const toggleCompletion = (habitId, date) => {
  const completions = getCompletions();
  const dateStr = formatDate(date);
  const existingIndex = completions.findIndex(
    c => c.habitId === habitId && c.date === dateStr
  );
  
  if (existingIndex !== -1) {
    completions.splice(existingIndex, 1);
  } else {
    completions.push({
      id: generateId(),
      habitId,
      date: dateStr,
      completedAt: new Date().toISOString()
    });
  }
  
  saveCompletions(completions);
  return completions;
};

export const isCompleted = (habitId, date, completions) => {
  const dateStr = formatDate(date);
  return completions.some(c => c.habitId === habitId && c.date === dateStr);
};

// Settings
export const getSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : { theme: 'light' };
  } catch {
    return { theme: 'light' };
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Export/Import
export const exportData = () => {
  const data = {
    habits: getHabits(),
    completions: getCompletions(),
    categories: getCategories(),
    settings: getSettings(),
    exportedAt: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.habits) saveHabits(data.habits);
    if (data.completions) saveCompletions(data.completions);
    if (data.categories) saveCategories(data.categories);
    if (data.settings) saveSettings(data.settings);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get statistics
export const getStats = () => {
  const habits = getHabits();
  const completions = getCompletions();
  const today = getToday();
  
  // Today's completions
  const todayCompletions = completions.filter(c => c.date === today);
  const completedToday = todayCompletions.length;
  const totalHabits = habits.length;
  
  // Current streaks
  const streaks = habits.map(habit => ({
    habitId: habit.id,
    habitName: habit.name,
    streak: calculateStreak(habit.id, completions),
    longestStreak: calculateLongestStreak(habit.id, completions)
  }));
  
  // Best current streak
  const bestStreak = Math.max(...streaks.map(s => s.streak), 0);
  
  // Total completions this week
  const weekDates = getWeekDates();
  const weekCompletions = completions.filter(c => weekDates.includes(c.date)).length;
  
  // Completion rates
  const completionRates = habits.map(habit => ({
    habitId: habit.id,
    habitName: habit.name,
    rate: calculateCompletionRate(habit.id, completions, 30)
  }));
  
  // Average completion rate
  const avgCompletionRate = completionRates.length > 0
    ? Math.round(completionRates.reduce((sum, c) => sum + c.rate, 0) / completionRates.length)
    : 0;
  
  return {
    totalHabits,
    completedToday,
    todayProgress: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
    bestStreak,
    weekCompletions,
    avgCompletionRate,
    streaks,
    completionRates
  };
};
