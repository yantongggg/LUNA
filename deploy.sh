#!/bin/bash

# LUNA - Firebase Deployment Script
# This script builds and deploys the React app to Firebase Hosting

echo "🚀 LUNA - Firebase Deployment Script"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not found. Installing...${NC}"
    npm install
fi

# Build the project
echo -e "${YELLOW}🔨 Building React app...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Deploy to Firebase
echo -e "${YELLOW}🌐 Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "Your app is now live on Firebase Hosting!"
    echo ""
    echo "📝 Don't forget to:"
    echo "1. Set GEMINI_API_KEY in Supabase Edge Functions"
    echo "   Run: supabase secrets set GEMINI_API_KEY=your_key_here"
    echo ""
    echo "2. Deploy Edge Functions:"
    echo "   Run: supabase functions deploy analyze-evidence --no-verify-jwt"
    echo "        supabase functions deploy make-server-7f9db486 --no-verify-jwt"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
