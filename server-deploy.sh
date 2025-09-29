#!/bin/bash

# Быстрый скрипт для деплоя на сервере
# Запускать на VPS Ubuntu сервере

set -e

echo "🚀 Быстрый деплой CarsPark на сервере..."

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Файл docker-compose.prod.yml не найден. Запустите скрипт из /opt/carspark"
    exit 1
fi

log "Обновляем код с GitHub..."
git pull

log "Проверяем .env файл..."
if [ ! -f ".env" ]; then
    warning ".env файл не найден. Копируем из env.production..."
    cp env.production .env
    warning "ВАЖНО: Отредактируйте .env файл с правильными значениями!"
    echo "nano .env"
    exit 1
fi

log "Останавливаем старые контейнеры..."
docker-compose -f docker-compose.prod.yml down

log "Пересобираем контейнеры..."
docker-compose -f docker-compose.prod.yml build --no-cache

log "Запускаем сервисы..."
docker-compose -f docker-compose.prod.yml up -d

log "Проверяем статус..."
docker-compose -f docker-compose.prod.yml ps

log "Показываем логи (последние 50 строк)..."
docker-compose -f docker-compose.prod.yml logs --tail=50

success "Деплой завершен!"

echo ""
log "Проверьте работу:"
echo "curl https://azautos.be/api/cars/"
echo "curl https://azautos.be"
echo ""

log "Если нужно настроить SSL:"
echo "./ssl-renew.sh"
