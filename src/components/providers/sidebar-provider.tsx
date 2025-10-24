'use client';

import * as React from 'react';

type SidebarContextType = {
  isExpanded: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContextType | null>(
  null
);

type SidebarProviderProps = {
  children: React.ReactNode;
};

const STORAGE_KEY = 'sidebar-expanded';
const MOBILE_BREAKPOINT = 768;

export default function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
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

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
