'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

interface RiftButtonProps {
  onClick: () => void;
}

export function RiftButton({ onClick }: RiftButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) return;

    // Initial button setup
    gsap.set(buttonRef.current, {
      scale: 0.8,
      opacity: 0
    });

    // Entrance animation
    gsap.to(buttonRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1,
      delay: 2,
      ease: "back.out(1.7)"
    });

  }, []);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Create rift effect
    const rift = document.createElement('div');
    rift.className = 'fixed inset-0 z-50 pointer-events-none';
    rift.style.background = 'radial-gradient(circle at center, transparent 0%, #0A0A0A 70%)';
    document.body.appendChild(rift);

    // Rift opening animation
    gsap.timeline()
      .to(rift, {
        scale: 0,
        duration: 0.5,
        ease: "power2.in"
      })
      .to(buttonRef.current, {
        scale: 1.5,
        rotation: 360,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(buttonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      })
      .call(() => {
        document.body.removeChild(rift);
        onClick();
      });

    // Create particle burst
    createParticleBurst();
  };

  const createParticleBurst = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    // Create particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed w-2 h-2 rounded-full pointer-events-none z-40';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.backgroundColor = ['#00FFFF', '#FF00FF', '#FFD700', '#39FF14'][i % 4];
      
      document.body.appendChild(particle);

      // Animate particle
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(particle);
        }
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div className="relative">
      {/* Button */}
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={isAnimating}
        className="relative px-12 py-6 bg-gradient-to-r from-aether-cyan via-aether-magenta to-aether-gold text-aether-black font-bold text-xl rounded-3xl border-2 border-aether-cyan/50 overflow-hidden group"
        style={{
          boxShadow: `
            0 0 30px rgba(0, 255, 255, 0.5),
            0 0 60px rgba(0, 255, 255, 0.3),
            inset 0 0 0 1px rgba(255, 255, 255, 0.2)
          `
        }}
        whileHover={{
          boxShadow: `
            0 0 40px rgba(0, 255, 255, 0.7),
            0 0 80px rgba(0, 255, 255, 0.5),
            inset 0 0 0 1px rgba(255, 255, 255, 0.4)
          `
        }}
      >
        {/* Button Content */}
        <div className="relative z-10 flex items-center gap-3">
          <span>Enter the Realm</span>
          <motion.div
            animate={{
              x: isHovered ? 5 : 0,
              rotate: isHovered ? 15 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight size={24} />
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-aether-cyan/20 via-aether-magenta/20 to-aether-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Scanning Line Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-aether-cyan to-transparent"
          animate={{
            y: [0, '100%', 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.3), transparent)',
              filter: 'blur(20px)'
            }}
          />
        </div>
      </motion.button>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-8 -left-8 text-aether-cyan"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={20} />
        </motion.div>
        
        <motion.div
          className="absolute -top-8 -right-8 text-aether-magenta"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -15, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Zap size={20} />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-8 -left-8 text-aether-gold"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 20, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Sparkles size={20} />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-8 -right-8 text-aether-cyan"
          animate={{
            y: [0, -8, 0],
            rotate: [0, -25, 0]
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Zap size={20} />
        </motion.div>
      </div>

      {/* Energy Field */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-aether-cyan/30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          filter: 'blur(1px)'
        }}
      />
    </div>
  );
}
