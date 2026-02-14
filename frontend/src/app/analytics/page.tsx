'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authUtils } from '@/lib/auth';
import { taskApi } from '@/lib/api';
import { Task } from '@/lib/types';

export default function AnalyticsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

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

  // Analytics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Weekly progress (mock data for visualization)
  const weeklyData = [
    { day: 'Mon', completed: 3, created: 5 },
    { day: 'Tue', completed: 5, created: 4 },
    { day: 'Wed', completed: 4, created: 6 },
    { day: 'Thu', completed: 6, created: 3 },
    { day: 'Fri', completed: 7, created: 5 },
    { day: 'Sat', completed: 2, created: 2 },
    { day: 'Sun', completed: 3, created: 3 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => Math.max(d.completed, d.created)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading analytics...</p>
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
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
    >
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your productivity trends and performance metrics
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">+12%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{totalTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">+8%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{completedTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{activeTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-xl p-6 border border-blue-700 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-white bg-white/20 px-2 py-1 rounded">Score</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{completionRate}%</p>
              <p className="text-sm text-blue-100">Completion Rate</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Activity Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Weekly Activity</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks completed vs created this week</p>
              </div>
              <div className="space-y-4">
                {weeklyData.map((data, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.day}</span>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                          {data.completed} completed
                        </span>
                        <span className="flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                          {data.created} created
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(data.completed / maxValue) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(data.created / maxValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Productivity Trends */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Productivity Trends</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your performance over time</p>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Completion</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Average</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4.3 tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '86%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Focus Time</span>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">5.2 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500" style={{ width: '73%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Streak</span>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">7 days</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5.2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Hours/Day</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks This Week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
