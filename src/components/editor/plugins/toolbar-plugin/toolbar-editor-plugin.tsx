import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { REDO_COMMAND, UNDO_COMMAND, FORMAT_TEXT_COMMAND } from 'lexical';
import {
  BoldIcon,
  CodeIcon,
  UndoIcon,
  RedoIcon,
  TypeIcon,
  ItalicIcon,
  UnderlineIcon,
  ChevronDownIcon,
  TextInitialIcon,
  StrikethroughIcon,
} from 'lucide-react';
import * as React from 'react';

import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import EDITOR_SHORTCUTS from '@/lib/constants/editor-shortcuts';
import headings from '@/lib/constants/editor-toolbar-headings';
import useEditorToolbarSync from '@/lib/hooks/use-editor-toolbar-sync';
import useTooltipGroup from '@/lib/hooks/use-tooltip-group';
import { formatHeading, formatParagraph } from '@/lib/utils/editor-formatters';

export default function ToolbarEditorPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = React.use(ToolbarStateContext);
  const tooltipGroup = useTooltipGroup();
  useEditorToolbarSync();

  return (
    <div
      onMouseLeave={tooltipGroup.onGroupMouseLeave}
      className="flex flex-wrap items-center gap-2 p-2 md:flex-nowrap md:overflow-x-auto"
    >
      <div className="[&>*]:rounded-none [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md">
        <TooltipProvider>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant="ghost"
                disabled={!toolbarState.canUndo}
                onClick={() => {
                  editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
              >
                <UndoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.UNDO}
              </div>
              <span className="text-sm">Undo</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant="ghost"
                disabled={!toolbarState.canRedo}
                onClick={() => {
                  editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
              >
                <RedoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.REDO}
              </div>
              <span className="text-sm">Redo</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator
        orientation="vertical"
        className="h-6! self-center justify-self-center"
      />

      <div className="[&>*]:rounded-none [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md">
        <TooltipProvider>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isBold ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
              >
                <BoldIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.BOLD}
              </div>
              <span className="text-sm">Bold</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isItalic ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
              >
                <ItalicIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.ITALIC}
              </div>
              <span className="text-sm">Italic</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isUnderline ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
              >
                <UnderlineIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.UNDERLINE}
              </div>
              <span className="text-sm">Underline</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isStrikethrough ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
              >
                <StrikethroughIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.STRIKETHROUGH}
              </div>
              <span className="text-sm">Strikethrough</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isCode ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }}
              >
                <CodeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2 px-2 py-2 pr-2.5">
              <div className="rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-300 dark:border-slate-700 dark:text-slate-700">
                {EDITOR_SHORTCUTS.CODE_BLOCK}
              </div>
              <span className="text-sm">Code</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-40 justify-between">
          <Button size="sm" variant="outline">
            <TypeIcon className="mr-1 h-4 w-4" />
            {headings.find((h) => {
              return h.value === toolbarState.blockType;
            })?.label || 'Normal text'}
            <ChevronDownIcon className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {headings.map((heading) => {
            return (
              <DropdownMenuItem
                key={heading.value}
                className="flex justify-between gap-4"
                onClick={() => {
                  formatHeading(editor, toolbarState.blockType, heading.value);
                }}
              >
                <div className="flex items-center">
                  <heading.icon className="mr-2 h-4 w-4" />
                  <span>{heading.label}</span>
                </div>
                <span className="text-muted-foreground min-w-14 text-xs">
                  {heading.shortcut}
                </span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between gap-4"
            onClick={() => {
              return formatParagraph(editor);
            }}
          >
            <div className="flex items-center gap-2">
              <TextInitialIcon />
              <span>Normal text</span>
            </div>
            <span className="text-muted-foreground ml-auto text-xs">
              {EDITOR_SHORTCUTS.NORMAL}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
