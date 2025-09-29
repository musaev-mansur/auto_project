#!/bin/bash

# 🗑️ Fresh Install Script for azautos.be
# This script will completely remove everything and install fresh

set -e

echo "🗑️ Starting fresh installation for azautos.be..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Stop all services
print_status "Stopping all services..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true

# Step 2: Remove all containers and images
print_status "Removing all Docker containers and images..."
docker system prune -a -f || true
docker volume prune -f || true

# Step 3: Remove application directory
print_status "Removing application directory..."
sudo rm -rf /opt/carspark

# Step 4: Clean Nginx
print_status "Cleaning Nginx configuration..."
sudo rm -rf /etc/nginx/ssl
sudo rm -rf /var/www/certbot
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/*

# Step 5: Create fresh directory
print_status "Creating fresh application directory..."
sudo mkdir -p /opt/carspark
sudo chown -R $USER:$USER /opt/carspark

# Step 6: Clone repository
print_status "Cloning fresh repository..."
cd /opt/carspark
git clone https://github.com/musaev-mansur/auto_project.git .

# Step 7: Create environment file
print_status "Creating environment configuration..."
cat > .env << 'EOF'
# AzAutos.be Production Environment Configuration

# Database Configuration
POSTGRES_DB=carspark_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=azautos2024!
DATABASE_URL="postgresql://postgres:azautos2024!@db:5432/carspark_db"

# Django Configuration
SECRET_KEY=azautos-secret-key-2024-production
DEBUG=True
ALLOWED_HOSTS=azautos.be,www.azautos.be,localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=https://azautos.be,https://www.azautos.be
CSRF_TRUSTED_ORIGINS=https://azautos.be,https://www.azautos.be

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://azautos.be/api
NEXT_PUBLIC_BACKEND_URL=https://azautos.be
NEXTAUTH_URL="https://azautos.be"
NEXTAUTH_SECRET="azautos-nextauth-secret-2024"

# AWS S3 Configuration (if using)
USE_S3=True
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Domain Configuration
DOMAIN=azautos.be
EMAIL=admin@azautos.be

# Additional Settings
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production

# Admin Configuration
ADMIN_EMAIL="admin@azautos.be"
ADMIN_PASSWORD="azautos2024!"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="AzAutos"
EOF

print_success "Environment file created"

# Step 8: Make scripts executable
print_status "Making scripts executable..."
chmod +x setup-ssl-azautos.sh
chmod +x deploy-azautos.sh

# Step 9: Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Step 10: Wait for services
print_status "Waiting for services to start..."
sleep 60

# Step 11: Check services
print_status "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Step 12: Setup SSL
print_status "Setting up SSL certificates..."
echo "Please run the following command to setup SSL:"
echo "sudo ./setup-ssl-azautos.sh"
echo ""
echo "Or if you have root access, run:"
echo "sudo chmod +x setup-ssl-azautos.sh && sudo ./setup-ssl-azautos.sh"

print_success "Fresh installation completed!"
print_status "Next steps:"
echo "1. Update AWS credentials in .env file if using S3"
echo "2. Setup SSL: sudo ./setup-ssl-azautos.sh"
echo "3. Test the application: https://azautos.be"
echo "4. Check logs: docker-compose -f docker-compose.prod.yml logs -f"
