'use client';

import { useUser, SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LogInIcon,
  TrashIcon,
  Settings2Icon,
  FilePlusCornerIcon,
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  EllipsisVerticalIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import * as React from 'react';

import SidebarDocumentLinkButton from '@/components/custom/sidebar-document-link-button';
import { useDocument } from '@/components/providers/document-provider';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import editorSampleContent from '@/lib/constants/editor-sample-content';
import ENHANCED_LEXICAL_TRANSFORMERS from '@/lib/constants/enhanced-lexical-transformers';
import type { DocumentItem } from '@/lib/models/document.model';
import cn from '@/lib/utils/cn';

type SidebarProps = {
  documents: DocumentItem[];
  isAuthenticated: boolean;
};

export default function Sidebar({ documents, isAuthenticated }: SidebarProps) {
  const { user } = useUser();
  const [editor] = useLexicalComposerContext();
  const { closeSidebar, isExpanded, isMobile, toggleSidebar } = useSidebar();
  const {
    activeDropdownDocumentId,
    documentIdBeingRemoved,
    documentIdInteractedWith,
    handleDropdownOpenChange,
    initiateDocumentRemoval,
    openDocumentDialog,
    setDocumentIdInteractedWith,
  } = useDocument();
  const searchParams = useSearchParams();

  const activeDocumentId = React.useMemo(() => {
    return searchParams.get('document');
  }, [searchParams]);

  function fillSampleContent() {
    posthog.capture('fill_sample_content');
    editor.update(() => {
      $convertFromMarkdownString(editorSampleContent, ENHANCED_LEXICAL_TRANSFORMERS, undefined, true);
    });
  }

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
      {isMobile && isExpanded && <div className="bg-background/80 fixed inset-0 z-40 backdrop-blur-xs" />}

      <aside
        id="sidebar"
        className={cn(
          'border-border bg-background flex h-full flex-col border-r transition-all duration-30',
          !isAuthenticated && 'justify-between',
          isMobile
            ? cn('fixed top-0 left-0 z-50 h-full w-72', isExpanded ? 'translate-x-0' : '-translate-x-full')
            : cn(isExpanded ? 'w-72' : 'w-12')
        )}
      >
        <div>
          <div className="border-border flex items-center border-b px-1.5 py-2 transition-all">
            <Button size="icon" variant="ghost" onClick={toggleSidebar} className="flex-shrink-0">
              {isExpanded ? <PanelLeftCloseIcon /> : <PanelRightCloseIcon />}
            </Button>
          </div>
          {!isAuthenticated && isExpanded && (
            <div className="p-4 pt-0">
              <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={fillSampleContent}>
                Try Sample Content
              </Button>
            </div>
          )}
        </div>

        {isAuthenticated && !isExpanded && (
          <div className="mt-2 flex-1 text-center">
            <Button size="icon" variant="ghost" onClick={openDocumentDialog}>
              <FilePlusCornerIcon />
            </Button>
          </div>
        )}

        {isAuthenticated && isExpanded && (
          <>
            <div className="p-4 pb-0">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Your documents</h3>
              {documents.length === 0 && <p className="text-muted-foreground mt-2 text-sm">Nothing here yet</p>}
              <Button size="lg" className="mt-3 w-full" onClick={openDocumentDialog}>
                New Document
              </Button>
              <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={fillSampleContent}>
                Try Sample Content
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pt-0">
              {documents.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {documents.map((document) => {
                    return (
                      <li
                        key={document.id}
                        className="relative flex items-center rounded-md py-2"
                        onMouseLeave={() => {
                          setDocumentIdInteractedWith('');
                        }}
                        onMouseEnter={() => {
                          setDocumentIdInteractedWith(document.id);
                        }}
                      >
                        <Link
                          prefetch={false}
                          href={{ pathname: '/', query: { document: document.id } }}
                          className={cn(
                            'focus:ring-accent flex-1 overflow-hidden focus:ring-2 focus:ring-offset-2',
                            documentIdBeingRemoved === document.id && 'cursor-wait',
                            activeDocumentId === document.id && 'pointer-events-none cursor-default'
                          )}
                        >
                          <SidebarDocumentLinkButton document={document} />
                        </Link>
                        <DropdownMenu
                          open={activeDropdownDocumentId === document.id}
                          onOpenChange={(isOpen) => {
                            handleDropdownOpenChange(isOpen, document.id);
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              disabled={documentIdBeingRemoved === document.id}
                              className={cn(
                                'rounded-l-none opacity-0',
                                (activeDropdownDocumentId === document.id ||
                                  documentIdBeingRemoved === document.id ||
                                  activeDropdownDocumentId === document.id ||
                                  documentIdInteractedWith === document.id ||
                                  activeDocumentId === document.id) &&
                                  'opacity-100',
                                (documentIdInteractedWith === document.id ||
                                  activeDropdownDocumentId === document.id) &&
                                  'bg-secondary text-secondary-foreground',
                                activeDocumentId === document.id &&
                                  'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground dark:hover:bg-primary/80'
                              )}
                            >
                              <EllipsisVerticalIcon className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" sideOffset={16}>
                            <DropdownMenuItem className="space-x-2" onClick={openDocumentDialog}>
                              <Settings2Icon />
                              Edit details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              className="space-x-2"
                              onClick={() => {
                                void initiateDocumentRemoval(document.id);
                              }}
                            >
                              <TrashIcon />
                              Remove document
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}

        <div className={cn('border-border pt-2', isExpanded && 'border-t p-2')}>
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
            <div className={cn('flex items-center gap-3', !isExpanded && 'justify-center pb-2')}>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                  },
                }}
              />
              {isExpanded && user && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-foreground truncate text-sm font-medium">{user.fullName}</p>
                  {user.primaryEmailAddress && (
                    <p className="text-muted-foreground truncate text-xs">{user.primaryEmailAddress.emailAddress}</p>
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
