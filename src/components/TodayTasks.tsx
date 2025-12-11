import React from 'react';
import { Task } from '@/types';
import { isDateToday } from '@/utils/date';
import TaskItem from './TaskItem';

interface TodayTasksProps {
  tasks: Task[];
}

const TodayTasks: React.FC<TodayTasksProps> = ({ tasks }) => {
  const todayTasks = tasks.filter((task) =>
    isDateToday(task.dueDate)
  );

  const pendingTasks = todayTasks.filter((task) => !task.completed);
  const completedTasks = todayTasks.filter((task) => task.completed);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
      <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        今日のタスク ({pendingTasks.length})
      </h2>

      {todayTasks.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
          今日のタスクはありません
        </p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {pendingTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}

          {completedTasks.length > 0 && (
            <>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                完了済み ({completedTasks.length})
              </div>
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TodayTasks;