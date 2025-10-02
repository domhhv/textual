'use client';

import { $isLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, $findMatchingParent } from '@lexical/utils';
import {
  $getSelection,
  CLICK_COMMAND,
  $isLineBreakNode,
  $isRangeSelection,
  KEY_ESCAPE_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_HIGH,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import { createPortal } from 'react-dom';

import FloatingLinkEditor from '@/components/editor/floating-link-editor';
import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import setFloatingElemPosition from '@/lib/utils/set-floating-elem-position';

function getSelectedNode(selection: ReturnType<typeof $getSelection>) {
  if (!$isRangeSelection(selection)) {
    return null;
  }

  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward = selection.isBackward();

  if (isBackward) {
    return $isLineBreakNode(focusNode) ? anchorNode : focusNode;
  } else {
    return $isLineBreakNode(anchorNode) ? focusNode : anchorNode;
  }
}

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}) {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = React.use(ToolbarStateContext);
  const [isLink, setIsLink] = React.useState(false);

  React.useEffect(() => {
    function $updateLinkEditor() {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);

        if (!node) {
          setIsLink(false);

          return;
        }

        const linkParent = $findMatchingParent(node, $isLinkNode);

        if ($isLinkNode(linkParent)) {
          setIsLink(true);
        } else if ($isLinkNode(node)) {
          setIsLink(true);
        } else {
          setIsLink(false);
        }
      } else {
        setIsLink(false);
      }
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor();

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);

            if (!node) {
              return false;
            }

            const linkNode = $findMatchingParent(node, $isLinkNode);

            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');

              return true;
            }
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              const node = getSelectedNode(selection);

              if (node) {
                const linkNode = $findMatchingParent(node, $isLinkNode);

                if ($isLinkNode(linkNode)) {
                  selection.removeText();

                  return true;
                }
              }
            }
          }

          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, isLink]);

  React.useEffect(() => {
    function updateFloatingLinkEditor() {
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        !isLink ||
        !nativeSelection ||
        nativeSelection.rangeCount === 0 ||
        !rootElement ||
        !rootElement.contains(nativeSelection.anchorNode)
      ) {
        const floatingElem = document.querySelector(
          '[data-floating-link-editor]'
        ) as HTMLElement;

        if (floatingElem) {
          floatingElem.style.opacity = '0';
          floatingElem.style.transform = 'translate(-10000px, -10000px)';
        }

        return;
      }

      const rangeRect = nativeSelection.getRangeAt(0).getBoundingClientRect();
      const floatingElem = document.querySelector(
        '[data-floating-link-editor]'
      ) as HTMLElement;

      if (floatingElem) {
        setFloatingElemPosition(rangeRect, floatingElem, anchorElem, -24, 36);
      }
    }

    updateFloatingLinkEditor();

    const scrollerElem = anchorElem.parentElement;

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', updateFloatingLinkEditor);

      return () => {
        scrollerElem.removeEventListener('scroll', updateFloatingLinkEditor);
      };
    }
  }, [anchorElem, editor, isLink, toolbarState.linkUrl]);

  return createPortal(
    <div data-floating-link-editor className="absolute top-0 left-0">
      <FloatingLinkEditor
        editor={editor}
        isLink={isLink}
        anchorElem={anchorElem}
        linkUrl={toolbarState.linkUrl}
      />
    </div>,
    anchorElem
  );
}
