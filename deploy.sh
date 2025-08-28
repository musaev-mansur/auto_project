#!/bin/bash

# Скрипт для деплоя приложения на VPS сервер
# Использование: ./deploy.sh [production|staging]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для логирования
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

# Проверяем аргументы
ENVIRONMENT=${1:-production}
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    error "Неверное окружение. Используйте 'production' или 'staging'"
fi

log "Начинаем деплой в окружении: $ENVIRONMENT"

# Проверяем наличие необходимых файлов
if [[ ! -f ".env.$ENVIRONMENT" ]]; then
    error "Файл .env.$ENVIRONMENT не найден"
fi

if [[ ! -f "docker-compose.yml" ]]; then
    error "Файл docker-compose.yml не найден"
fi

if [[ ! -f "Dockerfile" ]]; then
    error "Файл Dockerfile не найден"
fi

# Загружаем переменные окружения
log "Загружаем переменные окружения из .env.$ENVIRONMENT"
export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)

# Проверяем необходимые переменные
required_vars=("DATABASE_URL" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "AWS_REGION" "AWS_S3_BUCKET")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        error "Переменная $var не установлена в .env.$ENVIRONMENT"
    fi
done

# Останавливаем существующие контейнеры
log "Останавливаем существующие контейнеры"
docker-compose down --remove-orphans || true

# Удаляем старые образы (опционально)
if [[ "$2" == "--clean" ]]; then
    log "Удаляем старые образы"
    docker system prune -f
    docker image prune -f
fi

# Собираем и запускаем контейнеры
log "Собираем и запускаем контейнеры"
docker-compose up -d --build

# Ждем запуска приложения
log "Ждем запуска приложения..."
sleep 30

# Проверяем статус контейнеров
log "Проверяем статус контейнеров"
docker-compose ps

# Проверяем здоровье приложения
log "Проверяем здоровье приложения"
for i in {1..10}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "Приложение успешно запущено!"
        break
    else
        warning "Попытка $i/10: Приложение еще не готово, ждем..."
        sleep 10
    fi
    
    if [[ $i -eq 10 ]]; then
        error "Приложение не запустилось в течение 100 секунд"
    fi
done

# Запускаем миграции базы данных
log "Запускаем миграции базы данных"
docker-compose exec -T app npx prisma db push || warning "Ошибка при выполнении миграций"

# Сидим данные (если нужно)
if [[ "$3" == "--seed" ]]; then
    log "Сидим тестовые данные"
    docker-compose exec -T app npm run db:seed || warning "Ошибка при сидинге данных"
fi

# Проверяем логи
log "Проверяем логи приложения"
docker-compose logs --tail=20 app

log "Деплой завершен успешно!"
log "Приложение доступно по адресу: http://localhost:3000"
log "Для просмотра логов используйте: docker-compose logs -f app"

