# Dockerfile для продакшена
FROM node:18-alpine

# Устанавливаем зависимости для сборки
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Копируем Prisma схему
COPY prisma ./prisma

# Устанавливаем зависимости
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  elif [ -f pnpm-lock.yaml ]; then npm install --only=production; \
  else npm install --only=production; \
  fi

# Генерируем Prisma клиент
RUN npx prisma generate

# Копируем исходный код
COPY . .

# Устанавливаем dev зависимости для сборки
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install; \
  else npm install; \
  fi

# Собираем приложение
RUN npm run build

# Удаляем dev зависимости
RUN npm prune --production

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]
