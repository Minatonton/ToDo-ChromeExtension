import React from 'react';
import { Task } from '@/types';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';
import { formatDate } from '@/utils/date';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskComplete, deleteTask, categories } = useStore();
  const category = categories.find((cat) => cat.id === task.category);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-2',
        getPriorityColor(task.priority),
        task.completed && 'opacity-60'
      )}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskComplete(task.id)}
        className="mt-0.5 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <div
          className={clsx(
            'text-sm font-medium',
            task.completed && 'line-through'
          )}
        >
          {task.title}
        </div>

        {task.description && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {task.description}
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          {category && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: category.color + '20',
                color: category.color,
              }}
            >
              {category.name}
            </span>
          )}

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(task.dueDate, 'HH:mm')}
          </span>
        </div>
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700 text-xs"
        title="削除"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;