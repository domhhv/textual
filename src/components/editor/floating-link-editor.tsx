'use client';

import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import type { LexicalEditor } from 'lexical';
import {
  XIcon,
  CheckIcon,
  PencilIcon,
  Trash2Icon,
  ExternalLinkIcon,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sanitizeUrl, validateUrl } from '@/lib/utils/url';

type FloatingLinkEditorProps = {
  anchorElem: HTMLElement;
  editor: LexicalEditor;
  isLink: boolean;
  linkUrl: string;
};

export default function FloatingLinkEditor({
  editor,
  isLink,
  linkUrl,
}: FloatingLinkEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [editedLinkUrl, setEditedLinkUrl] = React.useState(linkUrl);
  const [editMode, setEditMode] = React.useState(false);
  const [lastSelection, setLastSelection] = React.useState<Selection | null>(
    null
  );

  const handleClickOutside = React.useCallback(
    (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => {
          setEditMode(false);
          setEditedLinkUrl(linkUrl);
        }, 50);
      }
    },
    [linkUrl]
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  React.useEffect(() => {
    setEditedLinkUrl(linkUrl);

    if (linkUrl === 'https://') {
      setEditMode(true);
    }
  }, [linkUrl]);

  React.useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        setLastSelection(selection);
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  React.useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editMode]);

  function handleLinkEdit() {
    setEditMode(true);
  }

  function handleLinkSave() {
    if (lastSelection) {
      if (editedLinkUrl !== '') {
        if (validateUrl(editedLinkUrl)) {
          editor.update(() => {
            editor.dispatchCommand(
              TOGGLE_LINK_COMMAND,
              sanitizeUrl(editedLinkUrl)
            );
          });
        }
      } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }

      setEditMode(false);
    }
  }

  function handleLinkDelete() {
    editor.update(() => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    });
    setEditMode(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLinkSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setEditMode(false);
      setEditedLinkUrl(linkUrl);
    }
  }

  if (!isLink) {
    return null;
  }

  return (
    <div
      ref={editorRef}
      className="bg-background border-border shadow-popover absolute z-10 flex items-center gap-2 rounded-md border p-2"
    >
      {editMode ? (
        <>
          <Input
            type="text"
            ref={inputRef}
            value={editedLinkUrl}
            placeholder="Enter URL"
            className="h-8 min-w-60"
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setEditedLinkUrl(e.target.value);
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLinkSave}
            className="h-8 w-8 shrink-0"
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0"
            onClick={() => {
              setEditMode(false);
              setEditedLinkUrl(linkUrl);
            }}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex max-w-60 items-center gap-1 overflow-hidden text-sm hover:underline"
          >
            <span className="truncate">{linkUrl}</span>
            <ExternalLinkIcon className="h-3 w-3 shrink-0" />
          </a>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLinkEdit}
            className="h-8 w-8 shrink-0"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLinkDelete}
            className="h-8 w-8 shrink-0"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
