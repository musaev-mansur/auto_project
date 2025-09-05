#!/bin/bash

echo "🐳 Запуск Docker контейнера для CarSpark Backend..."

# Проверяем, установлен ли Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем, установлен ли Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose и попробуйте снова."
    exit 1
fi

# Останавливаем и удаляем существующие контейнеры
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Собираем и запускаем контейнеры
echo "🔨 Сборка и запуск контейнеров..."
docker-compose up --build

echo "✅ Backend запущен на http://localhost:8000"
echo "📊 API документация доступна на http://localhost:8000/api/schema/swagger-ui/"
echo "👤 Админ панель доступна на http://localhost:8000/admin/"
echo "   Email: admin@carspark.be"
echo "   Пароль: admin2025_*"
