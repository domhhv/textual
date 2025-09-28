'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  removeApiKey,
  setEncryptedApiKey,
  getDecryptedApiKeyWithValidation,
} from '@/lib/utils/encrypted-storage';

interface ApiKeyContextType {
  apiKey: string | null;
  hasApiKey: boolean;
  setApiKey: (key: string) => void;
  removeApiKey: () => void;
  isLoading: boolean;
}

const ApiKeyContext = React.createContext<ApiKeyContextType | undefined>(
  undefined
);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    function loadApiKey() {
      try {
        const result = getDecryptedApiKeyWithValidation();

        if (result.success) {
          setApiKeyState(result.apiKey);
        } else {
          setApiKeyState(null);

          // Show appropriate toast notifications for different error types
          if (result.error && result.error !== 'not_found') {
            const errorMessages = {
              corrupted: 'API Key Corrupted',
              decryption_failed: 'API Key Decryption Failed',
              invalid_format: 'API Key Invalid Format',
            };

            const title = errorMessages[result.error] || 'API Key Error';

            toast.error(title, {
              action: {
                label: 'Clear',
                onClick: () => {
                  removeApiKey();
                  setApiKeyState(null);
                },
              },
              description:
                result.message || 'Your stored API key could not be loaded.',
            });
          }
        }
      } catch (error) {
        console.error('Failed to load API key:', error);
        setApiKeyState(null);

        toast.error('API Key Loading Failed', {
          description:
            'An unexpected error occurred while loading your API key.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadApiKey();
  }, []);

  const setApiKey = React.useCallback((key: string) => {
    try {
      setEncryptedApiKey(key);
      setApiKeyState(key);
    } catch (error) {
      console.error('Failed to set API key:', error);
      throw error;
    }
  }, []);

  const removeApiKeyHandler = React.useCallback(() => {
    try {
      removeApiKey();
      setApiKeyState(null);
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
  }, []);

  const value = React.useMemo(() => {
    return {
      apiKey,
      hasApiKey: Boolean(apiKey),
      isLoading,
      removeApiKey: removeApiKeyHandler,
      setApiKey,
    };
  }, [apiKey, setApiKey, removeApiKeyHandler, isLoading]);

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = React.useContext(ApiKeyContext);

  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }

  return context;
}
