import { LoaderCircleIcon } from 'lucide-react';
import { useLinkStatus } from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { useDocument } from '@/components/providers/document-provider';
import { Button } from '@/components/ui/button';
import type { DocumentItem } from '@/lib/models/document.model';
import cn from '@/lib/utils/cn';

export default function SidebarDocumentLinkButton({ document }: { document: DocumentItem }) {
  const { pending } = useLinkStatus();
  const { activeDropdownDocumentId, documentIdBeingRemoved, documentIdInteractedWith } = useDocument();

  const searchParams = useSearchParams();

  const activeDocumentId = searchParams.get('document');

  return (
    <Button
      tabIndex={-1}
      variant="ghost"
      disabled={documentIdBeingRemoved === document.id || pending}
      className={cn(
        'w-full justify-start overflow-hidden rounded-r-none pr-9 pl-4! transition-colors!',
        (pending || documentIdBeingRemoved === document.id) && 'justify-between pr-0',
        (pending || documentIdInteractedWith === document.id || activeDropdownDocumentId === document.id) &&
          'bg-secondary text-secondary-foreground',
        activeDocumentId === document.id &&
          'bg-primary text-primary-foreground hover:bg-primary pointer-events-none cursor-default'
      )}
    >
      <p className="overflow-hidden text-left text-sm font-medium text-ellipsis">
        {document.title || 'Untitled document'}
      </p>
      {(pending || documentIdBeingRemoved === document.id) && (
        <LoaderCircleIcon className="size-4 min-w-4 animate-spin" />
      )}
    </Button>
  );
}
