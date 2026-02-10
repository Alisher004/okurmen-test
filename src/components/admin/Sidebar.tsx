"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FileText, BarChart3, LogOut } from "lucide-react"

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/admin/tests", label: "Тесты", icon: FileText },
    { href: "/admin/results", label: "Результаты", icon: BarChart3 }
  ]

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin/tests" className="flex items-center gap-3 mb-1 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Okurmen"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Okurmen</h1>
            <p className="text-xs text-gray-500">Админ Панель</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname?.startsWith(link.href)
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-white/20" 
                    : "bg-gray-100 group-hover:bg-blue-50"
                }`}>
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"} />
                </div>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full group"
        >
          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
            <LogOut size={18} className="text-gray-600 group-hover:text-red-600" />
          </div>
          <span className="font-medium text-sm">Выйти</span>
        </button>
      </div>
    </aside>
  )
}
