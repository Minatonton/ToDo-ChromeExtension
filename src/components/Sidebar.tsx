import React from 'react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

interface SidebarProps {
  onNewTask: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewTask, onOpenSettings }) => {
  const { filter, setFilter, categories, tasks } = useStore();

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    today: tasks.filter((t) => {
      const today = new Date();
      return (
        t.dueDate.getDate() === today.getDate() &&
        t.dueDate.getMonth() === today.getMonth() &&
        t.dueDate.getFullYear() === today.getFullYear()
      );
    }).length,
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-border-light dark:border-border-dark flex flex-col">
      {/* ロゴ */}
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark">
          Calendar TODO
        </h1>
      </div>

      {/* 新規タスクボタン */}
      <div className="p-4">
        <button
          onClick={onNewTask}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          新規タスク
        </button>
      </div>

      {/* 統計情報 */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-500 dark:text-gray-400">今日</div>
            <div className="font-bold">{taskStats.today}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-500 dark:text-gray-400">未完了</div>
            <div className="font-bold">{taskStats.pending}</div>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
          ステータス
        </h3>
        <div className="space-y-1 mb-4">
          {[
            { value: 'all', label: 'すべて' },
            { value: 'pending', label: '未完了' },
            { value: 'completed', label: '完了済み' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() =>
                setFilter({ status: status.value as typeof filter.status })
              }
              className={clsx(
                'w-full text-left px-3 py-2 rounded text-sm',
                filter.status === status.value
                  ? 'bg-primary-light text-white dark:bg-primary-dark'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {status.label}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
          カテゴリ
        </h3>
        <div className="space-y-1 mb-4">
          <button
            onClick={() => setFilter({ category: null })}
            className={clsx(
              'w-full text-left px-3 py-2 rounded text-sm',
              filter.category === null
                ? 'bg-primary-light text-white dark:bg-primary-dark'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            すべて
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter({ category: category.id })}
              className={clsx(
                'w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2',
                filter.category === category.id
                  ? 'bg-primary-light text-white dark:bg-primary-dark'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
          優先度
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => setFilter({ priority: null })}
            className={clsx(
              'w-full text-left px-3 py-2 rounded text-sm',
              filter.priority === null
                ? 'bg-primary-light text-white dark:bg-primary-dark'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            すべて
          </button>
          {[
            { value: 'high', label: '高', color: 'text-red-500' },
            { value: 'medium', label: '中', color: 'text-yellow-500' },
            { value: 'low', label: '低', color: 'text-green-500' },
          ].map((priority) => (
            <button
              key={priority.value}
              onClick={() => setFilter({ priority: priority.value })}
              className={clsx(
                'w-full text-left px-3 py-2 rounded text-sm',
                filter.priority === priority.value
                  ? 'bg-primary-light text-white dark:bg-primary-dark'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <span className={priority.color}>●</span> {priority.label}
            </button>
          ))}
        </div>
      </div>

      {/* 設定ボタン */}
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <button
          onClick={onOpenSettings}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          設定
        </button>
      </div>
    </div>
  );
};

export default Sidebar;