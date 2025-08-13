// app/api/images/get/route.ts
import { NextRequest } from 'next/server'
import { s3Client, BUCKET_NAME } from '@/lib/s3-config'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function GET(req: NextRequest) {
  const key = (req.nextUrl.searchParams.get('key') || '').replace(/^\/+/, '')
  if (!key) return new Response('Missing key', { status: 400 })
  
  try {
    console.log('🖼️ Getting image from S3:', key)
    
    const resp = await s3Client.send(new GetObjectCommand({ 
      Bucket: BUCKET_NAME, 
      Key: key 
    }))
    
    console.log('✅ Image retrieved successfully:', key)
    
    return new Response(resp.Body as any, {
      status: 200,
      headers: {
        'Content-Type': resp.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    console.error('❌ GET image error:', e)
    return new Response('Not found', { status: 404 })
  }
}
