"use client"

import { useState } from "react"
import { Menu, X, LogOut, FileText, User } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "./LanguageSwitcher"

interface MobileMenuProps {
  userName?: string
  isAuthenticated: boolean
}

export default function MobileMenu({ userName, isAuthenticated }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
    setIsOpen(false)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors"
        style={{ color: '#111f5e' }}
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 right-0 w-64 bg-white shadow-lg rounded-bl-2xl z-50 border-l border-b border-gray-200">
            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f99703' }}>
                    <User className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: '#111f5e' }}>
                      {userName}
                    </p>
                  </div>
                </div>
                <LanguageSwitcher />
              </div>

              {/* Menu Items */}
              <Link
                href="/my-results"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: '#111f5e' }}
              >
                <FileText size={20} />
                <span className="font-medium">{t.myResults}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: '#111f5e' }}
              >
                <LogOut size={20} />
                <span className="font-medium">{t.logout}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}