/**
 * Enhanced API Client with Comprehensive Error Handling
 * Production-ready error handling, retries, and user-friendly messages
 */
import axios, { AxiosError } from 'axios';

// Get base URL from environment variable
const getBaseURL = (): string => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) {
    console.error('NEXT_PUBLIC_API_URL is not set.');
    return 'http://localhost:8001';
  }
  return baseURL;
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && token.trim() !== '') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<any>>();

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');

          // Show a toast notification before redirecting
          const event = new CustomEvent('auth-expired', {
            detail: { message: 'Your session has expired. Please log in again.' }
          });
          window.dispatchEvent(event);

          // Delay redirect slightly to allow toast to show
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extract user-friendly error message from API error
 */
export function getErrorMessage(error: any): string {
  // Network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }
    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }
    return 'Unable to connect to the server. Please try again.';
  }

  // API error responses
  const response = error.response;

  // Use backend's structured error message if available
  if (response.data?.message) {
    return response.data.message;
  }

  // Fallback messages based on status code
  const statusMessages: { [key: number]: string } = {
    400: 'Invalid request. Please check your input.',
    401: 'Please log in to continue.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with existing data.',
    422: 'Invalid data provided. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again.',
    503: 'Service temporarily unavailable. Please try again later.'
  };

  return statusMessages[response.status] || 'An unexpected error occurred. Please try again.';
}

/**
 * Wrapper for API calls with automatic error handling
 */
export async function apiCall<T>(
  apiFunction: () => Promise<any>,
  errorMessage?: string
): Promise<T> {
  try {
    const response = await apiFunction();
    return response.data;
  } catch (error: any) {
    const message = errorMessage || getErrorMessage(error);
    throw new Error(message);
  }
}

// Export the configured API client
export default apiClient;

// API endpoints for tasks with error handling
export const taskApi = {
  getTasks: (userId: string) =>
    apiCall(() => apiClient.get(`/api/${userId}/tasks`), 'Failed to load tasks'),

  createTask: (userId: string, taskData: { title: string; description?: string }) =>
    apiCall(() => apiClient.post(`/api/${userId}/tasks`, taskData), 'Failed to create task'),

  getTask: (userId: string, taskId: string) =>
    apiCall(() => apiClient.get(`/api/${userId}/tasks/${taskId}`), 'Failed to load task'),

  updateTask: (userId: string, taskId: string, taskData: { title?: string; description?: string; completed?: boolean }) =>
    apiCall(() => apiClient.put(`/api/${userId}/tasks/${taskId}`, taskData), 'Failed to update task'),

  deleteTask: async (userId: string, taskId: string) => {
    // Prevent duplicate delete requests
    const requestKey = `delete-${userId}-${taskId}`;

    if (ongoingRequests.has(requestKey)) {
      // Return the existing promise to prevent duplicate requests
      return ongoingRequests.get(requestKey);
    }

    const requestPromise = apiCall(
      () => apiClient.delete(`/api/${userId}/tasks/${taskId}`),
      'Failed to delete task'
    ).finally(() => {
      // Clean up after request completes
      ongoingRequests.delete(requestKey);
    });

    ongoingRequests.set(requestKey, requestPromise);
    return requestPromise;
  },

  toggleTaskCompletion: async (userId: string, taskId: string, completed: boolean) => {
    // Prevent duplicate toggle requests
    const requestKey = `toggle-${userId}-${taskId}`;

    if (ongoingRequests.has(requestKey)) {
      return ongoingRequests.get(requestKey);
    }

    const requestPromise = apiCall(
      () => apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`, { completed }),
      'Failed to update task status'
    ).finally(() => {
      ongoingRequests.delete(requestKey);
    });

    ongoingRequests.set(requestKey, requestPromise);
    return requestPromise;
  },
};

// API endpoints for authentication
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      if (response.data.user?.id) {
        localStorage.setItem('userId', response.data.user.id);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  signup: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/register', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      if (response.data.user?.id) {
        localStorage.setItem('userId', response.data.user.id);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  },
};
