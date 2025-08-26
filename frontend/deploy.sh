#!/bin/bash

# AetherBot Cloudflare Pages Deployment Script
echo "🚀 Starting AetherBot deployment to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it with:"
    echo "npm install -g wrangler"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
wrangler pages deploy dist

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check your Cloudflare configuration."
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📋 Your application should be live at the provided Cloudflare Pages URL."