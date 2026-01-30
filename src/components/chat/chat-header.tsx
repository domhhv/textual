import { KeyIcon, PanelLeft } from 'lucide-react';
import Link from 'next/link';

import { useSidebar } from '@/components/providers/sidebar-provider';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/lib/hooks/use-is-mobile';
import cn from '@/lib/utils/cn';

export default function ChatHeader() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="border-border flex items-center gap-2 overflow-x-auto border-b p-2">
      <div className="flex min-w-0 basis-full items-center justify-between gap-2">
        <div className={cn('flex min-w-0 flex-shrink items-center gap-2', !isMobile && 'px-2')}>
          {isMobile && (
            <Button size="icon" variant="ghost" onClick={toggleSidebar} className="h-8 w-8 flex-shrink-0">
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className="sansation-bold hidden scroll-m-20 truncate text-2xl font-semibold tracking-tight text-slate-600 md:block dark:text-slate-300">
            <span className="border-b border-dashed border-slate-600 dark:border-slate-300">Textual</span> Chat
          </h3>
        </div>
      </div>

      <Link href="/account/api-keys">
        <Button
          size="sm"
          variant="outline"
          title="Manage API Key"
          className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
        >
          <KeyIcon className="size-3.5" />
        </Button>
      </Link>
    </div>
  );
}
