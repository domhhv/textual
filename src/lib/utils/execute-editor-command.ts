import { $convertToMarkdownString } from '@lexical/markdown';
import type { LexicalEditor } from 'lexical';
import {
  $getRoot,
  $getNodeByKey,
  $createTextNode,
  $createParagraphNode,
} from 'lexical';

import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';
import type { EditorCommand } from '@/lib/models/editor-commands';
import $getEditorRootChildren from '@/lib/utils/get-editor-root-children';

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
  switch (command.type) {
    case 'insertParagraph':
      return new Promise<Success | Failure>((resolve) => {
        editor.update(() => {
          const root = $getRoot();
          const paragraphNode = $createParagraphNode();
          paragraphNode.append($createTextNode(command.content));
          const { anchorNodeKey, position } = command.location;
          const anchorNode = $getNodeByKey(anchorNodeKey);

          if (!anchorNode) {
            root.insertAfter(paragraphNode);

            return resolve({
              nextEditorRootChildren: JSON.stringify($getEditorRootChildren()),
              reason: `Anchor node with key ${anchorNodeKey} not found. Inserted at end of document instead.`,
              status: 'failure',
              nextEditorMarkdownContent: $convertToMarkdownString(
                ENHANCED_LEXICAL_TRANSFORMERS,
                undefined,
                true
              ),
            });
          }

          if (position === 'before') {
            anchorNode.insertBefore(paragraphNode);
          }

          if (position === 'after') {
            anchorNode.insertAfter(paragraphNode);
          }

          resolve({
            nextEditorRootChildren: JSON.stringify($getEditorRootChildren()),
            status: 'success',
            nextEditorMarkdownContent: $convertToMarkdownString(
              ENHANCED_LEXICAL_TRANSFORMERS,
              undefined,
              true
            ),
          });
        });
      });

    case 'editParagraph':
      return new Promise<Success | Failure>((resolve) => {
        editor.update(() => {
          const nodeToEdit = $getNodeByKey(command.nodeKey);

          if (!nodeToEdit) {
            return resolve({
              nextEditorRootChildren: JSON.stringify($getEditorRootChildren()),
              reason: `Node with key ${command.nodeKey} not found.`,
              status: 'failure',
              nextEditorMarkdownContent: $convertToMarkdownString(
                ENHANCED_LEXICAL_TRANSFORMERS,
                undefined,
                true
              ),
            });
          }

          const newParagraphNode = $createParagraphNode();
          newParagraphNode.append($createTextNode(command.newText));
          nodeToEdit.replace(newParagraphNode);
          resolve({
            nextEditorRootChildren: JSON.stringify($getEditorRootChildren()),
            status: 'success',
            nextEditorMarkdownContent: $convertToMarkdownString(
              ENHANCED_LEXICAL_TRANSFORMERS,
              undefined,
              true
            ),
          });
        });
      });
  }
}
