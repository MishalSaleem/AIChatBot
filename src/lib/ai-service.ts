
import { AIResponse, Message } from '@/types';

export class AIService {
  private static instance: AIService;

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
    // We don't need to check API key on client side anymore as it's handled server-side
    let fullResponse = '';

    try {
      // Call the Next.js API route
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      
      // Handle error responses
      if (!res.ok) {
        const errorMsg = data.error || 'AI request failed';
        console.error('AI Service Error:', errorMsg);
        
        // Create a response with the error content
        const errorResponse: AIResponse = {
          content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
          emotion: 'concern',
          confidence: 1,
          model: 'error-fallback',
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          }
        };
        
        // Call onChunk to show the error message
        onChunk?.(errorResponse.content);
        onComplete?.(errorResponse);
        return errorResponse;
      }

      // Extract response data
      fullResponse = data.content;
      
      // Call onChunk with the full response
      onChunk?.(fullResponse);

      // Create the response object using all data from the API
      const response: AIResponse = {
        content: fullResponse,
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 1,
        model: data.model || 'command',
        usage: data.usage || {
          promptTokens: 0,
          completionTokens: fullResponse.length,
          totalTokens: fullResponse.length
        }
      };

      onComplete?.(response);
      return response;

    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  // Check if API key is valid (now always true, since handled server-side)
  async validateAPIKey(): Promise<boolean> {
    return true;
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
