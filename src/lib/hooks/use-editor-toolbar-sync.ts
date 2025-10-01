import { $isLinkNode } from '@lexical/link';
import { ListNode, $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import {
  $isAtNodeEnd,
  $getSelectionStyleValueForProperty,
} from '@lexical/selection';
import { $isTableSelection } from '@lexical/table';
import {
  mergeRegister,
  $findMatchingParent,
  $getNearestNodeOfType,
} from '@lexical/utils';
import type {
  TextNode,
  ElementNode,
  LexicalNode,
  RangeSelection,
  ElementFormatType,
} from 'lexical';
import {
  $getSelection,
  $isElementNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import * as React from 'react';

import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import { blockTypeToBlockName } from '@/lib/constants/initial-editor-toolbar-state';

type Alignment = Extract<
  ElementFormatType,
  'left' | 'center' | 'right' | 'justify'
>;

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

export function getSelectedNode(
  selection: RangeSelection
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward = selection.isBackward();

  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
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
    const nativeSelection = window.getSelection();
    const selectedElement = nativeSelection?.focusNode?.parentElement;
    const [selectedNode] = selection?.getNodes() ?? [];

    if (selectedNode && selectedElement) {
      const { fontFamily, fontSize } = window.getComputedStyle(selectedElement);

      updateToolbarState('fontSize', fontSize);

      const defaultFontFamily = $isHeadingNode(
        selectedNode.getTopLevelElement()
      )
        ? 'Ubuntu'
        : 'Montserrat';

      if (fontFamily.includes(defaultFontFamily)) {
        updateToolbarState('fontFamily', defaultFontFamily);
      } else if ($isRangeSelection(selection)) {
        updateToolbarState(
          'fontFamily',
          $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
        );
      }
    }

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = $findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState('isLink', isLink);

      let matchingParent;

      if ($isLinkNode(parent)) {
        matchingParent = $findMatchingParent(node, (parentNode) => {
          return $isElementNode(parentNode) && !parentNode.isInline();
        });
      }

      const elementFormatValue: ElementFormatType = $isElementNode(
        matchingParent
      )
        ? matchingParent.getFormatType()
        : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left';

      updateToolbarState(
        'elementFormat',
        (elementFormatValue === '' ? 'left' : elementFormatValue) as Alignment
      );

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

      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      );
      updateToolbarState(
        'backgroundColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff'
        )
      );
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
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isHighlight', selection.hasFormat('highlight'));
      updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
      updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
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
