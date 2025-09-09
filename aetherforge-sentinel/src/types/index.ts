// Core message types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  emotion?: EmotionType;
  metadata?: {
    responseTime?: number;
    tokens?: number;
    model?: string;
  };
}

// Emotion detection types for reactive UI
export type EmotionType = 
  | 'joy' 
  | 'curiosity' 
  | 'concern' 
  | 'wisdom' 
  | 'energy' 
  | 'neutral';

export interface EmotionData {
  type: EmotionType;
  confidence: number;
  intensity: number;
  color: string;
}

// Chat session types
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  emotionHistory: EmotionData[];
  userPreferences: UserPreferences;
}

// User preferences for personalization
export interface UserPreferences {
  responseLength: 'concise' | 'detailed' | 'comprehensive';
  tone: 'professional' | 'casual' | 'creative' | 'technical';
  language: string;
  theme: 'dark' | 'light' | 'auto';
  animations: boolean;
  soundEffects: boolean;
}

// AI API response types
export interface AIResponse {
  content: string;
  emotion: EmotionType;
  suggestions?: string[];
  confidence: number;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// 3D scene types for Three.js
export interface NebulaParticle {
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  size: number;
  life: number;
}

export interface PortalState {
  isOpen: boolean;
  intensity: number;
  rotation: number;
  scale: number;
  emotion: EmotionType;
}

// Animation states
export interface AnimationState {
  isAnimating: boolean;
  currentAnimation: string;
  progress: number;
  easing: string;
}

// Memory core visualization
export interface MemoryCrystal {
  id: string;
  type: 'conversation' | 'preference' | 'insight';
  size: number;
  color: string;
  position: [number, number, number];
  connections: string[];
}

// Voice activation types
export interface VoiceCommand {
  command: string;
  confidence: number;
  timestamp: Date;
}

// Quantum branching for conversation paths
export interface ConversationBranch {
  id: string;
  title: string;
  description: string;
  messages: Message[];
  parentBranch?: string;
  childBranches: string[];
  emotion: EmotionType;
}

// Settings and configuration
export interface AppSettings {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  enableVoice: boolean;
  enable3D: boolean;
  enableSound: boolean;
  enableEmotionDetection: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userAction?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  responseTime: number;
  animationFPS: number;
  memoryUsage: number;
  networkLatency: number;
  timestamp: Date;
}
