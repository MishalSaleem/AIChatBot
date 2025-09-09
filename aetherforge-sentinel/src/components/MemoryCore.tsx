'use client';

import { motion } from 'framer-motion';
import { ChatSession, EmotionType } from '@/types';
import { Brain, History, Settings, Sparkles } from 'lucide-react';

interface MemoryCoreProps {
  currentSession: ChatSession | null;
  emotion: EmotionType;
}

export function MemoryCore({ currentSession, emotion }: MemoryCoreProps) {
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
    <div className="h-full space-y-6">
      {/* Memory Core Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-4">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-aether-cyan/50"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-aether-cyan/20 to-aether-magenta/20 flex items-center justify-center">
            <Brain size={32} className="text-aether-cyan" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-aether-cyan mb-2">
          Memory Core
        </h2>
        <p className="text-sm text-aether-cyan/60">
          Neural pathways and conversation history
        </p>
      </motion.div>

      {/* Current Session Info */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-aether-black/40 border border-aether-cyan/20 rounded-2xl p-4"
        >
          <h3 className="text-sm font-semibold text-aether-cyan mb-3 flex items-center gap-2">
            <History size={16} />
            Active Session
          </h3>
          <div className="space-y-2 text-xs text-aether-cyan/80">
            <p><span className="text-aether-cyan/60">Title:</span> {currentSession.title}</p>
            <p><span className="text-aether-cyan/60">Messages:</span> {currentSession.messages.length}</p>
            <p><span className="text-aether-cyan/60">Created:</span> {currentSession.createdAt.toLocaleDateString()}</p>
          </div>
        </motion.div>
      )}

      {/* Emotion Visualization */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="bg-aether-black/40 border border-aether-cyan/20 rounded-2xl p-4"
      >
        <h3 className="text-sm font-semibold text-aether-cyan mb-3 flex items-center gap-2">
          <Sparkles size={16} />
          Current Emotion
        </h3>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-full border-2 border-aether-black"
            style={{
              backgroundColor: getEmotionColor(emotion),
              boxShadow: `0 0 20px ${getEmotionColor(emotion)}`
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
          <div>
            <p className="text-sm font-medium text-aether-cyan capitalize">
              {emotion}
            </p>
            <p className="text-xs text-aether-cyan/60">
              AI emotional state
            </p>
          </div>
        </div>
      </motion.div>

      {/* Neural Network Visualization */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="bg-aether-black/40 border border-aether-cyan/20 rounded-2xl p-4"
      >
        <h3 className="text-sm font-semibold text-aether-cyan mb-3 flex items-center gap-2">
          <Settings size={16} />
          Neural Pathways
        </h3>
        <div className="relative h-32">
          {/* Neural Network Nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-aether-cyan rounded-full"
              style={{
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 40}%`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.line
              x1="35%"
              y1="20%"
              x2="35%"
              y2="60%"
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
            />
            <motion.line
              x1="35%"
              y1="20%"
              x2="65%"
              y2="20%"
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.8 }}
            />
            <motion.line
              x1="65%"
              y1="20%"
              x2="65%"
              y2="60%"
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 2.1 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Memory Stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="bg-aether-black/40 border border-aether-cyan/20 rounded-2xl p-4"
      >
        <h3 className="text-sm font-semibold text-aether-cyan mb-3">
          Memory Statistics
        </h3>
        <div className="space-y-2 text-xs text-aether-cyan/80">
          <div className="flex justify-between">
            <span>Conversations:</span>
            <span className="text-aether-cyan">1</span>
          </div>
          <div className="flex justify-between">
            <span>Total Messages:</span>
            <span className="text-aether-cyan">{currentSession?.messages.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory Usage:</span>
            <span className="text-aether-cyan">2.4 MB</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
