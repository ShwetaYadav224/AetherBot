#!/bin/bash

# AetherBot Production Deployment Script
# This script deploys both frontend and backend to production

set -e  # Exit on any error

echo "🚀 Starting AetherBot Production Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION=18
if [ $(echo "$NODE_VERSION < $REQUIRED_VERSION" | bc -l) ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please upgrade to Node.js $REQUIRED_VERSION+"
    exit 1
fi

print_status "Node.js version: $NODE_VERSION"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm ci --only=production
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm ci --only=production
cd ..

# Build frontend for production
print_status "Building frontend for production..."
cd frontend
npm run build
cd ..

print_status "Build completed successfully!"

# Create deployment package
DEPLOY_DIR="deploy-package-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

print_status "Creating deployment package in $DEPLOY_DIR/"

# Copy backend files
cp -r backend/ $DEPLOY_DIR/backend/
rm -rf $DEPLOY_DIR/backend/node_modules
rm -rf $DEPLOY_DIR/backend/logs/*.log 2>/dev/null || true

# Copy frontend build
cp -r frontend/dist/ $DEPLOY_DIR/frontend-dist/

# Copy environment files template
cp backend/.env.example $DEPLOY_DIR/backend/.env.example 2>/dev/null || print_warning ".env.example not found"

# Copy deployment instructions
cat > $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# AetherBot Production Deployment Instructions

## Prerequisites
- Node.js 18+ installed
- MongoDB database
- OpenAI API key

## Backend Setup
1. Copy the backend folder to your server
2. Run `npm ci --only=production` to install dependencies
3. Create a `.env` file based on `.env.example`
4. Start with `npm start` or use PM2: `pm2 start server.js --name aetherbot-backend`

## Frontend Setup (Cloudflare Pages)
1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Set environment variables in Cloudflare dashboard

## Environment Variables
Required backend environment variables:
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret for JWT tokens
- OPENAI_API_KEY: OpenAI API key
- PORT: Server port (default: 3001)

## Monitoring
- Logs are stored in backend/logs/
- Health check endpoint: GET /api/health
EOF

print_status "Deployment package created: $DEPLOY_DIR"
print_status "Total size: $(du -sh $DEPLOY_DIR | cut -f1)"

echo ""
echo "📋 Next steps:"
echo "1. Review $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md"
echo "2. Deploy backend to your server"
echo "3. Deploy frontend to Cloudflare Pages"
echo "4. Configure environment variables"
echo ""
echo "🎉 Deployment preparation complete!"