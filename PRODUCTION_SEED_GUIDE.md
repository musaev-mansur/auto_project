# 🌱 Заполнение production базы локально

## 📋 Инструкция

### Шаг 1: Получить URL production базы

1. Зайдите в **Render Dashboard**
2. Откройте ваш **Web Service** 
3. Перейдите в **Environment**
4. Скопируйте значение `DATABASE_URL`

Должно выглядеть примерно так:
```
postgresql://auto_project_user:xxx@dpg-d2b88a3uibrs73fcajk0-a.frankfurt-postgres.render.com/auto_project
```

### Шаг 2: Установить переменную окружения

**Вариант A - Временно в терминале:**
```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://auto_project_user:xxx@dpg-xxx.render.com/auto_project"
$env:ADMIN_PASSWORD="your_secure_password_here"

# Windows CMD  
set DATABASE_URL=postgresql://auto_project_user:xxx@dpg-xxx.render.com/auto_project
set ADMIN_PASSWORD=your_secure_password_here

# Linux/Mac
export DATABASE_URL="postgresql://auto_project_user:xxx@dpg-xxx.render.com/auto_project"
export ADMIN_PASSWORD="your_secure_password_here"
```

**Вариант B - Создать .env.local:**
```bash
# Создайте файл .env.local
DATABASE_URL="postgresql://auto_project_user:xxx@dpg-xxx.render.com/auto_project"
ADMIN_PASSWORD="your_secure_password_here"
```

### Шаг 3: Запустить seed

```bash
npm run db:seed:production
```

### Шаг 4: Проверить результат

Зайдите на ваш сайт и попробуйте войти:
- **Email**: `admin@example.com`
- **Пароль**: `admin123`

## ✅ Что произойдет

Скрипт создаст:
- 👤 **1 админа** для входа
- 🚗 **3 автомобиля** (BMW X5, Mercedes C-Class, Audi A4)
- 🔗 **Связи** между данными

## 🚨 Важные моменты

- ⚠️ **Запускайте только один раз!** Иначе получите дубликаты
- 🔒 **Не коммитьте .env.local** (уже в .gitignore)
- 🌐 **URL базы из Render** должен быть точным
- 💾 **Сохраните учетные данные** админа

## 🔍 Отладка

Если возникли ошибки:

```bash
# Проверить подключение к БД
npx prisma db pull

# Посмотреть структуру БД  
npx prisma studio
```

---

## 🎉 Готово!

После успешного seed ваш сайт полностью заработает с тестовыми данными!
