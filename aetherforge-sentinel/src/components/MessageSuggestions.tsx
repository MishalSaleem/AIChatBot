'use client';

import { motion } from 'framer-motion';
import { EmotionType } from '@/types';

interface MessageSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  currentEmotion: EmotionType;
}

export function MessageSuggestions({ suggestions, onSuggestionClick, currentEmotion }: MessageSuggestionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-aether-cyan/60">
        Suggested queries to explore:
      </h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-2 text-sm bg-aether-black/40 border border-aether-cyan/30 rounded-xl text-aether-cyan/80 hover:text-aether-cyan hover:border-aether-cyan/50 hover:bg-aether-black/60 transition-all duration-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
