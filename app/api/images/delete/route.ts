import { NextRequest, NextResponse } from 'next/server'
import { deleteImageFromS3, extractS3KeyFromUrl } from '@/lib/s3-config'

// Обработка DELETE запроса для удаления изображений
export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl, imageKey } = await request.json()

    if (!imageUrl && !imageKey) {
      return NextResponse.json(
        { error: 'Either imageUrl or imageKey is required' },
        { status: 400 }
      )
    }

    let key: string

    if (imageKey) {
      key = imageKey
    } else if (imageUrl) {
      const extractedKey = extractS3KeyFromUrl(imageUrl)
      if (!extractedKey) {
        return NextResponse.json(
          { error: 'Invalid S3 URL provided' },
          { status: 400 }
        )
      }
      key = extractedKey
    } else {
      return NextResponse.json(
        { error: 'No valid image identifier provided' },
        { status: 400 }
      )
    }

    // Удаление изображения из S3
    const result = await deleteImageFromS3(key)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to delete image', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      key: key
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Обработка POST запроса для массового удаления
export async function POST(request: NextRequest) {
  try {
    const { imageUrls, imageKeys } = await request.json()

    if (!imageUrls && !imageKeys) {
      return NextResponse.json(
        { error: 'Either imageUrls or imageKeys array is required' },
        { status: 400 }
      )
    }

    const keys: string[] = []

    // Обработка imageKeys
    if (imageKeys && Array.isArray(imageKeys)) {
      keys.push(...imageKeys)
    }

    // Обработка imageUrls
    if (imageUrls && Array.isArray(imageUrls)) {
      for (const url of imageUrls) {
        const extractedKey = extractS3KeyFromUrl(url)
        if (extractedKey) {
          keys.push(extractedKey)
        }
      }
    }

    if (keys.length === 0) {
      return NextResponse.json(
        { error: 'No valid image identifiers found' },
        { status: 400 }
      )
    }

    // Массовое удаление изображений
    const deleteResults = await Promise.all(
      keys.map(key => deleteImageFromS3(key))
    )

    const successfulDeletes = deleteResults.filter(result => result.success)
    const failedDeletes = deleteResults.filter(result => !result.success)

    return NextResponse.json({
      success: true,
      deleted: successfulDeletes.length,
      failed: failedDeletes.length,
      total: keys.length,
      errors: failedDeletes.map(result => result.error)
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Обработка OPTIONS запроса для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
