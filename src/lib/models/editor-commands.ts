import type { InferUITool } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';

const InsertParagraphToolInputSchema = z.object({
  content: z.string().describe('Text content for the new paragraph'),
  location: z
    .object({
      method: z.literal('content'),
      anchorNodeKey: z
        .string()
        .describe('The key of the node to anchor the new paragraph to'),
      position: z
        .enum(['before', 'after'])
        .describe('Position relative to the anchor node'),
    })
    .describe('Position relative to the anchor node'),
});

export const InsertParagraphTool = tool({
  description: 'Insert a new paragraph into the editor at a specified location',
  inputSchema: InsertParagraphToolInputSchema,
  outputSchema: z
    .enum(['success', 'failure'])
    .describe('Result of the insertion operation'),
});

type InsertParagraphCommand = z.infer<typeof InsertParagraphToolInputSchema> & {
  type: 'insertParagraph';
};

const EditParagraphToolInputSchema = z.object({
  nodeKey: z.string().describe('The key of the paragraph node to edit'),
  newText: z
    .string()
    .describe('The new text content to replace the paragraph with'),
  oldText: z
    .string()
    .describe('The current text content of the paragraph to be replaced'),
});

export const EditParagraphTool = tool({
  description: 'Edit an existing paragraph in the editor',
  inputSchema: EditParagraphToolInputSchema,
  outputSchema: z
    .enum(['success', 'failure'])
    .describe('Result of the edit operation'),
});

type EditParagraphCommand = z.infer<typeof EditParagraphToolInputSchema> & {
  type: 'editParagraph';
};

export type EditorCommand = InsertParagraphCommand | EditParagraphCommand;

export type EditorCommandTools = {
  editParagraph: InferUITool<typeof EditParagraphTool>;
  insertParagraph: InferUITool<typeof InsertParagraphTool>;
};
