"use client"

import { useState } from "react"
import Modal from "@/components/ui/Modal"
import { FileText } from "lucide-react"

interface EditTestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; description: string; isActive: boolean }) => void
  test: {
    id: string
    title: string
    description: string | null
    isActive: boolean
  }
  isLoading?: boolean
}

export default function EditTestModal({
  isOpen,
  onClose,
  onSave,
  test,
  isLoading = false
}: EditTestModalProps) {
  const [title, setTitle] = useState(test.title)
  const [description, setDescription] = useState(test.description || "")
  const [isActive, setIsActive] = useState(test.isActive)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, description, isActive })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6">
        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="text-white" size={28} />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Редактировать тест
        </h3>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-900 mb-2">
              Название теста *
            </label>
            <input
              type="text"
              id="edit-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Введите название теста"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-semibold text-gray-900 mb-2">
              Описание
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Краткое описание теста"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <input
              type="checkbox"
              id="edit-isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="edit-isActive" className="text-sm font-medium text-gray-900">
              Тест активен
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
