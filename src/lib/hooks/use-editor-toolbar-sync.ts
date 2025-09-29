import { ListNode, $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isTableSelection } from '@lexical/table';
import {
  mergeRegister,
  $findMatchingParent,
  $getNearestNodeOfType,
} from '@lexical/utils';
import type { LexicalNode } from 'lexical';
import {
  $getSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import * as React from 'react';

import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import { blockTypeToBlockName } from '@/lib/constants/initial-editor-toolbar-state';

function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === 'root'
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent();

          return parent !== null && $isRootOrShadowRoot(parent);
        });

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow();
  }

  return topLevelElement;
}

export default function useEditorToolbarSync() {
  const [editor] = useLexicalComposerContext();
  const { updateToolbarState } = React.use(ToolbarStateContext);

  const $handleHeadingNode = React.useCallback(
    (selectedElement: LexicalNode) => {
      const type = $isHeadingNode(selectedElement)
        ? selectedElement.getTag()
        : selectedElement.getType();

      if (type in blockTypeToBlockName) {
        updateToolbarState(
          'blockType',
          type as keyof typeof blockTypeToBlockName
        );
      }
    },
    [updateToolbarState]
  );

  const $updateToolbar = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = $findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type);
        } else {
          $handleHeadingNode(element);
        }
      }
    }

    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState('isCode', selection.hasFormat('code'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough')
      );
    }
  }, [updateToolbarState, editor, $handleHeadingNode]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read($updateToolbar);
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState('canUndo', payload);

          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState('canRedo', payload);

          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, updateToolbarState, editor]);
}
