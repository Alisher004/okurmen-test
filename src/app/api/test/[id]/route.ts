import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const test = await prisma.test.findUnique({
      where: { id, isActive: true },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                text: true,
                order: true
              }
            }
          },
          orderBy: { order: "asc" }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: "Тест не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error loading test:", error)
    return NextResponse.json(
      { error: "Ошибка загрузки теста" },
      { status: 500 }
    )
  }
}
