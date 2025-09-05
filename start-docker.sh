#!/bin/bash

echo "🚀 CarsPark Docker Launcher"
echo "=========================="

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠️ Файл .env не найден. Создаю базовый .env файл..."
    cat > .env << EOF
# Django settings
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=False

# AWS S3 settings (заполните своими данными)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=eu-west-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Database (опционально)
# DATABASE_URL=postgresql://user:password@host:port/dbname
EOF
    echo "✅ Создан .env файл. Отредактируйте его своими настройками."
fi

echo "🔧 Сборка и запуск контейнеров..."
docker-compose up --build -d

echo "⏳ Ожидание запуска сервисов..."
sleep 10

echo "🔍 Проверка статуса..."
docker-compose ps

echo ""
echo "🎉 CarsPark запущен!"
echo ""
echo "📱 Доступ к приложению:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost/api/"
echo "   Admin Panel: http://localhost/api/admin/"
echo ""
echo "👤 Учетные данные по умолчанию:"
echo "   Email: admin@carspark.com"
echo "   Password: admin123"
echo ""
echo "📋 Полезные команды:"
echo "   Просмотр логов: docker-compose logs -f"
echo "   Остановка: docker-compose down"
echo "   Перезапуск: docker-compose restart"
echo ""
