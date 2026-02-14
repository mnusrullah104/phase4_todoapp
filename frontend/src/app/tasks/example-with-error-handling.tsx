/**
 * Example: Tasks Page with Complete Error Handling
 * Shows how to use Toast notifications, ConfirmModal, and loading states
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { taskApi } from '@/lib/api';
import { authUtils } from '@/lib/auth';
import { Task } from '@/lib/types';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function TasksPageExample() {
  const router = useRouter();
  const toast = useToast();

  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = authUtils.getUserInfo();
    if (userInfo?.sub) {
      setUserId(userInfo.sub);
      loadTasks(userInfo.sub);
    }
  }, [router]);

  const loadTasks = async (uid: string) => {
    try {
      setLoading(true);
      const data = await taskApi.getTasks(uid) as Task[];
      setTasks(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!userId) return;

    try {
      setActionLoading('create');
      const newTask = await taskApi.createTask(userId, {
        title: 'New Task',
        description: 'Task description'
      }) as Task;
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    if (!userId) return;

    try {
      setActionLoading(taskId);
      await taskApi.toggleTaskCompletion(userId, taskId, !currentStatus);

      // Optimistic update
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );

      toast.success(
        !currentStatus ? 'Task marked as complete!' : 'Task marked as incomplete'
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
      // Revert on error
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: currentStatus } : task
        )
      );
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteModal = (taskId: string, taskTitle: string) => {
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      taskId: null,
      taskTitle: ''
    });
  };

  const handleDeleteTask = async () => {
    if (!userId || !deleteModal.taskId) return;

    try {
      setActionLoading('delete');
      await taskApi.deleteTask(userId, deleteModal.taskId);

      // Remove from UI
      setTasks(prev => prev.filter(task => task.id !== deleteModal.taskId));
      toast.success('Task deleted successfully!');
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Tasks
          </h1>
          <button
            onClick={handleCreateTask}
            disabled={actionLoading === 'create'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {actionLoading === 'create' ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                New Task
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                  disabled={actionLoading === task.id}
                  className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-400 transition-colors disabled:opacity-50"
                >
                  {task.completed && (
                    <CheckCircle2 className="w-full h-full text-blue-600" />
                  )}
                </button>

                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => openDeleteModal(task.id, task.title)}
                  disabled={actionLoading !== null}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={actionLoading === 'delete'}
        variant="danger"
      />
    </div>
  );
}
