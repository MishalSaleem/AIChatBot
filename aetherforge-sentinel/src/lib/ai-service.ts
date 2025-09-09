import OpenAI from 'openai';
import { AIResponse, Message } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Note: In production, use API routes instead
});

export class AIService {
  private static instance: AIService;
  private isStreaming = false;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Generate AI response with streaming
  async generateResponse(
    messages: Message[],
    onChunk?: (chunk: string) => void,
    onComplete?: (response: AIResponse) => void
  ): Promise<AIResponse> {
    if (this.isStreaming) {
      throw new Error('Already streaming a response');
    }

    this.isStreaming = true;
    let fullResponse = '';

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk?.(content);
        }
      }

      // Detect emotion from the complete response
      const emotion = this.detectEmotionFromResponse(fullResponse);
      
      const response: AIResponse = {
        content: fullResponse,
        emotion: emotion.type,
        confidence: emotion.confidence,
        model: 'gpt-4o',
        usage: {
          promptTokens: 0, // Would need to calculate from messages
          completionTokens: fullResponse.length,
          totalTokens: fullResponse.length
        }
      };

      onComplete?.(response);
      return response;

    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    } finally {
      this.isStreaming = false;
    }
  }

  // Detect emotion from AI response content
  private detectEmotionFromResponse(content: string): {
    type: 'joy' | 'curiosity' | 'concern' | 'wisdom' | 'energy' | 'neutral';
    confidence: number;
    intensity: number;
  } {
    const text = content.toLowerCase();
    
    // Emotion scoring system
    const emotions = {
      joy: {
        keywords: ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'brilliant', 'awesome', 'perfect', 'love', 'enjoy', 'happy', 'excited'],
        score: 0
      },
      curiosity: {
        keywords: ['interesting', 'curious', 'wonder', 'explore', 'investigate', 'discover', 'learn', 'understand', 'question', 'why', 'how', 'what if'],
        score: 0
      },
      concern: {
        keywords: ['careful', 'warning', 'danger', 'risk', 'problem', 'issue', 'concern', 'worried', 'caution', 'attention', 'important', 'critical'],
        score: 0
      },
      wisdom: {
        keywords: ['consider', 'think', 'reflect', 'experience', 'knowledge', 'insight', 'wisdom', 'perspective', 'understanding', 'awareness', 'mindful'],
        score: 0
      },
      energy: {
        keywords: ['powerful', 'dynamic', 'energetic', 'fast', 'quick', 'rapid', 'boost', 'accelerate', 'momentum', 'drive', 'force', 'strength'],
        score: 0
      }
    };

    // Calculate scores
    Object.keys(emotions).forEach(emotionKey => {
      const emotion = emotions[emotionKey as keyof typeof emotions];
      emotion.score = emotion.keywords.filter(keyword => text.includes(keyword)).length;
    });

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      a[1].score > b[1].score ? a : b
    );

    const confidence = Math.min(dominantEmotion[1].score / 3, 1);
    const intensity = Math.min(dominantEmotion[1].score / 2, 1);

    return {
      type: dominantEmotion[0] as any,
      confidence,
      intensity
    };
  }

  // Generate conversation suggestions
  async generateSuggestions(context: string): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Generate 3-5 engaging conversation starters or follow-up questions based on the context. Keep them concise and interesting.'
          },
          {
            role: 'user',
            content: context
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      });

      const suggestions = response.choices[0]?.message?.content || '';
      return suggestions.split('\n').filter(s => s.trim().length > 0).slice(0, 5);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [
        'Tell me more about that',
        'What are your thoughts on this?',
        'How does this make you feel?',
        'What would you like to explore next?'
      ];
    }
  }

  // Analyze conversation sentiment
  async analyzeSentiment(messages: Message[]): Promise<{
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotions: string[];
  }> {
    try {
      const recentMessages = messages.slice(-5); // Last 5 messages
      const content = recentMessages.map(m => m.content).join(' ');
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of this conversation. Return a JSON object with: overall (positive/neutral/negative), confidence (0-1), and emotions (array of emotion words).'
          },
          {
            role: 'user',
            content: content
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      });

      const analysis = response.choices[0]?.message?.content || '';
      
      try {
        return JSON.parse(analysis);
      } catch {
        return {
          overall: 'neutral',
          confidence: 0.5,
          emotions: ['curious']
        };
      }
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      return {
        overall: 'neutral',
        confidence: 0.5,
        emotions: ['neutral']
      };
    }
  }

  // Check if API key is valid
  async validateAPIKey(): Promise<boolean> {
    try {
      await openai.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await openai.models.list();
      return models.data.map(model => model.id);
    } catch (error) {
      console.error('Failed to get models:', error);
      return ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
