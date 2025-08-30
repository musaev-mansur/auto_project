# Простой Dockerfile для установки node_modules и сборки .next
FROM node:18

WORKDIR /app

# Копируем все файлы
COPY . .

# Устанавливаем зависимости
RUN npm install

# Собираем приложение
RUN npm run build

# Генерируем Prisma клиент
RUN npx prisma generate

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
