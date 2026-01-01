#!/bin/bash

echo "🚀 ALMAYA Services Deployment Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi

    print_status "All requirements met!"
}

# Install backend dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    cd frontend
    npm run build
    cd ..
}

# Check if .env files exist
check_env_files() {
    if [ ! -f "backend/.env.production" ]; then
        print_warning "backend/.env.production not found. Please create it with production environment variables."
    fi

    if [ ! -f "frontend/.env.production" ]; then
        print_warning "frontend/.env.production not found. Please create it with production environment variables."
    fi
}

# Main deployment process
main() {
    check_requirements
    check_env_files
    install_backend_deps
    install_frontend_deps
    build_frontend

    print_status "🎉 Build completed successfully!"
    print_status ""
    print_status "Next steps:"
    echo "1. Set up your production database (MySQL)"
    echo "2. Deploy backend to Railway/Render/Heroku"
    echo "3. Deploy frontend to Vercel/Netlify"
    echo "4. Update environment variables with production URLs"
    echo "5. Test the deployed application"
    print_status ""
    print_status "For detailed deployment guides, check the README.md file."
}

# Run main function
main