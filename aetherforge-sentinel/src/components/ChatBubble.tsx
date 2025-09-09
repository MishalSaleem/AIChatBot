'use client';

import { motion } from 'framer-motion';
import { Message, EmotionType } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isLast: boolean;
  currentEmotion: EmotionType;
}

export function ChatBubble({ message, isLast, currentEmotion }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const emotion = message.emotion || 'neutral';

  const getEmotionColor = (emotion: EmotionType) => {
    const colors = {
      joy: '#FFD700',
      curiosity: '#00FFFF',
      concern: '#FF6B35',
      wisdom: '#8A2BE2',
      energy: '#39FF14',
      neutral: '#00FFFF'
    };
    return colors[emotion] || colors.neutral;
  };

  const getEmotionGlow = (emotion: EmotionType) => {
    const color = getEmotionColor(emotion);
    return `0 0 20px ${color}40, 0 0 40px ${color}20`;
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <motion.div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            isUser 
              ? 'bg-aether-cyan/20 border-aether-cyan/50' 
              : 'bg-aether-magenta/20 border-aether-magenta/50'
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {isUser ? (
            <User size={20} className="text-aether-cyan" />
          ) : (
            <Bot size={20} className="text-aether-magenta" />
          )}
        </motion.div>

        {/* Message Content */}
        <motion.div
          className={`relative rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-aether-cyan/20 border border-aether-cyan/30' 
              : 'bg-aether-black/60 border border-aether-magenta/30 backdrop-blur-sm'
          }`}
          style={{
            boxShadow: isUser 
              ? '0 4px 20px rgba(0, 255, 255, 0.2)'
              : getEmotionGlow(emotion)
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: isUser 
              ? '0 6px 25px rgba(0, 255, 255, 0.3)'
              : `0 6px 25px ${getEmotionColor(emotion)}50`
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Message Text */}
          <div className="text-sm leading-relaxed">
            {isUser ? (
              <span className="text-aether-cyan">{message.content}</span>
            ) : (
              <div className="text-aether-cyan/90">
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-aether-cyan/40 mt-2 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTimestamp(message.timestamp)}
          </div>

          {/* Emotion Indicator for AI messages */}
          {!isUser && emotion !== 'neutral' && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-aether-black"
              style={{
                backgroundColor: getEmotionColor(emotion),
                boxShadow: `0 0 10px ${getEmotionColor(emotion)}`
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Message Tail */}
          <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
            isUser 
              ? 'right-[-6px] bg-aether-cyan/20 border-r border-b border-aether-cyan/30' 
              : 'left-[-6px] bg-aether-black/60 border-l border-t border-aether-magenta/30'
          }`} />

          {/* Particle Effects for AI messages */}
          {!isUser && isLast && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: getEmotionColor(emotion),
                    left: `${20 + i * 15}%`,
                    top: '50%'
                  }}
                  initial={{
                    y: 0,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    y: [-20, -40, -60],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
