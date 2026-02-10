"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import Toast from "@/components/ui/Toast"
import ReactMarkdown from "react-markdown"
import { useLanguage } from "@/contexts/LanguageContext"

interface Option {
  id: string
  text: string
  order: number
}

interface Question {
  id: string
  type: "MULTIPLE_CHOICE" | "TEXT"
  question: string
  order: number
  options: Option[]
}

interface Test {
  id: string
  title: string
  description: string | null
  questions: Question[]
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t } = useLanguage()
  const [testId, setTestId] = useState<string>("")
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{
    isOpen: boolean
    message: string
    type: "success" | "error"
  }>({
    isOpen: false,
    message: "",
    type: "success"
  })

  useEffect(() => {
    params.then(p => setTestId(p.id))
  }, [params])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?testId=${testId}`)
    } else if (status === "authenticated" && testId) {
      loadTest()
    }
  }, [status, testId, router])

  const loadTest = async () => {
    try {
      // Check if user already took this test
      const attemptResponse = await fetch(`/api/test/${testId}/attempt`)
      const attemptData = await attemptResponse.json()

      if (attemptData.hasAttempt) {
        setToast({
          isOpen: true,
          message: t.alreadyTaken,
          type: "error"
        })
        setTimeout(() => router.push("/"), 2000)
        return
      }

      // Load test data
      const response = await fetch(`/api/test/${testId}`)
      if (!response.ok) throw new Error(t.testNotFound)

      const data = await response.json()
      setTest(data)
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.message || t.errorLoadingTest,
        type: "error"
      })
      setTimeout(() => router.push("/"), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!test) return

    // Check if all questions are answered
    const unansweredCount = test.questions.filter(q => !answers[q.id]).length
    if (unansweredCount > 0) {
      setToast({
        isOpen: true,
        message: `${t.answerAllQuestions} (${t.questionsLeft}: ${unansweredCount})`,
        type: "error"
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/test/${testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) throw new Error(t.errorSubmittingTest)

      const result = await response.json()

      setToast({
        isOpen: true,
        message: `${t.testCompleted}: ${result.score}%`,
        type: "success"
      })

      setTimeout(() => router.push("/"), 3000)
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.message || t.errorSubmittingTest,
        type: "error"
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loadingTest}</p>
        </div>
      </div>
    )
  }

  if (!test) return null

  const currentQuestion = test.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Okurmen"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="font-bold text-gray-900">Okurmen</span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>
                  {currentQuestionIndex + 1} / {test.questions.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: '#f99703'
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Test Title */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#111f5e' }}>
                {test.title}
              </h1>
              {test.description && (
                <p style={{ color: '#111f5e', opacity: 0.7 }}>{test.description}</p>
              )}
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 w-8 h-8 text-white rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#f99703' }}>
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <div className="prose prose-sm max-w-none" style={{ color: '#111f5e' }}>
                    <ReactMarkdown>{currentQuestion.question}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="ml-11">
                {currentQuestion.type === "MULTIPLE_CHOICE" ? (
                  <div className="space-y-3">
                    {currentQuestion.options
                      .sort((a, b) => a.order - b.order)
                      .map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                          style={{
                            borderColor: answers[currentQuestion.id] === option.id ? '#f99703' : '#e5e7eb',
                            backgroundColor: answers[currentQuestion.id] === option.id ? '#fff7ed' : 'transparent'
                          }}
                        >
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option.id}
                            checked={answers[currentQuestion.id] === option.id}
                            onChange={(e) =>
                              handleAnswer(currentQuestion.id, e.target.value)
                            }
                            className="w-5 h-5"
                            style={{ accentColor: '#f99703' }}
                          />
                          <span style={{ color: '#111f5e' }}>{option.text}</span>
                        </label>
                      ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswer(currentQuestion.id, e.target.value)
                    }
                    placeholder={t.enterAnswer}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all resize-none"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <ArrowLeft size={20} />
                {t.back}
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  style={{ backgroundColor: '#10b981' }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#059669')}
                  onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                  <CheckCircle2 size={20} />
                  {submitting ? t.submitting : t.finishTest}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-colors font-semibold"
                  style={{ backgroundColor: '#f99703' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e08902'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f99703'}
                >
                  {t.next}
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#111f5e' }}>
              {t.questionNavigation}
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {test.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className="aspect-square rounded-lg font-semibold text-sm transition-all"
                  style={{
                    backgroundColor: index === currentQuestionIndex
                      ? '#f99703'
                      : answers[q.id]
                      ? '#dcfce7'
                      : '#f3f4f6',
                    color: index === currentQuestionIndex
                      ? '#ffffff'
                      : answers[q.id]
                      ? '#166534'
                      : '#6b7280',
                    borderWidth: answers[q.id] && index !== currentQuestionIndex ? '1px' : '0',
                    borderColor: answers[q.id] && index !== currentQuestionIndex ? '#86efac' : 'transparent'
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </>
  )
}
