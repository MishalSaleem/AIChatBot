'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { 
  MessageCircle, 
  Brain, 
  Settings, 
  Zap, 
  Sparkles,
  Shield,
  Eye,
  Heart,
  Star,
  Compass,
  Layers,
  GitBranch
} from 'lucide-react';

interface Orb {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
  type: 'primary' | 'secondary' | 'tertiary';
}

const orbs: Orb[] = [
  { id: 'chat', icon: <MessageCircle size={24} />, title: 'Quantum Chat', description: 'Neural AI conversations with emotion detection', color: '#00FFFF', delay: 0, type: 'primary' },
  { id: 'ai', icon: <Brain size={24} />, title: 'AI Sentinel', description: 'Your guardian in the digital aether', color: '#FF00FF', delay: 0.2, type: 'primary' },
  { id: 'settings', icon: <Settings size={24} />, title: 'Adaptive UI', description: 'Interface that responds to your emotions', color: '#FFD700', delay: 0.4, type: 'secondary' },
  { id: 'performance', icon: <Zap size={24} />, title: 'Lightning Fast', description: 'Optimized for seamless performance', color: '#39FF14', delay: 0.6, type: 'secondary' },
  { id: 'magic', icon: <Sparkles size={24} />, title: 'Cosmic Magic', description: '3D nebula backgrounds and particle effects', color: '#8A2BE2', delay: 0.8, type: 'primary' },
  { id: 'security', icon: <Shield size={24} />, title: 'Secure & Private', description: 'Your conversations stay protected', color: '#FF6B35', delay: 1.0, type: 'tertiary' },
  { id: 'vision', icon: <Eye size={24} />, title: 'Future Vision', description: 'Cutting-edge technology ahead of its time', color: '#00FF80', delay: 1.2, type: 'secondary' },
  { id: 'heart', icon: <Heart size={24} />, title: 'Emotion Aware', description: 'AI that understands and responds to feelings', color: '#FF1493', delay: 1.4, type: 'primary' },
  { id: 'stars', icon: <Star size={24} />, title: 'Cosmic Intelligence', description: 'Knowledge from across the universe', color: '#E6E6FA', delay: 1.6, type: 'tertiary' },
  { id: 'compass', icon: <Compass size={24} />, title: 'Navigation Matrix', description: 'Guide through the digital cosmos', color: '#87CEEB', delay: 1.8, type: 'secondary' },
  { id: 'dimension', icon: <Layers size={24} />, title: 'Dimensional UI', description: 'Experience multiple realities of interaction', color: '#9932CC', delay: 2.0, type: 'tertiary' },
  { id: 'multiverse', icon: <GitBranch size={24} />, title: 'Multiverse Core', description: 'Parallel processing across dimensions', color: '#20B2AA', delay: 2.2, type: 'primary' }
];

