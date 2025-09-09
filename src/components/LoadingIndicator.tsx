'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap } from 'lucide-react';

export function LoadingIndicator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
    fadeSpeed: number;
  }>>([]);
  
  // Neural network animation effect in the background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let animationFrameId: number;
    const particles = particlesRef.current;
    const maxParticles = 100;
    const colorPalette = [
      '#00FFFF', // cyan
      '#FF00FF', // magenta
      '#39FF14', // green
      '#FFD700', // gold
    ];
    
    // Create particle explosion animation
    const createParticleExplosion = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 1.5;
        const size = 1 + Math.random() * 2;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        
        particles.push({
          x,
          y,
          size,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          color,
          alpha: 1,
          fadeSpeed: 0.01 + Math.random() * 0.03
        });
        
        // Keep particle count under limit
        if (particles.length > maxParticles) {
          particles.shift();
        }
      }
    };
    
    // Create initial particles
    createParticleExplosion(canvas.width / 2, canvas.height / 2, 30);
    
    // Create periodic particle bursts
    const burstInterval = setInterval(() => {
      createParticleExplosion(
        canvas.width / 2 + (Math.random() - 0.5) * 30, 
        canvas.height / 2 + (Math.random() - 0.5) * 30, 
        5 + Math.floor(Math.random() * 10)
      );
    }, 300);
    
    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Update alpha (fade out)
        p.alpha -= p.fadeSpeed;
        
        // Remove faded particles
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Optional: add glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color + '80');
        gradient.addColorStop(1, p.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(burstInterval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Animated text variants
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="flex gap-3 items-center">
      {/* AI Avatar */}
      <motion.div 
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30 
        flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-lg"
        style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 255, 255, 0.3)',
            '0 0 30px rgba(0, 255, 255, 0.5)',
            '0 0 20px rgba(0, 255, 255, 0.3)'
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10" />
        
        {/* Rotating ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-fuchsia-500 border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner rotating ring (opposite direction) */}
        <motion.div 
          className="absolute inset-1 rounded-full border border-t-transparent border-r-cyan-500/40 border-b-transparent border-l-fuchsia-500/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Bot icon with effects */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="z-10 relative"
        >
          <Bot className="w-5 h-5 text-cyan-400" 
            style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.7))' }}
          />
          
          {/* Small floating particles around the bot */}
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-500"
            style={{ 
              top: '0%', 
              left: '0%',
              filter: 'blur(1px)',
              boxShadow: '0 0 5px rgba(255, 0, 255, 0.7)'
            }}
            animate={{
              x: [0, 5, -2, 0],
              y: [0, -5, 2, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-cyan-500"
            style={{ 
              bottom: '0%', 
              right: '10%',
              filter: 'blur(1px)',
              boxShadow: '0 0 5px rgba(0, 255, 255, 0.7)'
            }}
            animate={{
              x: [0, -3, 4, 0],
              y: [0, 4, -3, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>
      </motion.div>
      
      {/* Message bubble */}
      <motion.div 
        className="bg-black/20 backdrop-blur-lg border border-cyan-500/20 rounded-2xl px-6 py-4 shadow-lg relative overflow-hidden"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.1)' }}
      >
        {/* Canvas for particle animations */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        <div className="flex items-center gap-3 relative z-10">
          {/* Energy bolt icon with effects */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
              filter: [
                'drop-shadow(0 0 3px rgba(0, 255, 255, 0.5))',
                'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))',
                'drop-shadow(0 0 3px rgba(0, 255, 255, 0.5))'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap size={20} className="text-cyan-400" />
          </motion.div>
          
          {/* Animated dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-full"
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 5px rgba(0, 255, 255, 0.3)',
                    '0 0 10px rgba(0, 255, 255, 0.6)',
                    '0 0 5px rgba(0, 255, 255, 0.3)'
                  ]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Thinking text with letter animation */}
          <div className="ml-2 flex items-center">
            {/* Sparkle icon with effects */}
            <motion.div
              className="mr-1.5"
              animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={16} className="text-fuchsia-400" />
            </motion.div>
            
            {/* Animated text */}
            <div className="flex">
              {"Quantum Processing".split('').map((char, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-sm font-medium bg-gradient-to-r from-cyan-300 to-fuchsia-300 text-transparent bg-clip-text"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Status bar */}
        <motion.div 
          className="mt-2 h-1 bg-black/30 rounded-full overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="absolute h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1] 
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}