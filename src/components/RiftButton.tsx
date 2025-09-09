'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Sparkles, Zap, Star, Shield, Globe } from 'lucide-react';

interface RiftButtonProps {
  onClick: () => void;
  label?: string;
  icon?: 'arrow' | 'sparkles' | 'zap' | 'star' | 'shield' | 'globe';
  variant?: 'cosmic' | 'quantum' | 'ethereal' | 'temporal';
}

export function RiftButton({ 
  onClick, 
  label = 'Enter the Realm',
  icon = 'arrow',
  variant = 'cosmic'
}: RiftButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const glowControls = useAnimationControls();

  // Variant styles
  const variantStyles = {
    cosmic: {
      from: 'from-cyan-400',
      via: 'via-fuchsia-500',
      to: 'to-amber-400',
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFD700',
      glow: 'rgba(0, 255, 255, 0.6)'
    },
    quantum: {
      from: 'from-indigo-500',
      via: 'via-purple-500',
      to: 'to-pink-500',
      primary: '#6366F1',
      secondary: '#A855F7',
      accent: '#EC4899',
      glow: 'rgba(139, 92, 246, 0.6)'
    },
    ethereal: {
      from: 'from-emerald-500',
      via: 'via-teal-500',
      to: 'to-cyan-500',
      primary: '#10B981',
      secondary: '#14B8A6',
      accent: '#06B6D4',
      glow: 'rgba(20, 184, 166, 0.6)'
    },
    temporal: {
      from: 'from-amber-500',
      via: 'via-orange-500',
      to: 'to-red-500',
      primary: '#F59E0B',
      secondary: '#F97316',
      accent: '#EF4444',
      glow: 'rgba(249, 115, 22, 0.6)'
    }
  };

  const currentStyle = variantStyles[variant];

  // Get icon component
  const getIcon = () => {
    switch (icon) {
      case 'sparkles': return <Sparkles size={24} />;
      case 'zap': return <Zap size={24} />;
      case 'star': return <Star size={24} />;
      case 'shield': return <Shield size={24} />;
      case 'globe': return <Globe size={24} />;
      default: return <ArrowRight size={24} />;
    }
  };

  // Initialize button with entrance animation
  useEffect(() => {
    if (!buttonRef.current) return;
    gsap.set(buttonRef.current, { scale: 0.8, opacity: 0 });
    gsap.to(buttonRef.current, { 
      scale: 1, 
      opacity: 1, 
      duration: 1.2, 
      delay: 0.5, 
      ease: "elastic.out(1.2, 0.5)" 
    });
  }, []);

  // Canvas animation for particle effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        canvas.width = rect.width * 2;  // For higher resolution
        canvas.height = rect.height * 2;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(2, 2);  // Scale for higher resolution
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      life: number;
      maxLife: number;
      vx: number;
      vy: number;
    }> = [];

    // Animation loop variables
    let animationFrameId: number;
    
    // Create particle function
    const createParticle = (x: number, y: number) => {
      const size = Math.random() * 3 + 1;
      const speed = Math.random() * 2 + 0.5;
      const angle = Math.random() * Math.PI * 2;
      const colors = [currentStyle.primary, currentStyle.secondary, currentStyle.accent];
      
      particles.push({
        x,
        y,
        size,
        speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 60 + Math.random() * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    };

    // Render function
    const render = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2); // Adjusted for scale
      
      // Create new particles when hovered
      if (isHovered) {
        for (let i = 0; i < 2; i++) {
          const rect = canvas.getBoundingClientRect();
          createParticle(
            Math.random() * rect.width, 
            Math.random() * rect.height
          );
        }
      }
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        
        // Fade out based on life
        const opacity = 1 - p.life / p.maxLife;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, currentStyle]);

  // Glow animation for hover effect
  useEffect(() => {
    if (isHovered) {
      glowControls.start({
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    } else {
      glowControls.stop();
      glowControls.set({ opacity: 0.3, scale: 1 });
    }
  }, [isHovered, glowControls]);

  // Click handler
  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsPressed(true);
    
    // Explosive particle effect on click
    if (buttonRef.current && canvasRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ctx = canvasRef.current.getContext('2d');
      
      if (ctx) {
        // Create explosion effect
        for (let i = 0; i < 30; i++) {
          createExplosionParticle(
            rect.width / 2, 
            rect.height / 2,
            ctx, 
            rect.width, 
            rect.height
          );
        }
      }
    }
    
    // Scale down and back for click effect
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      onComplete: () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.2,
          onComplete: () => {
            setTimeout(() => {
              setIsPressed(false);
              setIsAnimating(false);
              onClick();
            }, 100);
          }
        });
      }
    });
  };
  
  // Create explosion particle
  const createExplosionParticle = (
    x: number, 
    y: number, 
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const size = Math.random() * 4 + 2;
    const speed = Math.random() * 5 + 3;
    const angle = Math.random() * Math.PI * 2;
    const colors = [currentStyle.primary, currentStyle.secondary, currentStyle.accent];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    let particleX = x;
    let particleY = y;
    let particleLife = 0;
    const particleMaxLife = 30 + Math.random() * 30;
    
    // Animate this specific particle
    const animateParticle = () => {
      particleLife++;
      particleX += vx;
      particleY += vy;
      
      const opacity = 1 - particleLife / particleMaxLife;
      const particleSize = size * (1 - particleLife / particleMaxLife);
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
      ctx.fill();
      
      // Draw glow
      const glow = ctx.createRadialGradient(
        particleX, particleY, 0,
        particleX, particleY, particleSize * 3
      );
      
      glow.addColorStop(0, color + Math.floor(opacity * 100).toString(16).padStart(2, '0'));
      glow.addColorStop(1, color + '00');
      
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      
      if (particleLife < particleMaxLife) {
        requestAnimationFrame(animateParticle);
      }
    };
    
    requestAnimationFrame(animateParticle);
  };
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        disabled={isAnimating}
        className={`relative px-12 py-6 bg-gradient-to-r ${currentStyle.from} ${currentStyle.via} ${currentStyle.to} text-white font-bold text-xl rounded-3xl border-2 overflow-hidden`}
        style={{
          borderColor: isHovered ? currentStyle.accent : `${currentStyle.primary}80`,
          boxShadow: `0 0 30px ${currentStyle.glow}, 0 0 60px ${currentStyle.glow}50, inset 0 0 10px rgba(255, 255, 255, 0.2)`
        }}
        whileHover={{
          boxShadow: `0 0 40px ${currentStyle.glow}, 0 0 80px ${currentStyle.glow}50, inset 0 0 15px rgba(255, 255, 255, 0.4)`
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Inner glowing border */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-white/20"
          animate={glowControls}
        />
        
        {/* Canvas for particle effects */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: "1.5rem" }}
        />
        
        {/* Content with icon */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          <motion.span
            animate={{
              textShadow: isHovered 
                ? `0 0 10px ${currentStyle.glow}, 0 0 20px ${currentStyle.glow}80` 
                : '0 0 0px transparent'
            }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
          
          <motion.div
            animate={{
              x: isHovered ? "8px" : "0px",
              scale: isPressed ? 0.9 : 1,
              rotate: isHovered ? [0, 15, 0, -15, 0] : 0
            }}
            transition={{ 
              x: { duration: 0.3 },
              rotate: { duration: 0.8, repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }
            }}
          >
            {getIcon()}
          </motion.div>
        </div>
        
        {/* Scanning line */}
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5"
          style={{ 
            background: `linear-gradient(to right, transparent, ${currentStyle.accent}, transparent)`,
            filter: 'blur(1px)'
          }}
          animate={{
            y: ["0%", "2400%", "0%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Radial highlight for 3D effect */}
        <div 
          className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${currentStyle.accent}50, transparent 70%)`
          }}
        />
      </motion.button>

      {/* Floating icons around button */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-8 -left-8"
          style={{ color: currentStyle.primary }}
          animate={{
            y: ["0px", "-10px", "0px"],
            rotate: [0, 10, 0],
            scale: isHovered ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            scale: { duration: 0.5 }
          }}
        >
          <Sparkles size={20} />
        </motion.div>
        
        <motion.div
          className="absolute -top-8 -right-8"
          style={{ color: currentStyle.secondary }}
          animate={{
            y: ["0px", "-15px", "0px"],
            rotate: [0, -15, 0],
            scale: isHovered ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 0.5,
            scale: { duration: 0.5, delay: 0.1 }
          }}
        >
          <Zap size={20} />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-8 -left-8"
          style={{ color: currentStyle.accent }}
          animate={{
            y: ["0px", "-12px", "0px"],
            rotate: [0, 20, 0],
            scale: isHovered ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 1,
            scale: { duration: 0.5, delay: 0.2 }
          }}
        >
          <Star size={20} />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-8 -right-8"
          style={{ color: currentStyle.primary }}
          animate={{
            y: ["0px", "-8px", "0px"],
            rotate: [0, -25, 0],
            scale: isHovered ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            duration: 2.8, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 1.5,
            scale: { duration: 0.5, delay: 0.3 }
          }}
        >
          <Shield size={20} />
        </motion.div>
      </div>
    </div>
  );
}