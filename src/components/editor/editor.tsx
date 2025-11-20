'use client';

import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { FileWarningIcon } from 'lucide-react';
import * as React from 'react';

import FloatingLinkEditorPlugin from '@/components/editor/plugins/floating-link-editor-plugin';
import ShortcutsPlugin from '@/components/editor/plugins/shortcuts-plugin';
import ToolbarPlugin from '@/components/editor/plugins/toolbar-editor-plugin';
import { ChatStatusContext } from '@/components/providers/chat-status-provider';
import { useDocument } from '@/components/providers/document-provider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';
import '@/lib/styles/editor-check-list.scss';
import { validateUrl } from '@/lib/utils/url';

export default function Editor() {
  const [isFocused, setIsFocused] = React.useState(false);
  const { status } = React.use(ChatStatusContext);
  const { handleEditorChange } = useDocument();
  const floatingAnchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="editor h-full">
      <ToolbarPlugin />
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div
            ref={floatingAnchorRef}
            className="border-border group focus-within:border-foreground relative h-[calc(100%-52px)] overflow-y-auto border-t px-[1px] pb-[1px] focus-within:border focus-within:px-0 focus-within:pb-0.5"
          >
            <ContentEditable
              className="h-full p-4 outline-none"
              aria-placeholder="Start typing your document..."
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              placeholder={
                <div className="text-muted-foreground/60 group-focus-within:text-muted-foreground pointer-events-none absolute top-[18px] left-5 select-none group-focus-within:left-[19px]">
                  Start typing your document...
                </div>
              }
            />
            {isFocused && (status === 'submitted' || status === 'streaming') && (
              <div className="absolute right-0 bottom-0 left-0 p-2">
                <Alert variant="destructive">
                  <FileWarningIcon />
                  <AlertTitle>Please don&apos;t make edits to the document yet</AlertTitle>
                  <AlertDescription>
                    The editor content is managed by the AI at this moment. Making manual edits may lead to unexpected
                    behavior.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        }
      />
      <ListPlugin />
      <HistoryPlugin />
      <ShortcutsPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <OnChangePlugin onChange={handleEditorChange} />
      <MarkdownShortcutPlugin transformers={ENHANCED_LEXICAL_TRANSFORMERS} />
      {/* eslint-disable-next-line react-hooks/refs */}
      {floatingAnchorRef.current && <FloatingLinkEditorPlugin anchor={floatingAnchorRef.current} />}
    </div>
  );
}
