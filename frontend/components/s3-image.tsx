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
  console.log('🖼️ S3Image render:', { src, alt, isValidSrc: src && src.trim() !== '' && src !== 'undefined' && src !== 'null' })
  // Проверяем валидность src
  const isValidSrc = src && src.trim() !== '' && src !== 'undefined' && src !== 'null'
  
  // Если src не содержит полный URL, добавляем базовый URL S3
  const getFullSrc = (src: string) => {
    if (src.startsWith('http')) {
      return src
    }
    // Предполагаем, что это имя файла из S3
    return `https://aslan-auto-img.s3.amazonaws.com/${src}`
  }
  
  const [imageSrc, setImageSrc] = React.useState<string>(isValidSrc ? getFullSrc(src) : fallback)
  const [hasError, setHasError] = React.useState(!isValidSrc)

  React.useEffect(() => {
    if (isValidSrc) {
      setImageSrc(getFullSrc(src))
      setHasError(false)
    } else {
      setImageSrc(fallback)
      setHasError(true)
    }
  }, [src, isValidSrc, fallback])

  const handleImageError = () => {
    console.log('🖼️ Image error occurred for:', src)
    console.log('🖼️ Full URL was:', imageSrc)
    setHasError(true)
    setImageSrc(fallback)
  }

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

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
    />
  )
}

export default S3Image
