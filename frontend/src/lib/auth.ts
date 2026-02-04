// Frontend authentication utilities
// Production-ready auth management with JWT validation

// Helper function to decode JWT token
const decodeJWT = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT token format');
      return null;
    }

    const payload = parts[1];
    if (!payload) {
      console.warn('JWT payload is missing');
      return null;
    }

    // Replace URL-safe base64 characters back to standard base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Pad the base64 string if needed
    const pad = '='.repeat((4 - base64.length % 4) % 4);
    const base64Padded = base64 + pad;

    // Decode the base64 string
    const decoded = atob(base64Padded);
    const parsed = JSON.parse(decodeURIComponent(escape(decoded)));

    return parsed;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Auth utilities with production-ready features
export const authUtils = {
  // Check if user is authenticated with token expiration validation
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const token = localStorage.getItem('token');
      if (!token || token.trim() === '') return false;

      // Decode token and check expiration
      const decoded = decodeJWT(token);
      if (!decoded) {
        // Invalid token, remove it
        authUtils.removeToken();
        return false;
      }

      // Check if token has expired
      if (decoded.exp) {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        if (now >= decoded.exp) {
          // Token expired, remove it
          authUtils.removeToken();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      authUtils.removeToken();
      return false;
    }
  },

  // Get authentication token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;

    try {
      const token = localStorage.getItem('token');
      return token && token.trim() !== '' ? token : null;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  // Store authentication token
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;

    try {
      if (!token || token.trim() === '') {
        console.warn('Attempted to set empty token');
        return;
      }
      localStorage.setItem('token', token.trim());
    } catch (error) {
      console.error('Failed to set token:', error);
    }
  },

  // Remove authentication token
  removeToken: (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  // Get user info from token
  getUserInfo: () => {
    try {
      const token = authUtils.getToken();
      if (!token) return null;

      const decoded = decodeJWT(token);
      return decoded || null;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const token = authUtils.getToken();
      if (!token) return false;

      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) return false;

      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;
      return decoded.exp - now < fiveMinutes;
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return false;
    }
  }
};

// Auth API utilities
export const authApi = {
  logout: (): void => {
    try {
      authUtils.removeToken();

      // Dispatch custom event for cross-tab logout sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-logout'));
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
};

// Better Auth configuration (placeholder)
export const betterAuthConfig = {
  // In a real implementation, this would be the actual Better Auth client configuration
  baseUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  cookieName: 'better-auth-session',
  // Additional configuration would go here
};