export function FloatingOrbs() {
  const [hoveredOrb, setHoveredOrb] = useState<string | null>(null);
  const [selectedOrb, setSelectedOrb] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Track mouse position for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }
  };
  
  // Generate connection lines between orbs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let animationFrameId: number;
    
    // Get orb positions from DOM
    const getOrbPositions = () => {
      const positions: Record<string, { x: number, y: number, color: string }> = {};
      
      orbs.forEach(orb => {
        const element = containerRef.current?.querySelector(`[data-orb-id="${orb.id}"]`) as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          positions[orb.id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            color: orb.color
          };
        }
      });
      
      return positions;
    };
    
    // Animation function
    const render = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const positions = getOrbPositions();
      const orbEntries = Object.entries(positions);
      
      // Draw connection lines between orbs
      orbEntries.forEach(([id1, pos1], index) => {
        orbEntries.slice(index + 1).forEach(([id2, pos2]) => {
          // Only connect certain orbs based on type
          const orb1 = orbs.find(orb => orb.id === id1);
          const orb2 = orbs.find(orb => orb.id === id2);
          
          if (!orb1 || !orb2) return;
          
          // Connect orbs of the same type or primary-secondary connections
          const shouldConnect = 
            orb1.type === orb2.type || 
            (orb1.type === 'primary' && orb2.type === 'secondary') ||
            (orb1.type === 'secondary' && orb2.type === 'primary') ||
            hoveredOrb === orb1.id || 
            hoveredOrb === orb2.id ||
            selectedOrb === orb1.id ||
            selectedOrb === orb2.id;
            
          if (!shouldConnect) return;
          
          // Calculate distance between orbs
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect orbs within a certain distance
          if (distance < 300) {
            // Calculate opacity based on distance
            const opacity = Math.max(0, 1 - distance / 300);
            
            // Create gradient for line
            const gradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
            gradient.addColorStop(0, `${pos1.color}${Math.floor(opacity * 80).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${pos2.color}${Math.floor(opacity * 80).toString(16).padStart(2, '0')}`);
            
            // Draw line with animation
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.lineWidth = hoveredOrb === id1 || hoveredOrb === id2 || selectedOrb === id1 || selectedOrb === id2 ? 2 : 1;
            ctx.strokeStyle = gradient;
            ctx.stroke();
            
            // Add glow effect for hovered/selected orbs
            if (hoveredOrb === id1 || hoveredOrb === id2 || selectedOrb === id1 || selectedOrb === id2) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = hoveredOrb === id1 ? pos1.color : pos2.color;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
            
            // Add pulse effect on lines
            if ((hoveredOrb === id1 || hoveredOrb === id2) && Math.random() < 0.02) {
              const pulseAnimation = (progress: number) => {
                if (progress >= 1) return;
                
                const x = pos1.x + dx * progress;
                const y = pos1.y + dy * progress;
                
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = progress < 0.5 ? pos1.color : pos2.color;
                ctx.fill();
                
                requestAnimationFrame(() => pulseAnimation(progress + 0.02));
              };
              
              pulseAnimation(0);
            }
          }
        });
      });
      
      // Draw data flow effects when orbs are hovered
      if (hoveredOrb && positions[hoveredOrb]) {
        const pos = positions[hoveredOrb];
        const color = orbs.find(orb => orb.id === hoveredOrb)?.color || '#00FFFF';
        
        // Draw orbit effect around hovered orb
        for (let i = 0; i < 3; i++) {
          const angle = (Date.now() / 1000 * (i + 1)) % (Math.PI * 2);
          const orbitRadius = 30 + i * 10;
          
          const x = pos.x + Math.cos(angle) * orbitRadius;
          const y = pos.y + Math.sin(angle) * orbitRadius;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          
          // Add glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hoveredOrb, selectedOrb]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-5xl mx-auto py-10"
      onMouseMove={handleMouseMove}
    >
      {/* Background connections canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />
      
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-300 text-transparent bg-clip-text mb-2">
            Aether Neural Matrix
          </h2>
          <p className="text-cyan-300/70 max-w-md mx-auto">
            Explore the interdimensional capabilities of your AI companion
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {orbs.map((orb) => {
            // Calculate interactive distance effect
            const x = useTransform(mouseX, [0, 1000], [0, 10]);
            const y = useTransform(mouseY, [0, 1000], [0, 10]);
            const scale = useMotionValue(1);
            const controls = useAnimation();
            
            return (
              <motion.div
                key={orb.id}
                data-orb-id={orb.id}
                initial={{ 
                  opacity: 0, 
                  y: "70px",
                  scale: 0.5,
                  rotate: orb.type === 'primary' ? -180 : orb.type === 'secondary' ? 180 : 0
                }}
                animate={{ 
                  opacity: 1, 
                  y: "0px",
                  scale: 1,
                  rotate: 0
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                  delay: orb.delay
                }}
                whileHover={{ 
                  scale: 1.15,
                  y: "-15px",
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => {
                  setHoveredOrb(orb.id);
                  controls.start({
                    scale: [1, 1.15],
                    transition: { duration: 0.3 }
                  });
                }}
                onHoverEnd={() => {
                  setHoveredOrb(null);
                  controls.start({
                    scale: [1.15, 1],
                    transition: { duration: 0.3 }
                  });
                }}
                onClick={() => setSelectedOrb(selectedOrb === orb.id ? null : orb.id)}
                className={`relative group cursor-pointer ${selectedOrb === orb.id ? 'z-10' : 'z-0'}`}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl"
                  animate={{
                    boxShadow: selectedOrb === orb.id
                      ? [
                          `0 0 30px ${orb.color}70`,
                          `0 0 50px ${orb.color}90`,
                          `0 0 30px ${orb.color}70`
                        ]
                      : [
                          `0 0 0px ${orb.color}00`,
                          `0 0 20px ${orb.color}40`,
                          `0 0 0px ${orb.color}00`
                        ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ opacity: 0.5 }}
                />
                
                {/* Orb container with pulsing border */}
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm"
                  style={{
                    backgroundColor: `${orb.color}10`,
                    border: `2px solid ${orb.color}60`,
                    boxShadow: `0 0 20px ${orb.color}40, inset 0 0 20px ${orb.color}20`
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${orb.color}40, inset 0 0 20px ${orb.color}20`,
                      `0 0 40px ${orb.color}60, inset 0 0 40px ${orb.color}30`,
                      `0 0 20px ${orb.color}40, inset 0 0 20px ${orb.color}20`
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Rotating inner rings */}
                  <motion.div 
                    className="absolute inset-2 border-2 border-dashed border-opacity-50 rounded-full" 
                    style={{ borderColor: orb.color }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <motion.div 
                    className="absolute inset-4 border border-opacity-30 rounded-full" 
                    style={{ borderColor: orb.color }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Icon with interactive effects */}
                  <motion.div
                    className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${orb.color}30, ${orb.color}10)`,
                      boxShadow: `inset 0 0 10px ${orb.color}40`,
                      x: hoveredOrb === orb.id ? x : 0,
                      y: hoveredOrb === orb.id ? y : 0,
                      scale
                    }}
                    animate={controls}
                  >
                    <motion.div
                      className="text-white"
                      animate={{ 
                        scale: selectedOrb === orb.id ? [1, 1.2, 1] : hoveredOrb === orb.id ? [1, 1.1, 1] : 1, 
                        rotate: selectedOrb === orb.id ? [0, 15, -15, 0] : hoveredOrb === orb.id ? [0, 5, -5, 0] : 0,
                        filter: [
                          `drop-shadow(0 0 3px ${orb.color})`, 
                          `drop-shadow(0 0 8px ${orb.color})`,
                          `drop-shadow(0 0 3px ${orb.color})`
                        ]
                      }}
                      transition={{ 
                        duration: selectedOrb === orb.id ? 3 : 2, 
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      {orb.icon}
                    </motion.div>
                  </motion.div>
                  
                  {/* Particles inside orb */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{ 
                        backgroundColor: orb.color,
                        width: `${1 + Math.random()}px`,
                        height: `${1 + Math.random()}px`,
                        boxShadow: `0 0 5px ${orb.color}`
                      }}
                      initial={{
                        x: (Math.random() - 0.5) * 20,
                        y: (Math.random() - 0.5) * 20,
                        opacity: 0
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 40,
                        y: (Math.random() - 0.5) * 40,
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                  
                  {/* Pulsing overlay */}
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, ${orb.color}30, transparent 70%)` }}
                    animate={{
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                </motion.div>
                
                {/* Title with gradient effect */}
                <motion.h3
                  className="text-center text-base font-semibold mb-2"
                  animate={{ 
                    color: hoveredOrb === orb.id || selectedOrb === orb.id ? orb.color : '#00FFFF',
                    textShadow: hoveredOrb === orb.id || selectedOrb === orb.id 
                      ? `0 0 10px ${orb.color}`
                      : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {orb.title}
                </motion.h3>
                
                {/* Description with reveal animation */}
                <motion.p
                  className="text-center text-xs leading-tight"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: hoveredOrb === orb.id || selectedOrb === orb.id ? 1 : 0.6,
                    height: 'auto',
                    color: hoveredOrb === orb.id || selectedOrb === orb.id ? orb.color : '#00FFFF80'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {orb.description}
                </motion.p>
                
                {/* Particle burst effect on hover */}
                {(hoveredOrb === orb.id || selectedOrb === orb.id) && (
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ 
                          backgroundColor: orb.color, 
                          left: '50%', 
                          top: '50%',
                          filter: `blur(${Math.random()}px)`
                        }}
                        initial={{
                          x: "0px",
                          y: "0px",
                          opacity: 1,
                          scale: 0
                        }}
                        animate={{
                          x: `${Math.cos(i * Math.PI / 6) * (80 + Math.random() * 20)}px`,
                          y: `${Math.sin(i * Math.PI / 6) * (80 + Math.random() * 20)}px`,
                          opacity: 0,
                          scale: 2 + Math.random()
                        }}
                        transition={{ 
                          duration: 1 + Math.random(), 
                          repeat: Infinity, 
                          delay: i * 0.1, 
                          ease: "easeOut" 
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                {/* Selection indicator */}
                {selectedOrb === orb.id && (
                  <motion.div
                    className="absolute -inset-3 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      background: `radial-gradient(circle, ${orb.color}20, transparent 70%)`,
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Floating particles across the entire component */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: ['#00FFFF', '#FF00FF', '#FFD700', '#39FF14'][i % 4],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1 + Math.random(), 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>
    </div>
  );
}