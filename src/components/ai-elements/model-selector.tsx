import Image from 'next/image';
import type { ReactNode, ComponentProps } from 'react';

import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandDialog,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command';
import { Dialog, DialogTitle, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import cn from '@/lib/utils/cn';

export type ModelSelectorProps = ComponentProps<typeof Dialog>;

export function ModelSelector(props: ModelSelectorProps) {
  return <Dialog {...props} />;
}

export type ModelSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export function ModelSelectorTrigger(props: ModelSelectorTriggerProps) {
  return <DialogTrigger {...props} />;
}

export type ModelSelectorContentProps = ComponentProps<typeof DialogContent> & {
  title?: ReactNode;
};

export function ModelSelectorContent({
  children,
  className,
  title = 'Model Selector',
  ...props
}: ModelSelectorContentProps) {
  return (
    <DialogContent className={cn('p-0', className)} {...props}>
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <Command className="**:data-[slot=command-input-wrapper]:h-auto">{children}</Command>
    </DialogContent>
  );
}

export type ModelSelectorDialogProps = ComponentProps<typeof CommandDialog>;

export function ModelSelectorDialog(props: ModelSelectorDialogProps) {
  return <CommandDialog {...props} />;
}

export type ModelSelectorInputProps = ComponentProps<typeof CommandInput>;

export function ModelSelectorInput({ className, ...props }: ModelSelectorInputProps) {
  return <CommandInput className={cn('h-auto py-3.5', className)} {...props} />;
}

export type ModelSelectorListProps = ComponentProps<typeof CommandList>;

export function ModelSelectorList(props: ModelSelectorListProps) {
  return <CommandList {...props} />;
}

export type ModelSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export function ModelSelectorEmpty(props: ModelSelectorEmptyProps) {
  return <CommandEmpty {...props} />;
}

export type ModelSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export function ModelSelectorGroup(props: ModelSelectorGroupProps) {
  return <CommandGroup {...props} />;
}

export type ModelSelectorItemProps = ComponentProps<typeof CommandItem>;

export function ModelSelectorItem(props: ModelSelectorItemProps) {
  return <CommandItem {...props} />;
}

export type ModelSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export function ModelSelectorShortcut(props: ModelSelectorShortcutProps) {
  return <CommandShortcut {...props} />;
}

export type ModelSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>;

export function ModelSelectorSeparator(props: ModelSelectorSeparatorProps) {
  return <CommandSeparator {...props} />;
}

export type ModelSelectorLogoProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
  provider:
    | 'moonshotai-cn'
    | 'lucidquery'
    | 'moonshotai'
    | 'zai-coding-plan'
    | 'alibaba'
    | 'xai'
    | 'vultr'
    | 'nvidia'
    | 'upstage'
    | 'groq'
    | 'github-copilot'
    | 'mistral'
    | 'vercel'
    | 'nebius'
    | 'deepseek'
    | 'alibaba-cn'
    | 'google-vertex-anthropic'
    | 'venice'
    | 'chutes'
    | 'cortecs'
    | 'github-models'
    | 'togetherai'
    | 'azure'
    | 'baseten'
    | 'huggingface'
    | 'opencode'
    | 'fastrouter'
    | 'google'
    | 'google-vertex'
    | 'cloudflare-workers-ai'
    | 'inception'
    | 'wandb'
    | 'openai'
    | 'zhipuai-coding-plan'
    | 'perplexity'
    | 'openrouter'
    | 'zenmux'
    | 'v0'
    | 'iflowcn'
    | 'synthetic'
    | 'deepinfra'
    | 'zhipuai'
    | 'submodel'
    | 'zai'
    | 'inference'
    | 'requesty'
    | 'morph'
    | 'lmstudio'
    | 'anthropic'
    | 'aihubmix'
    | 'fireworks-ai'
    | 'modelscope'
    | 'llama'
    | 'scaleway'
    | 'amazon-bedrock'
    | 'cerebras'
    | (string & {});
};

export function ModelSelectorLogo({ className, provider, ...props }: ModelSelectorLogoProps) {
  return (
    <Image
      {...props}
      width={12}
      height={12}
      alt={`${provider} logo`}
      className={cn('size-3 dark:invert', className)}
      src={`https://models.dev/logos/${provider}.svg`}
    />
  );
}

export type ModelSelectorLogoGroupProps = ComponentProps<'div'>;

export function ModelSelectorLogoGroup({ className, ...props }: ModelSelectorLogoGroupProps) {
  return (
    <div
      className={cn(
        '[&>img]:bg-background dark:[&>img]:bg-foreground flex shrink-0 items-center -space-x-1 [&>img]:rounded-full [&>img]:p-px [&>img]:ring-1',
        className
      )}
      {...props}
    />
  );
}

export type ModelSelectorNameProps = ComponentProps<'span'>;

export function ModelSelectorName({ className, ...props }: ModelSelectorNameProps) {
  return <span className={cn('flex-1 truncate text-left', className)} {...props} />;
}
