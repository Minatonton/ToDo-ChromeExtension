import { Task, Category, Settings } from '@/types';

export class ChromeStorageService {
  private static readonly KEYS = {
    TASKS: 'tasks',
    CATEGORIES: 'categories',
    SETTINGS: 'settings',
  };

  static async getTasks(): Promise<Task[]> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return [];
    }

    const result = await chrome.storage.local.get(this.KEYS.TASKS);
    const tasks = result[this.KEYS.TASKS] || [];

    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      reminder: task.reminder
        ? {
            ...task.reminder,
            time: new Date(task.reminder.time),
          }
        : undefined,
      recurrence: task.recurrence
        ? {
            ...task.recurrence,
            endDate: task.recurrence.endDate
              ? new Date(task.recurrence.endDate)
              : undefined,
          }
        : undefined,
    }));
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    await chrome.storage.local.set({
      [this.KEYS.TASKS]: tasks,
    });
  }

  static async getCategories(): Promise<Category[]> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return [];
    }

    const result = await chrome.storage.local.get(this.KEYS.CATEGORIES);
    return result[this.KEYS.CATEGORIES] || [];
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    await chrome.storage.local.set({
      [this.KEYS.CATEGORIES]: categories,
    });
  }

  static async getSettings(): Promise<Settings | null> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return null;
    }

    const result = await chrome.storage.local.get(this.KEYS.SETTINGS);
    const settings = result[this.KEYS.SETTINGS];

    if (settings && settings.sync?.lastSyncTime) {
      return {
        ...settings,
        sync: {
          ...settings.sync,
          lastSyncTime: new Date(settings.sync.lastSyncTime),
        },
      };
    }

    return settings || null;
  }

  static async saveSettings(settings: Settings): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    await chrome.storage.local.set({
      [this.KEYS.SETTINGS]: settings,
    });
  }

  static async clearAll(): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    await chrome.storage.local.clear();
  }
}