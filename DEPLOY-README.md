# 🚀 CarsPark - Готовый деплой на Ubuntu сервер

Полная конфигурация для деплоя приложения CarsPark на облачный сервер Ubuntu.

## 📁 Созданные файлы

### 🐳 Docker конфигурация
- **`docker-compose.prod.yml`** - Production Docker Compose конфигурация
- **`nginx/nginx.conf`** - Основная конфигурация Nginx
- **`nginx/conf.d/carspark.conf`** - Конфигурация виртуального хоста

### 🔧 Скрипты деплоя
- **`deploy.sh`** - Основной скрипт деплоя (автоматическая установка)
- **`server-setup.sh`** - Быстрая настройка Ubuntu сервера
- **`ssl-renew.sh`** - Обновление SSL сертификатов
- **`backup.sh`** - Резервное копирование (создается автоматически)
- **`monitor.sh`** - Мониторинг здоровья приложения

### ⚙️ Управление
- **`quick-commands.sh`** - Быстрые команды для управления
- **`switch-environment.sh`** - Переключение между средами

### 🔐 Переменные окружения
- **`env.production`** - Production настройки
- **`env.staging`** - Staging настройки
- **`env.example`** - Пример настроек (уже существует)

### 📋 Документация
- **`DEPLOYMENT.md`** - Подробное руководство по деплою
- **`systemd/carspark-monitor.service`** - Systemd сервис для мониторинга

## 🚀 Быстрый старт

### 1. Подготовка сервера
```bash
# На свежем Ubuntu сервере
wget https://raw.githubusercontent.com/musaev-mansur/auto_project/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

### 2. Клонирование проекта
```bash
cd /opt
git clone https://github.com/musaev-mansur/auto_project carspark
cd carspark
```

### 3. Настройка переменных
```bash
cp env.production .env
nano .env  # Обновите домен и пароли
```

### 4. Запуск деплоя
```bash
chmod +x deploy.sh
./deploy.sh production
```

## 🔧 Управление приложением

### Основные команды
```bash
# Статус сервисов
./quick-commands.sh status

# Просмотр логов
./quick-commands.sh logs

# Перезапуск
./quick-commands.sh restart

# Создание бэкапа
./quick-commands.sh backup

# Обновление SSL
./quick-commands.sh ssl-renew
```

### Переключение сред
```bash
# Production
./switch-environment.sh production

# Staging
./switch-environment.sh staging

# Development
./switch-environment.sh development
```

## 📊 Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Next.js       │    │   Django        │
│   (Port 80/443) │────│   (Port 3000)   │────│   (Port 8000)   │
│   Reverse Proxy │    │   Frontend      │    │   Backend       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   PostgreSQL    │
                                               │   (Port 5432)   │
                                               │   Database      │
                                               └─────────────────┘
```

## 🔐 Безопасность

- ✅ SSL/TLS сертификаты (Let's Encrypt)
- ✅ Firewall (UFW) настроен
- ✅ Rate limiting в Nginx
- ✅ Security headers
- ✅ Изолированные Docker контейнеры
- ✅ Автоматические обновления безопасности

## 📈 Мониторинг

- ✅ Health checks для всех сервисов
- ✅ Автоматический мониторинг и перезапуск
- ✅ Логирование в файлы
- ✅ Ротация логов
- ✅ Systemd сервисы для автозапуска

## 💾 Резервное копирование

- ✅ Ежедневные автоматические бэкапы
- ✅ Бэкап базы данных PostgreSQL
- ✅ Бэкап медиа файлов
- ✅ Автоматическая очистка старых бэкапов

## 🌐 Доступные URL

После деплоя приложение будет доступно по адресам:

- **Главная страница**: `https://your-domain.com`
- **Админ панель**: `https://your-domain.com/dealer`
- **API документация**: `https://your-domain.com/api/docs/`
- **Health check**: `https://your-domain.com/health`

## 🆘 Поддержка

### Полезные команды для диагностики
```bash
# Проверка статуса
./quick-commands.sh status

# Просмотр логов
./quick-commands.sh logs

# Проверка здоровья
./quick-commands.sh health

# Системный мониторинг
./quick-commands.sh monitor
```

### Частые проблемы

1. **Сервисы не запускаются**
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

2. **SSL сертификат не работает**
   ```bash
   ./ssl-renew.sh
   ```

3. **Проблемы с базой данных**
   ```bash
   ./quick-commands.sh shell-db
   ```

4. **Высокое использование ресурсов**
   ```bash
   ./quick-commands.sh cleanup
   ```

## 📝 Следующие шаги

1. **Обновите домен** в файле `.env`
2. **Настройте AWS S3** credentials
3. **Создайте администратора**: `./quick-commands.sh create-admin`
4. **Настройте мониторинг** (опционально)
5. **Настройте уведомления** о проблемах (опционально)

---

**🎉 Готово! Ваше приложение CarsPark готово к работе в production!**
