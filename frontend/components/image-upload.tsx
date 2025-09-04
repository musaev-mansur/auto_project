'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Image as ImageIcon, Loader2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  className = '' 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const remainingSlots = maxImages - images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length === 0) return

    setIsUploading(true)
    setUploadError('')

    try {
      // Создаем FormData для загрузки
      const formData = new FormData()
      filesToUpload.forEach(file => {
        formData.append('files', file)
      })

      // Загружаем файлы на сервер
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка загрузки файлов')
      }

      const result = await response.json()
      
      // Добавляем новые изображения к существующим
      onImagesChange([...images, ...result.files])
    } catch (error) {
      console.error('Ошибка при загрузке файлов:', error)
      setUploadError(error instanceof Error ? error.message : 'Ошибка загрузки файлов')
      
      // Fallback: используем base64 для предварительного просмотра
      const newImages: string[] = []
      
      filesToUpload.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            newImages.push(result)
            
            if (newImages.length === filesToUpload.length) {
              onImagesChange([...images, ...newImages])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    } finally {
      setIsUploading(false)
    }
  }

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
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Фотографии автомобиля</label>
        <Badge variant="secondary" className="text-xs">
          {images.length}/{maxImages}
        </Badge>
      </div>

      {/* Область загрузки */}
      {images.length < maxImages && (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            isUploading 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : isDragging 
                ? 'border-blue-500 bg-blue-50 cursor-pointer' 
                : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }`}
          onDragOver={!isUploading ? handleDragOver : undefined}
          onDragLeave={!isUploading ? handleDragLeave : undefined}
          onDrop={!isUploading ? handleDrop : undefined}
          onClick={!isUploading ? openFileDialog : undefined}
        >
          <CardContent className="p-6 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-600 mb-1">
                  Загружаем изображения...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Перетащите изображения сюда или нажмите для выбора
                </p>
                <p className="text-xs text-gray-500">
                  Поддерживаются: JPG, PNG, GIF (макс. {maxImages} файлов)
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

             {/* Скрытый input для выбора файлов */}
       <input
         ref={fileInputRef}
         type="file"
         multiple
         accept="image/*"
         onChange={(e) => handleFileSelect(e.target.files)}
         className="hidden"
       />

       {/* Отображение ошибки */}
       {uploadError && (
         <div className="bg-red-50 border border-red-200 rounded-lg p-3">
           <p className="text-sm text-red-600">{uploadError}</p>
         </div>
       )}

             {/* Предварительный просмотр изображений */}
       {images.length > 0 && (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
           {images.map((image, index) => (
             <div key={index} className="relative group">
               <Card className="overflow-hidden">
                 <div className="relative aspect-square">
                   <Image
                     src={image}
                     alt={`Фото ${index + 1}`}
                     fill
                     className="object-cover"
                   />
                   <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                   
                   {/* Кнопка удаления */}
                   <Button
                     size="sm"
                     variant="destructive"
                     className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     onClick={(e) => {
                       e.stopPropagation()
                       removeImage(index)
                     }}
                   >
                     <X className="h-3 w-3" />
                   </Button>

                   {/* Кнопки управления порядком */}
                   <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                     {index > 0 && (
                       <Button
                         size="sm"
                         variant="secondary"
                         className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                         onClick={(e) => {
                           e.stopPropagation()
                           moveImage(index, index - 1)
                         }}
                       >
                         <ChevronUp className="h-3 w-3" />
                       </Button>
                     )}
                     {index < images.length - 1 && (
                       <Button
                         size="sm"
                         variant="secondary"
                         className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                         onClick={(e) => {
                           e.stopPropagation()
                           moveImage(index, index + 1)
                         }}
                       >
                         <ChevronDown className="h-3 w-3" />
                       </Button>
                     )}
                   </div>

                   {/* Номер изображения */}
                   <Badge className={`absolute bottom-1 ${index === 0 ? 'left-1 bg-blue-600' : 'right-1'} text-xs`}>
                     {index === 0 ? 'Главное' : index + 1}
                   </Badge>
                 </div>
               </Card>
             </div>
           ))}
         </div>
       )}

      {/* Кнопка добавления еще изображений */}
      {images.length > 0 && images.length < maxImages && (
        <Button
          variant="outline"
          onClick={openFileDialog}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4 mr-2" />
          )}
          {isUploading ? 'Загрузка...' : 'Добавить еще изображения'}
        </Button>
      )}

             {/* Подсказки */}
       <div className="text-xs text-gray-500 space-y-1">
         <p>• Первое изображение будет главным фото автомобиля</p>
         <p>• Рекомендуемый размер: минимум 800x600 пикселей</p>
         <p>• Максимальный размер файла: 5 МБ</p>
         <p>• Поддерживаемые форматы: JPG, PNG, GIF, WebP</p>
         <p>• Используйте стрелки для изменения порядка изображений</p>
       </div>
    </div>
  )
}
