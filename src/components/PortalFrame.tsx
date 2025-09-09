'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { EmotionType } from '@/types';

interface PortalFrameProps {
  children: ReactNode;
  isOpen: boolean;
  emotion?: EmotionType;
  intensity?: number;
}

export function PortalFrame({ 
  children, 
  isOpen, 
  emotion = 'neutral',
  intensity = 0.7 
}: PortalFrameProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameControls = useAnimationControls();
  
  // Emotion color mapping
  const emotionColors = {
    joy: { primary: '#FFD700', secondary: '#FFA500', accent: '#FFFF00' },
    curiosity: { primary: '#00FFFF', secondary: '#0080FF', accent: '#00FF80' },
    concern: { primary: '#FF6B35', secondary: '#FF4500', accent: '#FF8C00' },
    wisdom: { primary: '#8A2BE2', secondary: '#9370DB', accent: '#BA55D3' },
    energy: { primary: '#39FF14', secondary: '#00FF00', accent: '#32CD32' },
    neutral: { primary: '#00FFFF', secondary: '#0080FF', accent: '#00FF80' }
  };

  const colors = emotionColors[emotion] || emotionColors.neutral;

  // Advanced portal effect with canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas && portalRef.current) {
        canvas.width = portalRef.current.offsetWidth;
        canvas.height = portalRef.current.offsetHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Portal energy particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      distance: number;
      color: string;
      opacity: number;
      pulse: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 150;
      
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * distance,
        y: canvas.height / 2 + Math.sin(angle) * distance,
        size: 0.5 + Math.random() * 3,
        speed: 0.2 + Math.random() * 1,
        angle: angle,
        distance: distance,
        color: [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)],
        opacity: 0.1 + Math.random() * 0.9,
        pulse: Math.random() * 0.1
      });
    }

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw radial gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 2
      );
      
      bgGradient.addColorStop(0, `${colors.primary}10`);
      bgGradient.addColorStop(0.7, `${colors.secondary}05`);
      bgGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw spinning rings
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 3 - i * 20,
          canvas.height / 3 - i * 15,
          time * (i + 1) * 0.2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `${colors.primary}${Math.floor(20 + Math.sin(time * 2) * 10).toString(16)}`;
        ctx.lineWidth = 1 + Math.sin(time + i) * 0.5;
        ctx.stroke();
      }

      // Energy rays
      for (let i = 0; i < 12; i++) {
        const rayAngle = (i / 12) * Math.PI * 2 + time * 0.2;
        const innerRadius = 20 + Math.sin(time * 3) * 10;
        const outerRadius = Math.min(canvas.width, canvas.height) * 0.4;
        
        const x1 = canvas.width / 2 + Math.cos(rayAngle) * innerRadius;
        const y1 = canvas.height / 2 + Math.sin(rayAngle) * innerRadius;
        const x2 = canvas.width / 2 + Math.cos(rayAngle) * outerRadius;
        const y2 = canvas.height / 2 + Math.sin(rayAngle) * outerRadius;
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `${colors.primary}00`);
        gradient.addColorStop(0.5, `${colors.secondary}${Math.floor(80 * intensity).toString(16)}`);
        gradient.addColorStop(1, `${colors.primary}00`);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + Math.sin(time * 2 + i) * 1;
        ctx.stroke();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Orbital movement
        p.angle += p.speed * 0.01 * intensity;
        p.distance += Math.sin(time * p.pulse) * 0.5;
        
        p.x = canvas.width / 2 + Math.cos(p.angle) * p.distance;
        p.y = canvas.height / 2 + Math.sin(p.angle) * p.distance;
        
        // Size pulsing
        const pulseFactor = 1 + Math.sin(time * 2 + i) * 0.3;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Draw glow
        const glow = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 3 * pulseFactor
        );
        
        glow.addColorStop(0, p.color + Math.floor(p.opacity * 100).toString(16).padStart(2, '0'));
        glow.addColorStop(1, p.color + '00');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3 * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, colors, intensity]);

  // Animate frame effects based on emotion
  useEffect(() => {
    if (isOpen) {
      frameControls.start({
        boxShadow: [
          `0 0 10px ${colors.primary}30, 0 0 20px ${colors.secondary}20, inset 0 0 15px ${colors.accent}10`,
          `0 0 15px ${colors.primary}50, 0 0 30px ${colors.secondary}30, inset 0 0 20px ${colors.accent}20`,
          `0 0 10px ${colors.primary}30, 0 0 20px ${colors.secondary}20, inset 0 0 15px ${colors.accent}10`
        ],
        transition: {
          duration: 3 * intensity,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    }
  }, [isOpen, colors, intensity, frameControls]);

  return (
    <motion.div
      ref={portalRef}
      className="relative w-full h-full portal-frame overflow-hidden rounded-3xl"
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
      {/* Main border with animated colors */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2"
        style={{ borderColor: colors.primary }}
        animate={{
          borderColor: [
            colors.primary,
            colors.secondary,
            colors.accent,
            colors.primary
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated frame with glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-opacity-30 pointer-events-none"
        style={{ borderColor: colors.primary }}
        animate={frameControls}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{ 
          background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
          filter: `blur(${Math.floor(intensity * 2)}px)`
        }}
        animate={{
          y: ["0%", "2400%", "0%"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
      />

      {/* Enhanced corner accents */}
      {[
        { top: 2, left: 2, borderLeft: true, borderTop: true },
        { top: 2, right: 2, borderRight: true, borderTop: true },
        { bottom: 2, left: 2, borderLeft: true, borderBottom: true },
        { bottom: 2, right: 2, borderRight: true, borderBottom: true }
      ].map((corner, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8"
          style={{
            top: corner.top,
            left: corner.left,
            right: corner.right,
            bottom: corner.bottom,
            borderLeftWidth: corner.borderLeft ? 2 : 0,
            borderRightWidth: corner.borderRight ? 2 : 0,
            borderTopWidth: corner.borderTop ? 2 : 0,
            borderBottomWidth: corner.borderBottom ? 2 : 0,
            borderColor: colors.accent
          }}
          animate={{
            width: ['32px', '40px', '32px'],
            height: ['32px', '40px', '32px'],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Canvas energy effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Floating particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3) * 2,
              height: 2 + (i % 3) * 2,
              backgroundColor: i % 3 === 0 ? colors.primary : (i % 3 === 1 ? colors.secondary : colors.accent),
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 4) * 20}%`,
              filter: `blur(${i % 2}px)`
            }}
            animate={{
              y: [`0px`, `-${20 + i * 5}px`, `0px`],
              x: [`0px`, `${(i % 2 === 0 ? 1 : -1) * (5 + i)}px`, `0px`],
              opacity: [0, 0.9, 0],
              scale: [0, 1 + (i % 3) * 0.5, 0]
            }}
            transition={{
              duration: 3 + (i % 3) * 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}