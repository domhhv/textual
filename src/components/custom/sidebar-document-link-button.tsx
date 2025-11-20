import { TrashIcon, Settings2Icon, LoaderCircleIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useLinkStatus } from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { useDocument } from '@/components/providers/document-provider';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DocumentItem } from '@/lib/models/document.model';
import cn from '@/lib/utils/cn';

export default function SidebarDocumentLinkButton({ document }: { document: DocumentItem }) {
  const { pending } = useLinkStatus();
  const {
    activeDropdownDocumentId,
    documentIdBeingRemoved,
    documentIdInteractedWith,
    handleDropdownOpenChange,
    initiateDocumentRemoval,
    openDocumentDialog,
  } = useDocument();
  const { isMobile } = useSidebar();

  const searchParams = useSearchParams();

  const activeDocumentId = searchParams.get('document');

  return (
    <div className="flex">
      <Button
        tabIndex={-1}
        variant="ghost"
        disabled={documentIdBeingRemoved === document.id || pending}
        className={cn(
          'flex-1 justify-start overflow-hidden rounded-r-none pr-9 pl-4! transition-none hover:bg-transparent dark:hover:bg-transparent',
          pending && 'pending',
          (pending || documentIdBeingRemoved === document.id) && 'justify-between pr-0',
          (pending || documentIdInteractedWith === document.id || activeDropdownDocumentId === document.id) &&
            'bg-secondary hover:bg-secondary dark:hover:bg-secondary text-secondary-foreground',
          activeDocumentId === document.id &&
            'bg-primary text-primary-foreground hover:bg-primary pointer-events-none cursor-default'
        )}
      >
        <p className="overflow-hidden text-left text-sm font-medium text-ellipsis">{document.title || 'Untitled'}</p>
        {(pending || documentIdBeingRemoved === document.id) && (
          <LoaderCircleIcon className="size-4 min-w-4 animate-spin" />
        )}
      </Button>

      <DropdownMenu
        open={activeDropdownDocumentId === document.id}
        onOpenChange={(isOpen) => {
          handleDropdownOpenChange(isOpen, document.id);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={pending || documentIdBeingRemoved === document.id}
            className={cn(
              'focus:bg-accent rounded-l-none opacity-0 transition-none focus:opacity-100 focus:ring-0! focus:outline-none',
              pending && 'cursor-wait',
              (isMobile ||
                pending ||
                activeDropdownDocumentId === document.id ||
                documentIdBeingRemoved === document.id ||
                documentIdInteractedWith === document.id ||
                activeDocumentId === document.id) &&
                'opacity-100',
              (pending || documentIdInteractedWith === document.id || activeDropdownDocumentId === document.id) &&
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
    </div>
  );
}
