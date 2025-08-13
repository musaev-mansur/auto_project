// app/api/images/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToS3, BUCKET_NAME, BUCKET_REGION, s3Client } from '@/lib/s3-config'

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
  // без расширения, только безопасные символы
  return name
    .replace(/\.[^/.?#]+(?=$|[?#])/i, '')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .toLowerCase() || 'img'
}

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
])

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received')
    const form = await request.formData()
    const carIdRaw = String(form.get('carId') ?? 'new').trim()
    const batchIdRaw = String(form.get('batchId') ?? '').trim()
    const batchId = batchIdRaw || `b_${Date.now()}`
    const files = form.getAll('images').filter(Boolean) as File[]
    
    console.log('📋 Upload data:', { 
      carIdRaw, 
      batchIdRaw, 
      batchId, 
      filesCount: files.length,
      fileNames: files.map(f => f.name)
    })

    if (!files.length) {
      return NextResponse.json({ success: false, error: 'No files' }, { status: 400 })
    }

    // ЕДИНЫЙ префикс на всю загрузку
    const prefix = carIdRaw === 'new'
      ? `cars/temp_${batchId}/`
      : `cars/${carIdRaw}/`
    
    console.log('📁 Upload prefix:', prefix)

    const uploaded: Uploaded[] = []

    for (const file of files) {
      console.log('📄 Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      if (!(file instanceof File)) {
        console.log('⚠️ Not a File instance, skipping')
        continue
      }
      
      if (file.size > MAX_FILE_SIZE) {
        console.log('❌ File too large:', file.name, file.size)
        return NextResponse.json({ success: false, error: `File ${file.name} exceeds ${MAX_FILE_SIZE} bytes` }, { status: 413 })
      }
      
      const ctype = file.type || 'application/octet-stream'
      if (ctype.startsWith('image/') && !ALLOWED_TYPES.has(ctype)) {
        console.log('❌ Unsupported image type:', ctype)
        return NextResponse.json({ success: false, error: `Unsupported image type: ${ctype}` }, { status: 415 })
      }

      const ext = extFromName(file.name)
      const base = safeBaseName(file.name)
      const fname = `${base}_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`
      const key = `${prefix}${fname}`
      
      console.log('🔑 Generated key:', key)

      try {
        const arrayBuf = await file.arrayBuffer()
        const buf = Buffer.from(arrayBuf)
        console.log('📦 File converted to buffer, size:', buf.length)

        // используем ваш helper
        console.log('☁️ Uploading to S3...')
        const res = await uploadImageToS3(buf, key, ctype)
        console.log('✅ S3 upload result:', res)
        
        if (!res.success) {
          console.error('❌ Upload failed:', res.error)
          throw new Error(res.error || 'Upload failed')
        }
        
        // Генерируем подписанный URL для доступа к файлу
        console.log('🔗 Generating signed URL for:', key)
        const { getSignedImageUrl } = await import('@/lib/s3-config')
        const signedUrl = await getSignedImageUrl(key, 86400) // 24 часа
        
        // предполагаем, что helper возвращает { key, url }
        const uploadResult = {
          key: res.key ?? key,
          url: signedUrl, // Используем подписанный URL
          size: file.size,
          contentType: ctype,
        }
        uploaded.push(uploadResult)
        console.log('📝 Added to uploaded array:', uploadResult)
        
      } catch (uploadError) {
        console.error('❌ Error uploading file:', file.name, uploadError)
        throw uploadError
      }
    }

    console.log('🎉 Upload completed successfully:', {
      uploadedCount: uploaded.length,
      uploadedImages: uploaded.map(u => ({ key: u.key, url: u.url }))
    })
    
    return NextResponse.json({
      success: true,
      batchId,
      images: uploaded,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
