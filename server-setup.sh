#!/bin/bash

# Quick Server Setup Script for CarsPark
# Run this script on a fresh Ubuntu server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Ubuntu server for CarsPark deployment${NC}"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   echo -e "${YELLOW}Please create a user first:${NC}"
   echo -e "  adduser carspark"
   echo -e "  usermod -aG sudo carspark"
   echo -e "  su - carspark"
   exit 1
fi

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo -e "${BLUE}📦 Installing essential packages...${NC}"
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
echo -e "${BLUE}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Docker is already installed${NC}"
fi

# Install Docker Compose
echo -e "${BLUE}🐳 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Docker Compose is already installed${NC}"
fi

# Install UFW firewall
echo -e "${BLUE}🔥 Setting up firewall...${NC}"
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
echo -e "${GREEN}✅ Firewall configured${NC}"

# Create project directory
echo -e "${BLUE}📁 Creating project directory...${NC}"
sudo mkdir -p /opt/carspark
sudo chown $USER:$USER /opt/carspark

# Install certbot for SSL
echo -e "${BLUE}🔐 Installing Certbot for SSL certificates...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# Create swap file if needed
echo -e "${BLUE}💾 Checking swap configuration...${NC}"
if [ $(free -m | awk 'NR==2{printf "%.0f", $3/$2*100}') -gt 80 ]; then
    echo -e "${YELLOW}⚠️ High memory usage detected. Creating swap file...${NC}"
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo -e "${GREEN}✅ Swap file created${NC}"
fi

# Configure timezone
echo -e "${BLUE}🕐 Setting timezone to Europe/Moscow...${NC}"
sudo timedatectl set-timezone Europe/Moscow

# Install monitoring tools
echo -e "${BLUE}📊 Installing monitoring tools...${NC}"
sudo apt install -y \
    htop \
    iotop \
    nethogs \
    ncdu

# Create logrotate configuration
echo -e "${BLUE}📋 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/carspark > /dev/null << 'EOF'
/opt/carspark/logs/*/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 carspark carspark
}
EOF

# Set up automatic security updates
echo -e "${BLUE}🔒 Setting up automatic security updates...${NC}"
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Create system monitoring script
echo -e "${BLUE}📊 Creating system monitoring script...${NC}"
cat > ~/system-monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h
echo "Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo "===================="
EOF

chmod +x ~/system-monitor.sh

# Create backup directory
echo -e "${BLUE}💾 Creating backup directory...${NC}"
mkdir -p /opt/carspark/backups

echo -e "${GREEN}🎉 Server setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "  1. Reboot the server: sudo reboot"
echo -e "  2. Clone your project: cd /opt/carspark && git clone <your-repo> ."
echo -e "  3. Run deployment: ./deploy.sh production"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo -e "  • Check system status: ~/system-monitor.sh"
echo -e "  • View logs: sudo journalctl -f"
echo -e "  • Check firewall: sudo ufw status"
echo -e "  • Check Docker: docker ps"
echo ""
echo -e "${YELLOW}⚠️ Important:${NC}"
echo -e "  • Make sure your domain points to this server's IP"
echo -e "  • Update your DNS records before running deployment"
echo -e "  • Have your AWS S3 credentials ready"
