# Инструкция по деплою на VPS сервер

## Подготовка сервера Ubuntu

### 1. Установка Docker и Docker Compose

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем необходимые пакеты
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Добавляем GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавляем репозиторий Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Обновляем список пакетов
sudo apt update

# Устанавливаем Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Добавляем пользователя в группу docker (чтобы не использовать sudo)
sudo usermod -aG docker $USER

# Перезагружаем систему или перелогиниваемся
sudo reboot
```

### 2. Клонирование проекта

```bash
# Создаем папку для проектов (рекомендуется)
sudo mkdir -p /opt/projects
sudo chown $USER:$USER /opt/projects

# Переходим в папку
cd /opt/projects

# Клонируем проект
git clone https://github.com/musaev-mansur/auto_project.git
cd auto_project
```

**Альтернативный вариант - клонирование в домашнюю папку:**
```bash
# Клонируем в домашнюю папку
cd ~
git clone https://github.com/musaev-mansur/auto_project.git
cd auto_project
```

## Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
# Создаем файл .env
nano .env
```

Содержимое файла `.env`:

```env
# База данных
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/auto_project
POSTGRES_DB=auto_project
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
AWS_S3_BUCKET=aslan-auto-img

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Запуск приложения

### Для продакшена:
```bash
# Собираем и запускаем контейнеры
docker-compose -f docker-compose.prod.yml up -d --build
```

### Для остановки:
```bash
docker-compose -f docker-compose.prod.yml down
```

### Для просмотра логов:
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

## Миграции базы данных

После первого запуска выполните миграции:

```bash
# Войти в контейнер
docker-compose -f docker-compose.prod.yml exec app sh

# Выполнить миграции
npx prisma migrate deploy

# Выйти из контейнера
exit
```

## Настройка Nginx (опционально)

Если используете Nginx как reverse proxy:

```bash
# Устанавливаем Nginx
sudo apt install -y nginx

# Создаем конфигурацию
sudo nano /etc/nginx/sites-available/auto_project
```

Содержимое конфигурации:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активируем сайт
sudo ln -s /etc/nginx/sites-available/auto_project /etc/nginx/sites-enabled/

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

## Обновление приложения

Для обновления приложения:

```bash
# Остановить контейнеры
docker-compose -f docker-compose.prod.yml down

# Получить обновления
git pull

# Пересобрать и запустить
docker-compose -f docker-compose.prod.yml up -d --build
```

## Мониторинг

Проверить статус контейнеров:
```bash
docker-compose -f docker-compose.prod.yml ps
```

Проверить использование ресурсов:
```bash
docker stats
```

## Полезные команды

```bash
# Очистка неиспользуемых Docker ресурсов
docker system prune -a

# Просмотр всех контейнеров
docker ps -a

# Просмотр всех образов
docker images

# Остановка всех контейнеров
docker stop $(docker ps -q)

# Удаление всех контейнеров
docker rm $(docker ps -aq)
```
