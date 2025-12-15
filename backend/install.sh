#!/bin/bash

# Creative Project Planner Backend - Installation Script
# This script helps set up the backend for development or production

set -e  # Exit on error

echo "🚀 Creative Project Planner - Backend Installation"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo -e "${GREEN}✓${NC} Dependencies installed"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚠${NC}  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created"
    echo ""
    echo -e "${YELLOW}⚠  IMPORTANT: Please update .env with your configuration${NC}"
    echo ""
    echo "Required changes:"
    echo "  1. Generate JWT_SECRET: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    echo "  2. Update MONGODB_URI with your MongoDB connection string"
    echo "  3. Update REDIS_URL if using remote Redis"
    echo ""
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

# Create upload directories
echo ""
echo "📁 Creating upload directories..."
mkdir -p uploads/profile-pictures uploads/projects uploads/products
echo -e "${GREEN}✓${NC} Upload directories created"

# Check if MongoDB is running (optional check)
echo ""
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB is installed"
else
    echo -e "${YELLOW}⚠${NC}  MongoDB not found in PATH"
    echo "   Make sure MongoDB is installed and running"
    echo "   Download from: https://www.mongodb.com/try/download/community"
fi

# Check if Redis is running (optional check)
echo ""
echo "🔍 Checking Redis connection..."
if command -v redis-cli &> /dev/null; then
    echo -e "${GREEN}✓${NC} Redis is installed"
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓${NC} Redis is running"
    else
        echo -e "${YELLOW}⚠${NC}  Redis is not running"
        echo "   Start Redis or set REDIS_ENABLED=false in .env"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Redis not found in PATH"
    echo "   Redis is optional but recommended for caching"
    echo "   You can disable it by setting REDIS_ENABLED=false in .env"
fi

# Installation complete
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Installation complete!${NC}"
echo "=================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your environment:"
echo "   nano .env"
echo ""
echo "2. Generate a secure JWT secret:"
echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo ""
echo "3. Start MongoDB (if not running):"
echo "   brew services start mongodb-community  # macOS"
echo "   sudo systemctl start mongod             # Linux"
echo ""
echo "4. Start Redis (optional):"
echo "   brew services start redis  # macOS"
echo "   sudo systemctl start redis # Linux"
echo ""
echo "5. Start the development server:"
echo "   npm run dev"
echo ""
echo "6. Or start in production mode:"
echo "   npm start"
echo ""
echo "📚 Documentation:"
echo "   - README.md - General setup guide"
echo "   - API_DOCUMENTATION.md - API reference"
echo "   - PRODUCTION_GUIDE.md - Production deployment"
echo ""
echo "🔧 Useful commands:"
echo "   npm run dev   - Start development server with auto-reload"
echo "   npm start     - Start production server"
echo "   npm audit     - Check for security vulnerabilities"
echo ""
echo "Happy coding! 🎉"
