// Simple in-memory cache for OpenAI API responses
// In production, consider using Redis or similar distributed cache

class ResponseCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000; // Maximum number of cached responses
    this.ttl = 3600000; // 1 hour TTL in milliseconds
  }

  // Generate a cache key from the message content
  generateKey(message) {
    return message.trim().toLowerCase();
  }

  // Get cached response
  get(message) {
    const key = this.generateKey(message);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if cached item has expired
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.response;
  }

  // Set cached response
  set(message, response) {
    const key = this.generateKey(message);
    
    // If cache is full, remove oldest items
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      response,
      expiry: Date.now() + this.ttl
    });
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}

// Create singleton instance
const cache = new ResponseCache();

export default cache;