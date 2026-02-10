import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  redirect("/admin/tests")
}
