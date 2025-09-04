'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import S3Image from '@/components/s3-image'

interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageGallery({ images, alt, className = '' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <p className="text-gray-500">Нет изображений</p>
        </div>
      </div>
    )
  }

  const openImage = (index: number) => {
    setSelectedImage(index)
    setIsOpen(true)
  }

  const closeImage = () => {
    setIsOpen(false)
    setSelectedImage(null)
  }

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    } else if (selectedImage === 0) {
      setSelectedImage(images.length - 1)
    }
  }

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1)
    } else if (selectedImage === images.length - 1) {
      setSelectedImage(0)
    }
  }

  // Клавиши и свайпы
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prevImage()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break
        case 'Escape':
          e.preventDefault()
          closeImage()
          break
      }
    }

    let startX = 0
    let startY = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (!isOpen) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isOpen) return
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY
      const minSwipeDistance = 50
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        diffX > 0 ? nextImage() : prevImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, selectedImage, images.length])

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Главное изображение */}
        <div className="relative aspect-video rounded-lg overflow-hidden group bg-gray-100">
          {images[0] && typeof images[0] === 'string' && images[0].trim() !== '' ? (
            <S3Image
              src={images[0]}
              alt={alt}
              width={600}
              height={400}
              className="object-cover transition-transform group-hover:scale-105 w-full h-full"
              fallback="/placeholder.svg?height=400&width=600&query=car"
            />
          ) : (
            <Image
              src="/placeholder.svg?height=400&width=600&query=car"
              alt={alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          )}
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />

          {/* Zoom */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg"
              onClick={() => openImage(0)}
              title="Увеличить фото"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Навигация поверх главной карточки */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => openImage(images.length - 1)}
                title="Предыдущее фото"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => openImage(1)}
                title="Следующее фото"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Счётчик фото */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              +{images.length - 1} фото
            </div>
          )}
        </div>

        {/* Миниатюры */}
        {images && Array.isArray(images) && images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {images.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openImage(index)}
              >
                {image && typeof image === 'string' && image.trim() !== '' ? (
                  <S3Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    width={120}
                    height={120}
                    className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                    fallback="/placeholder.svg?height=120&width=120&query=car"
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=120&width=120&query=car"
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 120px"
                  />
                )}
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ZoomIn className="h-3 w-3 text-white drop-shadow-md" />
                </div>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                  {index + 1}
                </div>
                {index === 7 && images.length > 8 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">+{images.length - 8}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка просмотра — по максимуму, но строго в пределах вьюпорта */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="
            p-0 border-0 shadow-none
            w-full
            max-w-[min(1400px,calc(100vw-2rem))]
            sm:max-w-[min(1600px,calc(100vw-4rem))]
            rounded-lg overflow-hidden
          "
        >
          {/* Скрытый заголовок для a11y */}
          <DialogTitle className="sr-only">
            Просмотр изображения {selectedImage !== null ? selectedImage + 1 : 1} из {images.length}
          </DialogTitle>

          {/* Внутренний контейнер: ограничиваем по высоте вьюпорта */}
          <div
            className="
              relative flex items-center justify-center
              bg-gray-50
            "
            style={{
              // не вылезать за экран по высоте
              maxHeight: 'calc(100dvh - 2rem)',
              // чтобы контент не прыгал по ширине
              width: '100%',
            }}
          >
            {/* Кнопка закрытия */}
            <Button
              variant="ghost"
              size="sm"
              className="
                absolute top-4 right-4 z-10
                text-gray-700 hover:bg-gray-100 bg-white/90
                rounded-full shadow-lg border
                sm:top-6 sm:right-6
              "
              onClick={closeImage}
              title="Закрыть (Esc)"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Картинка: вписывается в доступное пространство */}
            {selectedImage !== null && (
              <div
                className="
                  w-full h-full flex items-center justify-center
                  p-2 sm:p-4
                "
                style={{
                  // отступы на кнопки и рамки
                  maxHeight: 'calc(100dvh - 6rem)',
                }}
              >
                {images[selectedImage] && typeof images[selectedImage] === 'string' && images[selectedImage].trim() !== '' ? (
                  <S3Image
                    src={images[selectedImage]}
                    alt={`${alt} ${selectedImage + 1}`}
                    width={1920}
                    height={1080}
                    className="w-auto h-auto max-w-full max-h-full object-contain"
                    fallback="/placeholder.svg?height=1080&width=1920&query=car"
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=1080&width=1920&query=car"
                    alt={`${alt} ${selectedImage + 1}`}
                    width={1920}
                    height={1080}
                    className="w-auto h-auto max-w-full max-h-full object-contain"
                    priority
                    sizes="100vw"
                  />
                )}
              </div>
            )}

            {/* Навигация (внутри, не выходит за пределы контейнера) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2 sm:p-4">
              <Button
                variant="ghost"
                size="sm"
                className="pointer-events-auto text-gray-700 hover:bg-gray-100 bg-white/90 rounded-full shadow-lg border h-10 w-10 sm:h-12 sm:w-12"
                onClick={prevImage}
                title="Предыдущее фото (←)"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="pointer-events-auto text-gray-700 hover:bg-gray-100 bg-white/90 rounded-full shadow-lg border h-10 w-10 sm:h-12 sm:w-12"
                onClick={nextImage}
                title="Следующее фото (→)"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            {/* Счётчик */}
            {selectedImage !== null && (
              <div
                className="
                  absolute bottom-4 left-1/2 -translate-x-1/2
                  bg-white/90 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2
                  rounded-full text-xs sm:text-sm font-medium
                  shadow-lg border
                "
              >
                {selectedImage + 1} / {images.length}
              </div>
            )}

            {/* Подсказки */}
            <div className="absolute bottom-4 left-4 bg-white/90 text-gray-700 text-xs px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg shadow-lg border hidden sm:block">
              <div className="flex items-center gap-2">
                <span>← →</span>
                <span>или</span>
                <span>Esc</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
