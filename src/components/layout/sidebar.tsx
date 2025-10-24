'use client';

import {
  useUser,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from '@clerk/nextjs';
import { LogInIcon, PanelLeft, PanelLeftClose } from 'lucide-react';
import * as React from 'react';

import { SidebarContext } from '@/components/providers/sidebar-provider';
import { Button } from '@/components/ui/button';
import cn from '@/lib/utils/cn';

export default function Sidebar() {
  const context = React.use(SidebarContext);
  const { user } = useUser();

  if (!context) {
    throw new Error('Sidebar must be used within SidebarProvider');
  }

  const { closeSidebar, isExpanded, isMobile, toggleSidebar } = context;

  React.useEffect(() => {
    if (!isMobile || !isExpanded) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const sidebar = document.getElementById('sidebar');

      if (sidebar && !sidebar.contains(target)) {
        closeSidebar();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSidebar, isExpanded, isMobile]);

  return (
    <>
      {isMobile && isExpanded && (
        <div className="bg-background/80 fixed inset-0 z-40 backdrop-blur-xs" />
      )}

      <aside
        id="sidebar"
        className={cn(
          'border-border flex h-full flex-col border-r bg-white transition-all duration-30',
          isMobile
            ? cn(
                'fixed top-0 left-0 z-50 h-full w-64',
                isExpanded ? 'translate-x-0' : '-translate-x-full'
              )
            : cn(isExpanded ? 'w-64' : 'w-12')
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <div
            className={cn(
              'border-border flex items-center border-b p-2',
              isExpanded ? 'justify-end' : 'justify-center px-0'
            )}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleSidebar}
              className="flex-shrink-0"
            >
              {isExpanded ? <PanelLeftClose /> : <PanelLeft />}
            </Button>
          </div>

          {isExpanded && (
            <div className="p-4">
              <div className="text-muted-foreground text-sm">
                Chats list coming soon...
              </div>
            </div>
          )}
        </div>

        <div className={cn('border-border', isExpanded && 'p-2')}>
          <SignedOut>
            <div className="flex flex-col gap-2">
              {isExpanded ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="secondary">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Sign Up</Button>
                  </SignUpButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button size="icon" variant="ghost" className="mx-auto mb-1">
                    <LogInIcon className="size-4" />
                  </Button>
                </SignInButton>
              )}
            </div>
          </SignedOut>
          <SignedIn>
            <div
              className={cn(
                'flex items-center gap-3',
                !isExpanded && 'justify-center pb-2'
              )}
            >
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                  },
                }}
              />
              {isExpanded && user && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-foreground truncate text-sm font-medium">
                    {user.fullName}
                  </p>
                  {user.primaryEmailAddress && (
                    <p className="text-muted-foreground truncate text-xs">
                      {user.primaryEmailAddress.emailAddress}
                    </p>
                  )}
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </aside>
    </>
  );
}
