'use client'

import React from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import S3Image from '@/components/s3-image'

type TempPreview = { id: string; url: string }

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
  // Временные превью до окончания аплоада
  const [previews, setPreviews] = React.useState<TempPreview[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  // Единый batchId для всех загрузок в рамках одной сессии
  const [batchId] = React.useState(() => `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`)

  // Синхронизация, если родитель перекинул готовый массив (например, при возврате на шаг)
  React.useEffect(() => {
    console.log('🔄 existingImages changed:', existingImages)
    const newImages = uniq(Array.isArray(existingImages) ? existingImages : [])
    console.log('🔄 Processed newImages:', newImages)
    console.log('🔄 Current images:', images)
    
    // Синхронизируемся только если:
    // 1. newImages не пустой И отличается от текущих images
    // 2. ИЛИ если images пустой И newImages не пустой (первоначальная загрузка)
    if (newImages.length > 0 && JSON.stringify(newImages) !== JSON.stringify(images)) {
      console.log('🔄 Syncing images from parent:', newImages)
      setImages(newImages)
    } else if (newImages.length === 0 && images.length === 0) {
      console.log('🔄 No sync needed - both arrays are empty')
    } else if (newImages.length === 0 && images.length > 0) {
      console.log('🔄 Skipping sync - parent has empty array but we have images')
    } else {
      console.log('🔄 No sync needed - images are the same')
    }
  }, [existingImages])

  // Утилита — безопасно оповестить родителя (вне рендера)
  const notifyParent = React.useCallback((next: string[]) => {
    if (!onUploadComplete) {
      console.log('⚠️ No onUploadComplete callback provided')
      return
    }
    // Если autoNotify выключен, НЕ уведомляем родителя автоматически
    if (!autoNotify) {
      console.log('🚫 Auto-notify disabled, skipping parent notification')
      return
    }
    console.log('📞 Calling onUploadComplete with:', next)
    // вызываем асинхронно, чтобы не попасть в setState-в-рендер
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

  // Основная обработка выбора/дропа файлов
  const handleFiles = async (files: File[]) => {
    if (!files?.length) return

    const totalCount = images.length + previews.length + files.length
    if (totalCount > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} files allowed`,
        variant: 'destructive',
      })
      return
    }

    // валидация
    const validFiles = files.filter((file) => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024
      if (!isValidType) {
        toast({ title: 'Invalid file type', description: `${file.name} is not a valid image file`, variant: 'destructive' })
      }
      if (!isValidSize) {
        toast({ title: 'File too large', description: `${file.name} is larger than 5MB`, variant: 'destructive' })
      }
      return isValidType && isValidSize
    })
    if (validFiles.length === 0) return

    // мгновенные превью
    const newPreviews: TempPreview[] = validFiles.map((f) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(f),
    }))
    setPreviews((p) => [...p, ...newPreviews])

    setIsUploading(true)
    try {
      console.log('📤 Starting upload for files:', validFiles.map(f => f.name))
      console.log('📤 Upload params:', { carId, batchId })
      
      const formData = new FormData()
      formData.append('carId', carId || 'new')
      formData.append('batchId', batchId) // Передаем batchId для создания одной папки
      validFiles.forEach((file) => formData.append('images', file))

      console.log('📤 Sending upload request...')
      const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
      console.log('📥 Upload response status:', res.status)
      
      const result = await res.json()
      console.log('📥 Upload response:', result)

      if (!result?.success || !Array.isArray(result.images)) {
        toast({ title: 'Upload failed', description: result?.error || 'Failed to upload images', variant: 'destructive' })
        // уберём созданные превью
        setPreviews((p) => p.filter((prev) => !newPreviews.some((np) => np.id === prev.id)))
        return
      }

      const uploadedUrls: string[] = result.images
        .map((img: any) => String(img?.url || '').trim())
        .filter(Boolean)

      console.log('📸 Uploaded URLs:', uploadedUrls)

      // добавляем к постоянным
      const nextImages = uniq([...images, ...uploadedUrls]).slice(0, maxFiles)
      console.log('📸 Updated images array:', nextImages)
      setImages(nextImages)
      // Уведомляем родителя только если autoNotify включен
      if (autoNotify) {
        console.log('📸 Notifying parent with images:', nextImages)
        notifyParent(nextImages)
      } else {
        console.log('🚫 Auto-notify disabled, parent will be notified manually')
      }

      toast({ title: 'Upload successful', description: `Uploaded ${uploadedUrls.length} images` })
    } catch (err) {
      console.error('Upload error:', err)
      toast({ title: 'Upload error', description: 'Failed to upload images', variant: 'destructive' })
    } finally {
      setIsUploading(false)
      // убираем временные превью для этой пачки
      setPreviews((p) => p.filter((prev) => !newPreviews.some((np) => np.id === prev.id)))
      if (fileInputRef.current) fileInputRef.current.value = ''
      // чистим blob-URL'ы
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    void handleFiles(files)
  }

  // Удаление постоянной (загруженной) картинки по индексу
  const handleDeleteUploaded = async (index: number) => {
    const url = images[index]
    if (!url) return
    try {
      const s3Key = url.split('/').pop()?.split('?')[0]
      if (!s3Key) {
        toast({ title: 'Delete failed', description: 'Invalid image URL', variant: 'destructive' })
        return
      }

      const res = await fetch('/api/images/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageKey: s3Key }),
      })
      const result = await res.json()
      if (!result?.success) {
        toast({ title: 'Delete failed', description: result?.error || 'Failed to delete image', variant: 'destructive' })
        return
      }

      const nextImages = images.filter((_, i) => i !== index)
      setImages(nextImages)
      // Уведомляем родителя только если autoNotify включен
      if (autoNotify) {
        notifyParent(nextImages)
      }
      toast({ title: 'Image deleted', description: 'Image removed successfully' })
    } catch (err) {
      console.error('Delete error:', err)
      toast({ title: 'Delete error', description: 'Failed to delete image', variant: 'destructive' })
    }
  }

  // Добавляем ref для доступа к методам компонента
  const componentRef = React.useRef<{ getImages: () => string[] }>({
    getImages: () => images
  })

  // Обновляем ref при изменении images
  React.useEffect(() => {
    componentRef.current.getImages = () => images
  }, [images])

  return (
    <div className={`space-y-4 ${className}`} ref={componentRef as any}>
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
                {isUploading ? 'Uploading...' : 'Drop images here or click to upload'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each. Max {maxFiles} files.</p>
            </div>

            {!isUploading && (
              <Button
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length + previews.length >= maxFiles}
              >
                Select Files
              </Button>
            )}

            {isUploading && (
              <div className="mt-2 flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Превью и загруженные */}
      {(() => {
        console.log('🖼️ Rendering images section:', { images: images.length, previews: previews.length, total: images.length + previews.length })
        return (previews.length > 0 || images.length > 0)
      })() && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Images ({images.length + previews.length}/{maxFiles})
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
                   console.log('🔄 Manual update triggered with images:', images)
                   console.log('🔄 Images type:', typeof images)
                   console.log('🔄 Images is array:', Array.isArray(images))
                   console.log('🔄 onUploadComplete type:', typeof onUploadComplete)
                   onUploadComplete(images)
                 }}
                 className="text-xs"
               >
                 Сохранить фото
               </Button>
             )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Временные превью (идут первыми) */}
            {previews.map((p) => (
              <div key={p.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={p.url} alt="preview" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-xs bg-black/30 text-white">
                  uploading…
                </div>
              </div>
            ))}

            {/* Постоянные картинки */}
            {images.map((imageUrl, index) => {
              console.log(`🖼️ Rendering image ${index}:`, imageUrl)
              return (
                <div key={`${imageUrl}-${index}`} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {imageUrl ? (
                    <S3Image 
                      src={imageUrl} 
                      alt={`Image ${index + 1}`} 
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

                                     <p className="mt-1 text-xs text-gray-500 truncate">{imageUrl.split('/').pop()}</p>
                 </div>
               )
             })}
          </div>
        </div>
      )}
    </div>
  )
}

export default S3ImageUpload
