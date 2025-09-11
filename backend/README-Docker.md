# CarSpark Backend - Docker Setup

Этот документ содержит инструкции по запуску CarSpark Backend в Docker контейнере.

## Предварительные требования

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)

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
# Сборка и запуск контейнеров
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d --build
```

## Структура Docker

### Сервисы

1. **backend** - Django приложение
   - Порт: 8000
   - Автоматическая инициализация базы данных
   - Создание суперпользователя

2. **db** - PostgreSQL база данных
   - Порт: 5432
   - База данных: carspark_db
   - Пользователь: postgres
   - Пароль: postgres

### Переменные окружения

Основные переменные окружения настраиваются в `docker-compose.yml`:

- `DEBUG=True` - Режим отладки
- `SECRET_KEY` - Секретный ключ Django
- `DATABASE_URL` - URL подключения к PostgreSQL
- `ALLOWED_HOSTS` - Разрешенные хосты
- `CORS_ALLOWED_ORIGINS` - Разрешенные CORS источники

#### AWS S3 (опционально)
Для использования AWS S3 для статических и медиа файлов добавьте:
- `AWS_ACCESS_KEY_ID` - AWS Access Key ID
- `AWS_SECRET_ACCESS_KEY` - AWS Secret Access Key
- `AWS_REGION` - AWS регион (по умолчанию: eu-west-1)
- `AWS_S3_BUCKET_NAME` - Название S3 bucket

## Доступные URL

После запуска контейнера доступны следующие URL:

- **API**: http://localhost:8000/api/
- **Админ панель**: http://localhost:8000/admin/
- **API документация**: http://localhost:8000/api/schema/swagger-ui/
- **Схема API**: http://localhost:8000/api/schema/

## Учетные данные по умолчанию

### База данных
- **Хост**: localhost:5432
- **База данных**: carspark_db
- **Пользователь**: postgres
- **Пароль**: postgres

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f db

# Остановка контейнеров
docker-compose down

# Остановка с удалением volumes
docker-compose down -v

# Пересборка без кэша
docker-compose build --no-cache

# Выполнение команд в контейнере
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py createsuperuser

# Просмотр статуса контейнеров
docker-compose ps
```

## Разработка

### Подключение к базе данных

Для подключения к PostgreSQL из внешних инструментов:
- **Хост**: localhost
- **Порт**: 5432
- **База данных**: carspark_db
- **Пользователь**: postgres
- **Пароль**: postgres

### Изменение кода

Код приложения монтируется как volume, поэтому изменения в коде автоматически отражаются в контейнере. Для применения изменений в зависимостях необходимо пересобрать контейнер:

```bash
docker-compose up --build
```

### Отладка

Для отладки можно подключиться к контейнеру:

```bash
docker-compose exec backend bash
```

## Решение проблем

### Порт уже используется
Если порт 8000 или 5432 уже используется, измените порты в `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Вместо 8000:8000
```

### Проблемы с правами доступа
На Linux/macOS могут возникнуть проблемы с правами доступа к файлам. Решение:

```bash
sudo chown -R $USER:$USER .
```

### Очистка Docker
Для полной очистки Docker (осторожно, удалит все неиспользуемые данные):

```bash
docker system prune -a
docker volume prune
```

## Безопасность

⚠️ **Важно**: Данная конфигурация предназначена для разработки. Для продакшена необходимо:

1. Изменить пароли по умолчанию
2. Использовать сильные секретные ключи
3. Настроить HTTPS
4. Ограничить ALLOWED_HOSTS
5. Отключить DEBUG режим
6. Настроить файрвол
