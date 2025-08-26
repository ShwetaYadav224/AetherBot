# Backend Deployment Guide - Railway

## Prerequisites
1. Create a Railway account at https://railway.app/
2. Install Railway CLI: `npm install -g @railway/cli`

## Deployment Steps

### 1. Deploy Backend to Railway

```bash
cd AetherBot/backend

# Login to Railway
railway login

# Create new project
railway init

# Deploy to Railway
railway deploy
```

### 2. Set Environment Variables on Railway

After deployment, set these environment variables in your Railway dashboard:

- `JWT_SECRET` - A strong random secret for JWT tokens
- `MONGODB_URI` - Your MongoDB connection string
- `GROQ_API_KEY` - Your Groq API key
- `FRONTEND_URL` - Your frontend URL (e.g., `https://aether-bot-ten.vercel.app`)

### 3. Get Backend URL

After deployment, Railway will provide you with a public URL for your backend (e.g., `https://aetherbot-backend.up.railway.app`).

### 4. Update Frontend Configuration

Update your frontend environment variables to use the Railway backend URL:

```bash
# In AetherBot/frontend/.env
VITE_API_BASE_URL=https://your-backend-url.up.railway.app/api
```

### 5. Redeploy Frontend

Redeploy your frontend to Vercel to use the new backend URL.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for JWT token signing | `your-super-secret-jwt-key` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `GROQ_API_KEY` | Groq API key | `gsk_...` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://aether-bot-ten.vercel.app` |
| `PORT` | Server port (optional) | `5000` |

## Troubleshooting

1. **CORS Issues**: Ensure `FRONTEND_URL` is set correctly in Railway
2. **Database Connection**: Verify `MONGODB_URI` is correct
3. **API Keys**: Ensure `GROQ_API_KEY` is valid
4. **Health Check**: Check `/health` endpoint after deployment

## Monitoring

- Check Railway dashboard for deployment status
- Monitor logs in Railway console
- Test API endpoints with tools like Postman or curl