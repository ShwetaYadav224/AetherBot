# AetherBot Production Deployment Guide

## Overview
AetherBot is a production-ready chat application with authentication, AI-powered responses, and comprehensive monitoring. This guide covers deployment to production environments.

## Architecture
- **Frontend**: React Vite app deployed to Cloudflare Pages
- **Backend**: Node.js/Express API server with MongoDB
- **AI Provider**: Groq API for LLM responses
- **Caching**: In-memory response caching for performance

## Prerequisites

### System Requirements
- Node.js 18+ 
- MongoDB database (Atlas or self-hosted)
- Groq API account and API key

### Environment Setup
1. Clone the repository
2. Install dependencies: `npm install` in both frontend and backend directories
3. Set up environment variables

## Environment Variables

### Backend (.env)
```bash
# Required
MONGODB_URI=mongodb://localhost:27017/aetherbot
JWT_SECRET=your-super-secret-jwt-key-here
GROQ_API_KEY=your-groq-api-key-here

# Optional
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.pages.dev
LOG_LEVEL=info
```

### Frontend (Cloudflare Pages Environment Variables)
```bash
VITE_API_URL=https://your-backend-domain.com
```

## Deployment Steps

### Backend Deployment

#### Option 1: Traditional Server (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Deploy application
cd backend
npm ci --only=production

# Start with PM2
pm2 start server.js --name aetherbot-backend
pm2 save
pm2 startup
```

#### Option 2: Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t aetherbot-backend .
docker run -p 3001:3001 -e MONGODB_URI=... aetherbot-backend
```

#### Option 3: Platform-as-a-Service
- **Railway**: Connect GitHub repo, set env vars
- **Render**: Connect repo, set build command: `npm ci --only=production`
- **Heroku**: Add buildpacks, set config vars

### Frontend Deployment (Cloudflare Pages)

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `18`
3. Set environment variables in Cloudflare dashboard
4. Deploy

## Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Set up IP whitelisting
4. Get connection string

### Self-hosted MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Security Considerations

### SSL/TLS
- Use Cloudflare for frontend SSL
- Use Let's Encrypt for backend SSL or use a reverse proxy
- Enable HTTPS redirects

### Rate Limiting
- Backend has built-in rate limiting (100 requests/15min per IP in production)
- Adjust limits in `server.js` as needed

### Environment Security
- Never commit `.env` files
- Use different JWT secrets for different environments
- Regularly rotate API keys

## Monitoring and Logging

### Built-in Monitoring
- Health endpoint: `GET /health`
- Cache statistics: `GET /api/cache/stats`
- Request logging with Winston

### External Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry, LogRocket)
- Use APM tools (New Relic, Datadog)

## Performance Optimization

### Caching
- Responses are cached for 1 hour (configurable)
- Cache hit/miss metrics available via API
- Consider Redis for distributed caching in cluster environments

### Database Optimization
- Create indexes on frequently queried fields
- Use connection pooling
- Monitor query performance

### Frontend Optimization
- Code splitting and lazy loading implemented
- Bundle optimization with Vite
- CDN for static assets via Cloudflare

## Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Implement sticky sessions if needed
- Use distributed cache (Redis) for session storage

### Database Scaling
- MongoDB Atlas offers automatic scaling
- Consider sharding for very large datasets
- Implement read replicas for read-heavy workloads

## Backup and Recovery

### Database Backups
- MongoDB Atlas: Automated backups
- Self-hosted: Use `mongodump` regularly
- Test restore procedures

### Application Backups
- Version control all code changes
- Backup environment configuration
- Document deployment procedures

## Troubleshooting

### Common Issues
1. **CORS errors**: Check `FRONTEND_URL` environment variable
2. **Database connection**: Verify `MONGODB_URI` and network access
3. **API errors**: Check Groq API key and quota
4. **Authentication issues**: Verify JWT secret consistency

### Logs
- Backend logs are stored in `logs/` directory
- Use `pm2 logs` for process management
- Enable debug logging with `LOG_LEVEL=debug`

## Maintenance

### Regular Tasks
- Update dependencies regularly
- Monitor resource usage
- Review security patches
- Backup verification

### Updates
1. Test updates in staging environment
2. Deploy during low-traffic periods
3. Have rollback plan ready

## Support
For issues and questions:
1. Check application logs
2. Review this documentation
3. Consult error messages and status codes
4. Contact development team if needed

This deployment guide covers the essential aspects of running AetherBot in production. Always test thoroughly in a staging environment before deploying to production.