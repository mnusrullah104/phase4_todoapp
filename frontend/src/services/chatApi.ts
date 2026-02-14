/**
 * Chat API client for Phase III AI Chatbot Integration.
 *
 * Provides typed interface for chat endpoint communication.
 */

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ToolCall {
  tool: string;
  arguments: Record<string, any>;
}

export interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls: ToolCall[];
  timestamp: string;
}

export interface ChatError {
  detail: string;
}

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mnusrulah104-todoapp-chatbot.hf.space';

/**
 * Send a chat message to the backend.
 *
 * @param userId - User ID for the chat endpoint
 * @param request - Chat request with message and optional conversation_id
 * @param apiUrl - Optional API base URL (defaults to env variable or localhost)
 * @returns Promise resolving to ChatResponse
 * @throws Error if request fails
 */
export async function sendChatMessage(
  userId: string,
  request: ChatRequest,
  apiUrl: string = DEFAULT_API_URL
): Promise<ChatResponse> {
  const response = await fetch(`${apiUrl}/api/${userId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add JWT token from Better Auth
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error: ChatError = await response.json().catch(() => ({
      detail: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.detail);
  }

  return response.json();
}

/**
 * Get conversation history (future enhancement).
 *
 * @param userId - User ID
 * @param conversationId - Conversation ID
 * @param apiUrl - Optional API base URL
 * @returns Promise resolving to conversation messages
 */
export async function getConversationHistory(
  userId: string,
  conversationId: string,
  apiUrl: string = DEFAULT_API_URL
): Promise<any> {
  // TODO: Implement when backend endpoint is available
  throw new Error('Not implemented yet');
}

/**
 * List user's conversations (future enhancement).
 *
 * @param userId - User ID
 * @param apiUrl - Optional API base URL
 * @returns Promise resolving to list of conversations
 */
export async function listConversations(
  userId: string,
  apiUrl: string = DEFAULT_API_URL
): Promise<any> {
  // TODO: Implement when backend endpoint is available
  throw new Error('Not implemented yet');
}
