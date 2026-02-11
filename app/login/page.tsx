import { Navbar } from "./components/navbar"
import { LoginForm } from "./components/login-form"
import { Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="flex flex-col items-center py-4 w-full max-w-4xl">
          {/* <div
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-[#007CFC]/30
              bg-[#EEFBFF]
              px-3 py-2
              text-[#0E325D]
            "
          >
            <Shield className="h-3 w-3 text-[#007CFC]" />
            <span className="text-xs font-semibold text-[#007CFC]">Secure Access</span>
          </div> */}
          
          <p className="text-foreground font-bold text-4xl mt-2">Prime - SFTP</p>

          <p className="text-foreground text-sm mt-2">Sign In to Manage SFTP Server and Client configuration securely</p>
          
          <div className="mt-12 w-full">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  )
}