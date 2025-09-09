import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("AI Chat API: Received request");
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      console.log("AI Chat API: Invalid messages format", messages);
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    // Use the Cohere API key
    const apiKey = "5lOJHBvBCRUSfeA9PtXjjlTevMIU4zYIzm5qnePY"; // Hardcoded from user input
    
    // Format the messages for Cohere API
    const cohereMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: msg.content
    }));
    
    console.log("AI Chat API: Sending request to Cohere");
    
    // Prepare the request body
    const requestBody = {
      message: messages[messages.length - 1]?.content || "",
      chat_history: cohereMessages.slice(0, -1), // Exclude the latest message
      model: "command",
      temperature: 0.7,
      max_tokens: 1000
    };
    
    console.log("AI Chat API: Request body", JSON.stringify(requestBody));

    // Call Cohere's chat API
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log("AI Chat API: Response status", response.status);
    
    const data = await response.json();
    console.log("AI Chat API: Response data", JSON.stringify(data).substring(0, 200) + "...");

    if (!response.ok) {
      console.log("AI Chat API: Error response", data);
      return res.status(response.status).json({ 
        error: data.message || 'Error communicating with Cohere API' 
      });
    }

    // Format the response to match the expected structure
    console.log("AI Chat API: Successful response, sending back data");
    
    // Check if data.text is available
    if (!data.text) {
      console.log("AI Chat API: Warning - No text in response", data);
      // Provide a fallback response
      return res.status(200).json({
        content: "I'm sorry, I couldn't generate a proper response. Please try again.",
        emotion: 'concern',
        model: 'fallback',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        }
      });
    }
    
    res.status(200).json({ 
      content: data.text,
      emotion: 'neutral',
      model: data.model || 'command',
      usage: {
        promptTokens: data.meta?.billable_units?.input_tokens || 0,
        completionTokens: data.meta?.billable_units?.output_tokens || 0,
        totalTokens: (data.meta?.billable_units?.input_tokens || 0) + (data.meta?.billable_units?.output_tokens || 0)
      }
    });
  } catch (error: any) {
    console.error('AI Chat API error:', error);
    console.log("AI Chat API: Exception caught", error.message || error.toString());
    
    // Return a user-friendly error
    res.status(500).json({ 
      content: "I'm sorry, there was an error processing your request. Please try again later.",
      error: error.message || error.toString(),
      emotion: 'concern',
      model: 'error',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    });
  }
}