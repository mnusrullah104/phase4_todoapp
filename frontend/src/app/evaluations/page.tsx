'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils, authApi } from '@/lib/auth';
import { taskApi } from '@/lib/api';
import { Task } from '@/lib/types';

export default function EvaluationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [evaluationScore, setEvaluationScore] = useState(5);
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = authUtils.getUserInfo();
    if (userInfo && userInfo.sub) {
      setUserId(userInfo.sub);
      setUserName(userInfo.email || 'User');
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

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  const handleEvaluate = () => {
    // Placeholder for evaluation logic
    alert(`Task evaluated with score: ${evaluationScore}/10`);
    setSelectedTask(null);
    setEvaluationScore(5);
    setEvaluationNotes('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-electric-200 dark:border-electric-900 border-t-electric-600 dark:border-t-electric-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-electric-400 dark:border-t-electric-700 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading evaluations...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Main Content */}
      <main className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Task Evaluations
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Score and assess your completed tasks to track quality and improvement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Selection Panel */}
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-200 dark:border-dark-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Task to Evaluate</h2>

              {completedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">No completed tasks to evaluate yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {completedTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedTask?.id === task.id
                          ? 'border-electric-500 bg-electric-50 dark:bg-electric-900/20'
                          : 'border-gray-200 dark:border-dark-700 hover:border-electric-300 dark:hover:border-electric-700 bg-white dark:bg-dark-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                        <div className="ml-3">
                          <svg className={`w-6 h-6 ${selectedTask?.id === task.id ? 'text-electric-600 dark:text-electric-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Evaluation Panel */}
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-200 dark:border-dark-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Evaluation Form</h2>

              {!selectedTask ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Select a task to begin evaluation</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Task Info */}
                  <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Evaluating:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedTask.title}</p>
                  </div>

                  {/* Score Slider */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Quality Score: <span className="text-2xl text-electric-600 dark:text-electric-400">{evaluationScore}/10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={evaluationScore}
                      onChange={(e) => setEvaluationScore(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-electric-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {/* Score Indicator */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        onClick={() => setEvaluationScore(score)}
                        className={`h-12 rounded-lg font-bold transition-all ${
                          evaluationScore >= score
                            ? 'bg-gradient-to-br from-electric-600 to-purple-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-400 dark:text-gray-600'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>

                  {/* Evaluation Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Evaluation Notes
                    </label>
                    <textarea
                      value={evaluationNotes}
                      onChange={(e) => setEvaluationNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-electric-500 dark:focus:ring-electric-600 focus:border-transparent transition-all resize-none text-gray-900 dark:text-gray-100"
                      placeholder="What went well? What could be improved?"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleEvaluate}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-electric-600 to-purple-600 hover:from-electric-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-semibold text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit Evaluation</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation Guidelines */}
          <div className="mt-8 bg-gradient-to-br from-electric-50 to-purple-50 dark:from-electric-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-electric-200 dark:border-electric-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Evaluation Guidelines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-electric-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1-3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Needs Improvement</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Task completed but with significant issues</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-warning-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4-6</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Satisfactory</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Task meets basic requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">7-10</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Excellent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Task exceeds expectations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
