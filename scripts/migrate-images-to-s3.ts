import { PrismaClient } from '@prisma/client'
import { uploadImageToS3, generateImageKey } from '../lib/s3-config'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function migrateImagesToS3() {
  try {
    console.log('Starting image migration to S3...')

    // Получаем все автомобили
    const cars = await prisma.car.findMany({
      select: {
        id: true,
        photos: true,
        brand: true,
        model: true
      }
    })

    console.log(`Found ${cars.length} cars to process`)

    for (const car of cars) {
      try {
        const photos = JSON.parse(car.photos || '[]')
        const newPhotos: string[] = []

        console.log(`Processing car ${car.brand} ${car.model} (${car.id})`)

        for (const photoUrl of photos) {
          // Пропускаем уже S3 URL
          if (photoUrl.includes('s3.amazonaws.com') || photoUrl.includes('.s3.')) {
            newPhotos.push(photoUrl)
            continue
          }

          // Пропускаем placeholder изображения
          if (photoUrl.includes('placeholder')) {
            newPhotos.push(photoUrl)
            continue
          }

          try {
            // Путь к локальному файлу
            const localPath = path.join(process.cwd(), 'public', photoUrl.replace(/^\//, ''))
            
            if (fs.existsSync(localPath)) {
              // Читаем файл
              const fileBuffer = fs.readFileSync(localPath)
              const fileName = path.basename(photoUrl)
              
              // Генерируем ключ для S3
              const s3Key = generateImageKey(fileName, car.id)
              
              // Определяем MIME тип
              const ext = path.extname(fileName).toLowerCase()
              const mimeType = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp'
              }[ext] || 'image/jpeg'

              // Загружаем в S3
              const uploadResult = await uploadImageToS3(fileBuffer, s3Key, mimeType)
              
              if (uploadResult.success && uploadResult.url) {
                newPhotos.push(uploadResult.url)
                console.log(`  ✓ Uploaded: ${fileName} -> ${uploadResult.url}`)
              } else {
                console.log(`  ✗ Failed to upload: ${fileName}`)
                newPhotos.push(photoUrl) // Оставляем оригинальный URL
              }
            } else {
              console.log(`  ⚠ File not found: ${localPath}`)
              newPhotos.push(photoUrl) // Оставляем оригинальный URL
            }
          } catch (error) {
            console.error(`  ✗ Error processing ${photoUrl}:`, error)
            newPhotos.push(photoUrl) // Оставляем оригинальный URL
          }
        }

        // Обновляем автомобиль с новыми URL
        await prisma.car.update({
          where: { id: car.id },
          data: { photos: JSON.stringify(newPhotos) }
        })

        console.log(`  ✓ Updated car ${car.id} with ${newPhotos.length} photos`)

      } catch (error) {
        console.error(`Error processing car ${car.id}:`, error)
      }
    }

    console.log('Migration completed!')

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем миграцию
if (require.main === module) {
  migrateImagesToS3()
}

export { migrateImagesToS3 }
