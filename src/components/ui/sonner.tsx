'use client';

import { useTheme } from 'next-themes';
import type { ToasterProps } from 'sonner';
import { Toaster as Sonner } from 'sonner';

export default function Toaster(props: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      className="toaster group"
      theme={theme as ToasterProps['theme']}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-border': 'var(--border)',
          '--normal-text': 'var(--popover-foreground)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
