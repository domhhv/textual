'use client';

import { Edit3, Columns2, MessageSquare } from 'lucide-react';
import * as React from 'react';
import { useSwipeable } from 'react-swipeable';

import { MobileLayoutContext } from '@/components/providers/mobile-layout-provider';
import { Button } from '@/components/ui/button';
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import cn from '@/lib/utils/cn';

interface AdaptiveLayoutProps {
  chat: React.ReactNode;
  editor: React.ReactNode;
}

const VIEW_MODES = ['chat', 'split', 'editor'] as const;
type ViewMode = (typeof VIEW_MODES)[number];

export default function AdaptiveLayout({ chat, editor }: AdaptiveLayoutProps) {
  const { isMobile, setViewMode, viewMode } = React.use(MobileLayoutContext);

  const cycleViewMode = React.useCallback(
    (direction: 'left' | 'right') => {
      const currentIndex = VIEW_MODES.indexOf(viewMode as ViewMode);
      let nextIndex: number;

      if (direction === 'left') {
        nextIndex = (currentIndex + 1) % VIEW_MODES.length;
      } else {
        nextIndex = (currentIndex - 1 + VIEW_MODES.length) % VIEW_MODES.length;
      }

      setViewMode(VIEW_MODES[nextIndex]);
    },
    [viewMode, setViewMode]
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

  if (!isMobile) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
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
    <div className="flex h-screen flex-col" {...swipeHandlers}>
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="flex items-center justify-center gap-1 p-2">
          <Button
            size="sm"
            className="flex-1"
            variant={viewMode === 'chat' ? 'default' : 'outline'}
            onClick={() => {
              return setViewMode('chat');
            }}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button
            size="sm"
            className="flex-1"
            variant={viewMode === 'split' ? 'default' : 'outline'}
            onClick={() => {
              return setViewMode('split');
            }}
          >
            <Columns2 className="mr-2 h-4 w-4" />
            Both
          </Button>
          <Button
            size="sm"
            className="flex-1"
            variant={viewMode === 'editor' ? 'default' : 'outline'}
            onClick={() => {
              return setViewMode('editor');
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Editor
          </Button>
        </div>
      </div>

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

      <SwipeHint />
    </div>
  );
}

function SwipeHint() {
  const [showHint, setShowHint] = React.useState(false);

  React.useEffect(() => {
    const hasSeenHint = localStorage.getItem('has_seen_swipe_hint');

    if (!hasSeenHint) {
      setShowHint(true);
      const timer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('has_seen_swipe_hint', 'true');
      }, 3000);

      return () => {
        return clearTimeout(timer);
      };
    }
  }, []);

  if (!showHint) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
      <div className="animate-in fade-in slide-in-from-bottom-4 bg-foreground/90 text-background rounded-full px-4 py-2 text-xs shadow-lg">
        👉 Swipe left or right to switch views
      </div>
    </div>
  );
}
