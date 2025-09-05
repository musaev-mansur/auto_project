# Многоэтапная сборка для frontend и backend
FROM node:18-alpine AS frontend-builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для frontend
COPY frontend/package*.json ./

# Устанавливаем зависимости frontend
RUN npm install

# Копируем исходный код frontend
COPY frontend/ ./

# Собираем frontend
RUN npm run build

# Этап сборки backend
FROM python:3.11-slim AS backend-builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements.txt
COPY backend/requirements.txt ./

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код backend
COPY backend/ ./

# Финальный этап
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости и Node.js
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем только необходимое
RUN apt-get update && apt-get install -y nginx curl && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

# Копируем собранный frontend из первого этапа
COPY --from=frontend-builder /app/.next /app/frontend/.next
COPY --from=frontend-builder /app/public /app/frontend/public
COPY --from=frontend-builder /app/package.json /app/frontend/package.json
COPY --from=frontend-builder /app/node_modules /app/frontend/node_modules

# Копируем Python зависимости и код backend из второго этапа
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /app /app/backend

# Создаем конфигурацию nginx
RUN echo 'server { \
    listen 80; \
    location / { \
        proxy_pass http://localhost:3000; \
    } \
    \
    location /api/ { \
        proxy_pass http://localhost:8000; \
    } \
}' > /etc/nginx/sites-available/default

# Создаем скрипт запуска
RUN echo '#!/bin/bash \n\
cd /app/backend \n\
python init_db.py \n\
python manage.py collectstatic --noinput \n\
python manage.py runserver 0.0.0.0:8000 & \n\
cd /app/frontend \n\
npm start & \n\
sleep 5 \n\
nginx -g "daemon off;"' > /app/start.sh

RUN chmod +x /app/start.sh

# Открываем порты
EXPOSE 80

# Запускаем скрипт
CMD ["/app/start.sh"]
