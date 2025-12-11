export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  reminder?: {
    enabled: boolean;
    time: Date;
    notified: boolean;
  };
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isDefault: boolean;
}

export type ViewMode = 'month' | 'week' | 'day';

export interface CalendarDate {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    sound: boolean;
    dailySummary: boolean;
    weeklyReview: boolean;
  };
  sync: {
    enabled: boolean;
    lastSyncTime?: Date;
  };
}