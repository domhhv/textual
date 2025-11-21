import { createOpenAI } from '@ai-sdk/openai';
import { streamText, stepCountIs, type UIMessage, convertToModelMessages } from 'ai';

import { tools } from '@/lib/models/editor-commands';
import wrapEditorPrompt from '@/lib/utils/wrap-editor-prompt';

export const maxDuration = 300;

type RequestBody = {
  apiKey?: string;
  editorMarkdownContent: string;
  editorRootChildren: string;
  messages: UIMessage[];
  model: string;
};

export async function POST(req: Request) {
  const { apiKey, editorMarkdownContent, editorRootChildren, messages, model }: RequestBody = await req.json();

  const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return new Response('API key is required', { status: 400 });
  }

  const openaiProvider = createOpenAI({
    apiKey: openaiApiKey,
  });

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: openaiProvider(model),
    stopWhen: stepCountIs(5),
    system: wrapEditorPrompt(editorMarkdownContent, editorRootChildren),
    tools,
    experimental_telemetry: {
      isEnabled: true,
      recordInputs: true,
      recordOutputs: true,
    },
  });

  return result.toUIMessageStreamResponse();
}
