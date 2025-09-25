'use client';

import { useChat } from '@ai-sdk/react';
import { $convertToMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { UIMessage, UIDataTypes } from 'ai';
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { User as UserIcon, LoaderPinwheelIcon } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { TRANSFORMERS } from '@/lib/constants/editor.constants';
import type { EditorCommandTools } from '@/lib/models/editor-commands';
import cn from '@/lib/utils/cn';
import executeEditorCommand from '@/lib/utils/execute-editor-command';
import $getEditorRootChildren from '@/lib/utils/get-editor-root-children';

export default function Chat() {
  const [editor] = useLexicalComposerContext();
  const [input, setInput] = useState('');
  const { addToolResult, messages, sendMessage, status } = useChat<
    UIMessage<unknown, UIDataTypes, EditorCommandTools>
  >({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === 'insertParagraph') {
        executeEditorCommand(editor, {
          ...toolCall.input,
          type: 'insertParagraph',
        });

        void addToolResult({
          output: 'success',
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
        });
      }

      if (toolCall.toolName === 'editParagraph') {
        executeEditorCommand(editor, {
          ...toolCall.input,
          type: 'editParagraph',
        });

        void addToolResult({
          output: 'success',
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
        });
      }
    },
  });

  const submitMessage = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      editor.read(() => {
        const editorRootChildren = JSON.stringify($getEditorRootChildren());
        const editorMarkdownContent = $convertToMarkdownString(
          TRANSFORMERS,
          undefined,
          true
        );

        void sendMessage(
          { text: input },
          {
            body: {
              editorMarkdownContent,
              editorRootChildren,
            },
          }
        );
      });
      setInput('');
    },
    [input, editor, sendMessage]
  );

  return (
    <div className="flex h-full flex-col justify-between overflow-x-auto pr-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={cn(
                'whitespace-pre-wrap',
                message.role === 'user' &&
                  'border-foreground flex items-start gap-2 rounded-md border p-4'
              )}
            >
              {message.role === 'user' && (
                <div className="border-border bg-foreground rounded-full border p-1">
                  <UserIcon className="text-background" />
                </div>
              )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className={cn(message.role === 'user' && 'px-2')}
                      >
                        {part.text}
                      </div>
                    );

                  case 'tool-insertParagraph':
                    switch (part.state) {
                      case 'input-streaming':
                        return (
                          <div key={`${message.id}-${i}`}>
                            <b>Generating new paragraph...</b>
                            <br />
                            {part.input?.content}
                          </div>
                        );

                      case 'input-available':
                        return (
                          <div key={`${message.id}-${i}`}>
                            <b>Inserted new paragraph with content:</b>
                            <br />
                            {part.input.content}
                          </div>
                        );

                      case 'output-error':
                        return (
                          <div key={`${message.id}-${i}`}>
                            Error: {part.errorText}
                          </div>
                        );

                      case 'output-available':
                      default:
                        return (
                          <div key={`${message.id}-${i}`}>
                            <b>Inserted new paragraph with content:</b>
                            <br />
                            {part.input?.content}
                          </div>
                        );
                    }

                  case 'tool-editParagraph':
                    switch (part.state) {
                      case 'input-streaming':
                        return (
                          <div key={`${message.id}-${i}`}>
                            <b>
                              <i>Editing paragraph...</i>
                            </b>
                            <br />
                            <b>Current text:</b>
                            <br />
                            {part.input?.oldText}
                            <br />
                            <b>New text:</b>
                            <br />
                            {part.input?.newText}
                          </div>
                        );

                      case 'input-available':
                        return (
                          <div key={`${message.id}-${i}`}>
                            <b>
                              <i>Successfully edited paragraph.</i>
                            </b>
                            <br />
                            <b>Old text:</b> <br />
                            {part.input.oldText}
                            <br />
                            <b>New text:</b>
                            <br />
                            {part.input.newText}
                          </div>
                        );

                      case 'output-error':
                        return (
                          <div key={`${message.id}-${i}`}>
                            Error: {part.errorText}
                          </div>
                        );

                      case 'output-available':
                      default:
                        return (
                          <div key={`${message.id}-${i}`}>
                            <b>
                              <i>Successfully edited paragraph.</i>
                            </b>
                            <br />
                            <b>Old text:</b> <br />
                            {part.input?.oldText}
                            <br />
                            <b>New text:</b>
                            <br />
                            {part.input?.newText}
                          </div>
                        );
                    }
                }
              })}
            </div>
          );
        })}
        {status === 'submitted' && (
          <LoaderPinwheelIcon className="mx-auto animate-spin" />
        )}
      </div>

      <form className="mt-4" onSubmit={submitMessage}>
        <Input
          value={input}
          placeholder="Say something..."
          onChange={(e) => {
            return setInput(e.currentTarget.value);
          }}
        />
      </form>
    </div>
  );
}
