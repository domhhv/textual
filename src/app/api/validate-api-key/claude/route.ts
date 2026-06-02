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

  const response = await fetch(`https://api.anthropic.com/v1/models`, {
    headers: {
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  });

  if (response.ok) {
    return Response.json({ isValid: true });
  }

  let errorMessage = 'Invalid API key';

  try {
    const data = await response.json();
    const apiErrorMessage = data.error?.message?.includes('x-api-key') ? 'Invalid API key' : data.error.message;
    errorMessage = apiErrorMessage || errorMessage;
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
