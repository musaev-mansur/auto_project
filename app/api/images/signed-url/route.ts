// app/api/images/signed-url/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSignedImageUrl } from '@/lib/s3-config'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()
    
    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 })
    }

    // Извлекаем ключ S3 из URL
    const url = new URL(imageUrl)
    const key = url.pathname.substring(1) // Убираем начальный слеш
    
    if (!key) {
      return NextResponse.json({ success: false, error: 'Invalid image URL' }, { status: 400 })
    }

    // Генерируем подписанный URL (действителен 24 часа)
    const signedUrl = await getSignedImageUrl(key, 86400)
    
    return NextResponse.json({
      success: true,
      signedUrl,
      originalUrl: imageUrl,
      key
    })

  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
