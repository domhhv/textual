'use client';

import * as React from 'react';
import type { PropsWithChildren } from 'react';

import useIsMobile from '@/lib/hooks/use-is-mobile';

type SidebarContextType = {
  isExpanded: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

const STORAGE_KEY = 'sidebar-expanded';

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
}

export default function SidebarProvider({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!isMobile) {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored !== null) {
        setIsExpanded(stored === 'true');
      }
    } else {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const toggleSidebar = React.useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;

      if (!isMobile) {
        localStorage.setItem(STORAGE_KEY, String(next));
      }

      return next;
    });
  }, [isMobile]);

  const closeSidebar = React.useCallback(() => {
    setIsExpanded(false);

    if (!isMobile) {
      localStorage.setItem(STORAGE_KEY, 'false');
    }
  }, [isMobile]);

  const value = React.useMemo(() => {
    return {
      closeSidebar,
      isExpanded,
      isMobile,
      toggleSidebar,
    };
  }, [isExpanded, toggleSidebar, closeSidebar, isMobile]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
