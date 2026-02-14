"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useActivation } from "@/hooks/useActivation";

export default function CreatePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use combined activation hook
 const {
  isValidating,
  isValid,
  username,
  email,
  validationError,
  isLoading,
  passwordError,
  success,
  handleSetPassword,
} = useActivation(token, () => {
  setTimeout(() => {
    const userRole = localStorage.getItem('roles');
    const loginPath = (userRole === 'ADMIN' || userRole === 'INTERNAL_USER') 
      ? '/login/admin' 
      : '/login';
    
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Validating activation link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if token validation failed
  if (!isValid || validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-red-900">
              Invalid Activation Link
            </CardTitle>
            <CardDescription className="text-center text-red-700">
              {validationError || "This activation link is invalid or has expired"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <Card className="w-full max-w-md border-green-200">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-green-900">
              Account Activated!
            </CardTitle>
            <CardDescription className="text-center text-green-700">
              Your password has been set successfully. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show password creation form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create Your Password
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Activating account for <span className="font-semibold">{username}</span>
          </CardDescription>
          {email && (
            <p className="text-center text-sm text-gray-500">{email}</p>
          )}
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
                  placeholder="Enter your password"
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
                  placeholder="Confirm your password"
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Password requirements:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contains uppercase and lowercase letters</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contains numbers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contains special characters</span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
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