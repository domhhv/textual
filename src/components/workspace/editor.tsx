'use client';

import { $convertFromMarkdownString } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { FORMAT_TEXT_COMMAND } from 'lexical';

import './check-list.scss';

import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { TRANSFORMERS } from '@/lib/constants/editor.constants';

export default function Editor() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    fetch('/sample-content.md')
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        editor.update(() => {
          $convertFromMarkdownString(text, TRANSFORMERS, undefined, true);
        });
      });
  }, [editor]);

  return (
    <div className="h-full space-y-2 p-4">
      <div className="space-x-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
        >
          <BoldIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
        >
          <ItalicIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
        >
          <UnderlineIcon />
        </Button>
      </div>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div className="border-border has-[:focus]:border-ring has-[:focus]:ring-ring/50 h-[calc(100%-44px)] overflow-y-auto rounded-md border focus-visible:ring-[3px] has-[:focus]:ring-[3px]">
            <ContentEditable className="rounded-md p-4 outline-none" />
          </div>
        }
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <CheckListPlugin />
      <ListPlugin />
      <TabIndentationPlugin />
      <MarkdownShortcutPlugin />
    </div>
  );
}
