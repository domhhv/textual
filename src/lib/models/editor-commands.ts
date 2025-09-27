import type { InferUITool } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';

const EditorCommandOutputSchema = z.object({
  reason: z.string().optional().describe('Reason for failure, if applicable'),
  nextEditorMarkdownContent: z
    .string()
    .describe(
      'The updated markdown content of the editor after command execution'
    ),
  nextEditorRootChildren: z
    .string()
    .describe(
      'A JSON string representing the updated structure of the editor root children after command execution'
    ),
  status: z
    .enum(['success', 'failure'])
    .describe('Status of the command execution'),
});

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

const EditParagraphToolInputSchema = z.object({
  nodeKey: z.string().describe('The key of the paragraph node to edit'),
  newText: z
    .string()
    .describe('The new text content to replace the paragraph with'),
  oldText: z
    .string()
    .describe('The current text content of the paragraph to be replaced'),
});

const insertParagraphTool = tool({
  description: 'Insert a new paragraph into the editor at a specified location',
  inputSchema: InsertParagraphToolInputSchema,
  outputSchema: EditorCommandOutputSchema,
});

const editParagraphTool = tool({
  description: 'Edit an existing paragraph in the editor',
  inputSchema: EditParagraphToolInputSchema,
  outputSchema: EditorCommandOutputSchema,
});

export type EditorCommandTools = {
  editParagraph: InferUITool<typeof editParagraphTool>;
  insertParagraph: InferUITool<typeof insertParagraphTool>;
};

export const tools = {
  editParagraph: editParagraphTool,
  insertParagraph: insertParagraphTool,
};

type InsertParagraphCommand = z.infer<typeof InsertParagraphToolInputSchema> & {
  type: 'insertParagraph';
};

type EditParagraphCommand = z.infer<typeof EditParagraphToolInputSchema> & {
  type: 'editParagraph';
};

export type EditorCommand = InsertParagraphCommand | EditParagraphCommand;
