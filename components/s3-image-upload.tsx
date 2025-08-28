'use client'

import React from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import S3Image from '@/components/s3-image'

interface S3ImageUploadProps {
  carId: string
  onUploadComplete?: (images: string[]) => void
  maxFiles?: number
  className?: string
  existingImages?: string[]
  autoNotify?: boolean
}

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)))

const S3ImageUpload: React.FC<S3ImageUploadProps> = ({
  carId,
  onUploadComplete,
  maxFiles = 10,
  className = '',
  existingImages = [],
  autoNotify = true,
}) => {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Постоянные (загруженные) картинки = URL'ы из S3
  const [images, setImages] = React.useState<string[]>(uniq(existingImages))
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [batchId] = React.useState(() => `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`)

  // Синхронизация с родительским компонентом
  React.useEffect(() => {
    console.log('🔄 existingImages changed:', existingImages)
    const newImages = uniq(Array.isArray(existingImages) ? existingImages : [])
    
    if (newImages.length > 0 && JSON.stringify(newImages) !== JSON.stringify(images)) {
      console.log('🔄 Syncing images from parent:', newImages)
      setImages(newImages)
    }
  }, [existingImages, images])

  // Уведомление родителя
  const notifyParent = React.useCallback((next: string[]) => {
    if (!onUploadComplete || !autoNotify) return
    console.log('📞 Calling onUploadComplete with:', next)
    queueMicrotask(() => onUploadComplete(next))
  }, [onUploadComplete, autoNotify])

  // Drag'n'Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files || [])
    void handleFiles(files)
  }

  // Основная обработка файлов
  const handleFiles = async (files: File[]) => {
    if (!files?.length) return

    const totalCount = images.length + files.length
    if (totalCount > maxFiles) {
      toast({
        title: 'Слишком много файлов',
        description: `Максимум ${maxFiles} файлов`,
        variant: 'destructive',
      })
      return
    }

    // Валидация файлов
    const validFiles = files.filter((file) => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024
      
      if (!isValidType) {
        toast({ 
          title: 'Неверный тип файла', 
          description: `${file.name} не является изображением`, 
          variant: 'destructive' 
        })
      }
      if (!isValidSize) {
        toast({ 
          title: 'Файл слишком большой', 
          description: `${file.name} больше 5MB`, 
          variant: 'destructive' 
        })
      }
      return isValidType && isValidSize
    })
    
    if (validFiles.length === 0) return

    setIsUploading(true)
    try {
      console.log('📤 Начинаем загрузку файлов:', validFiles.map(f => f.name))
      
      const formData = new FormData()
      formData.append('carId', carId)
      formData.append('batchId', batchId)
      validFiles.forEach((file) => formData.append('images', file))

      console.log('📤 Отправляем запрос на загрузку с carId:', carId)
      const res = await fetch('/api/images/upload', { 
        method: 'POST', 
        body: formData 
      })
      
      console.log('📥 Ответ сервера:', res.status)
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const result = await res.json()
      console.log('📥 Результат загрузки:', result)

      if (!result?.success || !Array.isArray(result.images)) {
        toast({ 
          title: 'Ошибка загрузки', 
          description: result?.error || 'Не удалось загрузить изображения', 
          variant: 'destructive' 
        })
        return
      }

      const uploadedUrls: string[] = result.images
        .map((img: any) => String(img?.url || '').trim())
        .filter(Boolean)

      console.log('📸 Загруженные URL:', uploadedUrls)

      // Добавляем к постоянным изображениям
      const nextImages = uniq([...images, ...uploadedUrls]).slice(0, maxFiles)
      console.log('📸 Обновленный массив изображений:', nextImages)
      setImages(nextImages)
      
      // Уведомляем родителя
      if (autoNotify) {
        console.log('📸 Уведомляем родителя:', nextImages)
        notifyParent(nextImages)
      }

      toast({ 
        title: 'Загрузка успешна', 
        description: `Загружено ${uploadedUrls.length} изображений` 
      })
    } catch (err) {
      console.error('Ошибка загрузки:', err)
      toast({ 
        title: 'Ошибка загрузки', 
        description: 'Не удалось загрузить изображения', 
        variant: 'destructive' 
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    void handleFiles(files)
  }

  // Удаление изображения
  const handleDeleteUploaded = async (index: number) => {
    const url = images[index]
    if (!url) return
    
    try {
      const s3Key = url.split('/').pop()?.split('?')[0]
      if (!s3Key) {
        toast({ 
          title: 'Ошибка удаления', 
          description: 'Неверный URL изображения', 
          variant: 'destructive' 
        })
        return
      }

      const res = await fetch('/api/images/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageKey: s3Key }),
      })
      
      const result = await res.json()
      if (!result?.success) {
        toast({ 
          title: 'Ошибка удаления', 
          description: result?.error || 'Не удалось удалить изображение', 
          variant: 'destructive' 
        })
        return
      }

      const nextImages = images.filter((_, i) => i !== index)
      setImages(nextImages)
      
      if (autoNotify) {
        notifyParent(nextImages)
      }
      
      toast({ 
        title: 'Изображение удалено', 
        description: 'Изображение успешно удалено' 
      })
    } catch (err) {
      console.error('Ошибка удаления:', err)
      toast({ 
        title: 'Ошибка удаления', 
        description: 'Не удалось удалить изображение', 
        variant: 'destructive' 
      })
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Зона загрузки */}
      <Card
        className={`relative border-2 border-dashed transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isUploading ? 'Загрузка...' : 'Перетащите изображения сюда или нажмите для выбора'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP до 5MB каждое. Максимум {maxFiles} файлов.
              </p>
            </div>

            {!isUploading && (
              <Button
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxFiles}
              >
                Выбрать файлы
              </Button>
            )}

            {isUploading && (
              <div className="mt-2 flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Загрузка...</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Загруженные изображения */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Изображения ({images.length}/{maxFiles})
              </h3>
              {!autoNotify && (
                <p className="text-xs text-gray-500 mt-1">
                  Нажмите "Сохранить фото" чтобы применить изменения
                </p>
              )}
            </div>
            {!autoNotify && onUploadComplete && (
              <Button
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('🔄 Ручное обновление с изображениями:', images)
                  onUploadComplete(images)
                }}
                className="text-xs"
              >
                Сохранить фото
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <S3Image 
                      src={imageUrl} 
                      alt={`Изображение ${index + 1}`} 
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteUploaded(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Удалить изображение"
                >
                  <X className="h-3 w-3" />
                </button>

                <p className="mt-1 text-xs text-gray-500 truncate">
                  {imageUrl.split('/').pop()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default S3ImageUpload
