import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// S3 конфигурация
console.log('🔧 S3 Config - Region:', process.env.AWS_REGION || 'eu-north-1')
console.log('🔧 S3 Config - Bucket:', process.env.AWS_S3_BUCKET_NAME || 'autodealer-images')
console.log('🔧 S3 Config - Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing')
console.log('🔧 S3 Config - Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing')

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'autodealer-images'
const BUCKET_REGION = process.env.AWS_REGION || 'eu-north-1'

// Типы для изображений
export interface ImageUploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface ImageDeleteResponse {
  success: boolean
  error?: string
}

// Генерация уникального ключа для файла
export const generateImageKey = (originalName: string, carId: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `cars/${carId}/${timestamp}_${randomString}.${extension}`
}

// Загрузка изображения в S3
export const uploadImageToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<ImageUploadResponse> => {
  try {
    console.log('☁️ S3 Upload - Starting upload for key:', key)
    console.log('☁️ S3 Upload - Bucket:', BUCKET_NAME, 'Region:', BUCKET_REGION)
    console.log('☁️ S3 Upload - File size:', file.length, 'Content type:', contentType)
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Убираем ACL, так как bucket не поддерживает ACL
    })

    console.log('☁️ S3 Upload - Sending command...')
    await s3Client.send(command)
    console.log('☁️ S3 Upload - Command sent successfully')

    const imageUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`
    console.log('☁️ S3 Upload - Generated URL:', imageUrl)

    return {
      success: true,
      url: imageUrl,
      key: key,
    }
  } catch (error) {
    console.error('❌ S3 Upload Error:', error)
    console.error('❌ S3 Upload Error Details:', {
      bucket: BUCKET_NAME,
      region: BUCKET_REGION,
      key: key,
      contentType: contentType,
      fileSize: file.length
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Удаление изображения из S3
export const deleteImageFromS3 = async (key: string): Promise<ImageDeleteResponse> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting from S3:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Получение подписанного URL для приватных файлов (если нужно)
export const getSignedImageUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

// Валидация файла изображения
export const validateImageFile = (file: Express.Multer.File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' }
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
  }

  return { valid: true }
}

// Извлечение ключа S3 из URL
export const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('s3.amazonaws.com') || urlObj.hostname.includes('.s3.')) {
      return urlObj.pathname.substring(1) // Убираем начальный слеш
    }
    return null
  } catch {
    return null
  }
}

export { s3Client, BUCKET_NAME, BUCKET_REGION }
