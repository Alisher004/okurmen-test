"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Users, Award, ArrowRight, CheckCircle2, FileText } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "./LanguageSwitcher"

interface Test {
  id: string
  title: string
  description: string | null
  questions: any[]
  _count: {
    testAttempts: number
  }
}

interface HomePageProps {
  tests: Test[]
  userAttempts: Record<string, boolean>
  isStudent: boolean
}

export default function HomePage({ tests, userAttempts, isStudent }: HomePageProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Okurmen"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-gray-900">Okurmen</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {isStudent ? (
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
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                    style={{ color: '#111f5e', opacity: 0.7 }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    {t.login}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#f99703' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e08902'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f99703'}
                  >
                    {t.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo-for-main-page.svg"
                alt="Okurmen"
                width={350}
                height={350}
                className="object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ color: '#111f5e' }}>
              {t.heroTitle}
            </h1>
            <p className="text-xl mb-8 leading-relaxed" style={{ color: '#111f5e', opacity: 0.8 }}>
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f99703' }}>
                <BookOpen className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#111f5e' }}>
                {t.qualityEducation}
              </h3>
              <p style={{ color: '#111f5e', opacity: 0.7 }}>
                {t.qualityEducationDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f99703' }}>
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#111f5e' }}>
                {t.activeCommunity}
              </h3>
              <p style={{ color: '#111f5e', opacity: 0.7 }}>
                {t.activeCommunityDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f99703' }}>
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#111f5e' }}>
                {t.careerGrowth}
              </h3>
              <p style={{ color: '#111f5e', opacity: 0.7 }}>
                {t.careerGrowthDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#111f5e' }}>{t.aboutTitle}</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: '#111f5e', opacity: 0.8 }}>
            <p>
              <strong style={{ color: '#111f5e', opacity: 1 }}>Okurmen</strong> — {t.aboutText1}
            </p>
            <p>
              {t.aboutText2}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg" style={{ color: '#111f5e' }}>
              <CheckCircle2 size={20} style={{ color: '#f99703' }} />
              <span className="font-medium">{t.practicalApproach}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg" style={{ color: '#111f5e' }}>
              <CheckCircle2 size={20} style={{ color: '#f99703' }} />
              <span className="font-medium">{t.experiencedTeachers}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg" style={{ color: '#111f5e' }}>
              <CheckCircle2 size={20} style={{ color: '#f99703' }} />
              <span className="font-medium">{t.modernTechnologies}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#111f5e' }}>
              {t.availableTests}
            </h2>
            <p className="text-lg" style={{ color: '#111f5e', opacity: 0.7 }}>
              {t.availableTestsDesc}
            </p>
          </div>

          {tests.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                  style={{ borderColor: userAttempts[test.id] ? '#e5e7eb' : '#f99703' }}
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
                    href={
                      isStudent
                        ? userAttempts[test.id]
                          ? "/my-results"
                          : `/test/${test.id}`
                        : `/register?testId=${test.id}`
                    }
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl transition-colors font-semibold"
                    style={{
                      backgroundColor: userAttempts[test.id] ? '#f3f4f6' : '#f99703',
                      color: userAttempts[test.id] ? '#6b7280' : '#ffffff'
                    }}
                  >
                    {userAttempts[test.id] ? (
                      <>
                        <CheckCircle2 size={20} />
                        {t.testCompleted}
                      </>
                    ) : (
                      <>
                        {t.takeTest}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Okurmen"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-bold text-gray-900">Okurmen</span>
          </div>
          <p className="text-center text-gray-600 text-sm">
            © 2024 Okurmen. {t.allRightsReserved}
          </p>
        </div>
      </footer>
    </div>
  )
}
