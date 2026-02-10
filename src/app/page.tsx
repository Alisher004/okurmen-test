import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import HomePage from "@/components/HomePage"

export default async function Page() {
  const session = await auth()
  
  // Redirect authenticated students to dashboard
  if (session?.user?.role === "STUDENT") {
    redirect("/dashboard")
  }
  
  const tests = await prisma.test.findMany({
    where: { isActive: true },
    include: {
      questions: true,
      _count: {
        select: { testAttempts: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Get user's test attempts if logged in
  let userAttempts: Record<string, boolean> = {}
  if (session?.user?.id) {
    const attempts = await prisma.testAttempt.findMany({
      where: { userId: session.user.id },
      select: { testId: true }
    })
    userAttempts = attempts.reduce((acc, attempt) => {
      acc[attempt.testId] = true
      return acc
    }, {} as Record<string, boolean>)
  }

  return (
    <HomePage 
      tests={tests} 
      userAttempts={userAttempts}
      isStudent={session?.user?.role === "STUDENT"}
    />
  )
}
