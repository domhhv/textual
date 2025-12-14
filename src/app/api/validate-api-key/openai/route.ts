import { auth } from '@clerk/nextjs/server';

export const maxDuration = 30;

type RequestBody = {
  apiKey: string;
};

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  let errorMessage = 'Invalid API key';

  try {
    const data = await response.json();
    errorMessage = data.error?.message || errorMessage;
  } catch {
    try {
      const text = await response.text();
      errorMessage = text || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
  }

  return Response.json({
    error: errorMessage,
    isValid: false,
    status: response.status,
  });
}
