import React from 'react';
import { useStore } from '@/store/useStore';
import {
  getMonthCalendarDays,
  getWeekCalendarDays,
  isDateToday,
  isDateInCurrentMonth,
  formatDate,
  getMonthName,
  navigateMonth,
  navigateWeek,
} from '@/utils/date';
import { Task } from '@/types';
import clsx from 'clsx';
import { useDrop } from 'react-dnd';

interface CalendarViewProps {
  onEditTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onEditTask }) => {
  const {
    tasks,
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    filter,
  } = useStore();

  const calendarDays =
    viewMode === 'month'
      ? getMonthCalendarDays(selectedDate)
      : getWeekCalendarDays(selectedDate);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setSelectedDate(navigateMonth(selectedDate, direction));
    } else if (viewMode === 'week') {
      setSelectedDate(navigateWeek(selectedDate, direction));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter.status === 'completed' && !task.completed) return false;
    if (filter.status === 'pending' && task.completed) return false;
    if (filter.category && task.category !== filter.category) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    return true;
  });

  const getTasksForDate = (date: Date) => {
    return filteredTasks.filter(
      (task) =>
        formatDate(task.dueDate, 'yyyy-MM-dd') ===
        formatDate(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="bg-white dark:bg-gray-800 border-b border-border-light dark:border-border-dark p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
              {getMonthName(selectedDate)}
            </h1>

            <div className="flex gap-2">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm bg-primary-light dark:bg-primary-dark text-white rounded"
              >
                今日
              </button>
              <button
                onClick={() => handleNavigate('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                →
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={clsx(
                'px-3 py-1 rounded',
                viewMode === 'month'
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              月
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={clsx(
                'px-3 py-1 rounded',
                viewMode === 'week'
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              週
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={clsx(
                'px-3 py-1 rounded',
                viewMode === 'day'
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              日
            </button>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'day' ? (
          <DayView
            date={selectedDate}
            tasks={getTasksForDate(selectedDate)}
            onEditTask={onEditTask}
          />
        ) : (
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* 曜日ヘッダー */}
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div
                key={day}
                className={clsx(
                  'p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800',
                  index === 0 && 'text-red-500',
                  index === 6 && 'text-blue-500'
                )}
              >
                {day}
              </div>
            ))}

            {/* 日付セル */}
            {calendarDays.map((date) => (
              <CalendarCell
                key={date.toISOString()}
                date={date}
                tasks={getTasksForDate(date)}
                isToday={isDateToday(date)}
                isCurrentMonth={isDateInCurrentMonth(date, selectedDate)}
                onEditTask={onEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CalendarCellProps {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onEditTask: (task: Task) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  tasks,
  isToday,
  isCurrentMonth,
  onEditTask,
}) => {
  const { updateTask } = useStore();

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { task: Task }) => {
      updateTask(item.task.id, {
        dueDate: date,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={clsx(
        'min-h-[100px] p-2 bg-white dark:bg-gray-900',
        isToday && 'bg-blue-50 dark:bg-blue-900/20',
        !isCurrentMonth && 'opacity-50',
        isOver && 'bg-green-50 dark:bg-green-900/20'
      )}
    >
      <div className="text-sm font-medium mb-1">{date.getDate()}</div>
      <div className="space-y-1">
        {tasks.slice(0, 3).map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onEditTask(task)} />
        ))}
        {tasks.length > 3 && (
          <div className="text-xs text-gray-500">+{tasks.length - 3} more</div>
        )}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { categories } = useStore();
  const category = categories.find((cat) => cat.id === task.category);

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-1 text-xs rounded cursor-pointer hover:opacity-80',
        task.completed && 'line-through opacity-60'
      )}
      style={{
        backgroundColor: category?.color ? category.color + '20' : '#f3f4f6',
        borderLeft: `2px solid ${category?.color || '#9ca3af'}`,
      }}
    >
      {task.title}
    </div>
  );
};

interface DayViewProps {
  date: Date;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, tasks, onEditTask }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold p-4 border-b">
        {formatDate(date, 'yyyy年M月d日 (E)')}
      </h2>
      <div className="divide-y">
        {hours.map((hour) => (
          <div key={hour} className="flex">
            <div className="w-16 p-2 text-sm text-gray-500">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 p-2 min-h-[60px]">
              {tasks
                .filter((task) => task.dueDate.getHours() === hour)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onEditTask(task)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;