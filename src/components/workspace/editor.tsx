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

import '@/lib/styles/check-list.scss';

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { ChatStatusContext } from '@/components/workspace/chat-status-provider';
import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';

export default function Editor() {
  const [editor] = useLexicalComposerContext();
  const [isFocused, setIsFocused] = React.useState(false);
  const { status } = React.use(ChatStatusContext);

  React.useEffect(() => {
    fetch('/sample-content.md')
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        editor.update(() => {
          $convertFromMarkdownString(
            text,
            ENHANCED_LEXICAL_TRANSFORMERS,
            undefined,
            true
          );
        });
      });
  }, [editor]);

  return (
    <div className="h-full p-4 pl-2">
      <div className="border-border space-x-2 rounded-t-md border border-b-0 p-2">
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
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          }}
        >
          <StrikethroughIcon />
        </Button>
      </div>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div className="border-border has-[:focus]:border-ring has-[:focus]:ring-ring/50 relative h-[calc(100%-52px)] overflow-y-auto rounded-b-md border focus-visible:ring-[3px] has-[:focus]:ring-[3px]">
            <ContentEditable
              className="rounded-b-md p-4 outline-none"
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
            />
            {isFocused &&
              (status === 'submitted' || status === 'streaming') && (
                <div className="absolute right-0 bottom-0 left-0 px-3 py-2">
                  <p className="text-red-500">
                    Please do not edit the document while AI is working...
                  </p>
                </div>
              )}
          </div>
        }
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <CheckListPlugin />
      <ListPlugin />
      <TabIndentationPlugin />
      <MarkdownShortcutPlugin transformers={ENHANCED_LEXICAL_TRANSFORMERS} />
    </div>
  );
}
