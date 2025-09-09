'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  MessageCircle, 
  Brain, 
  Settings, 
  Zap, 
  Sparkles,
  Shield,
  Eye,
  Heart
} from 'lucide-react';

interface Orb {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const orbs: Orb[] = [
  {
    id: 'chat',
    icon: <MessageCircle size={24} />,
    title: 'Intelligent Chat',
    description: 'Advanced AI conversations with emotion detection',
    color: '#00FFFF',
    delay: 0
  },
  {
    id: 'ai',
    icon: <Brain size={24} />,
    title: 'AI Sentinel',
    description: 'Your guardian in the digital aether',
    color: '#FF00FF',
    delay: 0.2
  },
  {
    id: 'settings',
    icon: <Settings size={24} />,
    title: 'Adaptive UI',
    description: 'Interface that responds to your emotions',
    color: '#FFD700',
    delay: 0.4
  },
  {
    id: 'performance',
    icon: <Zap size={24} />,
    title: 'Lightning Fast',
    description: 'Optimized for seamless performance',
    color: '#39FF14',
    delay: 0.6
  },
  {
    id: 'magic',
    icon: <Sparkles size={24} />,
    title: 'Cosmic Magic',
    description: '3D nebula backgrounds and particle effects',
    color: '#8A2BE2',
    delay: 0.8
  },
  {
    id: 'security',
    icon: <Shield size={24} />,
    title: 'Secure & Private',
    description: 'Your conversations stay protected',
    color: '#FF6B35',
    delay: 1.0
  },
  {
    id: 'vision',
    icon: <Eye size={24} />,
    title: 'Future Vision',
    description: 'Cutting-edge technology ahead of its time',
    color: '#00FF80',
    delay: 1.2
  },
  {
    id: 'heart',
    icon: <Heart size={24} />,
    title: 'Emotion Aware',
    description: 'AI that understands and responds to feelings',
    color: '#FF1493',
    delay: 1.4
  }
];

export function FloatingOrbs() {
  const [hoveredOrb, setHoveredOrb] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            initial={{ 
              opacity: 0, 
              y: 50, 
              scale: 0.5,
              rotate: -180
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotate: 0
            }}
            transition={{ 
              duration: 1, 
              delay: orb.delay,
              ease: "back.out(1.7)"
            }}
            whileHover={{ 
              scale: 1.1,
              y: -10,
              rotate: 5
            }}
            onHoverStart={() => setHoveredOrb(orb.id)}
            onHoverEnd={() => setHoveredOrb(null)}
            className="relative group cursor-pointer"
          >
            {/* Orb Container */}
            <motion.div
              className="relative w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${orb.color}40, ${orb.color}20, ${orb.color}10)`,
                border: `2px solid ${orb.color}60`,
                boxShadow: `
                  0 0 20px ${orb.color}40,
                  0 0 40px ${orb.color}20,
                  inset 0 0 20px ${orb.color}20
                `
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${orb.color}40, 0 0 40px ${orb.color}20, inset 0 0 20px ${orb.color}20`,
                  `0 0 30px ${orb.color}60, 0 0 60px ${orb.color}30, inset 0 0 30px ${orb.color}30`,
                  `0 0 20px ${orb.color}40, 0 0 40px ${orb.color}20, inset 0 0 20px ${orb.color}20`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Icon */}
              <motion.div
                className="text-white"
                animate={{
                  scale: hoveredOrb === orb.id ? [1, 1.2, 1] : 1,
                  rotate: hoveredOrb === orb.id ? [0, 10, -10, 0] : 0
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                {orb.icon}
              </motion.div>

              {/* Orb Glow Effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${orb.color}30, transparent)`,
                  filter: 'blur(10px)'
                }}
              />
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-center text-sm font-semibold text-aether-cyan mb-2"
              animate={{
                color: hoveredOrb === orb.id ? orb.color : '#00FFFF'
              }}
              transition={{ duration: 0.3 }}
            >
              {orb.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-center text-xs text-aether-cyan/60 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredOrb === orb.id ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {orb.description}
            </motion.p>

            {/* Hover Particles */}
            {hoveredOrb === orb.id && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: orb.color,
                      left: '50%',
                      top: '50%'
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{
                      x: (Math.cos(i * Math.PI / 4) * 60),
                      y: (Math.sin(i * Math.PI / 4) * 60),
                      opacity: 0,
                      scale: 1
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {orbs.map((otherOrb) => {
                if (otherOrb.id === orb.id) return null;
                
                const currentIndex = orbs.findIndex(o => o.id === orb.id);
                const otherIndex = orbs.findIndex(o => o.id === otherOrb.id);
                
                if (Math.abs(currentIndex - otherIndex) === 1 || 
                    Math.abs(currentIndex - otherIndex) === 4) {
                  return (
                    <motion.line
                      key={`${orb.id}-${otherOrb.id}`}
                      x1="50%"
                      y1="50%"
                      x2="50%"
                      y2="50%"
                      stroke={orb.color}
                      strokeWidth="1"
                      opacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 1,
                        delay: Math.max(orb.delay, otherOrb.delay) + 0.5
                      }}
                    />
                  );
                }
                return null;
              })}
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Central Energy Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.2), rgba(255, 215, 0, 0.1))',
          border: '2px solid rgba(0, 255, 255, 0.5)'
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
          rotate: [0, 360]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aether-cyan to-aether-magenta animate-pulse" />
      </motion.div>
    </div>
  );
}
