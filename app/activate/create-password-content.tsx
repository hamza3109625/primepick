"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTokenValidation } from "@/hooks/useTokens";
import { setActivationPassword } from "@/api/activate.api";
import { AxiosError } from "axios";

export default function CreatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token from URL params or localStorage
  const [token, setToken] = useState<string | null>(null);

  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate token on mount
  const {
    isValidating,
    isValid,
    error: validationError,
  } = useTokenValidation(token);

  useEffect(() => {
    // Try to get token from URL params first, then localStorage
    const urlToken = searchParams.get("token");
    const storedToken = localStorage.getItem("activation_token");

    const activationToken = urlToken || storedToken;

    if (activationToken) {
      setToken(activationToken);
      // Store in localStorage if it came from URL
      if (urlToken) {
        localStorage.setItem("activation_token", urlToken);
      }
    }
  }, [searchParams]);

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Additional password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase) {
      setError("Password must contain both uppercase and lowercase letters");
      return false;
    }

    if (!hasNumber) {
      setError("Password must contain at least one number");
      return false;
    }

    if (!hasSpecialChar) {
      setError("Password must contain at least one special character");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    if (!token) {
      setError("No activation token found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await setActivationPassword({
        token,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        localStorage.removeItem("activation_token");

        router.push("/login");
      } else {
        setError(response.data.message || "Failed to set password");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Failed to create password. Please try again.",
        );
      } else {
        setError("Failed to create password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500">
                Validating activation link...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isValid || validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Invalid Activation Link
            </CardTitle>
            <CardDescription className="text-center">
              {validationError ||
                "This activation link is invalid or has expired"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
              variant="outline"
            >
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password creation form if token is valid
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create Password
          </CardTitle>
          <CardDescription className="text-center">
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
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
                  onChange={(e) => setPasswordValue(e.target.value)}
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

            <div className="text-sm text-gray-500 space-y-1">
              <p className="font-medium">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  At least 8 characters long
                </li>
                <li
                  className={
                    /[A-Z]/.test(password) && /[a-z]/.test(password)
                      ? "text-green-600"
                      : ""
                  }
                >
                  Contains uppercase and lowercase letters
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                  Contains numbers
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                      ? "text-green-600"
                      : ""
                  }
                >
                  Contains special characters
                </li>
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