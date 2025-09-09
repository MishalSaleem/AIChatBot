'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PortalFrameProps {
  children: ReactNode;
  isOpen: boolean;
}

export function PortalFrame({ children, isOpen }: PortalFrameProps) {
  return (
    <motion.div
      className="relative w-full h-full portal-frame overflow-hidden"
      initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
      animate={{ 
        scale: isOpen ? 1 : 0.8, 
        opacity: isOpen ? 1 : 0,
        rotateY: isOpen ? 0 : -90
      }}
      transition={{ 
        duration: 1.2, 
        ease: "easeOut",
        delay: 0.3
      }}
    >
      {/* Portal Glow Effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 animate-pulse">
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1), transparent)',
            filter: 'blur(20px)'
          }}
        />
      </div>

      {/* Portal Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-aether-cyan/50"
        animate={{
          borderColor: [
            'rgba(0, 255, 255, 0.5)',
            'rgba(255, 0, 255, 0.5)',
            'rgba(255, 215, 0, 0.5)',
            'rgba(0, 255, 255, 0.5)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-aether-cyan to-transparent"
        animate={{
          y: [0, '100%', 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          delay: 1
        }}
      />

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-aether-cyan/60 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-aether-cyan/60 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-aether-cyan/60 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-aether-cyan/60 rounded-br-3xl" />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-aether-cyan rounded-full"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 20}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
