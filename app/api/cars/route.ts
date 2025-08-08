import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// GET - получить все автомобили
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const brand = searchParams.get('brand')

    const skip = (page - 1) * limit

    // Строим фильтры
    const where: any = {}
    if (status) where.status = status
    if (brand) where.brand = { contains: brand, mode: 'insensitive' }
    
    console.log('API Filter:', { status, brand, where })

    const cars = await prisma.car.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.car.count({ where })

    return NextResponse.json({
      cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Ошибка при получении автомобилей:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - создать новый автомобиль
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация обязательных полей
    const requiredFields = ['brand', 'model', 'year', 'mileage', 'transmission', 'fuel', 'drive', 'bodyType', 'color', 'power', 'engineVolume', 'euroStandard', 'vin', 'condition', 'price', 'currency', 'city', 'description']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Отсутствуют обязательные поля: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Проверяем, существует ли админ
    let adminId = body.adminId
    if (!adminId) {
      // Если adminId не указан, берем первого админа
      const firstAdmin = await prisma.admin.findFirst()
      if (!firstAdmin) {
        return NextResponse.json(
          { error: 'Не найден админ для создания автомобиля' },
          { status: 400 }
        )
      }
      adminId = firstAdmin.id
    }

    // Преобразуем данные для сохранения
    const carData = {
      brand: body.brand,
      model: body.model,
      generation: body.generation || null,
      year: parseInt(body.year),
      mileage: parseInt(body.mileage),
      transmission: body.transmission,
      fuel: body.fuel,
      drive: body.drive,
      bodyType: body.bodyType,
      color: body.color,
      power: parseInt(body.power),
      engineVolume: parseFloat(body.engineVolume),
      euroStandard: body.euroStandard,
      vin: body.vin,
      condition: body.condition,
      customs: Boolean(body.customs),
      vat: Boolean(body.vat),
      owners: parseInt(body.owners) || 1,
      price: parseFloat(body.price),
      currency: body.currency,
      negotiable: Boolean(body.negotiable),
      city: body.city,
      description: body.description,
      photos: Array.isArray(body.photos) ? JSON.stringify(body.photos) : JSON.stringify(['/placeholder.jpg']),
      status: body.status || 'draft',
      adminId: adminId
    }

    const car = await prisma.car.create({
      data: carData,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Автомобиль успешно создан',
        car 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Ошибка при создании автомобиля:', error)
    
    // Обработка специфических ошибок Prisma
    if (error.code === 'P2002' && error.meta?.target?.includes('vin')) {
      return NextResponse.json(
        { error: 'Автомобиль с таким VIN уже существует' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Указанный админ не найден' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', details: error.message },
      { status: 500 }
    )
  }
}
