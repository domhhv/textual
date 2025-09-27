import type { InferUITool } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';

const EditorCommandToolOutputSchema = z.object({
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

const GetAllTextNodesToolInputSchema = z.object({
  nodeKey: z.string().describe('The key of the node to get text nodes from'),
});

const GetAllTextNodesToolOutputSchema = z
  .array(
    z
      .object({
        key: z.string().describe('The key of the text node'),
        text: z.string().describe('The text content of the text node'),
      })
      .describe('All child text nodes of the requested node')
  )
  .or(
    EditorCommandToolOutputSchema.omit({
      nextEditorMarkdownContent: true,
      nextEditorRootChildren: true,
    })
  );

export type GetAllTextNodesToolOutput = z.infer<
  typeof GetAllTextNodesToolOutputSchema
>;

const SetRangeSelectionToolInputSchema = z.object({
  parentNodeKey: z
    .string()
    .describe(
      'Parent text node key that contains text part you want to select. This must be a TextNode key.'
    ),
  textPartToSelect: z
    .string()
    .describe('The exact text part you want to select within the parent node'),
});

const FormatTextToolInputSchema = z.object({
  format: z
    .enum(['bold', 'italic', 'underline', 'strikethrough'])
    .describe('The text format to apply'),
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

const getAllTextNodesTool = tool({
  inputSchema: GetAllTextNodesToolInputSchema,
  outputSchema: GetAllTextNodesToolOutputSchema,
  description:
    'Get all child TextNodes of a specified node in the editor by its key',
});

const setRangeSelectionTool = tool({
  inputSchema: SetRangeSelectionToolInputSchema,
  outputSchema: EditorCommandToolOutputSchema,
  description:
    'Set a RangeSelection in the editor given anchor and focus points',
});

const formatTextTool = tool({
  description: 'Format the currently selected text in the editor',
  inputSchema: FormatTextToolInputSchema,
  outputSchema: EditorCommandToolOutputSchema,
});

export type EditorCommandTools = {
  editParagraph: InferUITool<typeof editParagraphTool>;
  formatText: InferUITool<typeof formatTextTool>;
  getAllTextNodes: InferUITool<typeof getAllTextNodesTool>;
  insertParagraph: InferUITool<typeof insertParagraphTool>;
  setRangeSelection: InferUITool<typeof setRangeSelectionTool>;
};

export const tools = {
  editParagraph: editParagraphTool,
  formatText: formatTextTool,
  getAllTextNodes: getAllTextNodesTool,
  insertParagraph: insertParagraphTool,
  setRangeSelection: setRangeSelectionTool,
};

type InsertParagraphCommand = z.infer<typeof InsertParagraphToolInputSchema> & {
  type: 'insertParagraph';
};

type EditParagraphCommand = z.infer<typeof EditParagraphToolInputSchema> & {
  type: 'editParagraph';
};

type SetRangeSelectionCommand = z.infer<
  typeof SetRangeSelectionToolInputSchema
> & {
  type: 'setRangeSelection';
};

type FormatTextCommand = z.infer<typeof FormatTextToolInputSchema> & {
  type: 'formatText';
};

export type EditorCommand =
  | InsertParagraphCommand
  | EditParagraphCommand
  | SetRangeSelectionCommand
  | FormatTextCommand;
