"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, GripVertical, FileText, Save, Info } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import Toast from "@/components/ui/Toast"

type QuestionType = "MULTIPLE_CHOICE" | "TEXT"

interface Option {
  id?: string
  text: string
  isCorrect: boolean
  order: number
}

interface Question {
  id?: string
  type: QuestionType
  question: string
  order: number
  options: Option[]
}

interface Test {
  id: string
  title: string
  description: string | null
  isActive: boolean
}

export default function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [previewQuestion, setPreviewQuestion] = useState<string | null>(null)
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
    loadTest()
  }, [resolvedParams.id])

  const loadTest = async () => {
    try {
      const response = await fetch(`/api/admin/tests/${resolvedParams.id}`)
      if (!response.ok) throw new Error("Failed to load test")
      
      const data = await response.json()
      setTest(data)
      setQuestions(data.questions || [])
    } catch (error) {
      setToast({
        isOpen: true,
        message: "Ошибка загрузки теста",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      type: "MULTIPLE_CHOICE",
      question: "",
      order: questions.length,
      options: [
        { text: "", isCorrect: false, order: 0 },
        { text: "", isCorrect: false, order: 1 }
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const addOption = (questionIndex: number) => {
    const updated = [...questions]
    const question = updated[questionIndex]
    question.options.push({
      text: "",
      isCorrect: false,
      order: question.options.length
    })
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: any) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value
    }
    setQuestions(updated)
  }

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex)
    setQuestions(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/tests/${resolvedParams.id}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions })
      })

      if (!response.ok) throw new Error("Failed to save")

      setToast({
        isOpen: true,
        message: "Тест успешно сохранен!",
        type: "success"
      })
      
      setTimeout(() => {
        router.push("/admin/tests")
      }, 1000)
    } catch (error) {
      setToast({
        isOpen: true,
        message: "Ошибка при сохранении",
        type: "error"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-red-600 text-lg">Тест не найден</div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <Breadcrumbs
          items={[
            { label: "Тесты", href: "/admin/tests" },
            { label: test.title }
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{test.title}</h1>
          {test.description && (
            <p className="text-gray-600 text-lg">{test.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="mt-2 cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30">
                        Вопрос {qIndex + 1}
                      </span>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="MULTIPLE_CHOICE">С вариантами</option>
                        <option value="TEXT">Письменный ответ</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Текст вопроса (Markdown) *
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Введите вопрос в формате Markdown..."
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewQuestion(previewQuestion === question.question ? null : question.question)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {previewQuestion === question.question ? "Скрыть превью" : "Показать превью"}
                      </button>
                      {previewQuestion === question.question && (
                        <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <div className="text-sm text-blue-900 mb-2 font-semibold">Превью:</div>
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{question.question}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>

                    {question.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900">
                          Варианты ответов
                        </label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => updateOption(qIndex, oIndex, "isCorrect", e.target.checked)}
                              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              title="Правильный ответ"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(qIndex, oIndex, "text", e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder={`Вариант ${oIndex + 1}`}
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => deleteOption(qIndex, oIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          + Добавить вариант
                        </button>
                      </div>
                    )}

                    {question.type === "TEXT" && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-900 font-medium">
                          <strong>Письменный ответ:</strong> Ученик введет ответ в текстовое поле
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(qIndex)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Plus size={20} />
              Добавить вопрос
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <h3 className="font-bold text-white text-lg">Информация о тесте</h3>
              </div>

              <div className="p-6">
                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">Всего вопросов</span>
                    <span className="text-2xl font-bold text-gray-900">{questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">С вариантами</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {questions.filter(q => q.type === "MULTIPLE_CHOICE").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">Письменных</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {questions.filter(q => q.type === "TEXT").length}
                    </span>
                  </div>
                </div>

                {/* Tip */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-blue-700">Совет:</strong> Используйте Markdown для форматирования вопросов и добавление картинок
                  </p>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving || questions.length === 0}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {saving ? "Сохранение..." : "Сохранить тест"}
                </button>
              </div>
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
