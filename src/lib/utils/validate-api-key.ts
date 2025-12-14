export default async function validateApiKeyWithServer(
  apiKey: string,
  providerName: string
): Promise<{
  error?: string;
  isValid: boolean;
}> {
  try {
    const response = await fetch(`/api/validate-api-key/${providerName}`, {
      body: JSON.stringify({ apiKey }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { error: `Request failed with status ${response.status}`, isValid: false };
    }

    return await response.json();
  } catch {
    return { error: 'Network error', isValid: false };
  }
}
