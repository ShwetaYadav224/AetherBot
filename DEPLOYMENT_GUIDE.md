# AetherBot Deployment Guide - Cloudflare Pages

This guide will help you deploy your AetherBot application to Cloudflare Pages.

## Prerequisites

1. Cloudflare account
2. GitHub account (for connecting repository)
3. Backend hosting (separate from Cloudflare Pages)

## Deployment Steps

### 1. Backend Deployment (Required First)

Since Cloudflare Pages only hosts static frontend, you need to deploy your backend separately:

**Options for backend hosting:**
- Railway (recommended)
- Heroku
- DigitalOcean App Platform
- AWS/Azure/GCP
- VPS

**Backend Environment Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `OPENAI_API_KEY`: Your OpenAI API key

### 2. Frontend Deployment to Cloudflare Pages

#### Option A: Connect GitHub Repository

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your GitHub account
3. Select your AetherBot repository
4. Configure build settings:
   - **Build command:** `cd frontend && npm install && npm run build`
   - **Build output directory:** `frontend/dist`
   - **Root directory:** `frontend`

#### Option B: Manual Deployment using Wrangler

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy:
   ```bash
   cd frontend
   npm run build
   wrangler pages deploy dist
   ```

### 3. Environment Variables (Cloudflare Dashboard)

Set these environment variables in your Cloudflare Pages dashboard:

- `VITE_API_BASE_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)
- `VITE_APP_NAME`: `AetherBot`

### 4. Custom Domain (Optional)

1. In Cloudflare Pages, go to your project settings
2. Add your custom domain
3. Update DNS records as instructed

## Build Configuration

The project includes:
- `frontend/_redirects`: SPA routing configuration
- `frontend/functions/_middleware.js`: API proxy middleware
- `frontend/wrangler.toml`: Cloudflare Pages configuration

## Troubleshooting

### Common Cloudflare Workers Issues:

1. **Build fails on GitHub**:
   - Check that the `functions` directory is properly configured
   - Ensure all dependencies are installed (run `npm install` in frontend directory)
   - Verify Node.js version compatibility

2. **API proxy issues**:
   - Check that `BACKEND_URL` environment variable is set in Cloudflare dashboard
   - Verify your backend is running and accessible

3. **CORS issues**:
   - The middleware handles CORS by removing certain headers
   - Ensure your backend also has proper CORS configuration

4. **Function errors**:
   - Check Cloudflare Workers logs in the dashboard
   - Test the middleware function locally if possible

### Reinstalling Dependencies:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### GitHub Integration Issues:

If connecting GitHub to Cloudflare Pages fails:

1. **Check repository permissions**: Ensure Cloudflare has access to your repo
2. **Build configuration**:
   - Build command: `cd frontend && npm install && npm run build`
   - Build output directory: `frontend/dist`
   - Root directory: `frontend`

3. **Environment variables**: Set these in Cloudflare Pages dashboard:
   - `BACKEND_URL`: Your backend API URL
   - `NODE_VERSION`: `18` (or your preferred version)

## Post-Deployment

1. Test your application at the provided Cloudflare Pages URL
2. Verify authentication and chat functionality work
3. Check that all API endpoints are properly proxied

## Monitoring

- Use Cloudflare Analytics to monitor traffic
- Check backend logs for API errors
- Monitor performance in Cloudflare Dashboard