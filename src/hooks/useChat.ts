import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, ChatSession } from '@/types';
import { aiService } from '@/lib/ai-service';
import { generateId, generateConversationTitle, saveToLocalStorage, getFromLocalStorage } from '@/lib/utils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      emotionHistory: [],
      userPreferences: { responseLength: 'detailed', tone: 'casual', language: 'en', theme: 'dark', animations: true, soundEffects: true }
    };
    
    setSessions(prev => [newSession, ...prev.filter(p => p.messages.length > 0)]);
    setCurrentSession(newSession);
    setMessages([]);
    setError(null);
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    const sessionToLoad = getFromLocalStorage<ChatSession[]>('chat-sessions', []).find(s => s.id === sessionId);
    if (sessionToLoad) {
      setCurrentSession(sessionToLoad);
      setMessages(sessionToLoad.messages);
      setError(null);
    }
  }, []);

  useEffect(() => {
    const savedSessions = getFromLocalStorage<ChatSession[]>('chat-sessions', []);
    setSessions(savedSessions);
    if (savedSessions.length > 0) {
      loadSession(savedSessions[0].id);
    } else {
      createNewSession();
    }
  }, [loadSession, createNewSession]);

  useEffect(() => {
    if (sessions.length > 0) {
      saveToLocalStorage('chat-sessions', sessions);
    }
  }, [sessions]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !currentSession) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    let aiMessage: Message = {
      id: generateId(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    };

    try {
      abortControllerRef.current = new AbortController();
      let aiResponseContent = '';
      
      // Add empty AI message for streaming updates
      setMessages(prev => [...prev, aiMessage]);

      await aiService.generateResponse(
        updatedMessages,
        (chunk) => {
          // Update message content as chunks arrive
          if (chunk && chunk.length > 0) {
            aiResponseContent += chunk;
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, content: aiResponseContent }
                : msg
            ));
          }
        },
        (aiResponseData) => {
          // Only process complete response if it has content
          if (aiResponseData && aiResponseData.content) {
            const finalAiMessage = {
              ...aiMessage,
              content: aiResponseData.content,
              emotion: aiResponseData.emotion || 'neutral',
              metadata: {
                responseTime: Date.now() - aiMessage.timestamp.getTime(),
                tokens: aiResponseData.usage?.totalTokens || aiResponseData.content.length,
                model: aiResponseData.model || 'ai-model'
              }
            };
            
            // Update the message with final content and metadata
            setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? finalAiMessage : msg));

            // Update session with new messages
            if (currentSession) {
              const finalMessages = [...updatedMessages, finalAiMessage];
              const updatedSession = {
                ...currentSession,
                messages: finalMessages,
                updatedAt: new Date(),
                title: currentSession.title === 'New Conversation' 
                  ? generateConversationTitle(content)
                  : currentSession.title,
                emotionHistory: [
                  ...(currentSession.emotionHistory || []),
                  { 
                    type: finalAiMessage.emotion || 'neutral', 
                    confidence: aiResponseData.confidence || 1,
                    intensity: 0.8,
                    color: '#4a90e2'
                  }
                ]
              };
              
              setCurrentSession(updatedSession);
              setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
            }
          }
        }
      );

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        setMessages(prev => prev.filter(msg => msg.id !== aiMessage.id));
        return;
      }

      console.error('Error sending message:', error);
      
      // Create an error message from the AI
      const errorMessage = {
        ...aiMessage,
        content: `I'm sorry, I encountered an error: ${error.message || 'Failed to generate a response'}. Please try again later.`,
        emotion: 'concern'
      };
      
      // Show the error as an AI message instead of removing it
      setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? errorMessage : msg));
      setError(error instanceof Error ? error.message : 'Failed to get a response');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, currentSession]);

  const clearChat = useCallback(() => {
    if (currentSession) {
      const clearedSession = { ...currentSession, messages: [] };
      setCurrentSession(clearedSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? clearedSession : s));
      setMessages([]);
      setError(null);
    }
  }, [currentSession]);

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
  };
}