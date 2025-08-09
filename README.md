# Auto Project - База данных

Простая база данных для хранения автомобилей и управления админами с CRUD операциями.

## Структура базы данных

### Модели

#### Admin (Администратор)
- `id` - уникальный идентификатор
- `email` - email админа (уникальный)
- `password` - хешированный пароль
- `name` - имя админа
- `role` - роль (по умолчанию "admin")
- `createdAt` - дата создания
- `updatedAt` - дата обновления

#### Car (Автомобиль)
- `id` - уникальный идентификатор
- `brand` - марка автомобиля
- `model` - модель
- `generation` - поколение (опционально)
- `year` - год выпуска
- `mileage` - пробег
- `transmission` - тип трансмиссии
- `fuel` - тип топлива
- `drive` - тип привода
- `bodyType` - тип кузова
- `color` - цвет
- `power` - мощность двигателя
- `engineVolume` - объем двигателя
- `euroStandard` - экологический стандарт
- `vin` - VIN номер (уникальный)
- `condition` - состояние
- `customs` - растаможен
- `vat` - НДС
- `owners` - количество владельцев
- `price` - цена
- `currency` - валюта
- `negotiable` - торг
- `city` - город
- `description` - описание
- `photos` - фотографии (JSON строка)
- `status` - статус (draft/published/sold)
- `views` - количество просмотров
- `createdAt` - дата создания
- `updatedAt` - дата обновления
- `adminId` - ID админа, создавшего автомобиль

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - регистрация админа
- `POST /api/auth/login` - вход админа

### Автомобили
- `GET /api/cars` - получить все автомобили (с пагинацией и фильтрами)
- `POST /api/cars` - создать новый автомобиль
- `GET /api/cars/[id]` - получить конкретный автомобиль
- `PUT /api/cars/[id]` - обновить автомобиль
- `DELETE /api/cars/[id]` - удалить автомобиль

### Админы
- `GET /api/admins` - получить всех админов (с пагинацией)

## Установка и настройка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` с настройками базы данных:
```
DATABASE_URL="file:./dev.db"
```

3. Создайте и примените миграции:
```bash
npx prisma migrate dev
```

4. Заполните базу данных тестовыми данными:
```bash
npm run db:seed
```

5. Запустите сервер разработки:
```bash
npm run dev
```

## Тестовые данные

После запуска `npm run db:seed` создается:

### Админ
- Email:
- Пароль:

### Автомобили
- BMW X5 2018 года
- Mercedes-Benz C-Class 2019 года
- Audi A4 2020 года

## Использование API

### Регистрация админа
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "password123",
    "name": "Новый Админ"
  }'
```

### Вход админа
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Получение автомобилей
```bash
curl http://localhost:3000/api/cars?page=1&limit=10&status=published
```

### Создание автомобиля
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2021,
    "mileage": 30000,
    "transmission": "automatic",
    "fuel": "petrol",
    "drive": "front",
    "bodyType": "sedan",
    "color": "Серебристый",
    "power": 200,
    "engineVolume": 2.5,
    "euroStandard": "Euro 6",
    "vin": "4T1B11HK5KU123456",
    "condition": "excellent",
    "customs": true,
    "vat": true,
    "owners": 1,
    "price": 35000,
    "currency": "EUR",
    "negotiable": true,
    "city": "Москва",
    "description": "Отличное состояние",
    "photos": ["/placeholder.jpg"],
    "adminId": "admin-id-here"
  }'
```

## Технологии

- **Next.js 15** - React фреймворк
- **Prisma** - ORM для работы с базой данных
- **SQLite** - локальная база данных
- **bcryptjs** - хеширование паролей
- **TypeScript** - типизация
- **next-themes** - управление темами