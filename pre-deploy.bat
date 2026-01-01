@echo off
echo 🚀 ALMAYA Services - Pre-deployment Setup
echo ========================================

echo.
echo 📦 Cleaning up root directory...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo 🔧 Checking backend configuration...
if exist backend\package.json (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json missing
    exit /b 1
)

if exist backend\.env.production (
    echo ✅ Backend environment file found
) else (
    echo ⚠️  Backend .env.production not found - create it with production variables
)

echo.
echo 🔧 Checking frontend configuration...
if exist frontend\package.json (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json missing
    exit /b 1
)

if exist frontend\.env.production (
    echo ✅ Frontend environment file found
) else (
    echo ⚠️  Frontend .env.production not found - create it with production variables
)

echo.
echo 📁 Checking deployment files...
if exist nixpacks.toml (
    echo ✅ Railway configuration found
) else (
    echo ❌ nixpacks.toml missing
    exit /b 1
)

if exist FREE_DEPLOYMENT_GUIDE.md (
    echo ✅ Deployment guide found
) else (
    echo ❌ Deployment guide missing
)

echo.
echo 🎉 Pre-deployment check complete!
echo.
echo 📋 Next steps:
echo 1. Commit and push all changes to GitHub
echo 2. Follow FREE_DEPLOYMENT_GUIDE.md for Railway deployment
echo 3. Deploy frontend to Vercel
echo.
echo 📖 See FREE_DEPLOYMENT_GUIDE.md for detailed instructions

pause