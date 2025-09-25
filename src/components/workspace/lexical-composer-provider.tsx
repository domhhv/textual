'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import { INITIAL_CONFIG } from '@/lib/constants/editor.constants';

export default function LexicalComposerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LexicalComposer initialConfig={INITIAL_CONFIG}>{children}</LexicalComposer>
  );
}
