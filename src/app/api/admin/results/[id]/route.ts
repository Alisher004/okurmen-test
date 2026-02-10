import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const { id } = await params

    const attempt = await prisma.testAttempt.findUnique({
      where: { id },
      include: {
        user: true,
        test: {
          include: {
            questions: {
              include: {
                options: true
              },
              orderBy: { order: "asc" }
            }
          }
        },
        answers: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: "Попытка не найдена" },
        { status: 404 }
      )
    }

    return NextResponse.json(attempt)
  } catch (error) {
    console.error("Error fetching attempt:", error)
    return NextResponse.json(
      { error: "Ошибка загрузки данных" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { answerId, isCorrect } = await request.json()

    // Update answer correctness
    await prisma.answer.update({
      where: { id: answerId },
      data: { isCorrect }
    })

    // Recalculate score
    const attempt = await prisma.testAttempt.findUnique({
      where: { id },
      include: {
        answers: true,
        test: {
          include: {
            questions: true
          }
        }
      }
    })

    if (attempt) {
      const correctAnswers = attempt.answers.filter(a => a.isCorrect === true).length
      const totalQuestions = attempt.test.questions.length
      const score = Math.round((correctAnswers / totalQuestions) * 100)

      await prisma.testAttempt.update({
        where: { id },
        data: { score }
      })

      return NextResponse.json({ success: true, score })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating answer:", error)
    return NextResponse.json(
      { error: "Ошибка обновления" },
      { status: 500 }
    )
  }
}
