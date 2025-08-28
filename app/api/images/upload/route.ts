// app/api/images/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToS3, BUCKET_NAME, BUCKET_REGION } from '@/lib/s3-config'

type Uploaded = {
  key: string
  url: string
  size?: number
  contentType?: string
}

function extFromName(name: string) {
  const raw = name.split('.').pop() || ''
  const clean = raw.toLowerCase().split('?')[0].split('#')[0]
  return clean || 'jpg'
}

function safeBaseName(name: string) {
  return name
    .replace(/\.[^/.?#]+(?=$|[?#])/i, '')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .toLowerCase() || 'img'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Получен запрос на загрузку изображений')
    const form = await request.formData()
    const carIdRaw = String(form.get('carId') ?? 'new').trim()
    const batchIdRaw = String(form.get('batchId') ?? '').trim()
    const batchId = batchIdRaw || `b_${Date.now()}`
    const files = form.getAll('images').filter(Boolean) as File[]
    
    console.log('📋 Данные загрузки:', { 
      carIdRaw, 
      batchIdRaw, 
      batchId, 
      filesCount: files.length,
      fileNames: files.map(f => f.name)
    })

    if (!files.length) {
      return NextResponse.json({ 
        success: false, 
        error: 'Файлы не найдены' 
      }, { status: 400 })
    }

    // Префикс для папки в S3 - всегда используем постоянную папку
    const prefix = `cars/${carIdRaw}/`
    
    console.log('📁 Префикс загрузки:', prefix)

    const uploaded: Uploaded[] = []

    for (const file of files) {
      console.log('📄 Обработка файла:', file.name, 'Размер:', file.size, 'Тип:', file.type)
      
      // Проверяем, что это файл (в Node.js нет глобального File)
      if (!file || typeof file !== 'object' || !('name' in file) || !('size' in file) || !('type' in file)) {
        console.log('⚠️ Не является файлом, пропускаем')
        continue
      }
      
      // Проверка размера
      if (file.size > MAX_FILE_SIZE) {
        console.log('❌ Файл слишком большой:', file.name, file.size)
        return NextResponse.json({ 
          success: false, 
          error: `Файл ${file.name} превышает ${MAX_FILE_SIZE / 1024 / 1024}MB` 
        }, { status: 413 })
      }
      
      // Проверка типа
      const ctype = file.type || 'application/octet-stream'
      if (!ALLOWED_TYPES.has(ctype)) {
        console.log('❌ Неподдерживаемый тип изображения:', ctype)
        return NextResponse.json({ 
          success: false, 
          error: `Неподдерживаемый тип изображения: ${ctype}` 
        }, { status: 415 })
      }

      // Генерация имени файла
      const ext = extFromName(file.name)
      const base = safeBaseName(file.name)
      const fname = `${base}_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`
      const key = `${prefix}${fname}`
      
      console.log('🔑 Сгенерированный ключ:', key)

      try {
        // Конвертация файла в буфер
        const arrayBuf = await file.arrayBuffer()
        const buf = Buffer.from(arrayBuf)
        console.log('📦 Файл конвертирован в буфер, размер:', buf.length)

        // Загрузка в S3
        console.log('☁️ Загрузка в S3...')
        const res = await uploadImageToS3(buf, key, ctype)
        console.log('✅ Результат загрузки в S3:', res)
        
        if (!res.success) {
          console.error('❌ Ошибка загрузки:', res.error)
          throw new Error(res.error || 'Ошибка загрузки')
        }
        
        // Генерация URL для доступа к файлу
        console.log('🔗 Генерация URL для:', key)
        const imageUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`
        
        const uploadResult = {
          key: res.key ?? key,
          url: imageUrl,
          size: file.size,
          contentType: ctype,
        }
        uploaded.push(uploadResult)
        console.log('📝 Добавлено в массив загруженных:', uploadResult)
        
      } catch (uploadError) {
        console.error('❌ Ошибка загрузки файла:', file.name, uploadError)
        throw uploadError
      }
    }

    console.log('🎉 Загрузка завершена успешно:', {
      uploadedCount: uploaded.length,
      uploadedImages: uploaded.map(u => ({ key: u.key, url: u.url }))
    })
    
    return NextResponse.json({
      success: true,
      batchId,
      images: uploaded,
    })
  } catch (err) {
    console.error('Ошибка загрузки:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}
