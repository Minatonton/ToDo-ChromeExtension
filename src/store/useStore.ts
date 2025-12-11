import { create } from 'zustand';
import { Task, Category, ViewMode, Settings } from '@/types';

interface AppState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;

  // Filter
  filter: {
    status: 'all' | 'completed' | 'pending';
    category: string | null;
    priority: string | null;
  };
  setFilter: (filter: Partial<AppState['filter']>) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: '仕事', color: '#4285F4', isDefault: true },
  { id: '2', name: 'プライベート', color: '#34A853', isDefault: true },
  { id: '3', name: '買い物', color: '#FBBC04', isDefault: true },
  { id: '4', name: '勉強', color: '#EA4335', isDefault: true },
  { id: '5', name: '健康', color: '#34A853', isDefault: true },
  { id: '6', name: 'その他', color: '#9E9E9E', isDefault: true },
];

const defaultSettings: Settings = {
  theme: 'system',
  notifications: {
    enabled: true,
    sound: true,
    dailySummary: true,
    weeklyReview: false,
  },
  sync: {
    enabled: true,
  },
};

export const useStore = create<AppState>((set) => ({
  // Tasks
  tasks: [],
  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  updateTask: (id, taskData) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  toggleTaskComplete: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      ),
    })),

  // Categories
  categories: defaultCategories,
  addCategory: (categoryData) =>
    set((state) => ({
      categories: [
        ...state.categories,
        {
          ...categoryData,
          id: crypto.randomUUID(),
        },
      ],
    })),
  updateCategory: (id, categoryData) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...categoryData } : category
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),

  // View
  viewMode: 'month',
  setViewMode: (mode) => set({ viewMode: mode }),
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Settings
  settings: defaultSettings,
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // Filter
  filter: {
    status: 'all',
    category: null,
    priority: null,
  },
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
}))