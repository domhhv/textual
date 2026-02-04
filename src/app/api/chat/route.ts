import { createOpenAI } from '@ai-sdk/openai';
import { currentUser } from '@clerk/nextjs/server';
import { streamText, stepCountIs, type UIMessage, convertToModelMessages } from 'ai';

import { tools } from '@/lib/models/editor-commands';
import { decryptKey } from '@/lib/utils/encryption';
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
  const user = await currentUser();
  const { editorMarkdownContent, editorRootChildren, messages, model }: RequestBody = await req.json();

  const openaiApiKey = user?.privateMetadata.openaiApiKey;

  if (typeof openaiApiKey !== 'string' || openaiApiKey.length === 0) {
    return new Response('API key is required', { status: 400 });
  }

  const openaiProvider = createOpenAI({
    apiKey: decryptKey(openaiApiKey),
  });

  const result = streamText({
    messages: await convertToModelMessages(messages),
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
