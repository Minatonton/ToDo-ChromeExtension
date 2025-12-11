import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Task } from '@/types';
import { formatDate } from '@/utils/date';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { addTask, updateTask, categories } = useStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: formatDate(new Date(), 'yyyy-MM-dd'),
    dueTime: '12:00',
    priority: 'medium' as Task['priority'],
    category: categories[0]?.id || '',
    reminderEnabled: false,
    reminderTime: '15',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: formatDate(task.dueDate, 'yyyy-MM-dd'),
        dueTime: formatDate(task.dueDate, 'HH:mm'),
        priority: task.priority,
        category: task.category,
        reminderEnabled: task.reminder?.enabled || false,
        reminderTime: '15',
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description || undefined,
      dueDate: dueDateTime,
      priority: formData.priority,
      category: formData.category,
      completed: task?.completed || false,
      reminder: formData.reminderEnabled
        ? {
            enabled: true,
            time: new Date(dueDateTime.getTime() - parseInt(formData.reminderTime) * 60000),
            notified: false,
          }
        : undefined,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {task ? 'タスクを編集' : '新しいタスク'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">説明</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">期限日</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">時刻</label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) =>
                  setFormData({ ...formData, dueTime: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">カテゴリ</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">優先度</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as Task['priority'],
                  })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.reminderEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, reminderEnabled: e.target.checked })
                }
              />
              <span className="text-sm font-medium">リマインダーを設定</span>
            </label>

            {formData.reminderEnabled && (
              <select
                value={formData.reminderTime}
                onChange={(e) =>
                  setFormData({ ...formData, reminderTime: e.target.value })
                }
                className="mt-2 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="5">5分前</option>
                <option value="15">15分前</option>
                <option value="30">30分前</option>
                <option value="60">1時間前</option>
                <option value="1440">1日前</option>
              </select>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              キャンセル
            </button>
            <button type="submit" className="btn-primary">
              {task ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;