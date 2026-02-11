/**
 * Test Authentication Helper for Phase 3 Development
 *
 * This creates a mock JWT token for testing purposes.
 * In production, this will be replaced with real Better Auth integration.
 */

import { authUtils } from './auth';

/**
 * Create a test JWT token from a userId
 * This is a simple base64-encoded token for development only
 */
export function createTestToken(userId: string, email: string = 'test@example.com'): string {
  // Create a mock JWT payload
  const payload = {
    sub: userId,
    email: email,
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // Expires in 1 year
    iat: Math.floor(Date.now() / 1000),
    iss: 'phase3-test'
  };

  // Create a simple mock JWT (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa('test-signature');

  return `${header}.${payloadEncoded}.${signature}`;
}

/**
 * Setup test authentication for development
 * Call this in the browser console to enable full app access
 */
export function setupTestAuth(userId?: string): void {
  const testUserId = userId || '123e4567-e89b-12d3-a456-426614174000';
  const testEmail = 'test@example.com';

  // Create and store test token
  const token = createTestToken(testUserId, testEmail);
  authUtils.setToken(token);

  // Also store userId for chatbot compatibility
  localStorage.setItem('userId', testUserId);

  console.log('✅ Test authentication setup complete!');
  console.log('User ID:', testUserId);
  console.log('Email:', testEmail);
  console.log('You can now access all pages. Refresh to apply changes.');
}

/**
 * Quick setup function to expose globally
 */
if (typeof window !== 'undefined') {
  (window as any).setupTestAuth = setupTestAuth;
}
