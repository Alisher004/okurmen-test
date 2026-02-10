"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, FileText, Clock, ChevronRight } from "lucide-react"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import Toast from "@/components/ui/Toast"
import EditTestModal from "@/components/admin/EditTestModal"

interface Test {
  id: string
  title: string
  description: string | null
  isActive: boolean
  questions: any[]
  _count: {
    testAttempts: number
  }
}

export default function TestsList({ tests: initialTests }: { tests: Test[] }) {
  const router = useRouter()
  const [tests, setTests] = useState(initialTests)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    testId: string
    testTitle: string
  }>({
    isOpen: false,
    testId: "",
    testTitle: ""
  })
  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    test: Test | null
  }>({
    isOpen: false,
    test: null
  })
  const [toast, setToast] = useState<{
    isOpen: boolean
    message: string
    type: "success" | "error"
  }>({
    isOpen: false,
    message: "",
    type: "success"
  })

  const openDeleteDialog = (testId: string, testTitle: string) => {
    setConfirmDialog({
      isOpen: true,
      testId,
      testTitle
    })
  }

  const closeDeleteDialog = () => {
    setConfirmDialog({
      isOpen: false,
      testId: "",
      testTitle: ""
    })
  }

  const openEditModal = (test: Test) => {
    setEditModal({
      isOpen: true,
      test
    })
  }

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      test: null
    })
  }

  const handleDelete = async () => {
    const { testId } = confirmDialog
    setDeleting(testId)

    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      setTests(tests.filter(t => t.id !== testId))
      setToast({
        isOpen: true,
        message: "Тест успешно удален!",
        type: "success"
      })
      closeDeleteDialog()
    } catch (error) {
      setToast({
        isOpen: true,
        message: "Ошибка при удалении теста",
        type: "error"
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleUpdate = async (data: { title: string; description: string; isActive: boolean }) => {
    if (!editModal.test) return

    setUpdating(editModal.test.id)

    try {
      const response = await fetch(`/api/admin/tests/${editModal.test.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to update")

      const updatedTest = await response.json()
      setTests(tests.map(t => t.id === updatedTest.id ? { ...t, ...updatedTest } : t))
      setToast({
        isOpen: true,
        message: "Тест успешно обновлен!",
        type: "success"
      })
      closeEditModal()
    } catch (error) {
      setToast({
        isOpen: true,
        message: "Ошибка при обновлении теста",
        type: "error"
      })
    } finally {
      setUpdating(null)
    }
  }

  if (tests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="text-blue-500" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Нет тестов
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Создайте первый тест для начала работы
          </p>
          <Link
            href="/admin/tests/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            Создать тест
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Main content - clickable */}
              <Link
                href={`/admin/tests/${test.id}/edit`}
                className="flex-1 flex items-center gap-4 min-w-0"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <FileText className="text-white" size={20} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {test.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                        test.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {test.isActive ? "Активен" : "Неактивен"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {test.questions.length} вопр.
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {test._count.testAttempts} попыток
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
              </Link>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    openEditModal(test)
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Редактировать информацию"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    openDeleteDialog(test.id, test.title)
                  }}
                  disabled={deleting === test.id}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Удалить"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Удалить тест?"
        message={`Вы уверены, что хотите удалить тест "${confirmDialog.testTitle}"? Это действие нельзя отменить.`}
        isLoading={deleting !== null}
      />

      {editModal.test && (
        <EditTestModal
          isOpen={editModal.isOpen}
          onClose={closeEditModal}
          onSave={handleUpdate}
          test={editModal.test}
          isLoading={updating !== null}
        />
      )}

      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </>
  )
}
