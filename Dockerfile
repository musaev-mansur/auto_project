# Dockerfile для локальной разработки
FROM node:18-alpine

# Устанавливаем зависимости
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Копируем Prisma схему для генерации клиента
COPY prisma ./prisma

# Устанавливаем зависимости
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else npm install; \
  fi

# Генерируем Prisma клиент
RUN npx prisma generate

# Копируем остальной исходный код
COPY . .

# Открываем порт
EXPOSE 3000

# Команда по умолчанию
CMD ["npm", "run", "dev"]
