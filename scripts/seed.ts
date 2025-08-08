import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем заполнение базы данных...')

  // Создаем тестового админа
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Администратор',
      role: 'admin'
    }
  })

  console.log('Админ создан:', admin.email)

  // Создаем тестовые автомобили
  const cars = [
    {
      brand: 'BMW',
      model: 'X5',
      generation: 'F15',
      year: 2018,
      mileage: 85000,
      transmission: 'automatic',
      fuel: 'diesel',
      drive: 'all',
      bodyType: 'suv',
      color: 'Черный',
      power: 249,
      engineVolume: 2.0,
      euroStandard: 'Euro 6',
      vin: 'WBAJL0C50JB123456',
      condition: 'excellent',
      customs: true,
      vat: true,
      owners: 1,
      price: 45000,
      currency: 'EUR',
      negotiable: true,
      city: 'Москва',
      description: 'Отличное состояние, полный пакет документов, сервисная история',
      photos: JSON.stringify(['/placeholder.jpg']),
      status: 'published',
      adminId: admin.id
    },
    {
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      generation: 'W205',
      year: 2019,
      mileage: 65000,
      transmission: 'automatic',
      fuel: 'petrol',
      drive: 'rear',
      bodyType: 'sedan',
      color: 'Белый',
      power: 184,
      engineVolume: 2.0,
      euroStandard: 'Euro 6',
      vin: 'WDDWF4FB0FR123456',
      condition: 'good',
      customs: true,
      vat: true,
      owners: 2,
      price: 38000,
      currency: 'EUR',
      negotiable: false,
      city: 'Санкт-Петербург',
      description: 'Хорошее состояние, один владелец в России',
      photos: JSON.stringify(['/placeholder.jpg']),
      status: 'published',
      adminId: admin.id
    },
    {
      brand: 'Audi',
      model: 'A4',
      generation: 'B9',
      year: 2020,
      mileage: 45000,
      transmission: 'automatic',
      fuel: 'petrol',
      drive: 'front',
      bodyType: 'sedan',
      color: 'Серебристый',
      power: 150,
      engineVolume: 1.4,
      euroStandard: 'Euro 6',
      vin: 'WAUZZZ8K9KA123456',
      condition: 'excellent',
      customs: true,
      vat: true,
      owners: 1,
      price: 42000,
      currency: 'EUR',
      negotiable: true,
      city: 'Казань',
      description: 'Первый владелец, полная комплектация',
      photos: JSON.stringify(['/placeholder.jpg']),
      status: 'draft',
      adminId: admin.id
    }
  ]

  for (const carData of cars) {
    const car = await prisma.car.create({
      data: carData
    })
    console.log(`Автомобиль создан: ${car.brand} ${car.model}`)
  }

  console.log('База данных успешно заполнена!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
