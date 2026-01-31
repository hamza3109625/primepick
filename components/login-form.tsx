"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-foreground/80">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-12 bg-input pl-10 text-foreground placeholder:text-muted-foreground/60"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-foreground/80">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-12 bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground/60"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-input text-primary accent-primary"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <a
            href="#"
            className="text-primary transition-colors hover:text-primary/80"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <a
          href="#"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Create one
        </a>
      </p>
    </div>
  )
}
