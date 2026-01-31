"use client"

import React, { useState } from "react"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { cn } from "lib/utils"
import { X } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="
            fixed inset-0 z-40 lg:hidden
            bg-[#0E325D]/40
            backdrop-blur-sm
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:z-0 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative">
          <Sidebar />
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col bg-[#FFFFFF]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 bg-[#EEFBFF]">
          <div className="min-h-full rounded-xl bg-white p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
