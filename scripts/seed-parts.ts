import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedParts() {
  try {
    console.log('🌱 Seeding parts...')

    // Получаем первого админа
    const admin = await prisma.admin.findFirst()
    if (!admin) {
      console.error('❌ No admin found. Please create an admin first.')
      return
    }

    const parts = [
      {
        name: 'Двигатель BMW N54',
        brand: 'BMW',
        model: '3 Series',
        yearFrom: 2006,
        yearTo: 2010,
        category: 'engine',
        condition: 'used',
        price: 3500,
        currency: 'EUR',
        negotiable: true,
        city: 'Брюссель',
        description: 'Двигатель BMW N54 3.0L Twin-Turbo в отличном состоянии. Пробег 120,000 км. Полная комплектация с турбинами, форсунками и ЭБУ.',
        photos: JSON.stringify([
          'cars/parts/bmw_n54_engine_1.jpg',
          'cars/parts/bmw_n54_engine_2.jpg',
          'cars/parts/bmw_n54_engine_3.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Коробка передач Mercedes 7G-Tronic',
        brand: 'Mercedes-Benz',
        model: 'E-Class',
        yearFrom: 2009,
        yearTo: 2016,
        category: 'transmission',
        condition: 'refurbished',
        price: 2800,
        currency: 'EUR',
        negotiable: false,
        city: 'Антверпен',
        description: 'Автоматическая коробка передач 7G-Tronic полностью восстановленная. Гарантия 1 год. Подходит для E-Class W212.',
        photos: JSON.stringify([
          'cars/parts/mercedes_7g_tronic_1.jpg',
          'cars/parts/mercedes_7g_tronic_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Тормозные диски Brembo',
        brand: 'Audi',
        model: 'A4',
        yearFrom: 2015,
        yearTo: 2020,
        category: 'brakes',
        condition: 'new',
        price: 450,
        currency: 'EUR',
        negotiable: true,
        city: 'Гент',
        description: 'Передние тормозные диски Brembo Sport для Audi A4 B9. Размер 340mm. В комплекте с колодками.',
        photos: JSON.stringify([
          'cars/parts/brembo_brakes_1.jpg',
          'cars/parts/brembo_brakes_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Амортизаторы Bilstein B8',
        brand: 'Volkswagen',
        model: 'Golf',
        yearFrom: 2012,
        yearTo: 2017,
        category: 'suspension',
        condition: 'new',
        price: 320,
        currency: 'EUR',
        negotiable: false,
        city: 'Брюгге',
        description: 'Комплект амортизаторов Bilstein B8 Sport для VW Golf 7. Передние и задние. Улучшенная управляемость.',
        photos: JSON.stringify([
          'cars/parts/bilstein_shocks_1.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Генератор Bosch',
        brand: 'BMW',
        model: '5 Series',
        yearFrom: 2010,
        yearTo: 2017,
        category: 'electrical',
        condition: 'used',
        price: 180,
        currency: 'EUR',
        negotiable: true,
        city: 'Льеж',
        description: 'Генератор Bosch для BMW 5 Series F10. Рабочее состояние, проверен. Мощность 180A.',
        photos: JSON.stringify([
          'cars/parts/bosch_generator_1.jpg',
          'cars/parts/bosch_generator_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Капот BMW E90',
        brand: 'BMW',
        model: '3 Series',
        yearFrom: 2005,
        yearTo: 2011,
        category: 'body',
        condition: 'used',
        price: 650,
        currency: 'EUR',
        negotiable: true,
        city: 'Шарлеруа',
        description: 'Капот BMW E90 в хорошем состоянии. Цвет Alpine White. Небольшие царапины, легко исправить.',
        photos: JSON.stringify([
          'cars/parts/bmw_hood_1.jpg',
          'cars/parts/bmw_hood_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Кожаные сиденья Mercedes',
        brand: 'Mercedes-Benz',
        model: 'C-Class',
        yearFrom: 2007,
        yearTo: 2014,
        category: 'interior',
        condition: 'used',
        price: 1200,
        currency: 'EUR',
        negotiable: true,
        city: 'Намюр',
        description: 'Передние кожаные сиденья Mercedes C-Class W204. Электрорегулировка, подогрев. Цвет черный.',
        photos: JSON.stringify([
          'cars/parts/mercedes_seats_1.jpg',
          'cars/parts/mercedes_seats_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Фары Audi LED',
        brand: 'Audi',
        model: 'A6',
        yearFrom: 2018,
        yearTo: 2023,
        category: 'exterior',
        condition: 'new',
        price: 850,
        currency: 'EUR',
        negotiable: false,
        city: 'Монс',
        description: 'Передние фары Audi A6 C8 с LED технологией. Полная комплектация с балластами.',
        photos: JSON.stringify([
          'cars/parts/audi_led_lights_1.jpg',
          'cars/parts/audi_led_lights_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Диски BBS CH-R',
        brand: 'BMW',
        model: '1 Series',
        yearFrom: 2011,
        yearTo: 2019,
        category: 'wheels',
        condition: 'used',
        price: 800,
        currency: 'EUR',
        negotiable: true,
        city: 'Левен',
        description: 'Комплект дисков BBS CH-R 18" для BMW 1 Series. Размер 8Jx18 ET47. В комплекте с шинами.',
        photos: JSON.stringify([
          'cars/parts/bbs_wheels_1.jpg',
          'cars/parts/bbs_wheels_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      },
      {
        name: 'Шины Michelin Pilot Sport 4',
        brand: 'All',
        model: 'Universal',
        yearFrom: 2015,
        yearTo: 2023,
        category: 'tires',
        condition: 'new',
        price: 480,
        currency: 'EUR',
        negotiable: false,
        city: 'Алст',
        description: 'Комплект шин Michelin Pilot Sport 4 225/40R18. Летние шины. Остаток протектора 95%.',
        photos: JSON.stringify([
          'cars/parts/michelin_tires_1.jpg',
          'cars/parts/michelin_tires_2.jpg'
        ]),
        status: 'published',
        adminId: admin.id
      }
    ]

    for (const part of parts) {
      await prisma.part.create({
        data: part
      })
      console.log(`✅ Created part: ${part.name}`)
    }

    console.log('🎉 Parts seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding parts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedParts()
