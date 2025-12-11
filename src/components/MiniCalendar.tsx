import React from 'react';
import { useStore } from '@/store/useStore';
import {
  getMonthCalendarDays,
  isDateToday,
  isDateInCurrentMonth,
  formatDate,
  getMonthName,
} from '@/utils/date';
import clsx from 'clsx';

const MiniCalendar: React.FC = () => {
  const { selectedDate, setSelectedDate, tasks } = useStore();
  const calendarDays = getMonthCalendarDays(selectedDate);

  const getTaskCountForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        formatDate(task.dueDate, 'yyyy-MM-dd') ===
        formatDate(date, 'yyyy-MM-dd') && !task.completed
    ).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
      <div className="text-center mb-2 font-semibold text-sm">
        {getMonthName(selectedDate)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
          const taskCount = getTaskCountForDate(day);
          const isToday = isDateToday(day);
          const isCurrentMonth = isDateInCurrentMonth(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={clsx(
                'relative aspect-square flex flex-col items-center justify-center text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700',
                isToday && 'bg-blue-100 dark:bg-blue-900 font-bold',
                !isCurrentMonth && 'opacity-40'
              )}
            >
              <span>{day.getDate()}</span>
              {taskCount > 0 && (
                <div className="absolute bottom-0 w-1 h-1 bg-red-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;