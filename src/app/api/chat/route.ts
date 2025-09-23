import { openai } from '@ai-sdk/openai';
import type { UIMessage } from 'ai';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: openai('gpt-4o'),
  });

  return result.toUIMessageStreamResponse();
}
