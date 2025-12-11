import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { ChromeStorageService } from '@/utils/storage';
import Header from '@/components/Header';
import MiniCalendar from '@/components/MiniCalendar';
import TodayTasks from '@/components/TodayTasks';
import QuickAddTask from '@/components/QuickAddTask';

const App: React.FC = () => {
  const { tasks, categories, settings, addTask } = useStore();

  // Chrome Storageからデータを読み込む
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedTasks, storedCategories, storedSettings] = await Promise.all([
          ChromeStorageService.getTasks(),
          ChromeStorageService.getCategories(),
          ChromeStorageService.getSettings(),
        ]);

        // ストアを更新
        if (storedTasks.length > 0) {
          useStore.setState({ tasks: storedTasks });
        }
        if (storedCategories.length > 0) {
          useStore.setState({ categories: storedCategories });
        }
        if (storedSettings) {
          useStore.setState({ settings: storedSettings });
        }
      } catch (error) {
        console.error('Failed to load data from Chrome storage:', error);
      }
    };

    loadData();
  }, []);

  // データが変更されたらChrome Storageに保存
  useEffect(() => {
    ChromeStorageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    ChromeStorageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    ChromeStorageService.saveSettings(settings);
  }, [settings]);

  const openFullView = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  return (
    <div className="popup-container bg-background-light dark:bg-background-dark">
      <Header />

      <div className="flex-1 overflow-y-auto p-4">
        {/* ミニカレンダー */}
        <div className="mb-4">
          <MiniCalendar />
        </div>

        {/* クイックタスク追加 */}
        <div className="mb-4">
          <QuickAddTask onAddTask={addTask} categories={categories} />
        </div>

        {/* 今日のタスク */}
        <div className="mb-4">
          <TodayTasks tasks={tasks} />
        </div>

        {/* フルビューへのリンク */}
        <button
          onClick={openFullView}
          className="w-full btn-primary"
        >
          フルビューで開く
        </button>
      </div>
    </div>
  );
};

export default App;