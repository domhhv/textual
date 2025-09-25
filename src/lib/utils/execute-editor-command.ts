import type { LexicalEditor } from 'lexical';
import {
  $getRoot,
  $getNodeByKey,
  $createTextNode,
  $createParagraphNode,
} from 'lexical';

import type { EditorCommand } from '@/lib/models/editor-commands';

export default function executeEditorCommand(
  editor: LexicalEditor,
  command: EditorCommand
) {
  switch (command.type) {
    case 'insertParagraph':
      return editor.update(() => {
        const paragraphNode = $createParagraphNode();
        paragraphNode.append($createTextNode(command.content));

        const { anchorNodeKey, position } = command.location;

        const anchorNode = $getNodeByKey(anchorNodeKey);

        if (!anchorNode) {
          return $getRoot().insertAfter(paragraphNode);
        }

        if (position === 'before') {
          return anchorNode.insertBefore(paragraphNode);
        }

        return anchorNode.insertAfter(paragraphNode);
      });

    case 'editParagraph':
      return editor.update(() => {
        const nodeToEdit = $getNodeByKey(command.nodeKey);

        if (!nodeToEdit) {
          return;
        }

        const newParagraphNode = $createParagraphNode();
        newParagraphNode.append($createTextNode(command.newText));
        nodeToEdit.replace(newParagraphNode);
      });
  }
}
