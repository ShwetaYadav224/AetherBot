import fetch from "node-fetch";
import cache from './cache.js';

// Mock responses for testing when API key is invalid
const mockResponses = [
  "Hello! I'm AetherBot running in demo mode. To enable full AI responses, please add a valid GROQ_API_KEY to your .env file.",
  "I'm currently in mock mode. Get a free API key from https://console.groq.com/keys",
  "Demo response: I understand your message, but I need a valid Groq API key to provide real AI responses.",
];

let mockIndex = 0;

export default async function getChatCompletion(message) {
  // Check cache first
  const cachedResponse = cache.get(message);
  if (cachedResponse) {
    console.log('Cache hit for message:', message.substring(0, 50) + '...');
    return cachedResponse;
  }

  const apiKey = process.env.GROQ_API_KEY;

  // If no API key or it's a placeholder, return mock response
  if (!apiKey || apiKey.includes('your-') || apiKey.includes('placeholder') || apiKey.length < 20) {
    console.log('No valid GROQ_API_KEY, using mock response');
    return mockResponses[0];
  }

  console.log('Cache miss, calling Groq API for message:', message.substring(0, 50) + '...');

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: message }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Groq API error: ${response.status} ${errorBody}`);

      // If API key is invalid, return mock response
      if (response.status === 401) {
        console.log('Invalid GROQ_API_KEY, using mock response');
        return `Demo Mode: Your Groq API key is invalid. Please get a free key from https://console.groq.com/keys\n\nYour message was: "${message}"`;
      }

      throw new Error(`Groq API error: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error("Malformed Groq API response");

    // Cache the response
    cache.set(message, reply);

    return reply;
  } catch (error) {
    console.error('Groq API call failed:', error.message);
    // Return a helpful mock response on error
    const mockReply = `Demo Mode: ${mockResponses[mockIndex++ % mockResponses.length]}`;
    return mockReply;
  }
}
