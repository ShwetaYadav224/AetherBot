@echo off
REM AetherBot Production Deployment Script for Windows
REM This script prepares the application for production deployment

echo.
echo 🚀 Starting AetherBot Production Deployment
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm is not installed. Please install npm
    exit /b 1
)

REM Get Node.js version
for /f "tokens=1 delims=v" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
call npm ci --only=production
if errorlevel 1 (
    echo ✗ Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd frontend
call npm ci --only=production
if errorlevel 1 (
    echo ✗ Failed to install frontend dependencies
    exit /b 1
)
cd ..

REM Build frontend for production
echo.
echo Building frontend for production...
cd frontend
call npm run build
if errorlevel 1 (
    echo ✗ Frontend build failed
    exit /b 1
)
cd ..

echo.
echo ✓ Build completed successfully!

REM Create deployment package
set DEPLOY_DIR=deploy-package-%date:~-4,4%%date:~-7,2%%date:~-10,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set DEPLOY_DIR=%DEPLOY_DIR: =0%

echo.
echo Creating deployment package in %DEPLOY_DIR%\
mkdir %DEPLOY_DIR% >nul 2>&1
mkdir %DEPLOY_DIR%\backend >nul 2>&1
mkdir %DEPLOY_DIR%\frontend-dist >nul 2>&1

REM Copy backend files (excluding node_modules and logs)
xcopy backend\* %DEPLOY_DIR%\backend\ /E /EXCLUDE:backend-exclude.txt 2>nul

REM Create exclude file for backend
echo node_modules> backend-exclude.txt
echo logs\*.log>> backend-exclude.txt
echo .env>> backend-exclude.txt

REM Copy frontend build
xcopy frontend\dist\* %DEPLOY_DIR%\frontend-dist\ /E 2>nul

REM Copy environment template if exists
if exist backend\.env.example (
    copy backend\.env.example %DEPLOY_DIR%\backend\.env.example >nul 2>&1
    echo ✓ Copied .env.example
) else (
    echo ⚠ .env.example not found
)

REM Create deployment instructions
echo # AetherBot Production Deployment Instructions> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo.>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo ## Prerequisites>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo - Node.js 18+ installed>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo - MongoDB database>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo - OpenAI API key>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo.>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo ## Backend Setup>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 1. Copy the backend folder to your server>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 2. Run `npm ci --only=production` to install dependencies>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 3. Create a `.env` file based on `.env.example`>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 4. Start with `npm start` or use PM2>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo.>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo ## Frontend Setup (Cloudflare Pages)>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 1. Connect your repository to Cloudflare Pages>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 2. Set build command: `npm run build`>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 3. Set build output directory: `dist`>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 4. Set environment variables in Cloudflare dashboard>> %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md

echo ✓ Created deployment instructions

REM Clean up
del backend-exclude.txt >nul 2>&1

echo.
echo ✓ Deployment package created: %DEPLOY_DIR%
echo.
echo 📋 Next steps:
echo 1. Review %DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.md
echo 2. Deploy backend to your server
echo 3. Deploy frontend to Cloudflare Pages
echo 4. Configure environment variables
echo.
echo 🎉 Deployment preparation complete!
pause