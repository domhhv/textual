'use client';

import type { UIMessage, FileUIPart } from 'ai';
import { XIcon, PaperclipIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import type { ReactElement, ComponentProps, HTMLAttributes } from 'react';
import * as React from 'react';
import { Streamdown } from 'streamdown';

import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import cn from '@/lib/utils/cn';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      className={cn(
        'group flex w-full max-w-[80%] flex-col gap-2',
        from === 'user' ? 'is-user ml-auto justify-end' : 'is-assistant',
        className
      )}
      {...props}
    />
  );
}

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export function MessageContent({ children, className, ...props }: MessageContentProps) {
  return (
    <div
      className={cn(
        'is-user:dark flex w-fit flex-col gap-2 overflow-hidden text-sm',
        'group-[.is-user]:bg-secondary group-[.is-user]:text-foreground group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:px-4 group-[.is-user]:py-3',
        'group-[.is-assistant]:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type MessageActionsProps = ComponentProps<'div'>;

export function MessageActions({ children, className, ...props }: MessageActionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      {children}
    </div>
  );
}

export type MessageActionProps = ComponentProps<typeof Button> & {
  label?: string;
  tooltip?: string;
};

export function MessageAction({
  children,
  label,
  size = 'icon',
  tooltip,
  variant = 'ghost',
  ...props
}: MessageActionProps) {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

type MessageBranchContextType = {
  branches: ReactElement[];
  currentBranch: number;
  totalBranches: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setBranches: (branches: ReactElement[]) => void;
};

const MessageBranchContext = React.createContext<MessageBranchContextType | null>(null);

function useMessageBranch() {
  const context = React.useContext(MessageBranchContext);

  if (!context) {
    throw new Error('MessageBranch components must be used within MessageBranch');
  }

  return context;
}

export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export function MessageBranch({ className, defaultBranch = 0, onBranchChange, ...props }: MessageBranchProps) {
  const [currentBranch, setCurrentBranch] = React.useState(defaultBranch);
  const [branches, setBranches] = React.useState<ReactElement[]>([]);

  function handleBranchChange(newBranch: number) {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  }

  function goToPrevious() {
    const newBranch = currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  }

  function goToNext() {
    const newBranch = currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  }

  const contextValue: MessageBranchContextType = {
    branches,
    currentBranch,
    goToNext,
    goToPrevious,
    setBranches,
    totalBranches: branches.length,
  };

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div className={cn('grid w-full gap-2 [&>div]:pb-0', className)} {...props} />
    </MessageBranchContext.Provider>
  );
}

export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>;

export function MessageBranchContent({ children, ...props }: MessageBranchContentProps) {
  const { branches, currentBranch, setBranches } = useMessageBranch();
  const childrenArray = React.useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);

  React.useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => {
    return (
      <div
        key={branch.key}
        className={cn('grid gap-2 overflow-hidden [&>div]:pb-0', index === currentBranch ? 'block' : 'hidden')}
        {...props}
      >
        {branch}
      </div>
    );
  });
}

export type MessageBranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export function MessageBranchSelector(props: MessageBranchSelectorProps) {
  const { totalBranches } = useMessageBranch();

  if (totalBranches <= 1) {
    return null;
  }

  return (
    <ButtonGroup
      orientation="horizontal"
      className="[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md"
      {...props}
    />
  );
}

export type MessageBranchPreviousProps = ComponentProps<typeof Button>;

export function MessageBranchPrevious({ children, ...props }: MessageBranchPreviousProps) {
  const { goToPrevious, totalBranches } = useMessageBranch();

  return (
    <Button
      size="icon"
      type="button"
      variant="ghost"
      onClick={goToPrevious}
      aria-label="Previous branch"
      disabled={totalBranches <= 1}
      {...props}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </Button>
  );
}

export type MessageBranchNextProps = ComponentProps<typeof Button>;

export function MessageBranchNext({ children, ...props }: MessageBranchNextProps) {
  const { goToNext, totalBranches } = useMessageBranch();

  return (
    <Button
      size="icon"
      type="button"
      variant="ghost"
      onClick={goToNext}
      aria-label="Next branch"
      disabled={totalBranches <= 1}
      {...props}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </Button>
  );
}

export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>;

export function MessageBranchPage({ className, ...props }: MessageBranchPageProps) {
  const { currentBranch, totalBranches } = useMessageBranch();

  return (
    <ButtonGroupText
      className={cn('text-muted-foreground border-none bg-transparent shadow-none', className)}
      {...props}
    >
      {currentBranch + 1} of {totalBranches}
    </ButtonGroupText>
  );
}

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = React.memo(
  ({ className, ...props }: MessageResponseProps) => {
    return (
      <Streamdown className={cn('size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)} {...props} />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  }
);

MessageResponse.displayName = 'MessageResponse';

export type MessageAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  data: FileUIPart;
  onRemove?: () => void;
};

export function MessageAttachment({ className, data, onRemove, ...props }: MessageAttachmentProps) {
  const filename = data.filename || '';
  const mediaType = data.mediaType?.startsWith('image/') && data.url ? 'image' : 'file';
  const isImage = mediaType === 'image';
  const attachmentLabel = filename || (isImage ? 'Image' : 'Attachment');

  return (
    <div className={cn('group relative size-24 overflow-hidden rounded-lg', className)} {...props}>
      {isImage ? (
        <>
          <Image
            width={100}
            height={100}
            src={data.url}
            alt={filename || 'attachment'}
            className="size-full object-cover"
          />
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              aria-label="Remove attachment"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-background/80 hover:bg-background absolute top-2 right-2 size-6 rounded-full p-0 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 [&>svg]:size-3"
            >
              <XIcon />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-muted text-muted-foreground flex size-full shrink-0 items-center justify-center rounded-lg">
                <PaperclipIcon className="size-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{attachmentLabel}</p>
            </TooltipContent>
          </Tooltip>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              aria-label="Remove attachment"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="hover:bg-accent size-6 shrink-0 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100 [&>svg]:size-3"
            >
              <XIcon />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export type MessageAttachmentsProps = ComponentProps<'div'>;

export function MessageAttachments({ children, className, ...props }: MessageAttachmentsProps) {
  if (!children) {
    return null;
  }

  return (
    <div className={cn('ml-auto flex w-fit flex-wrap items-start gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export type MessageToolbarProps = ComponentProps<'div'>;

export function MessageToolbar({ children, className, ...props }: MessageToolbarProps) {
  return (
    <div className={cn('mt-4 flex w-full items-center justify-between gap-4', className)} {...props}>
      {children}
    </div>
  );
}
