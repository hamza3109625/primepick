"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

// API Configuration - Update this with your actual API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{
    text: string;
    type: "error" | "success" | "";
  }>({
    text: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Check for activation parameters on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const activated = url.searchParams.get("activated") === "1";

    if (activated) {
      setLoginMessage({
        text: "Account activated! Please log in to continue.",
        type: "success",
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setMessage = (text: string, type: "error" | "success" | "") => {
    setLoginMessage({ text, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("", "");
    setIsLoading(true);

    const { username, password } = formData;

    if (!username.trim() || !password) {
      setMessage("Please fill in username and password.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          role: "STANDARD_USER", // Fixed role as per your requirement
        }),
      });

      // ========== Login Failed ==========
      if (!res.ok) {
        let errorMsg = "Login failed.";

        try {
          const contentType = res.headers.get("Content-Type") || "";

          if (contentType.includes("application/json")) {
            const err = await res.json();

            // Handle ApiError structure
            if (err.code === "INVALID_CREDENTIALS") {
              errorMsg = "Invalid username or password.";
            } else if (err.message) {
              errorMsg = err.message;
            }
          } else {
            // Fallback if backend sent plain text
            const txt = await res.text();
            if (txt) errorMsg = txt;
          }
        } catch (e) {
          console.error("Failed to parse error response", e);
        }

        // Extra safety by status
        if (res.status === 401 && !errorMsg) {
          errorMsg = "Invalid username or password.";
        } else if (res.status >= 500) {
          errorMsg = "Server error. Please try again later.";
        }

        setMessage(errorMsg, "error");
        setIsLoading(false);
        return;
      }
      // ========== End Login Failed ==========

      const data = await res.json();

      // Parse roles
      const rolesStr = Array.isArray(data.roles)
        ? data.roles.join(",")
        : data.roles || data.role || "";

      // Store authentication data in localStorage
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("userid", data.userId ?? data.id ?? "");
      localStorage.setItem("username", data.username ?? username);
      localStorage.setItem("roles", rolesStr);
      localStorage.setItem("mobile", (data.mobile ?? "").trim());

      setMessage("Login successful. Redirecting…", "success");

      // Refresh topnav if the function exists (for compatibility with existing system)
      if (typeof (window as any).refreshTopnav === "function") {
        (window as any).refreshTopnav();
      }

      // Redirect to mobile validation after successful login
      setTimeout(() => {
        window.location.href = "/mobile-validation";
      }, 650);
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error during login.", "error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg border border-[#EEFBFF] grid grid-cols-1 md:grid-cols-[3.5fr_4fr]">
        {/* RIGHT – IMAGE PANEL */}
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
              <h2 className="text-sm">Security</h2>
              <p className="mt-1 text-md font-bold text-white">Role Based</p>
            </div>
            <div>
              <h2 className="text-sm">Sessions</h2>
              <p className="mt-1 text-md font-bold text-white">Token</p>
            </div>
            <div>
              <h2 className="text-sm">Region</h2>
              <p className="mt-1 text-md font-bold text-white">Canada</p>
            </div>
          </div>
        </div>

        {/* LEFT – FORM */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-[#0E325D]">Login</h1>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#007CFC]/30 bg-[#EEFBFF] px-3 py-2 text-[#0E325D]">
                <Lock className="h-3 w-3 text-[#007CFC]" />
                <span className="text-xs font-semibold text-[#007CFC]">
                  Green Secure
                </span>
              </div>
            </div>

            <p className="mt-1 text-sm text-[#0E325D]/60">
              Use your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            {/* Username/Email */}
            <div className="space-y-1.5">
              <Label className="text-sm text-[#0E325D]/80">
                Username / Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E325D]/40" />
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="h-11 pl-10 bg-[#EEFBFF] border border-transparent text-[#0E325D] placeholder:text-[#0E325D]/40 focus:border-[#007CFC] focus:ring-2 focus:ring-[#007CFC]/30"
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 bg-[#EEFBFF] border border-transparent text-[#0E325D] placeholder:text-[#0E325D]/40 focus:border-[#007CFC] focus:ring-2 focus:ring-[#007CFC]/30"
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

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-xs text-[#007CFC] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Message */}
            {loginMessage.text && (
              <div
                className={`text-sm font-semibold ${
                  loginMessage.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {loginMessage.text}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-lg bg-[#007CFC] text-white hover:bg-[#007CFC]/90 transition-all disabled:opacity-70 disabled:cursor-default"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-xs text-[#0E325D]/60">
              On successful login, token/roles are stored in localStorage and
              used by admin pages.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
