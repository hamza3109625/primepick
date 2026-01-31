"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <>
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg border border-[#EEFBFF] grid grid-cols-1 md:grid-cols-[3.5fr_4fr]">
        <div
          className="relative hidden md:block"
          style={{
            backgroundImage: "url('/login.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E325D]/80 via-[#0E325D]/30 to-transparent" />

          {/* Bottom Text */}
          <div className="absolute bottom-0 p-6 text-white flex justify-between w-full">
            <div>
                <h2 className="text-sm ">Security</h2>
            <p className="mt-1 text-md font-bold text-white">
              Role Based
            </p>
            </div>
            <div>
                <h2 className="text-sm ">Sessions</h2>
            <p className="mt-1 text-md font-bold text-white">
              Token
            </p>
            </div>
            <div>
                <h2 className="text-sm">Region</h2>
            <p className="mt-1 text-md font-bold text-white">
            Canada
            </p>
            </div>
            
          </div>
        </div>

        {/* LEFT – FORM */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-[#0E325D]">
                Login
              </h1>
              <div
                className="
              inline-flex items-center gap-2
              rounded-full
              border border-[#007CFC]/30
              bg-[#EEFBFF]
              px-3 py-2
              text-[#0E325D]
            "
              >
                <Lock className="h-3 w-3 text-[#007CFC]" />
                <span className="text-xs font-semibold text-[#007CFC]">Green Secure</span>
              </div>
            </div>

            <p className="mt-1 text-sm text-[#0E325D]/60">
              Use your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role (Disabled Dropdown Look) */}
            <div className="space-y-1.5">
              <Label className="text-sm text-[#0E325D]/80">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E325D]/40" />
                <Input
                  disabled
                  value="Admin"
                  className="
                  h-11 pl-10
                  bg-[#F3F9FC]
                  border border-dashed border-[#007CFC]/30
                  text-[#0E325D]
                  cursor-not-allowed
                "
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm text-[#0E325D]/80">
                Username / Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E325D]/40" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="
                  h-11 pl-10
                  bg-[#EEFBFF]
                  border border-transparent
                  text-[#0E325D]
                  placeholder:text-[#0E325D]/40
                  focus:border-[#007CFC]
                  focus:ring-2 focus:ring-[#007CFC]/30
                "
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm text-[#0E325D]/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E325D]/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="
                  h-11 pl-10 pr-10
                  bg-[#EEFBFF]
                  border border-transparent
                  text-[#0E325D]
                  placeholder:text-[#0E325D]/40
                  focus:border-[#007CFC]
                  focus:ring-2 focus:ring-[#007CFC]/30
                "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E325D]/40 hover:text-[#0E325D]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="text-right">
              <a href="#" className="text-xs text-[#007CFC] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
              h-11 w-full rounded-lg
              bg-[#007CFC]
              text-white
              hover:bg-[#007CFC]/90
              transition-all
            "
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-[#0E325D]/60">On successful login, token/roles will be stored in localStorage and used by admin pages</p>
          </form>
        </div>
      </div>
    </>
  );
}
