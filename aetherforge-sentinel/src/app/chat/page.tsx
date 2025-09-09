'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterface } from '@/components/ChatInterface';
import { MemoryCore } from '@/components/MemoryCore';
import { NebulaBackground } from '@/components/NebulaBackground';
import { PortalFrame } from '@/components/PortalFrame';
import { useChat } from '@/hooks/useChat';
import { Message, EmotionType } from '@/types';

export default function ChatPage() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [emotionIntensity, setEmotionIntensity] = useState(0.5);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    currentSession
  } = useChat();

  useEffect(() => {
    // Open portal with dramatic entrance
    const timer = setTimeout(() => {
      setIsPortalOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Update emotion based on last AI message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.emotion) {
        setCurrentEmotion(lastMessage.emotion);
        // You could also set intensity based on message metadata
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="min-h-screen relative overflow-hidden nebula-bg">
      {/* Cosmic Background with Emotion Reactivity */}
      <NebulaBackground 
        emotion={currentEmotion}
        intensity={emotionIntensity}
      />
      
      {/* Main Chat Layout */}
      <div className="relative z-10 min-h-screen flex">
        {/* Memory Core Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-80 min-h-screen p-6 hidden lg:block"
        >
          <MemoryCore 
            currentSession={currentSession}
            emotion={currentEmotion}
          />
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="p-6 text-center border-b border-aether-cyan/20"
          >
            <h1 className="text-3xl font-bold cosmic-text">
              Aether Portal
            </h1>
            <p className="text-aether-cyan/60 mt-2">
              Channeling intelligence from the digital aether
            </p>
          </motion.header>

          {/* Chat Interface */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex-1 p-6"
          >
            <PortalFrame isOpen={isPortalOpen}>
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onClearChat={clearChat}
              />
            </PortalFrame>
          </motion.div>
        </div>
      </div>

      {/* Emotion-reactive UI Elements */}
      <AnimatePresence>
        {currentEmotion !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed top-8 right-8 z-20"
          >
            <div 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{
                backgroundColor: getEmotionColor(currentEmotion),
                boxShadow: `0 0 20px ${getEmotionColor(currentEmotion)}`
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles that react to chat */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: getEmotionColor(currentEmotion, 0.3)
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Helper function to get emotion colors
function getEmotionColor(emotion: EmotionType, alpha: number = 1): string {
  const colors = {
    joy: '#FFD700',
    curiosity: '#00FFFF',
    concern: '#FF6B35',
    wisdom: '#8A2BE2',
    energy: '#39FF14',
    neutral: '#00FFFF'
  };
  
  const color = colors[emotion] || colors.neutral;
  
  if (alpha < 1) {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  return color;
}
