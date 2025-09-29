# CarSpark Frontend - Docker Setup

Этот документ содержит инструкции по запуску  Frontend в Docker контейнере.

## Предварительные требования

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)
- Запущенный backend на порту 8000

## Быстрый запуск

### Windows
```bash
start-docker.bat
```

### Linux/macOS
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Ручной запуск
```bash
# Сборка и запуск контейнера
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d --build
```

## Структура Docker

### Сервисы

1. **frontend** - Next.js приложение
   - Порт: 3000
   - Автоматическая сборка и оптимизация
   - Production режим

### Переменные окружения

Основные переменные окружения настраиваются в `docker-compose.yml`:

- `NODE_ENV=production` - Режим production
- `NEXT_PUBLIC_API_URL` - URL API backend
- `NEXT_PUBLIC_BACKEND_URL` - URL backend сервера

## Доступные URL

После запуска контейнера доступны следующие URL:

- **Frontend**: http://localhost:3000
- **API (через frontend)**: http://localhost:3000/api/

## Зависимости

Frontend требует запущенный backend на порту 8000. Убедитесь, что backend запущен перед запуском frontend.

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Просмотр логов frontend
docker-compose logs -f frontend

# Остановка контейнеров
docker-compose down

# Пересборка без кэша
docker-compose build --no-cache

# Выполнение команд в контейнере
docker-compose exec frontend sh

# Просмотр статуса контейнеров
docker-compose ps
```

## Разработка

### Изменение кода

Код приложения монтируется как volume, поэтому изменения в коде автоматически отражаются в контейнере. Для применения изменений в зависимостях необходимо пересобрать контейнер:

```bash
docker-compose up --build
```

### Отладка

Для отладки можно подключиться к контейнеру:

```bash
docker-compose exec frontend sh
```

## Решение проблем

### Порт уже используется
Если порт 3000 уже используется, измените порт в `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Вместо 3000:3000
```

### Проблемы с правами доступа
На Linux/macOS могут возникнуть проблемы с правами доступа к файлам. Решение:

```bash
sudo chown -R $USER:$USER .
```

### Backend недоступен
Убедитесь, что backend запущен и доступен по адресу http://localhost:8000

### Очистка Docker
Для полной очистки Docker (осторожно, удалит все неиспользуемые данные):

```bash
docker system prune -a
docker volume prune
```

## Безопасность

⚠️ **Важно**: Данная конфигурация предназначена для разработки. Для продакшена необходимо:

1. Использовать HTTPS
2. Настроить правильные CORS настройки
3. Использовать переменные окружения для секретов
4. Настроить файрвол
5. Использовать reverse proxy (nginx)




