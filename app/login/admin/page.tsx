import { Navbar } from "../admin/components/navbar"
import { LoginForm } from "../admin/components/login-form"
import { Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="flex flex-col items-center py-4 w-full max-w-4xl">
          
          <p className="text-foreground font-bold text-4xl mt-2">Prime - SFTP</p>

          <p className="text-foreground text-sm mt-1">Sign In to Manage SFTP Server and Client configuration securely</p>
          
          <div className="mt-12 w-full">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  )
}