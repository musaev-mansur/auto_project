# 🚀 Руководство по деплою CarsPark на Ubuntu сервер

Это руководство поможет вам развернуть приложение CarsPark на облачном сервере Ubuntu.

## 📋 Требования

### Системные требования
- **ОС**: Ubuntu 20.04 LTS или новее
- **RAM**: Минимум 2GB (рекомендуется 4GB+)
- **CPU**: 2 ядра (рекомендуется 4+)
- **Диск**: Минимум 20GB свободного места
- **Сеть**: Статический IP-адрес и доменное имя

### Облачные провайдеры
- **DigitalOcean** (рекомендуется)
- **AWS EC2**
- **Google Cloud Platform**
- **Vultr**
- **Linode**

## 🛠️ Подготовка сервера

### 1. Создание сервера

#### DigitalOcean (рекомендуется)
1. Создайте новый Droplet
2. Выберите Ubuntu 22.04 LTS
3. Минимум 2GB RAM, 2 CPU
4. Добавьте SSH ключ
5. Включите мониторинг

#### AWS EC2
1. Запустите EC2 instance
2. Выберите Ubuntu Server 22.04 LTS
3. Тип: t3.medium или больше
4. Настройте Security Group (порты 22, 80, 443)
5. Добавьте Elastic IP

### 2. Подключение к серверу

```bash
ssh root@your-server-ip
# или
ssh ubuntu@your-server-ip
```

### 3. Обновление системы

```bash
apt update && apt upgrade -y
apt install -y curl wget git vim htop
```

### 4. Создание пользователя (если используете root)

```bash
adduser carspark
usermod -aG sudo carspark
su - carspark
```

## 🌐 Настройка домена

### 1. Настройка DNS записей

Добавьте следующие A-записи в DNS вашего домена:
```
your-domain.com     A    your-server-ip
www.your-domain.com A    your-server-ip
```

### 2. Проверка DNS

```bash
nslookup your-domain.com
ping your-domain.com
```

## 📦 Установка приложения

### 1. Клонирование репозитория

```bash
cd /opt
git clone https://github.com/your-username/auto_project.git carspark
cd carspark
```

### 2. Настройка переменных окружения

```bash
cp env.production .env
nano .env
```

Обновите следующие значения в `.env`:
```env
# Замените на ваш домен
DOMAIN=your-domain.com
EMAIL=admin@your-domain.com

# Сгенерируйте безопасные пароли
POSTGRES_PASSWORD=your-secure-database-password
SECRET_KEY=your-django-secret-key-here

# Обновите домены
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com

# Добавьте AWS S3 credentials
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

### 3. Запуск деплоя

```bash
chmod +x deploy.sh
./deploy.sh production
```

Скрипт автоматически:
- Установит Docker и Docker Compose
- Создаст необходимые директории
- Сгенерирует SSL сертификаты
- Запустит все сервисы
- Настроит автозапуск

## 🔐 Настройка SSL сертификатов

### Автоматическая настройка (рекомендуется)

Скрипт деплоя автоматически настроит Let's Encrypt SSL сертификаты.

### Ручная настройка

```bash
# Установка certbot
sudo apt install -y certbot python3-certbot-nginx

# Остановка nginx
docker-compose -f docker-compose.prod.yml stop nginx

# Получение сертификата
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Копирование сертификатов
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem

# Запуск nginx
docker-compose -f docker-compose.prod.yml up -d nginx
```

## 👤 Создание администратора

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

Введите данные администратора:
- Email: admin@your-domain.com
- Password: secure-password

## 🧪 Проверка деплоя

### 1. Проверка сервисов

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f

# Проверка здоровья
curl https://your-domain.com/health
```

### 2. Проверка в браузере

- **Главная страница**: https://your-domain.com
- **Админ панель**: https://your-domain.com/dealer
- **API документация**: https://your-domain.com/api/docs/

## 🔧 Управление приложением

### Основные команды

```bash
# Запуск сервисов
docker-compose -f docker-compose.prod.yml up -d

# Остановка сервисов
docker-compose -f docker-compose.prod.yml down

# Перезапуск сервисов
docker-compose -f docker-compose.prod.yml restart

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f [service-name]

# Обновление приложения
git pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Systemd сервисы

```bash
# Статус сервиса
sudo systemctl status carspark

# Запуск/остановка
sudo systemctl start carspark
sudo systemctl stop carspark
sudo systemctl restart carspark

# Включение автозапуска
sudo systemctl enable carspark
```

## 📊 Мониторинг и логи

### Логи приложения

```bash
# Все логи
tail -f logs/nginx/access.log
tail -f logs/backend/django.log
tail -f logs/frontend/next.log

# Docker логи
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Мониторинг ресурсов

```bash
# Использование ресурсов
htop
docker stats

# Дисковое пространство
df -h
du -sh /opt/carspark/*
```

## 💾 Резервное копирование

### Автоматические бэкапы

Скрипт деплоя автоматически настроит ежедневные бэкапы в 2:00 AM.

### Ручное создание бэкапа

```bash
./backup.sh
```

### Восстановление из бэкапа

```bash
# Остановка сервисов
docker-compose -f docker-compose.prod.yml down

# Восстановление базы данных
docker-compose -f docker-compose.prod.yml up -d db
sleep 10
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres carspark_db < backups/db_backup_YYYYMMDD_HHMMSS.sql

# Восстановление медиа файлов
tar -xzf backups/media_backup_YYYYMMDD_HHMMSS.tar.gz

# Запуск сервисов
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 Обновление SSL сертификатов

### Автоматическое обновление

```bash
# Добавьте в crontab
crontab -e

# Добавьте строку для еженедельной проверки
0 3 * * 0 /opt/carspark/ssl-renew.sh
```

### Ручное обновление

```bash
./ssl-renew.sh
```

## 🚨 Устранение неполадок

### Проблемы с SSL

```bash
# Проверка сертификата
openssl x509 -in ssl/cert.pem -text -noout

# Проверка подключения
curl -I https://your-domain.com
```

### Проблемы с базой данных

```bash
# Проверка подключения к БД
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "SELECT version();"

# Проверка логов БД
docker-compose -f docker-compose.prod.yml logs db
```

### Проблемы с nginx

```bash
# Проверка конфигурации
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Перезагрузка конфигурации
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Проблемы с Docker

```bash
# Очистка неиспользуемых ресурсов
docker system prune -a

# Перезапуск Docker
sudo systemctl restart docker
```

## 📈 Оптимизация производительности

### Настройка nginx

```bash
# Увеличьте worker_processes в nginx.conf
worker_processes auto;

# Добавьте кэширование
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Настройка PostgreSQL

```bash
# Создайте файл postgresql.conf
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
"
```

## 🔒 Безопасность

### Настройка файрвола

```bash
# Установка UFW
sudo apt install -y ufw

# Настройка правил
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Регулярные обновления

```bash
# Создайте скрипт обновления
cat > update.sh << 'EOF'
#!/bin/bash
apt update && apt upgrade -y
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
EOF

chmod +x update.sh

# Добавьте в crontab для еженедельных обновлений
0 2 * * 1 /opt/carspark/update.sh
```

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs -f`
2. Проверьте статус сервисов: `docker-compose -f docker-compose.prod.yml ps`
3. Проверьте использование ресурсов: `htop` и `df -h`
4. Создайте issue в репозитории с подробным описанием проблемы

---

**Удачного деплоя! 🚀**
