"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")
  const { status } = useSession()
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
    if (status === "authenticated") {
      router.push("/dashboard")
    } else if (!testId && status === "unauthenticated") {
      router.push("/")
    }
  }, [testId, router, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setToast({
          isOpen: true,
          message: "Неверный email или пароль",
          type: "error"
        })
      } else {
        setToast({
          isOpen: true,
          message: "Вход выполнен! Перенаправление...",
          type: "success"
        })
        
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      setToast({
        isOpen: true,
        message: "Произошла ошибка при входе",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="Okurmen"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="font-bold text-xl text-gray-900">Okurmen</span>
              </Link>
              <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#111f5e' }}>
              {t.loginTitle}
            </h1>
            <p style={{ color: '#111f5e', opacity: 0.7 }}>
              {t.loginDesc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder={t.enterPassword}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-6 py-4 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#f99703' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e08902')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f99703')}
            >
              {loading ? t.loggingIn : t.loginAndStart}
            </button>

            <p className="text-center text-sm mt-4" style={{ color: '#111f5e', opacity: 0.7 }}>
              {t.noAccount}{" "}
              <Link href={`/register?testId=${testId}`} className="font-semibold" style={{ color: '#f99703' }}>
                {t.register}
              </Link>
            </p>
          </form>
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
