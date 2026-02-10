"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { User, Phone, Calendar, Mail, Lock } from "lucide-react"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          age: parseInt(age),
          password,
          testId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации")
      }

      // Automatically sign in after registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error("Ошибка автоматического входа")
      }

      setToast({
        isOpen: true,
        message: "Регистрация успешна! Перенаправление...",
        type: "success"
      })

      setTimeout(() => {
        if (testId) {
          router.push(`/test/${testId}`)
        } else {
          router.push("/dashboard")
        }
      }, 1500)
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.message || "Ошибка при регистрации",
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
              {t.registration}
            </h1>
            <p style={{ color: '#111f5e', opacity: 0.7 }}>
              {t.registrationDesc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.fullName} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder={t.fullNamePlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.email} *
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
                <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.phone} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder={t.phonePlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.age} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="number"
                    id="age"
                    required
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder="18"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#111f5e' }}>
                  {t.password} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all"
                    style={{ 
                      color: '#111f5e',
                      outlineColor: '#f99703'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f99703'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder={t.minChars}
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
              {loading ? t.registering : t.registerAndStart}
            </button>

            <p className="text-center text-sm mt-4" style={{ color: '#111f5e', opacity: 0.7 }}>
              {t.haveAccount}{" "}
              <Link href={testId ? `/login?testId=${testId}` : "/login"} className="font-semibold" style={{ color: '#f99703' }}>
                {t.login}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#f99703' }}></div>
          <p style={{ color: '#111f5e', opacity: 0.7 }}>Загрузка...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
