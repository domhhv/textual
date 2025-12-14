import { currentUser } from '@clerk/nextjs/server';

import Chat from '@/components/chat/chat';
import Editor from '@/components/editor/editor';
import AdaptiveLayout from '@/components/layout/adaptive-layout';
import ChatStatusProvider from '@/components/providers/chat-status-provider';
import EditorToolbarStateProvider from '@/components/providers/editor-toolbar-state-provider';
import MobileLayoutProvider from '@/components/providers/mobile-layout-provider';

export default async function Home() {
  const user = await currentUser();
  const hasOpenaiApiKey = Boolean(user?.privateMetadata.openaiApiKey);

  return (
    <ChatStatusProvider>
      <EditorToolbarStateProvider>
        <MobileLayoutProvider>
          <AdaptiveLayout
            editor={<Editor />}
            chat={<Chat isAuthenticated={!!user} hasOpenaiApiKey={hasOpenaiApiKey} />}
          />
        </MobileLayoutProvider>
      </EditorToolbarStateProvider>
    </ChatStatusProvider>
  );
}
