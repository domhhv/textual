'use client';

import { ArrowDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import * as React from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';

import { Button } from '@/components/ui/button';
import cn from '@/lib/utils/cn';

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export function Conversation({ className, ...props }: ConversationProps) {
  return (
    <StickToBottom
      role="log"
      resize="smooth"
      initial="smooth"
      className={cn('relative flex-1 overflow-y-hidden', className)}
      {...props}
    />
  );
}

export type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>;

export function ConversationContent({ className, ...props }: ConversationContentProps) {
  return <StickToBottom.Content className={cn('flex flex-col gap-8 p-4', className)} {...props} />;
}

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  description?: string;
  icon?: React.ReactNode;
  title?: string;
};

export function ConversationEmptyState({
  children,
  className,
  description = 'Start a conversation to see messages here',
  icon,
  title = 'No messages yet',
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      className={cn('flex size-full flex-col items-center justify-center gap-3 p-8 text-center', className)}
      {...props}
    >
      {children ?? (
        <>
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export function ConversationScrollButton({ className, ...props }: ConversationScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = React.useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        size="icon"
        type="button"
        variant="outline"
        onClick={handleScrollToBottom}
        className={cn('absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full', className)}
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
}
