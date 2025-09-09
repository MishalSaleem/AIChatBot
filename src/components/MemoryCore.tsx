'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { ChatSession, EmotionType } from '@/types';
import { Brain, History, Zap, Sparkles, ChevronRight, BarChart3, Wand2, Activity, Clock, Lightbulb } from 'lucide-react';

interface MemoryCoreProps {
  currentSession: ChatSession | null;
  emotion: EmotionType;
}

export function MemoryCore({ currentSession, emotion }: MemoryCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brainControls = useAnimationControls();
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'insights'>('overview');
  const [pulseAnimation, setPulseAnimation] = useState(true);
  
  // Emotion color mapping
  const emotionColors = {
    joy: { primary: '#FFD700', secondary: '#FFA500', accent: '#FFFF00', name: 'Joy' },
    curiosity: { primary: '#00FFFF', secondary: '#0080FF', accent: '#00FF80', name: 'Curiosity' },
    concern: { primary: '#FF6B35', secondary: '#FF4500', accent: '#FF8C00', name: 'Concern' },
    wisdom: { primary: '#8A2BE2', secondary: '#9370DB', accent: '#BA55D3', name: 'Wisdom' },
    energy: { primary: '#39FF14', secondary: '#00FF00', accent: '#32CD32', name: 'Energy' },
    neutral: { primary: '#00FFFF', secondary: '#0080FF', accent: '#00FF80', name: 'Neutral' }
  };
  
  const colors = emotionColors[emotion] || emotionColors.neutral;

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create nodes and connections for neural network
    const nodes: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];
    
    const connections: Array<{
      from: number;
      to: number;
      strength: number;
      speed: number;
      phase: number;
    }> = [];
    
    // Initialize nodes
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: i % 3 === 0 ? colors.primary : (i % 3 === 1 ? colors.secondary : colors.accent),
        pulseSpeed: 0.02 + Math.random() * 0.04,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    
    // Create connections between nodes (not fully connected)
    for (let i = 0; i < nodeCount; i++) {
      // Create 2-3 connections per node
      const connectionCount = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < connectionCount; j++) {
        const toNode = Math.floor(Math.random() * nodeCount);
        if (i !== toNode) {
          connections.push({
            from: i,
            to: toNode,
            strength: 0.1 + Math.random() * 0.5,
            speed: 0.02 + Math.random() * 0.04,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }
    
    // Animation variables
    let animationFrameId: number;
    let time = 0;
    
    // Render function
    const render = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw connections
      for (const conn of connections) {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        // Calculate strength (animated)
        const animatedStrength = conn.strength * (0.3 + 0.7 * Math.sin(time * conn.speed + conn.phase));
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(
          fromNode.x, fromNode.y, 
          toNode.x, toNode.y
        );
        
        gradient.addColorStop(0, fromNode.color + Math.floor(animatedStrength * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, toNode.color + Math.floor(animatedStrength * 255).toString(16).padStart(2, '0'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = animatedStrength * 2;
        ctx.stroke();
        
        // Draw data pulse moving along connection
        if (Math.random() < 0.01) {
          const pulseDuration = 50 + Math.floor(Math.random() * 30);
          let pulseProgress = 0;
          
          const animatePulse = () => {
            pulseProgress++;
            
            const progress = pulseProgress / pulseDuration;
            const x = fromNode.x + (toNode.x - fromNode.x) * progress;
            const y = fromNode.y + (toNode.y - fromNode.y) * progress;
            
            ctx.beginPath();
            ctx.arc(x, y, 1 + Math.sin(progress * Math.PI) * 2, 0, Math.PI * 2);
            ctx.fillStyle = fromNode.color;
            ctx.fill();
            
            if (pulseProgress < pulseDuration) {
              requestAnimationFrame(animatePulse);
            }
          };
          
          requestAnimationFrame(animatePulse);
        }
      }
      
      // Update and draw nodes
      for (const node of nodes) {
        // Update position
        node.x += node.speedX;
        node.y += node.speedY;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
        
        // Calculate pulse effect
        const pulse = 0.7 + 0.3 * Math.sin(time * node.pulseSpeed + node.pulsePhase);
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Draw glow
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 3 * pulse
        );
        
        glow.addColorStop(0, node.color + 'AA');
        glow.addColorStop(1, node.color + '00');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3 * pulse, 0, Math.PI * 2);
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
  }, [colors]);
  
  // Brain icon animation
  useEffect(() => {
    const animateBrain = async () => {
      while (pulseAnimation) {
        await brainControls.start({
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          filter: [
            'drop-shadow(0 0 5px rgba(0, 255, 255, 0.5))',
            'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))',
            'drop-shadow(0 0 5px rgba(0, 255, 255, 0.5))'
          ],
          transition: { duration: 3, ease: "easeInOut" }
        });
      }
    };
    
    animateBrain();
    
    return () => {
      setPulseAnimation(false);
    };
  }, [brainControls, pulseAnimation]);
  
  // Generate random data for visualization
  const generateEmotionHistory = () => {
    if (!currentSession) return [];
    
    return currentSession.emotionHistory || [
      { type: 'neutral', confidence: 0.8, intensity: 0.5, color: '#00FFFF' },
      { type: 'curiosity', confidence: 0.9, intensity: 0.7, color: '#00FFFF' },
      { type: 'wisdom', confidence: 0.7, intensity: 0.6, color: '#8A2BE2' },
      { type: 'joy', confidence: 0.8, intensity: 0.8, color: '#FFD700' },
      { type: 'concern', confidence: 0.6, intensity: 0.4, color: '#FF6B35' }
    ];
  };
  
  const messageCount = currentSession?.messages.length || 0;
  const userMessages = currentSession?.messages.filter(m => m.role === 'user').length || 0;
  const aiMessages = currentSession?.messages.filter(m => m.role === 'assistant').length || 0;
  const emotionHistory = generateEmotionHistory();

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with Brain */}
      <motion.div
        initial={{ opacity: 0, y: "20px" }}
        animate={{ opacity: 1, y: "0px" }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center relative z-10"
      >
        <div className="relative w-24 h-24 mx-auto mb-2">
          {/* Orbiting rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: colors.primary + '70' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border"
            style={{ borderColor: colors.secondary + '50' }}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Central brain icon */}
          <motion.div 
            className="absolute inset-5 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
            style={{
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.accent + '40',
              boxShadow: `0 0 20px ${colors.primary}50, inset 0 0 10px ${colors.secondary}30`
            }}
            animate={brainControls}
          >
            <Brain 
              size={32} 
              style={{ 
                color: colors.primary,
                filter: `drop-shadow(0 0 5px ${colors.primary}80)`
              }}
            />
          </motion.div>
          
          {/* Energy particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 3 === 0 ? colors.primary : (i % 3 === 1 ? colors.secondary : colors.accent),
                top: '50%',
                left: '50%'
              }}
              animate={{
                x: [
                  `${Math.cos(i * Math.PI * 2 / 3) * 30}px`,
                  `${Math.cos((i * Math.PI * 2 / 3) + Math.PI) * 30}px`,
                  `${Math.cos(i * Math.PI * 2 / 3) * 30}px`
                ],
                y: [
                  `${Math.sin(i * Math.PI * 2 / 3) * 30}px`,
                  `${Math.sin((i * Math.PI * 2 / 3) + Math.PI) * 30}px`,
                  `${Math.sin(i * Math.PI * 2 / 3) * 30}px`
                ],
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-1" style={{ color: colors.primary }}>
          Memory Core
        </h2>
        <p className="text-sm" style={{ color: colors.primary + 'A0' }}>
          Quantum neural network
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-center gap-2 py-1"
      >
        {['overview', 'emotions', 'insights'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              activeTab === tab
                ? 'bg-white/10 backdrop-blur-sm'
                : 'bg-transparent hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              color: activeTab === tab ? colors.primary : colors.primary + '80',
              boxShadow: activeTab === tab ? `0 0 10px ${colors.primary}30` : 'none',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: activeTab === tab ? colors.primary + '40' : 'transparent'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Neural network canvas background */}
      <div className="relative flex-grow overflow-hidden rounded-xl border" 
        style={{ 
          borderColor: colors.primary + '30',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      >
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />
        
        {/* Tab Content with glass panels */}
        <div className="relative z-10 h-full p-4 overflow-y-auto scrollbar-thin">
          {/* Overview Tab */}
          {activeTab === 'overview' && currentSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Session info */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.secondary + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.secondary }}
                >
                  <History size={16} />
                  Active Session
                </h3>
                <div className="space-y-2 text-xs" style={{ color: colors.secondary + 'D0' }}>
                  <div className="flex justify-between items-center">
                    <span>Title:</span>
                    <span className="font-medium" style={{ color: colors.primary }}>
                      {currentSession.title}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Created:</span>
                    <span className="font-medium" style={{ color: colors.primary }}>
                      {new Date(currentSession.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Last Updated:</span>
                    <span className="font-medium" style={{ color: colors.primary }}>
                      {new Date(currentSession.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Message Stats */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.primary + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <BarChart3 size={16} />
                  Conversation Stats
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold" style={{ color: colors.primary }}>
                      {messageCount}
                    </p>
                    <p className="text-xs" style={{ color: colors.primary + 'A0' }}>
                      Total Messages
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold" style={{ color: colors.secondary }}>
                      {userMessages}
                    </p>
                    <p className="text-xs" style={{ color: colors.secondary + 'A0' }}>
                      User Messages
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold" style={{ color: colors.accent }}>
                      {aiMessages}
                    </p>
                    <p className="text-xs" style={{ color: colors.accent + 'A0' }}>
                      AI Responses
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Current State */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.accent + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.accent }}
                >
                  <Activity size={16} />
                  Current State
                </h3>
                
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: colors.primary + '20',
                      boxShadow: `0 0 20px ${colors.primary}50`
                    }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        `0 0 10px ${colors.primary}30`,
                        `0 0 30px ${colors.primary}50`,
                        `0 0 10px ${colors.primary}30`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles style={{ color: colors.primary }} size={18} />
                  </motion.div>
                  
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.primary }}>
                      {colors.name} State
                    </p>
                    <p className="text-xs" style={{ color: colors.primary + 'A0' }}>
                      AI emotional response
                    </p>
                  </div>
                </div>
                
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    initial={{ width: '0%' }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: colors.primary + '80' }}>
                  <span>Intensity</span>
                  <span>70%</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Emotions Tab */}
          {activeTab === 'emotions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Current Emotion */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.primary + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <Sparkles size={16} />
                  Current Emotion
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-full"
                      style={{
                        backgroundColor: colors.primary,
                        boxShadow: `0 0 20px ${colors.primary}`
                      }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div>
                      <p className="text-base font-medium capitalize" style={{ color: colors.primary }}>
                        {emotion}
                      </p>
                      <p className="text-xs" style={{ color: colors.primary + 'A0' }}>
                        Primary State
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    className="bg-black/20 backdrop-blur-sm rounded-md px-3 py-1 text-xs font-medium"
                    style={{ color: colors.primary }}
                    animate={{
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        `0 0 0px ${colors.primary}00`,
                        `0 0 10px ${colors.primary}40`,
                        `0 0 0px ${colors.primary}00`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Active
                  </motion.div>
                </div>
              </div>
              
              {/* Emotion History */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.secondary + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.secondary }}
                >
                  <Clock size={16} />
                  Emotion History
                </h3>
                
                <div className="space-y-3">
                  {emotionHistory.map((emotion, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: emotion.color }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ 
                          duration: 2 + index * 0.5, 
                          repeat: Infinity, 
                          ease: "easeInOut", 
                          delay: index * 0.2 
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs capitalize" style={{ color: colors.secondary }}>
                            {emotion.type}
                          </span>
                          <span className="text-xs" style={{ color: colors.secondary + '80' }}>
                            {Math.floor(emotion.confidence * 100)}% confidence
                          </span>
                        </div>
                        
                        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: emotion.color }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${emotion.intensity * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Conversation Insights */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.accent + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.accent }}
                >
                  <Lightbulb size={16} />
                  AI Insights
                </h3>
                
                <div className="space-y-3">
                  {['Topic Analysis', 'User Preferences', 'Conversation Flow'].map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-start gap-2 bg-white/5 p-3 rounded-lg"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                      >
                        <Wand2 size={14} style={{ color: colors.accent }} />
                      </motion.div>
                      
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: colors.accent }}>
                          {insight}
                        </p>
                        <p className="text-xs" style={{ color: colors.accent + 'A0' }}>
                          {i === 0 && "Main topics: AI, technology, assistance"}
                          {i === 1 && "User prefers: detailed responses with visuals"}
                          {i === 2 && "Turn-taking pattern: balanced with 1:1 ratio"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* User Interaction Stats */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border"
                style={{ borderColor: colors.secondary + '30' }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.secondary }}
                >
                  <Activity size={16} />
                  Interaction Metrics
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Avg. Response Time', value: '1.2s' },
                    { label: 'User Engagement', value: 'High' },
                    { label: 'Total Session Time', value: '12m' },
                    { label: 'Topic Changes', value: '3' }
                  ].map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white/5 p-3 rounded-lg text-center"
                    >
                      <p className="text-lg font-semibold" style={{ color: colors.primary }}>
                        {metric.value}
                      </p>
                      <p className="text-xs" style={{ color: colors.secondary + '90' }}>
                        {metric.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Advanced Features */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border"
                style={{ borderColor: colors.primary + '30' }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between text-xs p-2 rounded-md"
                  style={{ 
                    color: colors.primary, 
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Zap size={14} />
                    <span>Generate Conversation Summary</span>
                  </span>
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}