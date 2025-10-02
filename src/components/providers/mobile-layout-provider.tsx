'use client';

import * as React from 'react';

type ViewMode = 'chat' | 'split' | 'editor';

type MobileLayoutContextType = {
  isMobile: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export const MobileLayoutContext = React.createContext<MobileLayoutContextType>(
  {
    isMobile: false,
    viewMode: 'split',
    setViewMode: () => {},
  }
);

const STORAGE_KEY = 'mobile_view_mode_preference';

export function MobileLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [viewMode, setViewModeState] = React.useState<ViewMode>('split');

  React.useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY) as ViewMode | null;

      if (savedMode && ['chat', 'split', 'editor'].includes(savedMode)) {
        setViewModeState(savedMode);
      }
    } catch (error) {
      console.error('Failed to load view mode preference:', error);
    }
  }, []);

  React.useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      return window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const setViewMode = React.useCallback(
    (mode: ViewMode) => {
      setViewModeState(mode);

      if (isMobile) {
        try {
          localStorage.setItem(STORAGE_KEY, mode);
        } catch (error) {
          console.error('Failed to save view mode preference:', error);
        }
      }
    },
    [isMobile]
  );

  const value = React.useMemo(() => {
    return { isMobile, setViewMode, viewMode };
  }, [viewMode, setViewMode, isMobile]);

  return (
    <MobileLayoutContext.Provider value={value}>
      {children}
    </MobileLayoutContext.Provider>
  );
}
