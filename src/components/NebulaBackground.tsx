'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
// Assuming you have a types file, if not, you might need to define EmotionType
// For example: export type EmotionType = 'joy' | 'curiosity' | 'concern' | 'wisdom' | 'energy' | 'neutral';
import { EmotionType } from '@/types'; 

interface NebulaBackgroundProps {
  emotion?: EmotionType;
  intensity?: number;
}

export function NebulaBackground({ emotion = 'neutral', intensity = 0.5 }: NebulaBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Emotion-based color mapping
  const emotionColors = useMemo(() => ({
    joy: { primary: 0xFFD700, secondary: 0xFFA500, accent: 0xFFFF00 },
    curiosity: { primary: 0x00FFFF, secondary: 0x0080FF, accent: 0x00FF80 },
    concern: { primary: 0xFF6B35, secondary: 0xFF4500, accent: 0xFF8C00 },
    wisdom: { primary: 0x8A2BE2, secondary: 0x9370DB, accent: 0xBA55D3 },
    energy: { primary: 0x39FF14, secondary: 0x00FF00, accent: 0x32CD32 },
    neutral: { primary: 0x00FFFF, secondary: 0x0080FF, accent: 0x00FF80 }
  }), []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create nebula particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const currentColors = emotionColors[emotion];
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a nebula-like formation
      const radius = Math.random() * 100 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color variation based on emotion
      const colorVariation = Math.random();
      if (colorVariation < 0.4) {
        const c = new THREE.Color(currentColors.primary);
        colors.set([c.r, c.g, c.b], i * 3);
      } else if (colorVariation < 0.7) {
        const c = new THREE.Color(currentColors.secondary);
        colors.set([c.r, c.g, c.b], i * 3);
      } else {
        const c = new THREE.Color(currentColors.accent);
        colors.set([c.r, c.g, c.b], i * 3);
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    // Create particle geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create particle material
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Create particle system
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Add point light for glow effect
    const pointLight = new THREE.PointLight(currentColors.primary, 1, 100);
    pointLight.position.set(0, 0, 30);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // *** FIX IS HERE: 'time' is now defined at the top of the function ***
      const time = Date.now() * 0.001;

      if (particlesRef.current) {
        // Rotate nebula
        particlesRef.current.rotation.y += 0.001 * intensity;
        particlesRef.current.rotation.x += 0.0005 * intensity;

        // Pulse particles based on emotion intensity
        (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.6 + 0.2 * Math.sin(time * 2) * intensity;
      }

      // Move camera slightly for parallax effect
      camera.position.x = Math.sin(time * 0.1) * 5;
      camera.position.y = Math.cos(time * 0.1) * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [emotionColors, emotion, intensity]);

  // Update particle colors when emotion changes
  useEffect(() => {
    if (particlesRef.current && particlesRef.current.geometry) {
      const colors = particlesRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const currentColors = emotionColors[emotion];
      
      for (let i = 0; i < colors.count; i++) {
        const colorVariation = Math.random();
        let targetColor;
        if (colorVariation < 0.4) {
          targetColor = new THREE.Color(currentColors.primary);
        } else if (colorVariation < 0.7) {
          targetColor = new THREE.Color(currentColors.secondary);
        } else {
          targetColor = new THREE.Color(currentColors.accent);
        }
        colors.setXYZ(i, targetColor.r, targetColor.g, targetColor.b);
      }
      
      colors.needsUpdate = true;
    }
  }, [emotion, emotionColors]);

  return (
    <motion.div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
}