import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { HeadingTagType } from '@lexical/rich-text';
import {
  isModifierMatch,
  KEY_DOWN_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import * as React from 'react';

import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
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
} from '@/lib/utils/editor-formatters';
import {
  isIndent,
  isOutdent,
  isLeftAlign,
  isLowercase,
  isSubscript,
  isUppercase,
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
    function keyboardShortcutsHandler(event: KeyboardEvent) {
      if (isModifierMatch(event, {})) {
        return false;
      } else if (isFormatParagraph(event)) {
        formatParagraph(editor);
      } else if (isFormatHeading(event)) {
        const { code } = event;
        const headingSize = `h${code[code.length - 1]}` as HeadingTagType;
        formatHeading(editor, toolbarState.blockType, headingSize);
      } else if (isFormatBulletList(event)) {
        formatBulletList(editor, toolbarState.blockType);
      } else if (isFormatNumberedList(event)) {
        formatNumberedList(editor, toolbarState.blockType);
      } else if (isFormatCheckList(event)) {
        formatCheckList(editor, toolbarState.blockType);
      } else if (isFormatCode(event)) {
        formatCode(editor, toolbarState.blockType);
      } else if (isFormatQuote(event)) {
        formatQuote(editor, toolbarState.blockType);
      } else if (isStrikeThrough(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      } else if (isLowercase(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase');
      } else if (isUppercase(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase');
      } else if (isCapitalize(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize');
      } else if (isIndent(event)) {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
      } else if (isOutdent(event)) {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
      } else if (isCenterAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      } else if (isLeftAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
      } else if (isRightAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
      } else if (isJustifyAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
      } else if (isSubscript(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      } else if (isSuperscript(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      } else if (isIncreaseFontSize(event)) {
        const currentSize = parseInt(toolbarState.fontSize) || 15;
        updateFontSize(editor, `${currentSize + 1}px`);
      } else if (isDecreaseFontSize(event)) {
        const currentSize = parseInt(toolbarState.fontSize) || 15;
        updateFontSize(editor, `${currentSize - 1}px`);
      } else if (isClearFormatting(event)) {
        clearFormatting(editor);
      } else {
        return false;
      }

      event.preventDefault();

      return true;
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
