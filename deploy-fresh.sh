#!/bin/bash

# 🚀 Fresh Deploy Script for azautos.be
# Complete fresh installation and deployment

set -e

echo "🚀 Starting fresh deployment for azautos.be..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Step 1: Clean everything
print_status "Cleaning existing installation..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker system prune -a -f 2>/dev/null || true

# Step 2: Clone repository if not exists
if [ ! -d ".git" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/musaev-mansur/auto_project.git .
fi

# Step 3: Create environment
print_status "Creating environment configuration..."
cat > .env << 'EOF'
# AzAutos.be Production Environment

# Database
POSTGRES_DB=carspark_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=azautos2024!
DATABASE_URL="postgresql://postgres:azautos2024!@db:5432/carspark_db"

# Django
SECRET_KEY=azautos-secret-key-2024-production
DEBUG=True
ALLOWED_HOSTS=azautos.be,www.azautos.be,localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=https://azautos.be,https://www.azautos.be
CSRF_TRUSTED_ORIGINS=https://azautos.be,https://www.azautos.be

# Frontend
NEXT_PUBLIC_API_URL=https://azautos.be/api
NEXT_PUBLIC_BACKEND_URL=https://azautos.be
NEXTAUTH_URL="https://azautos.be"
NEXTAUTH_SECRET="azautos-nextauth-secret-2024"

# AWS S3 (update with your credentials)
USE_S3=True
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Domain
DOMAIN=azautos.be
EMAIL=admin@azautos.be

# Settings
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production

# Admin
ADMIN_EMAIL="admin@azautos.be"
ADMIN_PASSWORD="azautos2024!"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="AzAutos"
EOF

# Step 4: Make scripts executable
chmod +x setup-ssl-simple.sh 2>/dev/null || true
chmod +x setup-ssl-azautos.sh 2>/dev/null || true

# Step 5: Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Step 6: Wait for services
print_status "Waiting for services to start..."
sleep 60

# Step 7: Check services
print_status "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Step 8: Setup SSL
print_status "Setting up SSL certificates..."
echo ""
echo "🔐 SSL Setup Options:"
echo "1. Simple SSL (Docker-based): ./setup-ssl-simple.sh"
echo "2. Full SSL (requires sudo): sudo ./setup-ssl-azautos.sh"
echo ""
read -p "Choose option (1 or 2): " ssl_option

if [ "$ssl_option" = "1" ]; then
    ./setup-ssl-simple.sh
elif [ "$ssl_option" = "2" ]; then
    sudo ./setup-ssl-azautos.sh
else
    print_warning "SSL setup skipped. You can run it later."
fi

# Step 9: Final status
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
echo "1. Update AWS credentials in .env file"
echo "2. Test SSL: https://www.ssllabs.com/ssltest/"
echo "3. Check logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "4. Monitor: docker-compose -f docker-compose.prod.yml ps"

print_success "Fresh deployment completed!"
print_status "Your AzAutos.be application is now running!"