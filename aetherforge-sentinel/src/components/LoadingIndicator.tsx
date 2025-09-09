'use client';

import { motion } from 'framer-motion';
import { EmotionType } from '@/types';

interface LoadingIndicatorProps {
  emotion: EmotionType;
}

export function LoadingIndicator({ emotion }: LoadingIndicatorProps) {
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

  return (
    <div className="flex items-center gap-3 p-4 bg-aether-black/40 border border-aether-cyan/20 rounded-2xl backdrop-blur-sm">
      {/* Animated Dots */}
      <div className="flex items-center gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getEmotionColor(emotion) }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Loading Text */}
      <span className="text-sm text-aether-cyan/80">
        Forging response from the aether...
      </span>
      
      {/* Emotion Indicator */}
      <motion.div
        className="w-3 h-3 rounded-full border-2 border-aether-black"
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
    </div>
  );
}
