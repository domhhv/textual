import { ListIcon, ListChecksIcon, ListOrderedIcon } from 'lucide-react';
import type * as React from 'react';

import EDITOR_SHORTCUTS from '@/lib/constants/editor-shortcuts';

const lists: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  shortcut: string;
  value: 'bullet' | 'number' | 'check';
}[] = [
  {
    icon: ListIcon,
    label: 'Bullet list',
    shortcut: EDITOR_SHORTCUTS.BULLET_LIST,
    value: 'bullet',
  },
  {
    icon: ListOrderedIcon,
    label: 'Numbered list',
    shortcut: EDITOR_SHORTCUTS.NUMBERED_LIST,
    value: 'number',
  },
  {
    icon: ListChecksIcon,
    label: 'Check list',
    shortcut: EDITOR_SHORTCUTS.CHECK_LIST,
    value: 'check',
  },
];

export default lists;
