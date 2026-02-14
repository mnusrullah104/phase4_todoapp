'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { authUtils } from '@/lib/auth';
import { taskApi } from '@/lib/api';
import { Task } from '@/lib/types';
import { useTaskMetadata } from '@/hooks/useTaskMetadata';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function CalendarPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const { taskDueDates, taskPriorities } = useTaskMetadata();

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = authUtils.getUserInfo();
    if (userInfo && userInfo.sub) {
      setUserId(userInfo.sub);
      loadTasks(userInfo.sub);
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  const loadTasks = async (uid: string) => {
    try {
      const data = await taskApi.getTasks(uid);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const dueDate = taskDueDates[task.id];
      return dueDate && isSameDay(new Date(dueDate), date);
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage your tasks by date
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="p-4 md:p-6 mb-6">
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isTodayDate = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <motion.div
                  key={day.toString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-20 md:min-h-24 p-1 md:p-2 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                    isTodayDate
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                >
                  <div className={`text-xs md:text-sm font-medium mb-1 ${
                    isTodayDate
                      ? 'text-blue-600 dark:text-blue-400'
                      : isCurrentMonth
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dayTasks.slice(0, 3).map(task => {
                      const priority = taskPriorities[task.id] || 'medium';
                      const priorityColors = {
                        low: 'bg-green-500',
                        medium: 'bg-yellow-500',
                        high: 'bg-red-500',
                      };
                      return (
                        <div
                          key={task.id}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${priorityColors[priority]}`}
                          title={task.title}
                        />
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Selected date tasks */}
        {selectedDate && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedDateTasks.length === 0 ? (
              <EmptyState
                icon={
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
                title="No tasks scheduled"
                description="No tasks are scheduled for this date"
              />
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => {
                  const priority = taskPriorities[task.id] || 'medium';
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        priority === 'high' ? 'bg-red-500' :
                        priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          task.completed
                            ? 'text-gray-500 dark:text-gray-600 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={task.completed ? 'success' : priority}>
                        {task.completed ? 'Done' : priority}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </motion.div>
  );
}
