import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
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
    const { answers } = await request.json()

    // Check if user already took this test
    const existingAttempt = await prisma.testAttempt.findUnique({
      where: {
        userId_testId: {
          userId: session.user.id,
          testId: id
        }
      }
    })

    if (existingAttempt) {
      return NextResponse.json(
        { error: "Вы уже прошли этот тест" },
        { status: 400 }
      )
    }

    // Load test with questions and correct answers
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: "Тест не найден" },
        { status: 404 }
      )
    }

    // Calculate score
    let correctAnswers = 0
    const answerRecords = []

    for (const question of test.questions) {
      const userAnswer = answers[question.id]
      
      if (question.type === "MULTIPLE_CHOICE") {
        const correctOption = question.options.find(opt => opt.isCorrect)
        const isCorrect = userAnswer === correctOption?.id
        
        if (isCorrect) correctAnswers++

        answerRecords.push({
          questionId: question.id,
          selectedOptionId: userAnswer,
          isCorrect
        })
      } else {
        // TEXT type - save answer without checking correctness
        answerRecords.push({
          questionId: question.id,
          textAnswer: userAnswer,
          isCorrect: null
        })
      }
    }

    // Calculate score percentage (only for multiple choice questions)
    const multipleChoiceCount = test.questions.filter(
      q => q.type === "MULTIPLE_CHOICE"
    ).length
    
    const score = multipleChoiceCount > 0
      ? Math.round((correctAnswers / multipleChoiceCount) * 100)
      : null

    // Create test attempt with answers
    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: session.user.id,
        testId: id,
        score,
        answers: {
          create: answerRecords
        }
      }
    })

    return NextResponse.json({
      success: true,
      score,
      attemptId: testAttempt.id
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json(
      { error: "Ошибка отправки теста" },
      { status: 500 }
    )
  }
}
