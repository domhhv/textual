import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { HeadingTagType } from '@lexical/rich-text';
import {
  $getSelection,
  isModifierMatch,
  KEY_DOWN_COMMAND,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import * as React from 'react';

import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import {
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
} from '@/lib/constants/initial-editor-toolbar-state';
import {
  formatCode,
  formatQuote,
  formatHeading,
  updateFontSize,
  clearFormatting,
  formatCheckList,
  formatParagraph,
  formatBulletList,
  formatNumberedList,
} from '@/lib/utils/editor-helpers';
import {
  isIndent,
  isOutdent,
  isLeftAlign,
  isLowercase,
  isSubscript,
  isUppercase,
  isInsertLink,
  isCapitalize,
  isFormatCode,
  isRightAlign,
  isCenterAlign,
  isFormatQuote,
  isSuperscript,
  isJustifyAlign,
  isFormatHeading,
  isStrikeThrough,
  isClearFormatting,
  isFormatCheckList,
  isFormatParagraph,
  isDecreaseFontSize,
  isFormatBulletList,
  isIncreaseFontSize,
  isFormatNumberedList,
} from '@/lib/utils/editor-shortcut-handlers';

export default function ShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = React.use(ToolbarStateContext);

  React.useEffect(() => {
    const shortcutHandlers = [
      {
        check: isFormatParagraph,
        execute: () => {
          return formatParagraph(editor);
        },
      },
      {
        check: isFormatHeading,
        execute: (event: KeyboardEvent) => {
          const headingSize = `h${event.code.slice(-1)}` as HeadingTagType;
          formatHeading(editor, toolbarState.blockType, headingSize);
        },
      },
      {
        check: isFormatBulletList,
        execute: () => {
          return formatBulletList(editor, toolbarState.blockType);
        },
      },
      {
        check: isFormatNumberedList,
        execute: () => {
          return formatNumberedList(editor, toolbarState.blockType);
        },
      },
      {
        check: isFormatCheckList,
        execute: () => {
          return formatCheckList(editor, toolbarState.blockType);
        },
      },
      {
        check: isFormatCode,
        execute: () => {
          return formatCode(editor, toolbarState.blockType);
        },
      },
      {
        check: isFormatQuote,
        execute: () => {
          return formatQuote(editor, toolbarState.blockType);
        },
      },
      {
        check: isStrikeThrough,
        execute: () => {
          return editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        },
      },
      {
        check: isLowercase,
        execute: () => {
          return editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase');
        },
      },
      {
        check: isUppercase,
        execute: () => {
          return editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase');
        },
      },
      {
        check: isCapitalize,
        execute: () => {
          return editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize');
        },
      },
      {
        check: isIndent,
        execute: () => {
          return editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        },
      },
      {
        check: isOutdent,
        execute: () => {
          return editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        },
      },
      {
        check: isCenterAlign,
        execute: () => {
          return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        },
      },
      {
        check: isLeftAlign,
        execute: () => {
          return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        },
      },
      {
        check: isRightAlign,
        execute: () => {
          return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        },
      },
      {
        check: isJustifyAlign,
        execute: () => {
          return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        },
      },
      {
        check: isSubscript,
        execute: () => {
          return editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        },
      },
      {
        check: isSuperscript,
        execute: () => {
          return editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        },
      },
      {
        check: isIncreaseFontSize,
        execute: () => {
          const currentSize = parseInt(toolbarState.fontSize, 10) || 15;
          const newSize = Math.min(currentSize + 1, MAX_ALLOWED_FONT_SIZE);
          updateFontSize(editor, `${newSize}px`);
        },
      },
      {
        check: isDecreaseFontSize,
        execute: () => {
          const currentSize = parseInt(toolbarState.fontSize, 10) || 15;
          const newSize = Math.max(currentSize - 1, MIN_ALLOWED_FONT_SIZE);
          updateFontSize(editor, `${newSize}px`);
        },
      },
      {
        check: isClearFormatting,
        execute: () => {
          return clearFormatting(editor);
        },
      },
      {
        check: isInsertLink,
        execute: () => {
          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              return;
            }

            if (toolbarState.isLink) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            } else {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
            }
          });
        },
      },
    ];

    function keyboardShortcutsHandler(event: KeyboardEvent) {
      if (isModifierMatch(event, {})) {
        return false;
      }

      const handler = shortcutHandlers.find((h) => {
        return h.check(event);
      });

      if (handler) {
        handler.execute(event);
        event.preventDefault();

        return true;
      }

      return false;
    }

    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      keyboardShortcutsHandler,
      COMMAND_PRIORITY_NORMAL
    );
  }, [
    editor,
    toolbarState.isLink,
    toolbarState.blockType,
    toolbarState.fontSize,
  ]);

  return null;
}
