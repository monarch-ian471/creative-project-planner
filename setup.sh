#!/bin/bash

# Creative Project Planner - Quick Setup Script
# This script helps set up both backend and frontend

set -e

echo "🎨 Creative Project Planner - Quick Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check if MongoDB is running
if command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB tools detected${NC}"
else
    echo -e "${RED}⚠️  MongoDB tools not detected. Make sure MongoDB is installed and running.${NC}"
fi

echo ""
echo "📦 Setting up Backend..."
echo "------------------------"

cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Please edit backend/.env with your actual configuration values!${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
echo "-------------------------"

cd ../frontend/creative-project-planner

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Please edit frontend/creative-project-planner/.env with your actual configuration values!${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Frontend setup complete!${NC}"
echo ""

cd ../..

echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "1. Edit backend/.env with your MongoDB URI and Auth0 credentials"
echo "2. Edit frontend/creative-project-planner/.env with your API URL and Auth0 credentials"
echo "3. Make sure MongoDB is running"
echo ""
echo "🚀 To start development:"
echo ""
echo "Backend (in one terminal):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Frontend (in another terminal):"
echo "  cd frontend/creative-project-planner"
echo "  npm run dev"
echo ""
echo "📚 For more information, see README.md"
echo ""
