# Инструкция по деплою на VPS сервер

## Подготовка

### 1. Требования к VPS серверу
- Ubuntu 20.04+ или Debian 11+
- Минимум 2GB RAM
- Минимум 20GB дискового пространства
- Доступ по SSH

### 2. Подготовка проекта

Убедитесь, что в проекте есть все необходимые файлы:
- `Dockerfile` - для контейнеризации приложения
- `docker-compose.yml` - для оркестрации контейнеров
- `nginx.conf` - конфигурация веб-сервера
- `deploy.sh` - скрипт автоматического деплоя
- `setup-vps.sh` - скрипт настройки VPS

## Деплой на VPS

### Шаг 1: Подключение к серверу
```bash
ssh user@your-server-ip
```

### Шаг 2: Настройка VPS сервера
```bash
# Скачиваем скрипт настройки
wget https://raw.githubusercontent.com/your-repo/auto_project/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### Шаг 3: Перезагрузка сервера
```bash
sudo reboot
```

### Шаг 4: Подключение к серверу заново
```bash
ssh user@your-server-ip
```

### Шаг 5: Клонирование проекта
```bash
cd /opt
git clone https://github.com/your-repo/auto_project.git
cd auto_project
```

### Шаг 6: Настройка переменных окружения
```bash
# Копируем пример файла
cp env.production.example .env.production

# Редактируем файл
nano .env.production
```

Заполните следующие переменные:
```env
# База данных
DATABASE_URL="postgresql://postgres:your_secure_password@postgres:5432/auto_project"
POSTGRES_DB=auto_project
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=eu-north-1
AWS_S3_BUCKET=autodealer-images

# Next.js
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Дополнительные настройки
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Шаг 7: Настройка SSL сертификатов

#### Вариант A: Let's Encrypt (рекомендуется)
```bash
# Устанавливаем Certbot
sudo apt install certbot python3-certbot-nginx

# Получаем сертификат
sudo certbot --nginx -d your-domain.com

# Копируем сертификаты
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/auto-project/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/auto-project/ssl/key.pem
sudo chown $USER:$USER /opt/auto-project/ssl/*
```

#### Вариант B: Самоподписанные сертификаты (для тестирования)
```bash
cd /opt/auto-project/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -subj "/C=RU/ST=State/L=City/O=Organization/CN=your-domain.com"
```

### Шаг 8: Запуск деплоя
```bash
cd /opt/auto-project
chmod +x deploy.sh
./deploy.sh production
```

### Шаг 9: Проверка работы
```bash
# Проверяем статус контейнеров
docker-compose ps

# Просматриваем логи
docker-compose logs -f app

# Проверяем доступность приложения
curl http://localhost:3000/api/health
```

## Управление приложением

### Просмотр логов
```bash
# Все контейнеры
docker-compose logs -f

# Только приложение
docker-compose logs -f app

# Только база данных
docker-compose logs -f postgres
```

### Остановка приложения
```bash
docker-compose down
```

### Перезапуск приложения
```bash
docker-compose restart
```

### Обновление приложения
```bash
# Останавливаем контейнеры
docker-compose down

# Обновляем код
git pull

# Пересобираем и запускаем
./deploy.sh production --clean
```

### Резервное копирование базы данных
```bash
# Создание бэкапа
docker-compose exec postgres pg_dump -U postgres auto_project > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
docker-compose exec -T postgres psql -U postgres auto_project < backup_file.sql
```

## Мониторинг и обслуживание

### Автоматическое обновление системы
Система настроена на автоматическое обновление каждое воскресенье в 2:00.

### Мониторинг ресурсов
```bash
# Просмотр использования ресурсов
htop

# Просмотр дискового пространства
df -h

# Просмотр использования памяти
free -h
```

### Очистка Docker
```bash
# Удаление неиспользуемых образов
docker image prune -f

# Удаление неиспользуемых контейнеров
docker container prune -f

# Полная очистка
docker system prune -af
```

## Устранение неполадок

### Приложение не запускается
1. Проверьте логи: `docker-compose logs app`
2. Проверьте переменные окружения: `cat .env.production`
3. Проверьте доступность базы данных: `docker-compose exec postgres psql -U postgres -d auto_project`

### Проблемы с SSL
1. Проверьте наличие сертификатов: `ls -la ssl/`
2. Проверьте права доступа: `chmod 600 ssl/*`
3. Проверьте конфигурацию nginx: `docker-compose logs nginx`

### Проблемы с базой данных
1. Проверьте статус контейнера: `docker-compose ps postgres`
2. Проверьте логи: `docker-compose logs postgres`
3. Проверьте подключение: `docker-compose exec postgres psql -U postgres -d auto_project`

## Безопасность

### Firewall
Firewall настроен и разрешает только необходимые порты:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (приложение)

### Fail2ban
Настроен для защиты от брутфорс атак на SSH.

### SSL/TLS
Рекомендуется использовать Let's Encrypt сертификаты для продакшена.

## Масштабирование

### Увеличение ресурсов
1. Остановите приложение: `docker-compose down`
2. Измените лимиты в `docker-compose.yml`
3. Перезапустите: `./deploy.sh production`

### Балансировка нагрузки
Для высоких нагрузок рекомендуется использовать внешний балансировщик нагрузки (например, AWS ALB или Nginx Plus).

## Контакты

При возникновении проблем обращайтесь к документации или создавайте issue в репозитории проекта.
