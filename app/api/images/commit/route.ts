// app/api/images/commit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { s3Client, BUCKET_NAME, BUCKET_REGION } from '@/lib/s3-config'
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const { carId, images } = await request.json()
    
    console.log('Commit images request:', { carId, imagesCount: images?.length })

    if (!carId || !Array.isArray(images) || images.length === 0) {
      console.log('Invalid request data:', { carId, images })
      return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 })
    }

    const committedImages: string[] = []

    for (const imageUrl of images) {
      try {
        console.log('Processing image:', imageUrl)
        
        // Извлекаем ключ S3 из URL
        const url = new URL(imageUrl)
        const tempKey = url.pathname.substring(1) // Убираем начальный слеш
        
        console.log('Extracted temp key:', tempKey)

        // Проверяем, что это временное изображение
        if (!tempKey.includes('/temp_')) {
          console.log('Not a temporary image, keeping as is')
          // Если это уже постоянное изображение, просто добавляем в результат
          committedImages.push(imageUrl)
          continue
        }

        // Создаем новый ключ для постоянного хранения
        const fileName = tempKey.split('/').pop()
        const permanentKey = `cars/${carId}/${fileName}`
        
        console.log('Moving from', tempKey, 'to', permanentKey)

        // Копируем файл из временной папки в постоянную
         const copyCommand = new CopyObjectCommand({
             Bucket: BUCKET_NAME,
             // ВАЖНО: ведущий слэш и encodeURIComponent
             CopySource: `/${BUCKET_NAME}/${encodeURIComponent(tempKey)}`,
             Key: permanentKey,
             MetadataDirective: 'COPY',
           })

        await s3Client.send(copyCommand)
        console.log('File copied successfully')

        // Удаляем временный файл
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: tempKey,
        })

        await s3Client.send(deleteCommand)
        console.log('Temporary file deleted')

        // Добавляем новый URL в результат
        const newUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${permanentKey}`
        committedImages.push(newUrl)
        console.log('Added new URL:', newUrl)

      } catch (error) {
        console.error('Error processing image:', imageUrl, error)
        // Если не удалось обработать, оставляем оригинальный URL
        committedImages.push(imageUrl)
      }
    }

    console.log('Commit completed successfully:', { 
      originalCount: images.length, 
      committedCount: committedImages.length,
      committedImages 
    })
    
    return NextResponse.json({
      success: true,
      images: committedImages,
    })

  } catch (error) {
    console.error('Commit error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
