import { $isListNode } from '@lexical/list';
import { $getRoot, $isElementNode } from 'lexical';

export default function $getEditorRootChildren() {
  return $getRoot()
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
      };
    });
}
