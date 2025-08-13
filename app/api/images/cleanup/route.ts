// app/api/images/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { s3Client, BUCKET_NAME } from '@/lib/s3-config'
import { ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const { batchId } = await request.json()

    if (!batchId) {
      return NextResponse.json({ success: false, error: 'Batch ID is required' }, { status: 400 })
    }

    // Находим все объекты в временной папке
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `cars/temp_${batchId}/`,
    })

    const listResult = await s3Client.send(listCommand)
    const objects = listResult.Contents || []

    if (objects.length === 0) {
      return NextResponse.json({ success: true, message: 'No temporary files found' })
    }

    // Удаляем все объекты в папке
    const deletePromises = objects.map((obj) => {
      if (!obj.Key) return Promise.resolve()
      
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: obj.Key,
      })
      return s3Client.send(deleteCommand)
    })

    await Promise.all(deletePromises)

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${objects.length} temporary files`,
      deletedCount: objects.length,
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
