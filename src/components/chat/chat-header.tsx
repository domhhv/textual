'use client';

import { SunIcon, MoonIcon, MonitorIcon, ExternalLinkIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import * as React from 'react';

import ApiKeyManagerButton from '@/components/custom/api-key-manager-button';
import GithubIcon from '@/components/icons/github';
import { ApiKeyContext } from '@/components/providers/api-key-provider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import useTooltipGroup from '@/lib/hooks/use-tooltip-group';

interface ChatHeaderProps {
  onApiKeyEditClick: () => void;
}

export default function ChatHeader({ onApiKeyEditClick }: ChatHeaderProps) {
  const { hasApiKey } = React.use(ApiKeyContext);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const tooltipGroup = useTooltipGroup();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-between gap-2 p-2">
        <div className="h-10 w-32" />
      </div>
    );
  }

  return (
    <div
      onMouseLeave={tooltipGroup.onGroupMouseLeave}
      className="border-border flex items-center gap-2 overflow-x-auto border-b p-2"
    >
      <div className="flex min-w-0 basis-full items-center justify-between gap-2">
        <div className="min-w-0 flex-shrink px-2">
          <h3 className="sansation-bold scroll-m-20 truncate text-2xl font-semibold tracking-tight text-slate-600 dark:text-slate-300">
            <span className="border-b border-dashed border-slate-600 dark:border-slate-300">
              Textual
            </span>{' '}
            Chat
          </h3>
        </div>
        <TooltipProvider>
          <div className="flex flex-shrink-0 items-center gap-2">
            <div className="[&>*]:rounded-none [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md">
              <Tooltip
                delayDuration={tooltipGroup.getTooltipProps().delayDuration}
              >
                <TooltipTrigger
                  asChild
                  onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
                >
                  <Button
                    size="icon"
                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                    onClick={() => {
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
              <Tooltip
                delayDuration={tooltipGroup.getTooltipProps().delayDuration}
              >
                <TooltipTrigger
                  asChild
                  onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
                >
                  <Button
                    size="icon"
                    variant={theme === 'system' ? 'secondary' : 'ghost'}
                    onClick={() => {
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
              <Tooltip
                delayDuration={tooltipGroup.getTooltipProps().delayDuration}
              >
                <TooltipTrigger
                  asChild
                  onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
                >
                  <Button
                    size="icon"
                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                    onClick={() => {
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
            <Tooltip
              delayDuration={tooltipGroup.getTooltipProps().delayDuration}
            >
              <TooltipTrigger
                asChild
                onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
              >
                <Button size="xs" className="h-8" variant="outline">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/domhhv/textual"
                  >
                    <GithubIcon className="fill-muted-foreground size-4!" />
                  </Link>
                </Button>
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

      {hasApiKey && <ApiKeyManagerButton onEditClick={onApiKeyEditClick} />}
    </div>
  );
}
