import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Вход в админку - Okurmen",
  description: "Панель управления тестами",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
