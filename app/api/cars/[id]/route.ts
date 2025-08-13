import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { deleteImageFromS3, extractS3KeyFromUrl } from '@/lib/s3-config'

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
    
    console.log('Обновление автомобиля:', { id, body })
    
    // Проверяем, существует ли автомобиль
    const existingCar = await prisma.car.findUnique({
      where: { id }
    })

    if (!existingCar) {
      console.log('Автомобиль не найден:', id)
      return NextResponse.json(
        { error: 'Автомобиль не найден' },
        { status: 404 }
      )
    }

    // Удаляем старые изображения из S3, которые больше не используются
    try {
      const oldPhotos = JSON.parse(existingCar.photos || '[]')
      const newPhotos = Array.isArray(body.photos) ? body.photos : []
      
      // Находим изображения, которые были удалены
      const removedPhotos = oldPhotos.filter((oldPhoto: string) => !newPhotos.includes(oldPhoto))
      
      console.log('Удаляем старые изображения:', removedPhotos)
      
      const deletePromises = removedPhotos.map((photoUrl: string) => {
        const s3Key = extractS3KeyFromUrl(photoUrl)
        if (s3Key) {
          return deleteImageFromS3(s3Key)
        }
        return Promise.resolve({ success: true })
      })
      
      await Promise.all(deletePromises)
      console.log('Старые изображения успешно удалены из S3')
    } catch (error) {
      console.error('Ошибка при удалении старых изображений из S3:', error)
      // Продолжаем обновление автомобиля даже если не удалось удалить изображения
    }

    // Преобразуем photos в JSON строку если это массив
    const carData = {
      ...body,
      photos: Array.isArray(body.photos) ? JSON.stringify(body.photos) : body.photos
    }

    console.log('Данные для обновления:', carData)
    console.log('Photos field:', { 
      original: body.photos, 
      processed: carData.photos,
      isArray: Array.isArray(body.photos)
    })

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

    console.log('Автомобиль успешно обновлен:', car.id)
    return NextResponse.json({
      message: 'Автомобиль успешно обновлен',
      car
    })
  } catch (error) {
    console.error('Ошибка при обновлении автомобиля:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', details: error instanceof Error ? error.message : 'Unknown error' },
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
    
    // Получаем автомобиль перед удалением, чтобы получить фотографии
    const existingCar = await prisma.car.findUnique({
      where: { id }
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: 'Автомобиль не найден' },
        { status: 404 }
      )
    }

    // Удаляем изображения из S3
    try {
      const photos = JSON.parse(existingCar.photos || '[]')
      const deletePromises = photos.map((photoUrl: string) => {
        const s3Key = extractS3KeyFromUrl(photoUrl)
        if (s3Key) {
          return deleteImageFromS3(s3Key)
        }
        return Promise.resolve({ success: true })
      })
      
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error deleting images from S3:', error)
      // Продолжаем удаление автомобиля даже если не удалось удалить изображения
    }

    // Удаляем автомобиль из базы данных
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
