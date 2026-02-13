import { useEffect, useState } from 'react';
import { validateActivationToken } from '@/api/activate.api';
import { AxiosError } from 'axios';

interface UseTokenValidationResult {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
}

/**
 * Custom hook to validate activation token on component mount
 */
export function useTokenValidation(token: string | null): UseTokenValidationResult {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setError('No activation token found');
        setIsValidating(false);
        return;
      }

      try {
        setIsValidating(true);
        const response = await validateActivationToken(token);
        
        if (response.data.success) {
          setIsValid(true);
          setError(null);
        } else {
          setIsValid(false);
          setError(response.data.message || 'Invalid or expired token');
        }
      } catch (err) {
        setIsValid(false);
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || 'Token validation failed');
        } else {
          setError('Token validation failed');
        }
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [token]);

  return { isValidating, isValid, error };
}