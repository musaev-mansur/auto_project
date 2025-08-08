import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Проверяем, существует ли уже админ с таким email
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Админ с таким email уже существует' },
        { status: 400 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создаем нового админа
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      }
    })

    // Убираем пароль из ответа
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json(
      { 
        message: 'Админ успешно создан',
        admin: adminWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Ошибка при создании админа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
