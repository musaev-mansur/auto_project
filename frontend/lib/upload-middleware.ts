import multer from 'multer'
import { validateImageFile } from './s3-config'

// Типы для App Router
export interface MulterRequest {
  files?: Express.Multer.File[]
  file?: Express.Multer.File
  body?: any
}

// Настройка multer для обработки файлов в памяти
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Максимум 10 файлов за раз
  },
  fileFilter: (req, file, cb) => {
    // Валидация типа файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'))
    }
  },
})

// Типы для расширенного запроса
export interface MulterRequest {
  files?: Express.Multer.File[]
  file?: Express.Multer.File
  body?: any
}

// Middleware для загрузки одного файла
export const uploadSingle = (fieldName: string = 'image') => {
  return upload.single(fieldName)
}

// Middleware для загрузки нескольких файлов
export const uploadMultiple = (fieldName: string = 'images', maxCount: number = 10) => {
  return upload.array(fieldName, maxCount)
}

// Обработчик ошибок multer
export const handleMulterError = (err: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return { error: 'File too large. Maximum size is 5MB.' }
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return { error: 'Too many files. Maximum is 10 files.' }
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return { error: 'Unexpected file field.' }
    }
  }
  
  if (err.message) {
    return { error: err.message }
  }
  
  return { error: 'Unknown error occurred' }
}

// Валидация загруженных файлов
export const validateUploadedFiles = (files: Express.Multer.File[]) => {
  const errors: string[] = []
  
  files.forEach((file, index) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      errors.push(`File ${index + 1}: ${validation.error}`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export default upload
