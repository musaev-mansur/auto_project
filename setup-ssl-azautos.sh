#!/bin/bash

# SSL Setup Script for azautos.be
# This script will obtain SSL certificates for azautos.be and www.azautos.be

set -e

echo "🔐 Setting up SSL certificates for azautos.be..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "❌ Certbot is not installed. Installing..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily
echo "⏸️ Stopping nginx..."
sudo systemctl stop nginx

# Create temporary nginx config for certificate generation
echo "📝 Creating temporary nginx configuration..."
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

# Create certbot directory
sudo mkdir -p /var/www/certbot

# Start nginx with temporary config
echo "🚀 Starting nginx with temporary configuration..."
sudo systemctl start nginx

# Obtain SSL certificates
echo "🔐 Obtaining SSL certificates for azautos.be and www.azautos.be..."
sudo certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    --domains azautos.be,www.azautos.be

# Stop nginx
echo "⏸️ Stopping nginx..."
sudo systemctl stop nginx

# Remove temporary config
sudo rm -f /etc/nginx/sites-enabled/temp-ssl
sudo rm -f /etc/nginx/sites-available/temp-ssl

# Copy certificates to nginx ssl directory
echo "📋 Copying certificates to nginx ssl directory..."
sudo mkdir -p /etc/nginx/ssl
sudo cp /etc/letsencrypt/live/azautos.be/fullchain.pem /etc/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/azautos.be/privkey.pem /etc/nginx/ssl/key.pem
sudo chmod 644 /etc/nginx/ssl/cert.pem
sudo chmod 600 /etc/nginx/ssl/key.pem

# Set up certificate renewal
echo "🔄 Setting up automatic certificate renewal..."
sudo tee /etc/cron.d/certbot-renew > /dev/null << 'EOF'
# Renew Let's Encrypt certificates twice daily
0 12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
0 0 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

# Create renewal script
sudo tee /usr/local/bin/renew-ssl.sh > /dev/null << 'EOF'
#!/bin/bash
# SSL Certificate Renewal Script

echo "🔄 Renewing SSL certificates..."

# Renew certificates
certbot renew --quiet

# Copy new certificates to nginx ssl directory
if [ -f "/etc/letsencrypt/live/azautos.be/fullchain.pem" ]; then
    cp /etc/letsencrypt/live/azautos.be/fullchain.pem /etc/nginx/ssl/cert.pem
    cp /etc/letsencrypt/live/azautos.be/privkey.pem /etc/nginx/ssl/key.pem
    chmod 644 /etc/nginx/ssl/cert.pem
    chmod 600 /etc/nginx/ssl/key.pem
    
    # Reload nginx
    systemctl reload nginx
    echo "✅ SSL certificates renewed and nginx reloaded"
else
    echo "❌ Failed to renew SSL certificates"
    exit 1
fi
EOF

sudo chmod +x /usr/local/bin/renew-ssl.sh

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Start nginx with new SSL configuration
    echo "🚀 Starting nginx with SSL configuration..."
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    echo "🎉 SSL setup completed successfully!"
    echo "🔗 Your site should now be available at: https://azautos.be"
    echo "🔗 And also at: https://www.azautos.be"
    
    # Test SSL
    echo "🧪 Testing SSL configuration..."
    if curl -s -I https://azautos.be | grep -q "200 OK"; then
        echo "✅ SSL is working correctly!"
    else
        echo "⚠️ SSL might not be working yet. Please check the configuration."
    fi
    
else
    echo "❌ Nginx configuration test failed. Please check the configuration."
    exit 1
fi

echo ""
echo "📋 Next steps:"
echo "1. Update your DNS records to point azautos.be to this server"
echo "2. Update your domain registrar settings"
echo "3. Test the SSL certificate: https://www.ssllabs.com/ssltest/"
echo "4. Monitor certificate renewal: sudo certbot certificates"
