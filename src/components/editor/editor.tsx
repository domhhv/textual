'use client';

import { $convertFromMarkdownString } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import '@/lib/styles/editor-check-list.scss';

import type { EditorState } from 'lexical';
import { FileWarningIcon } from 'lucide-react';
import * as React from 'react';

import FloatingLinkEditorPlugin from '@/components/editor/plugins/floating-link-editor-plugin';
import ShortcutsPlugin from '@/components/editor/plugins/shortcuts-plugin';
import ToolbarPlugin from '@/components/editor/plugins/toolbar-editor-plugin';
import { ChatStatusContext } from '@/components/providers/chat-status-provider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';
import $getNextEditorState from '@/lib/utils/get-next-editor-state';
import { validateUrl } from '@/lib/utils/url';

export default function Editor() {
  const [editor] = useLexicalComposerContext();
  const [isFocused, setIsFocused] = React.useState(false);
  const { status } = React.use(ChatStatusContext);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    React.useState<HTMLDivElement | null>(null);

  const onRef = React.useCallback((_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  }, []);

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

  const logEditorChange = React.useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const children = JSON.parse($getNextEditorState().nextEditorRootChildren);

      // eslint-disable-next-line no-console
      console.info('Editor State Updated: ', { children, editorState });
    });
  }, []);

  return (
    <div className="h-full">
      <ToolbarPlugin />
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div
            ref={onRef}
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
            {isFocused &&
              (status === 'submitted' || status === 'streaming') && (
                <div className="absolute right-0 bottom-0 left-0 p-2">
                  <Alert variant="destructive">
                    <FileWarningIcon />
                    <AlertTitle>
                      Please don&apos; make edits to the document yet
                    </AlertTitle>
                    <AlertDescription>
                      The editor content is managed by the AI at this moment.
                      Making manual edits may lead to unexpected behavior.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
          </div>
        }
      />
      <ListPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <HistoryPlugin />
      <ShortcutsPlugin />
      <AutoFocusPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <OnChangePlugin onChange={logEditorChange} />
      <MarkdownShortcutPlugin transformers={ENHANCED_LEXICAL_TRANSFORMERS} />
      {floatingAnchorElem && (
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
      )}
    </div>
  );
}
