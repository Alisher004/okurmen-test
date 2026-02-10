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

    // Get user's completed test IDs
    const completedTests = await prisma.testAttempt.findMany({
      where: { userId: session.user.id },
      select: { testId: true }
    })

    const completedTestIds = completedTests.map(t => t.testId)

    // Get active tests that user hasn't completed yet
    const tests = await prisma.test.findMany({
      where: {
        isActive: true,
        id: {
          notIn: completedTestIds
        }
      },
      include: {
        questions: true,
        _count: {
          select: { testAttempts: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error("Error loading available tests:", error)
    return NextResponse.json(
      { error: "Ошибка загрузки тестов" },
      { status: 500 }
    )
  }
}
