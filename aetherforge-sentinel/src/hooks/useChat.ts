import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, ChatSession, EmotionType } from '@/types';
import { aiService } from '@/lib/ai-service';
import { generateId, generateConversationTitle, saveToLocalStorage, getFromLocalStorage } from '@/lib/utils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = getFromLocalStorage<ChatSession[]>('chat-sessions', []);
    setSessions(savedSessions);
    
    // Create new session if none exist
    if (sessions.length === 0) {
      createNewSession();
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      saveToLocalStorage('chat-sessions', sessions);
    }
  }, [sessions]);

  // Create a new chat session
  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      emotionHistory: [],
      userPreferences: {
        responseLength: 'detailed',
        tone: 'casual',
        language: 'en',
        theme: 'dark',
        animations: true,
        soundEffects: true
      }
    };
    
    setCurrentSession(newSession);
    setSessions(prev => [newSession, ...prev]);
    setMessages([]);
    setError(null);
  }, []);

  // Load a specific session
  const loadSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setMessages(session.messages);
      setError(null);
    }
  }, [sessions]);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      createNewSession();
    }
  }, [currentSession, createNewSession]);

  // Update session title
  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title, updatedAt: new Date() } : s
    ));
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, title, updatedAt: new Date() } : null);
    }
  }, [currentSession]);

  // Send a message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      emotion: 'neutral'
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      let aiResponse = '';
      const aiMessage: Message = {
        id: generateId(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        emotion: 'neutral'
      };

      // Add empty AI message for streaming
      setMessages(prev => [...prev, aiMessage]);

      // Stream AI response
      const response = await aiService.generateResponse(
        [...messages, userMessage],
        (chunk) => {
          aiResponse += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: aiResponse }
              : msg
          ));
        },
        (aiResponseData) => {
          // Update message with emotion and final content
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id 
              ? { 
                  ...msg, 
                  content: aiResponseData.content,
                  emotion: aiResponseData.emotion,
                  metadata: {
                    responseTime: Date.now() - aiMessage.timestamp.getTime(),
                    tokens: aiResponseData.usage.totalTokens,
                    model: aiResponseData.model
                  }
                }
              : msg
          ));
        }
      );

      // Update session with new messages
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: [...messages, userMessage, { ...aiMessage, content: aiResponse, emotion: aiResponseData.emotion }],
          updatedAt: new Date(),
          title: currentSession.title === 'New Conversation' 
            ? generateConversationTitle(content)
            : currentSession.title
        };
        
        setCurrentSession(updatedSession);
        setSessions(prev => prev.map(s => 
          s.id === currentSession.id ? updatedSession : s
        ));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Remove the empty AI message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== aiMessage.id));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, currentSession]);

  // Clear current chat
  const clearChat = useCallback(() => {
    if (currentSession) {
      const clearedSession = {
        ...currentSession,
        messages: [],
        updatedAt: new Date()
      };
      
      setCurrentSession(clearedSession);
      setSessions(prev => prev.map(s => 
        s.id === currentSession.id ? clearedSession : s
      ));
      setMessages([]);
    }
  }, [currentSession]);

  // Regenerate last AI response
  const regenerateResponse = useCallback(async () => {
    if (messages.length === 0) return;
    
    const lastUserMessage = messages.findLast(msg => msg.role === 'user');
    if (!lastUserMessage) return;
    
    // Remove last AI response
    const messagesWithoutLastAI = messages.filter((msg, index) => {
      if (msg.role === 'assistant') {
        const nextUserIndex = messages.findIndex((m, i) => i > index && m.role === 'user');
        return nextUserIndex === -1; // Keep if it's the last assistant message
      }
      return true;
    });
    
    setMessages(messagesWithoutLastAI);
    
    // Send the message again
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  // Get conversation suggestions
  const getSuggestions = useCallback(async (): Promise<string[]> => {
    if (messages.length === 0) return [];
    
    const recentMessages = messages.slice(-3);
    const context = recentMessages.map(m => m.content).join(' ');
    
    try {
      return await aiService.generateSuggestions(context);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }, [messages]);

  // Export chat history
  const exportChat = useCallback(() => {
    if (!currentSession) return;
    
    const chatData = {
      session: currentSession,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aetherforge-chat-${currentSession.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentSession,
    sessions,
    sendMessage,
    clearChat,
    createNewSession,
    loadSession,
    deleteSession,
    updateSessionTitle,
    regenerateResponse,
    getSuggestions,
    exportChat
  };
}
