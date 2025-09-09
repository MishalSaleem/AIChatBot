'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface HolographicTextProps {
  text: string;
  className?: string;
  delay?: number;
  variant?: 'default' | 'cyberpunk' | 'quantum' | 'neon';
  color?: string;
  glitchIntensity?: number;
  interactive?: boolean;
}

export function HolographicText({ 
  text, 
  className = '', 
  delay = 0,
  variant = 'default',
  color = '#00FFFF',
  glitchIntensity = 0.2,
  interactive = false
}: HolographicTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Split text into characters - memoized to avoid recalculating
  const characters = useMemo(() => text.split(''), [text]);
  
  // Calculate color variants
  const colorVariants = useMemo(() => {
    // Parse the base color to get RGB components
    const baseColor = color.startsWith('#') ? color : '#00FFFF';
    
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Generate variants
    return {
      primary: baseColor,
      secondary: `rgba(${r}, ${g}, ${b}, 0.7)`,
      glow: `0 0 10px ${baseColor}, 0 0 20px ${baseColor}, 0 0 30px ${baseColor}`,
      transparent: `rgba(${r}, ${g}, ${b}, 0.2)`,
      highlight: `rgba(${r}, ${g}, ${b}, 0.9)`,
      gradient: variant === 'neon' 
        ? `linear-gradient(90deg, ${baseColor}, #FF00FF)`
        : `linear-gradient(90deg, ${baseColor}, rgba(${r}, ${g}, ${b}, 0.5))`,
    };
  }, [color, variant]);
  
  // Generate variant-specific styles
  const variantStyles = useMemo(() => {
    interface StyleProps {
      fontFamily: string;
      textShadow: string;
      letterSpacing: string;
      animationDuration: string;
      fontWeight?: string;
      textTransform?: string;
      fontStyle?: string;
    }
    
    const styles: Record<string, StyleProps> = {
      default: {
        fontFamily: 'sans-serif',
        textShadow: colorVariants.glow,
        letterSpacing: '1px',
        animationDuration: '1.5s',
      },
      cyberpunk: {
        fontFamily: 'monospace',
        textShadow: colorVariants.glow,
        letterSpacing: '2px',
        animationDuration: '1.2s',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
      quantum: {
        fontFamily: 'sans-serif',
        textShadow: colorVariants.glow,
        letterSpacing: '0px',
        animationDuration: '2s',
        fontStyle: 'italic',
      },
      neon: {
        fontFamily: 'cursive, sans-serif',
        textShadow: colorVariants.glow,
        letterSpacing: '2px',
        animationDuration: '1.8s',
        fontWeight: 'bold',
      },
    };
    
    return styles[variant];
  }, [variant, colorVariants]);

  // Canvas animation for background effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let animationFrameId: number;
    let time = 0;
    
    // Line effects based on variant
    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      speed: number;
      width: number;
      alpha: number;
      color: string;
    }> = [];
    
    // Generate lines based on variant
    const lineCount = variant === 'cyberpunk' ? 20 : variant === 'quantum' ? 30 : 15;
    
    for (let i = 0; i < lineCount; i++) {
      const horizontal = Math.random() > 0.5;
      const width = 0.5 + Math.random() * 2;
      const speed = 0.3 + Math.random() * 1.5;
      const alpha = 0.1 + Math.random() * 0.4;
      
      // Parse the base color
      const baseColor = color.startsWith('#') ? color : '#00FFFF';
      // Convert hex to RGB for alpha control
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      
      if (horizontal) {
        lines.push({
          x1: 0,
          y1: Math.random() * canvas.height,
          x2: canvas.width,
          y2: Math.random() * canvas.height,
          speed,
          width,
          alpha,
          color: `rgba(${r}, ${g}, ${b}, ${alpha})`
        });
      } else {
        lines.push({
          x1: Math.random() * canvas.width,
          y1: 0,
          x2: Math.random() * canvas.width,
          y2: canvas.height,
          speed,
          width,
          alpha,
          color: `rgba(${r}, ${g}, ${b}, ${alpha})`
        });
      }
    }
    
    // Animation function
    const render = () => {
      time += 0.01;
      
      // Clear canvas with transparent black for fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw lines
      for (const line of lines) {
        // Update position based on variant
        if (variant === 'cyberpunk') {
          // Cyberpunk: Lines move in straight paths and reset
          if (Math.random() < 0.01) {
            line.y1 = Math.random() * canvas.height;
            line.y2 = line.y1 + (Math.random() - 0.5) * 50;
          }
        } else if (variant === 'quantum') {
          // Quantum: Lines have wave-like movement
          line.y1 = (canvas.height / 2) + Math.sin(time * line.speed) * (canvas.height / 4);
          line.y2 = (canvas.height / 2) + Math.cos(time * line.speed + Math.PI/4) * (canvas.height / 4);
        } else {
          // Default: Subtle movement
          line.y1 += Math.sin(time * line.speed) * 0.5;
          line.y2 += Math.cos(time * line.speed) * 0.5;
        }
        
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.lineWidth = line.width * (isHovered ? 2 : 1); // Thicker lines on hover
        ctx.strokeStyle = line.color;
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = line.color;
        
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow for performance
      }
      
      // Add variant-specific effects
      if (variant === 'neon') {
        // Neon: Add glowing dots
        for (let i = 0; i < 3; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 0.5 + Math.random() * 2;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = colorVariants.primary + '80';
          ctx.shadowBlur = 10;
          ctx.shadowColor = colorVariants.primary;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (variant === 'quantum') {
        // Quantum: Add particle wave
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50 + Math.sin(time) * 20;
        
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i + time;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = colorVariants.primary + '80';
          ctx.shadowBlur = 10;
          ctx.shadowColor = colorVariants.primary;
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
  }, [variant, color, colorVariants, isHovered]);

  // Text animation with GSAP
  useEffect(() => {
    if (!textRef.current) return;
    
    // Cleanup function to prevent memory leaks and duplicate animations
    let ctx = gsap.context(() => {
      const chars = textRef.current!.querySelectorAll('.char');
      
      // Reset animations
      gsap.set(chars, {
        opacity: 0,
        scale: 0,
        rotation: (i) => variant === 'cyberpunk' ? 0 : Math.random() * 360,
        filter: 'blur(10px)',
        y: (i) => variant === 'quantum' ? -20 : 0,
        x: (i) => variant === 'neon' ? -10 : 0,
      });
      
      // Animate characters in
      chars.forEach((char, index) => {
        const charElement = char as HTMLElement;
        
        // Apply variant-specific animations
        if (variant === 'cyberpunk') {
          gsap.to(charElement, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            delay: delay + index * 0.05,
            ease: "power2.out",
          });
          
          // Add glitch effect for cyberpunk
          if (glitchIntensity > 0) {
            const glitchTimeline = gsap.timeline({
              repeat: -1,
              repeatDelay: 3 + Math.random() * 5
            });
            
            glitchTimeline.to(charElement, {
              x: '+=' + (Math.random() * 4 - 2) * glitchIntensity,
              opacity: 0.8,
              color: '#FF00FF',
              duration: 0.1,
              ease: "none",
            })
            .to(charElement, {
              x: '-=' + (Math.random() * 4 - 2) * glitchIntensity,
              opacity: 1,
              color: colorVariants.primary,
              duration: 0.1,
              ease: "none",
            });
          }
        } 
        else if (variant === 'quantum') {
          gsap.to(charElement, {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            delay: delay + index * 0.08,
            ease: "back.out(1.3)",
          });
          
          // Add floating effect for quantum
          gsap.to(charElement, {
            y: '-=3',
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: delay + index * 0.08 + 1
          });
        } 
        else if (variant === 'neon') {
          gsap.to(charElement, {
            opacity: 1,
            scale: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            delay: delay + index * 0.12,
            ease: "elastic.out(1.2, 0.5)",
          });
          
          // Add pulsing effect for neon
          gsap.to(charElement, {
            textShadow: `0 0 15px ${colorVariants.primary}, 0 0 30px ${colorVariants.primary}`,
            duration: 1.5 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: delay + index * 0.12 + 1
          });
        }
        else {
          // Default animation
          gsap.to(charElement, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            delay: delay + index * 0.1,
            ease: "back.out(1.7)",
          });
        }
      });

      // Add particles if needed
      if (particlesRef.current) {
        // Clear any existing particles
        while (particlesRef.current.firstChild) {
          particlesRef.current.removeChild(particlesRef.current.firstChild);
        }
        
        // Create new particles based on variant
        const particleCount = variant === 'quantum' ? 80 : variant === 'neon' ? 40 : 50;
        
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          
          // Customize particles based on variant
          if (variant === 'cyberpunk') {
            particle.className = 'absolute bg-transparent border';
            particle.style.width = `${1 + Math.random() * 3}px`;
            particle.style.height = `${1 + Math.random() * 3}px`;
            particle.style.borderColor = colorVariants.primary;
            particle.style.opacity = '0.7';
          } 
          else if (variant === 'quantum') {
            particle.className = 'absolute rounded-full';
            particle.style.width = `${1 + Math.random() * 2}px`;
            particle.style.height = `${1 + Math.random() * 2}px`;
            
            // Create gradient particles for quantum
            if (Math.random() > 0.5) {
              particle.style.background = colorVariants.primary;
            } else {
              particle.style.background = colorVariants.secondary;
            }
            
            particle.style.boxShadow = `0 0 ${2 + Math.random() * 4}px ${colorVariants.primary}`;
          }
          else if (variant === 'neon') {
            particle.className = 'absolute';
            particle.style.width = `${Math.random() > 0.8 ? 3 : 1}px`;
            particle.style.height = `${Math.random() > 0.8 ? 15 : 1}px`;
            
            // Alternate colors for neon effect
            particle.style.background = Math.random() > 0.5 ? colorVariants.primary : '#FF00FF';
            particle.style.boxShadow = `0 0 ${2 + Math.random() * 4}px ${Math.random() > 0.5 ? colorVariants.primary : '#FF00FF'}`;
          }
          else {
            // Default particles
            particle.className = 'absolute rounded-full';
            particle.style.width = `${1 + Math.random() * 2}px`;
            particle.style.height = `${1 + Math.random() * 2}px`;
            particle.style.background = colorVariants.primary;
          }
          
          // Set position
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          
          particlesRef.current.appendChild(particle);
          
          // Animate particles
          if (variant === 'cyberpunk') {
            // Digital rain effect for cyberpunk
            gsap.fromTo(particle,
              {
                opacity: 0,
                top: '-5%',
              },
              {
                opacity: 0.7,
                top: '105%',
                duration: 2 + Math.random() * 3,
                delay: delay + Math.random() * 5,
                repeat: -1,
                ease: "none"
              }
            );
          } 
          else if (variant === 'quantum') {
            // Quantum particles move in orbits
            const orbitRadius = 50 + Math.random() * 50;
            const speed = 2 + Math.random() * 3;
            const startAngle = Math.random() * Math.PI * 2;
            
            gsap.to(particle, {
              left: '50%',
              top: '50%',
              opacity: 0.7,
              duration: 2,
              delay: delay + Math.random(),
              ease: "power2.out",
              onComplete: () => {
                // After centering, start the orbit
                gsap.to(particle, {
                  keyframes: [
                    { 
                      left: `calc(50% + ${Math.cos(startAngle) * orbitRadius}px)`,
                      top: `calc(50% + ${Math.sin(startAngle) * orbitRadius}px)`,
                      duration: 0
                    },
                    { 
                      left: `calc(50% + ${Math.cos(startAngle + Math.PI/2) * orbitRadius}px)`,
                      top: `calc(50% + ${Math.sin(startAngle + Math.PI/2) * orbitRadius}px)`,
                      duration: speed/4
                    },
                    { 
                      left: `calc(50% + ${Math.cos(startAngle + Math.PI) * orbitRadius}px)`,
                      top: `calc(50% + ${Math.sin(startAngle + Math.PI) * orbitRadius}px)`,
                      duration: speed/4
                    },
                    { 
                      left: `calc(50% + ${Math.cos(startAngle + Math.PI*3/2) * orbitRadius}px)`,
                      top: `calc(50% + ${Math.sin(startAngle + Math.PI*3/2) * orbitRadius}px)`,
                      duration: speed/4
                    },
                    { 
                      left: `calc(50% + ${Math.cos(startAngle + Math.PI*2) * orbitRadius}px)`,
                      top: `calc(50% + ${Math.sin(startAngle + Math.PI*2) * orbitRadius}px)`,
                      duration: speed/4
                    }
                  ],
                  repeat: -1,
                  ease: "none"
                });
              }
            });
          }
          else if (variant === 'neon') {
            // Neon particles have burst effects
            if (Math.random() > 0.8) {
              // Some particles float upward
              gsap.fromTo(particle,
                {
                  opacity: 0,
                  scale: 0
                },
                {
                  opacity: 0.7,
                  scale: 1,
                  duration: 1,
                  delay: delay + Math.random() * 3,
                  onComplete: () => {
                    gsap.to(particle, {
                      top: '-=50',
                      opacity: 0,
                      duration: 3 + Math.random() * 2,
                      ease: "power1.out",
                      onComplete: () => {
                        // Reset position
                        gsap.set(particle, {
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: 0
                        });
                        
                        // Restart animation
                        gsap.to(particle, {
                          opacity: 0.7,
                          scale: 1,
                          duration: 1,
                          delay: Math.random(),
                          onComplete: function() {
                            // @ts-ignore - this refers to the current animation
                            this.restart();
                          }
                        });
                      }
                    });
                  }
                }
              );
            } else {
              // Some particles pulse in place
              gsap.fromTo(particle,
                {
                  opacity: 0,
                  scale: 0
                },
                {
                  opacity: 0.7,
                  scale: 1,
                  yoyo: true,
                  repeat: -1,
                  duration: 1.5 + Math.random(),
                  delay: delay + Math.random() * 3,
                  ease: "sine.inOut"
                }
              );
            }
          }
          else {
            // Default particle animation
            gsap.fromTo(particle, 
              {
                opacity: 0,
                scale: 0
              },
              {
                opacity: 0.7,
                scale: 1,
                yoyo: true,
                duration: (3 + Math.random() * 2) / 2,
                delay: delay + Math.random() * 2,
                repeat: -1,
                ease: "power2.inOut"
              }
            );
          }
        }
      }
      
      // Add scan line effect for cyberpunk and default
      if ((variant === 'cyberpunk' || variant === 'default') && textRef.current) {
        // Remove any existing scan lines
        const existingScanLines = textRef.current.querySelectorAll('.scan-line');
        existingScanLines.forEach(line => line.remove());
        
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line absolute w-full h-0.5';
        
        if (variant === 'cyberpunk') {
          scanLine.style.background = `linear-gradient(90deg, transparent, ${colorVariants.primary}, transparent)`;
          scanLine.style.boxShadow = `0 0 10px ${colorVariants.primary}`;
          scanLine.style.height = '2px';
        } else {
          scanLine.style.background = `linear-gradient(90deg, transparent, ${colorVariants.primary}, transparent)`;
        }
        
        scanLine.style.top = '0';
        scanLine.style.left = '0';
        
        textRef.current.appendChild(scanLine);
        
        gsap.to(scanLine, {
          top: '100%',
          duration: variant === 'cyberpunk' ? 1.2 : 2,
          delay: delay + text.length * 0.1,
          repeat: -1,
          repeatDelay: variant === 'cyberpunk' ? 0.5 : 2,
          ease: variant === 'cyberpunk' ? "steps(10)" : "power2.inOut",
        });
        
        // Add second scan line for cyberpunk with offset
        if (variant === 'cyberpunk') {
          const scanLine2 = document.createElement('div');
          scanLine2.className = 'scan-line absolute w-full h-1px';
          scanLine2.style.background = `linear-gradient(90deg, transparent, ${colorVariants.primary}, transparent)`;
          scanLine2.style.top = '30%';
          scanLine2.style.left = '0';
          scanLine2.style.opacity = '0.7';
          
          textRef.current.appendChild(scanLine2);
          
          gsap.to(scanLine2, {
            top: '100%',
            duration: 0.8,
            delay: delay + text.length * 0.05 + 0.5,
            repeat: -1,
            repeatDelay: 1.2,
            ease: "steps(8)",
          });
        }
      }
      
      // Add glitch noise overlay for cyberpunk
      if (variant === 'cyberpunk' && glitchIntensity > 0 && containerRef.current) {
        // Remove any existing glitch overlay
        const existingOverlay = containerRef.current.querySelector('.glitch-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay absolute inset-0 pointer-events-none';
        glitchOverlay.style.backgroundImage = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJZSURBVGhD7ZlBaBNBGIVnk42xtinWJBqkKK2giOLBiwfPevAgePBmL3rxIN5EPAiePHkRBC+CB8WDiKggFkGKBxVEBEFQm2haWtukaZqkTbLrfJn8gcimu8Rm2MzOBw/CZneZ/2Vn/t3JxtJKzC1iuQZcZdAPxhLEBneYsBt6PQ0pEkvjOQwn5lCvV6HMP5QF4iDhJnrhTsQljVQmLjOJKcQjLu/BGnl/KodCuYlQuIVwmNtpEZMIx3svk+jfbOH+cwfLa+swDAOaoiKC6DOSLlawvLqOQMDEhcEM+hIWysWm9yIXg1yVxBQGU4bXpj5m57cAPT4JqOTrWFl3EXB9HO/XYZmqfxFvRKqkVK5jYaWKlYIL16W/hqqMHDiDGI2Y0DWV+iPeWgQQ27IINjaak1FMHk9j34E9eJUzeRJnTN8i2ZkKPnypoVx1qGTAN5HpmRKqNUf0q3a5HNiNnUkNz969wYvXRVy7NLxJhG/W8nI7h1BISo0gNsrA+Rvn8fTJIzx8cBdXL58VY3ywGvn8tYBf+RrS6TQ0QxNnToJVt3DswgSGR0ZEzMzOwnK64rrE6BeJ9/MrJHI6lULPrm7RbweNCuanpzA+Po7XTx7hx8KCGPODVaRhO8jnbcTjcdGvRyK4fv26SNbp7OgQn2YmpVKp9Xzgg9VIqaSLKznq3GyJQLfZ2dlBPGZhdHQU9VpVjPnBasQ0dej6/9dBNGojGu0UfUVRcfLUaXw0HYyNnRJjfrAaGRlJivsql8tFsaogNpvq6kYut4j7d27BcfhqzPfXICpH3XAQDocRiUR8HzchA4SiJP8C8R2VIfKbimUAAAAASUVORK5CYII=")`;
        glitchOverlay.style.opacity = `${0.05 * glitchIntensity}`;
        glitchOverlay.style.mixBlendMode = 'overlay';
        
        containerRef.current.appendChild(glitchOverlay);
        
        // Animate glitch overlay
        gsap.to(glitchOverlay, {
          opacity: `+=${0.1 * glitchIntensity}`,
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
          repeatRefresh: true
        });
      }
    });
    
    // Cleanup when the component unmounts
    return () => ctx.revert();
  }, [text, delay, variant, colorVariants, glitchIntensity]);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* Background canvas for line effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />
      
      {/* Text container */}
      <div ref={textRef} className="relative">
        {characters.map((char, index) => (
          <motion.span
            key={index}
            className="char inline-block relative"
            style={{
              fontFamily: variantStyles.fontFamily,
              textShadow: variantStyles.textShadow,
              letterSpacing: variantStyles.letterSpacing,
              ...(variantStyles.fontWeight ? { fontWeight: variantStyles.fontWeight } : {}),
              ...(variantStyles.textTransform ? { textTransform: variantStyles.textTransform as "none" | "capitalize" | "uppercase" | "lowercase" | "initial" | "inherit" } : {}),
              ...(variantStyles.fontStyle ? { fontStyle: variantStyles.fontStyle } : {}),
              color: variant === 'neon' && index % 2 === 0 ? colorVariants.primary : colorVariants.highlight
            }}
            whileHover={interactive ? { 
              scale: 1.2, 
              color: colorVariants.primary,
              textShadow: `0 0 15px ${colorVariants.primary}, 0 0 30px ${colorVariants.primary}`
            } : undefined}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
      
      {/* Particle effects layer */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}