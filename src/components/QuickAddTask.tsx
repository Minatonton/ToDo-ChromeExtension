import React, { useState } from 'react';
import { Task, Category } from '@/types';

interface QuickAddTaskProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
}

const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  onAddTask,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    onAddTask({
      title: title.trim(),
      dueDate: today,
      priority,
      category,
      completed: false,
    });

    setTitle('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
      <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        クイック追加
      </h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクを入力..."
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1 text-xs bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
          >
            追加
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickAddTask;