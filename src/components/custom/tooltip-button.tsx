import type { Ref, ReactNode, ComponentProps } from 'react';
import * as React from 'react';

import Shortcut from '@/components/custom/shortcut';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type TooltipButtonProps = {
  children: ReactNode;
  delayDuration: number;
  ref?: Ref<HTMLButtonElement>;
  shortcut?: readonly string[];
  tooltip: string;
  onClick: () => void;
  onMouseEnter: () => void;
} & Pick<ComponentProps<typeof Button>, 'variant' | 'size' | 'disabled'>;

export default function TooltipButton({
  children,
  delayDuration,
  disabled = false,
  onClick,
  onMouseEnter,
  ref,
  shortcut,
  size = 'icon',
  tooltip,
  variant = 'ghost',
}: TooltipButtonProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild onMouseEnter={onMouseEnter}>
        <Button ref={ref} size={size} variant={variant} onClick={onClick} disabled={disabled}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2 p-2 pr-2.5">
        {tooltip} <Shortcut keys={shortcut} />
      </TooltipContent>
    </Tooltip>
  );
}
