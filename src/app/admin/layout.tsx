import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/admin/Sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Админ Панель - Okurmen",
  description: "Панель управления тестами и результатами",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin-login")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        onLogout={async () => {
          "use server"
          await signOut({ redirectTo: "/admin-login" })
        }}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
