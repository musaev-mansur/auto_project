# PowerShell скрипт для запуска проекта локально с Docker

param(
    [switch]$Clean,
    [switch]$Seed
)

# Функции для логирования
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    exit 1
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

Write-Log "🚀 Запуск проекта локально с Docker..."

# Проверяем наличие Docker
try {
    docker --version | Out-Null
} catch {
    Write-Error "Docker не установлен. Установите Docker и попробуйте снова."
}

try {
    docker-compose --version | Out-Null
} catch {
    Write-Error "Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
}

# Проверяем наличие файла переменных окружения
if (-not (Test-Path ".env")) {
    Write-Warning "Файл .env не найден. Создаем из примера..."
    if (Test-Path "env.local.example") {
        Copy-Item "env.local.example" ".env.local"
        Write-Warning "Создан файл .env.local из примера. Отредактируйте его и добавьте ваши AWS ключи."
        Write-Warning "Нажмите Enter после редактирования файла..."
        Read-Host
    } else {
        Write-Error "Файл env.local.example не найден. Создайте .env.local вручную."
    }
}

# Останавливаем существующие контейнеры
Write-Log "🛑 Останавливаем существующие контейнеры..."
try {
    docker-compose -f docker-compose.local.yml down --remove-orphans
} catch {
    Write-Warning "Ошибка при остановке контейнеров"
}

# Удаляем старые образы (опционально)
if ($Clean) {
    Write-Log "🧹 Удаляем старые образы..."
    docker system prune -f
    docker image prune -f
}

# Собираем и запускаем контейнеры
Write-Log "🔨 Собираем и запускаем контейнеры..."
docker-compose -f docker-compose.local.yml up --build -d

# Ждем запуска базы данных
Write-Log "⏳ Ждем запуска базы данных..."
Start-Sleep -Seconds 10

# Запускаем миграции
Write-Log "🗄️ Запускаем миграции базы данных..."
try {
    docker-compose -f docker-compose.local.yml exec -T app npx prisma db push
} catch {
    Write-Warning "Ошибка при выполнении миграций"
}

# Сидим тестовые данные (опционально)
if ($Seed) {
    Write-Log "🌱 Сидим тестовые данные..."
    try {
        docker-compose -f docker-compose.local.yml exec -T app npm run db:seed
    } catch {
        Write-Warning "Ошибка при сидинге данных"
    }
}

# Проверяем статус контейнеров
Write-Log "📊 Проверяем статус контейнеров..."
docker-compose -f docker-compose.local.yml ps

# Ждем запуска приложения
Write-Log "⏳ Ждем запуска приложения..."
Start-Sleep -Seconds 15

# Проверяем здоровье приложения
Write-Log "🏥 Проверяем здоровье приложения..."
$maxAttempts = 10
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Приложение успешно запущено!"
            break
        }
    } catch {
        Write-Warning "Попытка $i/$maxAttempts : Приложение еще не готово, ждем..."
        Start-Sleep -Seconds 10
    }
    
    if ($i -eq $maxAttempts) {
        Write-Error "Приложение не запустилось в течение 100 секунд"
    }
}

Write-Log "🎉 Проект успешно запущен!"
Write-Log "📱 Приложение доступно по адресу: http://localhost:3000"
Write-Log "🗄️ База данных доступна по адресу: localhost:5432"
Write-Host ""
Write-Log "📋 Полезные команды:"
Write-Log "  • Просмотр логов: docker-compose -f docker-compose.local.yml logs -f app"
Write-Log "  • Остановка: docker-compose -f docker-compose.local.yml down"
Write-Log "  • Перезапуск: docker-compose -f docker-compose.local.yml restart"
Write-Log "  • Обновление: .\start-local.ps1 -Clean"
