import fetch from "node-fetch";
import cache from './cache.js';

export default async function getChatCompletion(message) {
  // Check cache first
  const cachedResponse = cache.get(message);
  if (cachedResponse) {
    console.log('Cache hit for message:', message.substring(0, 50) + '...');
    return cachedResponse;
  }

  console.log('Cache miss, calling Groq API for message:', message.substring(0, 50) + '...');
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set in the environment");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
      max_tokens: 500, // Limit response length for performance
      temperature: 0.7, // Balance between creativity and consistency
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errorBody}`);
  }
  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Malformed Groq API response");
  
  // Cache the response
  cache.set(message, reply);
  
  return reply;
}
