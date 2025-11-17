import type { InferUITool } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';

const EditorCommandToolOutputSchema = z.object({
  nextEditorMarkdownContent: z.string().describe('The updated markdown content of the editor after command execution'),
  reason: z.string().optional().describe('Reason for failure, if applicable'),
  status: z.enum(['success', 'failure']).describe('Status of the command execution'),
  nextEditorRootChildren: z
    .string()
    .describe('A JSON string representing the updated structure of the editor root children after command execution'),
});

const InsertParagraphToolInputSchema = z.object({
  content: z.string().describe('Text content for the new paragraph'),
  location: z
    .object({
      anchorNodeKey: z.string().describe('The key of the node to anchor the new paragraph to'),
      method: z.literal('content'),
      position: z.enum(['before', 'after']).describe('Position relative to the anchor node'),
    })
    .describe('Position relative to the anchor node'),
});

const EditParagraphToolInputSchema = z.object({
  newText: z.string().describe('The new text content to replace the paragraph with'),
  nodeKey: z.string().describe('The key of the paragraph node to edit'),
  oldText: z.string().describe('The current text content of the paragraph to be replaced'),
});

const FormatTextToolInputSchema = z.object({
  format: z.enum(['bold', 'italic', 'underline', 'strikethrough', 'code']).describe('The text format to apply'),
  textPartToSelect: z.string().describe('The exact text part you want to format within the parent node'),
  parentNodeKey: z
    .string()
    .describe('Parent text node key that contains text part you want to format. This must be a TextNode key.'),
});

const insertParagraphTool = tool({
  description: 'Insert a new paragraph into the editor at a specified location',
  inputSchema: InsertParagraphToolInputSchema,
  outputSchema: EditorCommandToolOutputSchema,
});

const editParagraphTool = tool({
  description: 'Edit an existing paragraph in the editor',
  inputSchema: EditParagraphToolInputSchema,
  outputSchema: EditorCommandToolOutputSchema,
});

const formatTextTool = tool({
  description: 'Format a piece of text in the editor',
  inputSchema: FormatTextToolInputSchema,
  outputSchema: EditorCommandToolOutputSchema,
});

export type EditorCommandTools = {
  editParagraph: InferUITool<typeof editParagraphTool>;
  formatText: InferUITool<typeof formatTextTool>;
  insertParagraph: InferUITool<typeof insertParagraphTool>;
};

export const tools = {
  editParagraph: editParagraphTool,
  formatText: formatTextTool,
  insertParagraph: insertParagraphTool,
};

type InsertParagraphCommand = z.infer<typeof InsertParagraphToolInputSchema> & {
  type: 'insertParagraph';
};

type EditParagraphCommand = z.infer<typeof EditParagraphToolInputSchema> & {
  type: 'editParagraph';
};

type FormatTextCommand = z.infer<typeof FormatTextToolInputSchema> & {
  type: 'formatText';
};

export type EditorCommand = InsertParagraphCommand | EditParagraphCommand | FormatTextCommand;
