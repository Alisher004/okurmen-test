import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, isActive, timeLimit } = body

    const test = await prisma.test.create({
      data: {
        title,
        description: description || null,
        isActive: isActive ?? true,
        timeLimit: timeLimit || null
      }
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error creating test:", error)
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    )
  }
}
