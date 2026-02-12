"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, Settings, Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [username, setUsername] = useState("Admin User")
  const [email, setEmail] = useState("admin@example.com")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    const storedEmail = localStorage.getItem("email")
    if (storedUsername) setUsername(storedUsername)
    if (storedEmail) setEmail(storedEmail)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const avatarInitial = username.trim().charAt(0).toUpperCase() || "A"

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    // Add your logout/redirect logic here, e.g.:
    // router.push("/login")
    window.location.href = "/login"
  }

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#EEFBFF] flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-[#0E325D] hover:bg-[#EEFBFF]"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E325D]/60" />
          <input
            type="text"
            placeholder="Search..."
            className="
              h-10 w-64 rounded-lg
              bg-[#EEFBFF]
              border border-transparent
              pl-10 pr-4
              text-sm text-[#0E325D]
              placeholder:text-[#0E325D]/50
              focus:outline-none
              focus:ring-2 focus:ring-[#007CFC]
              transition-all
            "
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-[#EEFBFF]"
        >
          <Bell className="h-5 w-5 text-[#0E325D]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#007CFC]" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#EEFBFF]"
        >
          <Settings className="h-5 w-5 text-[#0E325D]" />
          <span className="sr-only">Settings</span>
        </Button> */}

        {/* Avatar with Dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-8 w-8 rounded-full bg-[#007CFC] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#007CFC] focus:ring-offset-2 transition-opacity hover:opacity-90"
          >
            <span className="text-sm font-medium text-white">{avatarInitial}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-[#EEFBFF] z-50 overflow-hidden">
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-[#EEFBFF]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#007CFC] flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-white">{avatarInitial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0E325D] truncate">{username}</p>
                    <p className="text-xs text-[#0E325D]/60 truncate">{email}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="py-1">
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#0E325D] hover:bg-[#EEFBFF] transition-colors"
                  onClick={() => { setDropdownOpen(false); window.location.href = "/profile" }}
                >
                  <User className="h-4 w-4 text-[#0E325D]/60" />
                  View Profile
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}