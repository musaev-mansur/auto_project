#!/bin/bash

# Скрипт для деплоя на VPS Ubuntu сервер
# Использование: ./deploy-to-server.sh

set -e

echo "🚀 Начинаем деплой CarsPark на VPS сервер..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose.prod.yml" ]; then
    error "Файл docker-compose.prod.yml не найден. Запустите скрипт из корня проекта."
    exit 1
fi

log "Проверяем Git статус..."
if [ -n "$(git status --porcelain)" ]; then
    warning "Есть несохраненные изменения. Коммитим их..."
    git add .
    git commit -m "Deploy: обновления для продакшена $(date)"
fi

log "Отправляем изменения на сервер..."
git push origin main

success "Код отправлен на сервер!"

echo ""
log "Теперь выполните на сервере:"
echo ""
echo "1. Подключитесь к серверу:"
echo "   ssh carspark@your-server-ip"
echo ""
echo "2. Перейдите в директорию проекта:"
echo "   cd /opt/carspark"
echo ""
echo "3. Обновите код:"
echo "   git pull"
echo ""
echo "4. Скопируйте переменные окружения:"
echo "   cp env.production .env"
echo ""
echo "5. Обновите переменные в .env:"
echo "   nano .env"
echo "   # Установите правильные значения для:"
echo "   # - SECRET_KEY"
echo "   # - POSTGRES_PASSWORD"
echo "   # - AWS_ACCESS_KEY_ID"
echo "   # - AWS_SECRET_ACCESS_KEY"
echo ""
echo "6. Остановите старые контейнеры:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo ""
echo "7. Пересоберите и запустите:"
echo "   docker-compose -f docker-compose.prod.yml build --no-cache"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "8. Проверьте статус:"
echo "   docker-compose -f docker-compose.prod.yml ps"
echo "   docker-compose -f docker-compose.prod.yml logs"
echo ""
echo "9. Настройте SSL (если еще не настроен):"
echo "   ./ssl-renew.sh"
echo ""

success "Инструкции для деплоя готовы!"
