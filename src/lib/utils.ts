import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Emotion detection utility - analyzes AI responses to determine emotional tone
export function detectEmotion(content: string): {
  type: 'joy' | 'curiosity' | 'concern' | 'wisdom' | 'energy' | 'neutral';
  confidence: number;
  intensity: number;
  color: string;
} {
  const text = content.toLowerCase();
  
  // Joy indicators
  const joyWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'brilliant', 'awesome', 'perfect', 'love', 'enjoy', 'happy', 'excited'];
  const joyScore = joyWords.filter(word => text.includes(word)).length;
  
  // Curiosity indicators
  const curiosityWords = ['interesting', 'curious', 'wonder', 'explore', 'investigate', 'discover', 'learn', 'understand', 'question', 'why', 'how', 'what if'];
  const curiosityScore = curiosityWords.filter(word => text.includes(word)).length;
  
  // Concern indicators
  const concernWords = ['careful', 'warning', 'danger', 'risk', 'problem', 'issue', 'concern', 'worried', 'caution', 'attention', 'important', 'critical'];
  const concernScore = concernWords.filter(word => text.includes(word)).length;
  
  // Wisdom indicators
  const wisdomWords = ['consider', 'think', 'reflect', 'experience', 'knowledge', 'insight', 'wisdom', 'perspective', 'understanding', 'awareness', 'mindful'];
  const wisdomScore = wisdomWords.filter(word => text.includes(word)).length;
  
  // Energy indicators
  const energyWords = ['powerful', 'dynamic', 'energetic', 'fast', 'quick', 'rapid', 'boost', 'accelerate', 'momentum', 'drive', 'force', 'strength'];
  const energyScore = energyWords.filter(word => text.includes(word)).length;
  
  const scores = [
    { type: 'joy', score: joyScore, color: '#FFD700' },
    { type: 'curiosity', score: curiosityScore, color: '#00FFFF' },
    { type: 'concern', score: concernScore, color: '#FF6B35' },
    { type: 'wisdom', score: wisdomScore, color: '#8A2BE2' },
    { type: 'energy', score: energyScore, color: '#39FF14' }
  ];
  
  const maxScore = Math.max(...scores.map(s => s.score));
  const dominantEmotion = scores.find(s => s.score === maxScore) || { type: 'neutral', score: 0, color: '#00FFFF' };
  
  const confidence = Math.min(maxScore / 3, 1); // Normalize confidence
  const intensity = Math.min(maxScore / 2, 1); // Normalize intensity
  
  return {
    type: dominantEmotion.type as any,
    confidence,
    intensity,
    color: dominantEmotion.color
  };
}

// Generate unique IDs for messages and sessions
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Format timestamp for display
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Generate conversation title from first message
export function generateConversationTitle(firstMessage: string): string {
  const words = firstMessage.split(' ').slice(0, 5);
  return words.join(' ') + (firstMessage.length > 30 ? '...' : '');
}

// Color utilities for emotion-reactive UI
export function getEmotionColor(emotion: string, intensity: number = 1): string {
  const baseColors = {
    joy: '#FFD700',
    curiosity: '#00FFFF',
    concern: '#FF6B35',
    wisdom: '#8A2BE2',
    energy: '#39FF14',
    neutral: '#00FFFF'
  };
  
  const baseColor = baseColors[emotion as keyof typeof baseColors] || baseColors.neutral;
  
  // Adjust brightness based on intensity
  if (intensity < 0.5) {
    return adjustBrightness(baseColor, -0.3);
  } else if (intensity > 0.8) {
    return adjustBrightness(baseColor, 0.2);
  }
  
  return baseColor;
}

// Adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Local storage utilities
export function saveToLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultValue;
  }
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for smooth animations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Random utilities for particle effects
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Easing functions for smooth animations
export const easing = {
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number): number => t * t * t,
  bounce: (t: number): number => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
};
