// Cloudflare Pages Functions middleware
// This handles API requests and proxies them to your backend
export const onRequest = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Proxy API requests to your backend
  if (url.pathname.startsWith('/api/')) {
    // Use environment variable for backend URL
    const backendUrl = env.BACKEND_URL || 'http://localhost:5002';
    const apiUrl = new URL(url.pathname + url.search, backendUrl);

    // Create new headers to avoid CORS issues
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('origin');
    headers.delete('referer');

    return fetch(apiUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
    });
  }

  // For all other requests, serve the static assets
  return context.next();
};