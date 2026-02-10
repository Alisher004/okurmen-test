"use client"

import { useLanguage } from '@/contexts/LanguageContext'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Languages size={18} style={{ color: '#111f5e', opacity: 0.7 }} />
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
          language === 'ru'
            ? 'text-white'
            : 'hover:bg-gray-100'
        }`}
        style={{
          backgroundColor: language === 'ru' ? '#f99703' : 'transparent',
          color: language === 'ru' ? '#ffffff' : '#111f5e',
          opacity: language === 'ru' ? 1 : 0.7
        }}
      >
        РУС
      </button>
      <button
        onClick={() => setLanguage('ky')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
          language === 'ky'
            ? 'text-white'
            : 'hover:bg-gray-100'
        }`}
        style={{
          backgroundColor: language === 'ky' ? '#f99703' : 'transparent',
          color: language === 'ky' ? '#ffffff' : '#111f5e',
          opacity: language === 'ky' ? 1 : 0.7
        }}
      >
        КЫР
      </button>
    </div>
  )
}
