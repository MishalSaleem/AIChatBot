'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NebulaBackground } from '@/components/NebulaBackground';
import { HolographicText } from '@/components/HolographicText';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { RiftButton } from '@/components/RiftButton';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setShowContent(true), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterRealm = () => {
    // Trigger rift opening animation
    setShowContent(false);
    setTimeout(() => {
      router.push('/chat');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden nebula-bg">
      {/* Cosmic Background */}
      <NebulaBackground />
      
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-aether-black"
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 border-4 border-aether-cyan rounded-full border-t-transparent mx-auto mb-4"
              />
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-aether-cyan text-lg font-light"
              >
                Initializing AetherForge...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
          >
            {/* Hero Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center mb-16"
            >
              {/* Main Title */}
              <HolographicText
                text="AetherForge Sentinel"
                className="text-6xl md:text-8xl font-black mb-6"
                delay={0.3}
              />
              
              {/* Tagline */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-aether-cyan/80 font-light max-w-3xl mx-auto leading-relaxed"
              >
                Your Sentinel in the Aether – Intelligent Assistance Reimagined
              </motion.p>
            </motion.div>

            {/* Feature Orbs */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mb-16"
            >
              <FloatingOrbs />
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="text-center"
            >
              <RiftButton onClick={handleEnterRealm} />
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="text-aether-cyan/60 text-sm mt-6 max-w-md mx-auto"
              >
                Step into the future of AI interaction. Experience a living, breathing digital companion that adapts to your emotions and creates unprecedented visual experiences.
              </motion.p>
            </motion.div>

            {/* Cosmic Particles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2.5 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-aether-cyan rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aether-cyan/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aether-magenta/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aether-gold/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}
