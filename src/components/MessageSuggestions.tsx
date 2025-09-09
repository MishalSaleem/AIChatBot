'use client';

import { motion } from 'framer-motion';

interface MessageSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export function MessageSuggestions({ suggestions, onSuggestionClick }: MessageSuggestionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">Try asking about:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 text-white/80 hover:text-white"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}