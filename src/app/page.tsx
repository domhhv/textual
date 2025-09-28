import Chat from '@/components/chat/chat';
import Editor from '@/components/editor/editor';
import ChatStatusProvider from '@/components/providers/chat-status-provider';
import EditorToolbarStateProvider from '@/components/providers/editor-toolbar-state-provider';
import LexicalComposerProvider from '@/components/providers/lexical-composer-provider';
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Home() {
  return (
    <LexicalComposerProvider>
      <ChatStatusProvider>
        <EditorToolbarStateProvider>
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel minSize={10} defaultSize={30}>
              <Chat />
            </ResizablePanel>
            <div className="bg-foreground mx-2">
              <ResizableHandle isWithHandle className="h-full" />
            </div>
            <ResizablePanel minSize={40} defaultSize={70}>
              <Editor />
            </ResizablePanel>
          </ResizablePanelGroup>
        </EditorToolbarStateProvider>
      </ChatStatusProvider>
    </LexicalComposerProvider>
  );
}
