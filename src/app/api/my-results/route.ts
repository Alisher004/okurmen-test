import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const attempts = await prisma.testAttempt.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        test: {
          select: {
            title: true,
            description: true
          }
        }
      },
      orderBy: {
        completedAt: "desc"
      }
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error("Error loading results:", error)
    return NextResponse.json(
      { error: "Ошибка загрузки результатов" },
      { status: 500 }
    )
  }
}
