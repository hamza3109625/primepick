// useActivation.ts
import { useState, useEffect } from 'react';
import { validateActivationToken, setPassword, SetPasswordRequest } from '@/api/activate.api';

interface UseActivationResult {
  // Token validation state
  isValidating: boolean;
  isValid: boolean;
  username: string | null;
  email: string | null;
  validationError: string | null;
  
  // Password setting state
  isLoading: boolean;
  passwordError: string | null;
  success: boolean;
  
  // Actions
  handleSetPassword: (password: string, confirmPassword: string) => Promise<void>;
  resetPasswordError: () => void;
}

/**
 * Combined hook to handle activation token validation and password setting
 * @param token - The activation token from URL parameters
 * @param onSuccess - Callback function to execute on successful password set
 * @returns Complete activation state and handler function
 */
export function useActivation(
  token: string | null,
  onSuccess?: () => void
): UseActivationResult {
  // Token validation state
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Password setting state
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate token on mount
  useEffect(() => {
    async function validate() {
      if (!token) {
        setValidationError('Invalid link - Token not found');
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateActivationToken(token);
        
        if (!result.valid) {
          throw new Error(result.message || 'Link is invalid or expired');
        }

        setIsValid(true);
        setUsername(result.username || null);
        setEmail(result.email || null);
        setValidationError(null);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Invalid or expired activation link';
        setValidationError(errorMessage);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    }

    validate();
  }, [token]);

  // Handle password setting
  const handleSetPassword = async (
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    if (!token) {
      setPasswordError('Invalid activation token');
      return;
    }

    // Client-side validation
    if (!password || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setPasswordError(null);

    try {
      const request: SetPasswordRequest = {
        token,
        password,
        confirmPassword,
      };

      await setPassword(request);
      
      setSuccess(true);
      
      // Execute success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create password. Please try again.';
      setPasswordError(errorMessage);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordError = () => {
    setPasswordError(null);
  };

  return {
    // Token validation
    isValidating,
    isValid,
    username,
    email,
    validationError,
    
    // Password setting
    isLoading,
    passwordError,
    success,
    
    // Actions
    handleSetPassword,
    resetPasswordError,
  };
}