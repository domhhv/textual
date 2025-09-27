'use client';

import type { ChatStatus } from 'ai';
import * as React from 'react';

type ChatStatusContextType = {
  setStatus: React.Dispatch<React.SetStateAction<ChatStatus>>;
  status: ChatStatus;
};

export const ChatStatusContext = React.createContext<ChatStatusContextType>({
  status: 'ready',
  setStatus: () => {},
});

export default function ChatStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = React.useState<ChatStatus>('ready');

  const value = React.useMemo(() => {
    return { setStatus, status };
  }, [status]);

  return (
    <ChatStatusContext.Provider value={value}>
      {children}
    </ChatStatusContext.Provider>
  );
}
