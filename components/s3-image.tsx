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
  const [imageSrc, setImageSrc] = React.useState<string>(isValidSrc ? src : fallback)
  const [hasError, setHasError] = React.useState(!isValidSrc)

  React.useEffect(() => {
    if (isValidSrc) {
      setImageSrc(src)
      setHasError(false)
    } else {
      setImageSrc(fallback)
      setHasError(true)
    }
  }, [src, isValidSrc, fallback])

  const handleImageError = () => {
    console.log('🖼️ Image error occurred for:', src)
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
