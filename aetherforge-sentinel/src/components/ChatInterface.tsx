'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, EmotionType } from '@/types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { MessageSuggestions } from './MessageSuggestions';
import { LoadingIndicator } from './LoadingIndicator';


interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  currentEmotion: EmotionType;
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  currentEmotion
}: ChatInterfaceProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // Show suggestions when no messages or after AI response
  useEffect(() => {
    if (messages.length === 0) {
      setSuggestions([
        "Tell me about artificial intelligence",
        "What's the future of technology?",
        "Help me with a creative project",
        "Explain quantum computing",
        "Share an interesting fact"
      ]);
      setShowSuggestions(true);
    } else if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setShowSuggestions(false);
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    onSendMessage(content);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-aether-cyan/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-aether-cyan animate-pulse" />
          <h2 className="text-lg font-semibold text-aether-cyan">
            Aether Portal Active
          </h2>
        </div>
        
        <motion.button
          onClick={onClearChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 text-sm text-aether-cyan/60 hover:text-aether-cyan border border-aether-cyan/30 rounded-lg hover:border-aether-cyan/50 transition-colors"
        >
          Clear Chat
        </motion.button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollAreaRef} className="h-full p-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="mb-4"
              >
                <ChatBubble
                  message={message}
                  isLast={index === messages.length - 1}
                  currentEmotion={currentEmotion}
                />
              </motion.div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <LoadingIndicator emotion={currentEmotion} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <MessageSuggestions
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                currentEmotion={currentEmotion}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-aether-cyan/20">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Emotion Indicator */}
      <AnimatePresence>
        {currentEmotion !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute bottom-4 right-4"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-aether-black/80 border border-aether-cyan/30 rounded-full backdrop-blur-sm">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: getEmotionColor(currentEmotion),
                  boxShadow: `0 0 10px ${getEmotionColor(currentEmotion)}`
                }}
              />
              <span className="text-xs text-aether-cyan capitalize">
                {currentEmotion}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to get emotion colors
function getEmotionColor(emotion: EmotionType): string {
  const colors = {
    joy: '#FFD700',
    curiosity: '#00FFFF',
    concern: '#FF6B35',
    wisdom: '#8A2BE2',
    energy: '#39FF14',
    neutral: '#00FFFF'
  };
  
  return colors[emotion] || colors.neutral;
}
