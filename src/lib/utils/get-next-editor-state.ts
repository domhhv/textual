import { $isListNode } from '@lexical/list';
import { $convertToMarkdownString } from '@lexical/markdown';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isTableNode } from '@lexical/table';
import { $getRoot, $isElementNode, $isParagraphNode } from 'lexical';

import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';

export default function $getNextEditorState() {
  return {
    nextEditorMarkdownContent: $convertToMarkdownString(ENHANCED_LEXICAL_TRANSFORMERS, undefined, true),
    nextEditorRootChildren: JSON.stringify(
      $getRoot()
        .getChildren()
        .map((n) => {
          return {
            direction: $isElementNode(n) ? n.getDirection() : null,
            formatType: $isElementNode(n) ? n.getFormatType() : null,
            indent: $isElementNode(n) ? n.getIndent() : null,
            isSelected: n.isSelected(),
            listType: $isListNode(n) ? n.getListType() : null,
            nextSiblingNodeKey: n.getNextSibling()?.getKey() ?? null,
            nodeIndexWithinParent: n.getIndexWithinParent(),
            nodeKey: n.getKey(),
            nodeText: n.getTextContent(),
            nodeType: n.getType(),
            parentNodeKey: n.getParent()?.getKey() ?? null,
            prevSiblingNodeKey: n.getPreviousSibling()?.getKey() ?? null,
            style: $isElementNode(n) ? n.getStyle() : null,
            textStyle: $isElementNode(n) ? n.getTextStyle() : null,
            textNodes:
              $isParagraphNode(n) || $isListNode(n) || $isHeadingNode(n) || $isTableNode(n)
                ? n.getAllTextNodes().map((textNode) => {
                    return {
                      key: textNode.getKey(),
                      text: textNode.getTextContent(),
                    };
                  })
                : null,
          };
        })
    ),
  };
}
