"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  message: string
  type: "success" | "error"
}

export default function Toast({ isOpen, onClose, message, type }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
          type === "success"
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
            : "bg-gradient-to-r from-red-500 to-red-600 text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={24} />
        ) : (
          <XCircle size={24} />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
