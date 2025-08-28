import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!part) {
      return NextResponse.json(
        { error: 'Part not found' },
        { status: 404 }
      )
    }

    // Увеличиваем счетчик просмотров
    await prisma.part.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({
      part: {
        ...part,
        photos: part.photos ? JSON.parse(part.photos) : []
      }
    })
  } catch (error) {
    console.error('Error fetching part:', error)
    return NextResponse.json(
      { error: 'Failed to fetch part' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // TODO: Implement proper authentication
    // For now, we'll use a simple approach
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      return NextResponse.json(
        { error: 'No admin found' },
        { status: 404 }
      )
    }

    const part = await prisma.part.findUnique({
      where: { id }
    })

    if (!part) {
      return NextResponse.json(
        { error: 'Part not found' },
        { status: 404 }
      )
    }

    if (part.adminId !== admin.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    console.log('Updating part with data:', body)

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.brand !== undefined) updateData.brand = body.brand
    if (body.model !== undefined) updateData.model = body.model
    if (body.yearFrom !== undefined) updateData.yearFrom = body.yearFrom
    if (body.yearTo !== undefined) updateData.yearTo = body.yearTo
    if (body.category !== undefined) updateData.category = body.category
    if (body.condition !== undefined) updateData.condition = body.condition
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.currency !== undefined) updateData.currency = body.currency
    if (body.negotiable !== undefined) updateData.negotiable = body.negotiable
    if (body.city !== undefined) updateData.city = body.city
    if (body.description !== undefined) updateData.description = body.description
    if (body.photos !== undefined) updateData.photos = JSON.stringify(body.photos)
    if (body.status !== undefined) updateData.status = body.status

    const updatedPart = await prisma.part.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      part: {
        ...updatedPart,
        photos: updatedPart.photos ? JSON.parse(updatedPart.photos) : []
      }
    })
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json(
      { error: 'Failed to update part' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // TODO: Implement proper authentication
    // For now, we'll use a simple approach
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      return NextResponse.json(
        { error: 'No admin found' },
        { status: 404 }
      )
    }

    const part = await prisma.part.findUnique({
      where: { id }
    })

    if (!part) {
      return NextResponse.json(
        { error: 'Part not found' },
        { status: 404 }
      )
    }

    if (part.adminId !== admin.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.part.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Part deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json(
      { error: 'Failed to delete part' },
      { status: 500 }
    )
  }
}
