'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from '@/components/ChatInterface';
import { useChat } from '@/hooks/useChat';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking');
  const router = useRouter();
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    error
  } = useChat();

  // Set API key status to valid since we're using a hardcoded Cohere API key
  useEffect(() => {
    setApiKeyStatus('valid');
  }, []);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const getApiKeyStatusText = () => {
    switch (apiKeyStatus) {
      case 'checking': return 'Checking...';
      case 'valid': return 'Connected';
      case 'invalid': return 'Invalid key';
      case 'missing': return 'Not configured';
      default: return 'Unknown';
    }
  };

  const getApiKeyStatusColor = () => {
    switch (apiKeyStatus) {
      case 'valid': return 'bg-green-500';
      case 'invalid': return 'bg-red-500';
      case 'missing': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
              <p className="text-sm text-gray-400">Ready to help you</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Chat Area */}
      <div className="max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[calc(100vh-120px)]"
        >
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearChat={clearChat}
            error={error}
          />
        </motion.div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-sm border-l border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Status
              </label>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getApiKeyStatusColor()}`} />
                <span className="text-sm text-gray-400">
                  Cohere API {getApiKeyStatusText()}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clear Chat History
              </label>
              <button
                onClick={clearChat}
                className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                Clear All Messages
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}