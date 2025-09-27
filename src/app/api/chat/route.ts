import { openai } from '@ai-sdk/openai';
import {
  streamText,
  stepCountIs,
  type UIMessage,
  convertToModelMessages,
} from 'ai';

import { tools } from '@/lib/models/editor-commands';
import wrapEditorPrompt from '@/lib/utils/wrap-editor-prompt';

export const maxDuration = 300;

type RequestBody = {
  editorMarkdownContent: string;
  editorRootChildren: string;
  messages: UIMessage[];
};

export async function POST(req: Request) {
  const { editorMarkdownContent, editorRootChildren, messages }: RequestBody =
    await req.json();

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: openai('gpt-4o'),
    stopWhen: stepCountIs(5),
    system: wrapEditorPrompt(editorMarkdownContent, editorRootChildren),
    tools,
  });

  return result.toUIMessageStreamResponse();
}
