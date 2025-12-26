import { SunIcon, KeyIcon, MoonIcon, PanelLeft, MonitorIcon, ExternalLinkIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import posthog from 'posthog-js';
import * as React from 'react';

import GithubIcon from '@/components/icons/github';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import useIsMobile from '@/lib/hooks/use-is-mobile';
import useTooltipGroup from '@/lib/hooks/use-tooltip-group';
import cn from '@/lib/utils/cn';

export default function ChatHeader() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const tooltipGroup = useTooltipGroup();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border-border flex h-[59px] items-center justify-between border-b p-2 px-4">
        <h3 className="sansation-bold hidden scroll-m-20 truncate text-2xl font-semibold tracking-tight text-slate-600 md:block dark:text-slate-300">
          <span className="border-b border-dashed border-slate-600 dark:border-slate-300">Textual</span> Chat
        </h3>

        <Link target="_blank" rel="noopener noreferrer" href="https://github.com/domhhv/textual">
          <Button size="xs" className="h-8" variant="outline">
            <GithubIcon className="fill-muted-foreground size-4!" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={tooltipGroup.onGroupMouseLeave}
      className="border-border flex items-center gap-2 overflow-x-auto border-b p-2"
    >
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
        <TooltipProvider>
          <div className="flex flex-shrink-0 items-center gap-2">
            <div className="[&>*]:rounded-none [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md">
              <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
                <TooltipTrigger asChild onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}>
                  <Button
                    size="icon"
                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                    onClick={() => {
                      posthog.capture('clicked_on_theme_mode', {
                        mode: 'light',
                      });
                      setTheme('light');
                    }}
                  >
                    <SunIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">Light</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
                <TooltipTrigger asChild onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}>
                  <Button
                    size="icon"
                    variant={theme === 'system' ? 'secondary' : 'ghost'}
                    onClick={() => {
                      posthog.capture('clicked_on_theme_mode', {
                        mode: 'system',
                      });
                      setTheme('system');
                    }}
                  >
                    <MonitorIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">System</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
                <TooltipTrigger asChild onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}>
                  <Button
                    size="icon"
                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                    onClick={() => {
                      posthog.capture('clicked_on_theme_mode', {
                        mode: 'dark',
                      });
                      setTheme('dark');
                    }}
                  >
                    <MoonIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">Dark</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
              <TooltipTrigger asChild onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}>
                <Link target="_blank" rel="noopener noreferrer" href="https://github.com/domhhv/textual">
                  <Button size="xs" variant="outline" className="h-8 w-8">
                    <GithubIcon className="fill-muted-foreground size-4!" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <ExternalLinkIcon className="size-3" />
                  <span>View source code on GitHub</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
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
