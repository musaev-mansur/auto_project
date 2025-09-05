#!/bin/bash

# CarsPark Deployment Script for Ubuntu Server
# Usage: ./deploy.sh [production|staging]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="carspark"
DOMAIN=${DOMAIN:-"carspark.be"}
EMAIL=${EMAIL:-"mansurmusaev.work@gmail.com"}

echo -e "${BLUE}🚀 Starting CarsPark deployment for ${ENVIRONMENT} environment${NC}"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
fi

# Create project directory
PROJECT_DIR="/opt/$PROJECT_NAME"
echo -e "${BLUE}📁 Setting up project directory: $PROJECT_DIR${NC}"

if [ ! -d "$PROJECT_DIR" ]; then
    sudo mkdir -p $PROJECT_DIR
    sudo chown $USER:$USER $PROJECT_DIR
fi

cd $PROJECT_DIR

# Create necessary directories
mkdir -p {logs/{nginx,backend,frontend},ssl,backups,nginx/conf.d}

# Copy project files
echo -e "${BLUE}📋 Copying project files...${NC}"
# Note: This assumes the script is run from the project root
# In real deployment, you would clone from git or copy files

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️ Creating environment file...${NC}"
    cat > .env << EOF
# Database Configuration
POSTGRES_DB=carspark_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Django Configuration
SECRET_KEY=$(openssl rand -base64 50)
DEBUG=False
ALLOWED_HOSTS=$DOMAIN,www.$DOMAIN,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NEXT_PUBLIC_BACKEND_URL=https://$DOMAIN

# AWS S3 Configuration (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=aslan-auto-img
EOF
    echo -e "${GREEN}✅ Environment file created${NC}"
    echo -e "${YELLOW}⚠️ Please update AWS credentials in .env file${NC}"
fi

# Generate self-signed SSL certificate for initial setup
if [ ! -f "ssl/cert.pem" ]; then
    echo -e "${YELLOW}🔐 Generating self-signed SSL certificate...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=RU/ST=Moscow/L=Moscow/O=CarsPark/CN=$DOMAIN"
    echo -e "${GREEN}✅ SSL certificate generated${NC}"
fi

# Update nginx configuration with domain
echo -e "${BLUE}🔧 Updating nginx configuration...${NC}"
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/g" nginx/conf.d/carspark.conf

# Pull latest images and build
echo -e "${BLUE}🏗️ Building and starting services...${NC}"
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 30

# Check service health
echo -e "${BLUE}🔍 Checking service health...${NC}"
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Services are healthy${NC}"
else
    echo -e "${RED}❌ Services are not responding${NC}"
    echo -e "${YELLOW}📋 Checking logs...${NC}"
    docker-compose -f docker-compose.prod.yml logs --tail=50
    exit 1
fi

# Setup Let's Encrypt SSL (optional)
if [ "$ENVIRONMENT" = "production" ] && [ "$DOMAIN" != "carspark.be" ]; then
    echo -e "${BLUE}🔐 Setting up Let's Encrypt SSL...${NC}"
    
    # Install certbot
    if ! command -v certbot &> /dev/null; then
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Stop nginx temporarily
    docker-compose -f docker-compose.prod.yml stop nginx
    
    # Get certificate
    sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive
    
    # Copy certificates
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
    sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
    
    # Restart nginx
    docker-compose -f docker-compose.prod.yml up -d nginx
    
    echo -e "${GREEN}✅ Let's Encrypt SSL certificate installed${NC}"
fi

# Setup systemd service for auto-start
echo -e "${BLUE}⚙️ Setting up systemd service...${NC}"
sudo tee /etc/systemd/system/$PROJECT_NAME.service > /dev/null << EOF
[Unit]
Description=CarsPark Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
User=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $PROJECT_NAME.service

# Setup log rotation
echo -e "${BLUE}📋 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/$PROJECT_NAME > /dev/null << EOF
$PROJECT_DIR/logs/*/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker-compose -f $PROJECT_DIR/docker-compose.prod.yml restart nginx > /dev/null 2>&1 || true
    endscript
}
EOF

# Setup backup script
echo -e "${BLUE}💾 Setting up backup script...${NC}"
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/carspark/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U postgres carspark_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup media files
tar -czf $BACKUP_DIR/media_backup_$DATE.tar.gz media/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Setup cron job for backups
(crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/backup.sh") | crontab -

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "  • Application URL: https://$DOMAIN"
echo -e "  • Admin Panel: https://$DOMAIN/dealer"
echo -e "  • API Documentation: https://$DOMAIN/api/docs/"
echo -e "  • Project Directory: $PROJECT_DIR"
echo -e "  • Logs: $PROJECT_DIR/logs/"
echo -e "  • Backups: $PROJECT_DIR/backups/"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "  1. Update AWS S3 credentials in .env file"
echo -e "  2. Create admin user: docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser"
echo -e "  3. Test the application at https://$DOMAIN"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo -e "  • View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo -e "  • Restart services: sudo systemctl restart $PROJECT_NAME"
echo -e "  • Stop services: docker-compose -f docker-compose.prod.yml down"
echo -e "  • Start services: docker-compose -f docker-compose.prod.yml up -d"
