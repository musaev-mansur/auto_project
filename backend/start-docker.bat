@echo off
echo 🐳 Запуск Docker контейнера для CarSpark Backend...

REM Проверяем, установлен ли Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker не установлен. Пожалуйста, установите Docker и попробуйте снова.
    pause
    exit /b 1
)

REM Проверяем, установлен ли Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose и попробуйте снова.
    pause
    exit /b 1
)

REM Останавливаем и удаляем существующие контейнеры
echo 🛑 Остановка существующих контейнеров...
docker-compose down

REM Собираем и запускаем контейнеры
echo 🔨 Сборка и запуск контейнеров...
docker-compose up --build

echo ✅ Backend запущен на http://localhost:8000
echo 📊 API документация доступна на http://localhost:8000/api/schema/swagger-ui/
echo 👤 Админ панель доступна на http://localhost:8000/admin/
echo    Email: admin@carspark.be
echo    Пароль: admin2025_*
pause
