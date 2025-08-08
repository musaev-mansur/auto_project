import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Определяем, запущены ли мы в production на Render
const isProduction = process.env.NODE_ENV === 'production'
const isRender = process.env.RENDER === 'true'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Файлы не найдены' },
        { status: 400 }
      )
    }

    const uploadedFiles: string[] = []

    for (const file of files) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        console.log(`Пропускаем файл ${file.name}: не является изображением`)
        continue
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log(`Пропускаем файл ${file.name}: размер превышает 5MB`)
        continue
      }

      // Проверяем расширение файла
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        console.log(`Пропускаем файл ${file.name}: неподдерживаемое расширение`)
        continue
      }

      // Создаем уникальное имя файла
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileName = `${timestamp}_${randomString}.${fileExtension}`

      // В production на Render используем /tmp для временного хранения
      // В локальной разработке используем public/uploads
      let uploadPath: string
      let fileUrl: string

      if (isRender) {
        // На Render используем /tmp директорию
        const tmpDir = '/tmp/uploads'
        if (!existsSync(tmpDir)) {
          await mkdir(tmpDir, { recursive: true })
        }
        uploadPath = join(tmpDir, fileName)
        // В production файлы будут служиться через отдельный API endpoint
        fileUrl = `/api/files/${fileName}`
      } else {
        // Локальная разработка - используем public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true })
        }
        uploadPath = join(uploadDir, fileName)
        fileUrl = `/uploads/${fileName}`
      }

      // Сохраняем файл
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(uploadPath, buffer)

      // Добавляем путь к файлу в список
      uploadedFiles.push(fileUrl)
    }

    return NextResponse.json({
      message: 'Файлы успешно загружены',
      files: uploadedFiles
    })
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
