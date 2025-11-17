import CryptoJS from 'crypto-js';

import checkOpenAIKey from './check-openai-key';

const STORAGE_KEY = 'editor_assistant_api_key';
const SECRET_KEY = 'editor_assistant_secret_2025';

export interface DecryptionResult {
  success: boolean;
  apiKey: string | null;
  error?: 'not_found' | 'decryption_failed' | 'invalid_format' | 'corrupted';
  message?: string;
}

export function setEncryptedApiKey(apiKey: string) {
  try {
    const encrypted = CryptoJS.AES.encrypt(apiKey, SECRET_KEY).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Failed to encrypt and store API key:', error);
    throw new Error('Failed to store API key');
  }
}

export function getDecryptedApiKeyWithValidation(): DecryptionResult {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);

    if (!encrypted) {
      return { apiKey: null, error: 'not_found', success: false };
    }

    let decrypted: string;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      decrypted = bytes.toString(CryptoJS.enc.Utf8);
    } catch (decryptError) {
      console.error('Decryption failed:', decryptError);

      return {
        apiKey: null,
        error: 'decryption_failed',
        message: 'Failed to decrypt stored API key. The stored data may be corrupted.',
        success: false,
      };
    }

    if (!decrypted) {
      return {
        apiKey: null,
        error: 'corrupted',
        message: 'Stored API key appears to be corrupted or was encrypted with a different key.',
        success: false,
      };
    }

    const validation = checkOpenAIKey(decrypted);

    if (!validation.ok) {
      return {
        apiKey: null,
        error: 'invalid_format',
        message: 'Stored API key has invalid format. It may have been corrupted.',
        success: false,
      };
    }

    return { apiKey: decrypted, success: true };
  } catch (error) {
    console.error('Failed to decrypt API key:', error);

    return {
      apiKey: null,
      error: 'decryption_failed',
      message: 'An unexpected error occurred while retrieving the API key.',
      success: false,
    };
  }
}

export function removeApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove API key:', error);
  }
}
