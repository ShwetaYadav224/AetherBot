export default async function handler(request, response) {
  response.status(501).json({
    error: 'Backend not deployed',
    message: 'Please deploy your backend to Railway and update VITE_API_BASE_URL',
    documentation: 'See BACKEND_DEPLOYMENT_GUIDE.md for instructions'
  });
}

export const config = {
  runtime: 'edge',
};