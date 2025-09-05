#!/bin/bash

# SSL Certificate Renewal Script for CarsPark
# This script renews Let's Encrypt certificates and updates Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/opt/carspark"
DOMAIN=${DOMAIN:-"carspark.be"}
EMAIL=${EMAIL:-"mansurmusaev.work@gmail.com"}

echo -e "${BLUE}🔐 Starting SSL certificate renewal for $DOMAIN${NC}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${RED}❌ Certbot is not installed${NC}"
    exit 1
fi

# Check if domain is configured
if [ "$DOMAIN" = "carspark.be" ]; then
    echo -e "${RED}❌ Please set DOMAIN environment variable${NC}"
    exit 1
fi

cd $PROJECT_DIR

# Stop nginx to free port 80
echo -e "${YELLOW}⏹️ Stopping nginx container...${NC}"
docker-compose -f docker-compose.prod.yml stop nginx

# Renew certificate
echo -e "${BLUE}🔄 Renewing SSL certificate...${NC}"
sudo certbot renew --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificate renewed successfully${NC}"
    
    # Copy new certificates
    echo -e "${BLUE}📋 Copying new certificates...${NC}"
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
    sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
    
    # Restart nginx with new certificates
    echo -e "${BLUE}🔄 Restarting nginx with new certificates...${NC}"
    docker-compose -f docker-compose.prod.yml up -d nginx
    
    # Test SSL
    echo -e "${BLUE}🧪 Testing SSL configuration...${NC}"
    sleep 10
    if curl -f -s https://$DOMAIN/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ SSL certificate is working correctly${NC}"
    else
        echo -e "${RED}❌ SSL certificate test failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}🎉 SSL certificate renewal completed successfully!${NC}"
else
    echo -e "${RED}❌ Certificate renewal failed${NC}"
    
    # Restart nginx anyway
    docker-compose -f docker-compose.prod.yml up -d nginx
    exit 1
fi
