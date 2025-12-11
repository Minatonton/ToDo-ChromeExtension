import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr, { locale: ja });
};

export const getMonthCalendarDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start, { weekStartsOn: 0 });
  const endWeek = endOfWeek(end, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: startWeek, end: endWeek });
};

export const getWeekCalendarDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end });
};

export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

export const isDateInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

export const isDatesSame = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const navigateMonth = (date: Date, direction: 'next' | 'prev'): Date => {
  return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
};

export const navigateWeek = (date: Date, direction: 'next' | 'prev'): Date => {
  return direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1);
};

export const getDayOfWeekName = (date: Date): string => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
};

export const getMonthName = (date: Date): string => {
  return formatDate(date, 'yyyy年M月');
};

export const getWeekRange = (date: Date): string => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return `${formatDate(start, 'M月d日')} - ${formatDate(end, 'M月d日')}`;
};