import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Chat from '@/components/workspace/chat';
import Editor from '@/components/workspace/editor';
import LexicalComposerProvider from '@/components/workspace/lexical-composer-provider';

export default function Home() {
  return (
    <LexicalComposerProvider>
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
    </LexicalComposerProvider>
  );
}
