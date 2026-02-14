/**
 * Toast Notification System
 * Production-ready toast notifications with animations
 */
'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  // Listen for auth expiration events
  useEffect(() => {
    const handleAuthExpired = (event: any) => {
      if (event.detail?.message) {
        showToast('warning', event.detail.message, 3000);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-expired', handleAuthExpired);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-expired', handleAuthExpired);
      }
    };
  }, [showToast]);

  const success = useCallback(
    (message: string, duration?: number) => showToast('success', message, duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => showToast('error', message, duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => showToast('warning', message, duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => showToast('info', message, duration),
    [showToast]
  );

  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
        text: 'text-green-800 dark:text-green-200'
      },
      error: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
        text: 'text-red-800 dark:text-red-200'
      },
      warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        icon: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        text: 'text-amber-800 dark:text-amber-200'
      },
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        text: 'text-blue-800 dark:text-blue-200'
      }
    };
    return styles[type];
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-xl shadow-lg p-4 min-w-[320px] max-w-md pointer-events-auto`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
                  <p className={`flex-1 text-sm font-medium ${styles.text}`}>
                    {toast.message}
                  </p>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
