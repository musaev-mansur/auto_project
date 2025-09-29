#!/bin/bash

# 🚀 AzAutos.be Deployment Script
# This script will deploy the CarsPark application to azautos.be

set -e

echo "🚀 Starting AzAutos.be deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f "env.production" ]; then
        cp env.production .env
        print_success "Created .env from env.production template"
        print_warning "Please update .env file with your actual values before continuing"
        print_status "Edit .env file: nano .env"
        read -p "Press Enter to continue after updating .env file..."
    else
        print_error "env.production template not found. Please create .env file manually."
        exit 1
    fi
fi

# Check if domain is configured correctly
print_status "Checking domain configuration..."
if grep -q "azautos.be" .env; then
    print_success "Domain configuration found in .env"
else
    print_warning "Domain not configured in .env. Please update the following:"
    echo "NEXT_PUBLIC_API_URL=https://azautos.be/api"
    echo "NEXT_PUBLIC_BACKEND_URL=https://azautos.be"
    echo "ALLOWED_HOSTS=azautos.be,www.azautos.be,localhost,127.0.0.1,backend"
    echo "CORS_ALLOWED_ORIGINS=https://azautos.be,https://www.azautos.be"
    echo "CSRF_TRUSTED_ORIGINS=https://azautos.be,https://www.azautos.be"
    read -p "Press Enter to continue after updating .env file..."
fi

# Stop existing services
print_status "Stopping existing services..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Remove old containers and images
print_status "Cleaning up old containers and images..."
docker system prune -f || true

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check service status
print_status "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Check if services are healthy
print_status "Checking service health..."

# Check database
if docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    print_success "Database is ready"
else
    print_error "Database is not ready"
    docker-compose -f docker-compose.prod.yml logs db
    exit 1
fi

# Check backend
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    print_success "Backend is ready"
else
    print_warning "Backend might not be ready yet. Checking logs..."
    docker-compose -f docker-compose.prod.yml logs backend | tail -20
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is ready"
else
    print_warning "Frontend might not be ready yet. Checking logs..."
    docker-compose -f docker-compose.prod.yml logs frontend | tail -20
fi

# Setup SSL if not already done
print_status "Checking SSL configuration..."
if [ ! -f "/etc/nginx/ssl/cert.pem" ] || [ ! -f "/etc/nginx/ssl/key.pem" ]; then
    print_warning "SSL certificates not found. Setting up SSL..."
    
    if [ -f "setup-ssl-azautos.sh" ]; then
        chmod +x setup-ssl-azautos.sh
        print_status "Running SSL setup script..."
        sudo ./setup-ssl-azautos.sh
    else
        print_error "SSL setup script not found. Please run SSL setup manually."
        print_status "Follow the instructions in DEPLOY-AZAUTOS.md"
    fi
else
    print_success "SSL certificates found"
fi

# Test SSL
print_status "Testing SSL configuration..."
if curl -s -I https://azautos.be | grep -q "200 OK"; then
    print_success "SSL is working correctly!"
else
    print_warning "SSL might not be working yet. Please check:"
    echo "1. DNS is pointing to this server"
    echo "2. SSL certificates are valid"
    echo "3. Nginx is running with correct configuration"
fi

# Final status check
print_status "Final status check..."
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔗 URLs:"
echo "  Main site: https://azautos.be"
echo "  WWW: https://www.azautos.be"
echo "  API: https://azautos.be/api"
echo "  Admin: https://azautos.be/admin"

echo ""
echo "📋 Next steps:"
echo "1. Verify DNS is pointing to this server"
echo "2. Test SSL: https://www.ssllabs.com/ssltest/"
echo "3. Check application logs: docker-compose -f docker-compose.prod.yml logs"
echo "4. Monitor certificate renewal: sudo certbot certificates"

print_success "Deployment completed!"
print_status "Check the logs if you encounter any issues:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
