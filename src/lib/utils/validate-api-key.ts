export default async function validateApiKeyWithServer(
  apiKey: string,
  providerName: string
): Promise<{
  error?: string;
  isValid: boolean;
}> {
  const response = await fetch(`/api/validate-api-key/${providerName}`, {
    body: JSON.stringify({ apiKey }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}
