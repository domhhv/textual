'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import INITIAL_EDITOR_CONFIG from '@/lib/constants/initial-editor-config';

export default function LexicalComposerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LexicalComposer initialConfig={INITIAL_EDITOR_CONFIG}>
      {children}
    </LexicalComposer>
  );
}
