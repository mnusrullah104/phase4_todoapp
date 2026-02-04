// Centralized API client with JWT injection
import axios from 'axios';

// Get base URL from environment variable
const getBaseURL = (): string => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseURL) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not set.');
    // In a development environment, you might want to default to a local URL
    // but for production, it's better to fail fast.
    return 'http://localhost:8001'; // Fallback for local dev if not set
  }
  return baseURL;
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
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

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export the configured API client
export default apiClient;

// API endpoints for tasks
export const taskApi = {
  getTasks: (userId: string) => apiClient.get(`/api/${userId}/tasks`),
  createTask: (userId: string, taskData: { title: string; description?: string }) =>
    apiClient.post(`/api/${userId}/tasks`, taskData),
  getTask: (userId:string, taskId: string) => apiClient.get(`/api/${userId}/tasks/${taskId}`),
  updateTask: (userId: string, taskId: string, taskData: { title?: string; description?: string; completed?: boolean }) =>
    apiClient.put(`/api/${userId}/tasks/${taskId}`, taskData),
  deleteTask: (userId: string, taskId: string) => apiClient.delete(`/api/${userId}/tasks/${taskId}`),
  toggleTaskCompletion: (userId: string, taskId: string, completed: boolean) =>
    apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`, { completed }),
};

// API endpoints for authentication
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  signup: async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/register', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};