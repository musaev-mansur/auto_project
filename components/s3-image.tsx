'use client'

import React from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface S3ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: string
}

const S3Image: React.FC<S3ImageProps> = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  fallback = '/placeholder.jpg'
}) => {
  // Проверяем валидность src
  const isValidSrc = src && src.trim() !== '' && src !== 'undefined' && src !== 'null'
  const initialSrc = isValidSrc ? src : fallback
  
  const [imageSrc, setImageSrc] = React.useState<string>(initialSrc)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(!isValidSrc)

  React.useEffect(() => {
    if (isValidSrc) {
      setImageSrc(src)
      setIsLoading(true)
      setHasError(false)
    } else {
      setImageSrc(fallback)
      setHasError(true)
      setIsLoading(false)
    }
  }, [src, isValidSrc, fallback])

  const handleImageError = async () => {
    console.log('🖼️ Image error occurred for:', src)
    console.log('🖼️ Current error state:', hasError)
    
    // Если это ключ S3 (без http), используем прокси
    if (!src.startsWith('http') && !hasError) {
      try {
        console.log('🔄 Using S3 proxy for key:', src)
        const proxyUrl = `/api/images/get?key=${encodeURIComponent(src)}`
        console.log('🔄 Proxy URL:', proxyUrl)
        setImageSrc(proxyUrl)
        setIsLoading(true)
        return
      } catch (error) {
        console.error('❌ Error using S3 proxy:', error)
      }
    }
    
    // Если изображение не загрузилось, пробуем получить подписанный URL
    if (src.includes('s3.amazonaws.com') && !hasError) {
      try {
        console.log('🔄 Getting signed URL for:', src)
        const response = await fetch('/api/images/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: src })
        })
        
        console.log('🔄 Signed URL response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('🔄 Signed URL response data:', data)
          
          if (data.success && data.signedUrl) {
            console.log('✅ Got signed URL:', data.signedUrl)
            setImageSrc(data.signedUrl)
            setIsLoading(true)
            return
          } else {
            console.log('❌ Signed URL request failed:', data.error)
          }
        } else {
          console.log('❌ Signed URL request failed with status:', response.status)
          const errorText = await response.text()
          console.log('❌ Error response:', errorText)
        }
      } catch (error) {
        console.error('❌ Error getting signed URL:', error)
      }
    } else {
      console.log('🔄 Not an S3 image or already tried, using fallback')
    }
    
    // Если все не удалось, показываем fallback
    console.log('🔄 Using fallback image:', fallback)
    setHasError(true)
    setImageSrc(fallback)
    setIsLoading(false)
  }

  // Проверяем, не истек ли подписанный URL при загрузке компонента
  React.useEffect(() => {    // Если это ключ S3 (без http), используем прокси сразу
    if (!src.startsWith('http')) {
      console.log('🔄 S3 key detected, using proxy:', src)
      const proxyUrl = `/api/images/get?key=${encodeURIComponent(src)}`
      setImageSrc(proxyUrl)
      setIsLoading(true)
      return
    }
    
    if (src.includes('s3.amazonaws.com') && src.includes('X-Amz-Expires=')) {
      // Извлекаем время истечения из URL
      const url = new URL(src)
      const expiresParam = url.searchParams.get('X-Amz-Expires')
      const dateParam = url.searchParams.get('X-Amz-Date')
      
      if (expiresParam && dateParam) {
        const expiresIn = parseInt(expiresParam)
        const dateStr = dateParam // формат: 20250812T234821Z
        
        // Парсим дату
        const year = parseInt(dateStr.substring(0, 4))
        const month = parseInt(dateStr.substring(4, 6)) - 1
        const day = parseInt(dateStr.substring(6, 8))
        const hour = parseInt(dateStr.substring(9, 11))
        const minute = parseInt(dateStr.substring(11, 13))
        const second = parseInt(dateStr.substring(13, 15))
        
        const signedDate = new Date(year, month, day, hour, minute, second)
        const expiryDate = new Date(signedDate.getTime() + expiresIn * 1000)
        const now = new Date()
        
        // Если URL истекает в течение следующих 2 часов, обновляем его
        if (expiryDate.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
          console.log('🔄 URL expires soon, refreshing...')
          handleImageError()
        }
      }
    }
  }, [src])

  // Автоматически обновляем подписанные URL каждые 23 часа (они действительны 24 часа)
  React.useEffect(() => {
    if (src.includes('s3.amazonaws.com') && src.includes('X-Amz-Expires=')) {
      const interval = setInterval(async () => {
        try {
          console.log('🔄 Refreshing signed URL for:', src)
          const response = await fetch('/api/images/signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: src })
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.signedUrl) {
              console.log('✅ Refreshed signed URL')
              setImageSrc(data.signedUrl)
            }
          }
        } catch (error) {
          console.error('❌ Error refreshing signed URL:', error)
        }
      }, 23 * 60 * 60 * 1000) // 23 часа

      return () => clearInterval(interval)
    }
  }, [src])

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  // Дополнительная проверка валидности URL перед рендером
  const isValidImageSrc = imageSrc && 
    imageSrc.trim() !== '' && 
    imageSrc !== 'undefined' && 
    imageSrc !== 'null' &&
    (imageSrc.startsWith('http') || imageSrc.startsWith('/'))

  if (!isValidImageSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
      onLoad={() => setIsLoading(false)}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    />
  )
}

export default S3Image
