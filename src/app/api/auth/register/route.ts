import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, age, password, testId } = body

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    // Проверяем, существует ли тест
    const test = await prisma.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json(
        { error: "Тест не найден" },
        { status: 404 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        age,
        password: hashedPassword,
        role: "STUDENT"
      }
    })

    return NextResponse.json({
      success: true,
      userId: user.id
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 }
    )
  }
}
