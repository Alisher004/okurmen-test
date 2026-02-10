"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Users, ArrowRight, LogOut, FileText } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"

interface Test {
  id: string
  title: string
  description: string | null
  questions: any[]
  _count: {
    testAttempts: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated") {
      loadTests()
    }
  }, [status, router])

  const loadTests = async () => {
    try {
      const response = await fetch("/api/student/available-tests")
      if (!response.ok) throw new Error("Ошибка загрузки тестов")
      
      const data = await response.json()
      setTests(data)
    } catch (error) {
      console.error("Error loading tests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#f99703' }}></div>
          <p style={{ color: '#111f5e', opacity: 0.7 }}>Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Okurmen"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold" style={{ color: '#111f5e' }}>Okurmen</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link
                href="/my-results"
                className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#111f5e', opacity: 0.7 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <FileText size={16} />
                {t.myResults}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#111f5e', opacity: 0.7 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <LogOut size={16} />
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111f5e' }}>
            {t.welcome}, {session?.user?.name}!
          </h1>
          <p className="text-lg" style={{ color: '#111f5e', opacity: 0.7 }}>
            {t.availableTestsDesc}
          </p>
        </div>

        {/* Tests Section */}
        {tests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#111f5e' }}>
              {t.noTestsAvailable}
            </h3>
            <p style={{ color: '#111f5e', opacity: 0.6 }}>
              {t.noTestsAvailableDesc}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            tests.length === 1 
              ? "md:grid-cols-1 max-w-md mx-auto" 
              : tests.length === 2 
              ? "md:grid-cols-2 max-w-3xl mx-auto" 
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-white border-2 rounded-2xl p-6 hover:shadow-lg transition-all"
                style={{ borderColor: '#f99703' }}
              >
                <h3 className="text-xl font-bold mb-2" style={{ color: '#111f5e' }}>
                  {test.title}
                </h3>
                {test.description && (
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: '#111f5e', opacity: 0.7 }}>
                    {test.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm mb-6 pb-6 border-b border-gray-100" style={{ color: '#111f5e', opacity: 0.6 }}>
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {test.questions.length} {t.questions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {test._count.testAttempts} {t.completed}
                  </span>
                </div>

                <Link
                  href={`/test/${test.id}`}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl transition-colors font-semibold text-white"
                  style={{ backgroundColor: '#f99703' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e08902'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f99703'}
                >
                  {t.takeTest}
                  <ArrowRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
