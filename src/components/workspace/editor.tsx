'use client';

import { $convertFromMarkdownString } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Bold, Italic, Underline } from 'lucide-react';
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
          <Bold />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
        >
          <Italic />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
        >
          <Underline />
        </Button>
      </div>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div className="border-border has-[:focus]:border-ring has-[:focus]:ring-ring/50 h-[calc(100%-44px)] overflow-y-auto rounded-md border focus-visible:ring-[3px] has-[:focus]:ring-[3px]">
            <ContentEditable
              aria-placeholder="Enter some text..."
              className="rounded-md p-4 outline-none"
              placeholder={<div>Enter some text...</div>}
            />
          </div>
        }
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <MarkdownShortcutPlugin />
    </div>
  );
}
