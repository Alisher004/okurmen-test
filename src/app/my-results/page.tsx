"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, FileText, LogOut } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import MobileMenu from "@/components/MobileMenu"

interface TestAttempt {
  id: string
  score: number | null
  completedAt: string
  test: {
    title: string
    description: string | null
    timeLimit: number | null
  }
}

export default function MyResultsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated") {
      loadResults()
    }
  }, [status, router])

  const loadResults = async () => {
    try {
      const response = await fetch("/api/my-results")
      if (!response.ok) throw new Error("Ошибка загрузки результатов")
      
      const data = await response.json()
      setAttempts(data)
    } catch (error) {
      console.error("Error loading results:", error)
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
          <p style={{ color: '#111f5e', opacity: 0.7 }}>{t.loadingResults}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Okurmen"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-bold" style={{ color: '#111f5e' }}>Okurmen</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="text-sm" style={{ color: '#111f5e', opacity: 0.7 }}>
                {session?.user?.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: '#111f5e', opacity: 0.7 }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <ArrowLeft size={20} />
            {t.backToHome}
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#111f5e' }}>
            {t.myResultsTitle}
          </h1>

          {attempts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#111f5e' }}>
                {t.noCompletedTests}
              </h3>
              <p className="mb-6" style={{ color: '#111f5e', opacity: 0.7 }}>
                {t.noCompletedTestsDesc}
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-colors font-semibold"
                style={{ backgroundColor: '#f99703' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e08902'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f99703'}
              >
                {t.goToTests}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="border rounded-xl p-6 transition-all"
                  style={{ borderColor: '#f99703', borderWidth: '2px' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#111f5e' }}>
                        {attempt.test.title}
                      </h3>
                      {attempt.test.description && (
                        <p className="text-sm mb-3" style={{ color: '#111f5e', opacity: 0.7 }}>
                          {attempt.test.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#111f5e', opacity: 0.6 }}>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {formatDistanceToNow(new Date(attempt.completedAt), {
                            addSuffix: true,
                            locale: ru
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      {attempt.score !== null ? (
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${
                            attempt.score >= 70
                              ? "text-green-600"
                              : attempt.score >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}>
                            {attempt.score}%
                          </div>
                          <div className="text-xs mt-1" style={{ color: '#111f5e', opacity: 0.6 }}>
                            {t.result}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <CheckCircle2 className="mx-auto mb-1" size={32} style={{ color: '#f99703' }} />
                          <div className="text-xs" style={{ color: '#111f5e', opacity: 0.6 }}>
                            {t.checking}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
