'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types';
import { User, Bot, Stars, BarChart3, Zap } from 'lucide-react';
import { detectEmotion } from '@/lib/utils';

interface ChatBubbleProps {
  message: Message;
  isLast: boolean;
}

export function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const [typedContent, setTypedContent] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [glowColors, setGlowColors] = useState<string[]>(['#00FFFF', '#FF00FF']);
  
  // Detect message emotion
  const emotion = message.emotion || (isUser ? 'neutral' : detectEmotion(message.content).type);
  
  // Map emotions to color schemes
  const emotionColors = {
    joy: { primary: '#FFD700', secondary: '#FFA500', accent: '#FFFF00' },
    curiosity: { primary: '#00FFFF', secondary: '#0080FF', accent: '#00FF80' },
    concern: { primary: '#FF6B35', secondary: '#FF4500', accent: '#FF8C00' },
    wisdom: { primary: '#8A2BE2', secondary: '#9370DB', accent: '#BA55D3' },
    energy: { primary: '#39FF14', secondary: '#00FF00', accent: '#32CD32' },
    neutral: { primary: '#00FFFF', secondary: '#0080FF', accent: '#00FF80' }
  };
  
  const colors = emotionColors[emotion as keyof typeof emotionColors] || emotionColors.neutral;

  // Typing animation for AI messages
  useEffect(() => {
    if (!isUser && isLast && message.content) {
      const text = message.content;
      let currentIndex = 0;
      
      // Start with empty string
      setTypedContent('');
      
      // Type characters gradually
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypedContent(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 10); // Typing speed
      
      return () => clearInterval(typingInterval);
    } else {
      setTypedContent(message.content);
    }
  }, [message.content, isUser, isLast]);

  // Update glow colors based on emotion
  useEffect(() => {
    if (!isUser) {
      setGlowColors([colors.primary, colors.secondary]);
    }
  }, [isUser, colors]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        type: "spring", 
        stiffness: 120, 
        damping: 10 
      }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className={`flex gap-3 group ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0 relative overflow-hidden"
          style={{
            boxShadow: `0 0 10px ${colors.primary}50, 0 0 20px ${colors.secondary}30`
          }}
        >
          {/* Animated background for AI avatar */}
          <div className="absolute inset-0 opacity-50">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-white/30"
                style={{ top: `${i * 20}%` }}
                animate={{ 
                  left: ["-100%", "100%"],
                  opacity: [0.1, 0.5, 0.1]
                }}
                transition={{ 
                  duration: 2 + i, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          
          {/* AI Icon with subtle animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="w-5 h-5 text-white drop-shadow-glow" />
          </motion.div>
          
          {/* Pulsing effect */}
          <motion.div 
            className="absolute inset-0 rounded-xl"
            animate={{ 
              boxShadow: [
                `inset 0 0 5px ${colors.primary}50`,
                `inset 0 0 15px ${colors.secondary}70`,
                `inset 0 0 5px ${colors.primary}50`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
      
      {/* Message Bubble */}
      <motion.div
        className={`relative max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white'
            : 'bg-black/20 backdrop-blur-xl text-white border border-white/10'
        }`}
        style={{
          boxShadow: isUser 
            ? '0 4px 15px rgba(123, 31, 162, 0.5)'
            : `0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px ${colors.primary}20, 0 0 40px ${colors.secondary}10`
        }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Background accent for AI messages */}
        {!isUser && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden -z-10">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br" 
              style={{ 
                backgroundImage: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})` 
              }}
            />
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.accent}40, transparent)`,
                transform: 'skewX(-45deg)',
                transformOrigin: 'top left'
              }}
              animate={{ left: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            />
          </div>
        )}

        {/* Message Content */}
        <div 
          className={`text-sm leading-relaxed whitespace-pre-wrap ${!isUser && 'font-light'}`}
          style={{
            textShadow: isUser ? 'none' : '0 0 10px rgba(255,255,255,0.3)'
          }}
        >
          {isUser || !isLast ? message.content : typedContent}
          
          {/* Typing cursor for AI responses */}
          {!isUser && isLast && typedContent.length < message.content.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-white ml-0.5"
            />
          )}
        </div>
        
        {/* Metadata with visualizations */}
        {message.metadata && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="mt-2 pt-2 border-t border-white/10 text-xs text-white/60"
          >
            <div className="flex items-center gap-3">
              {message.metadata.model && (
                <div className="flex items-center gap-1">
                  <Stars className="w-3 h-3" />
                  <span>{message.metadata.model}</span>
                </div>
              )}
              
              {message.metadata.responseTime && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{(message.metadata.responseTime / 1000).toFixed(1)}s</span>
                </div>
              )}
              
              {message.metadata.tokens && (
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>{message.metadata.tokens} tokens</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Interactive action buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-10 left-0 flex items-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              >
                <Stars className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* User Avatar */}
      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          <User className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}