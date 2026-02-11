'use client';

import { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ChatWidget from '@/components/ChatWidget';
import { authUtils } from '@/lib/auth';
import { createTestToken } from '@/lib/test-auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // TODO: Replace with actual authenticated user ID from Better Auth
  // For now, using a placeholder. In production, this should come from auth context
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';

  // Auto-setup test authentication when userId is present but no token exists
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      const hasToken = authUtils.isAuthenticated();
      if (!hasToken) {
        // Create test token for development
        const token = createTestToken(userId, 'test@example.com');
        authUtils.setToken(token);
        console.log('✅ Test authentication auto-configured for userId:', userId);
      }
    }
  }, [userId]);

  return (
    <ThemeProvider>
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      {/* Phase III - AI Chatbot Widget */}
      {userId && <ChatWidget userId={userId} />}
    </ThemeProvider>
  );
}
