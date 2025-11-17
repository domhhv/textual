export const maxDuration = 30;

type RequestBody = {
  apiKey: string;
};

export async function POST(req: Request) {
  try {
    const { apiKey }: RequestBody = await req.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return Response.json({ error: 'API key is required', isValid: false }, { status: 400 });
    }

    if (!apiKey.startsWith('sk-')) {
      return Response.json({ error: 'API key should start with "sk-"', isValid: false }, { status: 400 });
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return Response.json({ isValid: true });
      } else if (response.status === 401) {
        return Response.json({
          error: 'Invalid API key or unauthorized',
          isValid: false,
        });
      } else if (response.status === 429) {
        return Response.json({
          error: 'Rate limit exceeded - key may still be valid',
          isValid: false,
        });
      } else if (response.status === 403) {
        return Response.json({
          error: 'API key lacks required permissions',
          isValid: false,
        });
      } else {
        return Response.json({
          error: `API returned status ${response.status}`,
          isValid: false,
        });
      }
    } catch (error) {
      console.error('API key validation error:', error);

      return Response.json({
        error: 'Failed to validate API key with OpenAI',
        isValid: false,
      });
    }
  } catch (error) {
    console.error('Validation endpoint error:', error);

    return Response.json({ error: 'Internal server error', isValid: false }, { status: 500 });
  }
}
