@echo off
echo 🚀 Starting AetherBot deployment to Cloudflare Pages...

REM Check if wrangler is installed
wrangler --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Wrangler CLI is not installed. Please install it with:
    echo npm install -g wrangler
    exit /b 1
)

REM Build the project
echo 📦 Building the project...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please check for errors.
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to Cloudflare Pages
echo 🌐 Deploying to Cloudflare Pages...
call wrangler pages deploy dist

if errorlevel 1 (
    echo ❌ Deployment failed. Please check your Cloudflare configuration.
    exit /b 1
)

echo 🎉 Deployment completed successfully!
echo 📋 Your application should be live at the provided Cloudflare Pages URL.