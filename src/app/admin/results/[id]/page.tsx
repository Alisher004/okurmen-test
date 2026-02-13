"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Clock,
  Award
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import ReactMarkdown from "react-markdown"

interface Option {
  id: string
  text: string
  isCorrect: boolean
  order: number
}

interface Question {
  id: string
  type: "MULTIPLE_CHOICE" | "TEXT"
  question: string
  order: number
  options: Option[]
}

interface Answer {
  id: string
  questionId: string
  selectedOptionId: string | null
  textAnswer: string | null
  isCorrect: boolean | null
  question: Question
}

interface User {
  id: string
  fullName: string
  email: string
  phone: string
  age: number
}

interface Test {
  id: string
  title: string
  description: string | null
  timeLimit: number | null
  questions: Question[]
}

interface Attempt {
  id: string
  score: number | null
  completedAt: string
  user: User
  test: Test
  answers: Answer[]
}

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [attemptId, setAttemptId] = useState<string>("")
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(p => setAttemptId(p.id))
  }, [params])

  useEffect(() => {
    if (attemptId) {
      loadAttempt()
    }
  }, [attemptId])

  const loadAttempt = async () => {
    try {
      const response = await fetch(`/api/admin/results/${attemptId}`)
      if (!response.ok) throw new Error("Ошибка загрузки")
      
      const data = await response.json()
      setAttempt(data)
    } catch (error) {
      console.error("Error loading attempt:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Результат не найден</p>
          <Link href="/admin/results" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Вернуться к списку
          </Link>
        </div>
      </div>
    )
  }

  const correctAnswers = attempt.answers.filter(a => a.isCorrect === true).length
  const totalQuestions = attempt.test.questions.length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/results"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Назад к результатам
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Результаты теста
            </h1>
            <p className="text-gray-600">
              Детальный просмотр ответов и оценка
            </p>
          </div>
          
          {attempt.score !== null && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{attempt.score}</div>
                  <div className="text-xs text-white opacity-90">баллов</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <User className="text-white" size={32} />
          </div>
          
          <div className="flex-1 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Информация об ученике
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-400" />
                  <span className="text-gray-900">{attempt.user.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-900">{attempt.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-900">{attempt.user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-gray-900">{attempt.user.age} лет</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Информация о тесте
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <span className="text-gray-900">{attempt.test.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(attempt.completedAt), {
                      addSuffix: true,
                      locale: ru
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-gray-400" />
                  <span className="text-gray-900">
                    {correctAnswers} из {totalQuestions} правильных
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions and Answers */}
      <div className="space-y-6">
        {attempt.test.questions
          .sort((a, b) => a.order - b.order)
          .map((question, index) => {
            const answer = attempt.answers.find(a => a.questionId === question.id)
            if (!answer) return null

            return (
              <div
                key={question.id}
                className="bg-white rounded-2xl shadow-sm border-2 p-6"
                style={{
                  borderColor: question.type === "TEXT"
                    ? '#e5e7eb'
                    : answer.isCorrect === true
                    ? '#10b981'
                    : answer.isCorrect === false
                    ? '#ef4444'
                    : '#e5e7eb'
                }}
              >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30"
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none mb-2 text-gray-900">
                      <ReactMarkdown>{question.question}</ReactMarkdown>
                    </div>
                    <span
                      className="inline-block px-3 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: question.type === "MULTIPLE_CHOICE" ? '#dbeafe' : '#fef3c7',
                        color: question.type === "MULTIPLE_CHOICE" ? '#1e40af' : '#92400e'
                      }}
                    >
                      {question.type === "MULTIPLE_CHOICE" ? "Выбор варианта" : "Текстовый ответ"}
                    </span>
                  </div>
                  
                  {answer.isCorrect !== null && question.type === "MULTIPLE_CHOICE" && (
                    <div className="flex-shrink-0">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="text-green-600" size={32} />
                      ) : (
                        <XCircle className="text-red-600" size={32} />
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                {question.type === "MULTIPLE_CHOICE" ? (
                  <div className="ml-14 space-y-3">
                    {question.options
                      .sort((a, b) => a.order - b.order)
                      .map((option) => {
                        const isSelected = answer.selectedOptionId === option.id
                        const isCorrectOption = option.isCorrect
                        const showAsWrong = isSelected && !isCorrectOption
                        const showAsCorrect = isCorrectOption

                        return (
                          <div
                            key={option.id}
                            className="p-4 rounded-xl border-2 transition-all"
                            style={{
                              borderColor: showAsWrong
                                ? '#ef4444'
                                : showAsCorrect
                                ? '#10b981'
                                : '#e5e7eb',
                              backgroundColor: showAsWrong
                                ? '#fee2e2'
                                : showAsCorrect
                                ? '#f0fdf4'
                                : 'transparent'
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-900">{option.text}</span>
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800">
                                    Выбрано
                                  </span>
                                )}
                                {isCorrectOption && (
                                  <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">
                                    Правильный
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="ml-14">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        Ответ ученика:
                      </p>
                      <p className="whitespace-pre-wrap text-gray-900">
                        {answer.textAnswer || "Нет ответа"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
