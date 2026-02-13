import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import TestsList from "@/components/admin/TestsList"

export default async function TestsPage() {
  const tests = await prisma.test.findMany({
    include: {
      questions: true,
      _count: {
        select: { testAttempts: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Тесты</h1>
            <p className="text-gray-600">Управление тестами и вопросами</p>
          </div>
          <Link
            href="/admin/tests/create"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            Создать тест
          </Link>
        </div>

        <TestsList tests={tests as any} />
      </div>
    </div>
  )
}