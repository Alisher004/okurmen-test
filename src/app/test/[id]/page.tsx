"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Toast from "@/components/ui/Toast"
import ReactMarkdown from "react-markdown"

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
  timeLimit: number | null
  questions: Question[]
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [testId, setTestId] = useState<string>("")
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [testResult, setTestResult] = useState<{ score: number } | null>(null)
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

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || testResult) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit(true) // Auto-submit when time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, testResult])

  const loadTest = async () => {
    try {
      // Check if user already took this test
      const attemptResponse = await fetch(`/api/test/${testId}/attempt`)
      const attemptData = await attemptResponse.json()

      if (attemptData.hasAttempt) {
        setToast({
          isOpen: true,
          message: "Вы уже прошли этот тест",
          type: "error"
        })
        setTimeout(() => router.push("/dashboard"), 2000)
        return
      }

      // Load test data
      const response = await fetch(`/api/test/${testId}`)
      if (!response.ok) throw new Error("Тест не найден")

      const data = await response.json()
      setTest(data)
      
      // Set timer if test has time limit
      if (data.timeLimit) {
        setTimeRemaining(data.timeLimit * 60) // Convert minutes to seconds
      }
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.message || "Ошибка загрузки теста",
        type: "error"
      })
      setTimeout(() => router.push("/dashboard"), 2000)
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

  const handleSubmit = async (autoSubmit = false) => {
    if (!test) return

    // Check if current question is answered
    const currentQuestion = test.questions[currentQuestionIndex]
    if (!answers[currentQuestion.id] && !autoSubmit) {
      setToast({
        isOpen: true,
        message: "Пожалуйста, ответьте на вопрос",
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

      if (!response.ok) throw new Error("Ошибка отправки теста")

      const result = await response.json()
      setTestResult(result)
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.message || "Ошибка отправки теста",
        type: "error"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return { bg: '#dcfce7', text: '#166534', border: '#86efac' }
    if (score >= 50) return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' }
    return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#f99703' }}></div>
          <p style={{ color: '#111f5e', opacity: 0.7 }}>Загрузка теста...</p>
        </div>
      </div>
    )
  }

  if (!test) return null

  // Show result screen
  if (testResult) {
    const colors = getScoreColor(testResult.score)
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border-2 p-8 text-center" style={{ borderColor: colors.border }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
            {testResult.score >= 70 ? (
              <CheckCircle2 size={48} style={{ color: colors.text }} />
            ) : testResult.score >= 50 ? (
              <AlertCircle size={48} style={{ color: colors.text }} />
            ) : (
              <XCircle size={48} style={{ color: colors.text }} />
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#111f5e' }}>
            Тест завершен!
          </h1>
          
          <p className="text-lg mb-6" style={{ color: '#111f5e', opacity: 0.7 }}>
            Ваш результат:
          </p>
          
          <div className="text-6xl font-bold mb-8" style={{ color: colors.text }}>
            {testResult.score}%
          </div>
          
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full px-6 py-4 text-white rounded-xl transition-colors font-semibold"
              style={{ backgroundColor: '#f99703' }}
            >
              Вернуться к тестам
            </Link>
            <Link
              href="/my-results"
              className="block w-full px-6 py-4 border-2 rounded-xl transition-colors font-semibold"
              style={{ borderColor: '#f99703', color: '#f99703' }}
            >
              Посмотреть все результаты
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
                {timeRemaining !== null && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-50'
                  }`} style={{ color: timeRemaining >= 60 ? '#111f5e' : undefined }}>
                    <Clock size={20} />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                )}
                <div className="text-sm font-medium" style={{ color: '#111f5e', opacity: 0.7 }}>
                  {currentQuestionIndex + 1} / {test.questions.length}
                </div>
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
                    placeholder="Введите ваш ответ..."
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
            <div className="flex items-center justify-end pt-6 border-t border-gray-200">
              {isLastQuestion ? (
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  style={{ backgroundColor: '#10b981' }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#059669')}
                  onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                  <CheckCircle2 size={20} />
                  {submitting ? "Отправка..." : "Завершить тест"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#f99703' }}
                  onMouseEnter={(e) => answers[currentQuestion.id] && (e.currentTarget.style.backgroundColor = '#e08902')}
                  onMouseLeave={(e) => answers[currentQuestion.id] && (e.currentTarget.style.backgroundColor = '#f99703')}
                >
                  Далее
                  <CheckCircle2 size={20} />
                </button>
              )}
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
