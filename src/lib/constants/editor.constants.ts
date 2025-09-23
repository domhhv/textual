import { CodeNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import {
  CHECK_LIST,
  TRANSFORMERS as BASE_TRANSFORMERS,
} from '@lexical/markdown';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { QuoteNode, HeadingNode } from '@lexical/rich-text';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { LineBreakNode, type EditorThemeClasses } from 'lexical';
import { toast } from 'sonner';

import getErrorMessage from '@/lib/utils/get-error-message';

const theme: EditorThemeClasses = {
  hr: 'border-t border-slate-200',
  link: 'text-sky-500 underline hover:text-blue-600',
  paragraph: 'my-2',
  quote: 'italic text-slate-500 border-l-4 border-slate-500 pl-2',
  table: 'border-collapse border border-slate-200',
  tableCell: 'border border-slate-200 p-2',
  tableRow: 'border-t border-slate-200',
  heading: {
    h1: 'text-5xl font-(family-name:--font-ubuntu)',
    h2: 'text-4xl font-(family-name:--font-ubuntu)',
    h3: 'text-3xl font-(family-name:--font-ubuntu)',
    h4: 'text-2xl font-(family-name:--font-ubuntu)',
    h5: 'text-xl font-(family-name:--font-ubuntu)',
    h6: 'text-lg font-(family-name:--font-ubuntu)',
  },
  list: {
    listitem: 'mx-8',
    listitemChecked: 'editor-list-item-checked',
    listitemUnchecked: 'editor-list-item-unchecked',
    ol: 'list-decimal ml-4',
    ul: 'p-0 m-0 ml-4 list-disc',
    nested: {
      listitem: 'list-none',
    },
    olDepth: [
      'p-0 m-0 list-outside',
      'p-0 m-0 list-outside list-[upper-alpha]',
      'p-0 m-0 list-outside list-[lower-alpha]',
      'p-0 m-0 list-outside list-[upper-roman]',
      'p-0 m-0 list-outside list-[lower-roman]',
    ],
  },
  text: {
    bold: 'font-bold',
    capitalize: 'capitalize',
    code: 'font-mono bg-slate-100 text-slate-900 rounded px-1 py-0.5',
    highlight: 'bg-yellow-300',
    italic: 'italic',
    lowercase: 'lowercase',
    strikethrough: 'line-through',
    subscript: 'text-xs',
    superscript: 'text-xs',
    underline: 'underline',
    underlineStrikethrough: 'line-through underline',
    uppercase: 'uppercase',
  },
};

export const initialConfig: InitialConfigType = {
  namespace: 'MyEditor',
  theme,
  onError: (error) => {
    toast('An error occurred in the editor', {
      description: getErrorMessage(error),
    });
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    CodeNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    LineBreakNode,
    HorizontalRuleNode,
  ],
};

export const TRANSFORMERS = [CHECK_LIST, ...BASE_TRANSFORMERS];
