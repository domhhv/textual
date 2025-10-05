import type { HeadingTagType } from '@lexical/rich-text';
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
} from 'lucide-react';
import type * as React from 'react';

import EDITOR_SHORTCUTS from '@/lib/constants/editor-shortcuts';

const headings: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  shortcut: readonly string[];
  value: HeadingTagType;
}[] = [
  {
    icon: Heading1Icon,
    label: 'Heading 1',
    shortcut: EDITOR_SHORTCUTS.HEADING1,
    value: 'h1',
  },
  {
    icon: Heading2Icon,
    label: 'Heading 2',
    shortcut: EDITOR_SHORTCUTS.HEADING2,
    value: 'h2',
  },
  {
    icon: Heading3Icon,
    label: 'Heading 3',
    shortcut: EDITOR_SHORTCUTS.HEADING3,
    value: 'h3',
  },
  {
    icon: Heading4Icon,
    label: 'Heading 4',
    shortcut: EDITOR_SHORTCUTS.HEADING4,
    value: 'h4',
  },
  {
    icon: Heading5Icon,
    label: 'Heading 5',
    shortcut: EDITOR_SHORTCUTS.HEADING5,
    value: 'h5',
  },
  {
    icon: Heading6Icon,
    label: 'Heading 6',
    shortcut: EDITOR_SHORTCUTS.HEADING6,
    value: 'h6',
  },
];

export default headings;
