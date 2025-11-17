'use client';

import * as React from 'react';

import INITIAL_TOOLBAR_STATE from '@/lib/constants/initial-editor-toolbar-state';

type ToolbarState = typeof INITIAL_TOOLBAR_STATE;

export type ToolbarStateKey = keyof typeof INITIAL_TOOLBAR_STATE;

type ToolbarContextShape = {
  toolbarState: ToolbarState;
  updateToolbarState<Key extends ToolbarStateKey>(key: Key, value: ToolbarState[Key]): void;
};

export const ToolbarStateContext = React.createContext<ToolbarContextShape>({
  toolbarState: INITIAL_TOOLBAR_STATE,
  updateToolbarState: () => {},
});

export default function EditorToolbarStateProvider({ children }: { children: React.ReactNode }) {
  const [toolbarState, setToolbarState] = React.useState(INITIAL_TOOLBAR_STATE);

  const updateToolbarState = React.useCallback(<Key extends ToolbarStateKey>(key: Key, value: ToolbarState[Key]) => {
    setToolbarState((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const contextValue = React.useMemo(() => {
    return {
      toolbarState,
      updateToolbarState,
    };
  }, [toolbarState, updateToolbarState]);

  return <ToolbarStateContext.Provider value={contextValue}>{children}</ToolbarStateContext.Provider>;
}
