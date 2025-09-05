# CarsPark - Docker Deployment

Этот проект содержит полную настройку для запуска CarsPark (frontend + backend) в одном Docker контейнере.

## 🚀 Быстрый запуск

### 1. Создание .env файла

Создайте файл `.env` в корне проекта:

```bash
# Django settings
SECRET_KEY=your-secret-key-here
DEBUG=False

# AWS S3 settings
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=eu-west-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Database (опционально, для внешней БД)
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### 2. Запуск с Docker Compose

```bash
# Сборка и запуск
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d --build
```

### 3. Доступ к приложению

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api/
- **Admin Panel**: http://localhost/api/admin/

### 4. Учетные данные по умолчанию

- **Email**: admin@carspark.com
- **Password**: admin123

## 🏗️ Архитектура

### Docker контейнер включает:

1. **Frontend (Next.js)**
   - Собирается в production режиме
   - Запускается на порту 3000

2. **Backend (Django)**
   - Запускается на порту 8000
   - Поддерживает PostgreSQL и SQLite
   - Автоматическая инициализация БД

3. **Nginx**
   - Проксирует запросы к frontend и backend
   - Обрабатывает статические файлы

4. **PostgreSQL** (отдельный контейнер)
   - База данных для production

## 📁 Структура файлов

```
├── Dockerfile              # Многоэтапная сборка
├── docker-compose.yml      # Оркестрация контейнеров
├── .dockerignore          # Исключения для Docker
├── backend/
│   ├── init_db.py         # Скрипт инициализации БД
│   └── ...
└── frontend/
    └── ...
```

## 🔧 Настройка

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `SECRET_KEY` | Django secret key | - |
| `DEBUG` | Django debug mode | False |
| `DATABASE_URL` | PostgreSQL connection string | SQLite |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key | - |
| `AWS_REGION` | AWS region | eu-west-1 |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | - |

### Портфолио

По умолчанию приложение запускается на порту 80. Для изменения:

```yaml
# docker-compose.yml
services:
  app:
    ports:
      - "8080:80"  # Изменить на нужный порт
```

## 🛠️ Команды

### Разработка

```bash
# Запуск в режиме разработки
docker-compose up --build

# Просмотр логов
docker-compose logs -f app

# Остановка
docker-compose down

# Пересборка
docker-compose build --no-cache
```

### Production

```bash
# Запуск в production режиме
docker-compose -f docker-compose.yml up -d

# Проверка статуса
docker-compose ps

# Обновление
docker-compose pull
docker-compose up -d
```

## 🔍 Отладка

### Просмотр логов

```bash
# Все сервисы
docker-compose logs

# Только приложение
docker-compose logs app

# Следить за логами
docker-compose logs -f app
```

### Вход в контейнер

```bash
# Войти в контейнер приложения
docker-compose exec app bash

# Проверить процессы
docker-compose exec app ps aux

# Проверить Django
docker-compose exec app python manage.py shell
```

### Проверка базы данных

```bash
# Подключиться к PostgreSQL
docker-compose exec db psql -U postgres -d carspark

# Создать миграции
docker-compose exec app python manage.py makemigrations

# Применить миграции
docker-compose exec app python manage.py migrate
```

## 🚨 Устранение неполадок

### Проблема: Контейнер не запускается

```bash
# Проверить логи
docker-compose logs app

# Проверить статус контейнеров
docker-compose ps

# Пересобрать образ
docker-compose build --no-cache
```

### Проблема: База данных не подключается

```bash
# Проверить статус БД
docker-compose ps db

# Проверить логи БД
docker-compose logs db

# Пересоздать volume
docker-compose down -v
docker-compose up --build
```

### Проблема: Статические файлы не загружаются

```bash
# Собрать статические файлы
docker-compose exec app python manage.py collectstatic --noinput

# Проверить права доступа
docker-compose exec app ls -la /app/backend/staticfiles
```

## 📊 Мониторинг

### Проверка здоровья приложения

```bash
# Frontend
curl http://localhost

# Backend API
curl http://localhost/api/health/

# Admin panel
curl http://localhost/api/admin/
```

### Метрики

- **Frontend**: http://localhost (Next.js)
- **Backend**: http://localhost/api/ (Django REST)
- **Database**: localhost:5432 (PostgreSQL)

## 🔐 Безопасность

### Production рекомендации:

1. **Измените пароли по умолчанию**
2. **Используйте HTTPS**
3. **Настройте firewall**
4. **Регулярно обновляйте образы**
5. **Используйте secrets для чувствительных данных**

### Пример .env для production:

```bash
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:strong-password@host:5432/dbname
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=eu-west-1
AWS_S3_BUCKET_NAME=your-bucket
```

## 📝 Лицензия

Этот проект лицензирован под MIT License.

