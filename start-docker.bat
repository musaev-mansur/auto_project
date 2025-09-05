@echo off
echo 🚀 CarsPark Docker Launcher
echo ==========================

REM Проверяем наличие Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker не установлен. Установите Docker Desktop и попробуйте снова.
    pause
    exit /b 1
)

REM Проверяем наличие Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова.
    pause
    exit /b 1
)

REM Проверяем наличие .env файла
if not exist .env (
    echo ⚠️ Файл .env не найден. Создаю базовый .env файл...
    (
        echo # Django settings
        echo SECRET_KEY=django-insecure-change-this-in-production
        echo DEBUG=False
        echo.
        echo # AWS S3 settings ^(заполните своими данными^)
        echo AWS_ACCESS_KEY_ID=your-aws-access-key
        echo AWS_SECRET_ACCESS_KEY=your-aws-secret-key
        echo AWS_REGION=eu-west-1
        echo AWS_S3_BUCKET_NAME=your-s3-bucket-name
        echo.
        echo # Database ^(опционально^)
        echo # DATABASE_URL=postgresql://user:password@host:port/dbname
    ) > .env
    echo ✅ Создан .env файл. Отредактируйте его своими настройками.
)

echo 🔧 Сборка и запуск контейнеров...
docker-compose up --build -d

echo ⏳ Ожидание запуска сервисов...
timeout /t 10 /nobreak >nul

echo 🔍 Проверка статуса...
docker-compose ps

echo.
echo 🎉 CarsPark запущен!
echo.
echo 📱 Доступ к приложению:
echo    Frontend: http://localhost
echo    Backend API: http://localhost/api/
echo    Admin Panel: http://localhost/api/admin/
echo.
echo 👤 Учетные данные по умолчанию:
echo    Email: admin@carspark.com
echo    Password: admin123
echo.
echo 📋 Полезные команды:
echo    Просмотр логов: docker-compose logs -f
echo    Остановка: docker-compose down
echo    Перезапуск: docker-compose restart
echo.
pause

