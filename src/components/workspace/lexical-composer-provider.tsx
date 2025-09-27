'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import CONFIG from '@/lib/constants/editor-config';

export default function LexicalComposerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LexicalComposer initialConfig={CONFIG}>{children}</LexicalComposer>;
}
