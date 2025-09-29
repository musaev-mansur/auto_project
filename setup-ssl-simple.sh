#!/bin/bash

# 🔐 Simple SSL Setup for azautos.be (without sudo)
# This script will setup SSL using Docker

set -e

echo "🔐 Setting up SSL for azautos.be using Docker..."

# Check if domain is pointing to this server
echo "Please ensure azautos.be is pointing to this server IP:"
curl -s ifconfig.me
echo ""

read -p "Press Enter to continue when DNS is configured..."

# Create certbot directory
mkdir -p ./nginx/ssl
mkdir -p ./certbot/www

# Create temporary nginx config for certificate generation
cat > ./nginx/conf.d/temp-ssl.conf << 'EOF'
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

# Start temporary nginx container
echo "Starting temporary nginx for certificate generation..."
docker run -d \
    --name temp-nginx \
    -p 80:80 \
    -v $(pwd)/nginx/conf.d:/etc/nginx/conf.d \
    -v $(pwd)/certbot/www:/var/www/certbot \
    nginx:alpine

# Wait for nginx to start
sleep 5

# Get certificates using certbot
echo "Obtaining SSL certificates..."
docker run --rm \
    -v $(pwd)/certbot/www:/var/www/certbot \
    -v $(pwd)/nginx/ssl:/etc/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@azautos.be \
    --agree-tos \
    --no-eff-email \
    --domains azautos.be,www.azautos.be

# Stop temporary nginx
docker stop temp-nginx
docker rm temp-nginx

# Copy certificates
if [ -f "./nginx/ssl/live/azautos.be/fullchain.pem" ]; then
    cp ./nginx/ssl/live/azautos.be/fullchain.pem ./nginx/ssl/cert.pem
    cp ./nginx/ssl/live/azautos.be/privkey.pem ./nginx/ssl/key.pem
    echo "✅ SSL certificates obtained successfully!"
else
    echo "❌ Failed to obtain SSL certificates"
    exit 1
fi

# Remove temporary config
rm -f ./nginx/conf.d/temp-ssl.conf

echo "🎉 SSL setup completed!"
echo "🔗 Your site should now be available at: https://azautos.be"
