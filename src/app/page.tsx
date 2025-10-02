import Chat from '@/components/chat/chat';
import Editor from '@/components/editor/editor';
import AdaptiveLayout from '@/components/layout/adaptive-layout';
import ChatStatusProvider from '@/components/providers/chat-status-provider';
import EditorToolbarStateProvider from '@/components/providers/editor-toolbar-state-provider';
import LexicalComposerProvider from '@/components/providers/lexical-composer-provider';
import { MobileLayoutProvider } from '@/components/providers/mobile-layout-provider';

export default function Home() {
  return (
    <LexicalComposerProvider>
      <ChatStatusProvider>
        <EditorToolbarStateProvider>
          <MobileLayoutProvider>
            <AdaptiveLayout chat={<Chat />} editor={<Editor />} />
          </MobileLayoutProvider>
        </EditorToolbarStateProvider>
      </ChatStatusProvider>
    </LexicalComposerProvider>
  );
}
