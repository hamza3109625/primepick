"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

// API Configuration
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

  // Activation message
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
          role: "STANDARD_USER", // fixed role
        }),
      });

      if (!res.ok) {
        let errorMsg = "Login failed.";

        try {
          const contentType = res.headers.get("Content-Type") || "";
          if (contentType.includes("application/json")) {
            const err = await res.json();
            if (err.code === "INVALID_CREDENTIALS") {
              errorMsg = "Invalid username or password.";
            } else if (err.message) {
              errorMsg = err.message;
            }
          } else {
            const txt = await res.text();
            if (txt) errorMsg = txt;
          }
        } catch {}

        if (res.status >= 500) {
          errorMsg = "Server error. Please try again later.";
        }

        setMessage(errorMsg, "error");
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      const rolesStr = Array.isArray(data.roles)
        ? data.roles.join(",")
        : data.roles || data.role || "";

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("userid", data.userId ?? data.id ?? "");
      localStorage.setItem("username", data.username ?? username);
      localStorage.setItem("roles", rolesStr);
      localStorage.setItem("mobile", (data.mobile ?? "").trim());

      setMessage("Login successful. Redirecting…", "success");

      if (typeof (window as any).refreshTopnav === "function") {
        (window as any).refreshTopnav();
      }

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
    <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg border border-[#EEFBFF] grid grid-cols-1 md:grid-cols-[3.5fr_4fr]">
      {/* RIGHT – IMAGE */}
      <div
        className="relative hidden md:block"
        style={{
          backgroundImage: "url('/login.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E325D]/80 via-[#0E325D]/30 to-transparent" />

        <div className="absolute bottom-0 p-6 text-white flex justify-between w-full">
          <div>
            <h2 className="text-sm">Security</h2>
            <p className="mt-1 text-md font-bold">Role Based</p>
          </div>
          <div>
            <h2 className="text-sm">Sessions</h2>
            <p className="mt-1 text-md font-bold">Token</p>
          </div>
          <div>
            <h2 className="text-sm">Region</h2>
            <p className="mt-1 text-md font-bold">Canada</p>
          </div>
        </div>
      </div>

      {/* LEFT – FORM */}
      <div className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-[#0E325D]">Login</h1>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#007CFC]/30 bg-[#EEFBFF] px-3 py-2">
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[#0E325D]/80">
              Username / Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E325D]/40" />
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="h-11 pl-10 bg-[#EEFBFF] border border-transparent focus:border-[#007CFC] focus:ring-2 focus:ring-[#007CFC]/30"
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
                className="h-11 pl-10 pr-10 bg-[#EEFBFF] border border-transparent focus:border-[#007CFC] focus:ring-2 focus:ring-[#007CFC]/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E325D]/40"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

            {/* ROLE – DISPLAY ONLY */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[#0E325D]/80">Role</Label>
            <div className="relative h-11 flex items-center rounded-md bg-[#EEFBFF] border border-transparent px-3 pl-10 text-sm text-[#0E325D]">
              <Lock className="absolute left-3 h-4 w-4 text-[#0E325D]/40" />
              Admin
            </div>
          </div>

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

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full bg-[#007CFC] text-white"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
