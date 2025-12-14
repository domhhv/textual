export const maxDuration = 30;

type RequestBody = {
  apiKey: string;
};

export async function POST(req: Request) {
  const { apiKey }: RequestBody = await req.json();

  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return Response.json({ isValid: true });
  }

  return Response.json({
    error: (await response.json()).error?.message || 'Invalid API key',
    isValid: false,
  });
}
