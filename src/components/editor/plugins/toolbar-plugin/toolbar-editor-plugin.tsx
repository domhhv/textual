import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { REDO_COMMAND, UNDO_COMMAND, FORMAT_TEXT_COMMAND } from 'lexical';
import {
  BoldIcon,
  CodeIcon,
  UndoIcon,
  RedoIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
} from 'lucide-react';
import * as React from 'react';

import useToolbar from '@/components/editor/plugins/toolbar-plugin/use-toolbar';
import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import { Button } from '@/components/ui/button';

export default function ToolbarEditorPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = React.use(ToolbarStateContext);
  useToolbar();

  return (
    <div className="border-border flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 p-2 md:flex-nowrap md:overflow-x-auto">
      <Button
        size="icon"
        variant="ghost"
        disabled={!toolbarState.canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <UndoIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        disabled={!toolbarState.canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <RedoIcon />
      </Button>

      <div className="h-6 border-l border-[#EEF0F2]" />

      <Button
        size="icon"
        variant={toolbarState.isBold ? 'secondary' : 'ghost'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      >
        <BoldIcon />
      </Button>
      <Button
        size="icon"
        variant={toolbarState.isItalic ? 'secondary' : 'ghost'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      >
        <ItalicIcon />
      </Button>
      <Button
        size="icon"
        variant={toolbarState.isUnderline ? 'secondary' : 'ghost'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
      >
        <UnderlineIcon />
      </Button>
      <Button
        size="icon"
        variant={toolbarState.isStrikethrough ? 'secondary' : 'ghost'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
      >
        <StrikethroughIcon />
      </Button>
      <Button
        size="icon"
        variant={toolbarState.isCode ? 'secondary' : 'ghost'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
      >
        <CodeIcon />
      </Button>
    </div>
  );
}
