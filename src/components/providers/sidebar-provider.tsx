'use client';

import * as React from 'react';
import type { PropsWithChildren } from 'react';

type SidebarContextType = {
  isExpanded: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

const STORAGE_KEY = 'sidebar-expanded';
const MOBILE_BREAKPOINT = 768;

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
}

export default function SidebarProvider({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    function checkMobile() {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (!mobile) {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored !== null) {
          setIsExpanded(stored === 'true');
        }
      } else {
        setIsExpanded(false);
      }
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      return window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
