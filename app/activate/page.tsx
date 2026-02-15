"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useActivation } from "@/hooks/useActivation";

// Separate the component that uses useSearchParams
function CreatePasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const {
  isValidating,
  isValid,
  username,
  email,
  userRole,
  validationError,
  isLoading,
  passwordError,
  success,
  handleSetPassword,
} = useActivation(token, () => {
  setTimeout(() => {
    // Use userRole from the hook instead of localStorage
    const loginPath =
      userRole === "ADMIN" || userRole === "INTERNAL_USER"
        ? "/login/admin"
        : "/login";
    const loginUrl = new URL(loginPath, window.location.origin);
    loginUrl.searchParams.set("activated", "1");
    loginUrl.searchParams.set("userType", userRole || "STANDARD_USER");
    router.push(loginUrl.toString());
  }, 1500);
});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSetPassword(password, confirmPassword);
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">
                Validating activation link...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if token validation failed
  if (!isValid || validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <XCircle className="h-6 w-6 text-red-600" />
              <CardTitle>Invalid Activation Link</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {validationError || "This activation link is invalid or has expired"}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
              variant="outline"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Activated!
                </h3>
                <p className="text-sm text-gray-600">
                  Your password has been set successfully. Redirecting to login...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password creation form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Password</CardTitle>
          <CardDescription>
            Activating account for <strong>{username}</strong>
            {email && (
              <span className="block text-sm text-gray-500 mt-1">{email}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password requirements:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains numbers</li>
                <li>• Contains special characters</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Password...
                </>
              ) : (
                "Create Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Main component with Suspense wrapper
export default function CreatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <CreatePasswordForm />
    </Suspense>
  );
}