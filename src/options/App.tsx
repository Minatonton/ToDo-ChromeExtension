import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useStore } from '@/store/useStore';
import { ChromeStorageService } from '@/utils/storage';
import CalendarView from '@/components/CalendarView';
import Sidebar from '@/components/Sidebar';
import TaskModal from '@/components/TaskModal';
import SettingsModal from '@/components/SettingsModal';

const App: React.FC = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { tasks, categories, settings } = useStore();

  // Chrome Storageからデータを読み込む
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedTasks, storedCategories, storedSettings] = await Promise.all([
          ChromeStorageService.getTasks(),
          ChromeStorageService.getCategories(),
          ChromeStorageService.getSettings(),
        ]);

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

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-background-light dark:bg-background-dark">
        {/* サイドバー */}
        <Sidebar
          onNewTask={handleNewTask}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* メインコンテンツ */}
        <div className="flex-1 overflow-hidden">
          <CalendarView onEditTask={handleEditTask} />
        </div>

        {/* タスクモーダル */}
        {isTaskModalOpen && (
          <TaskModal
            task={selectedTask}
            onClose={() => setIsTaskModalOpen(false)}
          />
        )}

        {/* 設定モーダル */}
        {isSettingsModalOpen && (
          <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
        )}
      </div>
    </DndProvider>
  );
};

export default App;