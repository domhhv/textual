export default async function validateApiKeyWithServer(apiKey: string): Promise<{
  error?: string;
  isValid: boolean;
}> {
  try {
    const response = await fetch('/api/validate-key', {
      body: JSON.stringify({ apiKey }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Server validation error:', error);

    return { error: 'Failed to validate API key with server', isValid: false };
  }
}
