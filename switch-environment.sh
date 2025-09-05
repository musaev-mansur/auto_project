#!/bin/bash

# Environment Switcher for CarsPark
# Usage: ./switch-environment.sh [production|staging|development]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-production}
PROJECT_DIR="/opt/carspark"

echo -e "${BLUE}🔄 Switching to ${ENVIRONMENT} environment${NC}"

cd $PROJECT_DIR

# Stop current services
echo -e "${YELLOW}⏹️ Stopping current services...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Copy environment file
case "$ENVIRONMENT" in
    "production")
        if [ -f "env.production" ]; then
            cp env.production .env
            echo -e "${GREEN}✅ Switched to production environment${NC}"
        else
            echo -e "${RED}❌ env.production file not found${NC}"
            exit 1
        fi
        ;;
    "staging")
        if [ -f "env.staging" ]; then
            cp env.staging .env
            echo -e "${GREEN}✅ Switched to staging environment${NC}"
        else
            echo -e "${RED}❌ env.staging file not found${NC}"
            exit 1
        fi
        ;;
    "development")
        if [ -f "env.example" ]; then
            cp env.example .env
            echo -e "${GREEN}✅ Switched to development environment${NC}"
        else
            echo -e "${RED}❌ env.example file not found${NC}"
            exit 1
        fi
        ;;
    *)
        echo -e "${RED}❌ Invalid environment. Use: production, staging, or development${NC}"
        exit 1
        ;;
esac

# Start services
echo -e "${BLUE}🚀 Starting services in ${ENVIRONMENT} mode...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 30

# Check health
if curl -f -s http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Services are healthy in ${ENVIRONMENT} mode${NC}"
else
    echo -e "${YELLOW}⚠️ Services may still be starting up${NC}"
fi

echo -e "${BLUE}📋 Environment switched to: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}🔧 Use './quick-commands.sh status' to check service status${NC}"
