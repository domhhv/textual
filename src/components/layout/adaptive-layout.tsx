'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Edit3, Columns2, MessageSquare } from 'lucide-react';
import posthog from 'posthog-js';
import * as React from 'react';
import { useSwipeable } from 'react-swipeable';

import { MobileLayoutContext } from '@/components/providers/mobile-layout-provider';
import { Button } from '@/components/ui/button';
import HelixLoader from '@/components/ui/helix-loader';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import cn from '@/lib/utils/cn';
import { resetEditorSelection } from '@/lib/utils/editor-helpers';

type AdaptiveLayoutProps = {
  chat: React.ReactNode;
  editor: React.ReactNode;
};

const VIEW_MODES = ['chat', 'split', 'editor'] as const;
type ViewMode = (typeof VIEW_MODES)[number];

export default function AdaptiveLayout({ chat, editor }: AdaptiveLayoutProps) {
  const { isMobile, setViewMode, viewMode } = React.use(MobileLayoutContext);
  const [lexicalEditor] = useLexicalComposerContext();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const cycleViewMode = React.useCallback(
    (direction: 'left' | 'right') => {
      resetEditorSelection(lexicalEditor);

      const currentIndex = VIEW_MODES.indexOf(viewMode as ViewMode);
      let nextIndex: number;

      if (direction === 'left') {
        nextIndex = (currentIndex + 1) % VIEW_MODES.length;
      } else {
        nextIndex = (currentIndex - 1 + VIEW_MODES.length) % VIEW_MODES.length;
      }

      posthog.capture('swiped_to_view_mode', { mode: VIEW_MODES[nextIndex] });
      setViewMode(VIEW_MODES[nextIndex]);
    },
    [viewMode, setViewMode, lexicalEditor]
  );

  const swipeHandlers = useSwipeable({
    delta: 50,
    preventScrollOnSwipe: true,
    trackMouse: false,
    onSwipedLeft: () => {
      return isMobile && cycleViewMode('left');
    },
    onSwipedRight: () => {
      return isMobile && cycleViewMode('right');
    },
  });

  if (!isMounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <HelixLoader color="var(--foreground)" />
      </div>
    );
  }

  if (!isMobile) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-full">
        <ResizablePanel minSize={10} defaultSize={30}>
          {chat}
        </ResizablePanel>
        <ResizableHandle isWithHandle />
        <ResizablePanel minSize={40} defaultSize={70}>
          {editor}
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        {viewMode === 'split' ? (
          <ResizablePanelGroup className="h-full" direction="vertical">
            <ResizablePanel minSize={30} defaultSize={50}>
              {chat}
            </ResizablePanel>
            <ResizableHandle isWithHandle />
            <ResizablePanel minSize={30} defaultSize={50}>
              {editor}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <>
            <div
              className={cn(
                'absolute inset-0 transition-transform duration-300 ease-in-out',
                viewMode === 'chat' ? 'translate-y-0' : '-translate-y-full'
              )}
            >
              {chat}
            </div>
            <div
              className={cn(
                'absolute inset-0 transition-transform duration-300 ease-in-out',
                viewMode === 'editor' ? 'translate-y-0' : 'translate-y-full'
              )}
            >
              {editor}
            </div>
          </>
        )}
      </div>

      <div className="space-y-0.5 border-t p-2 text-center">
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur" {...swipeHandlers}>
          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              className={cn(viewMode === 'chat' && 'flex-1')}
              variant={viewMode === 'chat' ? 'default' : 'outline'}
              onClick={() => {
                resetEditorSelection(lexicalEditor);

                posthog.capture('clicked_on_mobile_view_mode', {
                  mode: 'chat',
                });
                setViewMode('chat');
              }}
            >
              <MessageSquare className="h-4 w-4" />
              {viewMode === 'chat' && 'Chat'}
            </Button>
            <Button
              size="sm"
              className={cn(viewMode === 'split' && 'flex-1')}
              variant={viewMode === 'split' ? 'default' : 'outline'}
              onClick={() => {
                resetEditorSelection(lexicalEditor);

                posthog.capture('clicked_on_mobile_view_mode', {
                  mode: 'split',
                });
                setViewMode('split');
              }}
            >
              <Columns2 className="h-4 w-4" />
              {viewMode === 'split' && 'Split'}
            </Button>
            <Button
              size="sm"
              className={cn(viewMode === 'editor' && 'flex-1')}
              variant={viewMode === 'editor' ? 'default' : 'outline'}
              onClick={() => {
                resetEditorSelection(lexicalEditor);

                posthog.capture('clicked_on_mobile_view_mode', {
                  mode: 'editor',
                });
                setViewMode('editor');
              }}
            >
              <Edit3 className="h-4 w-4" />
              {viewMode === 'editor' && 'Editor'}
            </Button>
          </div>
        </div>
        <span className="text-muted-foreground text-xs">Swipe left/right to change view mode</span>
      </div>
    </div>
  );
}
