import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { questions } = body

    // Удаляем все существующие вопросы
    await prisma.question.deleteMany({
      where: { testId: id }
    })

    // Создаем новые вопросы
    for (const question of questions) {
      await prisma.question.create({
        data: {
          testId: id,
          type: question.type,
          question: question.question,
          order: question.order,
          options: {
            create: question.type === "MULTIPLE_CHOICE" 
              ? question.options.map((opt: any) => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  order: opt.order
                }))
              : []
          }
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving questions:", error)
    return NextResponse.json(
      { error: "Failed to save questions" },
      { status: 500 }
    )
  }
}
