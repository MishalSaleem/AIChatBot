'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Input Field */}
        <motion.textarea
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="w-full px-4 py-3 pr-24 bg-white/10 border-2 rounded-2xl text-white placeholder-white/40 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
          style={{
            borderColor: isTyping ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
            boxShadow: isTyping 
              ? '0 0 20px rgba(168, 85, 247, 0.2)'
              : '0 0 10px rgba(255, 255, 255, 0.1)'
          }}
          rows={1}
        />

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-xl text-white hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            backgroundColor: isTyping ? 'rgba(168, 85, 247, 0.2)' : 'transparent'
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={20} />
            </motion.div>
          ) : (
            <Send size={20} />
          )}
        </motion.button>

        {/* Voice Button */}
        <motion.button
          type="button"
          className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-xl text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Mic size={20} />
        </motion.button>
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-6 left-4 text-xs text-white/60"
          >
            <span className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
              Typing...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}