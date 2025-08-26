export default async function handler(request, response) {
  // This is a placeholder function for Vercel
  // In production, you should deploy your backend to Railway
  response.status(501).json({
    error: 'Backend not deployed',
    message: 'Please deploy your backend to Railway and update VITE_API_BASE_URL',
    documentation: 'See BACKEND_DEPLOYMENT_GUIDE.md for instructions'
  });
}

export const config = {
  runtime: 'edge',
};