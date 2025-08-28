import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // Проверяем безопасность пути
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid filename', { status: 400 })
    }

    // Определяем путь к файлу
    const isRender = process.env.RENDER === 'true'
    const filePath = isRender 
      ? join('/tmp/uploads', filename)
      : join(process.cwd(), 'public', 'uploads', filename)

    // Проверяем существование файла
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Читаем файл
    const fileBuffer = await readFile(filePath)
    
    // Определяем MIME тип
    const extension = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }

    // Возвращаем файл с правильными заголовками
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Кэшируем на 24 часа
      },
    })
  } catch (error) {
    console.error('Ошибка при получении файла:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
