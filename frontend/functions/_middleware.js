// Cloudflare Pages Functions middleware
// This handles API requests and proxies them to your backend
export const onRequest = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  
  // Proxy API requests to your backend
  if (url.pathname.startsWith('/api/')) {
    // Replace with your actual backend URL
    const backendUrl = 'https://your-backend-domain.com';
    const apiUrl = new URL(url.pathname + url.search, backendUrl);
    
    return fetch(apiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  }
  
  // For all other requests, serve the static assets
  return context.next();
};