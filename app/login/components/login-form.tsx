"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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

  const loginMutation = useLogin();

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

    const { username, password } = formData;

    if (!username.trim() || !password) {
      setMessage("Please fill in username and password.", "error");
      return;
    }

    loginMutation.mutate(
      {
        username: username.trim(),
        password,
        role: "INTERNAL_USER",
      },
      {
        onSuccess: () => {
          setMessage("Login successful. Redirecting…", "success");
        },
        onError: (error: any) => {
          let errorMsg = "Login failed.";

          if (error.response) {
            const { status, data } = error.response;

            if (data?.code === "INVALID_CREDENTIALS") {
              errorMsg = "Invalid username or password.";
            } else if (data?.message) {
              errorMsg = data.message;
            } else if (status >= 500) {
              errorMsg = "Server error. Please try again later.";
            }
          } else if (error.request) {
            errorMsg = "Network error. Please check your connection.";
          } else {
            errorMsg = "Unexpected error during login.";
          }

          setMessage(errorMsg, "error");
        },
      },
    );
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
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#007CFC]/30 bg-[#EEFBFF] px-3 py-2">
              <Lock className="h-3 w-3 text-[#007CFC]" />
              <span className="text-xs font-semibold text-[#007CFC]">
                Green Secure
              </span>
            </div> */}
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
                disabled={loginMutation.isPending}
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
                disabled={loginMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E325D]/40"
                disabled={loginMutation.isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
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
            disabled={loginMutation.isPending}
            className="h-11 w-full bg-[#007CFC] text-white"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>

          {/* Footer */}
          <footer className="pt-6 border-t border-[#0E325D]/10">
            <div className="text-center space-y-3">
              <div className="text-xs text-[#0E325D]/60">
                &copy; 2026{" "}
                <a
                  href="#"
                  className="text-[#007CFC] hover:underline font-medium"
                >
                  Mazume Solutions Inc.
                </a>
                . All Rights Reserved.
              </div>
              <div className="flex items-center justify-center gap-4 text-xs">
                <a
                  href="#"
                  className="text-[#007CFC] hover:underline font-medium"
                >
                  Privacy Policy
                </a>
                <span className="text-[#0E325D]/30">|</span>
                <a
                  href="#"
                  className="text-[#007CFC] hover:underline font-medium"
                >
                  Terms of Service
                </a>
                <span className="text-[#0E325D]/30">|</span>
                <a
                  href="#"
                  className="text-[#007CFC] hover:underline font-medium"
                >
                  Help
                </a>
              </div>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}