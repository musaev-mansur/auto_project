# Простой Dockerfile для установки node_modules и сборки .next
FROM node:18-slim

WORKDIR /app

# Копируем все файлы
COPY . .

# Устанавливаем зависимости
RUN npm install

# # Генерируем Prisma клиент
# RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
