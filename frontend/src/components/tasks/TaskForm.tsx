'use client';

import { useState } from 'react';
import { Task, TaskCreateData } from '@/lib/types';
import { taskApi } from '@/lib/api';

interface TaskFormProps {
  userId: string;
  onTaskCreated: (newTask: Task) => void;
}

export default function TaskForm({ userId, onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = await taskApi.createTask(userId, { title, description }) as Task;
      onTaskCreated(taskData);

      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-electric-600 to-electric-700 dark:from-electric-700 dark:to-electric-800 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Task</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Add a task to track and evaluate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-700 rounded-xl p-3 flex items-start space-x-2 animate-slide-down">
            <svg className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-danger-700 dark:text-danger-400">{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="task-title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Task Title *
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Complete project documentation"
            className="w-full px-4 py-3.5 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-electric-500 dark:focus:ring-electric-600 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="task-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            className="w-full px-4 py-3.5 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-electric-500 dark:focus:ring-electric-600 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all ${
              loading
                ? 'bg-electric-400 dark:bg-electric-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-700 hover:to-electric-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Task</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Press Enter to submit
          </p>
        </div>
      </form>
    </div>
  );
}