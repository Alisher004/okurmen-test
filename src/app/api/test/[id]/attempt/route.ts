import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const { id } = await params

    const attempt = await prisma.testAttempt.findUnique({
      where: {
        userId_testId: {
          userId: session.user.id,
          testId: id
        }
      }
    })

    return NextResponse.json({ hasAttempt: !!attempt })
  } catch (error) {
    console.error("Error checking attempt:", error)
    return NextResponse.json(
      { error: "Ошибка проверки попытки" },
      { status: 500 }
    )
  }
}
