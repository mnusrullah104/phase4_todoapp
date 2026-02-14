'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { taskApi } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted, onTaskToggle }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    try {
      const taskData = await taskApi.updateTask(task.user_id, task.id, { title, description }) as Task;
      onTaskUpdated(taskData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsDeleting(true);
        await taskApi.deleteTask(task.user_id, task.id);
        onTaskDeleted(task.id);
      } catch (err) {
        console.error('Error deleting task:', err);
        setIsDeleting(false);
      }
    }
  };

  const handleToggleCompletion = async () => {
    try {
      await onTaskToggle(task.id, !task.completed);
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`group bg-white dark:bg-dark-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-soft dark:shadow-dark-soft hover:shadow-medium dark:hover:shadow-dark-medium transition-all border ${
      task.completed
        ? 'border-success-200 dark:border-success-800/50 bg-success-50/30 dark:bg-success-900/10'
        : 'border-gray-200 dark:border-dark-800 hover:border-electric-300 dark:hover:border-electric-700'
    } card-hover`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-electric-500 dark:focus:ring-electric-600 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-electric-500 dark:focus:ring-electric-600 focus:border-transparent transition-all resize-none text-gray-900 dark:text-gray-100"
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-700 hover:to-electric-800 text-white rounded-xl transition-all text-sm font-semibold shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all text-sm font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-4">
          {/* Custom Checkbox */}
          <button
            onClick={handleToggleCompletion}
            className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 ${
              task.completed
                ? 'bg-gradient-to-br from-success-500 to-success-600 border-success-500 dark:from-success-600 dark:to-success-700 dark:border-success-600 shadow-md'
                : 'border-gray-300 dark:border-dark-700 hover:border-electric-500 dark:hover:border-electric-600 hover:bg-electric-50 dark:hover:bg-electric-900/20'
            }`}
          >
            {task.completed && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Task Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-grow">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3 className={`text-sm sm:text-base font-bold ${
                    task.completed
                      ? 'line-through text-gray-500 dark:text-gray-600'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {task.title}
                  </h3>
                  {task.completed ? (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold badge-completed">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold badge-progress">
                      ⏱ In Progress
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className={`text-sm mt-1 leading-relaxed ${
                    task.completed
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center flex-wrap gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Created {formatDate(task.created_at)}</span>
                  </div>
                  {task.updated_at !== task.created_at && (
                    <div className="flex items-center space-x-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Updated {formatDate(task.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Always visible on mobile, hover on desktop */}
              <div className="flex items-center space-x-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 sm:p-2.5 text-gray-400 dark:text-gray-600 hover:text-electric-600 dark:hover:text-electric-400 hover:bg-electric-50 dark:hover:bg-electric-900/20 rounded-lg sm:rounded-xl transition-all"
                  title="Edit task"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${
                    isDeleting
                      ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                      : 'text-gray-400 dark:text-gray-600 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20'
                  }`}
                  title="Delete task"
                >
                  {isDeleting ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
