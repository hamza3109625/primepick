"use client"

import { Bell, Search, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
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

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#EEFBFF]"
        >
          <Settings className="h-5 w-5 text-[#0E325D]" />
          <span className="sr-only">Settings</span>
        </Button>

        {/* Avatar */}
        <div className="ml-2 h-8 w-8 rounded-full bg-[#007CFC] flex items-center justify-center">
          <span className="text-sm font-medium text-white">A</span>
        </div>
      </div>
    </header>
  )
}
