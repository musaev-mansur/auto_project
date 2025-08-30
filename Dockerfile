# Простой Dockerfile для установки node_modules и сборки .next
FROM node:18

WORKDIR /app

# Настройка npm для стабильного подключения
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Копируем все файлы
COPY . .

# Устанавливаем зависимости
RUN npm install

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
