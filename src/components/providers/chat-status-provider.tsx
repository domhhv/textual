'use client';

import type { ChatStatus } from 'ai';
import * as React from 'react';

export const ChatStatusContext = React.createContext<{
  setStatus: React.Dispatch<React.SetStateAction<ChatStatus>>;
  status: ChatStatus;
}>({
  status: 'ready',
  setStatus: () => {},
});

export default function ChatStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<ChatStatus>('ready');

  const value = React.useMemo(() => {
    return { setStatus, status };
  }, [status]);

  return <ChatStatusContext.Provider value={value}>{children}</ChatStatusContext.Provider>;
}
