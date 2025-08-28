#!/bin/bash

# Скрипт для первоначальной настройки VPS сервера
# Выполняйте этот скрипт на VPS сервере один раз

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

log "Начинаем настройку VPS сервера..."

# Обновляем систему
log "Обновляем систему..."
sudo apt update && sudo apt upgrade -y

# Устанавливаем необходимые пакеты
log "Устанавливаем необходимые пакеты..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    nano \
    vim

# Устанавливаем Docker
log "Устанавливаем Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Добавляем текущего пользователя в группу docker
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
log "Устанавливаем Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Настраиваем firewall
log "Настраиваем firewall..."
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

# Настраиваем fail2ban
log "Настраиваем fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Создаем директорию для проекта
log "Создаем директорию для проекта..."
sudo mkdir -p /opt/auto-project
sudo chown $USER:$USER /opt/auto-project

# Создаем директорию для SSL сертификатов
log "Создаем директорию для SSL сертификатов..."
sudo mkdir -p /opt/auto-project/ssl
sudo chown $USER:$USER /opt/auto-project/ssl

# Создаем самоподписанные SSL сертификаты (временно)
log "Создаем временные SSL сертификаты..."
cd /opt/auto-project/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -subj "/C=RU/ST=State/L=City/O=Organization/CN=localhost"

# Настраиваем swap файл (если нужно)
log "Настраиваем swap файл..."
if [[ ! -f /swapfile ]]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Настраиваем системные параметры
log "Настраиваем системные параметры..."
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
echo 'fs.file-max=65536' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Создаем скрипт для обновления системы
log "Создаем скрипт для обновления системы..."
cat > /opt/auto-project/update-system.sh << 'EOF'
#!/bin/bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
sudo apt autoclean
EOF

chmod +x /opt/auto-project/update-system.sh

# Создаем cron задачу для автоматического обновления
log "Настраиваем автоматическое обновление системы..."
(crontab -l 2>/dev/null; echo "0 2 * * 0 /opt/auto-project/update-system.sh") | crontab -

log "Настройка VPS сервера завершена!"
log "Не забудьте:"
log "1. Перезагрузить сервер: sudo reboot"
log "2. Скопировать файлы проекта в /opt/auto-project"
log "3. Настроить переменные окружения в .env.production"
log "4. Запустить деплой: ./deploy.sh production"

