'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface HolographicTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function HolographicText({ text, className = '', delay = 0 }: HolographicTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll('.char');
    
    // Create particle effect for each character
    chars.forEach((char, index) => {
      const charElement = char as HTMLElement;
      
      // Initial state - characters start as particles
      gsap.set(charElement, {
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360,
        filter: 'blur(10px)',
      });

      // Animate characters appearing with particle burst effect
      gsap.to(charElement, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: 'blur(0px)',
        duration: 1.5,
        delay: delay + index * 0.1,
        ease: "back.out(1.7)",
        onComplete: () => {
          // Add holographic glow effect
          gsap.to(charElement, {
            filter: 'drop-shadow(0 0 20px #00FFFF) drop-shadow(0 0 40px #00FFFF)',
            duration: 0.5,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut"
          });
        }
      });
    });

    // Create floating particles around text
    if (particlesRef.current) {
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-aether-cyan rounded-full';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesRef.current.appendChild(particle);
        
        // Animate particles
        gsap.fromTo(particle, 
          {
            opacity: 0,
            scale: 0,
            rotation: 0
          },
          {
            opacity: 0.7, // Fix: Use single value instead of array
            scale: 1, // Fix: Use single value instead of array
            rotation: 360,
            duration: 3 + Math.random() * 2,
            delay: delay + Math.random() * 2,
            repeat: -1,
            repeatDelay: 0.5,
            yoyo: true, // This will create the fade in/out effect
            ease: "power2.inOut"
          }
        );
      }
    }

    // Add text scanning effect
    const scanLine = document.createElement('div');
    scanLine.className = 'absolute w-full h-0.5 bg-gradient-to-r from-transparent via-aether-cyan to-transparent';
    scanLine.style.top = '0';
    scanLine.style.left = '0';
    
    if (textRef.current) {
      textRef.current.appendChild(scanLine);
      
      gsap.to(scanLine, {
        top: '100%',
        duration: 2,
        delay: delay + text.length * 0.1 + 1,
        ease: "power2.inOut",
        onComplete: () => {
          scanLine.remove();
        }
      });
    }

  }, [text, delay]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Text */}
      <div ref={textRef} className="relative">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="char inline-block relative"
            style={{
              textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      
      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Holographic Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aether-cyan/10 to-transparent opacity-0 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aether-cyan/5 to-transparent opacity-0 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Glitch Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 text-aether-cyan opacity-0"
            style={{
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
              filter: 'blur(0.5px)',
              animationDelay: `${delay + i * 0.1}s`
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
