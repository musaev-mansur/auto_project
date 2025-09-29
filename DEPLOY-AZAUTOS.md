# 🚀 Deploy azautos.be - Complete Guide

This guide will help you deploy the CarsPark application to the new domain `azautos.be` with SSL certificates.

## 📋 Prerequisites

- Ubuntu 20.04+ server with root access
- Domain `azautos.be` pointing to your server IP
- Docker and Docker Compose installed
- Git installed

## 🔧 Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Packages
```bash
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx
```

### 1.3 Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 1.4 Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 🌐 Step 2: Domain Configuration

### 2.1 DNS Setup
Configure your DNS records:
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 300

Type: A  
Name: www
Value: YOUR_SERVER_IP
TTL: 300
```

### 2.2 Verify DNS
```bash
nslookup azautos.be
nslookup www.azautos.be
```

## 📁 Step 3: Application Deployment

### 3.1 Clone Repository
```bash
cd /opt
sudo git clone https://github.com/your-username/auto_project.git carspark
sudo chown -R $USER:$USER /opt/carspark
cd /opt/carspark
```

### 3.2 Configure Environment
```bash
cp env.production .env
nano .env
```

Update the following values in `.env`:
```bash
# Domain Configuration
ALLOWED_HOSTS=azautos.be,www.azautos.be,localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=https://azautos.be,https://www.azautos.be
CSRF_TRUSTED_ORIGINS=https://azautos.be,https://www.azautos.be

# Frontend URLs
NEXT_PUBLIC_API_URL=https://azautos.be/api
NEXT_PUBLIC_BACKEND_URL=https://azautos.be
NEXTAUTH_URL="https://azautos.be"

# Domain for SSL
DOMAIN=azautos.be
EMAIL=your-email@example.com

# Database
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL="postgresql://postgres:your-secure-password@db:5432/carspark_db"

# Django Secret Key
SECRET_KEY=your-django-secret-key-here

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Admin User
ADMIN_EMAIL="admin@azautos.be"
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="AzAutos"
```

## 🔐 Step 4: SSL Certificate Setup

### 4.1 Run SSL Setup Script
```bash
chmod +x setup-ssl-azautos.sh
sudo ./setup-ssl-azautos.sh
```

### 4.2 Manual SSL Setup (Alternative)
If the script doesn't work, follow these steps:

```bash
# Stop nginx
sudo systemctl stop nginx

# Create certbot directory
sudo mkdir -p /var/www/certbot

# Create temporary nginx config
sudo tee /etc/nginx/sites-available/temp-ssl > /dev/null << 'EOF'
server {
    listen 80;
    server_name azautos.be www.azautos.be;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 "SSL setup in progress...";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable temporary config
sudo ln -sf /etc/nginx/sites-available/temp-ssl /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Start nginx
sudo systemctl start nginx

# Obtain certificates
sudo certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    --domains azautos.be,www.azautos.be

# Stop nginx
sudo systemctl stop nginx

# Copy certificates
sudo mkdir -p /etc/nginx/ssl
sudo cp /etc/letsencrypt/live/azautos.be/fullchain.pem /etc/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/azautos.be/privkey.pem /etc/nginx/ssl/key.pem
sudo chmod 644 /etc/nginx/ssl/cert.pem
sudo chmod 600 /etc/nginx/ssl/key.pem

# Remove temporary config
sudo rm -f /etc/nginx/sites-enabled/temp-ssl
sudo rm -f /etc/nginx/sites-available/temp-ssl
```

## 🐳 Step 5: Docker Deployment

### 5.1 Build and Start Services
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 5.2 Verify Services
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check individual services
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs nginx
```

## 🔄 Step 6: SSL Certificate Renewal

### 6.1 Set up Automatic Renewal
```bash
# Create renewal script
sudo tee /usr/local/bin/renew-ssl.sh > /dev/null << 'EOF'
#!/bin/bash
certbot renew --quiet
if [ -f "/etc/letsencrypt/live/azautos.be/fullchain.pem" ]; then
    cp /etc/letsencrypt/live/azautos.be/fullchain.pem /etc/nginx/ssl/cert.pem
    cp /etc/letsencrypt/live/azautos.be/privkey.pem /etc/nginx/ssl/key.pem
    chmod 644 /etc/nginx/ssl/cert.pem
    chmod 600 /etc/nginx/ssl/key.pem
    systemctl reload nginx
    echo "SSL certificates renewed"
fi
EOF

sudo chmod +x /usr/local/bin/renew-ssl.sh

# Add to crontab
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/local/bin/renew-ssl.sh
```

## 🧪 Step 7: Testing

### 7.1 Test SSL
```bash
# Test SSL certificate
curl -I https://azautos.be
curl -I https://www.azautos.be

# Test SSL Labs
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=azautos.be
```

### 7.2 Test Application
```bash
# Test API
curl https://azautos.be/api/health

# Test frontend
curl https://azautos.be
```

## 📊 Step 8: Monitoring

### 8.1 Check Service Status
```bash
# Docker services
docker-compose -f docker-compose.prod.yml ps

# System services
sudo systemctl status nginx
sudo systemctl status docker
```

### 8.2 Monitor Logs
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Step 9: Maintenance

### 9.1 Update Application
```bash
cd /opt/carspark
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### 9.2 Backup Database
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres carspark_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres carspark_db < backup_file.sql
```

## 🚨 Troubleshooting

### Common Issues:

1. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew manually
   sudo certbot renew --force-renewal
   ```

2. **Docker Issues**
   ```bash
   # Restart services
   docker-compose -f docker-compose.prod.yml restart
   
   # Rebuild services
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Nginx Issues**
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Reload configuration
   sudo systemctl reload nginx
   ```

## ✅ Final Checklist

- [ ] Domain DNS pointing to server
- [ ] SSL certificates installed and working
- [ ] All Docker services running
- [ ] Application accessible at https://azautos.be
- [ ] API endpoints working
- [ ] Admin panel accessible
- [ ] SSL certificate auto-renewal configured
- [ ] Monitoring and logging set up

## 🎉 Success!

Your CarsPark application should now be running at:
- **Main site**: https://azautos.be
- **WWW**: https://www.azautos.be
- **API**: https://azautos.be/api
- **Admin**: https://azautos.be/admin

## 📞 Support

If you encounter any issues:
1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify SSL: `sudo certbot certificates`
3. Test connectivity: `curl -I https://azautos.be`
4. Check DNS: `nslookup azautos.be`
