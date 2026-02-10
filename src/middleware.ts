import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Защита админских роутов
  if (pathname.startsWith("/admin")) {
    // Разрешаем доступ к странице логина
    if (pathname === "/admin/login") {
      // Если уже залогинен как админ, редирект в админку
      if (isLoggedIn && userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
      return NextResponse.next()
    }

    // Для всех остальных админских страниц требуем авторизацию
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs"
}
