# ALMAYA Services Deployment Script for Windows
Write-Host "🚀 ALMAYA Services Deployment Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Test-Requirements {
    Write-Status "Checking requirements..."

    try {
        $nodeVersion = node --version
        Write-Status "Node.js version: $nodeVersion"
    } catch {
        Write-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }

    try {
        $npmVersion = npm --version
        Write-Status "npm version: $npmVersion"
    } catch {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }

    Write-Status "All requirements met!"
}

# Install backend dependencies
function Install-BackendDeps {
    Write-Status "Installing backend dependencies..."
    Set-Location backend
    npm install
    Set-Location ..
}

# Install frontend dependencies
function Install-FrontendDeps {
    Write-Status "Installing frontend dependencies..."
    Set-Location frontend
    npm install
    Set-Location ..
}

# Build frontend
function Build-Frontend {
    Write-Status "Building frontend for production..."
    Set-Location frontend
    npm run build
    Set-Location ..
}

# Check if .env files exist
function Test-EnvFiles {
    if (!(Test-Path "backend/.env.production")) {
        Write-Warning "backend/.env.production not found. Please create it with production environment variables."
    }

    if (!(Test-Path "frontend/.env.production")) {
        Write-Warning "frontend/.env.production not found. Please create it with production environment variables."
    }
}

# Main deployment process
function Main {
    Test-Requirements
    Test-EnvFiles
    Install-BackendDeps
    Install-FrontendDeps
    Build-Frontend

    Write-Status "🎉 Build completed successfully!"
    Write-Host ""
    Write-Status "Next steps:"
    Write-Host "1. Set up your production database (MySQL)"
    Write-Host "2. Deploy backend to Railway/Render/Heroku"
    Write-Host "3. Deploy frontend to Vercel/Netlify"
    Write-Host "4. Update environment variables with production URLs"
    Write-Host "5. Test the deployed application"
    Write-Host ""
    Write-Status "For detailed deployment guides, check the README.md file."
}

# Run main function
Main