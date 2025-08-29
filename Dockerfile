# Dockerfile для продакшена
FROM node:18

# Устанавливаем зависимости для сборки
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*

# Настраиваем npm registry
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

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
