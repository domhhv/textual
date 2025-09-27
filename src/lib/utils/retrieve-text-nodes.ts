import { $isListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import type { LexicalEditor } from 'lexical';
import { $getNodeByKey, $isParagraphNode } from 'lexical';

import type { GetAllTextNodesToolOutput } from '@/lib/models/editor-commands';

export default function retrieveTextNodes(
  editor: LexicalEditor,
  nodeKey: string
) {
  return new Promise<GetAllTextNodesToolOutput>((resolve) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);

      if (!node) {
        return resolve({
          reason: `Node with key ${nodeKey} not found.`,
          status: 'failure',
        });
      }

      if (
        !$isParagraphNode(node) &&
        !$isListNode(node) &&
        !$isHeadingNode(node)
      ) {
        return resolve({
          reason: `Node with key ${nodeKey} is not a Paragraph, List, or Heading node.`,
          status: 'failure',
        });
      }

      const textNodes = node.getAllTextNodes();

      const result = textNodes.map((textNode) => {
        return {
          key: textNode.getKey(),
          text: textNode.getTextContent(),
        };
      });

      return resolve(result);
    });
  });
}
