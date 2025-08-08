import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// GET - получить конкретный автомобиль
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const car = await prisma.car.findUnique({
      where: { id },
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

    if (!car) {
      return NextResponse.json(
        { error: 'Автомобиль не найден' },
        { status: 404 }
      )
    }

    // Увеличиваем счетчик просмотров
    await prisma.car.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error('Ошибка при получении автомобиля:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// PUT - обновить автомобиль
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Проверяем, существует ли автомобиль
    const existingCar = await prisma.car.findUnique({
      where: { id }
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: 'Автомобиль не найден' },
        { status: 404 }
      )
    }

    // Преобразуем photos в JSON строку если это массив
    const carData = {
      ...body,
      photos: Array.isArray(body.photos) ? JSON.stringify(body.photos) : body.photos
    }

    const car = await prisma.car.update({
      where: { id },
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

    return NextResponse.json({
      message: 'Автомобиль успешно обновлен',
      car
    })
  } catch (error) {
    console.error('Ошибка при обновлении автомобиля:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE - удалить автомобиль
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Проверяем, существует ли автомобиль
    const existingCar = await prisma.car.findUnique({
      where: { id }
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: 'Автомобиль не найден' },
        { status: 404 }
      )
    }

    await prisma.car.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Автомобиль успешно удален'
    })
  } catch (error) {
    console.error('Ошибка при удалении автомобиля:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
