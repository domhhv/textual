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
import type { EditorState } from 'lexical';
import { FileWarningIcon } from 'lucide-react';
import * as React from 'react';

import FloatingLinkEditorPlugin from '@/components/editor/plugins/floating-link-editor-plugin';
import ShortcutsPlugin from '@/components/editor/plugins/shortcuts-plugin';
import ToolbarPlugin from '@/components/editor/plugins/toolbar-editor-plugin';
import { ChatStatusContext } from '@/components/providers/chat-status-provider';
import { useDocument } from '@/components/providers/document-provider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';
import $getNextEditorState from '@/lib/utils/get-next-editor-state';
import '@/lib/styles/editor-check-list.scss';
import { validateUrl } from '@/lib/utils/url';

export default function Editor() {
  const [isFocused, setIsFocused] = React.useState(false);
  const { status } = React.use(ChatStatusContext);
  const { activeDocument, setIsEditorEmpty: setIsDraftDocumentEmpty } = useDocument();
  const floatingAnchorRef = React.useRef<HTMLDivElement>(null);
  const [isEditorEmpty, setIsEditorEmpty] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsEditorEmpty(!activeDocument);
    }, 100);
  }, [activeDocument]);

  const logEditorChange = React.useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const children = JSON.parse($getNextEditorState().nextEditorRootChildren);
        const jsonString = JSON.stringify(editorState);
        const isEmpty = !activeDocument && children.length === 1 && children[0].nodeText === '';
        setIsEditorEmpty(isEmpty);
        setIsDraftDocumentEmpty(isEmpty);

        /* eslint-disable-next-line no-console */
        console.info('Editor State Updated: ', {
          children,
          editorState,
          jsonString,
        });
      });
    },
    [activeDocument, setIsDraftDocumentEmpty]
  );

  return (
    <div className="editor h-full">
      <ToolbarPlugin isEditorEmpty={isEditorEmpty} />
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div
            ref={floatingAnchorRef}
            className="border-border focus-within:border-foreground relative h-[calc(100%-52px)] overflow-y-auto border-t px-[1px] pb-[1px] focus-within:border focus-within:px-0 focus-within:pb-0.5"
          >
            <ContentEditable
              className="h-full p-4 outline-none"
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
            />
            {isFocused && (status === 'submitted' || status === 'streaming') && (
              <div className="absolute right-0 bottom-0 left-0 p-2">
                <Alert variant="destructive">
                  <FileWarningIcon />
                  <AlertTitle>Please don&apos; make edits to the document yet</AlertTitle>
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
      <OnChangePlugin onChange={logEditorChange} />
      <MarkdownShortcutPlugin transformers={ENHANCED_LEXICAL_TRANSFORMERS} />
      {floatingAnchorRef.current && <FloatingLinkEditorPlugin anchor={floatingAnchorRef.current} />}
    </div>
  );
}
