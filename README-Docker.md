# CarSpark - Docker Setup

Полная настройка и запуск CarSpark проекта с использованием Docker.

## 🚀 Быстрый запуск

### Windows
```bash
# Обычный запуск
start-docker.bat

# Фоновый режим
start-docker-background.bat
```

### Linux/macOS
```bash
# Сделать скрипты исполняемыми
chmod +x start-docker.sh start-docker-background.sh

# Обычный запуск
./start-docker.sh

# Фоновый режим
./start-docker-background.sh
```

### Ручной запуск
```bash
# Обычный запуск
docker-compose up --build

# Фоновый режим
docker-compose up -d --build
```

## 📋 Предварительные требования

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)

## 🏗️ Архитектура проекта

### Сервисы

1. **db** - PostgreSQL база данных
   - Порт: 5434
   - База данных: carspark_db
   - Пользователь: postgres
   - Пароль: postgres

2. **backend** - Django API сервер
   - Порт: 8000
   - Автоматическая инициализация БД
   - Создание суперпользователя

3. **frontend** - Next.js приложение
   - Порт: 3000
   - Production оптимизированная сборка

## 🌐 Доступные URL

После запуска контейнеров доступны следующие URL:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Админ панель**: http://localhost:8000/admin/
- **API документация**: http://localhost:8000/api/schema/swagger-ui/

## 🔑 Учетные данные

### Суперпользователь
- **Email**: `admin@carspark.com`
- **Пароль**: `admin123`

### База данных
- **Хост**: localhost:5434
- **База данных**: carspark_db
- **Пользователь**: postgres
- **Пароль**: postgres

## ⚙️ Переменные окружения

Основные переменные окружения настраиваются в `docker-compose.yml`:

### Backend
- `DEBUG=True` - Режим отладки
- `SECRET_KEY` - Секретный ключ Django
- `DATABASE_URL` - URL подключения к PostgreSQL
- `ALLOWED_HOSTS` - Разрешенные хосты
- `CORS_ALLOWED_ORIGINS` - Разрешенные CORS источники
- `USE_S3=False` - Отключение S3 для локальной разработки

### Frontend
- `NODE_ENV=production` - Режим production
- `NEXT_PUBLIC_API_URL` - URL API backend
- `NEXT_PUBLIC_BACKEND_URL` - URL backend сервера

### AWS S3 (опционально)
Для использования AWS S3 раскомментируйте и заполните:
- `USE_S3=True`
- `AWS_ACCESS_KEY_ID` - AWS Access Key ID
- `AWS_SECRET_ACCESS_KEY` - AWS Secret Access Key
- `AWS_REGION` - AWS регион
- `AWS_S3_BUCKET_NAME` - Название S3 bucket

## 🛠️ Полезные команды

### Управление контейнерами
```bash
# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Остановка контейнеров
docker-compose down

# Остановка с удалением volumes
docker-compose down -v

# Перезапуск
docker-compose restart

# Пересборка без кэша
docker-compose build --no-cache
```

### Выполнение команд в контейнерах
```bash
# Backend
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py migrate

# Frontend
docker-compose exec frontend sh

# База данных
docker-compose exec db psql -U postgres -d carspark_db
```

## 🔧 Разработка

### Изменение кода
Код приложений монтируется как volume, поэтому изменения в коде автоматически отражаются в контейнерах. Для применения изменений в зависимостях необходимо пересобрать контейнеры:

```bash
docker-compose up --build
```

### Подключение к базе данных
Для подключения к PostgreSQL из внешних инструментов:
- **Хост**: localhost
- **Порт**: 5434
- **База данных**: carspark_db
- **Пользователь**: postgres
- **Пароль**: postgres

## 🐛 Решение проблем

### Порт уже используется
Если порты 3000, 8000 или 5434 уже используются, измените порты в `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Вместо 3000:3000
  - "8001:8000"  # Вместо 8000:8000
  - "5435:5432"  # Вместо 5434:5432
```

### Проблемы с правами доступа
На Linux/macOS могут возникнуть проблемы с правами доступа к файлам:

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

## 📁 Структура файлов

```
auto_project/
├── docker-compose.yml          # Основной docker-compose файл
├── env.example                 # Пример переменных окружения
├── start-docker.sh            # Скрипт запуска (Linux/macOS)
├── start-docker.bat           # Скрипт запуска (Windows)
├── start-docker-background.sh # Скрипт запуска в фоне (Linux/macOS)
├── start-docker-background.bat# Скрипт запуска в фоне (Windows)
├── README-Docker.md           # Эта документация
├── backend/                   # Django backend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── ...
└── frontend/                  # Next.js frontend
    ├── Dockerfile
    ├── docker-compose.yml
    └── ...
```

## 🔒 Безопасность

⚠️ **Важно**: Данная конфигурация предназначена для разработки. Для продакшена необходимо:

1. Изменить пароли по умолчанию
2. Использовать сильные секретные ключи
3. Настроить HTTPS
4. Ограничить ALLOWED_HOSTS
5. Отключить DEBUG режим
6. Настроить файрвол
7. Использовать reverse proxy (nginx)

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь, что все порты свободны
3. Проверьте, что Docker и Docker Compose установлены
4. Попробуйте пересобрать контейнеры: `docker-compose up --build`


