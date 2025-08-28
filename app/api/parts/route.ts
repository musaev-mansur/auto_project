import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'published'
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const condition = searchParams.get('condition')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = { status }

    if (category) where.category = category
    if (brand) where.brand = { contains: brand, mode: 'insensitive' }
    if (model) where.model = { contains: model, mode: 'insensitive' }
    if (condition) where.condition = condition

    const [parts, total] = await Promise.all([
      prisma.part.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.part.count({ where })
    ])

    return NextResponse.json({
      parts: parts.map((part: any) => ({
        ...part,
        photos: part.photos ? JSON.parse(part.photos) : []
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching parts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Implement proper authentication
    // For now, we'll use a simple approach
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      console.log('❌ No admin found')
      return NextResponse.json(
        { error: 'No admin found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    console.log('📥 Creating part with data:', body)

    const requiredFields = ['name', 'brand', 'model', 'category', 'condition', 'price', 'currency', 'city', 'description']
    console.log('🔍 Checking required fields:', requiredFields)
    
    for (const field of requiredFields) {
      console.log(`🔍 Checking field '${field}':`, body[field])
      if (!body[field]) {
        console.log(`❌ Отсутствует обязательное поле: ${field}`)
        return NextResponse.json(
          { error: `Отсутствует обязательное поле: ${field}` },
          { status: 400 }
        )
      }
    }

    const part = await prisma.part.create({
      data: {
        name: body.name,
        brand: body.brand,
        model: body.model,
        yearFrom: body.yearFrom || null,
        yearTo: body.yearTo || null,
        category: body.category,
        condition: body.condition,
        price: parseFloat(body.price),
        currency: body.currency,
        negotiable: body.negotiable || false,
        city: body.city,
        description: body.description,
        photos: body.photos ? JSON.stringify(body.photos) : '[]',
        status: body.status || 'draft',
        adminId: admin.id
      }
    })

    return NextResponse.json({
      success: true,
      part: {
        ...part,
        photos: part.photos ? JSON.parse(part.photos) : []
      }
    })
  } catch (error) {
    console.error('Error creating part:', error)
    return NextResponse.json(
      { error: 'Failed to create part' },
      { status: 500 }
    )
  }
}
