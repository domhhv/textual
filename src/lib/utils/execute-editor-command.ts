import type { LexicalEditor } from 'lexical';
import {
  $getRoot,
  $setSelection,
  $getNodeByKey,
  $createTextNode,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $createRangeSelection,
} from 'lexical';

import type { EditorCommand } from '@/lib/models/editor-commands';
import $getNextEditorState from '@/lib/utils/get-next-editor-state';

type Success = {
  nextEditorMarkdownContent: string;
  nextEditorRootChildren: string;
  status: 'success';
};

type Failure = {
  nextEditorMarkdownContent: string;
  nextEditorRootChildren: string;
  reason: string;
  status: 'failure';
};

export default function executeEditorCommand(
  editor: LexicalEditor,
  command: EditorCommand
): Promise<Success | Failure> {
  console.log('executeEditorCommand', command);

  switch (command.type) {
    case 'insertParagraph':
      return new Promise((resolve) => {
        editor.update(() => {
          const root = $getRoot();
          const paragraphNode = $createParagraphNode();
          paragraphNode.append($createTextNode(command.content));
          const { anchorNodeKey, position } = command.location;
          const anchorNode = $getNodeByKey(anchorNodeKey);

          if (!anchorNode) {
            root.insertAfter(paragraphNode);

            return resolve({
              ...$getNextEditorState(),
              reason: `Anchor node with key ${anchorNodeKey} not found. Inserted at end of document instead.`,
              status: 'failure',
            });
          }

          if (position === 'before') {
            anchorNode.insertBefore(paragraphNode);
          }

          if (position === 'after') {
            anchorNode.insertAfter(paragraphNode);
          }

          resolve({
            ...$getNextEditorState(),
            status: 'success',
          });
        });
      });

    case 'editParagraph':
      return new Promise((resolve) => {
        editor.update(() => {
          const nodeToEdit = $getNodeByKey(command.nodeKey);

          if (!nodeToEdit) {
            return resolve({
              ...$getNextEditorState(),
              reason: `Node with key ${command.nodeKey} not found.`,
              status: 'failure',
            });
          }

          const newParagraphNode = $createParagraphNode();
          newParagraphNode.append($createTextNode(command.newText));
          nodeToEdit.replace(newParagraphNode);
          resolve({
            ...$getNextEditorState(),
            status: 'success',
          });
        });
      });

    case 'formatText':
      return new Promise((resolve) => {
        editor.update(() => {
          const node = $getNodeByKey(command.parentNodeKey);

          const nodeTextContent = node?.getTextContent() ?? '';

          const anchorOffset = nodeTextContent.indexOf(
            command.textPartToSelect
          );
          const focusOffset = anchorOffset + command.textPartToSelect.length;

          const rangeSelection = $createRangeSelection();
          rangeSelection.anchor.set(
            command.parentNodeKey,
            anchorOffset,
            'text'
          );

          rangeSelection.focus.set(command.parentNodeKey, focusOffset, 'text');

          $setSelection(rangeSelection);

          editor.dispatchCommand(FORMAT_TEXT_COMMAND, command.format);

          resolve({
            ...$getNextEditorState(),
            status: 'success',
          });
        });
      });
  }
}
